import { useMantineTheme } from '@mantine/core'
import { useMediaQuery, useWindowScroll } from '@mantine/hooks'
import { useStyles } from './styles'

export type ContentNavbarProps = {
  children: React.ReactNode
}

const ContentNavbar = ({ children }: ContentNavbarProps) => {
  const theme = useMantineTheme()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)
  const [scroll] = useWindowScroll()
  const top = !match ? 50 : 0
  const { classes } = useStyles({
    top,
    scroll: scroll.y >= 50
  })

  return <div className={classes.root}>{children}</div>
}

export default ContentNavbar
