import { TransactionType } from '@prisma/client'
import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql'
import { Category } from './category.model'

registerEnumType(TransactionType, { name: 'TransactionType' })

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  description!: string

  @Field(() => Int)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  // Date only (YYYY-MM-DD), no time and no timezone.
  @Field(() => String)
  date!: string

  // Null once the category has been deleted.
  @Field(() => Category, { nullable: true })
  category!: Category | null

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
