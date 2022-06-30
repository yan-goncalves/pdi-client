import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme, _params, getRef) => ({
  control: {
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    ref: getRef('control')
  },

  icon: { ref: getRef('icon') },

  item: {
    borderBottom: 'none'
  },

  itemTitle: {
    ref: getRef('itemTitle')
  },

  itemOpened: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[3],

    [`& .${getRef('itemTitle')}`]: {
      borderBottom: `1px solid ${theme.colors.gray[1]}`,
      boxShadow: `10px 10px 10px ${theme.colors.gray[1]}`,

      ['& :hover']: {
        backgroundColor: 'transparent'
      }
    },

    [`& .${getRef('control')}`]: {
      borderTopLeftRadius: theme.radius.md,
      borderTopRightRadius: theme.radius.md,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    },

    [`& .${getRef('icon')}`]: {
      transform: 'rotate(90deg) !important'
    }
  },

  content: {
    marginTop: -10,
    padding: 20,
    border: `1px solid ${theme.colors.gray[3]}`,
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    borderTopColor: 'transparent'
  }
}))
