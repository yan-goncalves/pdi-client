import { gql } from '@apollo/client'
import { FRAGMENT_PERFORMED_GOAL } from 'graphql/fragments'

export const GET_PERFORMED_GOAL = gql`
  ${FRAGMENT_PERFORMED_GOAL}
  query GetPerformedGoal($idPerformed: Int!, $idGoal: Int!) {
    performed: performedGoalByRelation(input: { idPerformed: $idPerformed, idGoal: $idGoal }) {
      ...FragmentPerformedGoal
    }
  }
`
