import { createStyles } from '@mantine/core'

type StylesProps = {
  direction: 'row' | 'column'
}

export const useStyles = createStyles((_, { direction }: StylesProps) => ({
  container: {
    alignItems: direction === 'row' ? 'flex-end' : 'center',
    marginLeft: direction === 'row' ? '0.7rem !important' : undefined,
    marginTop: direction === 'row' ? '0.7rem !important' : undefined
  },

  userDescriptionContainer: {
    paddingBottom: direction === 'row' ? '7px !important' : undefined,
    paddingLeft: direction === 'row' ? '7px !important' : undefined,
    alignItems: direction === 'row' ? 'flex-start' : 'center'
  }
}))
