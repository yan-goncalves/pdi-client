import { createStyles } from '@mantine/core'

type useStylesProps = {
  loading: boolean
}

export const useStyles = createStyles(
  (_, { loading = false }: useStylesProps) => ({
    buttonContainer: {
      width: '100%',
      cursor: loading ? 'not-allowed' : 'auto'
    }
  })
)
