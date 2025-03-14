import {
  IconBuildingFactory,
  IconCertificate,
  IconCoin,
  IconDeviceLaptop,
  IconEngine,
  IconLetterA,
  IconLetterB,
  IconLetterC,
  IconLetterD,
  IconLetterE,
  IconLetterF,
  IconLetterG,
  IconLetterH,
  IconLetterI,
  IconLetterJ,
  IconLetterK,
  IconLetterL,
  IconLetterM,
  IconLetterN,
  IconLetterO,
  IconLetterP,
  IconLetterQ,
  IconLetterR,
  IconLetterS,
  IconLetterT,
  IconLetterU,
  IconLetterV,
  IconLetterW,
  IconLetterX,
  IconLetterY,
  IconLetterZ,
  IconShoppingCart,
  IconSocial,
  IconTir,
  IconTool,
  TablerIconProps
} from '@tabler/icons'
import { ComponentType } from 'react'

export type DepartmentIconProps = {
  [key: string]: ComponentType<TablerIconProps>
}

export const LetterIcons: { [key: string]: ComponentType<TablerIconProps> } = {
  a: IconLetterA,
  b: IconLetterB,
  c: IconLetterC,
  d: IconLetterD,
  e: IconLetterE,
  f: IconLetterF,
  g: IconLetterG,
  h: IconLetterH,
  i: IconLetterI,
  j: IconLetterJ,
  k: IconLetterK,
  l: IconLetterL,
  m: IconLetterM,
  n: IconLetterN,
  o: IconLetterO,
  p: IconLetterP,
  q: IconLetterQ,
  r: IconLetterR,
  s: IconLetterS,
  t: IconLetterT,
  u: IconLetterU,
  v: IconLetterV,
  w: IconLetterW,
  x: IconLetterX,
  y: IconLetterY,
  z: IconLetterZ
}

export const DepartmentIcon: DepartmentIconProps = {
  compras: IconShoppingCart,
  engenharia: IconEngine,
  financeiro: IconCoin,
  logistica: IconTir,
  manutencao_ferramentaria: IconTool,
  producao: IconBuildingFactory,
  qualidade: IconCertificate,
  rh: IconSocial,
  ti: IconDeviceLaptop
}

export type IconSelectorProps = {
  name: string
} & TablerIconProps
