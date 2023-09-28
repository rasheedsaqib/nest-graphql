import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'

@Table({
  timestamps: false
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @Column
  name: string

  @Unique
  @Column
  email: string

  @Column
  password: string

  @Column
  active: boolean
}
