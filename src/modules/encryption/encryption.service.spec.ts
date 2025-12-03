import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { RootConfig } from '@config';

describe('EncryptionService', () => {
  let service: EncryptionService;
  const mockPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw6RHwVvF/1vQ2P3wJqKd
h7xYXr8c1KZt/JxHLlKJG7I5xJ8xK5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5
p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7
J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO
5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3n
G7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p
3K3nG7wIDAQAB
-----END PUBLIC KEY-----`;

  const mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDpEfBW8X/W9DY
/fAmop2HvFhevxzUpm38nEcuUokbsjnEnzErmncrec bvA7mcbsncrmncrec bvA7
mcbsncrmncrec bvA7mcbsncrmncrec bvA7mcbsncrmncrec bvA7mcbsncrmn
crec bvA7mcbsncrmncrec bvA7mcbsncrmncrec bvA7mcbsncrmncrec bvA7mcb
sncrmncrec bvA7mcbsncrmncrec bvA7mcbsncrmncrec bvA7mcbsncrmncrec b
vA7mcbsncrmncrec bvA7mcbsncrmncrec bvA7mcbsncrmncrec bvAgMBAAECggEA
QxK5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO
5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3n
G7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p3K3nG7wO5nG7J3K5p
-----END PRIVATE KEY-----`;

  const mockConfig = {
    RSA_KEYS: {
      PUBLIC_KEY: mockPublicKey,
      PRIVATE_KEY: mockPrivateKey,
    },
  } as RootConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: RootConfig,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAESKey', () => {
    it('should generate a 64-character hex string', () => {
      const key = service.generateAESKey();
      expect(key).toHaveLength(64);
      expect(key).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should generate unique keys on each call', () => {
      const key1 = service.generateAESKey();
      const key2 = service.generateAESKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('AES encryption and decryption', () => {
    it('should encrypt and decrypt data correctly', () => {
      const originalData = 'Hello, World!';
      const key = service.generateAESKey();

      const encrypted = service.encryptWithAES(originalData, key);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(originalData);
      expect(encrypted).toContain(':');

      const decrypted = service.decryptWithAES(encrypted, key);
      expect(decrypted).toBe(originalData);
    });

    it('should handle empty string', () => {
      const originalData = '';
      const key = service.generateAESKey();

      const encrypted = service.encryptWithAES(originalData, key);
      const decrypted = service.decryptWithAES(encrypted, key);
      expect(decrypted).toBe(originalData);
    });

    it('should handle long strings', () => {
      const originalData = 'a'.repeat(2000);
      const key = service.generateAESKey();

      const encrypted = service.encryptWithAES(originalData, key);
      const decrypted = service.decryptWithAES(encrypted, key);
      expect(decrypted).toBe(originalData);
    });

    it('should produce different encrypted outputs for same input due to random IV', () => {
      const originalData = 'Test data';
      const key = service.generateAESKey();

      const encrypted1 = service.encryptWithAES(originalData, key);
      const encrypted2 = service.encryptWithAES(originalData, key);

      expect(encrypted1).not.toBe(encrypted2);

      const decrypted1 = service.decryptWithAES(encrypted1, key);
      const decrypted2 = service.decryptWithAES(encrypted2, key);

      expect(decrypted1).toBe(originalData);
      expect(decrypted2).toBe(originalData);
    });
  });

  describe('Full encryption/decryption workflow', () => {
    it('should complete full encrypt and decrypt cycle', () => {
      const originalPayload = 'Sensitive data that needs encryption';

      const aesKey = service.generateAESKey();
      const encryptedPayload = service.encryptWithAES(originalPayload, aesKey);

      expect(encryptedPayload).toBeDefined();
      expect(encryptedPayload).not.toBe(originalPayload);

      const decryptedPayload = service.decryptWithAES(encryptedPayload, aesKey);
      expect(decryptedPayload).toBe(originalPayload);
    });
  });
});
