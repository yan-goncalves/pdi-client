import { MediaQuery, Navbar as MantineNavbar } from '@mantine/core'
import NavItemUser from 'components/NavItemUser'
import NavLinkWrapper from 'components/NavLinkWrapper'
import ScrollArea from 'components/ScrollArea'
import { navLinkWrapperTitles } from 'constants/defsRoutes'

const Navbar = () => {
  return (
    <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
      <MantineNavbar height={'100%'} width={{ base: 220 }} p={10}>
        <ScrollArea>
          <NavItemUser />
          <NavLinkWrapper {...navLinkWrapperTitles} />
        </ScrollArea>
      </MantineNavbar>
    </MediaQuery>
  )
}

export default Navbar
