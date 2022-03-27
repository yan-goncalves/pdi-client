import { Image, useMantineTheme } from '@mantine/core'
import { useStyles } from './styles'

const LandingLogo = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()

  return <Image className={classes.image} src={theme.other.images.landing} />
}

export default LandingLogo
