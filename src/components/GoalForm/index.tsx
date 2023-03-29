import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  Modal,
  RingProgress,
  ScrollArea,
  Text,
  Textarea,
  Title,
  Tooltip,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { Table } from '@nextui-org/react'
import { IconEdit, IconTrash } from '@tabler/icons'
import ActionGroup from 'components/ActionGroup'
import KpiForm, { EvaluationKpiInput } from 'components/KpiForm'
import { CommonConstants } from 'constants/common'
import { ErrorsConstants } from 'constants/errors'
import { GoalsConstants } from 'constants/goals'
import { NotificationsConstants } from 'constants/notifications'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { DELETE_KPI } from 'graphql/mutations/collection/Kpi'
import { useEffect, useLayoutEffect, useState } from 'react'
import { GoalType } from 'types/collection/Goal'
import { DeleteKpiType, KpiType } from 'types/collection/Kpi'
import { useStyles } from './styles'

export type GoalFormProps = {
  goals: GoalType[]
  evaluationGoals: GoalType[]
  handleAdd: (goalName: string, evaluationKpis: EvaluationKpiInput[]) => Promise<void>
  handleClose: () => void
  totalWeight: number
  editMode?: {
    evaluationGoal: GoalType
    handleUpdate: (
      goalName: string,
      evaluationKpis: EvaluationKpiInput[],
      oldEvaluationGoal: GoalType
    ) => Promise<void>
  }
}

