import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  root: {
    cursor: 'auto'
  },

  dragging: {
    transform: 'translate(-50%, -50%)'
  },

  thumb: {
    border: 0,
    backgroundColor: 'transparent',
    width: 30,
    top: 0,
    display: 'block',
    cursor: 'auto'
  },

  track: {
    padding: 0
  },

  bar: {
    backgroundColor: theme.colors.blue[3]
  },

  markLabel: {
    paddingTop: 5,
    color: theme.black,
    fontWeight: 500
  },

  label: {
    left: -8,
    top: -20,
    padding: '0px 5px'
  }
}))
