import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * GET /student/:email
   * Obtener estudiante por email
   * @param email El email del estudiante.
   * @returns La información del estudiante asociado al email.
   */
  @Get(':email')
  async getStudentByEmail(@Param('email') email: string) {
    return this.studentService.getStudentByEmail(email);
  }

  /**
   * PATCH /student/biometric/validate
   * Actualizar perfil biométrico del estudiante
   * @param updateBiometricDto Objeto con los datos para actualizar el perfil biométrico.
   * @returns Mensaje de confirmación.
   */
  @Patch('biometric/validate')
  async updateBiometric(@Body() updateBiometricDto: UpdateBiometricDto) {
    return this.studentService.updateBiometricProfile(updateBiometricDto);
  }

  /**
   * GET /student/biometric/status/:student_id
   * Obtener estado del perfil biométrico del estudiante
   * @param student_id El ID del estudiante.
   * @returns Estado del perfil biométrico.
   */
  @Get('biometric/status/:student_id')
  async getBiometricStatus(@Param('student_id') student_id: string) {
    return this.studentService.getBiometricStatus(student_id);
  }

  /**
   * PATCH /student/biometric/reset/:student_id
   * Resetear perfil biométrico del estudiante
   * @param student_id El ID del estudiante.
   * @returns Mensaje de confirmación.
   */
  @Patch('biometric/reset/:student_id')
  async resetBiometricProfile(@Param('student_id') student_id: string) {
    return this.studentService.resetBiometricProfile(student_id);
  }

  /**
   * PATH /student/:id
   * Actualizar información del estudiante
   * @param id El ID del estudiante.
   * @param updateStudentDto Objeto con los datos a actualizar.
   * @returns Mensaje de confirmación.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }
}
