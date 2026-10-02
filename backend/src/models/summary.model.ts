import { Field, Float, ObjectType } from 'type-graphql'

// Float, not Int: sums of amounts can exceed the 32-bit range of the GraphQL Int.
@ObjectType()
export class Summary {
  @Field(() => Float)
  balance!: number

  @Field(() => Float)
  income!: number

  @Field(() => Float)
  expense!: number
}
