import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: 587,
          secure: false,
          attachDataUrls: true, //to accept base64 content in messsage
          auth: {
            user: config.get('EMAIL'),
            pass: config.get('PASS'),
          },
          from: config.get('EMAIL'),
        },
      }),
      inject: [ConfigService],
    }),
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, MailService],
  exports: [MailService],
})
export class AppModule {}
