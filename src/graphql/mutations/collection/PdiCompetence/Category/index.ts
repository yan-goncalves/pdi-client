import { gql } from '@apollo/client'
import { FRAGMENT_PDI_COMPETENCE_CATEGORY } from 'graphql/fragments'

export const CREATE_PDI_COMPETENCE_CATEGORY = gql`
  ${FRAGMENT_PDI_COMPETENCE_CATEGORY}
  mutation CreatePdiCompetenceCategory($name: String!) {
    created: createPdiCompetenceCategory(input: { name: $name }) {
      ...FragmentPdiCompetenceCategory
    }
  }
`

export const DELETE_PDI_COMPETENCE_CATEGORY = gql`
  mutation DeletePdiCompetenceCategory($id: Int!) {
    deleted: removePdiCompetenceCategory(id: $id) {
      id
    }
  }
`
