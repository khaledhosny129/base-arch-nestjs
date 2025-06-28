import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { InvalidCredentialsException } from '../core/exceptions';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Request2faDto } from './dto/request-2fa.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { UserDoc } from '../users/entities/user.entity';
import { RoleEnum } from '../users/enums/role.enum';
import { UsersService } from '../users/users.service';
import { MailService } from 'mail/mail.service';
import { EmailRequest } from 'mail/interfaces';
import { ConfigService } from 'src/config/config.services';
import { studentWelcomeTemplate } from 'assets/email-temps/student-welcome.template';
import { twoFactorTemplate } from 'assets/email-temps/2fa.template';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      const user = await this.usersService.create({
        ...signupDto,
      });
      const payload = { sub: user?._id, email: user?.email };

      const { password, ...userWithoutPassword } = user.toObject?.() || user;

      if (user.role === RoleEnum.STUDENT) {
        const emailObj: EmailRequest = {
          from: this.configService.mailFrom,
          to: user.email,
          subject: 'Welcome to NextOne!',
          html: studentWelcomeTemplate(user.name),
        };

        this.mailService.sendEmail(emailObj);

        return {
          ...userWithoutPassword,
          access_token: this.jwtService.sign(payload),
        };
      }

      return {
        ...userWithoutPassword,
        access_token: this.jwtService.sign(payload),
      };
    } catch (e) {
      throw new BadRequestException(e.toString());
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne({ email: loginDto.email });

    if (!user) {
      throw new NotFoundException(`User with email ${loginDto.email} not found`);
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.twoFactorEnabled) {
      // Do not return access token yet
      return {
        require2fa: true,
        userId: user._id,
        email: user.email,
        message: '2FA verification required',
      };
    }

    const payload = { sub: user._id, email: user.email };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async request2fa(request2faDto: Request2faDto) {
    const user = await this.usersService.findOne({ email: request2faDto.email });

    if (!user) {
      throw new NotFoundException(`User with email ${request2faDto.email} not found`);
    }

    const isPasswordValid = await bcrypt.compare(
      request2faDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save code to user
    await this.usersService.update(
      user._id,
      {
        twoFactorCode: code,
        twoFactorCodeExpires: expiresAt,
      },
    );

    // Send verification email
    const emailObj: EmailRequest = {
      from: this.configService.mailFrom,
      to: user.email,
      subject: 'Email Verification',
      html: twoFactorTemplate(user.name, code),
    };

    this.mailService.sendEmail(emailObj);

    return {
      message: '2FA code sent to your email',
      email: user.email,
    };
  }

  async verify2fa(verify2faDto: Verify2faDto) {
    const user = await this.usersService.findOne({ email: verify2faDto.email });

    if (!user) {
      throw new NotFoundException(`User with email ${verify2faDto.email} not found`);
    }

    if (!user.twoFactorCode || !user.twoFactorCodeExpires) {
      throw new BadRequestException('No 2FA code requested');
    }

    if (new Date() > user.twoFactorCodeExpires) {
      // Clear expired code
      await this.usersService.update(
        user._id,
        {
          twoFactorCode: null,
          twoFactorCodeExpires: null,
        },
      );
      throw new BadRequestException('2FA code has expired');
    }

    if (user.twoFactorCode !== verify2faDto.code) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    // Clear the used code
    await this.usersService.update(
      user._id,
      {
        twoFactorCode: null,
        twoFactorCodeExpires: null,
        twoFactorEnabled: true,
      },
    );

    const payload = { sub: user._id, email: user.email };

    return {
      message: '2FA verified successfully',
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        twoFactorEnabled: true,
      },
    };
  }

  async disable2fa(userId: string) {
    await this.usersService.update(
      userId,
      {
        twoFactorEnabled: false,
        twoFactorCode: null,
        twoFactorCodeExpires: null,
      },
    );

    return {
      message: '2FA disabled successfully',
    };
  }

  async enable2fa(userId: string) {
    await this.usersService.update(
      userId,
      { twoFactorEnabled: true },
    );

    return {
      message: '2FA enabled successfully',
    };
  }

  generateJwtToken(user: UserDoc): any {
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) throw new InvalidCredentialsException();
    } else {
      throw new NotFoundException({ message: 'User not found' });
    }

    const userDoc = user.toJSON();
    delete userDoc.password;

    return userDoc;
  }

  async validateLinkedInUser(profile: any) {
    // For OIDC, email is directly on profile.email or profile._json.email
    const email = profile.email || profile._json?.email;
    const name = profile.displayName || profile._json?.name;
    const linkedinId = profile.id || profile._json?.sub;

    let user = await this.usersService.findOne({ email });
    if (!user) {
      user = await this.usersService.create({
        email,
        name,
        role: RoleEnum.STUDENT,
        isActive: true,
        linkedinId,
      });
    }
    return user;
  }
}
