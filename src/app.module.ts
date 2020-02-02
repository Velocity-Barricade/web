import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseUserModule } from './modules/firebase-user/firebase-user.module';
import { CourseModule } from './modules/course/course.module';

@Module({
    imports: [UserModule, AuthModule, FirebaseUserModule, CourseModule]
})
export class ApplicationModule {}
