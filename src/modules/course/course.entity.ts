import {
    Table,
    Column,
    Model,
    DataType
} from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';

const tableOptions: IDefineOptions = {
    timestamp: false,
    tableName: 'courses'
} as IDefineOptions;

@Table(tableOptions)
export class Course extends Model<Course> {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    })
    public id: number;

    @Column({
        type: DataType.CHAR(100),
        allowNull: false
    })
    public name: string;
}
