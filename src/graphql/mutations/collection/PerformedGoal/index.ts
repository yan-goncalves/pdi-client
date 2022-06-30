import { gql } from '@apollo/client'

export const CREATE_PERFORMED_GOAL = gql`
  mutation CreatePerformedGoal($idPerformed: Int!, $idGoal: Int!) {
    created: createPerformedGoal(input: { idPerformed: $idPerformed, idGoal: $idGoal }) {
      id
    }
  }
`
