import { Field, ObjectType } from '@nestjs/graphql'

import { User } from '@/entities/user.entity'

@ObjectType({ description: 'post ' })
export class Post {
  @Field()
  id: number

  @Field()
  title: string

  @Field()
  content: string

  @Field()
  user: User
}
