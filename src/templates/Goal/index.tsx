import { useMutation, useQuery } from '@apollo/client'
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  Text,
  Title,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Table } from '@nextui-org/react'
import { IconEdit, IconTrash } from '@tabler/icons'
import ContentBase from 'components/ContentBase'
import { EvaluationKpiInput } from 'components/KpiForm'
import LoadingOverlay from 'components/LoadingOverlay'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { CommonConstants } from 'constants/common'
import { EvaluationConstants } from 'constants/evaluation'
import { GoalsConstants } from 'constants/goals'
import { KpisConstants } from 'constants/kpis'
import { ROLES } from 'constants/role'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { CREATE_GOAL, DELETE_GOAL, UPDATE_GOAL } from 'graphql/mutations/collection/Goal'
import { CREATE_KPI, UPDATE_KPI } from 'graphql/mutations/collection/Kpi'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  CreateGoalType,
  DeleteGoalType,
  GetEvaluationGoalsType,
  GoalType,
  UpdateGoalType
} from 'types/collection/Goal'
import { CreateKpiType, UpdateKpiType } from 'types/collection/Kpi'
import GoalForm from '../../components/GoalForm'
import { useStyles } from './styles'

export type GoalTemplateProps = {
  actor: EVALUATION_ACTOR
  goals: GoalType[]
}

const GoalTemplate = ({ actor, goals }: GoalTemplateProps) => {
  const theme = useMantineTheme()
  const { data: session } = useSession()
  const { classes, cx } = useStyles()
  const { locale } = useLocale()
  const { evaluationModel, appraisee } = useEvaluation()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)
  const [opened, setOpened] = useState<number>(-1)
  const [openGoalModal, setOpenGoalModal] = useState<boolean>(false)
  const [totalWeight, setTotalWeight] = useState<number>(0)
  const [evaluationGoals, setEvaluationGoals] = useState<GoalType[]>([])
  const [removing, setRemoving] = useState<number>(-1)
  const [editEvaluationGoal, setEditEvaluationGoal] = useState<GoalType>()
  const [isManageable, setIsManageable] = useState<boolean>(false)

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
    if (evaluationGoals.length) {
      const total = evaluationGoals
        .map(({ kpis }) => {
          return kpis
            .map(({ weight }) => weight)
            .reduce((prevWeight, currWeight) => prevWeight + currWeight, 0)
        })
        .reduce((prevWeight, currWeight) => prevWeight + currWeight, 0)

      setTotalWeight(total)
    }
  }, [evaluationGoals])

  useEffect(() => {
    if (session && session.user.role !== ROLES.ADMIN && session.user.id === appraisee.manager?.id) {
      setIsManageable(true)
    } else {
      setIsManageable(false)
    }
  }, [session, appraisee])

  const handleSave = async (
    goalName: string,
    evaluationKpis: EvaluationKpiInput[],
    evaluationGoal?: GoalType
  ) => {
    setTotalWeight(0)

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

    await handleKpis(goal.id, evaluationKpis).finally(async () => {
      await getGoals({
        idEvaluation: evaluationModel.id,
        idUser: appraisee.id
      })
    })
  }

  const handleKpis = async (idGoal: number, evaluationKpis: EvaluationKpiInput[]) => {
    await Promise.all(
      evaluationKpis.map(async ({ id, name, target, weight }) => {
        if (id > 0) {
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
              idGoal,
              name,
              target,
              weight
            }
          })
        }
      })
    )
  }

  const handleEdit = (evaluationGoal: GoalType) => {
    setEditEvaluationGoal(evaluationGoal)
    setOpenGoalModal(true)
  }

  const handleDelete = async (evaluationGoal: GoalType) => {
    setTotalWeight(0)
    setRemoving(evaluationGoal.id)

    await handleDeleteGoal(evaluationGoal).finally(async () => {
      await getGoals({
        idEvaluation: evaluationModel.id,
        idUser: appraisee.id
      })
    })
  }

  const handleDeleteGoal = async ({ id }: GoalType) => {
    if (id > 0) {
      await deleteGoal({
        variables: { id }
      })
    }
  }

  if (!session) {
    return <LoadingOverlay />
  }

  return (
    <>
      {openGoalModal && (
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
      )}
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
                    : `${process.env.NEXT_PUBLIC_API_URL}${appraisee.picture.url}`
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
            {isManageable && evaluationGoals.length && (
              <Button
                disabled={totalWeight === 100}
                onClick={() => {
                  if (totalWeight < 100) {
                    setOpenGoalModal(true)
                  }
                }}
              >
                {CommonConstants.create[locale]}
              </Button>
            )}
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
                {KpisConstants.empty[locale]}
              </Text>
              {isManageable && (
                <Button
                  disabled={totalWeight === 100}
                  onClick={() => {
                    if (totalWeight < 100) {
                      setOpenGoalModal(true)
                    }
                  }}
                >
                  {CommonConstants.create[locale]}
                </Button>
              )}
            </Group>
          )}
          {evaluationGoals.map((goal) => (
            <Box key={goal.id} className={classes.box}>
              <Group
                align={'center'}
                className={
                  opened === goal.id ? cx(classes.group, classes.groupOpened) : classes.group
                }
              >
                <Text
                  role={'button'}
                  onClick={() => {
                    opened === goal.id ? setOpened(-1) : setOpened(goal.id)
                  }}
                  className={classes.label}
                  sx={{
                    color: removing === goal.id ? theme.colors.gray[3] : theme.black
                  }}
                >
                  {removing === goal.id ? CommonConstants.removing[locale] : goal.name}
                </Text>
                {isManageable && (
                  <Group className={classes.actionsGroup}>
                    <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                      <ActionIcon
                        disabled={removing > 0}
                        variant={'light'}
                        color={'cyan'}
                        onClick={() => handleEdit(goal)}
                      >
                        <IconEdit size={!match ? 20 : 14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip color={'red'} label={CommonConstants.delete[locale]}>
                      <ActionIcon
                        disabled={removing > 0}
                        variant={'light'}
                        color={'red'}
                        onClick={async () => await handleDelete(goal)}
                      >
                        <IconTrash size={!match ? 20 : 14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                )}
              </Group>
              <Divider
                className={cx(
                  classes.divider,
                  opened === goal.id ? classes.dividerOpened : classes.dividerHidden
                )}
              />
              <Collapse in={opened === goal.id}>
                {!goal.kpis?.length ? (
                  <Group spacing={5} m={20}>
                    <Text size={!match ? 'md' : 'xs'} sx={{ color: theme.colors.gray[3] }}>
                      {KpisConstants.empty[locale]}
                    </Text>
                  </Group>
                ) : (
                  <Table aria-labelledby={'kpi'}>
                    <Table.Header>
                      <Table.Column width={'60%'}>
                        <Text size={'xs'}>KPI</Text>
                      </Table.Column>
                      <Table.Column width={'25%'}>
                        <Text size={'xs'}>{CommonConstants.target[locale]}</Text>
                      </Table.Column>
                      <Table.Column width={'15%'}>
                        <Text size={'xs'}>{CommonConstants.weight[locale]}</Text>
                      </Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {goal.kpis.map(({ id, name, target, weight }) => (
                        <Table.Row key={id}>
                          <Table.Cell>
                            <Text size={!match ? 'md' : 'xs'}>{name}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text size={!match ? 'md' : 'xs'}>{target}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text size={!match ? 'md' : 'xs'}>{weight}%</Text>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                )}
              </Collapse>
            </Box>
          ))}
        </Group>
      </ContentBase>
    </>
  )
}

export default GoalTemplate
