import {
  IconBuildingFactory,
  IconCertificate,
  IconCoin,
  IconDeviceLaptop,
  IconEngine,
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
