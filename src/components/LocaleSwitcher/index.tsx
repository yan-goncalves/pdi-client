import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons'
import { useAppSelector } from 'app/hooks'
import { selectLocale } from 'features/Locale/locale-slice'
import { useState } from 'react'
import { useStyles } from './styles'

const LocaleSwitcher = () => {
  const [opened, setOpened] = useState(false)
  const { classes } = useStyles({ opened })
  const { locale } = useAppSelector(selectLocale)

  const changeLocale = (locale: 'pt-BR' | 'en') => {}

  return (
    <Menu
      closeOnItemClick
      opened={opened}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      className={classes.menu}
      style={{ width: '160px' }}
      radius={'md'}
      control={
        <UnstyledButton color={'dark'} className={classes.button}>
          <Group>
            <Avatar size={'xs'} src="/img/brasil.svg" />
            <Text size={'sm'} style={{ marginLeft: -7 }}>
              Português
            </Text>
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      }
    >
      <Menu.Item
        icon={<Avatar size={'xs'} src="/img/brasil.svg" />}
        onClick={() => changeLocale('pt-BR')}
      >
        Português
      </Menu.Item>
      <Menu.Item
        icon={<Avatar size={'xs'} src="/img/usa.svg" />}
        onClick={() => changeLocale('en')}
      >
        Inglês
      </Menu.Item>
    </Menu>
  )
}

export default LocaleSwitcher
