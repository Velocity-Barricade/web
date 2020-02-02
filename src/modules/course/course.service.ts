import { Inject, Injectable, HttpService } from '@nestjs/common';
import { MessageCodeError } from '../../shared/errors/message-code-error';
import { Course } from './course.entity';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

@Injectable()
export class CourseService {
    constructor(
        @Inject('CourseRepository') private readonly courseRepository: typeof Course,
        @Inject('SequelizeInstance') private readonly sequelizeInstance,
        private readonly http: HttpService
    ) {}

    public async findAll(): Promise<Array<Course>> {
        return await this.courseRepository.findAll<Course>();
    }

    public async findOne(options: Object): Promise<Course | null> {
        return await this.courseRepository.findOne<Course>(options);
    }

    public async findById(id: number): Promise<Course | null> {
        return await this.courseRepository.findById<Course>(id);
    }

    public async create(course): Promise<Course> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await this.courseRepository.create<Course>(course, {
                returning: true,
                transaction
            });
        });
    }

    public async update(id: number, newValue): Promise<Course | null> {
        return await this.sequelizeInstance.transaction(async transaction => {
            let course = await this.courseRepository.findById<Course>(id, {
                transaction
            });
            if (!course) throw new MessageCodeError('course:notFound');

            course = this._assign(course, newValue);
            return await course.save({
                returning: true,
                transaction
            });
        });
    }

    public async delete(id: number): Promise<void> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await this.courseRepository.destroy({
                where: { id },
                transaction
            });
        });
    }

    private _assign(course, newValue): Course {
        for (const key of Object.keys(course)) {
            if (course[key] !== newValue[key]) course[key] = newValue[key];
        }

        return course as Course;
    }

    public async updateTimetable() {
        console.log("here");
        const timetableLink = process.env.TIMETABLE_SITES_LINK;
        const timetableHtmlId = process.env.TIMETABLE_SITES_DOWNLOAD_BUTTON_ID;

        const response = await this.http.get(timetableLink).first().toPromise();

        const $ = cheerio.load(response.data);
        let downloadLink = "https://sites.google.com" + $('div[id^=attachment-download-wuid] > a').attr('href');

        const writer = fs.createWriteStream('./sheet.xlsx');

        const response2 = await this.http.axiosRef({
            url: downloadLink,
            method: 'GET',
            responseType: 'stream',
        });

        response2.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
}
