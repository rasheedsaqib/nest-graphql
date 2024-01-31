import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('CreatePostData')
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
