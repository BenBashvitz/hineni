import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtService } from '@nestjs/jwt';
import { FirebaseRepository } from '../firebase/firebase.repository';
import { GuestDetails, guestsCollectionName } from '../guests.interface';

@Injectable()
export class AppService {
  constructor(
    private mailService: MailService,
    private jwtService: JwtService,
    private firebaseRepository: FirebaseRepository
  ) {
    this.firebaseRepository.createCollection(guestsCollectionName);
    // this.firebaseRepository.fetchAllFromCollection(guestsCollectionName);
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async sendInvitation(email: string, guests: GuestDetails[]) {
    const existingGuests = await this.firebaseRepository.fetchAllFromCollection(
      guestsCollectionName
    );

    console.log(existingGuests);

    guests.forEach(async (guest) => {
      await this.firebaseRepository.addToCollection(guestsCollectionName, {
        ...guest,
        arrived: false,
      });
    });

    this.mailService.sendInvitation(email, guests);
  }

  verifyJWT(token: string) {
    try {
      const data = this.jwtService.verify(token);

      //TODO: check if guest is not marked as arrived and mark guest as arrived.
      //TODO: if guest has already arrive throw error

      console.log(data);

      return true;
    } catch {
      return false;
    }
  }
}
