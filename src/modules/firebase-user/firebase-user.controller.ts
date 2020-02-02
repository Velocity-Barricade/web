import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { MessageCodeError } from '../../shared/index';
import { FirebaseUserService } from './firebase-user.service';

@Controller('firebase-user')
export class FirebaseUserController {
    constructor(private readonly firebaseUserService: FirebaseUserService) {}

    @Get()
    public async index(@Res() res) {
        const users = await this.firebaseUserService.findAll();
        return res.status(HttpStatus.OK).json(users);
    }

    @Post()
    public async create(@Body() body, @Res() res) {
        if (!body || (body && Object.keys(body).length === 0))
            throw new MessageCodeError('user:create:missingInformation');

        await this.firebaseUserService.create(body);
        return res.status(HttpStatus.CREATED).send();
    }

    @Get(':id')
    public async show(@Param('id') id: number, @Res() res) {
        if (!id) throw new MessageCodeError('user:show:missingId');

        const user = await this.firebaseUserService.findById(id);
        return res.status(HttpStatus.OK).json(user);
    }

    @Put(':id')
    public async update(@Body() body, @Param('id') id: number, @Res() res) {
        if (!id) throw new MessageCodeError('user:update:missingId');

        await this.firebaseUserService.update(id, body);
        return res.status(HttpStatus.OK).send();
    }

    @Delete(':id')
    public async delete(@Param('id') id: number, @Res() res) {
        if (!id) throw new MessageCodeError('user:delete:missingId');

        await this.firebaseUserService.delete(id);
        return res.status(HttpStatus.OK).send();
    }
}
