import { useMutation } from '@apollo/client'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import {
  EVALUATION_APPROVAL_PERIOD_LABEL,
  EVALUATION_APPROVAL_STATUS,
  EVALUATION_APPROVAL_TRANSLATIONS
} from 'constants/evaluation-approval'
import { useLocale } from 'contexts/LocaleProvider'
import {
  APPROVE_EVALUATION,
  REJECT_EVALUATION
} from 'graphql/mutations/collection/EvaluationApproval'
import { GET_EVALUATION_APPROVALS } from 'graphql/queries/collection/EvaluationApproval'
import { useState } from 'react'
import { EvaluationApproval } from 'types/evaluation-approval'
import ApprovalEvaluationInfo from './ApprovalEvaluationInfo'

type ApprovalModalProps = {
  approval: EvaluationApproval
  opened: boolean
  onClose: () => void
}

const ApprovalModal = ({ approval, opened, onClose }: ApprovalModalProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')

  const [approveEvaluation, { loading: approveLoading }] = useMutation(APPROVE_EVALUATION, {
    refetchQueries: [
      {
        query: GET_EVALUATION_APPROVALS,
        variables: {
          input: { status: EVALUATION_APPROVAL_STATUS.PENDING }
        }
      },
      {
        query: GET_EVALUATION_APPROVALS,
        variables: {
          input: { status: EVALUATION_APPROVAL_STATUS.APPROVED }
        }
      }
    ]
  })

  const [rejectEvaluation, { loading: rejectLoading }] = useMutation(REJECT_EVALUATION, {
    refetchQueries: [
      {
        query: GET_EVALUATION_APPROVALS,
        variables: {
          input: { status: EVALUATION_APPROVAL_STATUS.PENDING }
        }
      },
      {
        query: GET_EVALUATION_APPROVALS,
        variables: {
          input: { status: EVALUATION_APPROVAL_STATUS.REJECTED }
        }
      }
    ]
  })

  const validateComment = () => {
    if (!comment || comment.trim().length < 10) {
      setCommentError(EVALUATION_APPROVAL_TRANSLATIONS.commentError[locale])
      return false
    }
    setCommentError('')
    return true
  }

  const handleApprove = async () => {
    if (!validateComment()) return

    try {
      await approveEvaluation({
        variables: {
          input: {
            idPerformedEvaluation: approval.performedEvaluation.id,
            period: approval.period,
            comment: comment.trim()
          }
        }
      })

      handleClose()
    } catch (error) {
      showNotification({
        title: EVALUATION_APPROVAL_TRANSLATIONS.error[locale],
        message: EVALUATION_APPROVAL_TRANSLATIONS.approveError[locale],
        color: 'red',
        icon: <IconX />
      })
    }
  }

  const handleReject = async () => {
    if (!validateComment()) return

    try {
      await rejectEvaluation({
        variables: {
          input: {
            idPerformedEvaluation: approval.performedEvaluation.id,
            period: approval.period,
            comment: comment.trim()
          }
        }
      })

      handleClose()
    } catch (error) {
      showNotification({
        title: EVALUATION_APPROVAL_TRANSLATIONS.error[locale],
        message: EVALUATION_APPROVAL_TRANSLATIONS.rejectError[locale],
        color: 'red',
        icon: <IconX />
      })
    }
  }

  const handleClose = () => {
    setComment('')
    setCommentError('')
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text size={!match ? 'lg' : 'md'} weight={600}>
          {EVALUATION_APPROVAL_TRANSLATIONS.modalTitle[locale]}
        </Text>
      }
      size="lg"
      centered
    >
      <Stack spacing="md">
        <Box
          p="md"
          sx={{
            backgroundColor: theme.colors.gray[0],
            borderRadius: theme.radius.md
          }}
        >
          <Group mb="sm">
            <Avatar
              size="lg"
              src={
                approval.performedEvaluation.user.picture
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${approval.performedEvaluation.user.picture}`
                  : FALLBACK_USER_PICTURE
              }
              sx={{ backgroundColor: theme.colors.gray[3] }}
            />
            <Stack spacing={0}>
              <Text size="md" weight={600}>
                {approval.performedEvaluation.user.info.name}{' '}
                {approval.performedEvaluation.user.info.lastname}
              </Text>
              <Text size="sm" color="dimmed">
                @{approval.performedEvaluation.user.username}
              </Text>
              <Text size="sm" color="dimmed">
                {approval.performedEvaluation.user.info.position}
              </Text>
            </Stack>
          </Group>

          <Group spacing="xs">
            <Badge color="blue" variant="filled">
              {EVALUATION_APPROVAL_TRANSLATIONS.year[locale]}{' '}
              {approval.performedEvaluation.evaluation.year}
            </Badge>
            <Badge color="grape" variant="filled">
              {EVALUATION_APPROVAL_PERIOD_LABEL[approval.period][locale]}
            </Badge>
          </Group>

          {approval.performedEvaluation.user.manager && (
            <Text size="sm" color="dimmed" mt="sm">
              {EVALUATION_APPROVAL_TRANSLATIONS.manager[locale]}{' '}
              {approval.performedEvaluation.user.manager.info.name}{' '}
              {approval.performedEvaluation.user.manager.info.lastname}
            </Text>
          )}
        </Box>

        <ApprovalEvaluationInfo performedEvaluation={approval.performedEvaluation} />

        <Textarea
          label={EVALUATION_APPROVAL_TRANSLATIONS.comment[locale]}
          placeholder={EVALUATION_APPROVAL_TRANSLATIONS.commentPlaceholder[locale]}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={commentError}
          minRows={4}
          required
        />

        <Group position="right" spacing="sm">
          <Button variant="subtle" color="gray" onClick={handleClose} disabled={approveLoading || rejectLoading}>
            {EVALUATION_APPROVAL_TRANSLATIONS.cancel[locale]}
          </Button>
          <Button
            variant="light"
            color="red"
            leftIcon={<IconX size={18} />}
            onClick={handleReject}
            loading={rejectLoading}
            disabled={approveLoading}
          >
            {EVALUATION_APPROVAL_TRANSLATIONS.reject[locale]}
          </Button>
          <Button
            variant="filled"
            color="green"
            leftIcon={<IconCheck size={18} />}
            onClick={handleApprove}
            loading={approveLoading}
            disabled={rejectLoading}
          >
            {EVALUATION_APPROVAL_TRANSLATIONS.approve[locale]}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ApprovalModal

