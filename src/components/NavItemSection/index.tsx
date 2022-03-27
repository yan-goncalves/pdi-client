import { Navbar as MantineNavbar } from '@mantine/core'
import NavItemLink, { NavItemLinkProps } from 'components/NavItemLink'
import NavItemText from 'components/NavItemText'

type NavItemSectionProps = {
  sectionTitle: string
  items: NavItemLinkProps[]
}

const NavItemSection = ({ sectionTitle, items }: NavItemSectionProps) => {
  return (
    <MantineNavbar.Section>
      <NavItemText title={sectionTitle} />
      {items.map((item) => (
        <NavItemLink key={item.title} {...item} />
      ))}
    </MantineNavbar.Section>
  )
}

export default NavItemSection
