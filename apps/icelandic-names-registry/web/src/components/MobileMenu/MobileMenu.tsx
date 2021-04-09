import { Box, Button } from '@island.is/island-ui/core'
import React, { FC, useRef } from 'react'
import { useStore } from '../../store/stateProvider'
import * as styles from './MobileMenu.treat'
import useAuth from '../../hooks/useAuth/useAuth'

const MobileMenu: FC<{}> = () => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const { signOutUser } = useAuth()
  const handleLogoutClick = () => signOutUser()

  if (mobileMenuState === 'closed') return null

  return (
    <Box
      position="fixed"
      right={0}
      bottom={0}
      left={0}
      background="white"
      className={styles.wrapper}
      ref={ref}
    >
      <Box paddingX={3}>
        <Button
          onClick={handleLogoutClick}
          fluid
          icon="logOut"
          iconType="outline"
        >
          Útskrá
        </Button>
      </Box>
    </Box>
  )
}

export default MobileMenu
