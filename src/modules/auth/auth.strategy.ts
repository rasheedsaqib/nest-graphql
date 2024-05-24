import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectConnection } from '@nestjs/sequelize'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Sequelize } from 'sequelize'

import { AuthService } from '@/modules/auth/auth.service'

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET')
    })
  }

  async validate({ email }: { email: string; id: string }) {
    return await this.sequelize.transaction(async t => {
      const user = await this.authService.getUserWithEmail({ email }, t)

      if (user == null) return null

      return user
    })
  }
}
