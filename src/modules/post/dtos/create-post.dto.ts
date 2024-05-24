import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('CreatePostInput')
export class CreatePostDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string
}
