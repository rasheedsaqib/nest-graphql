import { UserInputError } from '@nestjs/apollo'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { InjectConnection } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize'

import { GetUser } from '@/decorators'
import { TokenJwtGuard } from '@/guards'
import { User, UserWithToken } from '@/models'
import { AuthService } from '@/modules/auth/auth.service'
import { LoginDto, SignupDto } from '@/modules/auth/dtos'

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  @Mutation(() => UserWithToken, { name: 'login' })
  async login(@Args('data') data: LoginDto) {
    return await this.sequelize.transaction(async t => {
      const user = await this.auth.getUserWithEmail({ email: data.email }, t)

      if (user == null) {
        throw new UserInputError('No user found with this email')
      }

      await this.auth.login({ data, user })

      const token = await this.auth.signToken(user)

      return {
        ...user,
        token
      }
    })
  }

  @Mutation(() => UserWithToken, { name: 'signup' })
  async signup(@Args('data') data: SignupDto) {
    return await this.sequelize.transaction(async t => {
      const prevUser = await this.auth.getUserWithEmail(
        { email: data.email },
        t
      )

      if (prevUser != null) {
        throw new UserInputError('User already exists with this email')
      }

      const user = await this.auth.createUser({ data }, t)

      const token = await this.auth.signToken(user)

      return {
        ...user,
        token
      }
    })
  }

  @Query(() => User, { name: 'verify_token' })
  @UseGuards(TokenJwtGuard)
  async verifyToken(@GetUser() user: User) {
    return {
      ...user
    }
  }
}
