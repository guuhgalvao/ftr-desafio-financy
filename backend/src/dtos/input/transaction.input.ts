import { TransactionType } from '@prisma/client'
import { Field, ID, InputType, Int } from 'type-graphql'

@InputType()
export class TransactionInput {
  @Field(() => String)
  description!: string

  @Field(() => Int)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => String)
  date!: string

  @Field(() => ID)
  categoryId!: string
}
