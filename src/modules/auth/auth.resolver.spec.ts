import { faker } from '@faker-js/faker'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'

import { createPopulatedUser } from '@/factories'
import { AuthResolver } from '@/modules/auth/auth.resolver'
import { AuthService } from '@/modules/auth/auth.service'
import { createModelStub } from '@/tests/create-model.stub'

describe('AuthResolver', () => {
  let authResolver: AuthResolver
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: createModelStub(),
      providers: [
        AuthResolver,
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('key'),
            getOrThrow: jest.fn().mockReturnValue('key')
          }
        },
        JwtService
      ]
    }).compile()

    authResolver = module.get<AuthResolver>(AuthResolver)
    authService = module.get<AuthService>(AuthService)
  })

  it('resolver and service should be defined', async () => {
    expect(authResolver).toBeDefined()
    expect(authService).toBeDefined()
  })

  describe('login', () => {
    it('given an invalid email: should throw exception', async () => {
      const user = createPopulatedUser()

      jest.spyOn(authService, 'getUserWithEmail').mockResolvedValue(null)

      await expect(
        authResolver.login({ email: user.email, password: 'password' })
      ).rejects.toThrow('No user found with this email')
    })

    it('given a valid email: should return a user with token', async () => {
      const user = createPopulatedUser()
      const token = faker.string.alpha(32)

      jest.spyOn(authService, 'getUserWithEmail').mockResolvedValue(user)
      jest.spyOn(authService, 'login').mockResolvedValue(user)
      jest.spyOn(authService, 'signToken').mockResolvedValue(token)

      const result = await authResolver.login({
        email: user.email,
        password: 'password'
      })

      expect(result).toMatchObject({ ...user, token })
    })
  })

  describe('signup', () => {
    it('given an email that is already used: should throw exception', async () => {
      const user = createPopulatedUser()

      jest.spyOn(authService, 'getUserWithEmail').mockResolvedValue(user)

      await expect(authResolver.signup(user)).rejects.toThrow(
        'User already exists with this email'
      )
    })

    it('given a valid user: should return the created user with token', async () => {
      const user = createPopulatedUser()
      const token = faker.string.alpha(32)

      jest.spyOn(authService, 'getUserWithEmail').mockResolvedValue(null)
      jest.spyOn(authService, 'createUser').mockResolvedValue(user)
      jest.spyOn(authService, 'signToken').mockResolvedValue(token)

      const result = await authResolver.signup(user)

      expect(result).toMatchObject({ ...user, token })
    })
  })

  describe('verifyToken', () => {
    it('should return the user', async () => {
      const user = createPopulatedUser()

      const result = await authResolver.verifyToken(user)

      expect(result).toMatchObject(user)
    })
  })
})
