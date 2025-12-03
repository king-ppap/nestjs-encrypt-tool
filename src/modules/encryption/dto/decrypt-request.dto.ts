import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DecryptRequestDto {
  @ApiProperty({
    description: 'Encrypted AES key with RSA private key',
    example: 'base64_encoded_encrypted_key',
  })
  @IsString()
  data1: string;

  @ApiProperty({
    description: 'Encrypted payload with AES key',
    example: 'hex_encoded_encrypted_payload',
  })
  @IsString()
  data2: string;
}
