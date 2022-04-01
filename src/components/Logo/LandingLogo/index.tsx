import { Image } from '@mantine/core'
import { useStyles } from './styles'

export type HomeLogoProps = {
  url: string
  alternativeText: string
}

const HomeLogo = ({ url, alternativeText }: HomeLogoProps) => {
  const { classes } = useStyles()

  return <Image className={classes.image} src={url} alt={alternativeText} />
}

export default HomeLogo
