import { IconChartInfographic, IconStars, IconTarget, IconTrendingUp } from '@tabler/icons'
import { NavItemLinkProps } from 'components/NavItemLink'
import { NavLinkWrapperProps } from 'components/NavLinkWrapper'

export const PUBLIC_ROUTES = ['/api/auth', '/signin', '/favicon', '/img/']

export const navLinkWrapperTitles: NavLinkWrapperProps = {
  userSectionTitle: {
    br: 'Área do Usuário',
    en: 'User Area'
  },

  managerSectionTitle: {
    br: 'Área do Gestor',
    en: 'Manager Area'
  }
}

export const userNavItemLinks: NavItemLinkProps[] = [
  {
    title: {
      br: 'Visão Geral',
      en: 'Dashboard'
    },
    href: '/dashboard',
    icon: IconChartInfographic
  },
  {
    title: {
      br: 'Minhas Avaliações',
      en: 'My Evaluations'
    },
    href: '/evaluation',
    icon: IconStars
  },
  {
    title: {
      br: 'Meus Objetivos',
      en: 'My Goals'
    },
    href: '/goals',
    icon: IconTarget
  },
  {
    title: {
      br: 'Desenvolvimento Pessoal',
      en: 'Personal Development'
    },
    href: '/pdi',
    icon: IconTrendingUp
  }
]

export const managerNavItemLinks: NavItemLinkProps[] = [
  {
    title: {
      br: 'Visão Geral do Time',
      en: 'Team Dashboard'
    },
    href: '/manager',
    icon: IconChartInfographic,
    exact: true
  },
  {
    title: {
      br: 'Avaliações do Time',
      en: 'Team Evaluations'
    },
    href: '/manager/evaluation',
    icon: IconStars
  },
  {
    title: {
      br: 'Objetivos do Time',
      en: 'Team Goals'
    },
    href: '/manager/goals',
    icon: IconTarget
  },
  {
    title: {
      br: 'Desenvolvimento Pessoal do Time',
      en: 'Team Personal Development'
    },
    href: '/manager/pdi',
    icon: IconTrendingUp
  }
]
