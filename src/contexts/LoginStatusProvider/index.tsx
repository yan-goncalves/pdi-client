import { Text } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useSession } from 'next-auth/react'
import { createContext, useEffect } from 'react'
import useCookie from 'react-use-cookie'

const LoginStatusContext = createContext(null)

const LoginStatusProvider: React.FC = ({ children }) => {
  const [loginStatus, setLoginStatus] = useCookie('next-auth.login-status')
  const notifications = useNotifications()
  const { data: session } = useSession()

  useEffect(() => {
    if (loginStatus === 'ok' && !!session) {
      const user = session.user
      const name = user.role === 'Administrator' ? 'Admin' : user?.info?.name

      notifications.showNotification({
        message: (
          <Text style={{ padding: 2 }}>
            Olá, <b>{name}</b>. Bem-vindo(a) de volta! 😎
          </Text>
        ),
        color: 'green',
        radius: 'md',
        autoClose: 3000,
        onOpen: () => setLoginStatus('')
      })
    }
  }, [loginStatus, session])

  return (
    <LoginStatusContext.Provider value={null}>
      {children}
    </LoginStatusContext.Provider>
  )
}

export default LoginStatusProvider
