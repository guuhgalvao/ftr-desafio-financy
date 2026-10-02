import { Field, Float, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class Category {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description!: string | null

  @Field(() => String)
  icon!: string

  @Field(() => String)
  color!: string

  @Field(() => Int)
  transactionsCount!: number

  // Float, not Int: a sum of amounts can exceed the 32-bit range of the GraphQL Int.
  @Field(() => Float)
  totalAmount!: number

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
