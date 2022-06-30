import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { LocaleType, useLocale } from 'contexts/LocaleProvider'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useStyles } from './styles'

const LocaleSwitcher = () => {
  const {
    setLocale,
    data: { label, flag }
  } = useLocale()
  const { setIsLocaleLoading } = useEvaluation()
  const { pathname, query, asPath } = useRouter()
  const [opened, setOpened] = useState<boolean>(false)
  const { classes } = useStyles({ opened })

  const changeLocale = (locale: LocaleType) => {
    setIsLocaleLoading(true)
    setLocale(locale)
  }

  return (
    <Menu
      closeOnItemClick
      position={'left'}
      opened={opened}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      className={classes.menu}
      radius={'md'}
      control={
        <UnstyledButton color={'dark'} className={classes.button}>
          <Group style={{ justifyContent: 'space-between' }}>
            <IconChevronLeft size={16} />
            <Group>
              <Avatar size={'xs'} src={`/img/${flag}.svg`} />
              <Text size={'sm'} style={{ marginLeft: -7 }} className={classes.lang}>
                {label}
              </Text>
            </Group>
          </Group>
        </UnstyledButton>
      }
    >
      <Link href={{ pathname, query }} as={asPath} locale={'br'} passHref>
        <Menu.Item
          icon={<Avatar size={'xs'} src={'/img/brasil.svg'} />}
          onClick={() => changeLocale('br')}
        >
          Português
        </Menu.Item>
      </Link>
      <Link href={{ pathname, query }} as={asPath} locale={'en'} passHref>
        <Menu.Item
          icon={<Avatar size={'xs'} src={'/img/usa.svg'} />}
          onClick={() => changeLocale('en')}
        >
          English
        </Menu.Item>
      </Link>
    </Menu>
  )
}

export default LocaleSwitcher
