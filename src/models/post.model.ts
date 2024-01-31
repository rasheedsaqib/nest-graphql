import { Field, ObjectType } from '@nestjs/graphql'
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { User } from '@/models'

@ObjectType({ description: 'Post ' })
@Table({
  timestamps: false
})
export class Post extends Model {
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @Field()
  @Column
  title: string

  @Field()
  @Column
  content: string

  @ForeignKey(() => User)
  @Column
  user_id: number

  @Field(() => User)
  @BelongsTo(() => User, 'user_id')
  user: User
}
