import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  UnionApi,
  Union,
  PensionApi,
  PensionFund,
  PregnancyApi,
  ParentalLeaveApi,
  ParentalLeave,
} from '@island.is/clients/vmst'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import differenceInDays from 'date-fns/differenceInDays'

import { PregnancyStatus } from '../models/pregnancyStatus.model'
import { ParentalLeavePeriod } from '../models/parentalLeavePeriod.model'
import { ParentalLeaveEntitlement } from '../models/parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from '../models/parentalLeavePaymentPlan.model'
import { ParentalLeavePeriodEndDate } from '../models/parentalLeavePeriodEndDate.model'
import { ParentalLeavePeriodLength } from '../models/parentalLeavePeriodLength.model'

const isRunningInDevelopment = process.env.NODE_ENV === 'xroad'
const df = 'yyyy-MM-dd'

enum PensionFundType {
  required = 'L',
  private = 'X',
}

@Injectable()
export class DirectorateOfLabourRepository {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private unionApi: UnionApi,
    private pensionApi: PensionApi,
    private pregnancyApi: PregnancyApi,
  ) {
    this.logger.debug('Created Directorate of labour repository')
  }

  async getUnions(): Promise<Union[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id-vr',
          name: 'VR',
        },
        {
          id: 'id-efling',
          name: 'Efling',
        },
      ]
    }

    const { unions } = await this.unionApi.unionGetUnions()

    if (unions) {
      return unions
    }

    throw new Error('Could not fetch unions')
  }

  private async getAllPensionFunds(): Promise<PensionFund[]> {
    const { pensionFunds } = await this.pensionApi.pensionGetPensionFunds()

    if (pensionFunds) {
      return pensionFunds
    }

    throw new Error('Could not fetch pension funds')
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id-frjalsi',
          name: 'Frjalsi',
        },
        {
          id: 'id-fluga',
          name: 'Fluga',
        },
      ]
    }

    const pensionFunds = await this.getAllPensionFunds()

    return pensionFunds.filter((pensionFund) =>
      pensionFund.id.startsWith(PensionFundType.required),
    )
  }

  async getPrivatePensionFunds(): Promise<PensionFund[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id-frjalsi',
          name: 'Frjalsi',
        },
        {
          id: 'id-draumur',
          name: 'Draumur',
        },
      ]
    }

    const pensionFunds = await this.getAllPensionFunds()

    return pensionFunds.filter((pensionFund) =>
      pensionFund.id.startsWith(PensionFundType.private),
    )
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: Date,
    nationalId: string,
  ): Promise<ParentalLeaveEntitlement | null> {
    if (isRunningInDevelopment) {
      return {
        independentMonths: 6,
        transferableMonths: 1.5,
      }
    }

    try {
      const rights = await this.parentalLeaveApi.parentalLeaveGetRights({
        nationalRegistryId: nationalId,
        dateOfBirth,
      })

      if (!rights.independentMonths || !rights.transferableMonths) {
        return null
      }

      return {
        independentMonths: rights.independentMonths,
        transferableMonths: rights.transferableMonths,
      }
    } catch (e) {
      this.logger.error(
        `Could not fetch parental leaves entitlements for ${nationalId}, ${dateOfBirth}`,
        e,
      )

      return null
    }
  }

  async getParentalLeaves(nationalId: string): Promise<ParentalLeave[] | null> {
    if (isRunningInDevelopment) {
      return []
    }

    try {
      const results = await this.parentalLeaveApi.parentalLeaveGetParentalLeaves(
        {
          nationalRegistryId: nationalId,
        },
      )

      return results.parentalLeaves ?? []
    } catch (e) {
      this.logger.error(`Could not fetch parental leaves for ${nationalId}`, e)

      return null
    }
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    period: ParentalLeavePeriod[],
    nationalId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<ParentalLeavePaymentPlan[]> {
    const paymentPlan: ParentalLeavePaymentPlan[] = period.map((p) => {
      return {
        estimatedAmount: 405300,
        pensionAmount: 14800,
        privatePensionAmount: 0,
        unionAmount: 0,
        taxAmount: 77500,
        estimatePayment: 405300,
        period: p,
      }
    })
    return Promise.resolve(paymentPlan)
  }

  async getParentalLeavesApplicationPaymentPlan(
    dateOfBirth: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    applicationId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    nationalId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<ParentalLeavePaymentPlan[]> {
    return [
      {
        estimatedAmount: 1.0,
        pensionAmount: 0.0,
        privatePensionAmount: 0.0,
        unionAmount: 0.0,
        taxAmount: 0.0,
        estimatePayment: 0.0,
        period: {
          from: '01-01-2020',
          to: '01-01-2020',
          ratio: 0.8,
          approved: true,
          paid: true,
        },
      },
    ]
  }

  async getParentalLeavesPeriodEndDate(
    nationalId: string,
    startDate: Date,
    length: string,
    percentage: string,
  ): Promise<ParentalLeavePeriodEndDate> {
    if (isRunningInDevelopment) {
      this.logger.warn(
        'You need to run against VMST API through XROAD to get the correct dates calculation. This is an approximation done with date-fns.',
      )

      return {
        periodEndDate: addDays(startDate, Number(length)).getTime(),
      }
    }

    const res = await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate({
      nationalRegistryId: nationalId,
      startDate,
      length,
      percentage,
    })

    if (!res?.periodEndDate) {
      throw new Error(`Cannot get the end date for ${startDate} and ${length}`)
    }

    return {
      periodEndDate: res.periodEndDate as any,
    }
  }

  async getParentalLeavesPeriodLength(
    nationalId: string,
    startDate: Date,
    endDate: Date,
    percentage: string,
  ): Promise<ParentalLeavePeriodLength> {
    if (isRunningInDevelopment) {
      this.logger.warn(
        'You need to run against VMST API through XROAD to get the correct dates calculation. This is an approximation done with date-fns.',
      )

      return {
        periodLength: differenceInDays(endDate, startDate),
      }
    }

    const res = await this.parentalLeaveApi.parentalLeaveGetPeriodLength({
      nationalRegistryId: nationalId,
      startDate,
      endDate,
      percentage,
    })

    if (!res?.periodLength) {
      throw new Error(`Cannot get the length for ${startDate} and ${endDate}`)
    }

    return {
      periodLength: res.periodLength,
    }
  }

  async getPregnancyStatus(
    nationalId: string,
  ): Promise<PregnancyStatus | null> {
    if (isRunningInDevelopment) {
      return {
        hasActivePregnancy: true,
        expectedDateOfBirth: '2021-06-17',
      }
    }

    try {
      const pregnancyStatus = await this.pregnancyApi.pregnancyGetPregnancyStatus(
        {
          nationalRegistryId: nationalId,
        },
      )

      if (pregnancyStatus.hasError) {
        throw new Error(
          pregnancyStatus.errorMessage ?? 'Could not fetch pregnancy status',
        )
      }

      if (
        pregnancyStatus.hasActivePregnancy === undefined ||
        pregnancyStatus.pregnancyDueDate === undefined ||
        pregnancyStatus.pregnancyDueDate === null
      ) {
        return null
      }

      return {
        hasActivePregnancy: pregnancyStatus.hasActivePregnancy,
        expectedDateOfBirth: format(pregnancyStatus.pregnancyDueDate, df),
      }
    } catch (e) {
      this.logger.error(`Could not fetch pregnancy status for ${nationalId}`, e)

      return null
    }
  }
}
