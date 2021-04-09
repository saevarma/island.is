import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { client } from '../graphql/client'
import Authenticator from '../components/Authenticator/Authenticator'
import { StateProvider } from '../store/stateProvider'
import { LocaleProvider } from '@island.is/localization'
import * as store from '../store/store'
import Layout from '../components/Layout/Layout'
import * as styles from './App.treat'
import OidcSignIn from '../components/Authenticator/OidcSignIn'
import OidcSilentSignIn from '../components/Authenticator/OidcSilentSignIn'
// import { ServicePortalPath } from '@island.is/service-portal/core'
// import { GlobalModules } from '../components/GlobalModules/GlobalModules'
// import { UserProfileLocale } from '../components/UserProfileLocale/UserProfileLocale'

import Paths from '../constants'

export const App = () => {
  return (
    <div className={styles.page}>
      <ApolloProvider client={client}>
        <StateProvider
          initialState={store.initialState}
          reducer={store.reducer}
        >
          <LocaleProvider locale={'is'} messages={{}}>
            <div>
              <Router basename="/minarsidur">
                <Switch>
                  <Route
                    exact
                    path={Paths.MinarSidurSignInOidc}
                    component={OidcSignIn}
                  />
                  <Route
                    exact
                    path={Paths.MinarSidurSilentSignInOidc}
                    component={OidcSilentSignIn}
                  />
                  <Route>
                    <Authenticator>
                      <Layout>
                        <Switch>
                          <Route exact path={Paths.MinarSidurRoot}>
                            <div>logged in</div>
                          </Route>
                        </Switch>
                      </Layout>
                    </Authenticator>
                  </Route>
                </Switch>
              </Router>
            </div>
          </LocaleProvider>
        </StateProvider>
      </ApolloProvider>
    </div>
  )
}

export default App
