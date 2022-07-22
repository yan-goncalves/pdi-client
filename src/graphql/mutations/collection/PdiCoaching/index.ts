import { gql } from '@apollo/client'
import { FRAGMENT_PDI_COACHING } from 'graphql/fragments'

export const CREATE_PDI_COACHING = gql`
  ${FRAGMENT_PDI_COACHING}
  mutation CreatePdiCoaching($idPerformed: Int!, $category: String!, $action: String!) {
    created: createPdiCoaching(
      input: { idPerformed: $idPerformed, category: $category, action: $action }
    ) {
      ...FragmentPdiCoaching
    }
  }
`

export const UPDATE_PDI_COACHING = gql`
  ${FRAGMENT_PDI_COACHING}
  mutation UpdatePdiCoaching($id: Int!, $category: String, $action: String) {
    updated: updatePdiCoaching(id: $id, input: { category: $category, action: $action }) {
      ...FragmentPdiCoaching
    }
  }
`

export const DELETE_PDI_COACHING = gql`
  mutation UpdatePdiCoaching($id: Int!) {
    deleted: removePdiCoaching(id: $id) {
      id
    }
  }
`
