import React from 'react'
import {
  Text,
  GridRow,
  GridColumn,
  GridContainer,
  Box,
} from '@island.is/island-ui/core'
import { BackgroundImage, DataLinkCard } from '@island.is/web/components'

interface LinkCardProps {
  title: string
  body: string
  link?: string
  id?: string
  linkTitle?: string
}

interface DataLinkSectionProps {
  title?: string
  titleId?: string
  description?: string
  image?: { title: string; url: string }
  cards: LinkCardProps[]
}

export const DataLinkSection = ({
  title = 'Þjónustuflokkar',
  titleId,
  description,
  image,
  cards,
}: DataLinkSectionProps) => {
  const titleProps = titleId ? { id: titleId } : {}

  return (
    <GridContainer>
      <GridRow marginBottom={10}>
        <GridColumn span={['12/12', '5/12', '5/12']}>
          <Text variant="h1" as="h1" paddingBottom={4} {...titleProps}>
            {title}
          </Text>
          <Text paddingBottom={4}>{description}</Text>
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12']}>
          <Box width="full">
            <BackgroundImage
              width={600}
              positionX="right"
              backgroundSize="contain"
              image={image}
            />
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        {cards.map((card, index) => {
          if (card.title.length > 0) {
            return (
              <GridColumn
                key={index}
                span={['12/12', '6/12', '6/12', '4/12']}
                paddingBottom={3}
              >
                <DataLinkCard {...card} />
              </GridColumn>
            )
          }
          return
        })}
      </GridRow>
    </GridContainer>
  )
}

export default DataLinkSection
