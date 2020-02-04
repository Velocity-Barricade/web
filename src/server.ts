import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { DispatchError } from './shared/filters/dispatch-error';
import { ApplicationModule } from './app.module';
import * as admin from 'firebase-admin';
var serviceAccount = require("../timetable-notifier-firebase-adminsdk-v7sts-754426400d.json");
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap(): Promise<any> {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://timetable-notifier.firebaseio.com"
    });

    const app = await NestFactory.create(ApplicationModule);
    app.useGlobalFilters(new DispatchError());

    let nodeEnvironment = process.env.NODE_ENV;
    if (nodeEnvironment === "development") {
        const options = new DocumentBuilder()
            .setTitle('Timetable Notifier')
            .setDescription('Timetable Notifier')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);
    }

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
