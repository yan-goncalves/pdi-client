import {
  Box,
  Button,
  filterChildrenByType,
  Group,
  Progress
} from '@mantine/core'
import React, { Children, useEffect, useState } from 'react'
import Step from './Step'
import createStyles from './styles'

export type StepperProps = {
  children: React.ReactNode
}

type StepperComponent = ((props: StepperProps) => React.ReactElement) & {
  Step: typeof Step
}

const Stepper: StepperComponent = ({ children }: StepperProps) => {
  const { classes } = createStyles()
  const [active, setActive] = useState(0)
  const [current, setCurrent] = useState(0)
  const steps = filterChildrenByType(children, Step)
  const activeStep = Children.toArray(steps[active].props?.children).length
  const nextDisabled = active + 1 === steps.length && current + 1 === activeStep
  const backDisabled = active - 1 === -1 && current - 1 === -1

  const handleNext = () => {
    setCurrent((state) => {
      const currentStep = Children.toArray(steps[active].props?.children)
      if (state + 1 === currentStep.length) {
        setActive((step) => (active + 1 === steps.length ? step : step + 1))
        return 0
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

  useEffect(() => {
    console.log('ACTIVE INDEX', (100 / steps.length) * current)
  }, [current])

  const items = steps.reduce<React.ReactNode[]>((acc, item, index, array) => {
    const activeStep = Children.toArray(steps[index].props.children)

    const status =
      index === active ? 'doing' : index < active ? 'empty' : 'filled'
    const value =
      status === 'empty'
        ? 0
        : status === 'filled'
        ? 100
        : 100 / activeStep.length + current

    acc.push(
      <Step {...item.props} key={`step-${index}`} label={`STEP ${index + 1}`} />
    )

    if (index !== array.length - 1) {
      acc.push(<Progress style={{ width: '100%' }} value={value} />)
    }

    return acc
  }, [])

  return (
    <Group direction={'column'} style={{ width: '100%' }}>
      <Box style={{ width: '100%' }}>
        <div className={classes.steps}>{items}</div>
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

Stepper.Step = Step

export default Stepper
