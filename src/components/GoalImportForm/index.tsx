import { useQuery } from '@apollo/client'
import { Checkbox, Group, Loader, Modal, Text, Title, useMantineTheme } from '@mantine/core'
import ActionGroup from 'components/ActionGroup'
import GoalForm from 'components/GoalForm'
import GoalFormItem from 'components/GoalFormItem'
import { EvaluationKpiInput } from 'components/KpiForm'
import { CommonConstants } from 'constants/common'
import { GoalsConstants } from 'constants/goals'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_PREVIOUS_YEAR_GOALS } from 'graphql/queries/collection/Goals'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { GetGoalsType, GoalType } from 'types/collection/Goal'
import { KpiType } from 'types/collection/Kpi'
import { useStyles } from './styles'

export type GoalImportFormProps = {
  goals: GoalType[]
  evaluationGoals: GoalType[]
  totalWeight: number
  handleSave: (goals: GoalType[]) => Promise<void>
  handleClose: () => void
}

const GoalImportForm = ({
  goals,
  evaluationGoals,
  totalWeight,
  handleSave: onSave,
  handleClose
}: GoalImportFormProps) => {
  const theme = useMantineTheme()
  const { classes, cx } = useStyles()
  const { locale } = useLocale()
  const { isSaving, appraisee } = useEvaluation()
  const [opened, setOpened] = useState<number>(-1)
  const [previousYearGoals, setPreviousYearGoals] = useState<GoalType[]>([])
  const [selectedYearGoals, setSelectedYearGoals] = useState<number[]>([])
  const [openGoalModal, setOpenGoalModal] = useState<boolean>(false)
  const [editEvaluationGoal, setEditEvaluationGoal] = useState<GoalType>()

  const previousYearWeight = useMemo(() => {
    const goals = previousYearGoals.filter((goal) => selectedYearGoals.includes(goal.id))
    return goals?.reduce((accGoal, currGoal) => {
      const total = currGoal.kpis.reduce((accKpi, currKpi) => accKpi + currKpi.weight, 0)
      return accGoal + total
    }, 0)
  }, [selectedYearGoals, previousYearGoals])

  const sumTotalWeight = useMemo(() => {
    return previousYearWeight + totalWeight
  }, [totalWeight, previousYearWeight])

  const { data, loading, error } = useQuery<GetGoalsType>(GET_PREVIOUS_YEAR_GOALS, {
    variables: {
      idUser: appraisee.id
    },
    context: {
      headers: {
        locale
      }
    }
  })

  const handleSave = useCallback(async () => {
    await onSave(previousYearGoals.filter((goal) => selectedYearGoals.includes(goal.id)))
    handleClose()
  }, [onSave, previousYearGoals, selectedYearGoals, handleClose])

  const handleSelectAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.currentTarget.checked
      setSelectedYearGoals(!isChecked ? [] : previousYearGoals.map(({ id }) => id))
    },
    [previousYearGoals]
  )

  const handleSelect = useCallback((goalId: number, checked: boolean) => {
    setSelectedYearGoals((prev) => {
      if (!checked) {
        return prev.filter((id) => id !== goalId)
      }

      return [...prev, goalId]
    })
  }, [])

  const handleEdit = useCallback((evaluationGoal: GoalType) => {
    setEditEvaluationGoal(evaluationGoal)
    setOpenGoalModal(true)
  }, [])

  const handleImport = useCallback(async (goal: GoalType, evaluationKpis: EvaluationKpiInput[]) => {
    setPreviousYearGoals((prev) => {
      const filtered = prev.filter((curr) => curr.id !== goal.id)
      const goals = [...filtered, { ...goal, kpis: evaluationKpis as KpiType[] }]
      return goals.sort((prev, curr) => prev.id - curr.id)
    })
  }, [])

  const isDisabledButton = useMemo(() => {
    return isSaving || selectedYearGoals.length === 0 || sumTotalWeight > 100
  }, [isSaving, selectedYearGoals, sumTotalWeight])

  useEffect(() => {
    if (error) {
      setPreviousYearGoals([])
    } else if (data && !loading) {
      setPreviousYearGoals(
        data.goals.filter((goal) => {
          return evaluationGoals.every((evaluationGoal) => {
            return evaluationGoal.name !== goal.name && goal.user.id === appraisee.id
          })
        })
      )
    }

    return () => {
      setPreviousYearGoals([])
    }
  }, [data, loading, error, appraisee, evaluationGoals])

  const shouldOpenGoalModal = useCallback(() => {
    if (openGoalModal && editEvaluationGoal) {
      return (
        <GoalForm
          goals={evaluationGoals}
          evaluationGoals={[]}
          handleClose={() => {
            setOpenGoalModal(false)
            setEditEvaluationGoal(undefined)
          }}
          totalWeight={sumTotalWeight}
          editMode={{ evaluationGoal: editEvaluationGoal, handleImport }}
        />
      )
    }
  }, [openGoalModal, editEvaluationGoal, evaluationGoals, sumTotalWeight, handleImport])

  return (
    <>
      {shouldOpenGoalModal()}
      <Modal
        opened
        centered
        withCloseButton={!isSaving}
        closeOnClickOutside={!isSaving}
        closeOnEscape={!isSaving}
        onClose={handleClose}
        radius={'md'}
        title={
          <Title order={4} mt={10} mb={10}>
            {GoalsConstants.import[locale]}
          </Title>
        }
        size={800}
      >
        {loading ? (
          <Group align={'center'} sx={{ minHeight: 400, justifyContent: 'center' }}>
            <Loader color={theme.colors.blue[9]} variant={'dots'} />
          </Group>
        ) : (
          <>
            <Group direction={'column'} mt={10} spacing={10}>
              <Checkbox
                label={<Text>{CommonConstants.selectAll[locale]}</Text>}
                mb={10}
                checked={selectedYearGoals.length > 0}
                onChange={handleSelectAll}
                indeterminate={![0, previousYearGoals.length].includes(selectedYearGoals.length)}
                classNames={{ input: classes.checkboxGroup, label: classes.checkboxGroup }}
              />
              {previousYearGoals.map((goal, index) => (
                <GoalFormItem
                  key={`${goal.id}-${index}`}
                  goal={goal}
                  opened={opened === goal.id}
                  onOpen={() => (opened === goal.id ? setOpened(-1) : setOpened(goal.id))}
                  onSelect={handleSelect}
                  onEdit={selectedYearGoals.includes(goal.id) ? handleEdit : undefined}
                  isSelected={selectedYearGoals.includes(goal.id)}
                />
              ))}
              <Group
                align={'center'}
                sx={{
                  width: '100%',
                  justifyContent: sumTotalWeight > 100 ? 'space-between' : 'end'
                }}
              >
                {sumTotalWeight > 100 && (
                  <Group>
                    <Text size={'sm'} color={theme.colors.red[7]}>
                      {GoalsConstants.totalWeightLess[locale]}
                    </Text>
                  </Group>
                )}
                <Text
                  weight={500}
                  color={sumTotalWeight > 100 ? theme.colors.red[7] : theme.colors.green[7]}
                >
                  {GoalsConstants.totalWeight[locale]}: <strong>{sumTotalWeight}</strong>
                  /100
                </Text>
              </Group>
            </Group>
            <Group align={'baseline'} sx={{ justifyContent: 'space-between' }} mt={40}>
              <Text size={'xs'} color={theme.colors.gray[6]}>
                *{GoalsConstants.importPrevious.info[locale]}
              </Text>
              <ActionGroup
                disabled={isDisabledButton}
                handleCancel={handleClose}
                handleSave={handleSave}
                messages={{
                  saving: GoalsConstants.importPrevious.saving[locale],
                  saved: GoalsConstants.importPrevious.saved[locale]
                }}
                groupProps={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'end'
                }}
              />
            </Group>
          </>
        )}
      </Modal>
    </>
  )
}

export default GoalImportForm
