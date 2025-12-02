import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhotoRequestService } from './photo-request.service';
import { CreatePhotoRequestDto } from './dto/create-photo-request.dto';
import { UpdatePhotoRequestDto } from './dto/update-photo-request.dto';
import { RespondPhotoRequestDto } from './dto/respond-photo-request.dto';

@Controller('photo-request')
export class PhotoRequestController {
  constructor(private readonly photoRequestService: PhotoRequestService) {}

  /**
   * POST /photo-request
   * Crea una nueva solicitud de actualización de foto para un estudiante.
   * @param createPhotoRequestDto - DTO que contiene el ID del estudiante y la razón de la solicitud.
   * @returns La solicitud de foto creada.
   */
  @Post()
  create(@Body() createPhotoRequestDto: CreatePhotoRequestDto) {
    return this.photoRequestService.create(createPhotoRequestDto);
  }

  /**
   * GET /photo-request/can-request/:student_id
   * Verifica si un estudiante puede realizar una nueva solicitud de actualización de foto.
   * @param student_id - ID del estudiante.
   * @returns Un booleano que indica si el estudiante puede solicitar una actualización de foto.
   */
  @Get('can-request/:student_id')
  async canRequest(@Param('student_id') student_id: string) {
    return this.photoRequestService.canRequestPhotoUpdate(student_id);
  }

  /**
   * GET /photo-request/student/:student_id
   * Obtiene todas las solicitudes de actualización de foto realizadas por un estudiante.
   * @param student_id - ID del estudiante.
   * @returns Una lista de solicitudes de foto realizadas por el estudiante.
   */
  @Get('student/:student_id')
  async findByStudent(@Param('student_id') student_id: string) {
    return this.photoRequestService.findByStudent(student_id);
  }

  /**
   * GET /photo-request/pending
   * Obtiene todas las solicitudes de actualización de foto que están pendientes de revisión.
   * @returns Una lista de solicitudes de foto pendientes.
   */
  @Get('pending')
  async findAllPending() {
    return this.photoRequestService.findAllPending();
  }

  /**
   * GET /photo-request/:request_id
   * Obtiene una solicitud de actualización de foto por su ID.
   * @param request_id - ID de la solicitud de foto.
   * @returns La solicitud de foto correspondiente al ID proporcionado.
   */
  @Get(':request_id')
  async findOne(@Param('request_id') request_id: string) {
    return this.photoRequestService.findOne(request_id);
  }

  /**
   * GET /photo-request/approved
   * Obtiene todas las solicitudes de actualización de foto que han sido aprobadas.
   * @returns Una lista de solicitudes de foto aprobadas.
   */
  @Get('approved')
  async findAllApproved() {
    return this.photoRequestService.findAllApproved();
  }

  /**
   * GET /photo-request/admin/:admin_id
   * Obtiene todas las solicitudes de actualización de foto asignadas a un administrador específico.
   * @param admin_id - ID del administrador.
   * @returns Una lista de solicitudes de foto asignadas al administrador.
   */
  @Get('admin/:admin_id')
  async findByAdmin(@Param('admin_id') admin_id: string) {
    return this.photoRequestService.findByAdmin(admin_id);
  }

  /**
   * GET /photo-request/statistics/overview
   * Obtiene estadísticas generales sobre las solicitudes de actualización de foto.
   * @returns Un objeto con estadísticas sobre las solicitudes de foto.
   */
  @Get('statistics/overview')
  async getStatistics() {
    return this.photoRequestService.getStatistics();
  }

  /**
   * PATCH /photo-request/respond
   * Responde a una solicitud de actualización de foto, aprobándola o rechazándola.
   * @param respondDto - DTO que contiene el ID de la solicitud, el ID del admin y la decisión (aprobar/rechazar).
   * @returns La solicitud de foto actualizada con la respuesta.
   */
  @Patch('respond')
  async respond(@Body() respondDto: RespondPhotoRequestDto) {
    return this.photoRequestService.respondToRequest(respondDto);
  }
}
