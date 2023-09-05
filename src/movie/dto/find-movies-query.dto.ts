import { IsBoolean, IsBooleanString, IsOptional, IsString } from "class-validator";

export class FindMoviesQueryDto {
    @IsBooleanString()
    @IsOptional()
    manual: boolean

    @IsString()
    @IsOptional()
    genre: string
}