import { useMantineTheme } from '@mantine/core'
import { EvaluationCardItemProps } from 'components/EvaluationCardItem'
import Stepper from 'components/StepperProgress'
import { useState } from 'react'
import { useStyles } from './styles'

export type EvaluationListTemplateProps = {
  items: EvaluationCardItemProps[]
}

const EvaluationListTemplate = ({ items }: EvaluationListTemplateProps) => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const [step, setStep] = useState(0)

  return (
    <>
      <Stepper active={0}>
        {[0, 1, 2, 3, 4].map((item) => (
          <Stepper.Step key={item}>
            {[0, 1, 2].map((item) => (
              <div key={item}>item {item}</div>
            ))}
          </Stepper.Step>
        ))}
      </Stepper>
    </>
    // <ContentBase>
    //   <SimpleGrid
    //     pt={20}
    //     spacing={30}
    //     breakpoints={[
    //       {
    //         cols: 1,
    //         maxWidth: 'xs'
    //       },
    //       {
    //         cols: 2,
    //         minWidth: 'sm',
    //         maxWidth: 'lg'
    //       },
    //       {
    //         cols: 3,
    //         minWidth: 'lg'
    //       },
    //       {
    //         cols: 4,
    //         minWidth: 'xl'
    //       }
    //     ]}
    //   >
    //     {items.map((props) => (
    //       <EvaluationCardItem key={props.year} {...props} />
    //     ))}
    //   </SimpleGrid>
    // </ContentBase>
  )
}

export default EvaluationListTemplate
