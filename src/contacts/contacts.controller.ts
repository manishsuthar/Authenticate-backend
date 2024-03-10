import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Contact } from '../entities/contact.entity';
import { User } from '../entities/user.entity';
import { ContactService } from './contacts.service';
import { JwtService } from '../jwt/jwt.service';

@Controller('contacts')
export class ContactController {
    constructor(private readonly contactService: ContactService, private readonly jwtService: JwtService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addContact(@Req() req, @Body() contactData: Partial<Contact>): Promise<Contact> {
        const user: any = await this.jwtService.verifyToken(req.headers.authorization.split(' ')[1]);
        return this.contactService.addContact(user, contactData);
    }

    @UseGuards(JwtAuthGuard)
    @Get('search/:searchValue')
    async searchByName(@Param('searchValue') searchValue: string): Promise<Contact[]> {
        return await this.contactService.search(searchValue);
    }

    @UseGuards(JwtAuthGuard)
    @Get('details/:id')
    async searchByPhoneNumber(@Req() req, @Param('id') id: string): Promise<Contact> {
        const user: any = await this.jwtService.verifyToken(req.headers.authorization.split(' ')[1]);
        return await this.contactService.contactDetails(user, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('mark-spam/:phoneNumber')
    async markSpam(@Param('phoneNumber') id: string): Promise<Contact> {
        return await this.contactService.markSpam(id);
    }
}
