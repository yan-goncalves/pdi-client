import { gql } from '@apollo/client'
import { FRAGMENT_EVALUATION_RESULT_CONCEPT } from 'graphql/fragments'

export const GET_EVALUATION_RESULT_CONCEPTS = gql`
  ${FRAGMENT_EVALUATION_RESULT_CONCEPT}

  query GetEvaluationResultConcepts {
    concepts: evaluationResultConcepts {
      ...FragmentEvaluationResultConcept
    }
  }
`
