import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  root: {
    height: 'calc(100% - 10rem)'
  },

  imageContainer: {
    alignSelf: 'flex-end'
  },

  textContainer: {
    alignSelf: 'flex-start',
    textAlign: 'center',

    [`@media(max-width: ${theme.breakpoints.xs}px)`]: {
      padding: `0 50px !important`
    },

    h2: {
      fontWeight: 900,
      color: theme.colors.gray[8],

      [`@media(max-width: ${theme.breakpoints.sm}px)`]: {
        fontSize: theme.headings.sizes.h3.fontSize
      }
    }
  }
}))
