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

  @Get('getClasses/:email')
  public async getClasses(@Param('email') email, @Res() res) {
    if (!email) throw new MessageCodeError('user:getClasses:missingEmail');

    let resp = await this.UserService.getClasses(email);
    return res.status(HttpStatus.OK).json(resp);
  }
}
