import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { InjectConnection } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize'

import { GetUser } from '@/decorators'
import { TokenJwtGuard } from '@/guards'
import { Post, User } from '@/models'
import { CreatePostDto } from '@/modules/post/dtos'
import { PostService } from '@/modules/post/post.service'

@Resolver()
export class PostResolver {
  constructor(
    private readonly post: PostService,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  @Mutation(() => Post, { name: 'create_post' })
  @UseGuards(TokenJwtGuard)
  async createPost(@Args('data') data: CreatePostDto, @GetUser() user: User) {
    return await this.sequelize.transaction(async t => {
      return await this.post.createPost({ data, user_id: user.id }, t)
    })
  }

  @Query(() => [Post], { name: 'posts' })
  @UseGuards(TokenJwtGuard)
  async getPosts(@GetUser() user: User) {
    return await this.sequelize.transaction(async t => {
      return await this.post.findAll({ user_id: user.id }, t)
    })
  }

  @Query(() => Post, { name: 'post' })
  @UseGuards(TokenJwtGuard)
  async getPost(
    @Args('id', { type: () => Int }) id: number,
    @GetUser() user: User
  ) {
    return await this.sequelize.transaction(async t => {
      return await this.post.findOne({ post_id: id, user_id: user.id }, t)
    })
  }
}
