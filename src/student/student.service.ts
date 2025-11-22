import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener estudiante por email
   */
  async getStudentByEmail(email: string) {
    try {
      const student = await this.prisma.student.findFirst({
        where: { email },
        include: {
          biometric_profile: true,
          photo_requests: true,
        },
      });

      if (!student) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      return student;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estudiante por email
   */
  async getStudentByCode(student_code: string) {
    try {
      const student = await this.prisma.student.findFirst({
        where: { student_code },
        include: {
          biometric_profile: true,
          photo_requests: true,
        },
      });

      if (!student) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      return student;

    } catch (error) {
      throw error;
    }
  }

  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
