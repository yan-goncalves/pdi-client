import { gql } from '@apollo/client'

export const FRAGMENT_CALIBRATION = gql`
  fragment CalibrationFragment on CalibrationModel {
    id
    originalGrade
    calibrationValue
    finalGrade
    comment
    manager {
      id
      username
      info {
        id
        name
        position
      }
    }
    createdAt
    updatedAt
  }
`

