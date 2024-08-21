import {
  ActionIcon,
  Box,
  Checkbox,
  Collapse,
  Divider,
  Group,
  Text,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Table } from '@nextui-org/react'
import { IconEdit, IconTrash } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { KpisConstants } from 'constants/kpis'
import { ROLES } from 'constants/role'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { GoalType } from 'types/collection/Goal'
import { useStyles } from './styles'

export type GoalFormItemProps = {
  goal: GoalType
  opened?: boolean
  onOpen: () => void
  onSelect?: (goalId: number, checked: boolean) => void
  onEdit?: (goal: GoalType) => void | GoalType
  onDelete?: (goal: GoalType) => Promise<void>
  removing?: boolean
  isSelected?: boolean
  selectable?: boolean
}

const GoalFormItem = ({
  goal,
  opened = false,
  onOpen,
  onSelect,
  onEdit,
  onDelete,
  removing = false,
  isSelected = false
}: GoalFormItemProps) => {
  const theme = useMantineTheme()
  const { data: session } = useSession()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)
  const { locale } = useLocale()
  const { classes, cx } = useStyles({ isSelected })
  const { appraisee } = useEvaluation()
  const isManageable = useMemo(() => {
    return session && session.user.role !== ROLES.ADMIN && session.user.id === appraisee.manager?.id
  }, [appraisee, session])

  const handleEdit = () => {
    onEdit?.(goal)
  }
  const handleDelete = async () => {
    await onDelete?.(goal)
  }

  return (
    <Box className={classes.box} mx={'auto'}>
      <Group
        align={'center'}
        className={opened ? cx(classes.group, classes.groupOpened) : classes.group}
      >
        {!!onSelect && (
          <Checkbox
            value={goal.id}
            onChange={(event) => onSelect(goal.id, event.currentTarget.checked)}
            classNames={{ input: classes.checkbox }}
            checked={isSelected}
          />
        )}
        <Text
          role={'button'}
          onClick={onOpen}
          className={classes.label}
          sx={{
            color: removing ? theme.colors.gray[3] : theme.black
          }}
        >
          {removing ? CommonConstants.removing[locale] : goal.name}
        </Text>
        {isManageable && (
          <Group className={classes.actionsGroup}>
            {onEdit && (
              <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                <ActionIcon
                  disabled={removing}
                  variant={'light'}
                  color={'cyan'}
                  onClick={handleEdit}
                >
                  <IconEdit size={!match ? 20 : 14} />
                </ActionIcon>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip color={'red'} label={CommonConstants.delete[locale]}>
                <ActionIcon
                  disabled={removing}
                  variant={'light'}
                  color={'red'}
                  onClick={handleDelete}
                >
                  <IconTrash size={!match ? 20 : 14} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        )}
      </Group>
      <Divider
        className={cx(classes.divider, opened ? classes.dividerOpened : classes.dividerHidden)}
      />
      <Collapse in={!!opened}>
        {!goal.kpis?.length ? (
          <Group spacing={5} m={20}>
            <Text size={!match ? 'md' : 'xs'} sx={{ color: theme.colors.gray[3] }}>
              {KpisConstants.empty[locale]}
            </Text>
          </Group>
        ) : (
          <Table aria-labelledby={'kpi'}>
            <Table.Header>
              <Table.Column width={'60%'}>
                <Text size={'xs'}>KPI</Text>
              </Table.Column>
              <Table.Column width={'25%'}>
                <Text size={'xs'}>{CommonConstants.target[locale]}</Text>
              </Table.Column>
              <Table.Column width={'15%'}>
                <Text size={'xs'}>{CommonConstants.weight[locale]}</Text>
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {goal.kpis.map(({ id, name, target, weight }) => (
                <Table.Row key={id}>
                  <Table.Cell>
                    <Text size={!match ? 'md' : 'xs'}>{name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size={!match ? 'md' : 'xs'}>{target}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size={!match ? 'md' : 'xs'}>{weight}%</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Collapse>
    </Box>
  )
}

export default GoalFormItem
