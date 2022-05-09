import { createStyles } from '@mantine/core'

type StylesProps = {
  top: number
  scroll: boolean
}

export const useStyles = createStyles((theme, { top, scroll = false }: StylesProps) => ({
  root: {
    zIndex: 10,
    position: 'sticky',
    top: top,
    boxShadow: !scroll ? undefined : `10px 10px 10px ${theme.colors.gray[0]}`,
    borderBottom: !scroll ? undefined : `1px solid ${theme.colors.gray[2]}`,
    backgroundColor: !scroll ? 'transparent' : theme.white,
    backdropFilter: !scroll ? undefined : 'blur(6px)'
  }
}))
