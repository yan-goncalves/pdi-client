import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import useCookie from 'react-use-cookie'
import { EvaluationModelType } from 'types/queries/collection/EvaluationModel'

type EvaluationModeType = 'edit' | 'view'

type ContextType = {
  evaluationModel: EvaluationModelType
  setEvaluationModel: Dispatch<SetStateAction<EvaluationModelType>>
  mode: 'edit' | 'view'
  setMode: Dispatch<SetStateAction<EvaluationModeType>>
}

const EvaluationContext = createContext<ContextType>({} as ContextType)

type EvaluationProviderProps = {
  children: React.ReactNode
}

const EvaluationProvider = ({ children }: EvaluationProviderProps) => {
  const [evaluationModel, setEvaluationModel] = useState<EvaluationModelType>(
    {} as EvaluationModelType
  )
  const [mode, setMode] = useCookie('pdi:evaluation-mode') as [
    EvaluationModeType,
    Dispatch<SetStateAction<EvaluationModeType>>
  ]

  return (
    <EvaluationContext.Provider
      value={{ mode, setMode, evaluationModel, setEvaluationModel }}
    >
      {children}
    </EvaluationContext.Provider>
  )
}

export const useEvaluation = () => {
  return useContext(EvaluationContext)
}
export default EvaluationProvider
