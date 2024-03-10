import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { User } from './entities/user.entity';
import { JwtAuthModule } from './jwt/jwt.module';
import { ContactService } from './contacts/contacts.service';
import { ContactController } from './contacts/contacts.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/database',
      entities: [User, Contact],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    TypeOrmModule.forFeature([User, Contact]),
    JwtAuthModule
  ],
  controllers: [AppController, UserController, ContactController],
  providers: [AppService, UserService, ContactService],
})
export class AppModule { }
