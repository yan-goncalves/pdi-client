import { PUBLIC_ROUTES } from 'constants/ROUTES'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const RoutesManagerContext = createContext({ isPublic: true })

const RoutesManagerProvider: React.FC = ({ children }) => {
  const home = '/'
  const { pathname } = useRouter()
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    const routes = PUBLIC_ROUTES.filter((route) => {
      if (pathname.includes(route)) {
        return route
      }
    })

    if (routes.length === 0 && pathname !== home) {
      setIsPublic(false)
    } else {
      setIsPublic(true)
    }
  }, [pathname])

  return (
    <RoutesManagerContext.Provider value={{ isPublic }}>
      {children}
    </RoutesManagerContext.Provider>
  )
}

export const useRoutesManagerProvider = () => {
  return useContext(RoutesManagerContext)
}

export default RoutesManagerProvider
