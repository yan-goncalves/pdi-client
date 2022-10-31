import { gql } from '@apollo/client'

export const FRAGMENT_DEPARTMENT_MODEL = gql`
  fragment FragmentDepartmentModel on DepartmentModel {
    id
    key
    name
  }
`

export const FRAGMENT_INFO_MODEL = gql`
  fragment FragmentInfoModel on UsersInfoModel {
    id
    name
    lastname
    position
    hiringDate
    badge
    costCenter
  }
`

export const FRAGMENT_USER_MODEL = gql`
  ${FRAGMENT_INFO_MODEL}
  ${FRAGMENT_DEPARTMENT_MODEL}
  ${FRAGMENT_INFO_MODEL}
  fragment FragmentUserModel on UserModel {
    id
    info {
      ...FragmentInfoModel
    }
    manager {
      id
      username
      info {
        ...FragmentInfoModel
      }
    }
    department {
      ...FragmentDepartmentModel
    }
    username
    email
    role
    confirmed
    blocked
    picture
  }
`

export const FRAGMENT_QUESTION_MODEL = gql`
  fragment FragmentQuestionModel on QuestionModel {
    id
    ask
  }
`

export const FRAGMENT_SKILL_MODEL = gql`
  fragment FragmentSkillModel on SkillModel {
    id
    title
    description
  }
`

export const FRAGMENT_SECTION_MODEL = gql`
  ${FRAGMENT_QUESTION_MODEL}
  ${FRAGMENT_SKILL_MODEL}
  fragment FragmentSectionModel on SectionModel {
    id
    title
    visibility {
      USER
      MANAGER
      COORDINATOR
      DIRECTOR
    }
    questions {
      ...FragmentQuestionModel
    }
    skills {
      ...FragmentSkillModel
    }
  }
`

export const FRAGMENT_FEEDBACK_MODEL = gql`
  fragment FragmentFeedbackModel on FeedbackModel {
    id
    inquire
  }
`

export const FRAGMENT_EVALUATION_MODEL = gql`
  ${FRAGMENT_SECTION_MODEL}
  ${FRAGMENT_FEEDBACK_MODEL}
  fragment FragmentEvaluationModel on EvaluationModel {
    id
    year
    period
    sections {
      ...FragmentSectionModel
    }
    feedbacks {
      ...FragmentFeedbackModel
    }
  }
`

export const FRAGMENT_PERFORMED_QUESTION = gql`
  ${FRAGMENT_QUESTION_MODEL}
  fragment FragmentPerformedQuestion on PerformedQuestionModel {
    id
    reply
    justification
    question {
      ...FragmentQuestionModel
    }
  }
`

export const FRAGMENT_RATING_MODEL = gql`
  fragment FragmentRatingModel on RatingModel {
    id
    value
    description
  }
`

export const FRAGMENT_PERFORMED_SKILL = gql`
  ${FRAGMENT_SKILL_MODEL}
  ${FRAGMENT_RATING_MODEL}
  fragment FragmentPerformedSkill on PerformedSkillModel {
    id
    skill {
      ...FragmentSkillModel
    }
    ratingUser {
      ...FragmentRatingModel
    }
    ratingManager {
      ...FragmentRatingModel
    }
    midFeedbackManager
    endFeedbackManager
    endFeedbackUser
  }
`

export const FRAGMENT_KPI_MODEL = gql`
  ${FRAGMENT_USER_MODEL}
  fragment FragmentKpiModel on KpiModel {
    id
    name
    target
    weight
    manager {
      ...FragmentUserModel
    }
  }
`

export const FRAGMENT_GOAL_MODEL = gql`
  ${FRAGMENT_USER_MODEL}
  ${FRAGMENT_KPI_MODEL}
  fragment FragmentGoalModel on GoalModel {
    id
    name
    manager {
      ...FragmentUserModel
    }
    user {
      ...FragmentUserModel
    }
    kpis {
      ...FragmentKpiModel
    }
  }
`

export const FRAGMENT_PERFORMED_KPI = gql`
  ${FRAGMENT_KPI_MODEL}
  ${FRAGMENT_RATING_MODEL}
  fragment FragmentPerformedKpi on PerformedGoalKpiModel {
    id
    kpi {
      ...FragmentKpiModel
    }
    ratingManager {
      ...FragmentRatingModel
    }
    achieved
    midFeedbackUser
    midFeedbackUser
    midFeedbackManager
    endFeedbackManager
  }
`

export const FRAGMENT_PERFORMED_GOAL = gql`
  ${FRAGMENT_GOAL_MODEL}
  ${FRAGMENT_PERFORMED_KPI}
  fragment FragmentPerformedGoal on PerformedGoalModel {
    id
    goal {
      ...FragmentGoalModel
    }
    performedKpis {
      ...FragmentPerformedKpi
    }
  }
`

export const FRAGMENT_PERFORMED_FEEDBACK = gql`
  ${FRAGMENT_FEEDBACK_MODEL}
  fragment FragmentPerformedFeedback on PerformedFeedbackModel {
    id
    feedback {
      ...FragmentFeedbackModel
    }
    midReply
    endReply
  }
`

export const FRAGMENT_PDI_COACHING = gql`
  fragment FragmentPdiCoaching on PdiCoachingModel {
    id
    category
    action
  }
`

export const FRAGMENT_PDI_COMPETENCE_CATEGORY = gql`
  fragment FragmentPdiCompetenceCategory on PdiCompetenceCategoryModel {
    id
    name
  }
`

export const FRAGMENT_PDI_COMPETENCE = gql`
  ${FRAGMENT_PDI_COMPETENCE_CATEGORY}
  fragment FragmentPdiCompetence on PdiCompetenceModel {
    id
    category {
      ...FragmentPdiCompetenceCategory
    }
    name
    action
    deadline
  }
`

export const FRAGMENT_PDI_QUALITY = gql`
  fragment FragmentPdiQuality on PdiQualityModel {
    id
    category
    description
  }
`

export const FRAGMENT_PERFORMED_EVALUATION = gql`
  ${FRAGMENT_PERFORMED_QUESTION}
  ${FRAGMENT_PERFORMED_SKILL}
  ${FRAGMENT_PERFORMED_GOAL}
  ${FRAGMENT_PERFORMED_FEEDBACK}
  ${FRAGMENT_PDI_COACHING}
  ${FRAGMENT_PDI_COMPETENCE}
  ${FRAGMENT_PDI_QUALITY}
  fragment FragmentPerformedEvaluation on PerformedEvaluationModel {
    id
    grade
    midFinished
    endFinished
    questions {
      ...FragmentPerformedQuestion
    }
    skills {
      ...FragmentPerformedSkill
    }
    goals {
      ...FragmentPerformedGoal
    }
    feedbacks {
      ...FragmentPerformedFeedback
    }
    pdiCoaching {
      ...FragmentPdiCoaching
    }
    pdiCompetence {
      ...FragmentPdiCompetence
    }
    pdiQuality {
      ...FragmentPdiQuality
    }
  }
`

export const FRAGMENT_EVALUATION_RESULT_CONCEPT = gql`
  fragment FragmentEvaluationResultConcept on EvaluationResultConceptModel {
    id
    concept
    description
    color
    min
    max
  }
`
