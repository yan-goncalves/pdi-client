import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Grid,
  Group,
  TextInput,
  Title,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { IconCheck, IconTrash } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { ErrorsConstants } from 'constants/errors'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PDI_QUALITY,
  DELETE_PDI_QUALITY,
  UPDATE_PDI_QUALITY
} from 'graphql/mutations/collection/PdiQuality'
import { useEffect, useState } from 'react'
import {
  CreatePdiQualityType,
  PdiQualityType,
  PDI_QUALITY_CATEGORY,
  UpdatePdiQualityType
} from 'types/collection/PdiQuality'

export type PdiQualityProps = {
  pdi?: PdiQualityType[]
}

const PdiQuality = ({ pdi }: PdiQualityProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { performedEvaluation, setPerformedEvaluation, isSaving, setIsSaving } = useEvaluation()
  const [strength, setStrength] = useState<PdiQualityType[]>([])
  const [weakness, setWeakness] = useState<PdiQualityType[]>([])
  const [strengthValue, setStrengthValue] = useState<string>()
  const [weaknessValue, setWeaknessValue] = useState<string>()
  const [isStrengthEditing, setIsStrengthEditing] = useState<boolean>(false)
  const [isWeaknessEditing, setIsWeaknessEditing] = useState<boolean>(false)
  const [strengthHover, setStrengthHover] = useState<number>(-1)
  const [weaknessHover, setWeaknessHover] = useState<number>(-1)
  const [strengthEdit, setStrengthEdit] = useState<PdiQualityType>()
  const [weaknessEdit, setWeaknessEdit] = useState<PdiQualityType>()
  const [isDisabledStrength, setIsDisabledStrength] = useState<boolean>(false)
  const [isDisabledWeakness, setIsDisabledWeakness] = useState<boolean>(false)

  const [create] = useMutation<CreatePdiQualityType>(CREATE_PDI_QUALITY, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED QUESTION', { ...e })
  })
  const [update] = useMutation<UpdatePdiQualityType>(UPDATE_PDI_QUALITY, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED QUESTION', { ...e })
  })
  const [deletePdi] = useMutation<UpdatePdiQualityType>(DELETE_PDI_QUALITY, {
    onError: (e) => console.log('ERROR ON DELETING PERFORMED QUESTION', { ...e })
  })

  useEffect(() => {
    if (pdi) {
      const pdiStrength = pdi.filter((q) => q.category === PDI_QUALITY_CATEGORY.STRENGTH)
      const pdiWeakness = pdi.filter((q) => q.category === PDI_QUALITY_CATEGORY.WEAKNESS)

      setStrength(pdiStrength)
      setWeakness(pdiWeakness)
    }
  }, [pdi])

  useEffect(() => {
    if (strengthValue?.length) {
      setIsStrengthEditing(true)
    } else {
      setIsStrengthEditing(false)
    }
  }, [strengthValue])

  useEffect(() => {
    if (weaknessValue?.length) {
      setIsWeaknessEditing(true)
    } else {
      setIsWeaknessEditing(false)
    }
  }, [weaknessValue])

  useEffect(() => {
    if (strengthValue?.trim().length && strength.some((s) => s.description === strengthValue)) {
      setIsDisabledStrength(true)
    } else {
      setIsDisabledStrength(false)
    }
  }, [strengthValue])

  useEffect(() => {
    if (weaknessValue?.trim().length && weakness.some((s) => s.description === weaknessValue)) {
      setIsDisabledWeakness(true)
    } else {
      setIsDisabledWeakness(false)
    }
  }, [weaknessValue])

  const handleSave = async (pdiQuality: Omit<PdiQualityType, 'createdAt' | 'updatedAt'>) => {
    if (pdiQuality.id < 0) {
      await create({
        variables: {
          idPerformed: performedEvaluation.id,
          category: pdiQuality.category,
          description: pdiQuality.description
        }
      })
    } else {
      await update({
        variables: {
          id: pdiQuality.id,
          category: pdiQuality.category,
          description: pdiQuality.description
        }
      })
    }
  }

  const handleAddStrength = async () => {
    if (strengthValue?.trim().length) {
      setIsSaving(true)
      await handleSave({
        id: -1,
        description: strengthValue,
        category: PDI_QUALITY_CATEGORY.STRENGTH
      }).finally(() => setStrengthValue(''))
    }
  }

  const handleAddWeakness = async () => {
    if (weaknessValue?.length) {
      setIsSaving(true)
      await handleSave({
        id: -1,
        description: weaknessValue,
        category: PDI_QUALITY_CATEGORY.WEAKNESS
      }).finally(() => setWeaknessValue(''))
    }
  }

  const handleEditStrength = async () => {
    if (
      strengthEdit?.description.length &&
      !strength.some((s) => s.description === strengthEdit.description)
    ) {
      setIsSaving(true)
      await handleSave(strengthEdit).finally(() => setStrengthEdit(undefined))
    }
  }

  const handleEditWeakness = async () => {
    if (
      weaknessEdit?.description?.length &&
      !weakness.some((s) => s.description === weaknessEdit.description)
    ) {
      setIsSaving(true)
      await handleSave(weaknessEdit).finally(() => setWeaknessEdit(undefined))
    }
  }

  const handleDelete = async (pdi: PdiQualityType) => {
    await deletePdi({
      variables: {
        id: pdi.id
      }
    }).then(() => {
      setPerformedEvaluation((pe) => ({
        ...pe,
        pdiQuality: pe.pdiQuality.filter((p) => p.id !== pdi.id)
      }))
    })
  }

  const updatePerformedEvaluation = async (pdiQuality: PdiQualityType) => {
    const pdiQualityIndex = performedEvaluation.pdiQuality.findIndex((q) => q.id === pdiQuality.id)
    const qualities = performedEvaluation.pdiQuality.map((currPdiQuality) => {
      return currPdiQuality.id === pdiQuality.id
        ? { ...currPdiQuality, ...pdiQuality }
        : { ...currPdiQuality }
    })

    setPerformedEvaluation((pe) => ({
      ...pe,
      pdiQuality: pdiQualityIndex < 0 ? [...pe.pdiQuality, pdiQuality] : qualities
    }))

    setIsSaving(false)
  }

  return (
    <Grid p={10} gutter={50}>
      <Grid.Col span={12} sm={6}>
        <Title order={6}>{CommonConstants.pdiStrength[locale]}</Title>
        <Group mt={20} align={'flex-start'}>
          <TextInput
            disabled={isSaving}
            value={strengthValue}
            onChange={({ currentTarget: { value } }) => setStrengthValue(value)}
            onKeyDown={({ key }) => {
              if (key === 'Enter' && !isDisabledStrength) {
                handleAddStrength()
              }
            }}
            error={isDisabledStrength && ErrorsConstants.pdiQuality.exists.strength[locale]}
            radius={'md'}
            sx={{ minWidth: 250 }}
          />
          <Transition mounted={isStrengthEditing} transition={'slide-left'}>
            {(styles) => (
              <ActionIcon
                disabled={isDisabledStrength || isSaving}
                onClick={handleAddStrength}
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
        <Group mt={20} spacing={5} direction={'column'} sx={{ width: 300 }}>
          {strength.map((pdi) => (
            <Group
              key={pdi.id}
              onMouseEnter={() => strengthEdit?.id !== pdi.id && setStrengthHover(pdi.id)}
              onMouseLeave={() => setStrengthHover(-1)}
              onBlur={() => setStrengthEdit(undefined)}
              onClick={() => setStrengthEdit(pdi)}
              sx={{ width: '100%' }}
            >
              <TextInput
                disabled={isSaving}
                radius={'md'}
                variant={
                  strengthHover === pdi.id && strengthEdit?.id !== pdi.id
                    ? 'filled'
                    : strengthEdit?.id === pdi.id
                    ? 'default'
                    : 'unstyled'
                }
                onBlur={handleEditStrength}
                value={strengthEdit?.id === pdi.id ? strengthEdit?.description : pdi.description}
                onChange={({ currentTarget: { value } }) =>
                  strengthEdit?.id === pdi.id &&
                  setStrengthEdit({
                    ...strengthEdit,
                    description: value
                  })
                }
                sx={{ width: 250 }}
              />
              <Transition
                mounted={strengthEdit?.id !== pdi.id && strengthHover === pdi.id}
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
          ))}
        </Group>
      </Grid.Col>
      <Grid.Col span={12} sm={6}>
        <Title order={6}>{CommonConstants.pdiWeakness[locale]}</Title>
        <Group mt={20} align={'flex-start'}>
          <TextInput
            disabled={isSaving}
            value={weaknessValue}
            onChange={({ currentTarget: { value } }) => setWeaknessValue(value)}
            onKeyDown={({ key }) => {
              if (key === 'Enter' && !isDisabledWeakness) {
                handleAddWeakness()
              }
            }}
            error={isDisabledWeakness && ErrorsConstants.pdiQuality.exists.weakness[locale]}
            radius={'md'}
            sx={{ minWidth: 250 }}
          />
          <Transition mounted={isWeaknessEditing} transition={'slide-left'}>
            {(styles) => (
              <ActionIcon
                disabled={isDisabledWeakness || isSaving}
                onClick={handleAddWeakness}
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
        <Group mt={20} spacing={5} direction={'column'} sx={{ maxWidth: 300 }}>
          {weakness.map((pdi) => (
            <Group
              key={pdi.id}
              onMouseEnter={() => setWeaknessHover(pdi.id)}
              onMouseLeave={() => setWeaknessHover(-1)}
              onBlur={() => setWeaknessEdit(undefined)}
              onClick={() => setWeaknessEdit(pdi)}
              sx={{ width: '100%' }}
            >
              <TextInput
                disabled={isSaving}
                radius={'md'}
                variant={
                  weaknessHover === pdi.id && weaknessEdit?.id !== pdi.id
                    ? 'filled'
                    : weaknessEdit?.id === pdi.id
                    ? 'default'
                    : 'unstyled'
                }
                onBlur={handleEditWeakness}
                value={weaknessEdit?.id === pdi.id ? weaknessEdit?.description : pdi.description}
                onChange={({ currentTarget: { value } }) =>
                  weaknessEdit?.id === pdi.id &&
                  setWeaknessEdit({
                    ...weaknessEdit,
                    description: value
                  })
                }
                sx={{ width: 250, color: !isSaving ? theme.black : theme.colors.gray[3] }}
              />
              <Transition
                mounted={weaknessEdit?.id !== pdi.id && weaknessHover === pdi.id}
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
          ))}
        </Group>
      </Grid.Col>
    </Grid>
  )
}

export default PdiQuality
