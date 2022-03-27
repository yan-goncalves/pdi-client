import {
  Drawer as MantineDrawer,
  MediaQuery,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import NavItemUser from 'components/NavItemUser'
import NavLinkWrapper from 'components/NavLinkWrapper'
import ScrollArea from 'components/ScrollArea'
import {
  selectDrawerOpened,
  setDrawerOpened
} from 'features/Drawer/drawer-slice'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useStyles } from './styles'

const Drawer = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const { pathname } = useRouter()
  const { drawerOpened } = useAppSelector(selectDrawerOpened)
  const dispatch = useAppDispatch()
  const matches = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

  useEffect(() => {
    if (!matches && drawerOpened) {
      dispatch(setDrawerOpened({ drawerOpened: false }))
    }
  }, [matches, drawerOpened])

  useEffect(() => {
    if (drawerOpened && pathname) {
      dispatch(setDrawerOpened({ drawerOpened: false }))
    }
  }, [pathname])

  return (
    <MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
      <MantineDrawer
        opened={drawerOpened}
        onClose={() => dispatch(setDrawerOpened({ drawerOpened: false }))}
        size={220}
        padding={10}
        title={<NavItemUser direction={'row'} />}
        className={classes.drawer}
      >
        <ScrollArea>
          <NavLinkWrapper />
        </ScrollArea>
      </MantineDrawer>
    </MediaQuery>
  )
}

export default Drawer
