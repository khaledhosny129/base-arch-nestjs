import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RequestWithUser } from '../core/interfaces/user-request.interface';
import { SearchOptions } from '../core/shared/searchOptions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum } from './enums/role.enum';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get user profile' })
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: RequestWithUser) {
    return { user: req.user };
  }

  @Patch('/me')
  @ApiOperation({ summary: 'Update user profile' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.USER)
  updateMe(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user._id, updateUserDto);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search users' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  findAll(@Body() options: SearchOptions) {
    return this.usersService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA disabled successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '2FA disabled successfully' }
      }
    }
  })
  async disable2fa(@Req() req: RequestWithUser) {
    return await this.authService.disable2fa(req.user._id.toString());
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable 2FA' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA enabled successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '2FA enabled successfully' }
      }
    }
  })
  async enable2fa(@Req() req: RequestWithUser) {
    return await this.authService.enable2fa(req.user._id.toString());
  }
}
