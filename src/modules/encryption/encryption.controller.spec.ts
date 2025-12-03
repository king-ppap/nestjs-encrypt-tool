import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionController } from './encryption.controller';
import { EncryptionService } from './encryption.service';

describe('EncryptionController', () => {
  let controller: EncryptionController;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('encryptData', () => {
    it('should successfully encrypt data and return successful response', () => {
      const payload = 'Hello, World!';
      const mockAesKey = 'mock-aes-key-64-chars-hex';
      const mockEncryptedPayload = 'iv:encrypted-data';
      const mockEncryptedKey = 'base64-encrypted-key';

      mockEncryptionService.generateAESKey.mockReturnValue(mockAesKey);
      mockEncryptionService.encryptWithAES.mockReturnValue(
        mockEncryptedPayload,
      );
      mockEncryptionService.encryptWithRSAPublicKey.mockReturnValue(
        mockEncryptedKey,
      );

      const result = controller.encryptData({ payload });

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
      expect(
        mockEncryptionService.encryptWithRSAPublicKey,
      ).toHaveBeenCalledWith(mockAesKey);
    });

    it('should throw HttpException on encryption errors', () => {
      const payload = 'Test data';

      mockEncryptionService.generateAESKey.mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      expect(() => controller.encryptData({ payload })).toThrow();
    });

    it('should handle empty payload', () => {
      const payload = '';
      const mockAesKey = 'mock-aes-key';
      const mockEncryptedPayload = 'iv:encrypted-empty';
      const mockEncryptedKey = 'base64-key';

      mockEncryptionService.generateAESKey.mockReturnValue(mockAesKey);
      mockEncryptionService.encryptWithAES.mockReturnValue(
        mockEncryptedPayload,
      );
      mockEncryptionService.encryptWithRSAPublicKey.mockReturnValue(
        mockEncryptedKey,
      );

      const result = controller.encryptData({ payload });

      expect(result.successful).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('decryptData', () => {
    it('should successfully decrypt data and return successful response', () => {
      const data1 = 'base64-encrypted-key';
      const data2 = 'iv:encrypted-payload';
      const mockAesKey = 'mock-aes-key-64-chars';
      const mockDecryptedPayload = 'Hello, World!';

      mockEncryptionService.decryptWithRSAPrivateKey.mockReturnValue(
        mockAesKey,
      );
      mockEncryptionService.decryptWithAES.mockReturnValue(
        mockDecryptedPayload,
      );

      const result = controller.decryptData({ data1, data2 });

      expect(result.successful).toBe(true);
      expect(result.error_code).toBe('');
      expect(result.data).toBeDefined();
      expect(result.data?.payload).toBe(mockDecryptedPayload);

      expect(
        mockEncryptionService.decryptWithRSAPrivateKey,
      ).toHaveBeenCalledWith(data1);
      expect(mockEncryptionService.decryptWithAES).toHaveBeenCalledWith(
        data2,
        mockAesKey,
      );
    });

    it('should throw HttpException on decryption errors', () => {
      const data1 = 'invalid-key';
      const data2 = 'invalid-data';

      mockEncryptionService.decryptWithRSAPrivateKey.mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      expect(() => controller.decryptData({ data1, data2 })).toThrow();
    });
  });
});
