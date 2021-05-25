import {
  RegulationLawChapterTree,
  RegulationMinistryList,
  RegulationSearchResults,
  Year,
} from '../../components/Regulations/Regulations.types'
import { RegulationHomeTexts } from '../../components/Regulations/RegulationTexts.types'

import React, { useState } from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { SubpageDetailsContent } from '@island.is/web/components'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import {
  Box,
  Breadcrumbs,
  Button,
  CategoryCard,
  GridColumn,
  GridColumnProps,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationsSearchSection } from '../../components/Regulations/RegulationsSearchSection'
import {
  getParams,
  prettyName,
  RegulationSearchFilters,
  useRegulationLinkResolver,
} from '../../components/Regulations/regulationUtils'
import { getUiTexts } from '../../components/Regulations/getUiTexts'
import {
  GetRegulationsSearchQuery,
  QueryGetRegulationsSearchArgs,
  GetRegulationsQuery,
  QueryGetRegulationsArgs,
  GetRegulationsYearsQuery,
  GetRegulationsMinistriesQuery,
  GetRegulationsLawChaptersQuery,
  QueryGetRegulationsLawChaptersArgs,
  GetSubpageHeaderQuery,
  QueryGetSubpageHeaderArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_REGULATIONS_SEARCH_QUERY,
  GET_REGULATIONS_LAWCHAPTERS_QUERY,
  GET_REGULATIONS_MINISTRIES_QUERY,
  GET_REGULATIONS_QUERY,
  GET_REGULATIONS_YEARS_QUERY,
  GET_SUBPAGE_HEADER_QUERY,
} from '../queries'
import { RegulationsHomeIntro } from '../../components/Regulations/RegulationsHomeIntro'

const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

export type RegulationsHomeProps = {
  regulations: RegulationSearchResults
  texts: RegulationHomeTexts
  introText: GetSubpageHeaderQuery['getSubpageHeader']
  searchQuery: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: RegulationMinistryList
  lawChapters: RegulationLawChapterTree
  doSearch: boolean
}

const RegulationsHome: Screen<RegulationsHomeProps> = (props) => {
  const { disableRegulationsPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const txt = useNamespace(props.texts)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()
  const totalItems = props.regulations?.data?.length ?? 0
  const stepSize = 9
  const [showCount, setShowCount] = useState(totalItems > 18 ? stepSize : 18)

  const breadCrumbs = (
    <Box display={['none', 'none', 'block']}>
      {/* Show when NOT a device */}
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: linkResolver('homepage').href },
          { title: 'Reglugerðir', href: linkResolver('regulationshome').href },
        ]}
      />
    </Box>
  )

  const resultTitleOffsets: GridColumnProps =
    totalItems === 0
      ? {
          span: ['1/1', '1/1', '1/1', '10/12'],
          offset: ['0', '0', '0', '1/12'],
          paddingTop: [2, 2, 4],
          paddingBottom: [4, 4, 8],
        }
      : {}

  return (
    <SubpageLayout
      main={
        <>
          <RegulationsHomeIntro
            document={props.introText}
            breadCrumbs={breadCrumbs}
            getText={txt}
          />
          <RegulationsSearchSection
            searchFilters={props.searchQuery}
            lawChapters={props.lawChapters}
            ministries={props.ministries}
            years={props.years}
            texts={props.texts}
          />
        </>
      }
      details={
        <SubpageDetailsContent
          header=""
          content={
            <GridContainer>
              <GridRow>
                <GridColumn span={'12/12'} paddingTop={0} paddingBottom={0}>
                  {props.doSearch ? (
                    <Text>
                      {totalItems === 0
                        ? 'Engar reglugerðir fundust fyrir þessi leitarskilyrði.'
                        : String(totalItems).substr(-1) === '1'
                        ? totalItems + ' reglugerð fannst'
                        : `${totalItems} reglugerðir fundust`}
                    </Text>
                  ) : (
                    <Text>
                      {txt('homeNewestRegulations', 'Nýjustu reglugerðirnar')}
                    </Text>
                  )}
                </GridColumn>
              </GridRow>

              <GridRow>
                {props.regulations?.data?.length > 0 &&
                  props.regulations.data.slice(0, showCount).map((reg, i) => (
                    <GridColumn
                      key={reg.name}
                      span={['1/1', '1/2', '1/2', '1/3']}
                      paddingTop={3}
                      paddingBottom={4}
                    >
                      <CategoryCard
                        href={linkToRegulation(reg.name)}
                        heading={prettyName(reg.name)}
                        text={reg.title}
                        tags={[
                          {
                            label: reg.ministry.name ?? reg.ministry,
                            disabled: true,
                          },
                        ]}
                      />
                    </GridColumn>
                  ))}
              </GridRow>
              <Box
                display="flex"
                justifyContent="center"
                marginTop={3}
                textAlign="center"
              >
                {showCount < totalItems && (
                  <Button onClick={() => setShowCount(showCount + stepSize)}>
                    Sjá fleiri ({totalItems - showCount})
                  </Button>
                )}
              </Box>
            </GridContainer>
          }
        />
      }
    />
  )
}

