import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { type GraphQLError } from 'graphql/error'

import { ErrorFormatter } from '@/formatters'
import { AuthModule } from '@/modules/auth/auth.module'
import { PostModule } from '@/modules/post/post.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      formatError: (error: GraphQLError) => new ErrorFormatter(error).format(),
      context: ({ req }) => ({ headers: req.headers })
    }),
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.getOrThrow('SQL_HOST'),
        port: config.getOrThrow('SQL_PORT'),
        username: config.getOrThrow('SQL_USERNAME'),
        password: config.getOrThrow('SQL_PASSWORD'),
        database: config.getOrThrow('SQL_DATABASE'),
        autoLoadModels: true
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    PostModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
