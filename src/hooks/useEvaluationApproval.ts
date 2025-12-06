import { EVALUATION_APPROVAL_PERIOD, EVALUATION_APPROVAL_STATUS } from 'constants/evaluation-approval'
import { EVALUATION_PERIOD } from 'constants/evaluation'
import { PerformedEvaluationType } from 'types/collection/PerformedEvaluation'

export const useEvaluationApproval = (
  performedEvaluation: PerformedEvaluationType,
  periodMode: EVALUATION_PERIOD
) => {
  if (!performedEvaluation?.approvals) {
    return {
      isApproved: false,
      isPending: false,
      isRejected: false
    }
  }

  const approvalPeriod =
    periodMode === EVALUATION_PERIOD.MID
      ? EVALUATION_APPROVAL_PERIOD.MID
      : EVALUATION_APPROVAL_PERIOD.END

  const approval = performedEvaluation.approvals.find((a) => a.period === approvalPeriod)

  if (!approval) {
    return {
      isApproved: false,
      isPending: false,
      isRejected: false
    }
  }

  return {
    isApproved: approval.status === EVALUATION_APPROVAL_STATUS.APPROVED,
    isPending: approval.status === EVALUATION_APPROVAL_STATUS.PENDING,
    isRejected: approval.status === EVALUATION_APPROVAL_STATUS.REJECTED,
    approval
  }
}

