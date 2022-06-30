import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'

export const GoalsConstants = {
  title: {
    [EVALUATION_ACTOR.USER]: {
      br: 'Meus Objetivos',
      en: 'My Goals'
    },

    [EVALUATION_ACTOR.MANAGER]: {
      br: 'Objetivos do Time',
      en: 'Team Goals'
    }
  },

  empty: {
    br: 'Nenhum objetivo definido pelo(a) gestor(a)',
    en: 'No objective defined by the manager'
  },

  create: {
    br: 'Criar objetivo',
    en: 'Create goal'
  },

  edit: {
    br: 'Editar objetivo',
    en: 'Edit goal'
  }
}
