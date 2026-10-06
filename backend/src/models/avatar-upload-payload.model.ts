import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class AvatarUploadPayload {
  @Field(() => String)
  uploadUrl!: string

  @Field(() => String)
  key!: string

  @Field(() => Int)
  expiresIn!: number
}
