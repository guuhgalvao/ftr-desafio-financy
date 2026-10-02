import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql'
import { PeriodInput } from '../dtos/input/period.input'
import type { Context } from '../graphql/context'
import { Summary } from '../models/summary.model'
import * as summaryService from '../services/summary.service'

// On @Authorized() operations the authChecker guarantees a userId, hence the `as string`.
@Resolver()
export class SummaryResolver {
  @Authorized()
  @Query(() => Summary)
  summary(@Arg('period', () => PeriodInput) period: PeriodInput, @Ctx() { userId }: Context) {
    return summaryService.getSummary(userId as string, period)
  }
}
