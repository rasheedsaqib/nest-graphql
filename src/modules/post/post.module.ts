import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Post } from '@/models'
import { PostResolver } from '@/modules/post/post.resolver'
import { PostService } from '@/modules/post/post.service'

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  providers: [PostResolver, PostService]
})
export class PostModule {}
