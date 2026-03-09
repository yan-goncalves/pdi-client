import { PerformedEvaluationType } from "./collection/PerformedEvaluation"
import { UserType } from "./collection/User"


export type Calibration = {
  id: number
  performedEvaluation: PerformedEvaluationType
  originalGrade: number
  calibrationValue: number
  finalGrade: number
  comment: string
  manager: UserType
  createdAt: string
  updatedAt: string
}

export type CreateCalibrationInput = {
  idPerformedEvaluation: number
  calibrationValue: number
  comment: string
}

export type UpdateCalibrationInput = {
  idPerformedEvaluation: number
  calibrationValue: number
  comment: string
}

