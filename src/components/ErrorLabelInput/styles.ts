import { createStyles } from '@mantine/core'

type useStylesProps = {
  inError: boolean
}

export const useStyles = createStyles(
  (_, { inError = false }: useStylesProps) => ({
    root: {
      visibility: inError ? 'visible' : 'hidden'
    }
  })
)
