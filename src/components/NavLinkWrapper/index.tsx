import { LoadingOverlay, Navbar as MantineNavbar } from '@mantine/core'
import NavItemSection from 'components/NavItemSection'
import { ROLES } from 'constants/role'
import { managerNavItemLinks, navLinkWrapperTitles, userNavItemLinks } from 'constants/routes'
import { LocaleType, useLocale } from 'contexts/LocaleProvider'
import { useSession } from 'next-auth/react'

export type NavLinkWrapperProps = {
  userSectionTitle: {
    [key in LocaleType]: string
  }
  managerSectionTitle: {
    [key in LocaleType]: string
  }
}

const NavLinkWrapper = () => {
  const { locale } = useLocale()
  const { data: session } = useSession()
  const { userSectionTitle, managerSectionTitle } = navLinkWrapperTitles

  if (!session) {
    return <LoadingOverlay visible />
  }

  return (
    <MantineNavbar.Section grow style={{ paddingBottom: 10 }}>
      {![ROLES.ADMIN, ROLES.DIRECTOR].includes(session.user?.role) && (
        <NavItemSection sectionTitle={userSectionTitle[locale]} items={userNavItemLinks} />
      )}
      {session?.user?.role !== ROLES.USER && (
        <NavItemSection sectionTitle={managerSectionTitle[locale]} items={managerNavItemLinks} />
      )}
    </MantineNavbar.Section>
  )
}

export default NavLinkWrapper
