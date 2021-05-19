import { style } from 'treat'

import { spacing } from '@island.is/island-ui/theme'

export const radioValue = style({
  marginBottom: spacing[2],

  ':last-of-type': {
    marginBottom: 0,
  },
})
