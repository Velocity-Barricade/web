import * as crypto from 'crypto';
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    BeforeValidate,
    BeforeCreate
} from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';
import { MessageCodeError } from '../../shared/errors/message-code-error';

const tableOptions: IDefineOptions = {
    timestamp: true,
    tableName: 'users'
} as IDefineOptions;

@Table(tableOptions)
export class User extends Model<User> {
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
                const isExist = await User.findOne({ where: { email: value } });
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
        type: DataType.TEXT,
        allowNull: false
    })
    public password: string;

    @Column({
        type: DataType.CHAR(30),
        allowNull: false
    })
    public degreeProgram: string;

    @CreatedAt public createdAt: Date;

    @UpdatedAt public updatedAt: Date;

    @DeletedAt public deletedAt: Date;

    @BeforeValidate
    public static validateData(user: User, options: any) {
        if (!options.transaction) throw new Error('Missing transaction.');
        if (!user.name) throw new MessageCodeError('user:create:missingName');
        if (!user.email) throw new MessageCodeError('user:create:missingEmail');
        if (!user.password) throw new MessageCodeError('user:create:missingPassword');
        if (!user.degreeProgram) throw new MessageCodeError('user:create:missingDegreeProgram');
    }

    @BeforeCreate
    public static async hashPassword(user: User, options: any) {
        if (!options.transaction) throw new Error('Missing transaction.');

        user.password = crypto.createHmac('sha256', user.password).digest('hex');
    }
}
