import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { User } from '@/models'
import { AuthResolver } from '@/modules/auth/auth.resolver'
import { AuthService } from '@/modules/auth/auth.service'
import { TokenJwtStrategy } from '@/modules/auth/strategies'

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [AuthResolver, AuthService, TokenJwtStrategy]
})
export class AuthModule {}
