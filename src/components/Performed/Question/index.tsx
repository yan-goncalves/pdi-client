import {
  Group,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { SkillType } from 'types/collection/Skill'

export type PerformedQuestionProps = {
  item: SkillType
}

const PerformedQuestion = ({ item }: PerformedQuestionProps) => {
  const theme = useMantineTheme()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  return (
    <Group p={10} direction={!match ? 'row' : 'column'}>
      <RadioGroup size={'sm'} orientation={'vertical'} label={'Answer:'}>
        <Radio value={'yes'} label={<Text size={'md'}>Yes</Text>} />
        <Radio value={'no'} label={<Text size={'md'}>No</Text>} />
      </RadioGroup>
      <Textarea minRows={5} maxRows={5} />
    </Group>
  )
}

export default PerformedQuestion
