import {
  ActionIcon,
  Anchor,
  Group,
  Header as MantineHeader,
  MediaQuery,
  Text,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { IconMenu2, IconPower } from '@tabler/icons'
import { useAppDispatch } from 'app/hooks'
import LocaleSwitcher from 'components/LocaleSwitcher'
import LogoPdi from 'components/Logo/LogoPdi'
import { useRoutesManagerProvider } from 'contexts/RoutesManagerProvider'
import { setDrawerOpened } from 'features/Drawer/drawer-slice'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useStyles } from './styles'

const Header = () => {
  const theme = useMantineTheme()
  const { classes, cx } = useStyles()
  const { data: session } = useSession()
  const { push, pathname } = useRouter()
  const { status } = useSession()
  const { isPublic } = useRoutesManagerProvider()
  const dispatch = useAppDispatch()
  const notifications = useNotifications()

  const handleClick = async () => {
    const user = session?.user
    const name = user?.role === 'Administrator' ? 'Admin' : user?.info.name
    dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))

    await push('/').then(
      async () =>
        await signOut({ redirect: false })
          .then(() =>
            dispatch(
              setLoadingOverlayVisibility({ loadingOverlayVisible: false })
            )
          )
          .finally(() => {
            notifications.showNotification({
              message: (
                <Text style={{ padding: 2, color: theme.colors.blue[9] }}>
                  Até mais, <b>{name}</b>! 👋`
                </Text>
              ),
              color: 'primary',
              radius: 'md',
              autoClose: 1500,
              styles: {
                root: {
                  backgroundColor: theme.colors.blue[1],
                  borderColor: theme.colors.blue[1],

                  '&::before': { backgroundColor: theme.colors.blue[9] }
                },
                description: {
                  color: theme.colors.blue[7]
                },
                closeButton: {
                  color: theme.colors.blue[7],
                  '&:hover': { backgroundColor: theme.colors.blue[2] }
                }
              }
            })
          })
    )
  }

  return (
    <MantineHeader height={50} p={'xs'}>
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
        <Group>
          <LocaleSwitcher />

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
        </Group>
      </div>
    </MantineHeader>
  )
}

export default Header
