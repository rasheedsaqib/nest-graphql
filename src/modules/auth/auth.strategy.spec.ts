import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/sequelize'
import { Test, type TestingModule } from '@nestjs/testing'

import { createPopulatedUser } from '@/factories'
import { User } from '@/models'
import { AuthService } from '@/modules/auth/auth.service'
import { AuthStrategy } from '@/modules/auth/auth.strategy'
import { createModelStub } from '@/tests/create-model.stub'

describe('AuthStrategy', () => {
  let authStrategy: AuthStrategy
  let userModel: typeof User

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: createModelStub(),
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('key'),
            getOrThrow: jest.fn().mockReturnValue('key')
          }
        },
        JwtService,
        AuthStrategy
      ]
    }).compile()

    authStrategy = module.get<AuthStrategy>(AuthStrategy)
    userModel = module.get<typeof User>(getModelToken(User))
  })

  it('strategy and model should be defined', () => {
    expect(authStrategy).toBeDefined()
    expect(userModel).toBeDefined()
  })

  describe('validate', () => {
    it('given an invalid email: should return null', async () => {
      const user = createPopulatedUser({
        active: true
      })

      const result = await authStrategy.validate({
        email: user.email,
        id: user.id.toString()
      })

      expect(result).toBeNull()
    })

    it('given a valid email: should return a user', async () => {
      const user = createPopulatedUser({
        active: true
      })

      await userModel.create({
        ...user
      })

      const result = await authStrategy.validate({
        email: user.email,
        id: user.id.toString()
      })

      expect(result).toBeDefined()
      expect(result).toMatchObject(user)
    })
  })
})
