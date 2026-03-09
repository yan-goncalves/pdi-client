import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  tabControl: {
    backgroundColor: 'transparent',
    border: `1px solid transparent`,
    borderRadius: theme.radius.md,
    color: theme.colors.gray[6],
    fontWeight: 500,
    padding: theme.spacing.md,
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: theme.colors.gray[0],
      color: theme.colors.blue[6]
    }
  },

  tabActive: {
    backgroundColor: theme.colors.blue[0],
    borderColor: theme.colors.blue[3],
    color: theme.colors.blue[7],
    fontWeight: 600
  }
}))

