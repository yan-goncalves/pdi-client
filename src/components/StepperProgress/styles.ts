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
        '& .mantine-StepperProgress-stepLabel': {
          fontSize: 13
        },

        '& .mantine-StepperProgress-stepDescription': {
          fontSize: 12
        },

        '& .mantine-StepperProgress-stepIcon': {
          fontSize: 13
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          alignItems: 'flex-start',

          '& .mantine-StepperProgress-stepBody': {
            margin: 0
          },

          '& .mantine-StepperProgress-stepLabel': {
            fontSize: 11
          },

          '& .mantine-StepperProgress-stepDescription': {
            fontSize: 10.5
          },

          '& .mantine-StepperProgress-stepIcon': {
            fontSize: 11
          },

          button: {
            '&:not(:last-child)': {
              display: 'flex',
              gap: 5,
              minWidth: 'auto',
              width: 50,
              flexDirection: 'column',
              alignContent: 'center',

              '& div.mantine-Text-root': {
                textAlign: 'center'
              }
            },

            '&:last-child': {
              marginLeft: 10
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
        marginLeft: theme.spacing.sm,
        marginRight: theme.spacing.sm,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          marginTop: 12,
          marginLeft: 5,
          marginRight: 5
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
          marginTop: 12,
          marginLeft: 0,
          marginRight: 0
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
