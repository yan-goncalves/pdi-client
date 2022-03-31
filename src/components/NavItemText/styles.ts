import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  root: {
    height: 40,
    marginTop: 15,
    display: 'flex',
    alignItems: 'center'
  },

  title: {
    color: theme.black,
    fontWeight: 'bold'
  }
}))
