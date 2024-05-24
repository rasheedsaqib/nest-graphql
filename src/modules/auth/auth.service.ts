import { UserInputError } from '@nestjs/apollo'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/sequelize'
import { hash, verify } from 'argon2'
import { type Transaction } from 'sequelize'

import { User } from '@/models'
import { type LoginDto, type SignupDto } from '@/modules/auth/dtos'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async getUserWithEmail(
    { email }: { email: string },
    transaction: Transaction
  ): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: {
        email
      },
      transaction
    })

    return user?.toJSON() ?? null
  }

  async createUser({ data }: { data: SignupDto }, transaction: Transaction) {
    const user = await this.userModel.create(
      {
        ...data,
        password: await hash(data.password),
        active: true
      },
      {
        transaction
      }
    )

    return user.toJSON()
  }

  async login({ data, user }: { data: LoginDto; user: User }) {
    const valid = await verify(user.password, data.password)

    if (!valid) {
      throw new UserInputError('Incorrect password')
    }

    if (!user.active) {
      throw new UserInputError('User is not active')
    }

    return user
  }

  async signToken(user: User) {
    return await this.jwt.signAsync(
      { id: user.id, email: user.email },
      {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: '24h'
      }
    )
  }
}
