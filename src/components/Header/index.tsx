import {
  ActionIcon,
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
import LogoPdi from 'components/LogoPdi'
import { CommonConstants } from 'constants/common'
import { ROLES } from 'constants/role'
import { useLocale } from 'contexts/LocaleProvider'
import { useRoutesManagerProvider } from 'contexts/RoutesManagerProvider'
import { setDrawerOpened } from 'features/Drawer/drawer-slice'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useStyles } from './styles'

const Header = () => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { classes, cx } = useStyles()
  const { data: session } = useSession()
  const { push, pathname } = useRouter()
  const { status } = useSession()
  const { isPublic } = useRoutesManagerProvider()
  const dispatch = useAppDispatch()
  const notifications = useNotifications()

  const handleClick = async () => {
    const user = session?.user
    const name = user?.role === ROLES.ADMIN ? 'Admin' : user?.info.name
    dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))

    await push('/').then(
      async () =>
        await signOut({ redirect: false })
          .then(() => dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: false })))
          .finally(() => {
            notifications.showNotification({
              message: (
                <Text
                  dangerouslySetInnerHTML={{
                    __html: `${CommonConstants.bye[locale](name)} 👋`
                  }}
                />
              ),
              color: 'primary',
              radius: 'md',
              autoClose: 1500,
              styles: {
                root: {
                  borderColor: theme.colors.blue[6],
                  '&::before': { backgroundColor: theme.colors.blue[6] }
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
                onClick={() => dispatch(setDrawerOpened({ drawerOpened: true }))}
              >
                <IconMenu2 />
              </ActionIcon>
            </MediaQuery>
          )}
          <Link href={'/'}>
            <a>
              <LogoPdi />
            </a>
          </Link>
        </div>
        <Group>
          <LocaleSwitcher />

          {status === 'authenticated' && pathname !== '/' && (
            <Tooltip label={CommonConstants.logout[locale]} position={'left'}>
              <ActionIcon onClick={handleClick} variant={'light'} color={'red'}>
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
