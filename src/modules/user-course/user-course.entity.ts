import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  TableOptions,
  BelongsTo
} from 'sequelize-typescript';
import { Course } from '../course/course.entity';

const tableOptions: TableOptions = {
  timestamps: false,
  tableName: 'userCourses'
} as TableOptions;

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

  @BelongsTo(() => Course)
  course: Course
}
