import { PerformedEvaluation } from './performed-evaluation'
import { User } from './user'

export type Calibration = {
  id: number
  performedEvaluation: PerformedEvaluation
  originalGrade: number
  calibrationValue: number
  finalGrade: number
  comment: string
  manager: User
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

