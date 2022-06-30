export const ErrorsConstants = {
  login: {
    credentials: {
      title: {
        br: 'Não foi possível realizar o login',
        en: 'Unable to login'
      },
      message: {
        br: 'Usuário(a) ou senha incorretos',
        en: 'Incorrect user or password'
      }
    }
  },

  input: {
    required: {
      br: '* Este campo é obrigatório',
      en: '* This field is required'
    }
  },

  goals: {
    exists: {
      br: '* Objetivo já definido para esta avaliação',
      en: '* Goal already defined for this evaluation'
    }
  },

  kpis: {
    exists: {
      br: '* Kpi já definido para este objetivo',
      en: '* Kpi already defined for this goal'
    }
  },

  pdiQuality: {
    exists: {
      strength: {
        br: '* Ponto forte já definido',
        en: '* Strong point already defined'
      },
      weakness: {
        br: '* Melhoria já definida',
        en: '* Improvement point already defined'
      }
    }
  }
}
