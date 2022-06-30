import { EVALUATION_PERIOD } from 'constants/evaluation'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import useCookie from 'react-use-cookie'
import { EvaluationModelType } from 'types/collection/EvaluationModel'
import { PerformedEvaluationType } from 'types/collection/PerformedEvaluation'
import { RatingType } from 'types/collection/Rating'
import { UserType } from 'types/collection/User'

export enum EVALUATION_MODE {
  EDIT = 'edit',
  VIEW = 'view'
}

export enum EVALUATION_ACTOR {
  USER = 'user',
  MANAGER = 'manager'
}

type ContextType = {
  evaluationModel: EvaluationModelType
  setEvaluationModel: Dispatch<SetStateAction<EvaluationModelType>>
  performedEvaluation: PerformedEvaluationType
  setPerformedEvaluation: Dispatch<SetStateAction<PerformedEvaluationType>>
  ratings: RatingType[]
  setRatings: Dispatch<SetStateAction<RatingType[]>>
  appraisee: UserType
  setAppraisee: Dispatch<SetStateAction<UserType>>
  mode: EVALUATION_MODE
  setMode: Dispatch<SetStateAction<EVALUATION_MODE>>
  periodMode: EVALUATION_PERIOD
  setPeriodMode: Dispatch<SetStateAction<EVALUATION_PERIOD>>
  isLocaleLoading: boolean
  setIsLocaleLoading: Dispatch<SetStateAction<boolean>>
  isSaving: boolean
  setIsSaving: Dispatch<SetStateAction<boolean>>
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
  const [ratings, setRatings] = useState<RatingType[]>([])
  const [appraisee, setAppraisee] = useState<UserType>({} as UserType)

  const [mode, setMode] = useCookie('pdi:evaluation-mode') as [
    EVALUATION_MODE,
    Dispatch<SetStateAction<EVALUATION_MODE>>
  ]
  const [periodMode, setPeriodMode] = useCookie('pdi:evaluation-period-mode') as [
    EVALUATION_PERIOD,
    Dispatch<SetStateAction<EVALUATION_PERIOD>>
  ]
  const [isLocaleLoading, setIsLocaleLoading] = useState<boolean>(false) as [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ]
  const [isSaving, setIsSaving] = useState<boolean>(false) as [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ]

  return (
    <EvaluationContext.Provider
      value={{
        evaluationModel,
        setEvaluationModel,
        performedEvaluation,
        setPerformedEvaluation,
        ratings,
        setRatings,
        appraisee,
        setAppraisee,
        mode,
        setMode,
        periodMode,
        setPeriodMode,
        isLocaleLoading,
        setIsLocaleLoading,
        isSaving,
        setIsSaving
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
