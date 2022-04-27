import {
  AppShell as MantineAppShell,
  ScrollArea,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Drawer from 'components/Drawer'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Navbar from 'components/Navbar'
import { useRoutesManagerProvider } from 'contexts/RoutesManagerProvider'
import { useStyles } from './styles'

const AppShell: React.FC = ({ children }) => {
  const theme = useMantineTheme()
  const { isPublic } = useRoutesManagerProvider()
  const { classes } = useStyles({ isPublic })
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)
  const fixed = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`, true)

  return (
    <MantineAppShell
      fixed={fixed}
      header={<Header />}
      navbar={!isPublic && !match ? <Navbar /> : undefined}
      footer={<Footer />}
      classNames={{
        root: classes.root,
        main: classes.main
      }}
    >
      <Drawer />
      {children}
    </MantineAppShell>
  )
}

export default AppShell
