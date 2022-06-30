import { useMutation, useQuery } from '@apollo/client'
import { Badge, Grid, Text } from '@mantine/core'
import LoadingOverlay from 'components/LoadingOverlay'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
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
  const { performedEvaluation } = useEvaluation()
  const [performedGoal, setPerformedGoal] = useState<PerformedGoalType>()

  // queries/mutations
  const { refetch: getPerformedGoal } = useQuery<GetPerformedGoalType>(GET_PERFORMED_GOAL, {
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
      {goal.kpis.map((kpi, index) => (
        <React.Fragment key={`${kpi.id}-${kpi.name}`}>
          <Grid.Col span={12}>
            <Badge size={'md'} mb={10}>
              KPI - {index + 1}
            </Badge>
            <Text size={'md'} weight={500} mb={20}>
              {index + 1} - {kpi.name}
            </Text>
          </Grid.Col>
          <PerformedKpi
            kpi={kpi}
            actor={actor}
            performedGoal={performedGoal}
            hasDivider={index < goal.kpis.length - 1}
          />
        </React.Fragment>
      ))}
    </Grid>
  )
}

export default PerformedGoal
