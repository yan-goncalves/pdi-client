import { gql } from '@apollo/client'

export const CREATE_GOAL = gql`
  mutation CreateGoal($idEvaluation: Int!, $idUser: Int!, $name: String!) {
    created: createGoal(input: { idEvaluation: $idEvaluation, idUser: $idUser, name: $name }) {
      id
      name
    }
  }
`

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($id: Int!, $name: String!) {
    updated: updateGoal(id: $id, input: { name: $name }) {
      id
      name
    }
  }
`

export const DELETE_GOAL = gql`
  mutation DeleteGoal($id: Int!) {
    deleted: removeGoal(id: $id) {
      id
    }
  }
`
