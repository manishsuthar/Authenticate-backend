import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: '123123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtService, JwtStrategy],
  exports: [JwtModule, JwtService],
})
export class JwtAuthModule {}
