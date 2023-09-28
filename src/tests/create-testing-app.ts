import { ValidationPipe } from '@nestjs/common'
import { type ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface'
import { Test, type TestingModule } from '@nestjs/testing'

export const createTestingApp = async (metadata: ModuleMetadata) => {
  const module: TestingModule =
    await Test.createTestingModule(metadata).compile()

  const app = module.createNestApplication()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  return app
}
