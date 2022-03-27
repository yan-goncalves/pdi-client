import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  image: {
    img: {
      [`@media(max-width: ${theme.breakpoints.sm}px)`]: {
        display: 'none'
      }
    }
  }
}))
