import { createStyles } from '@mantine/core'

export const useStyles = createStyles(() => ({
  root: {
    height: 'calc(100% - 40px)'
  },

  body: {
    height: 'calc(100% - 50px)',
    minHeight: 'fit-content'
  },

  main: {
    display: 'flex'
  }
}))
