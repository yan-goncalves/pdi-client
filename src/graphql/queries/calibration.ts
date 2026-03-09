import { gql } from '@apollo/client'
import { FRAGMENT_CALIBRATION } from '../fragments/calibration'

export const GET_CALIBRATION = gql`
  ${FRAGMENT_CALIBRATION}
  query GetCalibration($idPerformedEvaluation: Int!) {
    calibration(idPerformedEvaluation: $idPerformedEvaluation) {
      ...CalibrationFragment
    }
  }
`

