import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  root: {
    width: 210,
    height: '100%',
    paddingRight: 10,

    [`@media(max-width: ${theme.breakpoints.md}px)`]: {
      paddingBottom: 100
    },

    '.mantine-ScrollArea-scrollbar': {
      height: 'calc(100vh - 68px)',

      [`@media(max-width: ${theme.breakpoints.md}px)`]: {
        height: 'calc(100vh - 120px)'
      }
    }
  }
}))
