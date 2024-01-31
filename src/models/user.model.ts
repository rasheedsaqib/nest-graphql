import { Field, ObjectType } from '@nestjs/graphql'
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'

@ObjectType({ description: 'User' })
@Table({
  timestamps: false
})
export class User extends Model {
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @Field()
  @Column
  name: string

  @Field()
  @Unique
  @Column
  email: string

  @Column
  password: string

  @Field()
  @Column
  active: boolean
}

@ObjectType({ description: 'UserWithToken' })
export class UserWithToken extends User {
  @Field()
  token: string
}
