import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  container: {
    height: '100%',
    alignSelf: 'flex-start',
    padding: 0,

    [`@media (min-width: ${theme.breakpoints.lg}px) and (max-width: ${theme.breakpoints.xl}px)`]:
      {
        padding: '0 150px'
      }
  },

  hero: {
    maxWidth: 400,
    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: 600
    }
  }
}))
