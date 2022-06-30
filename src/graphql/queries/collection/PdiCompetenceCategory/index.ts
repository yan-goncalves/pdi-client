import { gql } from '@apollo/client'

export const GET_PDI_COMPETENCE_CATEGORIES = gql`
  query GetPdiCompetenceCategories {
    categories: pdiCompetencesCategories {
      id
      name
    }
  }
`
