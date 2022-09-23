import { Button, Image, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Grid } from '@nextui-org/react'
import { IconArrowBackUp } from '@tabler/icons'
import { useLocale } from 'contexts/LocaleProvider'
import { useRouter } from 'next/router'
import { useStyles } from './styles'

const Template404 = () => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { classes } = useStyles()
  const { push } = useRouter()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false)

  const goBack = async () => {
    await push('/')
  }

  return (
    <Grid.Container className={classes.root} justify={'center'} alignItems={'flex-start'} gap={1}>
      <Grid xl={3} lg={3} md={3} sm={3} xs={5} className={classes.imageContainer}>
        <Image src={theme.other.images.error404} />
      </Grid>
      <Grid.Container
        direction={'column'}
        alignContent={'center'}
        justify={'flex-start'}
        className={classes.textContainer}
        gap={2}
      >
        <Grid>
          <Title order={2}>
            {locale === 'br'
              ? 'Desculpe, a página que você procura não pode ser encontrada'
              : 'Sorry, the page you were looking for can’t be found'}
          </Title>
          {/* Sorry, the page you were looking for can’t be found. */}
          {/* Desculpa, a página que você procura não pode ser encontrada. */}
        </Grid>
        <Grid>
          <Button
            variant={'default'}
            leftIcon={<IconArrowBackUp />}
            onClick={goBack}
            size={match ? 'xs' : 'sm'}
          >
            {locale === 'br' ? 'Voltar à página inicial' : 'Go to home'}
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  )
}

export default Template404
