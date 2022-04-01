import {
  IconChartInfographic,
  IconStars,
  IconTarget,
  IconTrendingUp
} from '@tabler/icons'
import { NavItemLinkProps } from 'components/NavItemLink'

export const PUBLIC_ROUTES = [
  '/api/.well-known/openid-configuration',
  '/authorize',
  '/api/auth',
  '/auth/login',
  '/signin',
  '/favicon',
  '/img/'
]

export const userNavItemLinks: NavItemLinkProps[] = [
  {
    title: 'Visão Geral',
    href: '/dashboard',
    icon: IconChartInfographic
  },
  {
    title: 'Minhas Avaliações',
    href: '/evaluation',
    icon: IconStars
  },
  {
    title: 'Meus Objetivos',
    href: '/goals',
    icon: IconTarget
  },
  {
    title: 'Desenvolvimento Pessoal',
    href: '/pdi',
    icon: IconTrendingUp
  }
]

export const managerNavItemLinks: NavItemLinkProps[] = [
  {
    title: 'Visão Geral do Time',
    href: '/manager/teste',
    icon: IconChartInfographic
  },
  {
    title: 'Avaliações do Time',
    href: '/manager/evaluation',
    icon: IconStars
  },
  {
    title: 'Objetivos do Time',
    href: '/manager/goals',
    icon: IconTarget
  },
  {
    title: 'Desenvolvimento Pessoal do Time',
    href: '/manager/pdi',
    icon: IconTrendingUp
  }
]
