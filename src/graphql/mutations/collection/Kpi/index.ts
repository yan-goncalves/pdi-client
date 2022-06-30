import { gql } from '@apollo/client'

export const CREATE_KPI = gql`
  mutation CreateKpi($idGoal: Int!, $name: String!, $target: String!, $weight: Int!) {
    created: createKpi(input: { idGoal: $idGoal, name: $name, target: $target, weight: $weight }) {
      id
      name
      target
      weight
    }
  }
`

export const UPDATE_KPI = gql`
  mutation UpdateKpi($id: Int!, $name: String!, $target: String!, $weight: Int!) {
    updated: updateKpi(id: $id, input: { name: $name, target: $target, weight: $weight }) {
      id
      name
      target
      weight
    }
  }
`

export const DELETE_KPI = gql`
  mutation DeleteKpi($id: Int!) {
    deleted: removeKpi(id: $id) {
      id
    }
  }
`
