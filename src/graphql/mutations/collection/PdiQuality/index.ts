import { gql } from '@apollo/client'
import { FRAGMENT_PDI_QUALITY } from 'graphql/fragments'

export const CREATE_PDI_QUALITY = gql`
  ${FRAGMENT_PDI_QUALITY}
  mutation CreatePdiQuality($idPerformed: Int!, $category: String!, $description: String!) {
    created: createPdiQuality(
      input: { idPerformed: $idPerformed, category: $category, description: $description }
    ) {
      ...FragmentPdiQuality
    }
  }
`

export const UPDATE_PDI_QUALITY = gql`
  ${FRAGMENT_PDI_QUALITY}
  mutation UpdatePdiQuality($id: Int!, $category: String, $description: String) {
    updated: updatePdiQuality(id: $id, input: { category: $category, description: $description }) {
      ...FragmentPdiQuality
    }
  }
`

export const DELETE_PDI_QUALITY = gql`
  mutation DeletePdiQuality($id: Int!) {
    deleted: removePdiQuality(id: $id) {
      id
    }
  }
`
