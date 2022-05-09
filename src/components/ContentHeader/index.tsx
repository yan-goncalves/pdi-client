import { Title } from '@mantine/core'
import ContentNavbar from 'components/ContentNavbar'
import { NavItemLinkProps } from 'components/NavItemLink'
import { managerNavItemLinks, userNavItemLinks } from 'constants/routes'
import { useLocale } from 'contexts/LocaleProvider'
import { useRouter } from 'next/router'
import { isValidElement, useEffect, useState } from 'react'

export type ContentHeaderProps = {
  title?: React.ReactNode
}

const ContentHeader = ({ title }: ContentHeaderProps) => {
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
    const routes = split[0] === 'manager' ? managerNavItemLinks : userNavItemLinks
    const evaluationRoute = routes.find((route) => route.href === pathname)

    setRoute((state) => ({
      title: evaluationRoute?.title || state.title
    }))
  }, [pathname])

  return (
    <ContentNavbar>
      {isValidElement(title) ? (
        <>{title}</>
      ) : (
        <Title p={20} order={2}>
          {title ?? route.title[locale]}
        </Title>
      )}
    </ContentNavbar>
  )
}

export default ContentHeader
