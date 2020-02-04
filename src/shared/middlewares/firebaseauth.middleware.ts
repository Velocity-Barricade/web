import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MessageCodeError } from '../errors/message-code-error';
import { FirebaseUser } from '../../modules/firebase-user/firebase-user.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
    public async use(req, res, next) {
        if (req.headers.authorization) {
            const idToken = (req.headers.authorization as string);

            // Verify firebase user here using firebase-admin
            admin.auth().verifyIdToken(idToken).then(decodedToken => {
                req.body["firebase_uid"] = decodedToken.uid;
                req.body["firebase_email"] = decodedToken.email;
                next();
            }).catch(error => {
                throw new MessageCodeError('firebase:cantdecode');
            });
        } else {
            throw new MessageCodeError('request:unauthorized');
        }
    }
}
