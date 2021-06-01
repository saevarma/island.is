import { useQuery } from '@apollo/client'
import { Header, Loader } from '@island.is/island-ui-native'
import React, { useState } from 'react'
import { Image } from 'react-native'
import { FormattedDate, useIntl } from 'react-intl'
import { Platform, Share, StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear
} from 'react-native-navigation-hooks/dist'
import WebView from 'react-native-webview'
import PDFReader from 'rn-pdf-reader-js'
import styled from 'styled-components/native'
import { client } from '../../graphql/client'
import {
  GetDocumentResponse,
  GET_DOCUMENT_QUERY
} from '../../graphql/queries/get-document.query'
import {
  ListDocumentsResponse,
  LIST_DOCUMENTS_QUERY
} from '../../graphql/queries/list-documents.query'
import { authStore, useAuthStore } from '../../stores/auth-store'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { ButtonRegistry } from '../../utils/component-registry'
import { useThemedNavigationOptions } from '../../utils/use-themed-navigation-options'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { dynamicColor } from '@island.is/island-ui-native'

const Host = styled.SafeAreaView`
  margin-left: 24px;
  margin-right: 24px;
`

const Border = styled.View`
  height: 1px;
  background-color: ${dynamicColor((props) => ({
    dark: props.theme.shade.shade200,
    light: props.theme.color.blue100,
  }))};
`

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
      },
      noBorder: true,
    },
  }),
  {
    topBar: {
      noBorder: true,
      rightButtons: [
        {
          id: ButtonRegistry.ShareButton,
          icon: require('../../assets/icons/navbar-share.png'),
          accessibilityLabel: 'Share',
        },
      ],
    },
  },
)

export const DocumentDetailScreen: NavigationFunctionComponent<{
  docId: string
}> = ({ componentId, docId }) => {
  useNavigationOptions(componentId)
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const { authorizeResult } = useAuthStore()
  const intl = useIntl()

  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, {
    client,
  })
  const docRes = useQuery<GetDocumentResponse>(GET_DOCUMENT_QUERY, {
    client,
    variables: {
      input: {
        id: docId,
      },
    },
  })

  const Document = {
    ...(docRes.data?.getDocument || {}),
    ...(res.data?.listDocuments?.find((d) => d.id === docId) || {}),
  }

  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useNavigationButtonPress(
    (e) => {
      if (Platform.OS === 'android') {
        authStore.setState({ noLockScreenUntilNextAppStateActive: true })
      }
      Share.share(
        {
          title: Document.subject,
          url: `data:application/pdf;base64,${Document?.content!}`,
        },
        {
          subject: Document.subject,
        },
      )
    },
    componentId,
    ButtonRegistry.ShareButton,
  )

  useNavigationComponentDidAppear(() => {
    setVisible(true)
  })

  useNavigationComponentDidDisappear(() => {
    setVisible(false)
    setLoaded(false)
  })

  const loading = res.loading

  return (
    <>
      <Host>
        <Header
          title={Document.senderName}
          date={<FormattedDate value={Document.date} />}
          message={Document.subject}
          isLoading={loading}
          hasBorder={false}
          logo={{ uri: getOrganizationLogoUrl(Document.senderName!, 75) }}
        />
      </Host>
      <Border />
      <View
        style={{
          flex: 1,
        }}
      >
        {visible &&
          Platform.select({
            android: (
              <PDFReader
                onLoadEnd={() => {
                  setLoaded(true)
                }}
                style={{
                  opacity: loaded ? 1 : 0,
                }}
                source={{
                  base64: `data:application/pdf;base64,${Document.content!}`,
                }}
              />
            ),
            ios: (
              <WebView
                onLoadEnd={() => {
                  setLoaded(true)
                }}
                style={{
                  opacity: loaded ? 1 : 0,
                }}
                source={{
                  uri: Document.url!,
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  body: `documentId=${Document.id}&__accessToken=${authorizeResult?.accessToken}`,
                  method: 'POST',
                }}
              />
            ),
          })}
        {!loaded && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: 300,
              },
            ]}
          >
            <Loader
              text={intl.formatMessage({ id: 'documentDetail.loadingText' })}
            />
          </View>
        )}
      </View>
    </>
  )
}

DocumentDetailScreen.options = getNavigationOptions
