import {
  Anchor,
  Footer as MantineFooter,
  Image,
  useMantineTheme
} from '@mantine/core'
import { useStyles } from './styles'

const Footer = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()

  return (
    <MantineFooter height={50} className={classes.container}>
      <Anchor href={'http://ep.slworld.com/ep/index_org.jsp'} target={'_blank'}>
        <Image width={120} src={theme.other.images.slbrasil} />
      </Anchor>
    </MantineFooter>
  )
}

export default Footer
