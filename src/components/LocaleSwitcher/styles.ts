import { createStyles } from '@mantine/core'

type StylesProps = {
  opened: boolean
}

export const useStyles = createStyles(
  (theme, { opened = false }: StylesProps) => ({
    menu: {
      width: '160px',
      backgroundColor: opened ? theme.colors.blue[0] : 'inherit',
      borderRadius: theme.radius.md,
      transition: 'background-color 0.3s ease-in',

      '&:hover': {
        backgroundColor: theme.colors.blue[0]
      }
    },

    button: {
      width: '100%',
      padding: '8px 16px'
    }
  })
)
