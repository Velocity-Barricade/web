import { FirebaseUser } from './firebase-user.entity';

export const firebaseUsersProvider = {
    provide: 'FirebaseUserRepository',
    useValue: FirebaseUser
};
