import { ApiProperty } from "@nestjs/swagger"

export class JwtTokens {

    @ApiProperty()
    access_token: string

    @ApiProperty()
    refresh_token: string
}