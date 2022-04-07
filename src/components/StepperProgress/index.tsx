import {
  Box,
  Button,
  filterChildrenByType,
  Group,
  Progress,
  Step as MantineStep,
  StepperProps,
  useMantineDefaultProps
} from '@mantine/core'
import React, { Children, useState } from 'react'
import Step from './Step'
import createStyles from './styles'

// export type StepperProps = {
//   children: React.ReactNode
// }

type StepperComponent = ((props: StepperProps) => React.ReactElement) & {
  Step: typeof Step
}

const defaultProps: Partial<StepperProps> = {
  contentPadding: 'md',
  size: 'md',
  radius: 'md',
  orientation: 'horizontal',
  iconPosition: 'left'
}

const StepperProgress: StepperComponent = ({
  children,
  ...props
}: StepperProps) => {
  const { classes } = createStyles()
  const [active, setActive] = useState(0)
  const [current, setCurrent] = useState(0)
  const steps = filterChildrenByType(children, Step)
  const activeStep = Children.toArray(steps[active].props?.children).length
  const nextDisabled = active + 1 === steps.length && current === activeStep
  const backDisabled = active - 1 === -1 && current - 1 === -1

  const handleNext = () => {
    setCurrent((state) => {
      const currentStep = Children.toArray(steps[active].props?.children)
      if (state + 1 === currentStep.length) {
        setActive((step) => (active + 1 === steps.length ? step : step + 1))
        return active + 1 === steps.length ? currentStep.length : 0
      }

      return state + 1
    })
  }

  const handleBack = () => {
    setCurrent((state) => {
      const currentStep = Children.toArray(steps[active].props?.children)
      if (state - 1 === -1) {
        setActive((step) => (active - 1 === -1 ? step : step - 1))
        return currentStep.length - 1
      }

      return state - 1
    })
  }

  const {
    className,
    onStepClick,
    completedIcon,
    progressIcon,
    color,
    iconSize,
    contentPadding,
    size,
    radius,
    orientation,
    breakpoint,
    iconPosition,
    classNames,
    styles,
    ...others
  } = useMantineDefaultProps('Stepper', defaultProps, props)

  const items = steps.reduce<React.ReactNode[]>((acc, item, index, array) => {
    const activeStep = Children.toArray(steps[index].props.children)

    const status =
      active > index || nextDisabled
        ? 'stepCompleted'
        : active === index
        ? 'stepProgress'
        : 'stepInactive'
    const value =
      status === 'stepInactive'
        ? 0
        : status === 'stepCompleted'
        ? 100
        : (100 / activeStep.length) * current

    acc.push(
      <MantineStep
        {...item.props}
        __staticSelector="Stepper"
        icon={item.props.icon || index + 1}
        state={status}
        completedIcon={item.props.completedIcon || completedIcon}
        progressIcon={item.props.progressIcon || progressIcon}
        color={item.props.color || color}
        iconSize={iconSize}
        size={size}
        radius={radius}
        classNames={classNames}
        styles={styles}
        iconPosition={item.props.iconPosition || iconPosition}
        key={`step-${index}`}
      />
    )

    if (index < array.length) {
      acc.push(
        <Progress
          key={`progress-${index}`}
          style={{ width: '100%', height: 2 }}
          radius={'xs'}
          value={value}
        />
      )
    }

    return acc
  }, [])

  const stepChildren = steps[active].props?.children

  return (
    <Group direction={'column'} style={{ width: '100%' }}>
      <Box style={{ width: '100%' }}>
        <div className={classes.steps}>{items}</div>
        {stepChildren[current] ? (
          <div className={classes.content}>{stepChildren[current]}</div>
        ) : (
          <div>COMPLETED</div>
        )}
      </Box>

      <Group>
        <Button onClick={handleBack} disabled={backDisabled}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={nextDisabled}>
          Next
        </Button>
      </Group>
    </Group>
  )
}

StepperProgress.Step = Step

export default StepperProgress
