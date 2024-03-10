import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contacts.controller';
import { ContactService } from './contacts.service';
import { JwtService } from '../jwt/jwt.service';
import { Contact } from '../entities/contact.entity';

describe('ContactController', () => {
  let controller: ContactController;
  let contactService: ContactService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: {
            addContact: jest.fn(),
            search: jest.fn(),
            contactDetails: jest.fn(),
            markSpam: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    contactService = module.get<ContactService>(ContactService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addContact', () => {
    it('should add a contact', async () => {
      const contactData: Partial<Contact> = { name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' };
      const user = { id: 'user-id' };
      jwtService.verifyToken = jest.fn().mockImplementation(() => Promise.resolve(user));
      contactService.addContact = jest.fn().mockResolvedValue(contactData as Contact);

      const result = await controller.addContact({ headers: { authorization: 'Bearer token' } }, contactData);

      expect(result).toEqual(contactData as Contact);
    });
  });

  describe('searchByName', () => {
    it('should search contacts by name', async () => {
      const searchValue = 'John';
      const expectedResult: any[] = [
        { id: '1', name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' },
        { id: '2', name: 'Johnny Bravo', phoneNumber: '9876543210', email: 'johnny@example.com' },
      ];
      contactService.search = jest.fn().mockResolvedValue(expectedResult);

      const result = await controller.searchByName(searchValue);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('searchByPhoneNumber', () => {
    it('should search contact by phone number', async () => {
      const user = { id: 'user-id' };
      const contactId = '1';
      const expectedResult: any = { id: contactId, name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' };
      jwtService.verifyToken = jest.fn().mockResolvedValue(user);
      contactService.contactDetails = jest.fn().mockResolvedValue(expectedResult);

      const result = await controller.searchByPhoneNumber({ headers: { authorization: 'Bearer token' } }, contactId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('markSpam', () => {
    it('should mark a contact as spam', async () => {
      const contactId = '1';
      const expectedResult: any = { id: contactId, name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' };
      contactService.markSpam = jest.fn().mockResolvedValue(expectedResult);

      const result = await controller.markSpam(contactId);

      expect(result).toEqual(expectedResult);
    });
  });



});
