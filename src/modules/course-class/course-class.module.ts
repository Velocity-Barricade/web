import { Module } from '@nestjs/common';
import { CourseClass } from './course-class.entity';

@Module({
  providers: [CourseClass],
  controllers: []
})
export class CourseClassModule {}
