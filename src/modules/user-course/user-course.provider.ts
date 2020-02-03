import { UserCourse } from './user-course.entity';

export const UserCourseProvider = {
    provide: 'CourseRepository',
    useValue: UserCourse
};
