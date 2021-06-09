import React, { FC, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import differenceInMonths from 'date-fns/differenceInMonths'
import addMonths from 'date-fns/addMonths'
import formatISO from 'date-fns/formatISO'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

import {
  extractRepeaterIndexFromField,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import Slider from '../components/Slider'
import * as styles from './Duration.treat'
import {
  calculatePeriodPercentage,
  getExpectedDateOfBirth,
  updateComputedRights,
} from '../../parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { usageMaxMonths, usageMinMonths } from '../../config'
import { StartDateOptions } from '../../constants'
import { useStatefulAnswers } from '../../hooks/useStatefulAnswers'
import { monthsToDays } from '../../lib/directorateOfLabour.utils'
import { useParentalLeavesPeriodsEndDate } from '../../hooks/useParentalLeavesPeriodsEndDate'

const df = 'yyyy-MM-dd'

const Duration: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const { register, clearErrors } = useFormContext()
  const { formatMessage, formatDateFns } = useLocale()
  const { answers } = application
  const [
    { computedPersonalDays, computedExtraDays },
    setStateful,
  ] = useStatefulAnswers(application)
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const currentRepeaterIndex = extractRepeaterIndexFromField(field)
  const currentIndex = currentRepeaterIndex === -1 ? 0 : currentRepeaterIndex
  const currentStartDateAnswer = getValueViaPath(
    answers,
    `periods[${currentIndex}].startDate`,
    expectedDateOfBirth,
  ) as string
  const currentEndDateAnswer = getValueViaPath(
    answers,
    id,
    formatISO(addMonths(parseISO(currentStartDateAnswer), 1)),
  ) as string
  const monthsToUse = differenceInMonths(
    parseISO(currentEndDateAnswer),
    parseISO(currentStartDateAnswer),
  )
  const [chosenEndDate, setChosenEndDate] = useState<string>(
    currentEndDateAnswer,
  )
  const [chosenDuration, setChosenDuration] = useState<number>(monthsToUse)
  const [percent, setPercent] = useState<number>(100)
  const getEndDate = useParentalLeavesPeriodsEndDate()

  const handleChange = async (months: number) => {
    clearErrors(id)
    setChosenDuration(months)
  }

  const handleChangeEnd = async (
    months: number,
    onChange: (...event: any[]) => void,
  ) => {
    const days = monthsToDays(months)

    const { data } = await getEndDate({
      input: {
        startDate: currentStartDateAnswer,
        percentage: String(percent),
        length: String(days),
      },
    })

    const endDate = data?.getParentalLeavesPeriodsEndDate?.periodEndDate

    if (endDate) {
      const date = new Date(endDate)

      onChange(format(date, df))
      setChosenEndDate(date.toISOString())
    }
  }

  useEffect(() => {
    const days = monthsToDays(chosenDuration)
    const daysSpentWithPercentage = Math.round((days * percent) / 100)

    const res = updateComputedRights(daysSpentWithPercentage, {
      personal: computedPersonalDays,
      extra: computedExtraDays,
    })
  }, [percent, chosenDuration])

  useEffect(() => {
    const percentage = calculatePeriodPercentage(application, field, {
      startDate: currentStartDateAnswer,
      endDate: chosenEndDate,
    })

    setPercent(percentage)
  }, [chosenEndDate])

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.duration.monthsDescription,
        )}
      />

      <Box
        background="blue100"
        paddingTop={3}
        paddingX={3}
        paddingBottom={3}
        marginTop={3}
      >
        <Box
          width="full"
          background="white"
          borderColor="blue200"
          borderWidth="standard"
          borderStyle="solid"
          borderRadius="large"
          padding={3}
          display="flex"
          alignItems="stretch"
          justifyContent="spaceBetween"
        >
          <Box
            display="flex"
            alignItems="center"
            paddingRight={[2, 3, 3]}
            marginRight={[2, 3, 3]}
            className={styles.percentLabel}
          >
            <Text variant="h4" as="span">
              {formatMessage(parentalLeaveFormMessages.duration.paymentsRatio)}
              &nbsp;&nbsp;
              <Tooltip
                text={formatMessage(
                  parentalLeaveFormMessages.paymentPlan.description,
                )}
              />
            </Text>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            className={styles.percentNumber}
          >
            <Text variant="h2" as="span" color="blue400">
              {percent}%
            </Text>
          </Box>
        </Box>

        <Box marginTop={8}>
          <Controller
            defaultValue={chosenEndDate}
            name={id}
            render={({ onChange }) => (
              <Slider
                min={usageMinMonths}
                max={usageMaxMonths}
                trackStyle={{ gridTemplateRows: 8 }}
                calculateCellStyle={() => ({
                  background: theme.color.dark200,
                })}
                showMinMaxLabels
                showToolTip
                label={{
                  singular: formatMessage(
                    parentalLeaveFormMessages.shared.month,
                  ),
                  plural: formatMessage(
                    parentalLeaveFormMessages.shared.months,
                  ),
                }}
                rangeDates={
                  currentIndex === 0 &&
                  answers.firstPeriodStart !==
                    StartDateOptions.ACTUAL_DATE_OF_BIRTH
                    ? {
                        start: {
                          date: formatDateFns(currentStartDateAnswer),
                          message: formatMessage(
                            parentalLeaveFormMessages.shared.rangeStartDate,
                          ),
                        },
                        end: {
                          date: chosenEndDate
                            ? formatDateFns(chosenEndDate)
                            : '—',
                          message: formatMessage(
                            parentalLeaveFormMessages.shared.rangeEndDate,
                          ),
                        },
                      }
                    : undefined
                }
                currentIndex={chosenDuration}
                onChange={(months: number) => handleChange(months)}
                onChangeEnd={(months: number) =>
                  handleChangeEnd(months, onChange)
                }
              />
            )}
          />
        </Box>
      </Box>

      <input
        ref={register}
        type="hidden"
        value={chosenDuration}
        name={`periods[${currentIndex}].duration`}
      />

      {/* <input
        ref={register}
        type="hidden"
        value={computedPersonalDays}
        name="computedRightsPersonalDays"
      />

      <input
        ref={register}
        type="hidden"
        value={computedExtraDays}
        name="computedRightsExtraDays"
      /> */}
    </Box>
  )
}

export default Duration
