import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme
} from '@mantine/core'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'
import { IconCalendar, IconSearch, IconUser } from '@tabler/icons'
import Accordion from 'components/Accordion'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import {
  EVALUATION_APPROVAL_PERIOD,
  EVALUATION_APPROVAL_PERIOD_LABEL,
  EVALUATION_APPROVAL_STATUS,
  EVALUATION_APPROVAL_STATUS_LABEL,
  EVALUATION_APPROVAL_TRANSLATIONS
} from 'constants/evaluation-approval'
import { useLocale } from 'contexts/LocaleProvider'
import { useMemo, useState } from 'react'
import { EvaluationApproval } from 'types/evaluation-approval'
import ApprovalModal from './ApprovalModal'

type ApprovalsListProps = {
  approvals: EvaluationApproval[]
  status: EVALUATION_APPROVAL_STATUS
}

type GroupedApprovals = {
  userId: number
  userName: string
  userPicture: string
  userPosition: string
  userUsername: string
  approvals: EvaluationApproval[]
}

const ITEMS_PER_PAGE = 10

const ApprovalsList = ({ approvals, status }: ApprovalsListProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
  const [selectedApproval, setSelectedApproval] = useState<EvaluationApproval | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleOpenModal = (approval: EvaluationApproval) => {
    setSelectedApproval(approval)
    setModalOpened(true)
  }

  const handleCloseModal = () => {
    setModalOpened(false)
    setSelectedApproval(null)
  }

  const getStatusColor = (status: EVALUATION_APPROVAL_STATUS) => {
    switch (status) {
      case EVALUATION_APPROVAL_STATUS.PENDING:
        return 'yellow'
      case EVALUATION_APPROVAL_STATUS.APPROVED:
        return 'green'
      case EVALUATION_APPROVAL_STATUS.REJECTED:
        return 'red'
      default:
        return 'gray'
    }
  }

  // Group approvals by user
  const groupedApprovals = useMemo(() => {
    const groups = new Map<number, GroupedApprovals>()

    approvals.forEach((approval) => {
      const userId = approval.performedEvaluation.user.id
      if (!groups.has(userId)) {
        groups.set(userId, {
          userId,
          userName: `${approval.performedEvaluation.user.info.name} ${approval.performedEvaluation.user.info.lastname}`,
          userPicture: approval.performedEvaluation.user.picture || '',
          userPosition: approval.performedEvaluation.user.info.position || '',
          userUsername: approval.performedEvaluation.user.username,
          approvals: []
        })
      }
      groups.get(userId)!.approvals.push(approval)
    })

    // Sort approvals within each group by year DESC, then period
    groups.forEach((group) => {
      group.approvals.sort((a, b) => {
        const yearDiff = b.performedEvaluation.evaluation.year - a.performedEvaluation.evaluation.year
        if (yearDiff !== 0) return yearDiff
        return a.period === EVALUATION_APPROVAL_PERIOD.MID ? -1 : 1
      })
    })

    return Array.from(groups.values()).sort((a, b) => a.userName.localeCompare(b.userName))
  }, [approvals])

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    approvals.forEach((approval) => {
      years.add(approval.performedEvaluation.evaluation.year)
    })
    return Array.from(years)
      .sort((a, b) => b - a)
      .map((year) => ({ value: year.toString(), label: year.toString() }))
  }, [approvals])

  // Filter grouped approvals
  const filteredGroups = useMemo(() => {
    let filtered = groupedApprovals

    // Filter by search
    if (debouncedSearch) {
      filtered = filtered.filter((group) =>
        group.userName.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Filter by year or period
    if (selectedYear || selectedPeriod) {
      filtered = filtered
        .map((group) => ({
          ...group,
          approvals: group.approvals.filter((approval) => {
            const yearMatch = !selectedYear || approval.performedEvaluation.evaluation.year.toString() === selectedYear
            const periodMatch = !selectedPeriod || approval.period === selectedPeriod
            return yearMatch && periodMatch
          })
        }))
        .filter((group) => group.approvals.length > 0)
    }

    return filtered
  }, [groupedApprovals, debouncedSearch, selectedYear, selectedPeriod])

  // Paginate
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE)
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredGroups.slice(start, end)
  }, [filteredGroups, currentPage])

  const getManagerFormattedName = (manager: { name: string; lastname: string }) => {
    return `${manager.name} ${manager.lastname}`
  }

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedYear, selectedPeriod])

  if (approvals.length === 0) {
    return (
      <Box p={40}>
        <Text align="center" color="dimmed" size={!match ? 'lg' : 'md'}>
          {EVALUATION_APPROVAL_TRANSLATIONS.noEvaluations[locale]}
        </Text>
      </Box>
    )
  }

  return (
    <>
      {/* Filters */}
      <Box p={20} pb={0}>
        <Grid gutter="md">
          <Grid.Col span={match ? 12 : 6}>
            <TextInput
              placeholder={EVALUATION_APPROVAL_TRANSLATIONS.searchPlaceholder[locale]}
              icon={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={match ? 6 : 3}>
            <Select
              placeholder={EVALUATION_APPROVAL_TRANSLATIONS.filterByYear[locale]}
              data={availableYears}
              value={selectedYear}
              onChange={setSelectedYear}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={match ? 6 : 3}>
            <Select
              placeholder={EVALUATION_APPROVAL_TRANSLATIONS.filterByPeriod[locale]}
              data={[
                { value: EVALUATION_APPROVAL_PERIOD.MID, label: EVALUATION_APPROVAL_PERIOD_LABEL[EVALUATION_APPROVAL_PERIOD.MID][locale] },
                { value: EVALUATION_APPROVAL_PERIOD.END, label: EVALUATION_APPROVAL_PERIOD_LABEL[EVALUATION_APPROVAL_PERIOD.END][locale] }
              ]}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              clearable
            />
          </Grid.Col>
        </Grid>

        {/* Results count */}
        <Text size="sm" color="dimmed" mt="md">
          {`${filteredGroups.length} ${filteredGroups.length !== 1
            ? EVALUATION_APPROVAL_TRANSLATIONS.employeesFoundPlural[locale]
            : EVALUATION_APPROVAL_TRANSLATIONS.employeesFound[locale]
            } ${filteredGroups.length !== 1
              ? EVALUATION_APPROVAL_TRANSLATIONS.foundPlural[locale]
              : EVALUATION_APPROVAL_TRANSLATIONS.found[locale]
            }`}
        </Text>
      </Box>

      {/* Grouped List */}
      <Box p={20}>
        {filteredGroups.length === 0 ? (
          <Box p={40}>
            <Text align="center" color="dimmed" size={!match ? 'lg' : 'md'}>
              {EVALUATION_APPROVAL_TRANSLATIONS.noResultsFound[locale]}
            </Text>
          </Box>
        ) : (
          <Accordion>
            {paginatedGroups.map((group) => (
              <Accordion.Item
                key={group.userId}
                m={10}
                label={
                  <Group>
                    <Avatar
                      size="md"
                      src={
                        group.userPicture
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${group.userPicture}`
                          : FALLBACK_USER_PICTURE
                      }
                      sx={{ backgroundColor: theme.colors.gray[3] }}
                    />
                    <Stack spacing={0}>
                      <Text weight={600}>{group.userName}</Text>
                      <Text size="xs" color="dimmed">
                        @{group.userUsername} • {group.userPosition}
                      </Text>
                    </Stack>
                    <Badge ml="auto" color="blue" variant="filled">
                      {group.approvals.length} {EVALUATION_APPROVAL_TRANSLATIONS.evaluations[locale]}
                    </Badge>
                  </Group>
                }
              >
                <Grid>
                  {group.approvals.map((approval) => (
                    <Grid.Col span={3} key={approval.id}>
                      <Card key={approval.id} shadow="sm" p="md" withBorder>
                        <Stack spacing="sm">
                          <Group position="apart">
                            <Group spacing="xs">
                              <Badge color="blue" variant="filled">
                                {EVALUATION_APPROVAL_TRANSLATIONS.year[locale]}{' '}
                                {approval.performedEvaluation.evaluation.year}
                              </Badge>
                              <Badge color="grape" variant="filled">
                                {EVALUATION_APPROVAL_PERIOD_LABEL[approval.period][locale]}
                              </Badge>
                            </Group>
                            <Badge color={getStatusColor(approval.status)} variant="light">
                              {EVALUATION_APPROVAL_STATUS_LABEL[approval.status][locale]}
                            </Badge>
                          </Group>

                          {approval.performedEvaluation.user.manager?.info && (
                            <Group spacing={8}>
                              <IconUser size={16} color={theme.colors.gray[6]} />
                              <Text size="xs" color="dimmed">
                                {EVALUATION_APPROVAL_TRANSLATIONS.manager[locale]}{' '}
                                {getManagerFormattedName(approval.performedEvaluation.user.manager.info)}
                              </Text>
                            </Group>
                          )}

                          {status === EVALUATION_APPROVAL_STATUS.PENDING && (
                            <Button
                              fullWidth
                              variant="light"
                              color="blue"
                              onClick={() => handleOpenModal(approval)}
                            >
                              {EVALUATION_APPROVAL_TRANSLATIONS.analyze[locale]}
                            </Button>
                          )}

                          {status !== EVALUATION_APPROVAL_STATUS.PENDING && approval.comment && (
                            <Box
                              p="sm"
                              sx={{
                                backgroundColor: theme.colors.gray[0],
                                borderRadius: theme.radius.sm
                              }}
                            >
                              <Text size="xs" weight={600} mb={4}>
                                {EVALUATION_APPROVAL_TRANSLATIONS.comment[locale]}:
                              </Text>
                              <Text size="xs" color="dimmed">
                                {approval.comment}
                              </Text>
                            </Box>
                          )}
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Accordion.Item>
            ))}
          </Accordion>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Group position="center" mt="xl">
            <Pagination page={currentPage} onChange={setCurrentPage} total={totalPages} />
          </Group>
        )}
      </Box>

      {/* Modal */}
      {selectedApproval && (
        <ApprovalModal approval={selectedApproval} opened={modalOpened} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default ApprovalsList

