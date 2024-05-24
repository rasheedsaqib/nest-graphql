import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import { Test, type TestingModule } from '@nestjs/testing'
import { hash } from 'argon2'
import { type Sequelize } from 'sequelize'

import { createPopulatedUser } from '@/factories'
import { User } from '@/models'
import { AuthService } from '@/modules/auth/auth.service'
import { createModelStub } from '@/tests/create-model.stub'

describe('AuthService', () => {
  let authService: AuthService
  let userModel: typeof User
  let sequelize: Sequelize

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
        JwtService
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userModel = module.get<typeof User>(getModelToken(User))
    sequelize = module.get<Sequelize>(getConnectionToken())
  })

  afterEach(async () => {
    await sequelize.drop({})
  })

  it('should be defined', async () => {
    expect(authService).toBeDefined()
    expect(userModel).toBeDefined()
  })

  describe('getUserWithEmail', () => {
    it('given an invalid email: should return null', async () => {
      const transaction = await sequelize.transaction()

      const user = createPopulatedUser()

      const result = await authService.getUserWithEmail(
        { email: user.email },
        transaction
      )

      expect(result).toBeNull()
    })

    it('given a valid email: should return a user', async () => {
      const transaction = await sequelize.transaction()

      const user = createPopulatedUser()

      await userModel.create({
        ...user
      })

      const result = await authService.getUserWithEmail(
        { email: user.email },
        transaction
      )

      expect(result).not.toBeNull()
      expect(result).toMatchObject(user)
    })
  })

  describe('createUser', () => {
    it('given a valid user: should return a user', async () => {
      const transaction = await sequelize.transaction()

      const user = createPopulatedUser({
        active: true
      })

      const result = await authService.createUser(
        {
          data: {
            name: user.name,
            email: user.email,
            password: user.password
          }
        },
        transaction
      )

      expect(result).not.toBeNull()
      expect(result).toMatchObject({
        ...user,
        id: expect.any(Number),
        password: expect.any(String)
      })
    })
  })

  describe('login', () => {
    it('given an non verified user: should throw an error', async () => {
      const populatesUser = createPopulatedUser({
        active: false
      })

      const user = await userModel.create({
        ...populatesUser,
        password: await hash(populatesUser.password)
      })

      await expect(
        authService.login({
          data: { email: user.email, password: populatesUser.password },
          user
        })
      ).rejects.toThrow('User is not active')
    })

    it('given an incorrect password: should throw an error', async () => {
      const populatesUser = createPopulatedUser({
        active: true
      })

      const user = await userModel.create({
        ...populatesUser,
        password: await hash(populatesUser.password)
      })

      await expect(
        authService.login({
          data: { email: user.email, password: 'incorrect' },
          user
        })
      ).rejects.toThrow('Incorrect password')
    })

    it('given a valid user: should return a user', async () => {
      const populatesUser = createPopulatedUser({
        active: true
      })

      const user = await userModel.create({
        ...populatesUser,
        password: await hash(populatesUser.password)
      })

      const result = await authService.login({
        data: { email: user.email, password: populatesUser.password },
        user
      })

      expect(result).not.toBeNull()
      expect(result).toMatchObject(user)
    })
  })

  describe('signToken', () => {
    it('given a valid user: should return a token', async () => {
      const populatedUser = createPopulatedUser()

      const user = await userModel.create({
        ...populatedUser
      })

      const result = await authService.signToken(user)

      expect(result).not.toBeNull()
      expect(typeof result).toBe('string')
    })
  })
})
