import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const userData: Partial<User> = { name: 'Test', phoneNumber: '1234567890', password: 'password123' };
      const registeredUser: any = { ...userData, id: 'user-id' };
      jest.spyOn(userService, 'register').mockResolvedValue(registeredUser);

      const result = await controller.signUp(userData);

      expect(result).toEqual(registeredUser);
      expect(userService.register).toHaveBeenCalledWith(userData);
    });
  });

  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      const phoneNumber = '1234567890';
      const password = 'password123';
      const token = 'jwt-token';
      jest.spyOn(userService, 'signIn').mockResolvedValue(token);

      const result = await controller.signIn(phoneNumber, password);

      expect(result).toEqual(token);
      expect(userService.signIn).toHaveBeenCalledWith(phoneNumber, password);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const phoneNumber = '1234567890';
      const password = 'wrong-password';
      jest.spyOn(userService, 'signIn').mockResolvedValue(null);

      await expect(controller.signIn(phoneNumber, password)).rejects.toThrow(UnauthorizedException);
      expect(userService.signIn).toHaveBeenCalledWith(phoneNumber, password);
    });
  });
});
