import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pagination } from '../core/shared/pagination.dto';
import { SearchOptions } from '../core/shared/searchOptions.dto';
import { BaseService } from '../core/shared/base.service';
import { Question, QuestionDoc } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService extends BaseService<QuestionDoc> {
  constructor(
    @InjectModel(Question.name)
    private readonly m: Model<QuestionDoc>,
  ) {
    super(m);
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<QuestionDoc> {
    // Validate that totalWeight equals sum of option weights
    this.validateTotalWeight(createQuestionDto);
    
    return super.create(createQuestionDto);
  }

  async update(id: string, updateQuestionDto: any): Promise<QuestionDoc> {
    // If updating totalWeight or options, validate the relationship
    if (updateQuestionDto.totalWeight !== undefined || updateQuestionDto.options !== undefined) {
      const existingQuestion = await this.findOneById(id);
      const questionData = {
        ...existingQuestion.toObject(),
        ...updateQuestionDto,
      };
      this.validateTotalWeight(questionData);
    }
    
    return super.update(id, updateQuestionDto);
  }

  private validateTotalWeight(questionData: any): void {
    if (!questionData.options || !Array.isArray(questionData.options)) {
      throw new BadRequestException('Question must have options array');
    }

    const optionsSum = questionData.options.reduce((sum: number, option: any) => {
      return sum + (option.weight || 0);
    }, 0);

    if (questionData.totalWeight !== optionsSum) {
      throw new BadRequestException(
        `Total weight (${questionData.totalWeight}) must equal the sum of option weights (${optionsSum})`
      );
    }
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

    if (sort && dir) this.sort(aggregation, sort, dir);

    if (filterBy?.length) this.filter(aggregation, filterBy);

    if (searchTerm) this.search(aggregation, searchTerm);

    if (attributesToRetrieve?.length) this.project(aggregation, attributesToRetrieve);
    
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
          { questionName: { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'options.text': { $regex: new RegExp(searchTerm), $options: 'i' } },
        ],
      },
    });
  }
} 