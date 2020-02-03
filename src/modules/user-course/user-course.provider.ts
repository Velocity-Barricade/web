import { UserCourse } from './user-course.entity';

export const UserCourseProvider = {
    provide: 'UserCourseRepository',
    useValue: UserCourse
};
