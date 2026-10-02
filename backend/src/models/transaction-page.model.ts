import { Field, Int, ObjectType } from 'type-graphql'
import { Transaction } from './transaction.model'

@ObjectType()
export class TransactionPage {
  @Field(() => [Transaction])
  items!: Transaction[]

  // Every transaction matching the filter, not just the ones on this page.
  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number
}
