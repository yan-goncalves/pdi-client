export enum EVALUATION_MODEL_PERIOD {
  endYear = 'endYear',
  free = 'free',
  midYear = 'midYear',
  out = 'out'
}

export const STATUS_EVALUATION = {
  [EVALUATION_MODEL_PERIOD.free]: {
    name: {
      'pt-BR': 'admin',
      en: 'admin'
    },
    color: 'red'
  },
  [EVALUATION_MODEL_PERIOD.out]: {
    name: {
      'pt-BR': 'Concluída',
      en: 'Completed'
    },
    color: 'gray'
  },
  [EVALUATION_MODEL_PERIOD.midYear]: {
    name: {
      'pt-BR': 'Meio de Ano',
      en: 'Mid-Year'
    },
    color: 'indigo'
  },
  [EVALUATION_MODEL_PERIOD.endYear]: {
    name: {
      'pt-BR': 'Fechamento de Ano',
      en: 'End-Year'
    },
    color: 'yellow'
  }
}
