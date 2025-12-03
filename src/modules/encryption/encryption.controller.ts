import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EncryptionService } from './encryption.service';
import { EncryptRequestDto } from './dto/encrypt-request.dto';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { EncryptResponseDto } from './dto/encrypt-response.dto';
import { DecryptResponseDto } from './dto/decrypt-response.dto';

@ApiTags('Encryption')
@Controller()
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}
  private logger = new Logger(EncryptionController.name);

  @Post('get-encrypt-data')
  @ApiOperation({
    summary: 'Encrypt payload data',
    description:
      'Encrypts the payload using AES-256-CBC and encrypts the AES key with RSA private key',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully encrypted data',
    type: EncryptResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during encryption',
  })
  encryptData(@Body() body: EncryptRequestDto): EncryptResponseDto {
    try {
      const aesKey = this.encryptionService.generateAESKey();

      const encryptedPayload = this.encryptionService.encryptWithAES(
        body.payload,
        aesKey,
      );

      const encryptedKey =
        this.encryptionService.encryptWithRSAPublicKey(aesKey);

      return {
        successful: true,
        error_code: '',
        data: {
          data1: encryptedKey,
          data2: encryptedPayload,
        },
      };
    } catch (error) {
      this.logger.error(
        'Encryption failed',
        error instanceof Error ? error.stack : error,
      );
      throw new HttpException(
        {
          successful: false,
          error_code: 'ENCRYPTION_ERROR',
          data: `${error}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('get-decrypt-data')
  @ApiOperation({
    summary: 'Decrypt encrypted data',
    description:
      'Decrypts the AES key using RSA public key and then decrypts the payload using the AES key',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully decrypted data',
    type: DecryptResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during decryption',
  })
  decryptData(@Body() body: DecryptRequestDto): DecryptResponseDto {
    try {
      const aesKey = this.encryptionService.decryptWithRSAPrivateKey(
        body.data1,
      );

      const decryptedPayload = this.encryptionService.decryptWithAES(
        body.data2,
        aesKey,
      );

      return {
        successful: true,
        error_code: '',
        data: {
          payload: decryptedPayload,
        },
      };
    } catch (error) {
      this.logger.error(
        'Decryption failed',
        error instanceof Error ? error.stack : error,
      );
      throw new HttpException(
        {
          successful: false,
          error_code: 'DECRYPTION_ERROR',
          data: `${error}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
