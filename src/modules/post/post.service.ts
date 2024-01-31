import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Post, User } from '@/models'
import { type CreatePostDto } from '@/modules/post/dtos'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post
  ) {}

  async createPost(data: CreatePostDto, user_id: number) {
    const post = await this.postModel.create({
      ...data,
      user_id
    })

    return await this.postModel.findOne({
      where: {
        id: post.id
      },
      include: [{ model: User, as: 'user' }]
    })
  }

  async getPosts(user_id: number) {
    return await this.postModel.findAll({
      where: {
        user_id
      },
      include: [{ model: User, as: 'user' }]
    })
  }

  async getPost(id: number, user_id: number) {
    const post = await this.postModel.findOne({
      where: {
        id,
        user_id
      },
      include: [{ model: User, as: 'user' }]
    })

    if (post == null) {
      throw new NotFoundException({
        status: 'Error',
        message: 'Post not found'
      })
    }

    return post
  }
}
