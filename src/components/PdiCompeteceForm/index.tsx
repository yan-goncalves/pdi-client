import { useMutation } from '@apollo/client'
import { Autocomplete, Divider, Group, Modal, Text, TextInput, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import ActionGroup from 'components/ActionGroup'
import { CommonConstants } from 'constants/common'
import { ErrorsConstants } from 'constants/errors'
import { NotificationsConstants } from 'constants/notifications'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { LOCALES, useLocale } from 'contexts/LocaleProvider'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/pt-br'
import {
  CREATE_PDI_COMPETENCE_CATEGORY,
  DELETE_PDI_COMPETENCE_CATEGORY
} from 'graphql/mutations/collection/PdiCompetence/Category'
import { useEffect, useLayoutEffect, useState } from 'react'
import { PdiCompetenceType } from 'types/collection/PdiCompetence'
import {
  CreatePdiCompetenceCategoryType,
  DeletePdiCompetenceCategoryType,
  PdiCompetenceCategoryType
} from 'types/collection/PdiCompetence/Category'

export type PdiCompetenceInput = {
  id: number
  name: string
  category: PdiCompetenceCategoryInput
  action: string
  deadline: Date
}

export type PdiCompetenceCategoryInput = {
  id: number
  name: string
}

export type PdiCompetenceFormProps = {
  competences: PdiCompetenceType[]
  categories: PdiCompetenceCategoryType[]
  handleAdd: (pdi: PdiCompetenceInput) => Promise<void>
  handleClose: () => void
  editMode?: {
    pdi: PdiCompetenceType
    handleUpdate: (pdi: PdiCompetenceInput) => Promise<void>
  }
}

const PdiCompetenceForm = ({
  competences,
  categories,
  handleAdd,
  handleClose,
  editMode
}: PdiCompetenceFormProps) => {
  const { locale } = useLocale()
  const { isSaving, setIsSaving } = useEvaluation()
  const [name, setName] = useState<string>()
  const [categoryName, setCategoryName] = useState<string>()
  const [action, setAction] = useState<string>()
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [inError, setInError] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const [createCategory] = useMutation<CreatePdiCompetenceCategoryType>(
    CREATE_PDI_COMPETENCE_CATEGORY
  )

  const [deleteCategory] = useMutation<DeletePdiCompetenceCategoryType>(
    DELETE_PDI_COMPETENCE_CATEGORY
  )

  useEffect(() => {
    if (editMode && !name && !categoryName && !action && !deadline) {
      setName(editMode.pdi.name)
      setCategoryName(editMode.pdi.category.name)
      setAction(editMode.pdi.action)
      setDeadline(dayjs(editMode.pdi.deadline).toDate())
    }
  }, [editMode])

  useLayoutEffect(() => {
    if (inError || !name || !categoryName || !action || !deadline) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }

    return () => {
      setIsDisabled(false)
    }
  }, [inError, name, categoryName, action, deadline])

  useLayoutEffect(() => {
    if (
      !editMode &&
      name &&
      competences.find(({ name: competenceName }) => {
        return competenceName.toLowerCase().trim() === name.toLowerCase().trim()
      })
    ) {
      setInError(true)
    } else {
      setInError(false)
    }

    return () => {
      setInError(false)
    }
  }, [name])

  const handleSave = async () => {
    if (!isDisabled && name && categoryName && action && deadline) {
      let category = categories.find(
        (category) => category.name.toUpperCase() === categoryName.toUpperCase()
      )
      if (!category) {
        await createCategory({
          variables: {
            name: categoryName
          },
          context: {
            headers: {
              locale
            }
          }
        }).then(({ data }) => {
          if (data) {
            category = data.created
          }
        })
      }
      if (!editMode) {
        await handleAdd({
          id: -1,
          name,
          category: category!,
          action,
          deadline
        })
      } else {
        const { pdi, handleUpdate } = editMode
        await handleUpdate({
          id: pdi.id,
          name,
          category: category!,
          action,
          deadline
        })
      }

      Promise.all(
        categories.map(async (c) => {
          await deleteCategory({
            variables: {
              id: c.id
            }
          })
        })
      )
        .catch((err) => console.log('ERROR ON DELETING PDI COMPETENCE CATEGORY', { ...err }))
        .finally(() => {
          setIsSaving(false)
          handleClose()
        })
    }
  }

  const handleBlur = () => {
    const mapped = categories.map((category) => category.name)
    const found = mapped.find((option) => option.toLowerCase() === categoryName?.toLowerCase())

    setCategoryName(found ?? categoryName)
  }

  return (
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
          {!editMode
            ? CommonConstants.pdiCompetence.create[locale]
            : CommonConstants.pdiCompetence.edit[locale]}
        </Title>
      }
      size={600}
    >
      <Group direction={'column'}>
        <TextInput
          disabled={isSaving}
          id={'name'}
          radius={'md'}
          error={
            !inError ? undefined : (
              <Text size={'xs'}>{ErrorsConstants.pdiCompetence.exists[locale]}</Text>
            )
          }
          label={CommonConstants.description[locale]}
          size={'sm'}
          sx={{ width: '100%' }}
          maxLength={500}
          value={name || ''}
          onChange={({ currentTarget: { value } }) => setName(value)}
        />
        <Autocomplete
          disabled={isSaving}
          label={CommonConstants.category[locale]}
          value={categoryName || ''}
          onChange={(value) => setCategoryName(value)}
          data={
            !categoryName
              ? []
              : categories.map((option) => ({
                  ...option,
                  value: option.name
                }))
          }
          onBlur={handleBlur}
          radius={'md'}
          sx={{ width: '100%' }}
        />
        <TextInput
          disabled={isSaving}
          id={'action'}
          radius={'md'}
          label={CommonConstants.action[locale]}
          size={'sm'}
          sx={{ width: '100%' }}
          maxLength={500}
          value={action || ''}
          onChange={({ currentTarget: { value } }) => setAction(value)}
        />
        <DatePicker
          disabled={isSaving}
          value={deadline}
          onChange={(value) => setDeadline(value)}
          locale={locale === LOCALES.BR ? 'pt-br' : 'en'}
          label={CommonConstants.deadline[locale]}
          inputFormat={locale === LOCALES.BR ? 'DD/MM/YYYY' : 'MM/DD/YYYY'}
          minDate={dayjs(new Date()).add(1, 'days').toDate()}
          radius={'md'}
          sx={{ width: '100%' }}
        />
      </Group>
      <Divider mx={-20} my={20} />
      <ActionGroup
        messages={{
          saving: NotificationsConstants.saving.pdiCompetence[locale],
          saved: NotificationsConstants.saved.pdiCompetence[locale]
        }}
        disabled={isDisabled}
        handleCancel={handleClose}
        handleSave={handleSave}
        groupProps={{
          width: '100%',
          flexDirection: 'row-reverse',
          justifyContent: 'flex-start'
        }}
      />
    </Modal>
  )
}

export default PdiCompetenceForm
