import { useMutation, useQuery } from '@apollo/client'
import { ActionIcon, Button, Group, Text, Tooltip, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Table } from '@nextui-org/react'
import { IconEdit, IconTrash } from '@tabler/icons'
import PdiCompetenceForm, { PdiCompetenceInput } from 'components/PdiCompeteceForm'
import { CommonConstants } from 'constants/common'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PDI_COMPETENCE,
  DELETE_PDI_COMPETENCE,
  UPDATE_PDI_COMPETENCE
} from 'graphql/mutations/collection/PdiCompetence'
import { DELETE_PDI_COMPETENCE_CATEGORY } from 'graphql/mutations/collection/PdiCompetence/Category'
import { GET_PDI_COMPETENCE_CATEGORIES } from 'graphql/queries/collection/PdiCompetenceCategory'
import { useEffect, useState } from 'react'
import {
  CreatePdiCompetenceType,
  DeletePdiCompetenceType,
  PdiCompetenceType,
  UpdatePdiCompetenceType
} from 'types/collection/PdiCompetence'
import {
  DeletePdiCompetenceCategoryType,
  GetPdiCompetenceCategories,
  PdiCompetenceCategoryType
} from 'types/collection/PdiCompetence/Category'

export type PdiCompetenceProps = {
  actor: EVALUATION_ACTOR
  pdi?: PdiCompetenceType[]
}

