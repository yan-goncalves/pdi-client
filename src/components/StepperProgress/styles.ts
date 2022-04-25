import { StepperStylesParams } from '@mantine/core'
import { createStyles } from '@mantine/styles'

export default createStyles(
  (theme, { contentPadding }: StepperStylesParams) => {
    return {
      root: {
        width: '100%',

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          '& .mantine-StepperProgress-stepCompletedIcon': {
            svg: {
              width: 12,
              height: 12
            }
          }
        }
      },

      steps: {
        display: 'flex',
        boxSizing: 'border-box',
        alignItems: 'center',

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          '& .mantine-StepperProgress-stepBody': {
            margin: 0
          },

          '& .mantine-StepperProgress-stepLabel': {
            fontSize: 11
          },

          '& .mantine-StepperProgress-stepIcon': {
            fontSize: 11
          },

          button: {
            '&:not(:last-child)': {
              display: 'flex',
              gap: 5,
              minWidth: 80,
              flexDirection: 'column',
              alignContent: 'center'
            }
          }
        }
      },

      stepProgress: {
        transform: 'scale(1.05)'
      },

      step: {
        transition: 'transform 0.15s ease',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      },

      separator: {
        boxSizing: 'border-box',
        flex: 1,
        height: 2,
        marginLeft: theme.spacing.md,
        marginRight: theme.spacing.md,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          marginLeft: 5,
          marginRight: 5
        }
      },

      content: {
        ...theme.fn.fontStyles(),
        paddingTop: theme.fn.size({
          size: contentPadding,
          sizes: theme.spacing
        })
      }
    }
  }
)
