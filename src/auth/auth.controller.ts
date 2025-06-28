import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { RequestWithUser } from '../core/interfaces/user-request.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Request2faDto } from './dto/request-2fa.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    try {
      //* 1 - create User
      const user = await this.authService.signup(signupDto);

      return { user };
    } catch (error) {
      if (error instanceof HttpException)
        throw new BadRequestException(error.getResponse());
      else throw new BadGatewayException(error.toString());
    }
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login endpoint' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    req.session.jwt = result.access_token;
    res.cookie('jwt', result.access_token, { httpOnly: true });

    return result;
  }

  @Post('request-2fa')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: Request2faDto })
  @ApiOperation({ summary: 'Request 2FA verification code' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA code sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '2FA code sent to your email' },
        email: { type: 'string', example: 'user@example.com' }
      }
    }
  })
  async request2fa(@Body() request2faDto: Request2faDto) {
    try {
      return await this.authService.request2fa(request2faDto);
    } catch (error) {
      if (error instanceof HttpException)
        throw new BadRequestException(error.getResponse());
      else throw new BadGatewayException(error.toString());
    }
  }

  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: Verify2faDto })
  @ApiOperation({ summary: 'Verify 2FA code' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '2FA verified successfully' },
        user: { type: 'object' },
        access_token: { type: 'string' }
      }
    }
  })
  async verify2fa(@Body() verify2faDto: Verify2faDto) {
    try {
      return await this.authService.verify2fa(verify2faDto);
    } catch (error) {
      if (error instanceof HttpException)
        throw new BadRequestException(error.getResponse());
      else throw new BadGatewayException(error.toString());
    }
  }

  private addJwtToCookie(req: RequestWithUser, res: Response) {
    try {
      const token = this.authService.generateJwtToken(req.user).access_token;
      req.session.jwt = token;
      res.cookie('jwt', token, { httpOnly: true });
    } catch (error) {
      throw new BadGatewayException(error.toString());
    }
  }

  @ApiOperation({ summary: 'LinkedIn OAuth login (browser redirect only)' })
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth() {}

  @ApiOperation({ summary: 'LinkedIn OAuth callback (browser redirect only)' })
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthCallback(@Req() req: Request, @Res() res: Response) {
    // req.user will have the user info
    // You can generate a JWT and redirect or respond as needed
    const user = req.user;
    // Example: generate JWT and redirect to frontend with token
    // const token = this.authService.generateJwtToken(user);
    // res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token.access_token}`);
    res.json({ user });
  }
}
