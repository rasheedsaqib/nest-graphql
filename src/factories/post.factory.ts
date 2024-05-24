import { faker } from '@faker-js/faker'

import { type Post } from '@/models'

export const createPopulatedPost = ({
  id = faker.number.int({ min: 1, max: 1000 }),
  title = faker.lorem.words(2),
  content = faker.lorem.words(5),
  user_id = faker.number.int({ min: 1, max: 1000 })
}: Partial<Post> = {}): Post => {
  return {
    id,
    title,
    content,
    user_id
  } as Post
}
