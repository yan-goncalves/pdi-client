import { Navbar as MantineNavbar, Text } from '@mantine/core'
import { useStyles } from './styles'

type NavItemTextProps = {
  title: string
}

const NavItemText = ({ title }: NavItemTextProps) => {
  const { classes } = useStyles()

  return (
    <MantineNavbar.Section className={classes.root}>
      <Text className={classes.title} size={'sm'}>
        {title}
      </Text>
    </MantineNavbar.Section>
  )
}

export default NavItemText
