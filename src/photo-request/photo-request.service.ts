import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreatePhotoRequestDto } from './dto/create-photo-request.dto';
import { UpdatePhotoRequestDto } from './dto/update-photo-request.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PhotoRequestStatus } from '@prisma/client';
import { RespondPhotoRequestDto } from './dto/respond-photo-request.dto';

@Injectable()
export class PhotoRequestService {
  private readonly logger = new Logger(PhotoRequestService.name);
  private readonly MONTHS_TO_WAIT = 3;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Valida si el estudiante puede solicitar cambio de foto (3 meses desde última actualización)
   * @param student_id ID del estudiante
   * @returns true si puede solicitar, false si debe esperar
   */
  async canRequestPhotoUpdate(student_id: string): Promise<{
    canRequest: boolean;
    lastUpdateDate: Date | null;
    nextAvailableDate: Date | null;
    daysRemaining: number | null;
  }> {
    try {
      // Buscar el estudiante
      const student = await this.prisma.student.findUnique({
        where: { student_id },
        select: {
          student_id: true,
          updated_at: true,
          created_at: true,
        },
      });

      if (!student) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      // Fecha de referencia: última actualización o creación
      const lastUpdateDate = student.updated_at || student.created_at;
      const now = new Date();

      // Calcular fecha mínima para próxima solicitud (3 meses después)
      const nextAvailableDate = new Date(lastUpdateDate);
      nextAvailableDate.setMonth(
        nextAvailableDate.getMonth() + this.MONTHS_TO_WAIT,
      );

      // Calcular si puede solicitar
      const canRequest = now >= nextAvailableDate;

      // Calcular días restantes
      const daysRemaining = canRequest
        ? 0
        : Math.ceil(
            (nextAvailableDate.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24),
          );

      return {
        canRequest,
        lastUpdateDate,
        nextAvailableDate: canRequest ? null : nextAvailableDate,
        daysRemaining: canRequest ? null : daysRemaining,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error al validar elegibilidad de solicitud', error);
      throw new InternalServerErrorException('Error al validar elegibilidad');
    }
  }

  /**
   * Crea una solicitud de actualización de foto
   * @param createPhotoRequestDto Datos de la solicitud
   * @returns Solicitud creada
   */
  async create(createPhotoRequestDto: CreatePhotoRequestDto) {
    try {
      const { student_id, new_photo_url } = createPhotoRequestDto;

      // 1. Verificar que el estudiante existe
      const student = await this.prisma.student.findUnique({
        where: { student_id },
      });

      if (!student) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      // 2. Validar elegibilidad (3 meses)
      const eligibility = await this.canRequestPhotoUpdate(student_id);

      if (!eligibility.canRequest) {
        throw new BadRequestException(
          `Debe esperar ${eligibility.daysRemaining} días más para solicitar cambio de foto. ` +
            `Próxima fecha disponible: ${eligibility.nextAvailableDate?.toLocaleDateString('es-CO')}`,
        );
      }

      // 3. Verificar que no tenga solicitud pendiente
      const pendingRequest = await this.prisma.photoRequest.findFirst({
        where: {
          student_id,
          status: PhotoRequestStatus.PENDIENTE,
        },
      });

      if (pendingRequest) {
        throw new ConflictException(
          'Ya tienes una solicitud de cambio de foto pendiente. ' +
            'Espera a que sea revisada antes de crear una nueva.',
        );
      }

      // 4. Crear la solicitud
      const photoRequest = await this.prisma.photoRequest.create({
        data: {
          student_id,
          new_photo_url,
          status: PhotoRequestStatus.PENDIENTE,
        },
        include: {
          student: {
            select: {
              student_id: true,
              name: true,
              last_name: true,
              email: true,
              student_code: true,
              card_photo_key: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Solicitud de cambio de foto creada exitosamente',
        request: photoRequest,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error('Error al crear solicitud de foto', error);
      throw new InternalServerErrorException('Error al crear la solicitud');
    }
  }

  /**
   * Obtiene todas las solicitudes pendientes (para admin)
   * @returns Lista de solicitudes pendientes
   */
  async findAllPending() {
    try {
      const requests = await this.prisma.photoRequest.findMany({
        where: {
          status: PhotoRequestStatus.PENDIENTE,
        },
        include: {
          student: {
            select: {
              student_id: true,
              name: true,
              last_name: true,
              email: true,
              student_code: true,
              card_photo_key: true,
              career: true,
              student_type: true,
            },
          },
        },
        orderBy: {
          application_date: 'asc', // Más antiguas primero
        },
      });

      return {
        total: requests.length,
        requests,
      };
    } catch (error) {
      this.logger.error('Error al obtener solicitudes pendientes', error);
      throw new InternalServerErrorException('Error al obtener solicitudes');
    }
  }

  /**
   * Obtiene todas las solicitudes de un estudiante
   * @param student_id ID del estudiante
   * @returns Historial de solicitudes del estudiante
   */
  async findByStudent(student_id: string) {
    try {
      const requests = await this.prisma.photoRequest.findMany({
        where: { student_id },
        include: {
          admin: {
            select: {
              admin_id: true,
              name: true,
              last_name: true,
              role: true,
            },
          },
        },
        orderBy: {
          application_date: 'desc',
        },
      });

      return {
        total: requests.length,
        requests,
      };
    } catch (error) {
      this.logger.error('Error al obtener solicitudes del estudiante', error);
      throw new InternalServerErrorException('Error al obtener solicitudes');
    }
  }

  /**
   * Obtiene una solicitud específica
   * @param request_id ID de la solicitud
   * @returns Detalles de la solicitud
   */
  async findOne(request_id: string) {
    try {
      const request = await this.prisma.photoRequest.findUnique({
        where: { request_id },
        include: {
          student: {
            select: {
              student_id: true,
              name: true,
              last_name: true,
              email: true,
              student_code: true,
              card_photo_key: true,
              career: true,
            },
          },
          admin: {
            select: {
              admin_id: true,
              name: true,
              last_name: true,
              role: true,
            },
          },
        },
      });

      if (!request) {
        throw new NotFoundException('Solicitud no encontrada');
      }

      return request;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error al obtener solicitud', error);
      throw new InternalServerErrorException('Error al obtener la solicitud');
    }
  }

  /**
   * Admin responde a una solicitud de foto (aprueba o rechaza)
   * @param respondDto Datos de la respuesta
   * @returns Solicitud actualizada
   */
  async respondToRequest(respondDto: RespondPhotoRequestDto) {
    try {
      const { request_id, admin_id, status } = respondDto;

      // 1. Verificar que el admin existe
      const admin = await this.prisma.adminUser.findUnique({
        where: { admin_id },
      });

      if (!admin) {
        throw new NotFoundException('Administrador no encontrado');
      }

      // 2. Buscar la solicitud
      const request = await this.prisma.photoRequest.findUnique({
        where: { request_id },
        include: { student: true },
      });

      if (!request) {
        throw new NotFoundException('Solicitud no encontrada');
      }

      // 3. Validar que esté pendiente
      if (request.status !== PhotoRequestStatus.PENDIENTE) {
        throw new BadRequestException(
          `Esta solicitud ya fue ${request.status.toLowerCase()} anteriormente`,
        );
      }

      const newStatus =
        status === 'APROBADO'
          ? PhotoRequestStatus.APROBADO
          : PhotoRequestStatus.RECHAZADO;

      // 4. Actualizar en transacción
      const result = await this.prisma.$transaction(async (prisma) => {
        // 4.1 Actualizar la solicitud
        const updatedRequest = await prisma.photoRequest.update({
          where: { request_id },
          data: {
            status: newStatus,
            admin_id,
            response_date: new Date(),
          },
          include: {
            student: true,
            admin: true,
          },
        });

        // 4.2 Si fue APROBADO, actualizar la foto del estudiante
        if (status === 'APROBADO' && request.new_photo_url) {
          await prisma.student.update({
            where: { student_id: request.student_id },
            data: {
              card_photo_key: request.new_photo_url,
              updated_at: new Date(),
            },
          });
        }

        return updatedRequest;
      });

      return {
        success: true,
        message:
          status === 'APROBADO'
            ? 'Solicitud aprobada. La foto del estudiante ha sido actualizada.'
            : 'Solicitud rechazada. La foto del estudiante permanece sin cambios.',
        request: result,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error('Error al responder solicitud', error);
      throw new InternalServerErrorException('Error al procesar la respuesta');
    }
  }

  /**
   * Obtiene todas las solicitudes aprobadas (para reportes/auditoría)
   * @returns Lista de solicitudes aprobadas
   */
  async findAllApproved() {
    try {
      const requests = await this.prisma.photoRequest.findMany({
        where: {
          status: PhotoRequestStatus.APROBADO,
        },
        include: {
          student: {
            select: {
              student_id: true,
              name: true,
              last_name: true,
              email: true,
              student_code: true,
              card_photo_key: true,
              career: true,
              student_type: true,
            },
          },
          admin: {
            select: {
              admin_id: true,
              name: true,
              last_name: true,
              role: true,
              email: true,
            },
          },
        },
        orderBy: {
          response_date: 'desc', // Más recientes primero
        },
      });

      return {
        total: requests.length,
        requests,
      };
    } catch (error) {
      this.logger.error('Error al obtener solicitudes aprobadas', error);
      throw new InternalServerErrorException(
        'Error al obtener solicitudes aprobadas',
      );
    }
  }

  /**
   * Obtiene todas las solicitudes respondidas por un admin específico (auditoría)
   * @param admin_id ID del administrador
   * @returns Historial de solicitudes respondidas por el admin
   */
  async findByAdmin(admin_id: string) {
    try {
      // Verificar que el admin existe
      const admin = await this.prisma.adminUser.findUnique({
        where: { admin_id },
        select: {
          admin_id: true,
          name: true,
          last_name: true,
          role: true,
          email: true,
        },
      });

      if (!admin) {
        throw new NotFoundException('Administrador no encontrado');
      }

      // Obtener solicitudes respondidas por este admin
      const requests = await this.prisma.photoRequest.findMany({
        where: {
          admin_id,
          status: {
            in: [PhotoRequestStatus.APROBADO, PhotoRequestStatus.RECHAZADO],
          },
        },
        include: {
          student: {
            select: {
              student_id: true,
              name: true,
              last_name: true,
              email: true,
              student_code: true,
              career: true,
              student_type: true,
            },
          },
        },
        orderBy: {
          response_date: 'desc',
        },
      });

      // Calcular estadísticas
      const totalApproved = requests.filter(
        (r) => r.status === PhotoRequestStatus.APROBADO,
      ).length;
      const totalRejected = requests.filter(
        (r) => r.status === PhotoRequestStatus.RECHAZADO,
      ).length;

      return {
        admin: {
          id: admin.admin_id,
          name: `${admin.name} ${admin.last_name}`,
          role: admin.role,
          email: admin.email,
        },
        statistics: {
          total: requests.length,
          approved: totalApproved,
          rejected: totalRejected,
          approval_rate:
            requests.length > 0
              ? ((totalApproved / requests.length) * 100).toFixed(2) + '%'
              : '0%',
        },
        requests,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error al obtener solicitudes del admin', error);
      throw new InternalServerErrorException(
        'Error al obtener historial del admin',
      );
    }
  }

  /**
   * Obtiene estadísticas generales del sistema de solicitudes (dashboard admin)
   * @returns Estadísticas generales
   */
  async getStatistics() {
    try {
      const [total, pending, approved, rejected] = await Promise.all([
        this.prisma.photoRequest.count(),
        this.prisma.photoRequest.count({
          where: { status: PhotoRequestStatus.PENDIENTE },
        }),
        this.prisma.photoRequest.count({
          where: { status: PhotoRequestStatus.APROBADO },
        }),
        this.prisma.photoRequest.count({
          where: { status: PhotoRequestStatus.RECHAZADO },
        }),
      ]);

      // Obtener solicitudes más antiguas pendientes
      const oldestPending = await this.prisma.photoRequest.findFirst({
        where: { status: PhotoRequestStatus.PENDIENTE },
        orderBy: { application_date: 'asc' },
        select: {
          request_id: true,
          application_date: true,
          student: {
            select: {
              name: true,
              last_name: true,
              student_code: true,
            },
          },
        },
      });

      // Top 5 admins más activos
      const topAdmins = await this.prisma.photoRequest.groupBy({
        by: ['admin_id'],
        where: {
          admin_id: { not: null },
        },
        _count: {
          admin_id: true,
        },
        orderBy: {
          _count: {
            admin_id: 'desc',
          },
        },
        take: 5,
      });

      const topAdminsDetails = await Promise.all(
        topAdmins.map(async (item) => {
          const admin = await this.prisma.adminUser.findUnique({
            where: { admin_id: item.admin_id! },
            select: {
              admin_id: true,
              name: true,
              last_name: true,
              role: true,
            },
          });
          return {
            admin,
            total_reviewed: item._count.admin_id,
          };
        }),
      );

      return {
        overview: {
          total,
          pending,
          approved,
          rejected,
          approval_rate:
            total > 0 ? ((approved / total) * 100).toFixed(2) + '%' : '0%',
        },
        oldest_pending: oldestPending
          ? {
              request_id: oldestPending.request_id,
              student_name: `${oldestPending.student.name} ${oldestPending.student.last_name}`,
              student_code: oldestPending.student.student_code,
              waiting_days: Math.floor(
                (new Date().getTime() -
                  oldestPending.application_date.getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
              application_date: oldestPending.application_date,
            }
          : null,
        top_admins: topAdminsDetails,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas', error);
      throw new InternalServerErrorException('Error al obtener estadísticas');
    }
  }
}
