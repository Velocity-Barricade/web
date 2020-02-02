import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { DispatchError } from './shared/filters/dispatch-error';
import { ApplicationModule } from './app.module';
import * as admin from 'firebase-admin';
var serviceAccount = require("../timetable-notifier-firebase-adminsdk-v7sts-754426400d.json");

async function bootstrap(): Promise<any> {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://timetable-notifier.firebaseio.com"
    });

    const app = await NestFactory.create(ApplicationModule);
    app.useGlobalFilters(new DispatchError());
    await app.listen(3000);
}

bootstrap();
