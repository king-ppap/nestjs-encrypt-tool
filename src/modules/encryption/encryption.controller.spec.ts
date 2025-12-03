import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionController } from './encryption.controller';
import { EncryptionService } from './encryption.service';

describe('EncryptionController', () => {
  let controller: EncryptionController;
  let service: EncryptionService;

  const mockEncryptionService = {
    generateAESKey: jest.fn(),
    encryptWithAES: jest.fn(),
    encryptWithRSAPublicKey: jest.fn(),
    decryptWithRSAPrivateKey: jest.fn(),
    decryptWithAES: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncryptionController],
      providers: [
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    controller = module.get<EncryptionController>(EncryptionController);
    service = module.get<EncryptionService>(EncryptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('encryptData', () => {
    it('should successfully encrypt data and return successful response', async () => {
      const payload = 'Hello, World!';
      const mockAesKey = 'mock-aes-key-64-chars-hex';
      const mockEncryptedPayload = 'iv:encrypted-data';
      const mockEncryptedKey = 'base64-encrypted-key';

      mockEncryptionService.generateAESKey.mockReturnValue(mockAesKey);
      mockEncryptionService.encryptWithAES.mockReturnValue(mockEncryptedPayload);
      mockEncryptionService.encryptWithRSAPublicKey.mockReturnValue(mockEncryptedKey);

      const result = await controller.encryptData({ payload });

      expect(result.successful).toBe(true);
      expect(result.error_code).toBe('');
      expect(result.data).toBeDefined();
      expect(result.data?.data1).toBe(mockEncryptedKey);
      expect(result.data?.data2).toBe(mockEncryptedPayload);

      expect(mockEncryptionService.generateAESKey).toHaveBeenCalledTimes(1);
      expect(mockEncryptionService.encryptWithAES).toHaveBeenCalledWith(
        payload,
        mockAesKey,
      );
      expect(mockEncryptionService.encryptWithRSAPublicKey).toHaveBeenCalledWith(
        mockAesKey,
      );
    });

    it('should handle encryption errors and return error response', async () => {
      const payload = 'Test data';

      mockEncryptionService.generateAESKey.mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      const result = await controller.encryptData({ payload });

      expect(result.successful).toBe(false);
      expect(result.error_code).toBe('ENCRYPTION_ERROR');
      expect(result.data).toBeNull();
    });

    it('should handle empty payload', async () => {
      const payload = '';
      const mockAesKey = 'mock-aes-key';
      const mockEncryptedPayload = 'iv:encrypted-empty';
      const mockEncryptedKey = 'base64-key';

      mockEncryptionService.generateAESKey.mockReturnValue(mockAesKey);
      mockEncryptionService.encryptWithAES.mockReturnValue(mockEncryptedPayload);
      mockEncryptionService.encryptWithRSAPublicKey.mockReturnValue(mockEncryptedKey);

      const result = await controller.encryptData({ payload });

      expect(result.successful).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('decryptData', () => {
    it('should successfully decrypt data and return successful response', async () => {
      const data1 = 'base64-encrypted-key';
      const data2 = 'iv:encrypted-payload';
      const mockAesKey = 'mock-aes-key-64-chars';
      const mockDecryptedPayload = 'Hello, World!';

      mockEncryptionService.decryptWithRSAPrivateKey.mockReturnValue(mockAesKey);
      mockEncryptionService.decryptWithAES.mockReturnValue(mockDecryptedPayload);

      const result = await controller.decryptData({ data1, data2 });

      expect(result.successful).toBe(true);
      expect(result.error_code).toBe('');
      expect(result.data).toBeDefined();
      expect(result.data?.payload).toBe(mockDecryptedPayload);

      expect(mockEncryptionService.decryptWithRSAPrivateKey).toHaveBeenCalledWith(
        data1,
      );
      expect(mockEncryptionService.decryptWithAES).toHaveBeenCalledWith(
        data2,
        mockAesKey,
      );
    });

    it('should handle decryption errors and return error response', async () => {
      const data1 = 'invalid-key';
      const data2 = 'invalid-data';

      mockEncryptionService.decryptWithRSAPrivateKey.mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      const result = await controller.decryptData({ data1, data2 });

      expect(result.successful).toBe(false);
      expect(result.error_code).toBe('DECRYPTION_ERROR');
      expect(result.data).toBeNull();
    });
  });
});
