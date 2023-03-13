import { useQuery } from '@apollo/client'
import { Grid, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { Rating } from '@mui/material'
import { CommonConstants } from 'constants/common'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_RATINGS } from 'graphql/queries/collection/Rating'
import { useEffect, useState } from 'react'
import { GetRatings } from 'types/collection/Rating'

export type PerformedViewProps = {
  title?: string
  emptyMessage?: string
  comment?: string
  target?: string
  rating?: number
}

const PerformedView = ({ title, emptyMessage, comment, rating, target }: PerformedViewProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const [value, setValue] = useState<number>(-1)
  const [labels, setLabels] = useState<string[]>([])
  const { data } = useQuery<GetRatings>(GET_RATINGS, {
    context: {
      headers: {
        locale
      }
    }
  })

  useEffect(() => {
    if (data) {
      setLabels(data?.ratings.map((rating) => rating.description) || [])
    }
  }, [data])

  useEffect(() => {
    if (typeof rating === 'number') {
      setValue(rating || -1)
    }
  }, [rating])

  return (
    <Grid p={10} gutter={50}>
      {!!rating && (
        <Grid.Col span={12} xs={3} xl={2}>
          <Group
            align={'center'}
            direction={'column'}
            spacing={'xs'}
            sx={{ cursor: 'not-allowed' }}
          >
            <Title order={6}>{CommonConstants.rating.title[locale]}</Title>
            <Rating
              value={value}
              size={'large'}
              max={labels.length}
              sx={{ pointerEvents: 'none' }}
            />
            <Text
              align={'center'}
              weight={value > -1 ? 'bold' : 'normal'}
              size={value > -1 ? 'md' : 'xs'}
              sx={(theme) => ({
                color: value > -1 ? 'dark' : theme.colors.gray[4],
                minHeight: 25
              })}
            >
              {value > -1 ? labels?.[value - 1] : CommonConstants.rating.label[locale]}
            </Text>
          </Group>
        </Grid.Col>
      )}

      <Grid.Col span={12} xs={!rating ? 12 : 8}>
        <Group direction={'column'}>
          {typeof target === 'string' && (
            <>
              <Title order={6}>{CommonConstants.achieved[locale]}</Title>
              <Text
                size={!comment ? 'sm' : 'lg'}
                weight={400}
                sx={{ color: !comment ? theme.colors.gray[3] : 'dark' }}
              >
                {!target.length ? (
                  emptyMessage ?? CommonConstants.empty.comment[locale]
                ) : (
                  <i> - {target}</i>
                )}
              </Text>
            </>
          )}
          <Title order={6}>{title ?? CommonConstants.comment[locale]}</Title>
          <Text
            size={!comment ? 'sm' : 'lg'}
            weight={400}
            sx={{ color: !comment ? theme.colors.gray[3] : 'dark' }}
          >
            {!comment ? emptyMessage ?? CommonConstants.empty.comment[locale] : <i> - {comment}</i>}
          </Text>
        </Group>
      </Grid.Col>
    </Grid>
  )
}

export default PerformedView
