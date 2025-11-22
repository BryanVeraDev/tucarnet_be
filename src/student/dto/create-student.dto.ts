import { IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export enum Status {
    MATRICULADO = 'MATRICULADO',
    NO_ACTIVO = 'NO_ACTIVO',
}

export enum student_type {
    PREGRADO = 'PREGRADO',
    POSGRADO = 'POSGRADO',
}

export class CreateStudentDto {

    @IsNotEmpty()
    @IsString()
    student_id: string;

    @IsNotEmpty()
    @IsString()
    firebase_id: string;

    @IsNotEmpty()
    @IsString()
    student_code: string;

    @IsOptional()
    @IsString()
    card_photo_url: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsEnum(student_type)
    student_type: student_type;

    @IsNotEmpty()
    @IsString()
    career: string;

    @IsNotEmpty()
    @IsEnum(Status)
    status: Status;
}