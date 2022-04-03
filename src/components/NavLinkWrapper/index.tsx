import { Navbar as MantineNavbar } from '@mantine/core'
import NavItemSection from 'components/NavItemSection'
import { managerNavItemLinks, userNavItemLinks } from 'constants/defsRoutes'
import { LocaleType, useLocale } from 'contexts/LocaleProvider'

export type NavLinkWrapperProps = {
  userSectionTitle: {
    [key in LocaleType]: string
  }
  managerSectionTitle: {
    [key in LocaleType]: string
  }
}

const NavLinkWrapper = ({
  userSectionTitle,
  managerSectionTitle
}: NavLinkWrapperProps) => {
  const { locale } = useLocale()
  return (
    <MantineNavbar.Section grow style={{ paddingBottom: 10 }}>
      <NavItemSection
        sectionTitle={userSectionTitle[locale]}
        items={userNavItemLinks}
      />
      <NavItemSection
        sectionTitle={managerSectionTitle[locale]}
        items={managerNavItemLinks}
      />
    </MantineNavbar.Section>
  )
}

export default NavLinkWrapper
