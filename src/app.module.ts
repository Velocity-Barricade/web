import { Module } from '@nestjs/common';
import { CourseModule } from './modules/course/course.module';
import { CourseClassModule } from './modules/course-class/course-class.module';
import { UserCourseModule } from './modules/user-course/user-course.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [CourseModule, CourseClassModule, UserCourseModule, UserModule]
})
export class ApplicationModule {}
