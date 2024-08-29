import { useMutation, useQuery } from '@apollo/client'
import { Avatar, Button, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import ContentBase from 'components/ContentBase'
import GoalFormItem from 'components/GoalFormItem'
import GoalImportForm from 'components/GoalImportForm'
import { EvaluationKpiInput } from 'components/KpiForm'
import LoadingOverlay from 'components/LoadingOverlay'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { CommonConstants } from 'constants/common'
import { EvaluationConstants } from 'constants/evaluation'
import { GoalsConstants } from 'constants/goals'
import { ROLES } from 'constants/role'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { CREATE_GOAL, DELETE_GOAL, UPDATE_GOAL } from 'graphql/mutations/collection/Goal'
import { CREATE_KPI, UPDATE_KPI } from 'graphql/mutations/collection/Kpi'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CreateGoalType,
  DeleteGoalType,
  GetEvaluationGoalsType,
  GoalType,
  UpdateGoalType
} from 'types/collection/Goal'
import { CreateKpiType, UpdateKpiType } from 'types/collection/Kpi'
import GoalForm from '../../components/GoalForm'

export type GoalTemplateProps = {
  actor: EVALUATION_ACTOR
  goals: GoalType[]
}

const GoalTemplate = ({ actor, goals }: GoalTemplateProps) => {
  const theme = useMantineTheme()
  const { data: session } = useSession()
  const { locale } = useLocale()
  const { evaluationModel, appraisee, isSaving } = useEvaluation()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)
  const [opened, setOpened] = useState<number>(-1)
  const [openGoalModal, setOpenGoalModal] = useState<boolean>(false)
  const [openImportGoalModal, setOpenImportGoalModal] = useState<boolean>(false)
  // const [totalWeight, setTotalWeight] = useState<number>(0)
  const [evaluationGoals, setEvaluationGoals] = useState<GoalType[]>([])
  const [removing, setRemoving] = useState<number>(-1)
  const [editEvaluationGoal, setEditEvaluationGoal] = useState<GoalType>()
  const [isManageable, setIsManageable] = useState<boolean>(false)

  const totalWeight = useMemo(() => {
    return evaluationGoals.reduce((accGoal, currGoal) => {
      const total = currGoal.kpis.reduce((accKpi, currKpi) => accKpi + currKpi.weight, 0)
      return accGoal + total
    }, 0)
  }, [evaluationGoals])

  // queries/mutations
  const { refetch: getGoals } = useQuery<GetEvaluationGoalsType>(GET_EVALUATION_GOALS, {
    skip: true,
    onCompleted: ({ evaluationGoals }) => {
      setRemoving(-1)
      setEvaluationGoals(evaluationGoals)
    }
  })

  const [createGoal] = useMutation<CreateGoalType>(CREATE_GOAL)
  const [updateGoal] = useMutation<UpdateGoalType>(UPDATE_GOAL)
  const [deleteGoal] = useMutation<DeleteGoalType>(DELETE_GOAL)
  const [createKpi] = useMutation<CreateKpiType>(CREATE_KPI)
  const [updateKpi] = useMutation<UpdateKpiType>(UPDATE_KPI)

  useEffect(() => {
    if (evaluationModel.goals?.length) {
      setEvaluationGoals(evaluationModel.goals)
    } else {
      setEvaluationGoals([])
    }
  }, [evaluationModel])

  useEffect(() => {
    if (session && session.user.role !== ROLES.ADMIN && session.user.id === appraisee.manager?.id) {
      setIsManageable(true)
    } else {
      setIsManageable(false)
    }
  }, [session, appraisee])

  const handleKpis = useCallback(
    async (goal: GoalType, evaluationKpis: EvaluationKpiInput[]) => {
      for (const { id, name, target, weight } of evaluationKpis) {
        if (id > 0 && goal?.kpis?.find((kpi) => kpi.id === id)) {
          await updateKpi({
            variables: {
              id,
              name,
              target,
              weight
            }
          })
        } else {
          await createKpi({
            variables: {
              idGoal: goal.id,
              name,
              target,
              weight
            }
          })
        }
      }
    },
    [createKpi, updateKpi]
  )

  const handleSave = useCallback(
    async (goalName: string, evaluationKpis: EvaluationKpiInput[], evaluationGoal?: GoalType) => {
      let goal: GoalType
      if (!evaluationGoal) {
        goal = await createGoal({
          variables: {
            idEvaluation: evaluationModel.id,
            idUser: appraisee.id,
            name: goalName
          }
        }).then(async ({ data }) => data!.created)
      } else {
        goal = await updateGoal({
          variables: {
            id: evaluationGoal.id,
            name: goalName
          }
        }).then(({ data }) => data!.updated)
      }

      await handleKpis(goal, evaluationKpis).finally(async () => {
        await getGoals({
          idEvaluation: evaluationModel.id,
          idUser: appraisee.id
        })
      })
    },
    [appraisee, createGoal, evaluationModel, getGoals, handleKpis, updateGoal]
  )

  const onSaveImport = useCallback(
    async (goals: GoalType[]) => {
      for (const goal of goals) {
        await handleSave(goal.name, goal.kpis)
      }
    },
    [handleSave]
  )

  const handleEdit = (evaluationGoal: GoalType) => {
    setEditEvaluationGoal(evaluationGoal)
    setOpenGoalModal(true)
  }

  const handleDelete = async (evaluationGoal: GoalType) => {
    setRemoving(evaluationGoal.id)

    await handleDeleteGoal(evaluationGoal)
    await getGoals({
      idEvaluation: evaluationModel.id,
      idUser: appraisee.id
    })
  }

  const handleDeleteGoal = async ({ id }: GoalType) => {
    if (id > 0) {
      await deleteGoal({
        variables: { id }
      })
    }
  }

  const ActionButtonsGoal = () => {
    return (
      <Group align={'center'}>
        <Button
          variant={'subtle'}
          onClick={() => setOpenImportGoalModal(true)}
          disabled={totalWeight === 100 || isSaving}
          loading={isSaving}
        >
          {GoalsConstants.import[locale]}
        </Button>
        <Text size={!match ? 'md' : 'sm'} weight={500}>
          ou
        </Text>
        <Button
          disabled={totalWeight === 100 || isSaving}
          onClick={() => {
            if (totalWeight < 100) {
              setOpenGoalModal(true)
            }
          }}
        >
          {CommonConstants.create[locale]}
        </Button>
      </Group>
    )
  }

  const shouldOpenGoalModal = () => {
    if (openGoalModal) {
      return (
        <GoalForm
          goals={goals}
          evaluationGoals={evaluationGoals}
          handleAdd={handleSave}
          handleClose={() => {
            setOpenGoalModal(false)
            setEditEvaluationGoal(undefined)
          }}
          totalWeight={totalWeight}
          editMode={
            !editEvaluationGoal
              ? undefined
              : {
                  evaluationGoal: editEvaluationGoal,
                  handleUpdate: handleSave
                }
          }
        />
      )
    }
  }

  const shouldOpenImportGoalModal = () => {
    if (openImportGoalModal) {
      return (
        <GoalImportForm
          goals={goals}
          evaluationGoals={evaluationGoals}
          handleSave={onSaveImport}
          handleClose={() => setOpenImportGoalModal(false)}
          totalWeight={totalWeight}
        />
      )
    }
  }

  if (!session) {
    return <LoadingOverlay />
  }

  return (
    <>
      {shouldOpenGoalModal()}
      {shouldOpenImportGoalModal()}
      <ContentBase
        title={
          <Group sx={{ justifyContent: 'space-between' }}>
            <Title p={20} order={!match ? 3 : 6}>
              {GoalsConstants.title[actor][locale]}
            </Title>
            <Group mr={25}>
              <Avatar
                sx={{ backgroundColor: theme.colors.gray[3] }}
                size={!match ? 'sm' : 'xs'}
                src={
                  !appraisee?.picture
                    ? FALLBACK_USER_PICTURE
                    : `${process.env.NEXT_PUBLIC_API_URL}${appraisee.picture}`
                }
              />
              <Text size={!match ? 'md' : 'xs'}>
                {appraisee.info?.name} {appraisee.info?.lastname}
              </Text>
            </Group>
          </Group>
        }
      >
        <Group sx={{ width: '100%' }}>
          <Group
            p={10}
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              backgroundColor: theme.colors.gray[0],
              borderRadius: theme.radius.md
            }}
          >
            <Text weight={600} sx={{ color: theme.colors.gray[6] }}>
              {EvaluationConstants.title.default[locale]} - {evaluationModel.year}
            </Text>
            {isManageable && evaluationGoals.length && ActionButtonsGoal()}
          </Group>
          {!evaluationGoals.length && (
            <Group
              mt={200}
              spacing={25}
              direction={'column'}
              align={'center'}
              sx={{ justifyContent: 'center', width: '100%' }}
            >
              <Text size={!match ? 'lg' : 'md'} sx={{ color: theme.colors.gray[3] }}>
                {GoalsConstants.empty[locale]}
              </Text>
              {isManageable && ActionButtonsGoal()}
            </Group>
          )}
          {evaluationGoals.map((goal, index) => (
            <GoalFormItem
              key={`${goal.id}-${index}`}
              goal={goal}
              opened={opened === goal.id}
              onOpen={() => (opened === goal.id ? setOpened(-1) : setOpened(goal.id))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              removing={removing > 0 && removing === goal.id}
            />
          ))}
        </Group>
      </ContentBase>
    </>
  )
}

export default GoalTemplate
