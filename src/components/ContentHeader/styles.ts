import { createStyles } from '@mantine/core'

type StylesProps = {
  scroll: boolean
}

export const useStyles = createStyles(
  (theme, { scroll = false }: StylesProps) => ({
    root: {
      position: 'sticky',
      top: 3,
      borderRadius: theme.radius.md,
      boxShadow: scroll ? theme.shadows.lg : 'none',
      transition: 'all 0.3s ease-in',
      backgroundColor: scroll ? 'rgba(255, 255, 255, 0.75)' : 'transparent',
      backdropFilter: scroll ? 'blur(6px)' : undefined
    }
  })
)
