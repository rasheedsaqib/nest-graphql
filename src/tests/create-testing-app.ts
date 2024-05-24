import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, type TestingModule } from '@nestjs/testing'
import { type GraphQLError } from 'graphql/error'

import { ErrorFormatter } from '@/formatters'
import { AuthModule } from '@/modules/auth/auth.module'
import { PostModule } from '@/modules/post/post.module'

export const createTestingApp = async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      {
        module: ConfigModule,
        global: true,
        providers: [
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockImplementation((key: string) => key),
              getOrThrow: jest.fn().mockImplementation((key: string) => key)
            }
          }
        ]
      },
      SequelizeModule.forRoot({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        define: {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at'
        },
        autoLoadModels: true
      }),
      JwtModule.register({
        global: true,
        secret: 'JWT_SECRET'
      }),
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: 'schema.gql',
        formatError: (error: GraphQLError) =>
          new ErrorFormatter(error).format(),
        context: ({ req }) => ({ headers: req.headers })
      }),
      AuthModule,
      PostModule
    ]
  }).compile()

  const app = module.createNestApplication()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  app.useLogger({
    log: jest.fn,
    error: jest.fn,
    warn: jest.fn
  })

  return app
}
