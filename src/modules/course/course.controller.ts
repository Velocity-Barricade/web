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

    @Post()
    public async create(@Body() body, @Res() res) {
        if (!body || (body && Object.keys(body).length === 0))
            throw new MessageCodeError('course:create:missingInformation');

        await this.courseService.create(body);
        return res.status(HttpStatus.CREATED).send();
    }

    @Get('update')
    public async updateTimetable(@Res() res) {
        await this.courseService.updateTimetable();
        return res.status(HttpStatus.OK).send();
    }

    @Get(':id')
    public async show(@Param('id') id: number, @Res() res) {
        if (!id) throw new MessageCodeError('course:show:missingId');

        const user = await this.courseService.findById(id);
        return res.status(HttpStatus.OK).json(user);
    }

    @Put(':id')
    public async update(@Body() body, @Param('id') id: number, @Res() res) {
        if (!id) throw new MessageCodeError('course:update:missingId');

        await this.courseService.update(id, body);
        return res.status(HttpStatus.OK).send();
    }

    @Delete(':id')
    public async delete(@Param('id') id: number, @Res() res) {
        if (!id) throw new MessageCodeError('course:delete:missingId');

        await this.courseService.delete(id);
        return res.status(HttpStatus.OK).send();
    }
}