const PdiCompetence = ({ actor, pdi }: PdiCompetenceProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { performedEvaluation, setPerformedEvaluation, mode, isLocaleLoading, isSaving } =
    useEvaluation()
  const [pdiCompetences, setPdiCompetences] = useState<PdiCompetenceType[]>([])
  const [openCompetenceModal, setOpenCompetenceModal] = useState<boolean>(false)
  const [editCompetence, setEditCompetence] = useState<PdiCompetenceType>()
  const [categories, setCategories] = useState<PdiCompetenceCategoryType[]>([])
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  const { data, loading, error, refetch } = useQuery<GetPdiCompetenceCategories>(
    GET_PDI_COMPETENCE_CATEGORIES
  )

  const [create] = useMutation<CreatePdiCompetenceType>(CREATE_PDI_COMPETENCE, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PDI COMPETENCE', { ...e })
  })

  const [update] = useMutation<UpdatePdiCompetenceType>(UPDATE_PDI_COMPETENCE, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PDI COMPETENCE', { ...e })
  })

  const [remove] = useMutation<DeletePdiCompetenceType>(DELETE_PDI_COMPETENCE, {
    onCompleted: ({ deleted }) => updatePerformedEvaluationDeleted(deleted),
    onError: (e) => console.log('ERROR ON DELETING PDI COMPETENCE', { ...e })
  })

  const [deleteCategory] = useMutation<DeletePdiCompetenceCategoryType>(
    DELETE_PDI_COMPETENCE_CATEGORY
  )

  useEffect(() => {
    refetch()
  }, [locale])

  useEffect(() => {
    if (pdi) {
      setPdiCompetences(pdi)
    }
  }, [pdi])

  useEffect(() => {
    const abortController = new AbortController()

    if (error) {
      console.log('ERROR ON GETTING PDI COMPETENCE CATEGORIES', { ...error })
    } else if (data && !loading) {
      setCategories(data.categories)
    }

    return () => {
      abortController.abort()
    }
  }, [data, loading, error])

  const updatePerformedEvaluation = async (pdiCompetence: PdiCompetenceType) => {
    const pdiCompetenceIndex = pdiCompetences.findIndex((c) => c.id === pdiCompetence.id)
    const competences = pdiCompetences.map((currCompetence) => {
      return currCompetence.id === pdiCompetence.id
        ? { ...currCompetence, ...pdiCompetence }
        : { ...currCompetence }
    })
    setPerformedEvaluation((pe) => ({
      ...pe,
      pdiCompetence: pdiCompetenceIndex < 0 ? [...pe.pdiCompetence, pdiCompetence] : competences
    }))
  }

  const updatePerformedEvaluationDeleted = async (pdiCompetence: PdiCompetenceType) => {
    const competences = pdiCompetences.filter((currCompetence) => {
      return currCompetence.id !== pdiCompetence.id
    })
    setPerformedEvaluation((pe) => ({
      ...pe,
      pdiCompetence: competences
    }))
  }

  const handleSave = async (pdi: PdiCompetenceInput) => {
    if (pdi.id < 0) {
      await create({
        variables: {
          idPerformed: performedEvaluation.id,
          idCategory: pdi.category.id,
          name: pdi.name,
          action: pdi.action,
          deadline: pdi.deadline
        }
      })
    } else {
      await update({
        variables: {
          id: pdi.id,
          idCategory: pdi.category.id,
          name: pdi.name,
          action: pdi.action,
          deadline: pdi.deadline
        }
      })
    }

    await refetch()
  }

  const handleEdit = (pdiCompetence: PdiCompetenceType) => {
    setEditCompetence(pdiCompetence)
    setOpenCompetenceModal(true)
  }

  const handleDelete = async (pdiCompetence: PdiCompetenceType) => {
    await remove({
      variables: {
        id: pdiCompetence.id
      }
    }).finally(async () => {
      for (const category of categories) {
        await deleteCategory({
          variables: {
            id: category.id
          }
        }).catch((err) => console.log('ERROR ON DELETING PDI COMPETENCE CATEGORY', { ...err }))
      }
    })
  }

  return (
    <>
      {openCompetenceModal && (
        <PdiCompetenceForm
          competences={pdiCompetences}
          categories={categories}
          handleAdd={handleSave}
          handleClose={() => {
            setOpenCompetenceModal(false)
            setEditCompetence(undefined)
          }}
          editMode={
            !editCompetence
              ? undefined
              : {
                  pdi: editCompetence,
                  handleUpdate: handleSave
                }
          }
        />
      )}
      {!pdiCompetences.length ? (
        <Group
          spacing={15}
          direction={'column'}
          align={'center'}
          sx={{
            justifyContent: 'center',
            cursor: !isLocaleLoading ? 'auto' : 'not-allowed'
          }}
        >
          <Text size={!match ? 'lg' : 'md'} sx={{ color: theme.colors.gray[3] }}>
            {CommonConstants.pdiCompetence.empty[locale]}
          </Text>
          {mode === EVALUATION_MODE.EDIT && actor === EVALUATION_ACTOR.MANAGER && (
            <Button loading={isLocaleLoading} onClick={() => setOpenCompetenceModal(true)}>
              {!isLocaleLoading ? CommonConstants.create[locale] : CommonConstants.loading[locale]}
            </Button>
          )}
        </Group>
      ) : (
        <>
          <Group mb={20} direction={'column'} align={'flex-end'}>
            {actor === EVALUATION_ACTOR.MANAGER && mode === EVALUATION_MODE.EDIT && (
              <Button loading={isLocaleLoading} onClick={() => setOpenCompetenceModal(true)}>
                {!isLocaleLoading
                  ? CommonConstants.create[locale]
                  : CommonConstants.loading[locale]}
              </Button>
            )}
          </Group>
          <Table aria-labelledby={'pdi-competence-categories'}>
            <Table.Header>
              <Table.Column width={'30%'}>
                {CommonConstants.pdiCompetence.table.name[locale]}
              </Table.Column>
              <Table.Column width={'20%'}>
                {CommonConstants.pdiCompetence.table.category[locale]}
              </Table.Column>
              <Table.Column width={'30%'}>
                {CommonConstants.pdiCompetence.table.actions[locale]}
              </Table.Column>
              <Table.Column width={'10%'}>
                {CommonConstants.pdiCompetence.table.deadline[locale]}
              </Table.Column>
              <Table.Column width={'10%'}>{}</Table.Column>
            </Table.Header>
            <Table.Body>
              {pdiCompetences.map((pdiCompetence) => (
                <Table.Row key={pdiCompetence.id}>
                  <Table.Cell>{pdiCompetence.name}</Table.Cell>
                  <Table.Cell>{pdiCompetence.category.name}</Table.Cell>
                  <Table.Cell>{pdiCompetence.action}</Table.Cell>
                  <Table.Cell>
                    {new Date(pdiCompetence.deadline).toLocaleDateString('pt-BR')}
                  </Table.Cell>
                  <Table.Cell>
                    {actor === EVALUATION_ACTOR.MANAGER && mode === EVALUATION_MODE.EDIT && (
                      <Group sx={{ justifyContent: 'end' }}>
                        <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                          <ActionIcon
                            disabled={isSaving}
                            variant={'light'}
                            color={'cyan'}
                            onClick={() => handleEdit(pdiCompetence)}
                          >
                            <IconEdit size={!match ? 20 : 14} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip color={'red'} label={CommonConstants.delete[locale]}>
                          <ActionIcon
                            disabled={isSaving}
                            variant={'light'}
                            color={'red'}
                            onClick={async () => await handleDelete(pdiCompetence)}
                          >
                            <IconTrash size={!match ? 20 : 14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      )}
    </>
  )
}

export default PdiCompetence
