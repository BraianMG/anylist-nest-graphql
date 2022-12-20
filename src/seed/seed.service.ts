import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new UnauthorizedException('We cannot run SEED on Prod');

    await this.deleteDatabase();
    return true;
  }

  async deleteDatabase() {
    // Borrar Items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borrar Users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }
}
