import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseAuthMiddleware } from '../../shared/index';
import { DatabaseModule } from '../database/database.module';
import { UserCourseModule } from '../user-course/user-course.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [DatabaseModule, UserCourseModule, CourseModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(FirebaseAuthMiddleware)
        .forRoutes(
            { path: '/user/updateCourses', method: RequestMethod.POST }
        );
}
}
