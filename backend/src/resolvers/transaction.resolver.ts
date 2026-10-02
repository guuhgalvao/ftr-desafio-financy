import { Arg, Authorized, Ctx, ID, Query, Resolver } from 'type-graphql'
import { PaginationInput } from '../dtos/input/pagination.input'
import { TransactionFilterInput } from '../dtos/input/transaction-filter.input'
import type { Context } from '../graphql/context'
import { Transaction } from '../models/transaction.model'
import { TransactionPage } from '../models/transaction-page.model'
import * as transactionService from '../services/transaction.service'

// On @Authorized() operations the authChecker guarantees a userId, hence the `as string`.
@Resolver()
export class TransactionResolver {
  @Authorized()
  @Query(() => TransactionPage)
  transactions(
    @Arg('filter', () => TransactionFilterInput, { nullable: true })
    filter: TransactionFilterInput | null,
    @Arg('pagination', () => PaginationInput, { nullable: true })
    pagination: PaginationInput | null,
    @Ctx() { userId }: Context,
  ) {
    return transactionService.listTransactions(userId as string, filter, pagination)
  }

  @Authorized()
  @Query(() => Transaction)
  transaction(@Arg('id', () => ID) id: string, @Ctx() { userId }: Context) {
    return transactionService.getTransaction(userId as string, id)
  }
}
