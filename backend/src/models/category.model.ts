import { Field, ID, Int, ObjectType } from 'type-graphql'

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

  @Field(() => Int)
  totalAmount!: number

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
