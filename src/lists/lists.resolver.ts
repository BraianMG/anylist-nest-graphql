import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateListInput, UpdateListInput } from './dto';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List, { name: 'createList' })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  async updateList(
    @CurrentUser() user: User,
    @Args('updateListInput') updateListInput: UpdateListInput,
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  async removeList(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }
}
