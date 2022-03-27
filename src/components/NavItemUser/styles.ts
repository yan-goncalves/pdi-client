import { createStyles } from '@mantine/core'

type useStylesProps = {
  direction: 'row' | 'column'
}

export const useStyles = createStyles((_, { direction }: useStylesProps) => ({
  container: {
    alignItems: direction === 'row' ? 'flex-end' : 'center',
    marginLeft: direction === 'row' ? '0.7rem !important' : undefined,
    marginTop: direction === 'row' ? '0.7rem !important' : undefined
  },

  userDescriptionContainer: {
    paddingBottom: direction === 'row' ? '7px !important' : undefined,
    paddingLeft: direction === 'row' ? '7px !important' : undefined,
    alignItems: direction === 'row' ? 'flex-start' : 'center'
  },

  divider: {
    marginLeft: '7px !important',
    marginTop: '1rem !important'
  }
}))
