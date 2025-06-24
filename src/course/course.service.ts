import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pagination } from '../core/shared/pagination.dto';
import { SearchOptions } from '../core/shared/searchOptions.dto';
import { BaseService } from '../core/shared/base.service';
import { Course, CourseDoc } from './entities/course.entity';
import { Populate } from 'src/core/interfaces/mongo-population.interface';

@Injectable()
export class CourseService extends BaseService<CourseDoc> {
  constructor(
    @InjectModel(Course.name)
    private readonly m: Model<CourseDoc>,
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

    // Populate skills, category
    this.populateSkillsPipeline(aggregation);
    this.populateCategoryPipeline(aggregation);

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
          { 'category.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'skills.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
        ],
      },
    });
  }

  private populateSkillsPipeline = (aggregation: any) => {
    let populateParams: Populate = {
      from: 'skills',
      localField: 'skills',
      foreignField: '_id',
      as: 'skills',
      pipeline: [],
    };

    this.populatePipeline(aggregation, populateParams);
  };

  private populateCategoryPipeline = (aggregation: any) => {
    let populateParams: Populate = {
      from: 'categories',
      localField: 'category',
      foreignField: '_id',
      pipeline: [],
      as: 'category',
    };

    this.unwind(aggregation, populateParams.as);
    this.populatePipeline(aggregation, populateParams);
  };
} 