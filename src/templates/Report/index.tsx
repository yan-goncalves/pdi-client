import EvaluationCardListTemplate from 'templates/EvaluationCardList'
import { EvaluationListTemplateProps } from 'templates/EvaluationList'

const Report = (props: EvaluationListTemplateProps) => {
  return <EvaluationCardListTemplate {...props} />
}

export default Report
