import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectModel } from '@nestjs/sequelize'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User } from '@/models'

@Injectable()
export class TokenJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET')
    })
  }

  async validate(payload: { email: string; id: string }) {
    const user = await this.userModel.findOne({
      where: {
        email: payload.email,
        active: true
      }
    })

    if (user == null) return null

    return {
      ...user.dataValues
    }
  }
}
