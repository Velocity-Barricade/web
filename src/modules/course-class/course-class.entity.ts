import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Default
} from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';
import { Course } from '../course/course.entity';

const tableOptions: IDefineOptions = {
  timestamp: false,
  tableName: 'courseClasses'
} as IDefineOptions;

@Table(tableOptions)
export class CourseClass extends Model<CourseClass> {
  @Column({
      type: DataType.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
  })
  public id: number;

  @ForeignKey(() => Course)
  @Column({
    allowNull: false
  })
  public course_id: number;

  @Column({
      type: DataType.CHAR(30),
      allowNull: false
  })
  public venue: string;

  @Column({
    type: DataType.CHAR(30),
    allowNull: false
  })
  public time: string;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false
  })
  public day: string;

  @Default(0)
  @Column({
    type: DataType.BOOLEAN,
  })
  public isHardCoded: boolean;
}
