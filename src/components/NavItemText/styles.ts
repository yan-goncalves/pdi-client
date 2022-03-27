import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  root: {
    height: 40,
    marginTop: 15,
    display: 'flex',
    alignItems: 'center'
  },

  title: {
    fontSize: '0.875rem',
    padding: 7.5,
    color: theme.colors.gray[6],
    fontWeight: 'bold'
  }
}))
