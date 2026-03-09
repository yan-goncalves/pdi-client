import { gql } from '@apollo/client'
import { FRAGMENT_CALIBRATION } from '../fragments/calibration'

export const CREATE_CALIBRATION = gql`
  ${FRAGMENT_CALIBRATION}
  mutation CreateCalibration($input: CreateCalibrationInput!) {
    createCalibration(input: $input) {
      ...CalibrationFragment
    }
  }
`

export const UPDATE_CALIBRATION = gql`
  ${FRAGMENT_CALIBRATION}
  mutation UpdateCalibration($input: UpdateCalibrationInput!) {
    updateCalibration(input: $input) {
      ...CalibrationFragment
    }
  }
`

export const DELETE_CALIBRATION = gql`
  mutation DeleteCalibration($idPerformedEvaluation: Int!) {
    deleteCalibration(idPerformedEvaluation: $idPerformedEvaluation)
  }
`

