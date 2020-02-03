import { Inject, Injectable, HttpService } from '@nestjs/common';
import { MessageCodeError } from '../../shared/errors/message-code-error';
import { Course } from './course.entity';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { CourseClass } from '../course-class/course-class.entity';

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
        return await this.courseRepository.findByPk<Course>(id);
    }

    public async create(course): Promise<Course> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await this.courseRepository.create<Course>(course, {
                transaction
            });
        });
    }

    public async update(id: number, newValue): Promise<Course | null> {
        return await this.sequelizeInstance.transaction(async transaction => {
            let course = await this.courseRepository.findByPk<Course>(id, {
                transaction
            });
            if (!course) throw new MessageCodeError('course:notFound');

            course = this._assign(course, newValue);
            return await course.save({
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
        const timetableLink = process.env.TIMETABLE_SITES_LINK;
        const timetableHtmlId = process.env.TIMETABLE_SITES_DOWNLOAD_BUTTON_ID;

        const response = await this.http.get(timetableLink).first().toPromise();

        const $ = cheerio.load(response.data);
        let downloadLink = "https://sites.google.com" + $('div[id^=attachment-download-wuid] > a').attr('href');

        const writer = fs.createWriteStream('./sheet.xlsx');

        const fileResponse = await this.http.axiosRef({
            url: downloadLink,
            method: 'GET',
            responseType: 'stream',
        });

        fileResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        var workbook = XLSX.readFile('./sheet.xlsx');
        let worksheetsCount = workbook.SheetNames.length;

        const ec = (r, c) => {
            return XLSX.utils.encode_cell({r:r,c:c})
        }

        let course_dict = {}

        let worksheetIdx, dayIdx;
        // Only run for last 5 worksheets (Monday - Friday)
        for (dayIdx = 0; dayIdx < 5; dayIdx++) {
            worksheetIdx = worksheetsCount - 5 + dayIdx;
            let worksheet = workbook.Sheets[workbook.SheetNames[worksheetIdx]];

            let worksheetRange = XLSX.utils.decode_range(worksheet["!ref"])
            for(var rowIdx = 4; rowIdx < worksheetRange.e.r; ++rowIdx){
                for(var colIdx = 1; colIdx <= worksheetRange.e.c; ++colIdx){
                    if (!worksheet[ec(rowIdx, colIdx)]) continue;
                    // replaces multi spaces with single space
                    let cellValue: string = worksheet[ec(rowIdx, colIdx)].v.toString().replace(/ +(?= )/g,'');

                    // worksheet[ec(rowIdx, colIdx)].v = cellValue;

                    if (!(cellValue in course_dict)) {
                        course_dict[cellValue] = [];
                    }

                    // temp hack
                    if (cellValue.length < 5) continue;

                    let venue = worksheet[ec(rowIdx, 0)].v.toString();
                    let time = worksheet[ec(2, colIdx)].v.toString();
                    let day = dayIdx;

                    course_dict[cellValue].push({ venue, time, day })
                }
            }
        }

        Object.keys(course_dict).forEach(key => {
            Course.create({ name: key }).then(course => {
                course_dict[key].forEach(value => {
                    CourseClass.create({
                        course_id: course.id,
                        venue: value.venue,
                        time: value.time,
                        day: value.day,
                        isHardCoded: 0
                    })
                })
            });
        });
    }
}
