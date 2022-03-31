import { createStyles } from '@mantine/core'

type StylesProps = {
  inError: boolean
}

export const useStyles = createStyles(
  (_, { inError = false }: StylesProps) => ({
    root: {
      visibility: inError ? 'visible' : 'hidden'
    }
  })
)
