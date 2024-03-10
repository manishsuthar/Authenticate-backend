import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
        private readonly jwtService: JwtService,
    ) { }

    async register(user: Partial<User>): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: {
                phoneNumber: user.phoneNumber,
            }
        });
        if(!user.name){
            throw new BadRequestException('Name is Missing'); 
        }
        if (existingUser) {
            throw new NotFoundException('User with this phone number already exists');
        }
        const contact = this.contactRepository.create({name:user.name, phoneNumber:user.phoneNumber,user:[]});
        await this.contactRepository.save(contact);
        return await this.userRepository.save(user);
    }

    async signIn(phoneNumber: string, password: string): Promise<string> {
        const user = await this.userRepository.findOne({ where: { phoneNumber } });

        if (!user || user.password !== password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.jwtService.generateToken(user);
    }

}
