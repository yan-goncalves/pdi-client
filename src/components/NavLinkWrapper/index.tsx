import { Navbar as MantineNavbar } from '@mantine/core'
import NavItemSection from 'components/NavItemSection'
import {
  managerNavItemLinks,
  navLinkWrapperTitles,
  userNavItemLinks
} from 'constants/routes'
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

  return (
    <MantineNavbar.Section grow style={{ paddingBottom: 10 }}>
      {session?.user.info.access_role !== 'Director' && (
        <NavItemSection
          sectionTitle={userSectionTitle[locale]}
          items={userNavItemLinks}
        />
      )}
      {session?.user.info?.access_role !== 'User' && (
        <NavItemSection
          sectionTitle={managerSectionTitle[locale]}
          items={managerNavItemLinks}
        />
      )}
    </MantineNavbar.Section>
  )
}

export default NavLinkWrapper
