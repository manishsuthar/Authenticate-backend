import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '../jwt/jwt.service';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Contact } from '../entities/contact.entity';
import { JwtAuthModule } from '../jwt/jwt.module';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let contactRepository: Repository<Contact>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[JwtAuthModule],
      providers: [
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    contactRepository = module.get<Repository<Contact>>(getRepositoryToken(Contact));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData: Partial<User> = { name: 'Test', phoneNumber: '1234567890', password: 'password123' };
      const existingUser = null;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);
      const createContactSpy = jest.spyOn(contactRepository, 'create').mockReturnValue({} as Contact);
      const saveContactSpy = jest.spyOn(contactRepository, 'save').mockResolvedValue({} as Contact);
      const saveUserSpy = jest.spyOn(userRepository, 'save').mockResolvedValue({} as User);

      const result = await service.register(userData);

      expect(result).toBeDefined();
      expect(createContactSpy).toHaveBeenCalledWith({ name: userData.name, phoneNumber: userData.phoneNumber, user: [] });
      expect(saveContactSpy).toHaveBeenCalled();
      expect(saveUserSpy).toHaveBeenCalledWith(userData);
    });

    it('should throw BadRequestException when name is missing', async () => {
      const userData: Partial<User> = { phoneNumber: '1234567890', password: 'password123' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.register(userData)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user already exists', async () => {
      const userData: Partial<User> = { name: 'Test', phoneNumber: '1234567890', password: 'password123' };
      const existingUser: User = { ...userData } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      await expect(service.register(userData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      const phoneNumber = '1234567890';
      const password = 'password123';
      const user: User = { name: 'Test', phoneNumber, password } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const generateTokenSpy = jest.spyOn(jwtService, 'generateToken').mockResolvedValue('jwt-token');

      const result = await service.signIn(phoneNumber, password);

      expect(result).not.toBeNull();
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const phoneNumber = '1234567890';
      const password = 'wrong-password';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.signIn(phoneNumber, password)).rejects.toThrow(UnauthorizedException);
    });
  });
});
