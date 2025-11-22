import { IsNotEmpty, IsString } from "class-validator";

export class CreateQrDto {

    @IsNotEmpty()
    @IsString()
    student_code: string;

}
