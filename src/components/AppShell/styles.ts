import { createStyles } from '@mantine/core'

type StylesProps = {
  isPublic: boolean
}

export const useStyles = createStyles(
  (_, { isPublic = false }: StylesProps) => ({
    root: {
      height: 'calc(100% - 100px)'
      // minHeight: 'fit-content'
    },

    body: {
      // height: 'calc(100% - 60px)',
      minHeight: '100%'
      // minHeight: 'fit-content'
    },

    main: {
      display: 'flex',
      backgroundColor: isPublic ? 'transparent' : '#f3f4f9'
    }
  })
)
