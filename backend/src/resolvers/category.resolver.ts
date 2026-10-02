import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'
import { CategoryInput } from '../dtos/input/category.input'
import type { Context } from '../graphql/context'
import { Category } from '../models/category.model'
import * as categoryService from '../services/category.service'

// On @Authorized() operations the authChecker guarantees a userId, hence the `as string`.
@Resolver()
export class CategoryResolver {
  @Authorized()
  @Query(() => [Category])
  categories(@Ctx() { userId }: Context) {
    return categoryService.listCategories(userId as string)
  }

  @Authorized()
  @Query(() => Category)
  category(@Arg('id', () => ID) id: string, @Ctx() { userId }: Context) {
    return categoryService.getCategory(userId as string, id)
  }

  @Authorized()
  @Mutation(() => Category)
  createCategory(
    @Arg('data', () => CategoryInput) data: CategoryInput,
    @Ctx() { userId }: Context,
  ) {
    return categoryService.createCategory(userId as string, data)
  }

  @Authorized()
  @Mutation(() => Category)
  updateCategory(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => CategoryInput) data: CategoryInput,
    @Ctx() { userId }: Context,
  ) {
    return categoryService.updateCategory(userId as string, id, data)
  }

  @Authorized()
  @Mutation(() => Boolean)
  deleteCategory(@Arg('id', () => ID) id: string, @Ctx() { userId }: Context) {
    return categoryService.deleteCategory(userId as string, id)
  }
}
