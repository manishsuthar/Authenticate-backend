import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JwtService as JwtServiceM } from '@nestjs/jwt';

describe('JwtService', () => {
  let service: JwtService;
  let jwtService: JwtServiceM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: JwtServiceM,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    jwtService = module.get<JwtServiceM>(JwtServiceM);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const user: any = { id: 'user-id', phoneNumber: '1234567890' };
      const token = 'generated-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.generateToken(user);

      expect(result).toEqual(token);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id, phoneNumber: user.phoneNumber });
    });
  });

  describe('verifyToken', () => {
    it('should verify a JWT token', async () => {
      const token = 'jwt-token';
      const decodedToken = { id: 'user-id', phoneNumber: '1234567890' };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

      const result = await service.verifyToken(token);

      expect(result).toEqual(decodedToken);
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });
  });
});
