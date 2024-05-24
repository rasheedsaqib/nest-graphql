import type { INestApplication } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import gql from 'graphql-tag'
import request from 'supertest-graphql'

import { generateJWTToken } from '@/e2e/utils'
import { createPopulatedPost, createPopulatedUser } from '@/factories'
import { Post, User } from '@/models'
import { createTestingApp } from '@/tests/create-testing-app'

const query = gql`
  mutation ($title: String!, $content: String!) {
    create_post(data: { title: $title, content: $content }) {
      id
      title
      content
      user {
        name
      }
    }
  }
`

describe('Mutation: create_post', () => {
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
        title: '',
        content: ''
      })

    expect(errors).toMatchObject([
      {
        message: 'Unauthorized'
      }
    ])
  })

  it('given a logged in user and invalid data: should throw error', async () => {
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
        title: '',
        content: ''
      })

    expect(errors).toMatchObject([
      {
        message: {
          title: 'title should not be empty',
          content: 'content should not be empty'
        }
      }
    ])
  })

  it('given a logged in user and valid data: should return the created post', async () => {
    const user = createPopulatedUser({
      active: true
    })
    await userModel.create({ ...user })

    const token = await generateJWTToken(user)

    const post = createPopulatedPost()

    const { data } = await request(app.getHttpServer())
      .set({
        Authorization: token
      })
      .query(query)
      .variables({
        title: post.title,
        content: post.content
      })
      .expectNoErrors()

    expect(data).toMatchObject({
      create_post: {
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
