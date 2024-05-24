import { Test, type TestingModule } from '@nestjs/testing'

import { createPopulatedPost, createPopulatedUser } from '@/factories'
import { PostResolver } from '@/modules/post/post.resolver'
import { PostService } from '@/modules/post/post.service'
import { createModelStub } from '@/tests/create-model.stub'

describe('PostResolver', () => {
  let postResolver: PostResolver
  let postService: PostService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: createModelStub(),
      providers: [PostResolver, PostService]
    }).compile()

    postResolver = module.get<PostResolver>(PostResolver)
    postService = module.get<PostService>(PostService)
  })

  it('should be defined', async () => {
    expect(postResolver).toBeDefined()
    expect(postService).toBeDefined()
  })

  describe('createPost', () => {
    it('should create a post', async () => {
      const user = createPopulatedUser()
      const post = createPopulatedPost()

      jest.spyOn(postService, 'createPost').mockResolvedValue(post)

      const result = await postResolver.createPost(post, user)

      expect(result).toEqual(post)
    })
  })

  describe('getPosts', () => {
    it('should return all posts', async () => {
      const user = createPopulatedUser()
      const posts = [createPopulatedPost()]

      jest.spyOn(postService, 'findAll').mockResolvedValue(posts)

      const result = await postResolver.getPosts(user)

      expect(result).toEqual(posts)
    })
  })

  describe('getPost', () => {
    it('should return a post', async () => {
      const user = createPopulatedUser()
      const post = createPopulatedPost()

      jest.spyOn(postService, 'findOne').mockResolvedValue(post)

      const result = await postResolver.getPost(post.id, user)

      expect(result).toEqual(post)
    })
  })
})
