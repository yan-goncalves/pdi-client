import { createStyles } from '@mantine/core'

type StylesProps = {
  isPublic: boolean
}

export const useStyles = createStyles((theme, { isPublic = false }: StylesProps) => ({
  main: {
    display: 'flex',
    backgroundColor: isPublic ? 'transparent' : '#f3f4f9',
    paddingLeft: 'calc(var(--mantine-navbar-width, 0px))',
    paddingRight: 0
  },

  root: {
    // [`@media(max-width: ${theme.breakpoints.xs}px)`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: isPublic ? 'transparent' : '#f3f4f9'
    // }
  }
}))
