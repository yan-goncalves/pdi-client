import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  root: {
    width: 210,
    height: '100%',
    paddingRight: 10,

    [`@media(max-width: ${theme.breakpoints.md}px)`]: {
      paddingBottom: 70
    },

    '.mantine-ScrollArea-scrollbar': {
      [`@media(max-width: ${theme.breakpoints.md}px)`]: {
        height: 'calc(100vh - 100px)'
      }
    }
  }
}))
