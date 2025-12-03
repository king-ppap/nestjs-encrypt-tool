import { ApiProperty } from '@nestjs/swagger';

export class DecryptedPayloadDto {
  @ApiProperty({
    description: 'Decrypted original payload',
    example: 'Hello, World!',
  })
  payload: string;
}

export class DecryptResponseDto {
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
    description: 'Decrypted payload',
    type: DecryptedPayloadDto,
    nullable: true,
  })
  data: DecryptedPayloadDto | null;
}
