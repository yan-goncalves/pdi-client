import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme, _, getRef) => ({
  box: {
    width: '100%',
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    marginTop: 5
  },

  group: {
    ref: getRef('group'),
    padding: 0,
    margin: 0,
    justifyContent: 'space-between',
    transition: 'background-color 0.1s',

    '&:hover': {
      backgroundColor: '#f8f9fa'
    }
  },

  groupOpened: {
    boxShadow: '0 10px 10px #f1f3f5',

    '&:hover': {
      backgroundColor: 'transparent'
    }
  },

  label: {
    fontSize: theme.fontSizes.xs,
    fontWeight: 600,
    padding: '15px 10px',
    cursor: 'pointer',
    width: '85%',

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      width: '75%'
    },

    [`@media (min-width: ${theme.breakpoints.xs}px) and (max-width: ${theme.breakpoints.md}px)`]: {
      width: '80%'
    }
  },

  divider: {
    marginTop: 0,
    transition: 'visibility 0.175s'
  },

  dividerOpened: {
    visibility: 'visible'
  },

  dividerHidden: {
    visibility: 'hidden'
  },

  actionsGroup: {
    paddingRight: 15,
    justifyContent: 'end',

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      paddingRight: 5
    },

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      paddingRight: 7.5
    }
  }
}))
