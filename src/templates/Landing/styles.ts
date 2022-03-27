import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  container: {
    alignSelf: 'center',

    [`@media (min-width: ${theme.breakpoints.lg}px) and (max-width: ${theme.breakpoints.xl}px)`]:
      {
        padding: '0 150px'
      },

    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      marginBottom: '5rem'
    }
  }
}))
