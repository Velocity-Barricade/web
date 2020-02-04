import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { MessageCodeError } from '../../shared/index';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Get()
    public async index(@Res() res) {
        const courses = await this.courseService.findAll();
        return res.status(HttpStatus.OK).json(courses);
    }

    @Get('update')
    public async updateTimetable(@Res() res) {
        await this.courseService.updateTimetable();
        return res.status(HttpStatus.OK).send();
    }
}
