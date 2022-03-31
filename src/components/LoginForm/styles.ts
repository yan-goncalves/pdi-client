import { createStyles } from '@mantine/core'

type StylesProps = {
  loading: boolean
}

export const useStyles = createStyles(
  (_, { loading = false }: StylesProps) => ({
    buttonContainer: {
      width: '100%',
      cursor: loading ? 'not-allowed' : 'auto'
    }
  })
)
