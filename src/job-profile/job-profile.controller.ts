import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SearchOptions } from '../core/shared/searchOptions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../users/enums/role.enum';
import { CreateJobProfileDto } from './dto/create-job-profile.dto';
import { UpdateJobProfileDto } from './dto/update-job-profile.dto';
import { JobProfileService } from './job-profile.service';

@ApiTags('Job Profile')
@Controller('job-profile')
@UseGuards(JwtAuthGuard, RoleGuard)
export class JobProfileController {
  constructor(
    private readonly jobProfileService: JobProfileService,
  ) {}

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new job profile' })
  @ApiResponse({ status: 201, description: 'Job profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createJobProfileDto: CreateJobProfileDto) {
    return this.jobProfileService.create(createJobProfileDto);
  }

  @Post('search')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Search job profiles with filters' })
  @ApiResponse({ status: 200, description: 'Job profiles found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Body() options: SearchOptions) {
    return this.jobProfileService.findAll(options);
  }

  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get job profile by ID' })
  @ApiResponse({ status: 200, description: 'Job profile found' })
  @ApiResponse({ status: 404, description: 'Job profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id') id: string) {
    return this.jobProfileService.findOneById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update job profile by ID' })
  @ApiResponse({ status: 200, description: 'Job profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Job profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(
    @Param('id') id: string,
    @Body() updateJobProfileDto: UpdateJobProfileDto,
  ) {
    return this.jobProfileService.update(id, updateJobProfileDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete job profile by ID' })
  @ApiResponse({ status: 200, description: 'Job profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.jobProfileService.remove(id);
  }
} 