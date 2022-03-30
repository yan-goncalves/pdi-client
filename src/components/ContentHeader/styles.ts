import { createStyles } from '@mantine/core'

type useStylesProps = {
  scroll: boolean
}

export const useStyles = createStyles(
  (theme, { scroll = false }: useStylesProps) => ({
    root: {
      position: 'sticky',
      top: 20,
      borderRadius: theme.radius.md,
      boxShadow: scroll ? theme.shadows.xl : 'none',
      transition: 'all 0.3s ease'
    }
  })
)
