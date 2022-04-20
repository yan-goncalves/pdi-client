import { gql } from '@apollo/client'

export const GET_ALL_EVALUATION_MODEL = gql`
  query GetAllEvaluationModel {
    evaluationModels(sort: "year:desc") {
      data {
        attributes {
          year
          period
          finished
        }
      }
    }
  }
`

export const GET_EVALUATION_MODEL = gql`
  query GetEvaluationModel($year: String, $locale: I18NLocaleCode) {
    evaluationModels(
      filters: { year: { eq: $year } }
      locale: $locale
      sort: ["sections.order_list"]
    ) {
      data {
        id
        attributes {
          year
          period
          finished
          sections {
            data {
              id
              attributes {
                title
                visibility
                order_list
                skills {
                  data {
                    id
                    attributes {
                      title
                      description
                    }
                  }
                }
              }
            }
          }
          feedbacks {
            data {
              id
              attributes {
                order_list
                question
              }
            }
          }
        }
      }
    }
  }
`
