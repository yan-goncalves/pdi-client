import { Navbar as MantineNavbar } from '@mantine/core'
import NavItemLink, { NavItemLinkProps } from 'components/NavItemLink'
import NavItemText from 'components/NavItemText'
import { useLocale } from 'contexts/LocaleProvider'

type NavItemSectionProps = {
  sectionTitle: string
  items: NavItemLinkProps[]
}

const NavItemSection = ({ sectionTitle, items }: NavItemSectionProps) => {
  const { locale } = useLocale()

  return (
    <MantineNavbar.Section>
      <NavItemText title={sectionTitle} />
      {items.map((item) => (
        <NavItemLink key={item.title[locale]} {...item} />
      ))}
    </MantineNavbar.Section>
  )
}

export default NavItemSection
