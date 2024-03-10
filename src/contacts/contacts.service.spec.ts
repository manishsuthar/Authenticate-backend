import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contacts.service';
import { Contact } from '../entities/contact.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ContactService', () => {
  let service: ContactService;
  let contactRepository: Repository<Contact>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    contactRepository = module.get<Repository<Contact>>(getRepositoryToken(Contact));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addContact', () => {
    it('should add a new contact', async () => {
      const user: any = { id: 'user-id', phoneNumber: '1234567890' };
      const contactData: Partial<Contact> = { name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' };

      jest.spyOn(contactRepository, 'findOne').mockResolvedValue(undefined);
      const createSpy = jest.spyOn(contactRepository, 'create').mockReturnValue(contactData as Contact);
      const saveSpy = jest.spyOn(contactRepository, 'save').mockResolvedValue(contactData as Contact);

      const result = await service.addContact(user, contactData);

      expect(createSpy).toHaveBeenCalledWith({ ...contactData, user: [user.phoneNumber] });
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual(contactData as Contact);
    });

    it('should add an existing contact to user', async () => {
      const user: any = { id: 'user-id', phoneNumber: '1234567890' };
      const existingContact: Contact = { id: 'contact-id', name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com', user: [] };
      const contactData: Partial<Contact> = { name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' };

      jest.spyOn(contactRepository, 'findOne').mockResolvedValue(existingContact);
      const updateSpy = jest.spyOn(contactRepository, 'update').mockResolvedValue(undefined);

      const result = await service.addContact(user, contactData);

      expect(updateSpy).toHaveBeenCalledWith({ phoneNumber: contactData.phoneNumber }, existingContact);
      expect(result).toEqual(existingContact);
    });
  });
   
  describe('search', () => {
    it('should search contacts by name', async () => {
      const searchValue = 'John';
      const expectedResult: any[] = [
        { id: '1', name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' },
        { id: '2', name: 'Johnny Bravo', phoneNumber: '9876543210', email: 'johnny@example.com' },
      ];
      jest.spyOn(contactRepository, 'find').mockResolvedValue(expectedResult);

      const result = await service.search(searchValue);

      expect(result).toEqual(expectedResult);
    });

    it('should search contacts by phone number', async () => {
      const searchValue = '123';
      const expectedResult: any[] = [
        { id: '1', name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com' },
        { id: '2', name: 'Test1', phoneNumber: '1239876540', email: 'test@gmail.com' },
      ];
      jest.spyOn(contactRepository, 'find').mockResolvedValue(expectedResult);

      const result = await service.search(searchValue);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('contactDetails', () => {
    it('should return contact details for user', async () => {
      const user: any = { id: '65ec92b025d5d59129035de8', phoneNumber: '1234567890' };
      const contactId = '65ec92b025d5d59129035de8';
      const contactDetails: Contact = { id: contactId, name: 'Test', phoneNumber: '1234567890', email: 'test1@gmail.com', user: [user.phoneNumber] };
      jest.spyOn(contactRepository, 'findOne').mockResolvedValue(contactDetails);

      const result = await service.contactDetails(user, contactId);

      expect(result).toEqual(contactDetails);
    });

    it('should return contact details without email for non-user', async () => {
      const user: any = { id: '65ec92b025d5d59129035de8', phoneNumber: '1234567890' };
      const contactId = '65ec92b025d5d59129035de8';
      const contactDetails: Contact = { id: contactId, name: 'Test1', phoneNumber: '9876543210', email: 'test@gmail.com', user: [] };
      jest.spyOn(contactRepository, 'findOne').mockResolvedValue(contactDetails);

      const result = await service.contactDetails(user, contactId);

      expect(result).toEqual({ ...contactDetails, email: undefined });
    });

    it('should throw NotFoundException for non-existing contact', async () => {
      const user: any = { id: '65ec92b025d5d59129035de8', phoneNumber: '1234567890' };
      const contactId = '65ec92b025d5d59129035de8';
      jest.spyOn(contactRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.contactDetails(user, contactId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markSpam', () => {
    it('should mark a contact as spam', async () => {
      const phoneNumber = '1234567890';
      const contact: Contact = { id: '65ec92b025d5d59129035de8', name: 'Test', phoneNumber, email: 'test1@gmail.com', user: [] };
      jest.spyOn(contactRepository, 'findOne').mockResolvedValue(contact);
      jest.spyOn(contactRepository, 'update').mockResolvedValue(undefined);

      const result = await service.markSpam(phoneNumber);

      expect(result.isSpam).toBe(true);
    });

    it('should create a new contact and mark as spam if contact does not exist', async () => {
      const phoneNumber = '9876543210';
      jest.spyOn(contactRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(contactRepository, 'create').mockReturnValue({ id: '2', name: 'Test1', phoneNumber, email: 'test@gmail.com', user: [], isSpam: true });
      jest.spyOn(contactRepository, 'save').mockResolvedValue({ id: '2', name: 'Test1', phoneNumber, email: 'test@gmail.com', user: [], isSpam: true });

      const result = await service.markSpam(phoneNumber);

      expect(result.isSpam).toBe(true);
    });
  });

});
