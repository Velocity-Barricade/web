import { Injectable, Inject } from '@nestjs/common';
import { UserCourse } from '../user-course/user-course.entity';
import { Course } from '../course/course.entity';
import { CourseClass } from '../course-class/course-class.entity';

@Injectable()
export class UserService {

  constructor(
    @Inject('UserCourseRepository') private readonly UserCourseRepository: typeof UserCourse,
    @Inject('SequelizeInstance') private readonly sequelizeInstance
) {}

  async updateCourses(body): Promise<any> {
    let userCourses = [];

    body.courses.forEach(course => {
      userCourses.push({ user_uid: body.firebase_uid, course_id: course.id })
    });

    return await this.sequelizeInstance.transaction(async transaction => {
      await this.UserCourseRepository.destroy({ where: { user_uid: body.firebase_uid }, transaction: transaction });
      return await this.UserCourseRepository.bulkCreate(userCourses, { transaction: transaction });
    });
  }

  async getClasses(firebase_uid): Promise<any> {
    firebase_uid = "testuid";

    let courses = await this.UserCourseRepository.findAll({
      where: {
        user_uid: firebase_uid
      },
      include: [
        {
          model: Course,
          include: [CourseClass]
        }
      ]
    });

    let dayClasses = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []};
    [0, 1, 2, 3, 4, 5, 6].forEach(day => dayClasses[day] = []);
    let removableProperties = ["id", "course_id", "isHardCoded", "day"];

    function compareTime(first, second) {
      let startTimeFirst = parseInt(first["time"].split('-')[0]);
      let startTimeSecond = parseInt(second["time"].split('-')[0]);

      // weird hacks to get around 12-hours time in timetable header
      if (startTimeFirst >= 8 && startTimeSecond >= 8 || startTimeFirst <= 3 && startTimeSecond <= 3) {
        return (startTimeFirst < startTimeSecond) ? -1 : 1;
      }
      return (startTimeFirst < startTimeSecond) ? 1 : -1;
    }

    courses.forEach(course => {
        course.course.courseClasses.forEach(courseClass => {
          courseClass = Object(courseClass.toJSON());
          let day = courseClass["day"]
          removableProperties.forEach(prop => delete courseClass[prop]);
          courseClass["name"] = course.course.name;
          dayClasses[day].push(courseClass);
        })
    })

    Object.keys(dayClasses).forEach(key => {
      dayClasses[key] = dayClasses[key].sort(compareTime);
    })

    return dayClasses;
  }
}
