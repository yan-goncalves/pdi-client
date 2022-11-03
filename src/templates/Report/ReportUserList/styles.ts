import { createStyles } from '@mantine/core'

type StylesProps = {
  top: number
  scroll: boolean
}

export const useStyles = createStyles((theme, { top, scroll = false }: StylesProps) => ({
  mainHeader: {
    top,
    padding: '10px 2.5px 20px 2.5px',
    zIndex: 10,
    position: 'sticky',
    ...(scroll && {
      background: theme.white,
      boxShadow: `0 10px 20px ${theme.colors.gray[3]}`,
      borderRadius: `0px 0px ${theme.radius.md}px ${theme.radius.md}px`,
      marginLeft: -20,
      marginRight: -20,
      paddingLeft: 20,
      paddingRight: 20
    }),
    transition: 'margin 0.3s ease'
  },

  tableContainer: {
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.lg
  }
}))
