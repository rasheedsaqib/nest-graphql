import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GetUser } from '@/decorators'
import { User, UserWithToken } from '@/entities'
import { TokenJwtGuard } from '@/guards'
import { AuthService } from '@/modules/auth/auth.service'
import { LoginData, SignupData } from '@/modules/auth/dtos'

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => UserWithToken, { name: 'login' })
  async login(@Args('data') data: LoginData) {
    return this.auth.login(data)
  }

  @Mutation(() => UserWithToken, { name: 'signup' })
  async signup(@Args('data') data: SignupData) {
    return this.auth.signup(data)
  }

  @Query(() => User, { name: 'verify_token' })
  @UseGuards(TokenJwtGuard)
  async verifyToken(@GetUser() user: User) {
    return {
      ...user
    }
  }
}
