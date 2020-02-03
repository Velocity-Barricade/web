import {
    Table,
    Column,
    Model,
    DataType,
    TableOptions,
    HasMany
} from 'sequelize-typescript';
import { CourseClass } from '../course-class/course-class.entity';

const tableOptions: TableOptions = {
    timestamps: false,
    tableName: 'courses'
} as TableOptions;

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

    @HasMany(() => CourseClass)
    courseClasses: CourseClass[];
}
