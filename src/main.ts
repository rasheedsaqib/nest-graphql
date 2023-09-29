import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from '@/modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  app.enableCors({
    origin: true
  })

  await app.listen(process.env.PORT ?? 8080)
}

bootstrap()
  .then(() => {
    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 8080}`
    )
  })
  .catch(error => {
    console.error(error)
  })
