import type { INestApplication } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import gql from 'graphql-tag'
import request from 'supertest-graphql'

import { generateJWTToken } from '@/e2e/utils'
import { createPopulatedPost, createPopulatedUser } from '@/factories'
import { Post, User } from '@/models'
import { createTestingApp } from '@/tests/create-testing-app'

const query = gql`
  query ($id: Int!) {
    post(id: $id) {
      id
      title
      content
      user {
        name
      }
    }
  }
`

describe('Query: post', () => {
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
    const { errors } = await request(app.getHttpServer())
      .query(query)
      .variables({
        id: 1
      })

    expect(errors).toMatchObject([
      {
        message: 'Unauthorized'
      }
    ])
  })

  it('given a logged in user and invalid post id: should return empty array', async () => {
    const user = createPopulatedUser({
      active: true
    })
    await userModel.create({ ...user })

    const token = await generateJWTToken(user)

    const { errors } = await request(app.getHttpServer())
      .set({
        Authorization: token
      })
      .query(query)
      .variables({
        id: 1
      })

    expect(errors).toMatchObject([
      {
        message: 'Post not found'
      }
    ])
  })

  it('given a logged in user and valid post id: should return the posts', async () => {
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
      .variables({
        id: post.id
      })
      .expectNoErrors()

    expect(data).toMatchObject({
      post: {
        id: expect.any(Number),
        title: post.title,
        content: post.content,
        user: {
          name: user.name
        }
      }
    })
  })
})
