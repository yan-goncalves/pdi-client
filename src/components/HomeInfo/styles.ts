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
    },

    [`@media(max-width: ${theme.breakpoints.sm}px)`]: {
      textAlign: 'center'
    }
  },

  description: {
    color: theme.colors.dark[3],
    fontWeight: 500
  },

  descriptionGroup: {
    [`@media(max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: 400,
      textAlign: 'center'
    }
  },

  footerDescription: {
    fontWeight: 700,
    marginTop: 10
  },

  button: {
    [`@media(max-width: ${theme.breakpoints.sm}px)`]: {
      width: '100%'
    }
  },

  buttonGroup: {
    [`@media(max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: 400,
      textAlign: 'center'
    }
  },

  hero: {
    justifyContent: 'center',
    maxWidth: '100%',
    img: {
      maxWidth: 400
    }
  }
}))
