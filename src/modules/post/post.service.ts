import { UserInputError } from '@nestjs/apollo'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Transaction } from 'sequelize'

import { Post, User } from '@/models'
import { type CreatePostDto } from '@/modules/post/dtos'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post
  ) {}

  async createPost(
    { data, user_id }: { data: CreatePostDto; user_id: number },
    transaction: Transaction
  ) {
    const post = await this.postModel.create(
      {
        ...data,
        user_id
      },
      { transaction }
    )

    return await this.findOne({ post_id: post.id, user_id }, transaction)
  }

  async findAll({ user_id }: { user_id: number }, transaction: Transaction) {
    const posts = await this.postModel.findAll({
      where: {
        user_id
      },
      include: [{ model: User, as: 'user' }],
      transaction
    })

    return posts.map(post => post.toJSON())
  }

  async findOne(
    { post_id, user_id }: { post_id: number; user_id: number },
    transaction: Transaction
  ) {
    const post = await this.postModel.findOne({
      where: {
        id: post_id,
        user_id
      },
      include: [{ model: User, as: 'user' }],
      transaction
    })

    if (post == null) {
      throw new UserInputError('Post not found')
    }

    return post.toJSON()
  }
}
