import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetParentalLeavesPeriodsLengthInput {
  @Field(() => String)
  @IsString()
  startDate!: string

  @Field(() => String)
  @IsString()
  endDate!: string

  @Field(() => String)
  @IsString()
  percentage!: string
}
