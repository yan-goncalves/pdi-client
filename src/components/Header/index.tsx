import {
  ActionIcon,
  Anchor,
  Header as MantineHeader,
  MediaQuery,
  Tooltip
} from '@mantine/core'
import { IconMenu2, IconPower } from '@tabler/icons'
import { useAppDispatch } from 'app/hooks'
import LogoPdi from 'components/Logo/LogoPdi'
import { useRoutesCheckerProvider } from 'contexts/RoutesCheckerProvider'
import { setDrawerOpened } from 'features/Drawer/drawer-slice'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useStyles } from './styles'

const Header = () => {
  const { classes, cx } = useStyles()
  const { push, pathname } = useRouter()
  const { status } = useSession()
  const { isPublic } = useRoutesCheckerProvider()
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))

    await push('/').then(
      async () =>
        await signOut({ redirect: false }).then(() =>
          dispatch(
            setLoadingOverlayVisibility({ loadingOverlayVisible: false })
          )
        )
    )
  }

  return (
    <MantineHeader height={50} padding={'xs'}>
      <div className={cx(classes.headerBase, classes.headerLeft)}>
        <div className={classes.headerBase}>
          {!isPublic && (
            <MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
              <ActionIcon
                variant={'transparent'}
                color={'dark'}
                size={'sm'}
                mr={'md'}
                onClick={() =>
                  dispatch(setDrawerOpened({ drawerOpened: true }))
                }
              >
                <IconMenu2 />
              </ActionIcon>
            </MediaQuery>
          )}
          <Anchor href={'/'}>
            <LogoPdi />
          </Anchor>
        </div>
        {status === 'authenticated' && pathname !== '/' && (
          <Tooltip label={'Sair'} position={'left'} transition={'fade'}>
            <ActionIcon
              onClick={handleClick}
              variant={'light'}
              color={'red'}
              radius={'md'}
            >
              <IconPower size={20} />
            </ActionIcon>
          </Tooltip>
        )}
      </div>
    </MantineHeader>
  )
}

export default Header
