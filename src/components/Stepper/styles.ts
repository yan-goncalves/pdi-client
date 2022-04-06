import {
  createStyles,
  MantineColor,
  MantineNumberSize,
  MantineSize
} from '@mantine/styles'

export interface StepperStylesParams {
  contentPadding: MantineNumberSize
  iconSize?: number
  size: MantineSize
  color: MantineColor
  orientation: 'vertical' | 'horizontal'
  iconPosition: 'right' | 'left'
  breakpoint: MantineNumberSize
}

export default createStyles((theme) => ({
  root: {},

  steps: {
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'center'
  },

  separator: {
    boxSizing: 'border-box',
    transition: 'background-color 150ms ease',
    flex: 1,
    height: 2,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[2],
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.md
  }
}))
