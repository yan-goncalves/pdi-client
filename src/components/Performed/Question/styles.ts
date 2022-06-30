import { createStyles } from '@mantine/core'
import { EVALUATION_ACTOR, EVALUATION_MODE } from 'contexts/EvaluationProvider'

type StylesProps = {
  actor: EVALUATION_ACTOR
  mode: EVALUATION_MODE
}

export const useStyles = createStyles((_, { actor, mode }: StylesProps) => ({
  radio: {
    'input, label': {
      cursor:
        actor === EVALUATION_ACTOR.MANAGER || mode === EVALUATION_MODE.VIEW
          ? 'not-allowed'
          : 'pointer'
    },

    cursor:
      actor === EVALUATION_ACTOR.MANAGER || mode === EVALUATION_MODE.VIEW
        ? 'not-allowed'
        : 'pointer'
  }
}))
