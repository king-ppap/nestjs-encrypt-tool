import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  publicEncrypt,
  privateDecrypt,
  constants,
} from 'node:crypto';
import { RootConfig } from '@config';

@Injectable()
export class EncryptionService {
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(private readonly config: RootConfig) {
    this.publicKey = this.config.RSA_KEYS.PUBLIC_KEY;
    this.privateKey = this.config.RSA_KEYS.PRIVATE_KEY;
  }

  generateAESKey(): string {
    return randomBytes(32).toString('hex');
  }

  encryptWithAES(data: string, key: string): string {
    const iv = randomBytes(12);
    const keyBuffer = Buffer.from(key, 'hex');
    const cipher = createCipheriv('aes-256-gcm', keyBuffer, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  decryptWithAES(encryptedData: string, key: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const keyBuffer = Buffer.from(key, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  encryptWithRSAPrivateKey(data: string): string {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = privateDecrypt(
      {
        key: this.privateKey,
        padding: constants.RSA_PKCS1_PADDING,
      },
      buffer,
    );
    return encrypted.toString('base64');
  }

  encryptWithRSAPublicKey(data: string): string {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = publicEncrypt(
      {
        key: this.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
      },
      buffer,
    );
    return encrypted.toString('base64');
  }

  decryptWithRSAPublicKey(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = publicEncrypt(
      {
        key: this.publicKey,
        padding: constants.RSA_PKCS1_PADDING,
      },
      buffer,
    );
    return decrypted.toString('utf8');
  }

  decryptWithRSAPrivateKey(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = privateDecrypt(
      {
        key: this.privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
      },
      buffer,
    );
    return decrypted.toString('utf8');
  }
}
