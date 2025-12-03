import { ApiProperty } from '@nestjs/swagger';

export class EncryptedDataDto {
  @ApiProperty({
    description: 'Encrypted AES key with RSA private key',
    example: 'base64_encoded_encrypted_key',
  })
  data1: string;

  @ApiProperty({
    description: 'Encrypted payload with AES key',
    example: 'hex_encoded_encrypted_payload',
  })
  data2: string;
}

export class EncryptResponseDto {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true,
  })
  successful: boolean;

  @ApiProperty({
    description: 'Error code if operation failed',
    example: '',
    required: false,
  })
  error_code: string;

  @ApiProperty({
    description: 'Encrypted data',
    type: EncryptedDataDto,
    nullable: true,
  })
  data: EncryptedDataDto | null;
}
