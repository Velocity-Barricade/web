import { Course } from './course.entity';

export const CourseProvider = {
    provide: 'CourseRepository',
    useValue: Course
};