/** Asserts that string is a number between 1900 and 2150
 *
 * Guards against "Infinity" and unreasonably sized numbers
 */
const assertReasonableYear = (maybeYear?: string): Year | undefined =>
  maybeYear && /^\d{4}$/.test(maybeYear)
    ? (Math.max(1900, Math.min(2150, Number(maybeYear))) as Year)
    : undefined

RegulationsHome.getInitialProps = async (ctx) => {
  const { apolloClient, locale, query } = ctx
  const searchQuery = getParams(query, [
    'q',
    'rn',
    'year',
    'yearTo',
    'ch',
    'all',
  ])
  const doSearch = Object.values(searchQuery).some((value) => !!value)

  const [
    texts,
    introText,
    regulations,
    years,
    ministries,
    lawChapters,
  ] = await Promise.all([
    await getUiTexts<RegulationHomeTexts>(
      apolloClient,
      locale,
      'Regulations_Home',
    ),

    apolloClient
      .query<GetSubpageHeaderQuery, QueryGetSubpageHeaderArgs>({
        query: GET_SUBPAGE_HEADER_QUERY,
        variables: {
          input: { id: 'reglugerdir', lang: locale },
        },
      })
      .then((res) => res.data?.getSubpageHeader),

    doSearch
      ? apolloClient
          .query<GetRegulationsSearchQuery, QueryGetRegulationsSearchArgs>({
            query: GET_REGULATIONS_SEARCH_QUERY,
            variables: {
              input: {
                q: searchQuery.q,
                rn: searchQuery.rn,
                year: assertReasonableYear(searchQuery.year),
                yearTo: assertReasonableYear(searchQuery.yearTo),
                ch: searchQuery.ch,
              },
            },
          })
          .then(
            (res) => res.data?.getRegulationsSearch as RegulationSearchResults,
          )
      : apolloClient
          .query<GetRegulationsQuery, QueryGetRegulationsArgs>({
            query: GET_REGULATIONS_QUERY,
            variables: {
              input: { type: 'newest', page: 1 },
            },
          })
          .then((res) => res.data?.getRegulations as RegulationSearchResults),

    apolloClient
      .query<GetRegulationsYearsQuery>({
        query: GET_REGULATIONS_YEARS_QUERY,
      })
      .then((res) => res.data?.getRegulationsYears as Array<number>),

    apolloClient
      .query<GetRegulationsMinistriesQuery>({
        query: GET_REGULATIONS_MINISTRIES_QUERY,
      })
      .then(
        (res) => res.data?.getRegulationsMinistries as RegulationMinistryList,
      ),

    apolloClient
      .query<
        GetRegulationsLawChaptersQuery,
        QueryGetRegulationsLawChaptersArgs
      >({
        query: GET_REGULATIONS_LAWCHAPTERS_QUERY,
        variables: {
          input: {
            tree: true,
          },
        },
      })
      .then(
        (res) =>
          res.data?.getRegulationsLawChapters as RegulationLawChapterTree,
      ),
  ])

  return {
    regulations,
    texts,
    introText,
    searchQuery,
    years,
    ministries,
    lawChapters,
    doSearch,
  }
}

export default withMainLayout(RegulationsHome)
