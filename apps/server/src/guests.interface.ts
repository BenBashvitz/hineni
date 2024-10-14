export const guestsCollectionName = 'guests';

export interface Guest {
  name: string;
  id: string;
  arrived: boolean;
}

export type GuestDetails = Omit<Guest, 'arrived'>;
