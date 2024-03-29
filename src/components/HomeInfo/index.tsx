import { Button, Group, MediaQuery, Text, Title } from '@mantine/core'
import { Grid } from '@nextui-org/react'
import { useAppDispatch } from 'app/hooks'
import Image from 'components/Image'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ButtonApiProps } from 'types/common'
import { useStyles } from './styles'

export type HomeInfoProps = {
  title: string
  description: string
  button: ButtonApiProps
  hero: string
}

const HomeInfo = ({ title, description, button, hero }: HomeInfoProps) => {
  const { push } = useRouter()
  const { data: session, status } = useSession()
  const { classes, cx } = useStyles()
  const dispatch = useAppDispatch()
  const splitDescription = description.split(/<[^>]*>/g).filter((p) => p.trim() !== '')

  const handleClick = async () => {
    if (!!session && status === 'authenticated') {
      await push('dashboard')
    } else {
      dispatch(
        setLoadingOverlayVisibility({
          loadingOverlayVisible: true
        })
      )

      await push('signin?callbackUrl=%2Fdashboard').then(() => {
        dispatch(
          setLoadingOverlayVisibility({
            loadingOverlayVisible: false
          })
        )
      })
    }
  }

  return (
    <Grid.Container direction={'column'} gap={3}>
      <Grid>
        {title
          .split(/([A-Z]\w+\s[a-z]{0,})/)
          .filter((t) => t.trim() !== '')
          .map((text) =>
            text.includes('Development') || text.includes('Desenvolvimento') ? (
              <Text
                key={text}
                variant={'gradient'}
                gradient={{
                  from: 'dark',
                  to: 'blue'
                }}
                className={classes.title}
              >
                {text.trim()}
              </Text>
            ) : (
              <Title key={text} order={1} className={classes.title}>
                {text.trim()}
              </Title>
            )
          )}
      </Grid>
      <MediaQuery largerThan={'sm'} styles={{ display: 'none' }}>
        {
          // ADICIONAR ALT TEXT
        }
        <Group direction={'column'} align={'center'}>
          <Image url={hero} alternativeText={''} className={classes.hero} />
        </Group>
      </MediaQuery>
      <Grid className={classes.descriptionGroup}>
        {splitDescription.map((paragraph, index) =>
          index === splitDescription.length - 1 ? (
            <Text
              key={paragraph}
              size={'md'}
              variant={'gradient'}
              gradient={{
                from: 'blue',
                to: 'dark',
                deg: 135
              }}
              className={cx(classes.description, classes.footerDescription)}
            >
              {paragraph}
            </Text>
          ) : (
            <Text key={paragraph} size={'sm'} className={classes.description}>
              {paragraph}
            </Text>
          )
        )}
      </Grid>
      <Grid className={classes.buttonGroup}>
        <Button className={classes.button} onClick={handleClick}>
          {button.label}
        </Button>
      </Grid>
    </Grid.Container>
  )
}

export default HomeInfo
