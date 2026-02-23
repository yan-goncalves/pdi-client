import { useQuery } from '@apollo/client'
import { Box, Group, Tabs, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCheck, IconClock, IconX } from '@tabler/icons'
import ContentBase from 'components/ContentBase'
import LoadingOverlay from 'components/LoadingOverlay'
import {
  EVALUATION_APPROVAL_STATUS,
  EVALUATION_APPROVAL_TRANSLATIONS
} from 'constants/evaluation-approval'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_EVALUATION_APPROVALS } from 'graphql/queries/collection/EvaluationApproval'
import { useState } from 'react'
import { EvaluationApproval } from 'types/evaluation-approval'
import ApprovalsList from './ApprovalsList'
import { useStyles } from './styles'

const HRApprovalsTemplate = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const { locale } = useLocale()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
  const [activeTab, setActiveTab] = useState(0)

  const { data: pendingData, loading: pendingLoading } = useQuery<{
    evaluationApprovals: EvaluationApproval[]
  }>(GET_EVALUATION_APPROVALS, {
    variables: {
      input: {
        status: EVALUATION_APPROVAL_STATUS.PENDING
      }
    }
  })

  const { data: approvedData, loading: approvedLoading } = useQuery<{
    evaluationApprovals: EvaluationApproval[]
  }>(GET_EVALUATION_APPROVALS, {
    variables: {
      input: {
        status: EVALUATION_APPROVAL_STATUS.APPROVED
      }
    }
  })

  const { data: rejectedData, loading: rejectedLoading } = useQuery<{
    evaluationApprovals: EvaluationApproval[]
  }>(GET_EVALUATION_APPROVALS, {
    variables: {
      input: {
        status: EVALUATION_APPROVAL_STATUS.REJECTED
      }
    }
  })

  const isLoading = pendingLoading || approvedLoading || rejectedLoading

  return (
    <ContentBase
      title={
        <Title p={20} order={!match ? 3 : 6}>
          {EVALUATION_APPROVAL_TRANSLATIONS.pageTitle[locale]}
        </Title>
      }
    >
      {isLoading && <LoadingOverlay />}
      <Box p={20}>
        <Tabs
          active={activeTab}
          onTabChange={setActiveTab}
          grow
          color={'blue'}
          position={'center'}
          variant={'unstyled'}
          classNames={{ tabControl: classes.tabControl, tabActive: classes.tabActive }}
          sx={{
            border: `1px solid ${theme.colors.gray[3]}`,
            borderRadius: theme.radius.lg
          }}
        >
          <Tabs.Tab
            label={
              <Group spacing={8}>
                <IconClock size={18} />
                <Text size={!match ? 'md' : 'sm'}>
                  {EVALUATION_APPROVAL_TRANSLATIONS.tabs.pending[locale]}
                </Text>
                {pendingData?.evaluationApprovals && (
                  <Text size={!match ? 'md' : 'sm'} weight={700}>
                    ({pendingData.evaluationApprovals.length})
                  </Text>
                )}
              </Group>
            }
          >
            <ApprovalsList
              approvals={pendingData?.evaluationApprovals || []}
              status={EVALUATION_APPROVAL_STATUS.PENDING}
              isLoading={pendingLoading}
            />
          </Tabs.Tab>

          <Tabs.Tab
            label={
              <Group spacing={8}>
                <IconCheck size={18} />
                <Text size={!match ? 'md' : 'sm'}>
                  {EVALUATION_APPROVAL_TRANSLATIONS.tabs.approved[locale]}
                </Text>
                {approvedData?.evaluationApprovals && (
                  <Text size={!match ? 'md' : 'sm'} weight={700}>
                    ({approvedData.evaluationApprovals.length})
                  </Text>
                )}
              </Group>
            }
          >
            <ApprovalsList
              approvals={approvedData?.evaluationApprovals || []}
              status={EVALUATION_APPROVAL_STATUS.APPROVED}
              isLoading={approvedLoading}
            />
          </Tabs.Tab>

          <Tabs.Tab
            label={
              <Group spacing={8}>
                <IconX size={18} />
                <Text size={!match ? 'md' : 'sm'}>
                  {EVALUATION_APPROVAL_TRANSLATIONS.tabs.rejected[locale]}
                </Text>
                {rejectedData?.evaluationApprovals && (
                  <Text size={!match ? 'md' : 'sm'} weight={700}>
                    ({rejectedData.evaluationApprovals.length})
                  </Text>
                )}
              </Group>
            }
          >
            <ApprovalsList
              approvals={rejectedData?.evaluationApprovals || []}
              status={EVALUATION_APPROVAL_STATUS.REJECTED}
              isLoading={rejectedLoading}
            />
          </Tabs.Tab>
        </Tabs>
      </Box>
    </ContentBase>
  )
}

export default HRApprovalsTemplate

