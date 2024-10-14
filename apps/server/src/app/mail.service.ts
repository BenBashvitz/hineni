import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { toDataURL } from 'qrcode';
import { renderFile } from 'ejs';
import { create } from 'html-pdf';
import { join } from 'path';
import { FirebaseRepository } from '../firebase/firebase.repository';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private jwtService: JwtService,
    private firebaseRepository: FirebaseRepository
  ) {}

  async sendInvitation(to: string, guests: { name: string; id: string }[]) {
    const guestsWithQR = await Promise.all(
      guests.map(async (guest) => ({
        ...guest,
        qr: await toDataURL(this.jwtService.sign(guest)),
      }))
    );

    renderFile(
      join(__dirname, 'assets/views/', 'invitation.ejs'),
      {
        guests: guestsWithQR,
        str: 'testing',
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const options = {
            height: `${guests.length * 6}in`,
            width: '3.5in',
          };

          create(data, options).toFile('invite.pdf', async (err, data) => {
            if (err) {
              console.log(err);
            }

            await this.mailerService.sendMail({
              to,
              subject: 'הזמנה לטקס סיום בה״ד 1',
              attachments: [
                {
                  path: data.filename,
                },
              ],
              context: {
                guests,
              },
            });
          });
        }
      }
    );
  }
}
