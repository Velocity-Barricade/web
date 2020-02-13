import { Injectable, Inject } from '@nestjs/common';
import { UserCourse } from '../user-course/user-course.entity';
import { Course } from '../course/course.entity';
import { CourseClass } from '../course-class/course-class.entity';
import { MessageCodeError } from '../../shared';

@Injectable()
export class UserService {

  constructor(
    @Inject('UserCourseRepository') private readonly UserCourseRepository: typeof UserCourse,
    @Inject('CourseRepository') private readonly CourseRepository: typeof Course,
    @Inject('SequelizeInstance') private readonly sequelizeInstance
) {}

  async updateCourses(body): Promise<any> {
    let userCourses = [];

    body.courses.forEach(course => {
      userCourses.push({ user_email: body.firebase_email, course_id: course.id })
    });

    return await this.sequelizeInstance.transaction(async transaction => {
      await this.UserCourseRepository.destroy({ where: { user_email: body.firebase_email }, transaction: transaction });
      return await this.UserCourseRepository.bulkCreate(userCourses, { transaction: transaction });
    });
  }

  private compareTime(first, second) {
    let startTimeFirst = parseInt(first["time"].split('-')[0]);
    let startTimeSecond = parseInt(second["time"].split('-')[0]);

    // weird hacks to get around 12-hours time in timetable header
    if (startTimeFirst >= 8 && startTimeSecond >= 8 || startTimeFirst <= 3 && startTimeSecond <= 3) {
      return (startTimeFirst < startTimeSecond) ? -1 : 1;
    }
    return (startTimeFirst < startTimeSecond) ? 1 : -1;
  }

  private transformClasses(courses) {
    let dayClasses = {};
    [0, 1, 2, 3, 4, 5, 6].forEach(day => dayClasses[day] = []);
    let removableProperties = ["id", "course_id", "isHardCoded", "day"];

    courses.forEach(course => {
      let nestedCourses = (course.course) ? course.course : course;

      nestedCourses.courseClasses.forEach(courseClass => {
        courseClass = Object(courseClass.toJSON());
        let day = courseClass["day"]
        removableProperties.forEach(prop => delete courseClass[prop]);
        courseClass["name"] = nestedCourses.name;
        dayClasses[day].push(courseClass);
      })
    })

    Object.keys(dayClasses).forEach(key => {
      dayClasses[key] = dayClasses[key].sort(this.compareTime);
    })

    return dayClasses;
  }

  async getClasses(email): Promise<any> {

    let courses = await this.UserCourseRepository.findAll({
      where: {
        user_email: email
      },
      include: [
        {
          model: Course,
          include: [CourseClass]
        }
      ]
    });

    if (courses.length == 0) {
      throw new MessageCodeError('user:coursesNotFound');
    }

    return this.transformClasses(courses);
  }

  async getCourses(email): Promise<any> {
    let courses = await this.UserCourseRepository.findAll({
      where: {
        user_email: email
      },
      attributes: ['course_id']
    });

    if (courses.length == 0) {
      throw new MessageCodeError('user:coursesNotFound');
    }

    return courses;
  }

  async getCompleteTimetable() {
    let courses = await this.CourseRepository.findAll({
      include: [CourseClass]
    });

    return this.transformClasses(courses)
  }
}
