import { Anchor, Image, useMantineTheme } from '@mantine/core'
import { useStyles } from './styles'

const Footer = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()

  return (
    <footer className={classes.container}>
      <Anchor href={'http://ep.slworld.com/ep/index_org.jsp'} target={'_blank'}>
        <Image width={120} src={theme.other.images.slbrasil} />
      </Anchor>
    </footer>
  )
}

export default Footer
