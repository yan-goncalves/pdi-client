import { Navbar as MantineNavbar, Text } from '@mantine/core'
import { TablerIconProps } from '@tabler/icons'
import { LocaleType, useLocale } from 'contexts/LocaleProvider'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentType } from 'react'
import { useStyles } from './styles'

export type NavItemLinkProps = {
  title: {
    [key in LocaleType]: string
  }
  href: string
  icon: ComponentType<TablerIconProps>
  exact?: boolean
}

const NavItemLink = ({ title, href, icon: Icon, exact = false }: NavItemLinkProps) => {
  const { locale } = useLocale()
  const { pathname } = useRouter()
  const active = exact ? pathname === href : pathname.startsWith(href)
  const { classes } = useStyles({ active })

  return (
    <MantineNavbar.Section className={classes.root}>
      <Link href={href}>
        <a className={classes.link}>
          <span>{<Icon stroke={active ? 1.75 : 1.25} />}</span>
          <Text size={'sm'}>{title[locale]}</Text>
        </a>
      </Link>
    </MantineNavbar.Section>
  )
}

export default NavItemLink
