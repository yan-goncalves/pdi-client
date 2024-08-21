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
  },

  import: {
    br: 'Importar objetivos do ano anterior',
    en: "Import previous year's goals"
  },

  importing: {
    br: 'Importando objetivos...',
    en: 'Importing goals...'
  },

  totalWeight: {
    br: 'Peso total',
    en: 'Total weight'
  },

  totalWeightLess: {
    br: 'O peso total dos objetivos deve ser igual a 100.',
    en: 'The total weight of the goals must be exactly 100.'
  },

  importPrevious: {
    info: {
      br: 'Os objetivos do ano anterior que forem iguais aos atuais não aparecerão na lista.',
      en: 'The goals from the previous year that are the same as the current ones will not appear on the list.'
    },
    saving: {
      br: 'Salvando objetivos...',
      en: 'Saving goals...'
    },
    saved: {
      br: 'Objetivos salvos',
      en: 'Goals saved'
    }
  }
}
