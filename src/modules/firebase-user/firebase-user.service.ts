import { Inject, Injectable } from '@nestjs/common';
import { MessageCodeError } from '../../shared/errors/message-code-error';
import { FirebaseUser } from './firebase-user.entity';

@Injectable()
export class FirebaseUserService {
    constructor(
        @Inject('FirebaseUserRepository') private readonly firebaseUserRepository: typeof FirebaseUser,
        @Inject('SequelizeInstance') private readonly sequelizeInstance
    ) {}

    public async findAll(): Promise<Array<FirebaseUser>> {
        return await this.firebaseUserRepository.findAll<FirebaseUser>();
    }

    public async findOne(options: Object): Promise<FirebaseUser | null> {
        return await this.firebaseUserRepository.findOne<FirebaseUser>(options);
    }

    public async findById(id: number): Promise<FirebaseUser | null> {
        return await this.firebaseUserRepository.findById<FirebaseUser>(id);
    }

    public async create(user: FirebaseUser): Promise<FirebaseUser> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await this.firebaseUserRepository.create<FirebaseUser>(user, {
                returning: true,
                transaction
            });
        });
    }

    public async update(id: number, newValue: FirebaseUser): Promise<FirebaseUser | null> {
        return await this.sequelizeInstance.transaction(async transaction => {
            let user = await this.firebaseUserRepository.findById<FirebaseUser>(id, {
                transaction
            });
            if (!user) throw new MessageCodeError('user:notFound');

            user = this._assign(user, newValue);
            return await user.save({
                returning: true,
                transaction
            });
        });
    }

    public async delete(id: number): Promise<void> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await this.firebaseUserRepository.destroy({
                where: { id },
                transaction
            });
        });
    }

    /**
     * @description: Assign new value in the user found in the database.
     *
     * @param {IUser} user
     * @param {IUser} newValue
     * @return {User}
     * @private
     */
    private _assign(user: FirebaseUser, newValue: FirebaseUser): FirebaseUser {
        for (const key of Object.keys(user)) {
            if (user[key] !== newValue[key]) user[key] = newValue[key];
        }

        return user as FirebaseUser;
    }
}
