import {
  CheckboxIcon,
  Loader,
  StepProps as MantineStepProps,
  Text,
  Transition,
  UnstyledButton
} from '@mantine/core'
import React from 'react'
import useStyles from './styles'

export type StepProps = {
  children: React.ReactNode
}

const defaultIconSizes = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 24
}

const Step = ({
  className,
  state,
  color,
  icon,
  completedIcon,
  progressIcon,
  label,
  description,
  withIcon = true,
  iconSize,
  size = 'md',
  radius = 'xl',
  loading,
  allowStepClick = true,
  allowStepSelect,
  iconPosition = 'left',
  __staticSelector = 'Step',
  classNames,
  styles,
  ...others
}: MantineStepProps & StepProps) => {
  const { classes, cx, theme } = useStyles(
    { color, iconSize, size, radius, allowStepClick, iconPosition },
    { name: __staticSelector, classNames, styles }
  )

  const _iconSize = theme.fn.size({ size, sizes: defaultIconSizes })
  const _icon =
    state === 'stepCompleted'
      ? null
      : state === 'stepProgress'
      ? progressIcon
      : icon

  return (
    <UnstyledButton
      className={cx(classes.step, classes[state], className)}
      tabIndex={allowStepClick ? 0 : -1}
      {...others}
    >
      {withIcon && (
        <div className={classes.stepIcon}>
          <Transition
            mounted={state === 'stepCompleted'}
            transition="pop"
            duration={200}
          >
            {(transitionStyles) => (
              <div
                className={classes.stepCompletedIcon}
                style={transitionStyles}
              >
                {loading ? (
                  <Loader
                    color="#fff"
                    size={_iconSize}
                    className={classes.stepLoader}
                  />
                ) : (
                  completedIcon || (
                    <CheckboxIcon
                      indeterminate={false}
                      width={_iconSize}
                      height={_iconSize}
                    />
                  )
                )}
              </div>
            )}
          </Transition>

          {state !== 'stepCompleted' ? (
            loading ? (
              <Loader size={_iconSize} />
            ) : (
              _icon || icon
            )
          ) : null}
        </div>
      )}

      {(label || description) && (
        <div className={classes.stepBody}>
          {label && <Text className={classes.stepLabel}>{label}</Text>}
          {description && (
            <Text className={classes.stepDescription} color="dimmed">
              {description}
            </Text>
          )}
        </div>
      )}
    </UnstyledButton>
  )
}

export default Step
