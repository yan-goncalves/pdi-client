import { Group, Textarea, useMantineTheme } from '@mantine/core'
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
      <Textarea minRows={5} maxRows={5} sx={{ width: 'min(30rem, 100%)' }} />
    </Group>
  )
}

export default PerformedQuestion