const GoalForm = ({
  goals,
  evaluationGoals,
  handleClose,
  handleAdd,
  totalWeight,
  editMode
}: GoalFormProps) => {
  const theme = useMantineTheme()
  const { classes, cx } = useStyles()
  const { locale } = useLocale()
  const { isSaving, setIsSaving } = useEvaluation()
  const [goalName, setGoalName] = useState<string>()
  const [evaluationKpis, setEvaluationKpis] = useState<EvaluationKpiInput[]>([])
  const [, setOptions] = useState<GoalType[]>([])
  const [deletedKpis, setDeletedKpis] = useState<EvaluationKpiInput[]>([])
  const [sumWeight, setSumWeight] = useState<number>(0)
  const [openKpiModal, setOpenKpiModal] = useState<boolean>(false)
  const [kpiItemOpened, setKpiItemOpened] = useState<string>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [inError, setInError] = useState<boolean>(false)
  const [editKpi, setEdiKpi] = useState<KpiType | EvaluationKpiInput>()

  // queries/mutations
  const [deleteKpi] = useMutation<DeleteKpiType>(DELETE_KPI)

  useEffect(() => {
    if (!goals.length) {
      setOptions([])
    } else {
      setOptions(goals)
    }

    return () => {
      setOptions([])
    }
  }, [goals])

  useEffect(() => {
    if (editMode && !goalName && !evaluationKpis.length) {
      const { evaluationGoal } = editMode
      setGoalName(evaluationGoal.name)
      setEvaluationKpis(evaluationGoal.kpis)
    }
  }, [editMode])

  useEffect(() => {
    if (typeof totalWeight === 'number') {
      setSumWeight(totalWeight)
    }
  }, [totalWeight])

  useLayoutEffect(() => {
    if (!goalName || !evaluationKpis.length) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }

    return () => {
      setIsDisabled(false)
    }
  }, [goalName, evaluationKpis])

  useLayoutEffect(() => {
    if (
      goalName &&
      evaluationGoals.find(({ id, name }) => {
        const isSameName = name.toLowerCase().trim() === goalName.toLowerCase().trim()
        return !editMode ? isSameName : isSameName && id !== editMode.evaluationGoal.id
      })
    ) {
      setInError(true)
    } else {
      setInError(false)
    }

    return () => {
      setInError(false)
    }
  }, [goalName])

  const handleAddKpi = (evaluationKpi: EvaluationKpiInput) => {
    setEvaluationKpis((kpis) => [...kpis, evaluationKpi])
    setSumWeight((current) => current + evaluationKpi.weight)
  }

  const handleEditKpi = (evaluationKpi: EvaluationKpiInput) => {
    let diffWeight = 0
    const update = evaluationKpis.map((currentEvaluationKpi) => {
      if (
        currentEvaluationKpi.id === evaluationKpi.id ||
        currentEvaluationKpi.name === evaluationKpi.name
      ) {
        diffWeight = currentEvaluationKpi.weight - evaluationKpi.weight
        return { ...currentEvaluationKpi, ...evaluationKpi }
      } else {
        return { ...currentEvaluationKpi }
      }
    })
    setEvaluationKpis(update)
    setSumWeight(sumWeight - diffWeight)
  }

  const handleSave = async () => {
    if (!isDisabled && goalName) {
      await handleDeleteKpi().then(async () => {
        if (!editMode) {
          await handleAdd(goalName, evaluationKpis).then(() => handleClose())
        } else {
          const { evaluationGoal, handleUpdate } = editMode
          await handleUpdate(goalName, evaluationKpis, evaluationGoal).then(() => handleClose())
        }
      })
      setIsSaving(false)
    }
  }

  const handleDeleteKpi = async () => {
    for (const { id } of deletedKpis) {
      if (id > 0) {
        await deleteKpi({
          variables: {
            id
          }
        })
      }
    }
  }

  const handleEdit = (evaluationKpi: KpiType | EvaluationKpiInput) => {
    setEdiKpi(evaluationKpi)
    setOpenKpiModal(true)
  }

  const handleDelete = (kpi: EvaluationKpiInput) => {
    setDeletedKpis((deletedKpis) => [...deletedKpis, kpi])
    setEvaluationKpis((current) => current.filter((currentKpi) => currentKpi.name !== kpi.name))
    setSumWeight((current) => current - kpi.weight)
  }

  const refreshEvaluationKpis = () => {
    const refreshed = evaluationKpis.filter(({ name }) => {
      return !deletedKpis.map((deleted) => deleted.name).includes(name)
    })
    setEvaluationKpis(refreshed)
  }

  return (
    <>
      {openKpiModal && (
        <KpiForm
          staging={evaluationKpis}
          totalWeight={sumWeight}
          handleAdd={handleAddKpi}
          handleClose={() => {
            setOpenKpiModal(false)
            setEdiKpi(undefined)
          }}
          editMode={
            !editKpi
              ? undefined
              : {
                  evaluationKpi: editKpi,
                  handleEdit: handleEditKpi
                }
          }
        />
      )}
      <Modal
        centered
        opened
        withCloseButton={!isSaving}
        closeOnClickOutside={!isSaving}
        closeOnEscape={!isSaving}
        onClose={handleClose}
        radius={'md'}
        title={
          <Title order={4} mt={10}>
            {!editMode ? GoalsConstants.create[locale] : GoalsConstants.edit[locale]}
          </Title>
        }
        size={600}
      >
        <Group direction={'column'}>
          <Textarea
            disabled={isSaving}
            id={'name'}
            radius={'md'}
            error={
              !inError ? undefined : <Text size={'xs'}>{ErrorsConstants.goals.exists[locale]}</Text>
            }
            label={CommonConstants.description[locale]}
            size={'sm'}
            sx={{ width: '100%' }}
            minRows={4}
            maxRows={5}
            maxLength={3000}
            value={goalName}
            onChange={({ currentTarget: { value } }) => setGoalName(value)}
          />
          <Group sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Text size={'sm'} weight={500}>
              KPI&apos;s
            </Text>
            <Button
              disabled={isSaving || sumWeight === 100}
              variant={'subtle'}
              size={'xs'}
              onClick={() => setOpenKpiModal(true)}
            >
              {CommonConstants.add[locale]} KPI
            </Button>
          </Group>
          {!evaluationKpis.length ? (
            <Text size={'xs'} sx={{ color: theme.colors.gray[3] }}>
              {CommonConstants.empty.kpi[locale]}
            </Text>
          ) : (
            <ScrollArea
              style={{ height: evaluationKpis.length > 2 ? 200 : 'fit-content' }}
              sx={{ width: '100%' }}
            >
              {evaluationKpis.map((kpi) => (
                <Transition
                  key={`${kpi.id}-${kpi.name}`}
                  mounted={!deletedKpis.map((deleted) => deleted.name).includes(kpi.name)}
                  transition={'slide-right'}
                  onExited={refreshEvaluationKpis}
                >
                  {(styles) => (
                    <Box className={classes.box} style={{ ...styles }}>
                      <Group
                        align={'center'}
                        className={
                          kpiItemOpened === kpi.name
                            ? cx(classes.group, classes.groupOpened)
                            : classes.group
                        }
                      >
                        <Text
                          size={'xs'}
                          role={'button'}
                          onClick={() => {
                            kpiItemOpened === kpi.name
                              ? setKpiItemOpened(undefined)
                              : setKpiItemOpened(kpi.name)
                          }}
                          className={classes.label}
                        >
                          {kpi.name}
                        </Text>
                        <Group spacing={3.5} className={classes.actionsGroup}>
                          <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                            <ActionIcon
                              size={'xs'}
                              disabled={isSaving}
                              variant={'light'}
                              color={'cyan'}
                              onClick={() => handleEdit(kpi)}
                            >
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip color={'red'} label={CommonConstants.delete[locale]}>
                            <ActionIcon
                              size={'xs'}
                              disabled={isSaving}
                              variant={'light'}
                              color={'red'}
                              onClick={() => handleDelete(kpi)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                      <Divider
                        className={cx(
                          classes.divider,
                          kpiItemOpened === kpi.name ? classes.dividerOpened : classes.dividerHidden
                        )}
                      />
                      <Collapse in={kpiItemOpened === kpi.name}>
                        <Table aria-labelledby={'kpi'}>
                          <Table.Header>
                            <Table.Column width={'25%'}>
                              <Text size={'xs'}>{CommonConstants.target[locale]}</Text>
                            </Table.Column>
                            <Table.Column width={'15%'}>
                              <Text size={'xs'}>{CommonConstants.weight[locale]}</Text>
                            </Table.Column>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell>
                                <Text size={'xs'} weight={500}>
                                  {kpi.target}
                                </Text>
                              </Table.Cell>
                              <Table.Cell>
                                <RingProgress
                                  thickness={4}
                                  size={60}
                                  sections={[{ value: kpi.weight, color: 'violet' }]}
                                  label={
                                    <Text size={'xs'} align={'center'} weight={500}>
                                      {kpi.weight}%
                                    </Text>
                                  }
                                />
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      </Collapse>
                    </Box>
                  )}
                </Transition>
              ))}
            </ScrollArea>
          )}
        </Group>
        <Divider mx={-20} my={20} />
        <ActionGroup
          messages={{
            saving: NotificationsConstants.saving.goal[locale],
            saved: NotificationsConstants.saved.goal[locale]
          }}
          disabled={isDisabled || inError}
          handleCancel={handleClose}
          handleSave={handleSave}
          groupProps={{
            width: '100%',
            flexDirection: 'row-reverse',
            justifyContent: 'flex-start'
          }}
        />
      </Modal>
    </>
  )
}

export default GoalForm
