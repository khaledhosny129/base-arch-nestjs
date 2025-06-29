import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SearchOptions } from '../core/shared/searchOptions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../users/enums/role.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { RequestWithUser } from 'src/core/interfaces/user-request.interface';
import { Types } from 'mongoose';
import { toObjectId } from 'src/core/utils/mongo.util';

@ApiTags('Student')
@Controller('student')
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
  ) {}

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new student profile' })
  @ApiResponse({ status: 201, description: 'Student profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Post('search')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Search students with filters' })
  @ApiResponse({ status: 200, description: 'Students found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Body() options: SearchOptions) {
    return this.studentService.findAll(options);
  }

  @Get('my-profile')
  @Roles(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Get my profile' })
  @ApiResponse({ status: 200, description: 'My profile found' })
  @ApiResponse({ status: 404, description: 'My profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getMyProfile(@Req() req: RequestWithUser) {
    return await this.studentService.findOne({ userId: toObjectId(req.user.id) }, { userId: 0 });
  }

  @Patch('my-profile')
  @Roles(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Update my profile' })
  @ApiResponse({ status: 200, description: 'My profile updated successfully' })
  @ApiResponse({ status: 404, description: 'My profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  updateMyProfile(@Req() req: RequestWithUser, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.updateOne({ userId: toObjectId(req.user.id) }, updateStudentDto, { userId: 0 });
  }

  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get student profile by ID' })
  @ApiResponse({ status: 200, description: 'Student profile found' })
  @ApiResponse({ status: 404, description: 'Student profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOneById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update student profile by ID' })
  @ApiResponse({ status: 200, description: 'Student profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Student profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete student profile by ID' })
  @ApiResponse({ status: 200, description: 'Student profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}