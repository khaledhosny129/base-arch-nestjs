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
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { CompetencyService } from './competency.service';
import { Competency } from './entities/competency.entity';
@ApiTags('Competency')
@Controller('competency')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CompetencyController {
  constructor(
    private readonly competencyService: CompetencyService,
  ) {}

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new competency' })
  @ApiResponse({ status: 201, description: 'Competency created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createCompetencyDto: CreateCompetencyDto) {
    return this.competencyService.create(createCompetencyDto);
  }

  @Post('search')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Search competencies with filters' })
  @ApiResponse({ status: 200, description: 'Competencies found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Body() options: SearchOptions) {
    return this.competencyService.findAll(options);
  }

  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get competency by ID' })
  @ApiResponse({ status: 200, description: 'Competency found' })
  @ApiResponse({ status: 404, description: 'Competency not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id') id: string) {
    return this.competencyService.findOneById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update competency by ID' })
  @ApiResponse({ status: 200, description: 'Competency updated successfully' })
  @ApiResponse({ status: 404, description: 'Competency not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(
    @Param('id') id: string,
    @Body() updateCompetencyDto: UpdateCompetencyDto,
  ) {
    return this.competencyService.update(id, updateCompetencyDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete competency by ID' })
  @ApiResponse({ status: 200, description: 'Competency deleted successfully' })
  @ApiResponse({ status: 404, description: 'Competency not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.competencyService.remove(id);
  }
} 