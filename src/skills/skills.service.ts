import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pagination } from '../core/shared/pagination.dto';
import { SearchOptions } from '../core/shared/searchOptions.dto';
import { BaseService } from '../core/shared/base.service';
import { Skill, SkillDoc } from './entities/skill.entity';
import { Populate } from 'src/core/interfaces/mongo-population.interface';

@Injectable()
export class SkillsService extends BaseService<SkillDoc> {
  constructor(
    @InjectModel(Skill.name)
    private readonly m: Model<SkillDoc>,
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


    // Populate competency and categories
    this.populateCompetencyPipeline(aggregation);
    this.populateCategoriesPipeline(aggregation);

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
          { 'competency.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'categories.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
        ],
      },
    });
  }

  private populateCompetencyPipeline = (aggregation: any) => {
    let populateParams: Populate = {
      from: 'competencies',
      localField: 'competencyId',
      foreignField: '_id',
      pipeline: [],
      as: 'competency',
    };

    this.unwind(aggregation, populateParams.as);
    this.populatePipeline(aggregation, populateParams);
  }

  private populateCategoriesPipeline = (aggregation: any) => {
    let populateParams: Populate = {
      from: 'categories',
      localField: 'categoriesIDs',
      foreignField: '_id',
      as: 'categories',
      pipeline: [],
    };  

    this.populatePipeline(aggregation, populateParams);
  };
} 