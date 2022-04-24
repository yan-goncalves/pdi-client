import { createStyles } from '@mantine/core'

type StylesProps = {
  scroll: boolean
}

export const useStyles = createStyles(
  (theme, { scroll = false }: StylesProps) => ({
    root: {
      zIndex: 10,
      position: 'sticky',
      top: 0,
      borderRadius: theme.radius.md,
      boxShadow: scroll ? '1px 30px 20px white' : 'none',
      transition: 'background-color 0.15s ease-in',
      backgroundColor: scroll ? 'rgba(255, 255, 255, 1)' : 'transparent',
      backdropFilter: scroll ? 'blur(6px)' : undefined
    }
  })
)
