import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/sequelize'
import { hash, verify } from 'argon2'

import { User } from '@/models'
import { type LoginData, type SignupData } from '@/modules/auth/dtos'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async signup(data: SignupData) {
    const prevUser = await this.userModel.findOne({
      where: {
        email: data.email
      }
    })

    if (prevUser != null) {
      throw new BadRequestException({
        status: 'Error',
        message: 'User already exists with this email'
      })
    }

    const user = await this.userModel.create({
      ...data,
      password: await hash(data.password),
      active: true
    })

    const token = await this.jwt.signAsync(
      { id: user.id, email: user.email },
      {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: '8h'
      }
    )

    return {
      ...user.dataValues,
      token
    }
  }

  async login(data: LoginData) {
    const user = await this.userModel.findOne({
      where: {
        email: data.email
      }
    })

    if (user == null) {
      throw new NotFoundException({
        status: 'Error',
        message: 'No user found with this email'
      })
    }

    if (!user.active) {
      throw new ForbiddenException({
        status: 'Error',
        message: 'User is not active'
      })
    }

    const valid = await verify(user.password, data.password)

    if (!valid) {
      throw new ForbiddenException({
        status: 'Error',
        message: 'Incorrect password'
      })
    }

    const token = await this.jwt.signAsync(
      { id: user.id, email: user.email },
      {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: '8h'
      }
    )

    return {
      ...user.dataValues,
      token
    }
  }
}
