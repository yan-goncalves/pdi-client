import { gql } from '@apollo/client'
import { FRAGMENT_DEPARTMENT_MODEL } from 'graphql/fragments'

export const GetDepartments = gql`
  ${FRAGMENT_DEPARTMENT_MODEL}
  query GetDepartments {
    departments {
      ...FragmentDepartmentModel
    }
  }
`
