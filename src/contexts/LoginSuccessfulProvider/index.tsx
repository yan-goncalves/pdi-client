import { Text } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useSession } from 'next-auth/react'
import { createContext, useEffect } from 'react'
import useCookie from 'react-use-cookie'

const LoginSuccessfulContext = createContext(null)

const LoginSuccessfulProvider: React.FC = ({ children }) => {
  const [loginOK, setLoginOK] = useCookie('next-auth.login-successfully')
  const notification = useNotifications()
  const { data: session } = useSession()

  useEffect(() => {
    if (loginOK === 'ok' && !!session) {
      notification.showNotification({
        message: (
          <Text style={{ padding: 2 }}>
            Olá, <b>{session.user?.info?.name}</b>. Bem-vindo(a) de volta! 😎
          </Text>
        ),
        color: 'green',
        radius: 'md',
        autoClose: 3000,
        onOpen: () => setLoginOK('')
      })
    }
  }, [loginOK, session])

  return (
    <LoginSuccessfulContext.Provider value={null}>
      {children}
    </LoginSuccessfulContext.Provider>
  )
}

export default LoginSuccessfulProvider
