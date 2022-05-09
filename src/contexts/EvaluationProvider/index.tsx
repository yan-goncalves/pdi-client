import { EvaluationPeriod } from 'constants/evaluation'
import { User } from 'next-auth'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import useCookie from 'react-use-cookie'
import { EvaluationModelType } from 'types/collection/EvaluationModel'
import { PerformedEvaluationType } from 'types/collection/PerformedEvaluation'
import { UserType } from 'types/collection/User'

export type EvaluationModeType = 'edit' | 'view'

type ContextType = {
  evaluationModel: EvaluationModelType
  setEvaluationModel: Dispatch<SetStateAction<EvaluationModelType>>
  performedEvaluation: PerformedEvaluationType
  setPerformedEvaluation: Dispatch<SetStateAction<PerformedEvaluationType>>
  appraisee: UserType
  setAppraisee: Dispatch<SetStateAction<UserType>>
  mode: EvaluationModeType
  setMode: Dispatch<SetStateAction<EvaluationModeType>>
  periodMode: EvaluationPeriod
  setPeriodMode: Dispatch<SetStateAction<EvaluationPeriod>>
}

const EvaluationContext = createContext<ContextType>({} as ContextType)

type EvaluationProviderProps = {
  children: React.ReactNode
}

const EvaluationProvider = ({ children }: EvaluationProviderProps) => {
  const [evaluationModel, setEvaluationModel] = useState<EvaluationModelType>(
    {} as EvaluationModelType
  )
  const [performedEvaluation, setPerformedEvaluation] = useState<PerformedEvaluationType>(
    {} as PerformedEvaluationType
  )
  const [appraisee, setAppraisee] = useState<UserType>({} as UserType)

  const [mode, setMode] = useCookie('pdi:evaluation-mode') as [
    EvaluationModeType,
    Dispatch<SetStateAction<EvaluationModeType>>
  ]
  const [periodMode, setPeriodMode] = useCookie('pdi:evaluation-period-mode') as [
    EvaluationPeriod,
    Dispatch<SetStateAction<EvaluationPeriod>>
  ]

  return (
    <EvaluationContext.Provider
      value={{
        evaluationModel,
        setEvaluationModel,
        performedEvaluation,
        setPerformedEvaluation,
        appraisee,
        setAppraisee,
        mode,
        setMode,
        periodMode,
        setPeriodMode
      }}
    >
      {children}
    </EvaluationContext.Provider>
  )
}

export const useEvaluation = () => {
  return useContext(EvaluationContext)
}

export default EvaluationProvider
