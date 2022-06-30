import { useMutation } from '@apollo/client'
import { useEvaluation } from 'contexts/EvaluationProvider'
import {
  CREATE_PDI_COMPETENCE,
  UPDATE_PDI_COMPETENCE
} from 'graphql/mutations/collection/PdiCompetence'
import { useEffect, useState } from 'react'
import {
  CreatePdiCompetenceType,
  PdiCompetenceType,
  UpdatePdiCompetenceType
} from 'types/collection/PdiCompetence'

export type PdiCompetenceProps = {
  pdi?: PdiCompetenceType[]
}

const PdiCompetence = ({ pdi }: PdiCompetenceProps) => {
  const { performedEvaluation, setPerformedEvaluation } = useEvaluation()
  const [pdiCompetences, setPdiCompetences] = useState<PdiCompetenceType[]>([])

  const [create] = useMutation<CreatePdiCompetenceType>(CREATE_PDI_COMPETENCE, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED QUESTION', { ...e })
  })
  const [update] = useMutation<UpdatePdiCompetenceType>(UPDATE_PDI_COMPETENCE, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED QUESTION', { ...e })
  })

  useEffect(() => {
    if (pdi) {
      setPdiCompetences(pdi)
    }
  }, [pdi])

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

  return (
    <div>
      PDI COMPETENCE
      {pdiCompetences.map((pdiCompetence) => (
        <div key={pdiCompetence.id}>{pdiCompetence.action}</div>
      ))}
    </div>
  )
}

export default PdiCompetence
