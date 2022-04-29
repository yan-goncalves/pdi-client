export enum EvaluationPeriod {
  endYear = 'endYear',
  free = 'free',
  midYear = 'midYear',
  out = 'out'
}

export const EvaluationConstants = {
  status: {
    [EvaluationPeriod.free]: {
      name: {
        'pt-BR': 'admin',
        en: 'admin'
      },
      color: 'red'
    },
    [EvaluationPeriod.out]: {
      name: {
        'pt-BR': 'Concluída',
        en: 'Completed'
      },
      color: 'gray'
    },
    [EvaluationPeriod.midYear]: {
      name: {
        'pt-BR': 'Meio de Ano',
        en: 'Mid-Year'
      },
      color: 'indigo'
    },
    [EvaluationPeriod.endYear]: {
      name: {
        'pt-BR': 'Fechamento de Ano',
        en: 'End-Year'
      },
      color: 'yellow'
    }
  },

  contentTitle: {
    my: {
      'pt-BR': 'Minha Avaliação de Desempenho',
      en: 'My Performance Evaluation'
    },
    team: {
      'pt-BR': 'Avaliações de Desempenho',
      en: 'Performance Evaluations'
    }
  },

  steps: {
    questions: {
      'pt-BR': 'Questões Iniciais',
      en: 'Opening Questions'
    },

    skills: {
      'pt-BR': 'Competências',
      en: 'Skills'
    },

    goals: {
      'pt-BR': 'Objetivos',
      en: 'Goals'
    },

    feedbacks: {
      'pt-BR': 'Feedbacks',
      en: 'Feedbacks'
    },

    pdi: {
      'pt-BR': 'PDI',
      en: 'IDP'
    }
  },

  description: {
    finished: {
      'pt-BR': 'Avaliação finalizada',
      en: 'Evaluation completed'
    }
  }
}
