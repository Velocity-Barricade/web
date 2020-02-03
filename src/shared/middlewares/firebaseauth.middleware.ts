import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MessageCodeError } from '../errors/message-code-error';
import { FirebaseUser } from '../../modules/firebase-user/firebase-user.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
    public async use(req, res, next) {
        // req.body["firebase_uid"] = "testuid";
        req.body["firebase_email"] = "saad3112@gmail.com";
        // if (req.headers.authorization) {
            // const token = (req.headers.authorization as string);
            // const decoded: any = jwt.verify(token, process.env.JWT_KEY || '');
            // Verify firebase user here usng firebase-admin
            // const user = await FirebaseUser.findOne<FirebaseUser>({
            //     where: {
            //         id: decoded.id,
            //         email: decoded.email
            //     }
            // });
            // if (!user) throw new MessageCodeError('request:unauthorized');
            next();
        // } else {
        //     throw new MessageCodeError('request:unauthorized');
        // }
    }
}
