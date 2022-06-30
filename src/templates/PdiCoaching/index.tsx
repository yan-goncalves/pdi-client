import { useMutation } from '@apollo/client'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { CREATE_PDI_COACHING, UPDATE_PDI_COACHING } from 'graphql/mutations/collection/PdiCoaching'
import { useEffect, useState } from 'react'
import {
  CreatePdiCoachingType,
  PdiCoachingType,
  UpdatePdiCoachingType
} from 'types/collection/PdiCoaching'

export type PdiCoachingProps = {
  pdi?: PdiCoachingType[]
}

const PdiCoaching = ({ pdi }: PdiCoachingProps) => {
  const { performedEvaluation, setPerformedEvaluation } = useEvaluation()
  const [pdiCoachings, setPdiCoachings] = useState<PdiCoachingType[]>([])

  const [create] = useMutation<CreatePdiCoachingType>(CREATE_PDI_COACHING, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED QUESTION', { ...e })
  })
  const [update] = useMutation<UpdatePdiCoachingType>(UPDATE_PDI_COACHING, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED QUESTION', { ...e })
  })

  useEffect(() => {
    if (pdi) {
      setPdiCoachings(pdi)
    }
  }, [pdi])

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
  }

  return (
    <div>
      PDI COACHING
      {pdiCoachings.map((pdiCoaching) => (
        <div key={pdiCoaching.id}>{pdiCoaching.action}</div>
      ))}
    </div>
  )
}

export default PdiCoaching
