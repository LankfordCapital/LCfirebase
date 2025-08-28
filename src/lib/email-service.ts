
'use server';

'use server';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-client';

interface MailPayload {
    to: string[];
    from?: string;
    cc?: string[];
    bcc?: string[];
    subject: string;
    html: string;
}

/**
 * Sends an email by adding a document to the 'mail' collection in Firestore.
 * This relies on the "Trigger Email" Firebase Extension to be installed.
 * @param payload The email payload.
 * @returns The ID of the document created in the 'mail' collection.
 */
export async function sendEmail(payload: MailPayload): Promise<string> {
    try {
        const mailCollection = collection(db, 'mail');
        const docRef = await addDoc(mailCollection, {
            ...payload,
            createdAt: serverTimestamp(),
        });
        console.log('Email document written with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding email document to Firestore:', error);
        throw new Error('Failed to queue email for sending.');
    }
}
