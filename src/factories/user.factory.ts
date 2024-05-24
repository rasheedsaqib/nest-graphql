import { faker } from '@faker-js/faker'

import { type User } from '@/models'

export const createPopulatedUser = ({
  id = faker.number.int({ min: 1, max: 1000 }),
  name = faker.person.fullName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  active = faker.datatype.boolean()
}: Partial<User> = {}): User => {
  return {
    id,
    name,
    email,
    password,
    active
  } as User
}
