import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null

  @Field(() => Date)
  createdAt!: Date
}
