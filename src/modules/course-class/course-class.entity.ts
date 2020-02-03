import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Default,
  TableOptions,
  BelongsTo
} from 'sequelize-typescript';
import { Course } from '../course/course.entity';

const tableOptions: TableOptions = {
  timestamps: false,
  tableName: 'courseClasses'
} as TableOptions;

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

  @BelongsTo(() => Course)
  course: Course

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
