import { IsNotEmpty, IsString } from "class-validator";
import { SignInDto } from "./signIn.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto extends SignInDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string
}