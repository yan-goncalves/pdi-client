import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'

export const CommonConstants = {
  period: {
    br: 'Período',
    en: 'Period'
  },

  search: {
    br: 'Buscar usuário',
    en: 'Search user'
  },

  add: {
    br: 'Adicionar',
    en: 'Add'
  },

  logout: {
    br: 'Sair',
    en: 'Logout'
  },

  download: {
    br: 'Baixar',
    en: 'Download'
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
    en: 'Evaluation Historical'
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
    },

    empty: {
      br: 'Nenhum coaching de carreira e crescimento inserido',
      en: 'No career and growth coaching entered'
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
    },

    empty: {
      strength: {
        br: 'Nenhum ponto forte inserido',
        en: 'No strengths entered'
      },

      weakness: {
        br: 'Nenhum ponto de melhoria inserido',
        en: 'No improvement point entered'
      }
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

    concept: {
      br: 'Conceito',
      en: 'Concept'
    },

    grade: {
      br: 'Nota',
      en: 'Grade'
    },

    finished: {
      title: {
        br: 'Avaliação finalizada!',
        en: 'Evaluation finished!'
      },

      description: {
        mid: {
          br: 'Obrigado por realizar a avaliação de meio de ano!',
          en: 'Thank you for doing the mid-year evaluation'
        },

        end: {
          br: 'Aguarde o gestor finalizar sua avaliação para poder ver sua nota final',
          en: 'Wait for the manager to finish your evaluation so you can see your final grade'
        }
      }
    }
  },

  reports: {
    title: {
      br: 'Relatórios',
      en: 'Reports'
    },

    userListTitle: {
      br: 'Selecione os usuários para exportação:',
      en: 'Select users for export:'
    },

    button: {
      br: 'Gerar relatório',
      en: 'Generate report'
    },

    status: {
      generate: {
        title: {
          br: 'Por favor, aguarde...',
          en: 'Please, wait...'
        },

        label: {
          br: 'Gerando relatório...',
          en: 'Generating report...'
        },

        button: {
          br: 'Processando...',
          en: 'Processing...'
        }
      },

      ready: {
        title: {
          br: 'Relatório pronto',
          en: 'Report is ready'
        },

        label: {
          br: 'O relatório está pronto para ser baixado',
          en: 'Report is ready to download'
        }
      },

      error: {
        title: {
          br: 'Solicitação incompleta',
          en: 'Incomplete request'
        },

        label: {
          br: 'Não foi possível atender a solicitação',
          en: 'Unable to fulfill the request'
        }
      }
    }
  },

  selectAll: {
    br: 'Selecionar todos',
    en: 'Select all'
  }
}
