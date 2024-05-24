import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import { Test, type TestingModule } from '@nestjs/testing'
import type { Sequelize } from 'sequelize'

import { createPopulatedPost, createPopulatedUser } from '@/factories'
import { Post, User } from '@/models'
import { PostService } from '@/modules/post/post.service'
import { createModelStub } from '@/tests/create-model.stub'

describe('PostService', () => {
  let postService: PostService
  let postModel: typeof Post
  let userModel: typeof User
  let sequelize: Sequelize

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: createModelStub(),
      providers: [PostService]
    }).compile()

    postService = module.get<PostService>(PostService)
    postModel = module.get<typeof Post>(getModelToken(Post))
    userModel = module.get<typeof User>(getModelToken(User))
    sequelize = module.get<Sequelize>(getConnectionToken())
  })

  afterEach(async () => {
    await sequelize.drop({})
  })

  it('should be defined', async () => {
    expect(postService).toBeDefined()
    expect(postModel).toBeDefined()
    expect(userModel).toBeDefined()
  })

  describe('createPost', () => {
    it('should create a post', async () => {
      const transaction = await sequelize.transaction()

      const post = createPopulatedPost()
      const user = createPopulatedUser()
      await userModel.create({ ...user })

      const result = await postService.createPost(
        { data: post, user_id: user.id },
        transaction
      )

      expect(result).toMatchObject({
        id: expect.any(Number),
        title: post.title,
        content: post.content,
        user_id: user.id,
        user
      })
    })
  })

  describe('findAll', () => {
    it('given no post: should return empty array', async () => {
      const transaction = await sequelize.transaction()
      const user = createPopulatedUser()
      await userModel.create({ ...user })

      const result = await postService.findAll(
        { user_id: user.id },
        transaction
      )

      expect(result).toEqual([])
    })

    it('given posts: should return array of posts', async () => {
      const transaction = await sequelize.transaction()
      const user = createPopulatedUser()
      await userModel.create({ ...user })

      const post = createPopulatedPost({ user_id: user.id })
      await postModel.create({ ...post }, { transaction })

      const result = await postService.findAll(
        { user_id: user.id },
        transaction
      )

      expect(result).toEqual([
        expect.objectContaining({
          id: expect.any(Number),
          title: post.title,
          content: post.content,
          user_id: user.id,
          user
        })
      ])
    })
  })

  describe('findOne', () => {
    it('given no post: should throw an error', async () => {
      const transaction = await sequelize.transaction()

      await expect(
        postService.findOne({ post_id: 1, user_id: 1 }, transaction)
      ).rejects.toThrow('Post not found')
    })

    it('given post: should return post', async () => {
      const transaction = await sequelize.transaction()

      const user = createPopulatedUser()
      await userModel.create({ ...user })

      const post = createPopulatedPost({ user_id: user.id })
      await postModel.create({ ...post }, { transaction })

      const result = await postService.findOne(
        { post_id: post.id, user_id: user.id },
        transaction
      )

      expect(result).toMatchObject({
        id: expect.any(Number),
        title: post.title,
        content: post.content,
        user_id: user.id,
        user
      })
    })
  })
})
