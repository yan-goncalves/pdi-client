import { createStyles } from '@mantine/core'

type useStylesProps = {
  active: boolean
}

export const useStyles = createStyles(
  (theme, { active = false }: useStylesProps) => ({
    root: {
      minHeight: 34,
      margin: '7.5px auto',
      borderRadius: theme.radius.md,
      fontWeight: active ? 500 : 'normal',
      backgroundColor: active ? theme.colors.blue[1] : undefined,
      cursor: 'pointer',
      transition: 'background-color 0.3s ease-out',

      '&:hover': {
        backgroundColor: active ? theme.colors.blue[1] : theme.colors.gray[1]
      }
    },

    link: {
      color: active ? theme.colors.cyan[9] : theme.black,
      display: 'flex',
      textDecoration: 'none !important',
      width: '100%',
      height: '100%',
      padding: 7.5,

      span: {
        display: 'flex'
      },

      div: {
        marginLeft: 15
      }
    }
  })
)
