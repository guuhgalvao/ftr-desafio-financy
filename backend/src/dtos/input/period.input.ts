import { Field, InputType } from 'type-graphql'

@InputType()
export class PeriodInput {
  @Field(() => String)
  from!: string

  @Field(() => String)
  to!: string
}
