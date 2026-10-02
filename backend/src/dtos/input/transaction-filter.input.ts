import { TransactionType } from '@prisma/client'
import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class TransactionFilterInput {
  @Field(() => String, { nullable: true })
  search?: string | null

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType | null

  @Field(() => ID, { nullable: true })
  categoryId?: string | null

  @Field(() => String, { nullable: true })
  from?: string | null

  @Field(() => String, { nullable: true })
  to?: string | null
}
