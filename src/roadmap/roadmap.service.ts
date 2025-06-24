import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pagination } from '../core/shared/pagination.dto';
import { SearchOptions } from '../core/shared/searchOptions.dto';
import { BaseService } from '../core/shared/base.service';
import { Roadmap, RoadmapDoc } from './entities/roadmap.entity';
import { Populate } from 'src/core/interfaces/mongo-population.interface';

@Injectable()
export class RoadmapService extends BaseService<RoadmapDoc> {
  constructor(
    @InjectModel(Roadmap.name)
    private readonly m: Model<RoadmapDoc>,
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

    // Populate courses
    this.populateCoursesPipeline(aggregation);

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
          { 'courses.courseID.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'courses.coursePreReq.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
        ],
      },
    });
  }

  private populateCoursesPipeline = (aggregation: any) => {
    // First, unwind the courses array
    aggregation.push({ $unwind: { path: '$courses', preserveNullAndEmptyArrays: true } });

    // Populate courseID
    this.populatePipeline(aggregation, {
      from: 'courses',
      localField: 'courses.courseID',
      foreignField: '_id',
      pipeline: [],
      as: 'courses.courseID',
    });
    this.unwind(aggregation, 'courses.courseID', true);

    // Populate coursePreReq if it exists
    this.populatePipeline(aggregation, {
      from: 'courses',
      localField: 'courses.coursePreReq',
      foreignField: '_id',
      pipeline: [],
      as: 'courses.coursePreReq',
    });
    this.unwind(aggregation, 'courses.coursePreReq', true);

    // Group back to reconstruct the courses array
    aggregation.push({
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        description: { $first: '$description' },
        totalPrice: { $first: '$totalPrice' },
        totalHours: { $first: '$totalHours' },
        status: { $first: '$status' },
        discount: { $first: '$discount' },
        learningPathHighlights: { $first: '$learningPathHighlights' },
        createdAt: { $first: '$createdAt' },
        updatedAt: { $first: '$updatedAt' },
        courses: {
          $push: {
            courseID: '$courses.courseID',
            coursePreReq: '$courses.coursePreReq',
          },
        },
      },
    });
  };
} 