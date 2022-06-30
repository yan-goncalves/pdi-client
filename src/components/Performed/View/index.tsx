import { Grid, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { Rating } from '@mui/material'
import { CommonConstants } from 'constants/common'
import { useLocale } from 'contexts/LocaleProvider'
import { useEffect, useState } from 'react'

export type PerformedViewProps = {
  title?: string
  emptyMessage?: string
  comment?: string
  rating?: {
    value?: number
    labels?: string[]
  }
}

const PerformedView = ({ title, emptyMessage, comment, rating }: PerformedViewProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const [value, setValue] = useState<number>(-1)
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    if (rating) {
      setValue(rating?.value || -1)
      setLabels(rating?.labels || [])
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

      <Grid.Col span={12} xs={8}>
        <Group direction={'column'}>
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
