import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey
} from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';
import { Course } from '../course/course.entity';

const tableOptions: IDefineOptions = {
  timestamp: false,
  tableName: 'userCourses'
} as IDefineOptions;

@Table(tableOptions)
export class UserCourse extends Model<UserCourse> {
  @Column({
      type: DataType.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
  })
  public id: number;

  @Column({
    type: DataType.CHAR(128)
  })
  public user_uid: string;

  @ForeignKey(() => Course)
  @Column({
    allowNull: false
  })
  public course_id: number;
}
