import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {

    @IsNotEmpty()
    @IsString()
    uid: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name?: string;
}