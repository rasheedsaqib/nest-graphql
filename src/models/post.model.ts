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

@Table({
  timestamps: false
})
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @Column
  title: string

  @Column
  content: string

  @ForeignKey(() => User)
  @Column
  user_id: number

  @BelongsTo(() => User, 'user_id')
  user: User
}
