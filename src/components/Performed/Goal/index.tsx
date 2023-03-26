import { useMutation, useQuery } from '@apollo/client'
import { Badge, Grid, Group, Text, useMantineTheme } from '@mantine/core'
import LoadingOverlay from 'components/LoadingOverlay'
import { CommonConstants } from 'constants/common'
import { KpisConstants } from 'constants/kpis'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { CREATE_PERFORMED_GOAL } from 'graphql/mutations/collection/PerformedGoal'
import { GET_PERFORMED_GOAL } from 'graphql/queries/collection/PerformedGoal'
import React, { useEffect, useState } from 'react'
import { GoalType } from 'types/collection/Goal'
import {
  CreatePerformedGoalType,
  GetPerformedGoalType,
  PerformedGoalType
} from 'types/collection/PerformedGoal'
import PerformedKpi from '../Kpi'

export type PerformedGoalProps = {
  goal: GoalType
  performed?: PerformedGoalType
  actor: EVALUATION_ACTOR
}

const PerformedGoal = ({ goal, performed, actor }: PerformedGoalProps) => {
  const theme = useMantineTheme()
  const { performedEvaluation } = useEvaluation()
  const { locale } = useLocale()
  const [performedGoal, setPerformedGoal] = useState<PerformedGoalType>()

  // queries/mutations
  const { refetch: getPerformedGoal } = useQuery<GetPerformedGoalType>(GET_PERFORMED_GOAL, {
    skip: true,
    onCompleted: ({ performed }) => setPerformedGoal(performed)
  })

  const [create] = useMutation<CreatePerformedGoalType>(CREATE_PERFORMED_GOAL, {
    onCompleted: ({ created }) => setPerformedGoal(created)
  })

  useEffect(() => {
    if (performed) {
      setPerformedGoal(performed)
    } else {
      handleCreate()
    }
  }, [performed])

  const handleCreate = async () => {
    try {
      await create({
        variables: {
          idPerformed: performedEvaluation.id,
          idGoal: goal.id
        }
      })
    } catch {
      await getPerformedGoal({
        idPerformed: performedEvaluation.id,
        idGoal: goal.id
      })
    }
  }

  if (!performedGoal) {
    return <LoadingOverlay />
  }

  return (
    <Grid p={10}>
      {!goal.kpis.length ? (
        <Text mt={30} size={'lg'} sx={{ color: theme.colors.gray[4] }}>
          {KpisConstants.empty[locale]}
        </Text>
      ) : (
        goal.kpis.map((kpi, index) => (
          <React.Fragment key={`${kpi.id}-${kpi.name}`}>
            <Grid.Col span={12}>
              <Badge size={'md'} mb={10}>
                KPI
              </Badge>
              <Text size={'md'} weight={500} mb={5}>
                {index + 1} - {kpi.name}
              </Text>

              <Group spacing={5}>
                <Text size={'sm'} color={'gray'} style={{ minWidth: 50 }}>
                  {CommonConstants.target[locale]}:
                </Text>
                <Text size={'sm'} color={'gray'} weight={500}>
                  {kpi.target}
                </Text>
              </Group>

              <Group spacing={5} mb={20}>
                <Text size={'sm'} color={'gray'} style={{ minWidth: 50 }}>
                  {CommonConstants.weight[locale]}:
                </Text>
                <Text size={'sm'} color={'gray'} weight={500}>
                  {kpi.weight}%
                </Text>
              </Group>
            </Grid.Col>
            <PerformedKpi
              kpi={kpi}
              actor={actor}
              performedGoal={performedGoal}
              hasDivider={index < goal.kpis.length - 1}
            />
          </React.Fragment>
        ))
      )}
    </Grid>
  )
}

export default PerformedGoal
