import { Module } from '@nestjs/common';
import { CourseClass } from './course-class.provider';
import { CourseClassService } from './course-class.service';
import { CourseClassController } from './course-class.controller';

@Module({
  providers: [CourseClass, CourseClassService],
  controllers: [CourseClassController]
})
export class CourseClassModule {}
