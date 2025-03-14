import {
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  TextInput,
  Title,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery, useWindowScroll } from '@mantine/hooks'
import { SortDescriptor, Table, User, useAsyncList, useCollator } from '@nextui-org/react'
import { IconCheck, IconFileDownload, IconSearch, IconX } from '@tabler/icons'
import ContentBase from 'components/ContentBase'
import LoadingOverlay from 'components/LoadingOverlay'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { CommonConstants } from 'constants/common'
import { ReportConstants } from 'constants/report'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import FileSaver from 'file-saver'
import React, { useCallback, useMemo, useState } from 'react'
import { GoalType } from 'types/collection/Goal'
import { UserType } from 'types/collection/User'
import { useStyles } from './styles'

export type ReportUserListProps = {
  users: UserType[]
  year: number
  usersGoals?: {
    [key: number]: GoalType[]
  }
}

const ReportUserListTemplate = ({ users, year, usersGoals }: ReportUserListProps) => {
  const theme = useMantineTheme()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)
  const [scroll] = useWindowScroll()
  const top = !match ? 50 : 0
  const { classes } = useStyles({ top, scroll: scroll.y > top })
  const { locale } = useLocale()
  const { evaluationModel } = useEvaluation()
  const collator = useCollator({ numeric: true })
  const [selectedKeys, setSelectedKeys] = useState<Set<number> | 'all'>(new Set())
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [generating, setGenerating] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const [inError, setInError] = useState<boolean>(false)
  const [UUID, setUUID] = useState<string>()
  const [search, setSearch] = useState<string>('')

  const filteredUsers = useMemo(() => {
    if (search.length === 0) {
      return users
    }

    return users.filter(({ username, info }) => {
      return (
        username.toLowerCase().includes(search.toLowerCase()) ||
        `${info?.name} ${info?.lastname}`.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [search, users])

  const renderCell = useCallback(
    (user: UserType, columnKey: React.Key) => {
      switch (columnKey) {
        case 'name':
          return (
            <User
              squared
              src={
                !user?.picture
                  ? FALLBACK_USER_PICTURE
                  : `${process.env.NEXT_PUBLIC_API_URL}/${user.picture}`
              }
              name={`${user?.info?.name} ${user?.info?.lastname}`}
              css={{
                p: 0,
                '.nextui-user-avatar': {
                  border: `1px solid ${theme.colors.gray[3]} !important`
                }
              }}
            >
              {user.username}
            </User>
          )

        case 'department':
          return user.department.name

        default:
          return !user.manager?.info
            ? user.manager?.username
              ? user.manager?.username
              : '-'
            : `${user.manager.info.name} ${user.manager.info.lastname}`
      }
    },
    [theme.colors.gray]
  )

  const getColumnField = useCallback((user: UserType, column: React.Key) => {
    switch (column) {
      case 'name':
        return user.info.name
      case 'department':
        return user.department.name
      default:
        return !user.manager?.info
          ? user.manager?.username
            ? user.manager?.username
            : '-'
          : `${user.manager.info.name} ${user.manager.info.lastname}`
    }
  }, [])

  const sort = useCallback(
    ({ sortDescriptor }: { sortDescriptor: SortDescriptor }) => {
      return {
        items: filteredUsers.sort((userA, userB) => {
          if (sortDescriptor.column) {
            const first = getColumnField(userA, sortDescriptor.column)
            const second = getColumnField(userB, sortDescriptor.column)
            let cmp = collator.compare(first, second)
            if (sortDescriptor.direction === 'descending') {
              cmp *= -1
            }
            return cmp
          }

          return 0
        })
      }
    },
    [collator, filteredUsers, getColumnField]
  )

  const list = useAsyncList({ load: async () => ({ items: filteredUsers }), sort })

  const handleReport = useCallback(async () => {
    setOpenModal(true)
    setGenerating(true)
    const selected =
      selectedKeys === 'all' ? filteredUsers : filteredUsers.filter((u) => selectedKeys?.has(u.id))

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        users: selected,
        evaluation: evaluationModel,
        usersEvaluationGoals: usersGoals
      })
    })

    if (response.status >= 300) {
      setInError(true)
      return
    }

    const { uuid } = await response.json()
    setUUID(uuid)
    setGenerating(false)
    setReady(true)
  }, [evaluationModel, filteredUsers, selectedKeys, usersGoals])

  const handleDownload = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${UUID}`)
    const blob = await response.blob()

    FileSaver.saveAs(blob, `report_${evaluationModel.year}.xlsx`)
  }, [UUID, evaluationModel.year])

  const handleClose = useCallback(async () => {
    setSelectedKeys(new Set())
    setOpenModal(false)
    setReady(false)
    setInError(false)
  }, [])

  if (!locale || !users) {
    return <LoadingOverlay />
  }

  return (
    <>
      {openModal && (
        <Modal
          centered
          opened={openModal}
          withCloseButton={ready || inError}
          closeOnClickOutside={false}
          closeOnEscape={false}
          onClose={handleClose}
          radius={'md'}
          title={
            <Title order={6}>
              {inError
                ? CommonConstants.reports.status.error.title[locale]
                : generating
                ? CommonConstants.reports.status.generate.title[locale]
                : CommonConstants.reports.status.ready.title[locale]}
            </Title>
          }
          size={400}
        >
          <>
            <Divider />
            <Group mt={30} direction={'column'} align={'center'}>
              {inError ? (
                <>
                  <IconX
                    size={58}
                    color={theme.white}
                    style={{ borderRadius: theme.radius.xl, background: theme.colors.red[5] }}
                  />
                  <Title order={4}>{CommonConstants.reports.status.error.label[locale]}</Title>
                </>
              ) : !ready && generating ? (
                <>
                  <Loader size={'xl'} />
                  <Title order={4}>{CommonConstants.reports.status.generate.label[locale]}</Title>
                </>
              ) : (
                <>
                  <IconCheck
                    size={58}
                    color={theme.white}
                    style={{ borderRadius: theme.radius.xl, background: theme.colors.green[5] }}
                  />
                  <Title order={4}>{CommonConstants.reports.status.ready.label[locale]}</Title>
                </>
              )}
              <div style={{ marginTop: 20, cursor: generating && !ready ? 'not-allowed' : 'auto' }}>
                {!inError && (
                  <Button
                    size={'xs'}
                    loading={generating}
                    disabled={generating && !ready}
                    leftIcon={<IconFileDownload size={20} />}
                    color={generating && !ready ? 'gray' : 'cyan'}
                    onClick={handleDownload}
                  >
                    {!generating
                      ? CommonConstants.download[locale]
                      : CommonConstants.reports.status.generate.button[locale]}
                  </Button>
                )}
              </div>
            </Group>
          </>
        </Modal>
      )}
      <ContentBase title={`${CommonConstants.reports.title[locale]} / ${year}`} hasSticky>
        <Group position={'apart'} className={!openModal ? classes.mainHeader : undefined}>
          <Title order={!match ? 4 : 6}>{CommonConstants.reports.userListTitle[locale]}</Title>
          <TextInput
            icon={<IconSearch size={20} />}
            placeholder={CommonConstants.search[locale]}
            radius={'md'}
            sx={{ width: 'min(30rem, 100%)' }}
            value={search}
            onChange={({ currentTarget: { value } }) => setSearch(value)}
          />
          <Button
            size={!match ? 'md' : 'xs'}
            disabled={(selectedKeys !== 'all' && !selectedKeys?.size) || openModal}
            onClick={handleReport}
          >
            {CommonConstants.reports.button[locale]}
          </Button>
        </Group>
        <SimpleGrid className={classes.tableContainer}>
          <Table
            aria-label={'report-user-list-table'}
            selectionMode={'multiple'}
            animated={false}
            shadow={false}
            css={{ zIndex: 0, thead: { cursor: 'pointer' } }}
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => {
              if (keys === 'all') {
                if (search?.length) {
                  setSelectedKeys(new Set([...filteredUsers.map(({ id }) => id)]))
                } else {
                  setSelectedKeys('all')
                }
              } else {
                const values: number[] = []
                new Set(keys).forEach((value) => values.push(Number(value.toString())))
                setSelectedKeys(new Set([...values]))
              }
            }}
          >
            <Table.Header columns={ReportConstants.listUser.columns[locale]}>
              {(column) => (
                <Table.Column allowsSorting key={column.uid}>
                  {column.name}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={filteredUsers}>
              {(item) => (
                <Table.Row>
                  {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </SimpleGrid>
      </ContentBase>
    </>
  )
}

export default React.memo(ReportUserListTemplate)
