import { Navbar as MantineNavbar } from '@mantine/core'
import NavItemSection from 'components/NavItemSection'
import { managerNavItemLinks, userNavItemLinks } from 'constants/defsRoutes'

const NavLinkWrapper = () => {
  return (
    <MantineNavbar.Section grow style={{ paddingBottom: 10 }}>
      <NavItemSection
        sectionTitle={'Área do Usuário'}
        items={userNavItemLinks}
      />
      <NavItemSection
        sectionTitle={'Área do Gestor'}
        items={managerNavItemLinks}
      />
    </MantineNavbar.Section>
  )
}

export default NavLinkWrapper
