import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../entities/contact.entity';
import { User } from '../entities/user.entity';
import { ILike, Like, Raw, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) { }

    async addContact(user: User, contactData: Partial<Contact>): Promise<Contact> {
        const existingContact = await this.contactRepository.findOne({ where: { phoneNumber: contactData.phoneNumber } });
        if (existingContact) {
            existingContact.user.push(user.phoneNumber);
            await this.contactRepository.update({ phoneNumber: contactData.phoneNumber }, existingContact)
            return existingContact;
        } else {
            const contact = this.contactRepository.create({ ...contactData, user: [user.phoneNumber] });
            return await this.contactRepository.save(contact);
        }
    }

    async search(searchValue: string): Promise<Contact[]> {
        if (phoneNumberRegex.test(searchValue)) {
            return await this.contactRepository.find({where:{phoneNumber: {$regex: new RegExp(searchValue, 'i')}}} as any)
        } else {
            return await this.contactRepository.find({where:{name: {$regex: new RegExp(searchValue, 'i')}}, select:["isSpam","name","phoneNumber"]} as any);
        }
    }

    async contactDetails(user: User, id: string): Promise<Contact> {
        const contactInfo = await this.contactRepository.findOne({
            where: {
                id:new ObjectId(id) as any,
            }
        });
        if(contactInfo){
            if(contactInfo.user.includes(user.phoneNumber)){
                delete contactInfo.user;
                return contactInfo
            }else{
                delete contactInfo.user;
                delete contactInfo.email;
                return contactInfo;
            }
        }else{
           throw new NotFoundException("Contact not found") 
        }
    }

    async markSpam(phoneNumber: string): Promise<Contact> {
        const contactInfo = await this.contactRepository.findOne({
            where: {
                phoneNumber,
            }
        });
        if(contactInfo){
            contactInfo.isSpam = true;
            this.contactRepository.update({phoneNumber},contactInfo)
            return contactInfo;
        }else{
            const contact = this.contactRepository.create({ phoneNumber,isSpam:true, user: [] });
            return await this.contactRepository.save(contact);
        }
    }
}
