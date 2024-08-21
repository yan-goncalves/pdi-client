import { createStyles } from '@mantine/core'
import { alpha } from '@mui/material'

type StylesProps = {
  isSelected?: boolean
}

export const useStyles = createStyles((theme, { isSelected = false }: StylesProps, getRef) => ({
  box: {
    width: '100%',
    border: `1px solid ${!isSelected ? theme.colors.gray[3] : theme.colors.blue[6]}`,
    borderRadius: theme.radius.md,
    transition: 'border-color 0.25s, background 0.25s, outline 0.25s',
    outline: !isSelected ? 'none' : `1px solid ${theme.colors.blue[6]}`
  },

  group: {
    ref: getRef('group'),
    padding: 0,
    margin: 0,
    justifyContent: 'space-around',
    transition: 'background 0.5s',
    borderRadius: theme.radius.md,
    gap: 0,
    background: !isSelected ? 'inherit' : alpha(theme.colors.blue[6], 0.05),

    '&:hover': {
      background: !isSelected ? '#f8f9fa' : alpha(theme.colors.blue[6], 0.08)
    }
  },

  groupOpened: {
    boxShadow: '0 10px 10px #f1f3f5',

    '&:hover': {
      backgroundColor: 'transparent'
    }
  },

  label: {
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
    padding: '15px 10px',
    cursor: 'pointer',
    width: '85%',

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      width: '75%',
      fontSize: theme.fontSizes.xs
    },

    [`@media (min-width: ${theme.breakpoints.xs}px) and (max-width: ${theme.breakpoints.md}px)`]: {
      width: '80%',
      fontSize: theme.fontSizes.sm
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
    paddingRight: 10,
    justifyContent: 'end',

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      paddingRight: 5
    },

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      paddingRight: 7.5
    }
  },

  checkbox: {
    cursor: 'pointer'
  }
}))
