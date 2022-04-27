import { createStyles } from '@mantine/core'

type StylesProps = {
  top: number
  scroll: boolean
}

export const useStyles = createStyles(
  (theme, { top, scroll = false }: StylesProps) => ({
    root: {
      zIndex: 10,
      position: 'sticky',
      top: top,
      boxShadow: scroll ? '1px 30px 20px white' : 'none',
      backgroundColor: scroll ? 'rgba(255, 255, 255, 1)' : 'transparent',
      backdropFilter: scroll ? 'blur(6px)' : undefined
    }
  })
)
