import { Module, HttpModule } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseProvider } from './course.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [CourseService, CourseProvider],
  controllers: [CourseController]
})
export class CourseModule {}
