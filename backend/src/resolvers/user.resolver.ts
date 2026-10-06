import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { LoginInput } from '../dtos/input/login.input'
import { RegisterInput } from '../dtos/input/register.input'
import { UpdateProfileInput } from '../dtos/input/update-profile.input'
import type { Context } from '../graphql/context'
import { AuthPayload } from '../models/auth-payload.model'
import { AvatarUploadPayload } from '../models/avatar-upload-payload.model'
import { User } from '../models/user.model'
import * as avatarService from '../services/avatar.service'
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

  @Authorized()
  @Mutation(() => AvatarUploadPayload)
  createAvatarUploadUrl(
    @Arg('contentType', () => String) contentType: string,
    @Arg('contentLength', () => Int) contentLength: number,
    @Ctx() { userId }: Context,
  ) {
    return avatarService.createUploadUrl(userId as string, contentType, contentLength)
  }

  @Authorized()
  @Mutation(() => User)
  updateAvatar(@Arg('key', () => String) key: string, @Ctx() { userId }: Context) {
    return avatarService.updateAvatar(userId as string, key)
  }

  @Authorized()
  @Mutation(() => User)
  removeAvatar(@Ctx() { userId }: Context) {
    return avatarService.removeAvatar(userId as string)
  }
}
