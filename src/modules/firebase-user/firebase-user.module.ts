import { Module, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FirebaseUserController } from './firebase-user.controller';
import { FirebaseUserService } from './firebase-user.service';
import { FirebaseUser } from './firebase-user';
import { FirebaseUserProvider } from './firebase-user.provider';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { FirebaseAuthMiddleware } from '../../shared/index';

@Module({
  imports: [DatabaseModule],
  controllers: [FirebaseUserController],
  providers: [FirebaseUserService, FirebaseUser, FirebaseUserProvider]
})
export class FirebaseUserModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(FirebaseAuthMiddleware)
        .forRoutes(
            { path: '/firebase-user', method: RequestMethod.GET },
            { path: '/firebase-user/:id', method: RequestMethod.GET },
            { path: '/firebase-user/:id', method: RequestMethod.PUT },
            { path: '/firebase-user/:id', method: RequestMethod.DELETE }
        );
  }
}
