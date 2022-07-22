import { gql } from '@apollo/client'
import { FRAGMENT_PDI_COMPETENCE } from 'graphql/fragments'

export const CREATE_PDI_COMPETENCE = gql`
  ${FRAGMENT_PDI_COMPETENCE}
  mutation CreatePdiCompetence(
    $idPerformed: Int!
    $idCategory: Int!
    $name: String!
    $action: String!
    $deadline: DateTime!
  ) {
    created: createPdiCompetence(
      input: {
        idPerformed: $idPerformed
        idCategory: $idCategory
        name: $name
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
  mutation UpdatePdiCompetence(
    $id: Int!
    $idCategory: Int
    $name: String
    $action: String
    $deadline: DateTime
  ) {
    updated: updatePdiCompetence(
      id: $id
      input: { idCategory: $idCategory, name: $name, action: $action, deadline: $deadline }
    ) {
      ...FragmentPdiCompetence
    }
  }
`

export const DELETE_PDI_COMPETENCE = gql`
  mutation DeletePdiCompetence($id: Int!) {
    deleted: removePdiCompetence(id: $id) {
      id
    }
  }
`
