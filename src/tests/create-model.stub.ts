import { SequelizeModule } from '@nestjs/sequelize'

import { Post, User } from '@/models'

export const createModelStub = () => {
  return [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      define: {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      },
      autoLoadModels: true
    }),
    SequelizeModule.forFeature([User, Post])
  ]
}
