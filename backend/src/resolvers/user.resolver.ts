import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { LoginInput } from '../dtos/input/login.input'
import { RegisterInput } from '../dtos/input/register.input'
import { UpdateProfileInput } from '../dtos/input/update-profile.input'
import type { Context } from '../graphql/context'
import { AuthPayload } from '../models/auth-payload.model'
import { User } from '../models/user.model'
import * as userService from '../services/user.service'

// On @Authorized() operations the authChecker guarantees a userId, hence the `as string`.
@Resolver()
export class UserResolver {
  @Mutation(() => AuthPayload)
  register(@Arg('data', () => RegisterInput) data: RegisterInput) {
    return userService.register(data)
  }

  @Mutation(() => AuthPayload)
  login(@Arg('data', () => LoginInput) data: LoginInput) {
    return userService.login(data)
  }

  @Authorized()
  @Query(() => User)
  me(@Ctx() { userId }: Context) {
    return userService.getUser(userId as string)
  }

  @Authorized()
  @Mutation(() => User)
  updateProfile(
    @Arg('data', () => UpdateProfileInput) data: UpdateProfileInput,
    @Ctx() { userId }: Context,
  ) {
    return userService.updateProfile(userId as string, data)
  }
}
