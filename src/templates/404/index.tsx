import { Button, Image, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Grid } from '@nextui-org/react'
import { IconArrowBackUp } from '@tabler/icons'
import { useRouter } from 'next/router'
import { ButtonApiProps } from 'types/common'
import { useStyles } from './styles'

export type Template404Props = {
  message: string
  button: ButtonApiProps
}

const Template404 = ({ message, button }: Template404Props) => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const { push } = useRouter()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false)

  const goBack = async () => {
    await push('/')
  }

  return (
    <Grid.Container
      className={classes.root}
      justify={'center'}
      alignItems={'flex-start'}
      gap={1}
    >
      <Grid
        xl={3}
        lg={3}
        md={3}
        sm={3}
        xs={5}
        className={classes.imageContainer}
      >
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
          <Title order={2}>{message}</Title>
        </Grid>
        <Grid>
          <Button
            variant={'default'}
            leftIcon={<IconArrowBackUp />}
            onClick={goBack}
            size={match ? 'xs' : 'sm'}
          >
            {button.label}
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  )
}

export default Template404
