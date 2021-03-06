import { createStyles } from '@mantine/core'

type StylesProps = {
  width: number
  height: number
  cursor?: 'pointer'
}

export const useStyles = createStyles((theme, { width, height, cursor }: StylesProps) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xl,
    backgroundColor: theme.colors.blue[0],
    width,
    height
  },

  image: {
    transition: 'opacity 0.3s ease-out',
    '&:hover': {
      cursor,
      opacity: '0.7',

      img: {
        transform: 'scale(0.95)'
      }
    },

    img: {
      transition: 'transform 0.3s ease-out',
      borderRadius: theme.radius.md
    }
  },

  containerImageViewer: {
    span: {
      opacity: '1 !important',
      backgroundColor: 'transparent'
    },

    img: {
      borderRadius: theme.radius.xl
    },

    '#ReactSimpleImageViewer': {
      [`@media(max-width: ${theme.breakpoints.md}px)`]: {
        width: '100vw',
        height: '100vh'
      }
    }
  }
}))
