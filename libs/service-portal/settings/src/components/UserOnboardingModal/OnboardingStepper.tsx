import { Box, Inline } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { defineMessage, MessageDescriptor } from 'react-intl'
import { OnboardingStep } from './UserOnboardingModal'
import * as styles from './UserOnboardingModal.treat'
import cn from 'classnames'

interface Props {
  activeStep: OnboardingStep
}

const steps: {
  label: MessageDescriptor
  steps: OnboardingStep[]
}[] = [
  {
    label: defineMessage({
      id: 'service.portal:language',
      defaultMessage: 'Tungumál',
    }),
    steps: ['language-form'],
  },
  {
    label: defineMessage({
      id: 'global:telephone',
      defaultMessage: 'Símanúmer',
    }),
    steps: ['tel-form'],
  },
  {
    label: defineMessage({
      id: 'global:email',
      defaultMessage: 'Netfang',
    }),
    steps: ['email-form', 'submit-form'],
  },
  {
    label: defineMessage({
      id: 'service.portal:confirmation',
      defaultMessage: 'Staðfesting',
    }),
    steps: ['form-submitted'],
  },
]

export const OnboardingStepper: FC<Props> = ({ activeStep }) => {
  return (
    <Box
      display="flex"
      justifyContent={['center', 'flexStart']}
      marginBottom={[3, 5]}
    >
      <Inline space={2}>
        {steps.map((step, index) => (
          <Box
            key={index}
            className={cn(styles.stepDot, {
              [styles.stepDotActive]: step.steps.includes(activeStep),
            })}
            background={
              step.steps.includes(activeStep) ? 'purple400' : 'purple200'
            }
          />
        ))}
      </Inline>
    </Box>
  )
}
