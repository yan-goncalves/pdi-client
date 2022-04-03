import { Footer as MantineFooter, Image, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import { useStyles } from './styles'

const Footer = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()

  return (
    <MantineFooter height={50} className={classes.container}>
      <Link href={'http://ep.slworld.com/ep/index_org.jsp'}>
        <a target={'_blank'}>
          <Image width={120} src={theme.other.images.slbrasil} />
        </a>
      </Link>
    </MantineFooter>
  )
}

export default Footer
