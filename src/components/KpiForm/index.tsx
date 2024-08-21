import { useQuery } from '@apollo/client'
import {
  Autocomplete,
  Button,
  Divider,
  Group,
  Modal,
  Slider,
  Text,
  TextInput,
  Title
} from '@mantine/core'

import { CommonConstants } from 'constants/common'
import { ErrorsConstants } from 'constants/errors'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_KPIS } from 'graphql/queries/collection/Kpis'
import { useEffect, useLayoutEffect, useState } from 'react'
import { GetKpisType, KpiType } from 'types/collection/Kpi'

export type EvaluationKpiInput = {
  id: number
  name: string
  target: string
  weight: number
}

export type KpiFormProps = {
  staging: EvaluationKpiInput[]
  totalWeight: number
  handleAdd: (evaluationKpi: EvaluationKpiInput) => void
  handleClose: () => void
  editMode?: {
    evaluationKpi: KpiType | EvaluationKpiInput
    handleEdit: (evaluationKpi: KpiType | EvaluationKpiInput) => void
  }
  isImport?: boolean
}

const KpiForm = ({
  staging,
  totalWeight,
  handleAdd,
  handleClose,
  editMode,
  isImport
}: KpiFormProps) => {
  const { locale } = useLocale()
  const [options, setOptions] = useState<KpiType[]>([])
  const [kpiName, setKpiName] = useState<string>('')
  const [target, setTarget] = useState<string>('')
  const [weight, setWeight] = useState<number>(0)
  const [sumWeight, setSumWeight] = useState<number>(0)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [inError, setInError] = useState<boolean>(false)

  // queries/mutations
  const { data, loading, error } = useQuery<GetKpisType>(GET_KPIS, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    if (error) {
      setOptions([])
    } else if (data && !loading) {
      setOptions(data.kpis)
    }

    return () => {
      setOptions([])
    }
  }, [data, loading, error])

  useLayoutEffect(() => {
    if (
      !editMode &&
      kpiName &&
      staging.find(({ name }) => {
        return name.trim() === kpiName.trim()
      })
    ) {
      setInError(true)
    } else {
      setInError(false)
    }

    return () => {
      setInError(false)
    }
  }, [kpiName])

  useEffect(() => {
    if (editMode) {
      const { evaluationKpi } = editMode
      setKpiName(evaluationKpi.name)
      setTarget(evaluationKpi.target)
      setWeight(evaluationKpi.weight)
    }
  }, [editMode])

  useLayoutEffect(() => {
    if (!kpiName || !target || !weight) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [kpiName, target, weight])

  useEffect(() => {
    if (typeof totalWeight === 'number') {
      setSumWeight(totalWeight)
    }
  }, [totalWeight])

  const handleBlur = () => {
    const mappedOptions = options.map((op) => op.name)
    const found = mappedOptions.find((option) => option.toLowerCase() === kpiName.toLowerCase())

    setKpiName(found ?? kpiName)
  }

  const handleAddKpi = () => {
    handleAdd({
      id: options.find(({ name }) => name === kpiName)?.id ?? -1,
      name: kpiName,
      target,
      weight
    })
    handleClose()
  }

  const handleEditKpi = () => {
    if (editMode) {
      const { evaluationKpi, handleEdit } = editMode
      handleEdit({
        ...evaluationKpi,
        name: kpiName,
        target,
        weight
      })
      handleClose()
    }
  }

  return (
    <Modal
      opened
      centered
      radius={'md'}
      onClose={handleClose}
      title={
        <Title order={5}>
          {!editMode ? CommonConstants.add[locale] : CommonConstants.edit[locale]} Kpi
        </Title>
      }
    >
      <Group direction={'column'}>
        <Autocomplete
          value={kpiName}
          onChange={setKpiName}
          data={
            !kpiName
              ? []
              : options.map((option) => ({
                  ...option,
                  value: option.name
                }))
          }
          error={
            !inError ? undefined : <Text size={'xs'}>{ErrorsConstants.kpis.exists[locale]}</Text>
          }
          onBlur={handleBlur}
          radius={'md'}
          label={CommonConstants.name[locale]}
          maxLength={3000}
          sx={{ width: '100%' }}
        />
        <TextInput
          value={target}
          onChange={({ currentTarget: { value } }) => setTarget(value)}
          radius={'md'}
          label={CommonConstants.target[locale]}
          maxLength={2000}
          sx={{ width: '100%' }}
        />
        <Group sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Text size={'sm'} weight={500}>
            {CommonConstants.weight[locale]}
          </Text>
          <Text size={'xs'} weight={500}>
            {sumWeight + weight - (!editMode ? 0 : editMode.evaluationKpi.weight)}
            /100
          </Text>
        </Group>
        <Slider
          value={
            !isImport &&
            weight > 100 - totalWeight + (!editMode ? 0 : editMode.evaluationKpi.weight)
              ? 100 - totalWeight + (!editMode ? 0 : editMode.evaluationKpi.weight)
              : weight
          }
          onChange={(value) =>
            setWeight(
              !isImport &&
                value > 100 - totalWeight + (!editMode ? 0 : editMode.evaluationKpi.weight)
                ? 100 - totalWeight + (!editMode ? 0 : editMode.evaluationKpi.weight)
                : value
            )
          }
          labelAlwaysOn
          mt={15}
          color={'violet'}
          sx={{ width: '100%' }}
        />
      </Group>
      <Divider mx={-20} my={20} />
      <Group sx={{ justifyContent: 'flex-end' }}>
        <Button variant={'subtle'} color={'red'} onClick={handleClose}>
          {CommonConstants.cancel[locale]}
        </Button>
        <Button disabled={isDisabled || inError} onClick={!editMode ? handleAddKpi : handleEditKpi}>
          {!editMode ? CommonConstants.add[locale] : CommonConstants.confirm[locale]}
        </Button>
      </Group>
    </Modal>
  )
}

export default KpiForm
