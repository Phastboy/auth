import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * Data transfer object for creating a user
 * @export CreateUserDto
 */
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
