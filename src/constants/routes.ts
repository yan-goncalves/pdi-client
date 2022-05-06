import {
  IconChartInfographic,
  IconStars,
  IconTarget,
  IconTrendingUp
} from '@tabler/icons'
import { NavItemLinkProps } from 'components/NavItemLink'
import { NavLinkWrapperProps } from 'components/NavLinkWrapper'

export const PUBLIC_ROUTES = ['/api/auth', '/signin', '/favicon', '/img/']

export const navLinkWrapperTitles: NavLinkWrapperProps = {
  userSectionTitle: {
    'pt-BR': 'Área do Usuário',
    en: 'User Area'
  },

  managerSectionTitle: {
    'pt-BR': 'Área do Gestor',
    en: 'Manager Area'
  }
}

export const userNavItemLinks: NavItemLinkProps[] = [
  {
    title: {
      'pt-BR': 'Visão Geral',
      en: 'Dashboard'
    },
    href: '/dashboard',
    icon: IconChartInfographic
  },
  {
    title: {
      'pt-BR': 'Minhas Avaliações',
      en: 'My Evaluations'
    },
    href: '/evaluation',
    icon: IconStars
  },
  {
    title: {
      'pt-BR': 'Meus Objetivos',
      en: 'My Goals'
    },
    href: '/goals',
    icon: IconTarget
  },
  {
    title: {
      'pt-BR': 'Desenvolvimento Pessoal',
      en: 'Personal Development'
    },
    href: '/pdi',
    icon: IconTrendingUp
  }
]

export const managerNavItemLinks: NavItemLinkProps[] = [
  {
    title: {
      'pt-BR': 'Visão Geral do Time',
      en: 'Team Dashboard'
    },
    href: '/manager',
    icon: IconChartInfographic,
    exact: true
  },
  {
    title: {
      'pt-BR': 'Avaliações do Time',
      en: 'Team Evaluations'
    },
    href: '/manager/evaluation',
    icon: IconStars
  },
  {
    title: {
      'pt-BR': 'Objetivos do Time',
      en: 'Team Goals'
    },
    href: '/manager/goals',
    icon: IconTarget
  },
  {
    title: {
      'pt-BR': 'Desenvolvimento Pessoal do Time',
      en: 'Team Personal Development'
    },
    href: '/manager/pdi',
    icon: IconTrendingUp
  }
]
