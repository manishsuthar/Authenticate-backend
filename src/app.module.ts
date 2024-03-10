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
      url: 'mongodb+srv://manishpune2024:Sanderao11@cluster0.oec10jf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      entities: [User, Contact],
      ssl:false,
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
