import { gql } from '@apollo/client'

export const GET_ALL_EVALUATION_MODEL = gql`
  query GetAllEvaluationModel {
    evaluationModels(sort: "year:desc") {
      year
      period
      finished
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
      id
      year
      period
      finished
      sections {
        id
        title
        visibility
        order_list
        skills {
          id
          title
          description
        }
      }
      goals {
        id
        goal {
          name
        }
        evaluation_goal_kpis {
          id
          kpi {
            name
          }
          target
          weight
        }
      }
      feedbacks {
        id
        order_list
        question
      }
    }
  }
`
