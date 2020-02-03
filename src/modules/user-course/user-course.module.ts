import { Module } from '@nestjs/common';
import { UserCourseProvider } from './user-course.provider';

@Module({
  providers: [UserCourseProvider]
})
export class UserCourseModule {}
