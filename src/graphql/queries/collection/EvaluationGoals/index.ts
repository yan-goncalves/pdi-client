import { gql } from '@apollo/client'

export const GET_EVALUATION_GOALS = gql`
  query GET_EVALUATION_GOALS($year: String!, $manager: String!) {
    evaluationGoals(
      filters: {
        evaluation: { year: { eq: $year } }
        goal: { manager: { username: { eq: $manager } } }
      }
    ) {
      data {
        attributes {
          user {
            data {
              attributes {
                username
              }
            }
          }
          goal {
            data {
              attributes {
                name
              }
            }
          }
          kpis {
            data {
              attributes {
                kpi {
                  data {
                    attributes {
                      name
                    }
                  }
                }
                target
                weight
              }
            }
          }
        }
      }
    }
  }
`
