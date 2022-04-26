import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  container: {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 15,

    [`@media(min-width: ${theme.breakpoints.xl}px)`]: {
      paddingBottom: 125
    }
  },

  paper: {
    maxWidth: 375
  },

  logo: {
    position: 'relative',
    top: '85%',
    transform: 'translateY(-85%)',
    marginBottom: '-50px !important'
  }
}))
