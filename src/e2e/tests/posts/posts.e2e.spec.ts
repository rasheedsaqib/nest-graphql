import type { INestApplication } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import gql from 'graphql-tag'
import request from 'supertest-graphql'

import { generateJWTToken } from '@/e2e/utils'
import { createPopulatedPost, createPopulatedUser } from '@/factories'
import { Post, User } from '@/models'
import { createTestingApp } from '@/tests/create-testing-app'

const query = gql`
  query {
    posts {
      id
      title
      content
      user {
        name
      }
    }
  }
`

describe('Query: posts', () => {
  let app: INestApplication
  let userModel: typeof User
  let postModel: typeof Post

  beforeAll(async () => {
    app = await createTestingApp()

    userModel = app.get<typeof User>(getModelToken(User))
    postModel = app.get<typeof Post>(getModelToken(Post))

    await app.listen(0)
  })

  afterEach(async () => {
    await postModel.destroy({ truncate: true })
    await userModel.destroy({ truncate: true })
  })

  afterAll(async () => {
    await app.close()
  })

  it('given a logged out user: should throw unauthorized exception', async () => {
    const { errors } = await request(app.getHttpServer()).query(query)

    expect(errors).toMatchObject([
      {
        message: 'Unauthorized'
      }
    ])
  })

  it('given a logged in user with no posts: should return empty array', async () => {
    const user = createPopulatedUser({
      active: true
    })
    await userModel.create({ ...user })

    const token = await generateJWTToken(user)

    const { data } = await request(app.getHttpServer())
      .set({
        Authorization: token
      })
      .query(query)
      .expectNoErrors()

    expect(data).toMatchObject({
      posts: []
    })
  })

  it('given a logged in user and posts: should return the posts', async () => {
    const user = createPopulatedUser({
      active: true
    })
    await userModel.create({ ...user })

    const token = await generateJWTToken(user)

    const post = createPopulatedPost({ user_id: user.id })
    await postModel.create({ ...post })

    const { data } = await request(app.getHttpServer())
      .set({
        Authorization: token
      })
      .query(query)
      .expectNoErrors()

    expect(data).toMatchObject({
      posts: [
        {
          id: expect.any(Number),
          title: post.title,
          content: post.content,
          user: {
            name: user.name
          }
        }
      ]
    })
  })
})
