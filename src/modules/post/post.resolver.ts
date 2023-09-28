import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GetUser } from '@/decorators'
import { Post, User } from '@/entities'
import { TokenJwtGuard } from '@/guards'
import { CreatePostData } from '@/modules/post/dtos'
import { PostService } from '@/modules/post/post.service'

@Resolver()
export class PostResolver {
  constructor(private readonly post: PostService) {}

  @Mutation(() => Post, { name: 'create_post' })
  @UseGuards(TokenJwtGuard)
  async createPost(@Args('data') data: CreatePostData, @GetUser() user: User) {
    return await this.post.createPost(data, user.id)
  }

  @Query(() => [Post], { name: 'posts' })
  @UseGuards(TokenJwtGuard)
  async getPosts(@GetUser() user: User) {
    return await this.post.getPosts(user.id)
  }

  @Query(() => Post, { name: 'post' })
  @UseGuards(TokenJwtGuard)
  async getPost(@Args('id') id: number, @GetUser() user: User) {
    return await this.post.getPost(id, user.id)
  }
}
