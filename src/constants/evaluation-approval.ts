export enum EVALUATION_APPROVAL_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum EVALUATION_APPROVAL_PERIOD {
  MID = 'MID',
  END = 'END'
}

export const EVALUATION_APPROVAL_STATUS_LABEL = {
  [EVALUATION_APPROVAL_STATUS.PENDING]: {
    br: 'Pendente',
    en: 'Pending'
  },
  [EVALUATION_APPROVAL_STATUS.APPROVED]: {
    br: 'Aprovada',
    en: 'Approved'
  },
  [EVALUATION_APPROVAL_STATUS.REJECTED]: {
    br: 'Reprovada',
    en: 'Rejected'
  }
}

export const EVALUATION_APPROVAL_PERIOD_LABEL = {
  [EVALUATION_APPROVAL_PERIOD.MID]: {
    br: 'Meio do Ano',
    en: 'Mid Year'
  },
  [EVALUATION_APPROVAL_PERIOD.END]: {
    br: 'Fim do Ano',
    en: 'End of Year'
  }
}

// Translations for UI
export const EVALUATION_APPROVAL_TRANSLATIONS = {
  pageTitle: {
    br: 'Aprovações de Avaliações',
    en: 'Evaluation Approvals'
  },
  tabs: {
    pending: {
      br: 'Pendentes',
      en: 'Pending'
    },
    approved: {
      br: 'Aprovadas',
      en: 'Approved'
    },
    rejected: {
      br: 'Reprovadas',
      en: 'Rejected'
    }
  },
  noEvaluations: {
    br: 'Nenhuma avaliação encontrada',
    en: 'No evaluations found'
  },
  year: {
    br: 'Ano:',
    en: 'Year:'
  },
  manager: {
    br: 'Gestor:',
    en: 'Manager:'
  },
  analyze: {
    br: 'Analisar',
    en: 'Review'
  },
  comment: {
    br: 'Comentário',
    en: 'Comment'
  },
  commentPlaceholder: {
    br: 'Digite um comentário justificando sua decisão (mínimo 10 caracteres)',
    en: 'Enter a comment justifying your decision (minimum 10 characters)'
  },
  commentError: {
    br: 'O comentário deve ter pelo menos 10 caracteres',
    en: 'Comment must be at least 10 characters long'
  },
  cancel: {
    br: 'Cancelar',
    en: 'Cancel'
  },
  approve: {
    br: 'Aprovar',
    en: 'Approve'
  },
  reject: {
    br: 'Reprovar',
    en: 'Reject'
  },
  success: {
    br: 'Sucesso',
    en: 'Success'
  },
  error: {
    br: 'Erro',
    en: 'Error'
  },
  approveSuccess: {
    br: 'Avaliação aprovada com sucesso!',
    en: 'Evaluation approved successfully!'
  },
  rejectSuccess: {
    br: 'Avaliação reprovada com sucesso!',
    en: 'Evaluation rejected successfully!'
  },
  approveError: {
    br: 'Erro ao aprovar avaliação. Tente novamente.',
    en: 'Error approving evaluation. Please try again.'
  },
  rejectError: {
    br: 'Erro ao reprovar avaliação. Tente novamente.',
    en: 'Error rejecting evaluation. Please try again.'
  },
  modalTitle: {
    br: 'Analisar Avaliação',
    en: 'Review Evaluation'
  },
  searchPlaceholder: {
    br: 'Buscar por nome do colaborador...',
    en: 'Search by employee name...'
  },
  filterByYear: {
    br: 'Filtrar por ano',
    en: 'Filter by year'
  },
  filterByPeriod: {
    br: 'Filtrar por período',
    en: 'Filter by period'
  },
  employeesFound: {
    br: 'colaborador',
    en: 'employee'
  },
  employeesFoundPlural: {
    br: 'colaboradores',
    en: 'employees'
  },
  found: {
    br: 'encontrado',
    en: 'found'
  },
  foundPlural: {
    br: 'encontrados',
    en: 'found'
  },
  noResultsFound: {
    br: 'Nenhum resultado encontrado',
    en: 'No results found'
  },
  evaluations: {
    br: 'avaliações',
    en: 'evaluations'
  },
  evaluationInfo: {
    br: 'Informações da Avaliação',
    en: 'Evaluation Information'
  },
  concept: {
    br: 'Conceito',
    en: 'Concept'
  },
  grade: {
    br: 'Nota',
    en: 'Grade'
  },
  finalGradeCalibrated: {
    br: 'Nota final (calibrada)',
    en: 'Final grade (calibrated)'
  },
  calibration: {
    br: 'Calibração',
    en: 'Calibration'
  },
  originalGrade: {
    br: 'Nota Original',
    en: 'Original Grade'
  },
  adjustment: {
    br: 'Ajuste',
    en: 'Adjustment'
  },
  finalGrade: {
    br: 'Nota Final',
    en: 'Final Grade'
  },
  calibrationComment: {
    br: 'Comentário da Calibração',
    en: 'Calibration Comment'
  }
}

