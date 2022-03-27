import { AppShell as MantineAppShell } from '@mantine/core'
import Drawer from 'components/Drawer'
import Header from 'components/Header'
import Navbar from 'components/Navbar'
import { useRoutesCheckerProvider } from 'contexts/RoutesCheckerProvider'
import { useStyles } from './styles'

const AppShell: React.FC = ({ children }) => {
  const { classes } = useStyles()
  const { isPublic } = useRoutesCheckerProvider()

  return (
    <MantineAppShell
      header={<Header />}
      navbar={isPublic ? undefined : <Navbar />}
      classNames={{
        root: classes.root,
        body: classes.body,
        main: classes.main
      }}
    >
      <Drawer />
      {children}
    </MantineAppShell>
  )
}

export default AppShell
