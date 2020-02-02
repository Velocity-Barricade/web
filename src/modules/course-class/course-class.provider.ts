import { CourseClass } from './course-class.entity';

export const CourseClassProvider = {
    provide: 'CourseRepository',
    useValue: CourseClass
};
