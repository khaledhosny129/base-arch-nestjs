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
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { RoadmapService } from './roadmap.service';

@ApiTags('Roadmap')
@Controller('roadmap')
@UseGuards(JwtAuthGuard, RoleGuard)
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService,
  ) {}

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new roadmap' })
  @ApiResponse({ status: 201, description: 'Roadmap created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapService.create(createRoadmapDto);
  }

  @Post('search')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Search roadmaps with filters' })
  @ApiResponse({ status: 200, description: 'Roadmaps found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Body() options: SearchOptions) {
    return this.roadmapService.findAll(options);
  }

  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get roadmap by ID' })
  @ApiResponse({ status: 200, description: 'Roadmap found' })
  @ApiResponse({ status: 404, description: 'Roadmap not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id') id: string) {
    return this.roadmapService.findOneById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update roadmap by ID' })
  @ApiResponse({ status: 200, description: 'Roadmap updated successfully' })
  @ApiResponse({ status: 404, description: 'Roadmap not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(
    @Param('id') id: string,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    return this.roadmapService.update(id, updateRoadmapDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete roadmap by ID' })
  @ApiResponse({ status: 200, description: 'Roadmap deleted successfully' })
  @ApiResponse({ status: 404, description: 'Roadmap not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.roadmapService.remove(id);
  }
} 