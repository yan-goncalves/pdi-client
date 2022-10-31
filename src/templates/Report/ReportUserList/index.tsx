import { Button, Group, SimpleGrid, Title, useMantineTheme } from '@mantine/core'
import { SortDescriptor, Table, useAsyncList, useCollator, User } from '@nextui-org/react'
import ContentBase from 'components/ContentBase'
import LoadingOverlay from 'components/LoadingOverlay'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { CommonConstants } from 'constants/common'
import { ReportConstants } from 'constants/report'
import { useLocale } from 'contexts/LocaleProvider'
import React, { useState } from 'react'
import { UserType } from 'types/collection/User'
import { useStyles } from './styles'

export type ReportUserListProps = {
  users: UserType[]
  year: number
}

const ReportUserListTemplate = ({ users, year }: ReportUserListProps) => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const { locale } = useLocale()
  const collator = useCollator({ numeric: true })
  const [selectedKeys, setSelectedKeys] = useState<Set<number> | 'all'>()

  const renderCell = (user: UserType, columnKey: React.Key) => {
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
            name={`${user.info.name} ${user.info.lastname}`}
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
  }

  const getColumnField = (user: UserType, column: React.Key) => {
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
  }

  const sort = ({
    items,
    sortDescriptor
  }: {
    items: UserType[]
    sortDescriptor: SortDescriptor
  }) => {
    return {
      items: items.sort((userA, userB) => {
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
  }

  const list = useAsyncList({ load: async () => ({ items: users }), sort })

  const handleReport = async () => {
    const selected = selectedKeys === 'all' ? users : users.filter((u) => selectedKeys?.has(u.id))

    console.log('SELECTED', selected)
  }

  if (!locale || !users) {
    return <LoadingOverlay />
  }

  return (
    <ContentBase title={`${CommonConstants.reports.title[locale]} / ${year}`}>
      <Group position={'apart'} mt={10} mb={20} mx={2.5}>
        <Title order={4}>{CommonConstants.reports.userListTitle[locale]}</Title>
        <Button disabled={selectedKeys !== 'all' && !selectedKeys?.size} onClick={handleReport}>
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
              setSelectedKeys('all')
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
          <Table.Body items={list.items}>
            {(item) => (
              <Table.Row>
                {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </SimpleGrid>
    </ContentBase>
  )
}

export default ReportUserListTemplate
