import { MediaQuery, Navbar as MantineNavbar } from '@mantine/core'
import NavItemUser from 'components/NavItemUser'
import NavLinkWrapper from 'components/NavLinkWrapper'
import ScrollArea from 'components/ScrollArea'

const Navbar = () => {
  return (
    <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
      <MantineNavbar height={'calc(100% + 40px)'} width={{ base: 220 }} p={10}>
        <ScrollArea>
          <NavItemUser />
          <NavLinkWrapper />
        </ScrollArea>
      </MantineNavbar>
    </MediaQuery>
  )
}

export default Navbar
