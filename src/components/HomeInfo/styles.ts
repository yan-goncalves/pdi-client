import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 54,
    fontWeight: 700,
    lineHeight: 1.1,

    [`@media(max-width: ${theme.breakpoints.xl}px)`]: {
      fontSize: 52
    },

    [`@media(max-width: ${theme.breakpoints.md}px)`]: {
      fontSize: 42
    }
  },

  description: {
    color: theme.colors.dark[3],
    fontWeight: 500
  },

  footerDescription: {
    fontWeight: 700,
    marginTop: 10
  },

  button: {
    [`@media(max-width: ${theme.breakpoints.sm}px)`]: {
      width: '100%'
    }
  }
}))
