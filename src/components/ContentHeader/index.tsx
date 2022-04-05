import { Title } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { NavItemLinkProps } from 'components/NavItemLink'
import { managerNavItemLinks, userNavItemLinks } from 'constants/defsRoutes'
import { useLocale } from 'contexts/LocaleProvider'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useStyles } from './styles'

const ContentHeader = () => {
  const [scroll] = useWindowScroll()
  const { classes } = useStyles({ scroll: scroll.y >= 30 })
  const { locale } = useLocale()
  const { pathname } = useRouter()
  const [route, setRoute] = useState<Pick<NavItemLinkProps, 'title'>>({
    title: {
      'pt-BR': '',
      en: ''
    }
  })

  useEffect(() => {
    const split = pathname.split('/').filter((x) => x.trim() !== '')
    const routes =
      split[0] === 'manager' ? managerNavItemLinks : userNavItemLinks
    const evaluationRoute = routes.find((route) => route.href === pathname)

    setRoute((state) => ({
      title: evaluationRoute?.title || state.title
    }))
  }, [pathname])

  return (
    <div className={classes.root}>
      <Title p={20} order={2}>
        {route.title[locale]}
      </Title>
    </div>
  )
}

export default ContentHeader
