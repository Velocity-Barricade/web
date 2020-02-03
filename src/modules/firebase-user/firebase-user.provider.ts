import { FirebaseUser } from './firebase-user.entity';

export const FirebaseUserProvider = {
    provide: 'FirebaseUserRepository',
    useValue: FirebaseUser
};
