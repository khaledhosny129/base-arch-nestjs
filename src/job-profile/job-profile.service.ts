import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pagination } from '../core/shared/pagination.dto';
import { SearchOptions } from '../core/shared/searchOptions.dto';
import { BaseService } from '../core/shared/base.service';
import { JobProfile, JobProfileDoc } from './entities/job-profile.entity';

@Injectable()
export class JobProfileService extends BaseService<JobProfileDoc> {
  constructor(
    @InjectModel(JobProfile.name)
    private readonly m: Model<JobProfileDoc>,
  ) {
    super(m);
  }

  async findAll(options: SearchOptions): Promise<Pagination> {
    const aggregation: any = [];
    const {
      offset,
      size,
      sort,
      dir,
      filterBy,
      searchTerm,
      attributesToRetrieve,
      filterByDateFrom,
      filterByDateTo,
    } = options;

    // Populate all references
    this.populateReferencesPipeline(aggregation);

    if (sort && dir) this.sort(aggregation, sort, dir);

    if (filterBy?.length) this.filter(aggregation, filterBy);

    if (searchTerm) this.search(aggregation, searchTerm);

    if (attributesToRetrieve?.length)
      this.project(aggregation, attributesToRetrieve);

    if (filterByDateFrom && filterByDateTo) {
      aggregation.push(
        {
          $addFields: {
            createdAtToString: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
          },
        },
        {
          $match: {
            createdAtToString: { $gte: filterByDateFrom, $lte: filterByDateTo },
          },
        },
        {
          $project: {
            createdAtToString: 0,
          },
        },
      );
    }

    return this.aggregate(aggregation, offset, size);
  }

  private search(aggregation: any, searchTerm: string) {
    aggregation.push({
      $match: {
        $or: [
          { name: { $regex: new RegExp(searchTerm), $options: 'i' } },
          { description: { $regex: new RegExp(searchTerm), $options: 'i' } },
          { education: { $regex: new RegExp(searchTerm), $options: 'i' } },
          { skillsNRequirements: { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'roadmapId.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'jobProfileCategory.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'competencies.competencyID.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
        ],
      },
    });
  }

  private populateReferencesPipeline = (aggregation: any) => {
    // Populate roadmapId
    this.populatePipeline(aggregation, {
      from: 'roadmaps',
      localField: 'roadmapId',
      foreignField: '_id',
      pipeline: [],
      as: 'roadmapId',
    });
    this.unwind(aggregation, 'roadmapId', true);

    // Populate jobProfileCategory array
    this.populatePipeline(aggregation, {
      from: 'categories',
      localField: 'jobProfileCategory',
      foreignField: '_id',
      pipeline: [],
      as: 'jobProfileCategory',
    });

    // Populate competencies array
    this.populateCompetenciesPipeline(aggregation);
  };

  private populateCompetenciesPipeline = (aggregation: any) => {
    // Unwind competencies array
    aggregation.push({ $unwind: { path: '$competencies', preserveNullAndEmptyArrays: true } });

    // Populate competencyID in competencies
    this.populatePipeline(aggregation, {
      from: 'competencies',
      localField: 'competencies.competencyID',
      foreignField: '_id',
      pipeline: [],
      as: 'competencies.competencyID',
    });
    this.unwind(aggregation, 'competencies.competencyID', true);

    // Group back to reconstruct the competencies array
    aggregation.push({
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        description: { $first: '$description' },
        roadmapId: { $first: '$roadmapId' },
        jobProfileCategory: { $first: '$jobProfileCategory' },
        education: { $first: '$education' },
        skillsNRequirements: { $first: '$skillsNRequirements' },
        salaryRange: { $first: '$salaryRange' },
        marketDemand: { $first: '$marketDemand' },
        jobProfileVideos: { $first: '$jobProfileVideos' },
        jobProfileImages: { $first: '$jobProfileImages' },
        createdAt: { $first: '$createdAt' },
        updatedAt: { $first: '$updatedAt' },
        competencies: {
          $push: {
            competencyID: '$competencies.competencyID',
            percentage: '$competencies.percentage',
            formula: '$competencies.formula',
          },
        },
      },
    });
  };
} 