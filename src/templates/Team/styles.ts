import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme, _params, getRef) => ({
  item: {
    borderRadius: theme.radius.md
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
    }
  },

  content: {
    padding: 20
  }
}))
