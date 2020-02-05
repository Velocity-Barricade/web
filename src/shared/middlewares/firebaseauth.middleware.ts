import { Injectable, NestMiddleware } from '@nestjs/common';
import { MessageCodeError } from '../errors/message-code-error';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
    public async use(req, res, next) {
        if (req.headers.authorization) {
            const firebaseUid = (req.headers.authorization as string);

            // Get firebase user from firebase using uid
            try {
                let firebaseUser = await admin.auth().getUser(firebaseUid);
                req.body["firebase_uid"] = firebaseUser.uid;
                req.body["firebase_email"] = firebaseUser.email;
                next();
            } catch {
                throw new MessageCodeError('firebase:cantdecode');
            }
        } else {
            throw new MessageCodeError('request:unauthorized');
        }
    }
}
