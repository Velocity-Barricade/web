import { Controller, Post, Body, Res, HttpStatus, Inject, Get, Param } from '@nestjs/common';
import { MessageCodeError } from '../../shared/index';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly UserService: UserService) {}

  @Post('updateCourses')
  public async updateCourses(@Body() body, @Res() res) {
    if (!body || (body && (!("firebase_email" in body) || !("courses" in body))))
      throw new MessageCodeError('user:updateCourses:missingInformation');

    await this.UserService.updateCourses(body);

    return res.status(HttpStatus.CREATED).send();
  }

  @Get('getCourses/:email')
  public async getCourses(@Param('email') email, @Res() res) {
    if (!email) throw new MessageCodeError('user:getCourses:missingEmail');

    let response = await this.UserService.getCourses(email);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getClasses/:email')
  public async getClasses(@Param('email') email, @Res() res) {
    if (!email) throw new MessageCodeError('user:getClasses:missingEmail');

    let response = await this.UserService.getClasses(email);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getCompleteTimetable')
  public async getCompleteTimetable(@Res() res) {
    let response = await this.UserService.getCompleteTimetable();
    return res.status(HttpStatus.OK).json(response);
  }
}
