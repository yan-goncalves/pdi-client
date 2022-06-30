import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'

export enum EVALUATION_PERIOD {
  END = 'END',
  FREE = 'FREE',
  MID = 'MID',
  OUT = 'OUT'
}

export const EvaluationConstants = {
  title: {
    default: {
      br: 'Avaliação de Desempenho',
      en: 'Performance Evaluation'
    },
    [EVALUATION_PERIOD.MID]: {
      br: 'Avaliação de Meio de Ano',
      en: 'Mid-Year Evaluation'
    },
    [EVALUATION_PERIOD.END]: {
      br: 'Avaliação de Fim de Ano',
      en: 'End-Year Evaluation'
    },
    [EVALUATION_PERIOD.FREE]: {
      br: 'Avaliação Administração',
      en: 'Admin Evaluation'
    },
    [EVALUATION_PERIOD.OUT]: {
      br: 'Avaliação Fora do Período',
      en: 'Outdated Evaluation'
    }
  },
  status: {
    [EVALUATION_PERIOD.FREE]: {
      name: {
        br: 'admin',
        en: 'admin'
      },
      color: 'red'
    },
    [EVALUATION_PERIOD.OUT]: {
      name: {
        br: 'Concluída',
        en: 'Completed'
      },
      color: 'gray'
    },
    [EVALUATION_PERIOD.MID]: {
      name: {
        br: 'Meio de Ano',
        en: 'Mid-Year'
      },
      color: 'indigo'
    },
    [EVALUATION_PERIOD.END]: {
      name: {
        br: 'Fechamento de Ano',
        en: 'End-Year'
      },
      color: 'yellow'
    }
  },

  contentTitle: {
    [EVALUATION_ACTOR.USER]: {
      br: 'Minha Avaliação de Desempenho',
      en: 'My Performance Evaluation'
    },
    [EVALUATION_ACTOR.MANAGER]: {
      br: 'Avaliações de Desempenho',
      en: 'Performance Evaluations'
    }
  },

  steps: {
    questions: {
      br: 'Questões Iniciais',
      en: 'Opening Questions'
    },

    skills: {
      br: 'Competências',
      en: 'Skills'
    },

    goals: {
      br: 'Objetivos',
      en: 'Goals'
    },

    feedbacks: {
      br: 'Feedbacks',
      en: 'Feedbacks'
    },

    pdi: {
      br: 'PDI',
      en: 'PDI'
    }
  },

  description: {
    finished: {
      br: 'Avaliação finalizada',
      en: 'Evaluation completed'
    }
  }
}
