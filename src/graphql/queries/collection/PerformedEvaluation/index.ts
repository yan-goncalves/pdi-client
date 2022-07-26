import { gql } from '@apollo/client'
import { FRAGMENT_PERFORMED_EVALUATION } from 'graphql/fragments'

export const GET_PERFORMED_EVALUATION = gql`
  ${FRAGMENT_PERFORMED_EVALUATION}
  query GetPerformedEvaluation($id: Int!) {
    performedEvaluation: performedEvaluation(id: $id) {
      ...FragmentPerformedEvaluation
    }
  }
`

export const GET_PERFORMED_EVALUATION_RELATION = gql`
  ${FRAGMENT_PERFORMED_EVALUATION}
  query GetPerformedEvaluationByRelation($idEvaluation: Int!, $idUser: Int!) {
    performedEvaluation: performedEvaluationRelation(
      input: { idEvaluation: $idEvaluation, idUser: $idUser }
    ) {
      ...FragmentPerformedEvaluation
    }
  }
`

export const GET_PERFORMED_EVALUATION_GRADE = gql`
  query GetPerformedEvaluationGrade($id: Int!) {
    performedEvaluation: performedEvaluationGrade(id: $id) {
      grade
    }
  }
`
