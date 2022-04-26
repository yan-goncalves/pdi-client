import { createStyles } from '@mantine/core'

type StylesProps = {
  isPublic: boolean
}

export const useStyles = createStyles(
  (theme, { isPublic = false }: StylesProps) => ({
    body: {
      height: 'calc(100% - 6rem)',
      [`@media (min-width: ${theme.breakpoints.xl}px)`]: {
        height: 'calc(100% - 3.5rem)'
      }
    },

    main: {
      display: 'flex',
      backgroundColor: isPublic ? 'transparent' : '#f3f4f9'
    }
  })
)
