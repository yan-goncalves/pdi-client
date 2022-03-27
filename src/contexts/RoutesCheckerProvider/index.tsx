import { PUBLIC_ROUTES } from 'constants/defsRoutes'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const RoutesCheckerContext = createContext({ isPublic: true })

const RoutesCheckerProvider: React.FC = ({ children }) => {
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
    <RoutesCheckerContext.Provider value={{ isPublic }}>
      {children}
    </RoutesCheckerContext.Provider>
  )
}

export const useRoutesCheckerProvider = () => {
  return useContext(RoutesCheckerContext)
}
export default RoutesCheckerProvider
