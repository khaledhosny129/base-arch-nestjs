import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JobProfile, jobProfileSchema } from './entities/job-profile.entity';
import { JobProfileController } from './job-profile.controller';
import { JobProfileService } from './job-profile.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JobProfile.name, schema: jobProfileSchema }]),
  ],
  controllers: [JobProfileController],
  providers: [JobProfileService],
  exports: [JobProfileService],
})
export class JobProfileModule {} 