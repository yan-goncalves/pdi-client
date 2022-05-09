import { Grid, Group, Radio, RadioGroup, Text, Textarea, Title } from '@mantine/core'
import { CommonConstants } from 'constants/common'
import { useLocale } from 'contexts/LocaleProvider'
import { useEffect, useState } from 'react'
import { SkillType } from 'types/collection/Skill'

export type PerformedQuestionProps = {
  item: SkillType
}

const PerformedQuestion = ({ item }: PerformedQuestionProps) => {
  const { locale } = useLocale()
  const [answer, setAnswer] = useState<string>()
  const [why, setWhy] = useState<string>()

  return (
    <Grid p={10}>
      <Grid.Col span={12} xs={3}>
        <Group direction={'column'}>
          <Title order={6}>{CommonConstants.answer[locale]}</Title>
          <RadioGroup value={answer} onChange={setAnswer} spacing={'xl'} orientation={'horizontal'}>
            <Radio
              value={'yes'}
              label={<Text weight={500}>{locale === 'en' ? 'Yes' : 'Sim'}</Text>}
            />
            <Radio
              value={'no'}
              label={<Text weight={500}>{locale === 'en' ? 'No' : 'Não'}</Text>}
            />
          </RadioGroup>
        </Group>
      </Grid.Col>
      <Grid.Col span={12} xs={8}>
        <Group direction={'column'}>
          <Title order={6}>{CommonConstants.why[locale]}</Title>
          <Textarea
            value={why}
            onChange={({ currentTarget: { value } }) => setWhy(value)}
            minRows={5}
            maxRows={5}
            sx={{ width: 'min(30rem, 100%)' }}
          />
        </Group>
      </Grid.Col>
    </Grid>
  )
}

export default PerformedQuestion
