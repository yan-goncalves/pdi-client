import { AppShell as MantineAppShell } from '@mantine/core'
import Drawer from 'components/Drawer'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Navbar from 'components/Navbar'
import { useRoutesManagerProvider } from 'contexts/RoutesManagerProvider'
import { useStyles } from './styles'

const AppShell: React.FC = ({ children }) => {
  const { isPublic } = useRoutesManagerProvider()
  const { classes } = useStyles({ isPublic })

  return (
    <MantineAppShell
      header={<Header />}
      navbar={isPublic ? undefined : <Navbar />}
      footer={<Footer />}
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
