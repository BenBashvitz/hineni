import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
    private db: FirebaseFirestore.Firestore;
    private collections: Record<string, FirebaseFirestore.CollectionReference> = {};

    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
        this.db = firebaseApp.firestore();
    }

    createCollection(collectionName: string) {
        this.collections[collectionName] = this.db.collection(collectionName)
    }

    async addToCollection(collectionName: string, objectToAdd: unknown) {
        if(this.collections[collectionName]) {
            return (await (await this.collections[collectionName].add(objectToAdd)).get()).data()
        } else {
            throw new Error("Collection doesn't exist")
        }
    }

     async fetchAllFromCollection(collectionName: string) {
        if(this.collections[collectionName]) {
            const documents = await this.collections[collectionName].listDocuments()

            return await Promise.all(documents.map(async (doc) => {
                return (await doc.get()).data()
            }))
        }
    }
}