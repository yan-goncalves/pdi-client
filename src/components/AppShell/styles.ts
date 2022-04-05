import { createStyles } from '@mantine/core'

type StylesProps = {
  isPublic: boolean
}

export const useStyles = createStyles(
  (theme, { isPublic = false }: StylesProps) => ({
    root: {
      [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
        height: 'calc(100% - 40px)'
      }
    },

    body: {
      height: 'calc(100% - 60px)',
      [`@media (max-width: ${theme.breakpoints.md}px)`]: {
        minHeight: '100%'
      }
    },

    main: {
      display: 'flex',
      backgroundColor: isPublic ? 'transparent' : '#f3f4f9'
    }
  })
)
