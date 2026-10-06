import { graphql } from '@/gql'

export const SUMMARY_QUERY = graphql(`
  query Summary($period: PeriodInput!) {
    summary(period: $period) {
      balance
      income
      expense
    }
  }
`)
