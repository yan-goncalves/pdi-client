import { gql } from '@apollo/client'
import { FRAGMENT_PDI_COMPETENCE } from 'graphql/fragments'

export const CREATE_PDI_COMPETENCE = gql`
  ${FRAGMENT_PDI_COMPETENCE}
  mutation CreatePdiCompetence(
    $idPerformed: Int!
    $idCategory: Int!
    $action: String!
    $deadline: DateTime!
  ) {
    created: createPdiCompetence(
      input: {
        idPerformed: $idPerformed
        idCategory: $idCategory
        action: $action
        deadline: $deadline
      }
    ) {
      ...FragmentPdiCompetence
    }
  }
`

export const UPDATE_PDI_COMPETENCE = gql`
  ${FRAGMENT_PDI_COMPETENCE}
  mutation UpdatePdiCompetence($id: Int!, $action: String!, $deadline: DateTime!) {
    updated: updatePdiCompetence(
      id: $id
      input: {
        idPerformed: $idPerformed
        idCategory: $idCategory
        action: $action
        deadline: $deadline
      }
    ) {
      ...FragmentPdiCompetence
    }
  }
`
