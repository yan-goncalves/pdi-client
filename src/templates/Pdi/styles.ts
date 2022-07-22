import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  tabControl: {
    backgroundColor: theme.white,
    color: theme.colors.gray[9],
    fontSize: theme.fontSizes.md,
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
    borderLeft: `1px solid ${theme.colors.gray[4]}`,
    borderRight: `1px solid ${theme.colors.gray[4]}`,

    '&:not(:first-of-type)': {
      borderLeft: 0
    },

    '&:first-of-type': {
      borderTopLeftRadius: theme.radius.lg,
      borderLeft: 'none'
    },

    '&:last-of-type': {
      borderTopRightRadius: theme.radius.lg,
      borderRight: 'none'
    }
  },

  tabActive: {
    borderColor: 'transparent',
    fontWeight: 500,
    backgroundColor: theme.colors.gray[3],
    color: theme.black
  }
}))
