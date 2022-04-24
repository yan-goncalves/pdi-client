import { useWindowScroll } from '@mantine/hooks'
import { useStyles } from './styles'

export type ContentNavbarProps = {
  children: React.ReactNode
}

const ContentNavbar = ({ children }: ContentNavbarProps) => {
  const [scroll] = useWindowScroll()
  const { classes } = useStyles({ scroll: scroll.y >= 30 })

  return <div className={classes.root}>{children}</div>
}

export default ContentNavbar
