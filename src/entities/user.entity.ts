import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'user' })
export class User {
  @Field()
  id: number

  @Field()
  name: string

  @Field()
  @Field()
  email: string

  @Field()
  active: boolean
}

@ObjectType({ description: 'user_with_token' })
export class UserWithToken extends User {
  @Field()
  token: string
}
