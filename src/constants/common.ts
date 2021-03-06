import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'

export const CommonConstants = {
  add: {
    br: 'Adicionar',
    en: 'Add'
  },

  actor: {
    [EVALUATION_ACTOR.USER]: {
      br: 'Usuário(a)',
      en: 'User'
    },

    [EVALUATION_ACTOR.MANAGER]: {
      br: 'Gestor(a)',
      en: 'Manager'
    }
  },

  historic: {
    br: 'Histórico da Avaliação',
    en: 'Evaluation History'
  },

  loading: {
    en: 'Loading',
    br: 'Carregando'
  },

  comment: {
    br: 'Comentário:',
    en: 'Comment:'
  },

  empty: {
    comment: {
      br: 'Nenhum comentário inserido',
      en: 'No comments entered'
    },

    kpi: {
      br: 'Nenhum KPI relacionado',
      en: 'No KPI related'
    }
  },

  edit: {
    br: 'Editar',
    en: 'Edit'
  },

  delete: {
    br: 'Remover',
    en: 'Delete'
  },

  view: {
    br: 'Visualizar',
    en: 'View'
  },

  soon: {
    br: 'Em breve',
    en: 'Soon'
  },

  next: {
    br: 'Próximo',
    en: 'Next'
  },

  previous: {
    br: 'Anterior',
    en: 'Previous'
  },

  finish: {
    br: 'Finalizar',
    en: 'Finish'
  },

  reply: {
    br: 'Resposta',
    en: 'Answer'
  },

  replyOption: {
    yes: {
      br: 'Sim',
      en: 'Yes'
    },

    no: {
      br: 'Não',
      en: 'No'
    }
  },

  justification: {
    br: 'Por que?',
    en: 'Why?'
  },

  save: {
    true: {
      br: 'Salvando...',
      en: 'Saving...'
    },
    false: {
      br: 'Salvar',
      en: 'Save'
    }
  },

  cancel: {
    br: 'Cancelar',
    en: 'Cancel'
  },

  welcome: {
    br: (name?: string) => `Olá, <b>${name}</b>. Bem-vindo(a) de volta!`,
    en: (name?: string) => `Hey <b>${name}</b>. Welcome back!`
  },

  bye: {
    br: (name?: string) => `Até mais, <b>${name}</b>!`,
    en: (name?: string) => `See you, <b>${name}</b>!`
  },

  rating: {
    title: {
      br: 'Nota:',
      en: 'Grade:'
    },
    label: {
      br: 'Sem nota atribuída',
      en: 'No grade assigned'
    }
  },

  name: {
    br: 'Nome',
    en: 'Name'
  },

  category: {
    br: 'Categoria',
    en: 'Category'
  },

  action: {
    br: 'Ação',
    en: 'Action'
  },

  actions: {
    br: 'Ações',
    en: 'Actions'
  },

  target: {
    br: 'Meta',
    en: 'Target'
  },

  weight: {
    br: 'Peso',
    en: 'Weight'
  },

  create: {
    br: 'Criar',
    en: 'Create'
  },

  description: {
    br: 'Descrição',
    en: 'Description'
  },

  removing: {
    br: 'Removendo',
    en: 'Removing'
  },

  confirm: {
    br: 'Confirmar',
    en: 'Ok'
  },

  placeholder: {
    target: {
      br: 'Adicionar meta alcançada...',
      en: 'Add target achieved...'
    },
    comment: {
      br: 'Adicionar comentário...',
      en: 'Add comment...'
    }
  },

  achieved: {
    br: 'Meta alcançada:',
    en: 'Target achieved:'
  },

  pdi: {
    title: {
      br: 'Plano de Desenvolvimento Individual',
      en: 'Individual Development Plan'
    }
  },

  pdiCoaching: {
    title: {
      br: 'Coaching de Carreira e Crescimento',
      en: 'Career and Growth Coaching'
    }
  },

  pdiCompetence: {
    title: {
      br: 'Desenvolvimento de Competências',
      en: 'Skills Development'
    },

    table: {
      name: {
        br: 'Competências a serem desenvolvidas',
        en: 'Competences to be developed'
      },
      category: {
        br: 'Categoria',
        en: 'Category'
      },
      actions: {
        br: 'Ações',
        en: 'Actions'
      },
      deadline: {
        br: 'Prazo',
        en: 'Deadline'
      }
    },

    empty: {
      br: 'Nenhuma competência atribuída',
      en: 'No competence assigned'
    },

    create: {
      br: 'Adicionar Desenvolvimento de Competência',
      en: 'Add Competence Development'
    },

    edit: {
      br: 'Editar Desenvolvimento de Competência',
      en: 'Edit Competence Development'
    }
  },

  pdiQuality: {
    title: {
      br: 'Pontos Fortes e Melhorias',
      en: 'Strengths and Improvements'
    },

    strength: {
      br: 'Pontos Fortes',
      en: 'Strong Points'
    },

    weakness: {
      br: 'Pontos de Melhoria',
      en: 'Improvement Points'
    }
  },

  deadline: {
    br: 'Prazo',
    en: 'Deadline'
  },

  result: {
    title: {
      br: 'Resultado final',
      en: 'Final result'
    },

    finished: {
      title: {
        br: 'Avaliação finalizada!',
        en: 'Evaluation finished!'
      },

      description: {
        br: 'Aguarde o gestor finalizar sua avaliação para poder ver sua nota final',
        en: 'Wait for the manager to finish your evaluation so you can see your final grade'
      }
    }
  }
}
