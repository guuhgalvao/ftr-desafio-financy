import { Arg, Authorized, Ctx, ID, Query, Resolver } from 'type-graphql'
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
}
