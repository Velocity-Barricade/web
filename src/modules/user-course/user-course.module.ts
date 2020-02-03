import { Module } from '@nestjs/common';
import { UserCourseProvider } from './user-course.provider';

@Module({
  providers: [UserCourseProvider],
  exports: [UserCourseProvider]
})
export class UserCourseModule {}
