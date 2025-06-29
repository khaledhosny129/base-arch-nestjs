import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pagination } from '../core/shared/pagination.dto';
import { SearchOptions } from '../core/shared/searchOptions.dto';
import { BaseService } from '../core/shared/base.service';
import { Student, StudentDoc } from './entities/student.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class StudentService extends BaseService<StudentDoc> {
  constructor(
    @InjectModel(Student.name)
    private readonly m: Model<StudentDoc>,
    private readonly usersService: UsersService,
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

  async remove(id: string) {
    // First get the student to find the associated user ID
    const student = await this.findOneById(id);
    
    // Remove the student profile
    await super.remove(id);
    
    // Remove the associated user
    if (student.userId) {
      await this.usersService.remove(student.userId.toString());
    }
    
    return true;
  }

  private search(aggregation: any, searchTerm: string) {
    aggregation.push({
      $match: {
        $or: [
          { 'userId.name': { $regex: new RegExp(searchTerm), $options: 'i' } },
          { 'userId.email': { $regex: new RegExp(searchTerm), $options: 'i' } },
          { educationalLevel: { $regex: new RegExp(searchTerm), $options: 'i' } },
        ],
      },
    });
  }
} 


