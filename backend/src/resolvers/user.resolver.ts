import { Authorized, Ctx, Query, Resolver } from 'type-graphql'
import type { Context } from '../graphql/context'
import { User } from '../models/user.model'
import * as userService from '../services/user.service'

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => User)
  me(@Ctx() { userId }: Context) {
    // @Authorized guarantees a userId
    return userService.getUser(userId as string)
  }
}
