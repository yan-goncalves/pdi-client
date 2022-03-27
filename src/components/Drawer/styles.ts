import { createStyles } from '@mantine/core'

export const useStyles = createStyles(() => ({
  drawer: {
    '.mantine-Drawer-header': {
      display: 'grid',
      alignItems: 'flex-start',
      gridTemplateColumns: '5fr 1fr',
      padding: '0 !important',

      '.mantine-Drawer-title': {
        marginRight: '0 !important'
      },

      button: {
        margin: '0 !important'
      }
    }
  }
}))
