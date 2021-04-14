import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { reason } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const Reason = ({ application, field }: CRCFieldBaseProps) => {
  const { id } = field
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  return (
    <Box>
      <Text marginTop={3}>{formatMessage(reason.general.description)}</Text>
      <Box marginTop={5}>
        <Controller
          name="reason"
          defaultValue={application.answers.residenceChangeReason}
          render={({ value, onChange }) => {
            return (
              <Input
                id={id}
                name={`${id}`}
                label={formatMessage(reason.input.label)}
                value={value}
                placeholder={formatMessage(reason.input.placeholder)}
                textarea={true}
                rows={5}
                backgroundColor="blue"
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(id as string, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default Reason
