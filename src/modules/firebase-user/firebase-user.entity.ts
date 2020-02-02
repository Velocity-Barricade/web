import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, BeforeValidate } from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';
import { MessageCodeError } from '../../shared/errors/message-code-error';

const tableOptions: IDefineOptions = {
    timestamp: true,
    tableName: 'firebaseUsers'
} as IDefineOptions;

@Table(tableOptions)
export class FirebaseUser extends Model<FirebaseUser> {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    })
    public id: number;

    @Column({
        type: DataType.CHAR(30),
        allowNull: false
    })
    public name: string;

    @Column({
        type: DataType.CHAR(100),
        allowNull: false,
        validate: {
            isEmail: true,
            isUnique: async (value: string, next: Function): Promise<any> => {
                const isExist = await FirebaseUser.findOne({ where: { email: value } });
                if (isExist) {
                    const error = new MessageCodeError('user:create:emailAlreadyExist');
                    next(error);
                }
                next();
            }
        }
    })
    public email: string;

    @Column({
        type: DataType.CHAR(128),
        allowNull: false,
        unique: true
    })
    public firebase_uid: string;

    @CreatedAt public createdAt: Date;

    @UpdatedAt public updatedAt: Date;

    @DeletedAt public deletedAt: Date;

    @BeforeValidate
    public static validateData(firebaseUser: FirebaseUser, options: any) {
        if (!options.transaction) throw new Error('Missing transaction.');
        if (!firebaseUser.name) throw new MessageCodeError('user:create:missingName');
        if (!firebaseUser.email) throw new MessageCodeError('user:create:missingEmail');
        if (!firebaseUser.firebase_uid) throw new MessageCodeError('user:create:missingFirebaseUid');
    }
}
