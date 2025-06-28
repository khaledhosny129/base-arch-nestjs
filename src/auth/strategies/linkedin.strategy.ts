import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { AuthService } from '../auth.service';
import { ConfigService } from 'src/config/config.services';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const clientID = configService.linkedinClientId;
    const clientSecret = configService.linkedinClientSecret;
    const callbackURL = configService.linkedinCallbackUrl;
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['openid', 'profile', 'email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    console.log('LinkedIn validate called');
    console.log('accessToken:', accessToken);
    console.log('refreshToken:', refreshToken);
    console.log('profile:', profile);
    // Find or create the user in your DB
    try {
      const user = await this.authService.validateLinkedInUser(profile);
      done(null, user);
    } catch (err) {
      console.error('Error in validateLinkedInUser:', err);
      done(err, null);
    }
  }
}
