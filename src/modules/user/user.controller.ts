import { Controller, Post, Body, Res, HttpStatus, Inject, Get } from '@nestjs/common';
import { MessageCodeError } from '../../shared/index';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly UserService: UserService) {}

  @Post('updateCourses')
  public async updateCourses(@Body() body, @Res() res) {
    if (!body || (body && (!("firebase_uid" in body) || !("courses" in body))))
      throw new MessageCodeError('user:updateCourses:missingInformation');

    await this.UserService.updateCourses(body);

    return res.status(HttpStatus.CREATED).send();
  }

  @Get('getClasses')
  public async getClasses(@Body() body, @Res() res) {
    let resp = await this.UserService.getClasses(body.firebase_uid);
    return res.status(HttpStatus.OK).json(resp);
  }
}
