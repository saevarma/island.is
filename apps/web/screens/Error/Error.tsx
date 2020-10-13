import React, { ReactNode, Fragment, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Screen } from '@island.is/web/types'
import { Text, Box } from '@island.is/island-ui/core'
import { I18nContext } from '@island.is/web/i18n/I18n'
import * as styles from './Error.treat'
import { nlToBr } from '@island.is/web/utils/nlToBr'

// We'll use these defaults if the top-level (screen) component was unable to
// fetch translations from our CMS
const defaultTranslations = {
  error404Title: 'Afsakið hlé :(',
  error404Body: 'Ekkert fannst á slóðinni {PATH}.',
  error500Title: 'Afsakið hlé :(',
  error500Body:
    'Eitthvað fór úrskeiðis.\nVillan hefur verið skráð og unnið verður að viðgerð eins fljótt og auðið er.',
} as const

const formatBody = (body: string, path: string): ReactNode =>
  body.split('{PATH}').map((s, i) => (
    <Fragment key={i}>
      {i > 0 && <i>{path}</i>}
      {nlToBr(s)}
    </Fragment>
  ))

type ErrorPageProps = {
  statusCode: number
}

export const ErrorPage: Screen<ErrorPageProps> = ({ statusCode }) => {
  const { asPath } = useRouter()
  const t = useContext(I18nContext)?.t ?? defaultTranslations
  const title = statusCode === 404 ? t.error404Title : t.error500Title
  const body = statusCode === 404 ? t.error404Body : t.error500Body

  // Temporary "fix", see https://github.com/vercel/next.js/issues/16931 for details
  useEffect(() => {
    const els = document.querySelectorAll('link[href*=".css"]')
    Array.prototype.forEach.call(els, (el) => {
      el.setAttribute('rel', 'stylesheet')
    })
  }, [])

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      className={styles.container}
      textAlign="center"
    >
      <Text variant="eyebrow" as="div" paddingBottom={2} color="purple400">
        {statusCode}
      </Text>
      <Text variant="h1" as="h1" paddingBottom={3}>
        {title}
      </Text>
      <Text variant="intro" as="p">
        {formatBody(body, asPath)}
      </Text>
    </Box>
  )
}

export default ErrorPage
