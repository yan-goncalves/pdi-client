import { ENUM_EVALUATIONMODEL_PERIOD } from '../../__generated__/globalTypes'

export const STATUS_EVALUATION = {
  [ENUM_EVALUATIONMODEL_PERIOD.free]: {
    name: {
      'pt-BR': 'admin',
      en: 'admin'
    },
    color: 'red'
  },
  [ENUM_EVALUATIONMODEL_PERIOD.out]: {
    name: {
      'pt-BR': 'concluída',
      en: 'completed'
    },
    color: 'gray'
  },
  [ENUM_EVALUATIONMODEL_PERIOD.midYear]: {
    name: {
      'pt-BR': 'Meio de Ano',
      en: 'Mid-Year'
    },
    color: 'indigo'
  },
  [ENUM_EVALUATIONMODEL_PERIOD.endYear]: {
    name: {
      'pt-BR': 'Fechamento de Ano',
      en: 'End-Year'
    },
    color: 'yellow'
  }
}
