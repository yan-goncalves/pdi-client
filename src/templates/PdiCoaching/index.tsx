import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Group,
  Text,
  TextInput,
  Title,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { IconCheck, IconTrash } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { ErrorsConstants } from 'constants/errors'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PDI_COACHING,
  DELETE_PDI_COACHING,
  UPDATE_PDI_COACHING
} from 'graphql/mutations/collection/PdiCoaching'
import React, { useEffect, useState } from 'react'
import {
  CreatePdiCoachingType,
  DeletePdiCoachingType,
  PdiCoachingType,
  PDI_COACHING_CATEGORY,
  UpdatePdiCoachingType
} from 'types/collection/PdiCoaching'

export type PdiCoachingProps = {
  actor: EVALUATION_ACTOR
  pdi?: PdiCoachingType[]
}

const PdiCoaching = ({ actor, pdi }: PdiCoachingProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { performedEvaluation, setPerformedEvaluation, mode, isSaving, setIsSaving } =
    useEvaluation()
  const [pdiCoachings, setPdiCoachings] = useState<PdiCoachingType[]>([])
  const [value, setValue] = useState<string>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [hover, setHover] = useState<number>(-1)
  const [edit, setEdit] = useState<PdiCoachingType>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const [create] = useMutation<CreatePdiCoachingType>(CREATE_PDI_COACHING, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PDI COACHING', { ...e })
  })

  const [update] = useMutation<UpdatePdiCoachingType>(UPDATE_PDI_COACHING, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PDI COACHING', { ...e })
  })

  const [deletePdi] = useMutation<DeletePdiCoachingType>(DELETE_PDI_COACHING, {
    onError: (e) => console.log('ERROR ON DELETING PDI COACHING', { ...e })
  })

  useEffect(() => {
    if (pdi) {
      setPdiCoachings(pdi)
    }
  }, [pdi])

  useEffect(() => {
    if (value?.length) {
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
  }, [value])

  useEffect(() => {
    if (
      value?.trim().length &&
      pdiCoachings.some((s) => s.action.toUpperCase() === value.toUpperCase())
    ) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [value])

  const updatePerformedEvaluation = async (pdiCoaching: PdiCoachingType) => {
    const pdiCoachingIndex = pdiCoachings.findIndex((c) => c.id === pdiCoaching.id)
    const coachings = pdiCoachings.map((currPdiCoaching) => {
      return currPdiCoaching.id === pdiCoaching.id
        ? { ...currPdiCoaching, ...pdiCoaching }
        : { ...currPdiCoaching }
    })
    setPerformedEvaluation((pe) => ({
      ...pe,
      pdiCoaching: pdiCoachingIndex < 0 ? [...pe.pdiCoaching, pdiCoaching] : coachings
    }))

    setIsSaving(false)
  }

  const handleAdd = async () => {
    setIsSaving(true)
    await create({
      variables: {
        idPerformed: performedEvaluation.id,
        category: PDI_COACHING_CATEGORY.CAREER,
        action: value
      }
    }).finally(() => setValue(''))
  }

  const handleUpdate = async () => {
    if (edit) {
      setIsSaving(true)
      await update({
        variables: {
          id: edit.id,
          category: PDI_COACHING_CATEGORY.CAREER,
          action: edit.action
        }
      }).finally(() => setEdit(undefined))
    }
  }

  const handleDelete = async (pdi: PdiCoachingType) => {
    await deletePdi({
      variables: {
        id: pdi.id
      }
    }).then(() => {
      setPerformedEvaluation((pe) => ({
        ...pe,
        pdiCoaching: pe.pdiCoaching.filter((p) => p.id !== pdi.id)
      }))
    })
  }

  return (
    <Group p={10} direction={'column'}>
      <Title order={6}>{CommonConstants.pdiCoaching.title[locale]}</Title>
      {mode === EVALUATION_MODE.EDIT && actor === EVALUATION_ACTOR.MANAGER && (
        <Group mt={5} align={'flex-start'}>
          <TextInput
            disabled={isSaving}
            value={value}
            onChange={({ currentTarget: { value } }) => setValue(value)}
            onKeyDown={({ key }) => {
              if (key === 'Enter' && !isDisabled) {
                handleAdd()
              }
            }}
            error={isDisabled && ErrorsConstants.pdiCoaching.exists[locale]}
            radius={'md'}
            sx={{ minWidth: 250 }}
          />
          <Transition mounted={isEditing} transition={'slide-left'}>
            {(styles) => (
              <ActionIcon
                disabled={isDisabled || isSaving}
                onClick={handleAdd}
                variant={'light'}
                size={'lg'}
                color={'green'}
                style={styles}
              >
                <IconCheck />
              </ActionIcon>
            )}
          </Transition>
        </Group>
      )}
      {!pdiCoachings.length ? (
        <Text size={'sm'} weight={400} sx={{ color: theme.colors.gray[3] }}>
          {CommonConstants.pdiCoaching.empty[locale]}
        </Text>
      ) : (
        <Group mt={20} spacing={5} direction={'column'} sx={{ width: 300 }}>
          {pdiCoachings.map((pdi) => (
            <React.Fragment key={pdi.id}>
              {mode === EVALUATION_MODE.EDIT && actor === EVALUATION_ACTOR.MANAGER ? (
                <Group
                  key={pdi.id}
                  onMouseEnter={() => edit?.id !== pdi.id && setHover(pdi.id)}
                  onMouseLeave={() => setHover(-1)}
                  onBlur={() => setEdit(undefined)}
                  onClick={() => setEdit(pdi)}
                  sx={{ width: '100%' }}
                >
                  <TextInput
                    disabled={isSaving}
                    radius={'md'}
                    variant={
                      hover === pdi.id && edit?.id !== pdi.id
                        ? 'filled'
                        : edit?.id === pdi.id
                        ? 'default'
                        : 'unstyled'
                    }
                    onBlur={handleUpdate}
                    value={edit?.id === pdi.id ? edit?.action : pdi.action}
                    onChange={({ currentTarget: { value } }) =>
                      edit?.id === pdi.id &&
                      setEdit({
                        ...edit,
                        action: value
                      })
                    }
                    sx={{ width: 250 }}
                  />
                  <Transition
                    mounted={edit?.id !== pdi.id && hover === pdi.id}
                    transition={'slide-left'}
                  >
                    {(styles) => (
                      <ActionIcon
                        disabled={isSaving}
                        onClick={() => handleDelete(pdi)}
                        variant={'light'}
                        size={'lg'}
                        color={'red'}
                        style={styles}
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    )}
                  </Transition>
                </Group>
              ) : (
                <Text key={pdi.id} size={'md'}>
                  {pdi.action}
                </Text>
              )}
            </React.Fragment>
          ))}
        </Group>
      )}
    </Group>
  )
}

export default PdiCoaching
