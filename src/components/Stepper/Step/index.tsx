import {
  Step as MantineStep,
  StepProps as MantineStepProps
} from '@mantine/core'
import React from 'react'

export type StepProps = {
  children: React.ReactNode
}

const Step = (props: MantineStepProps & StepProps) => {
  return <MantineStep {...props} />
}

export default Step
