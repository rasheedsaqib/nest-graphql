import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { User } from '@/models'
import { AuthResolver } from '@/modules/auth/auth.resolver'
import { AuthService } from '@/modules/auth/auth.service'
import { AuthStrategy } from '@/modules/auth/auth.strategy'

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [AuthResolver, AuthService, AuthStrategy]
})
export class AuthModule {}
