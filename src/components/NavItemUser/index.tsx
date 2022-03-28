import { Divider, Navbar as MantineNavbar, Text } from '@mantine/core'
import { Grid } from '@nextui-org/react'
import UserPicture from 'components/UserPicture'
import { useSession } from 'next-auth/react'
import { useStyles } from './styles'

type NavItemUserProps = {
  direction?: 'column' | 'row'
}

const NavItemUser = ({ direction = 'column' }: NavItemUserProps) => {
  const { data: session } = useSession()
  const { classes } = useStyles({ direction })

  return (
    <MantineNavbar.Section mt={15}>
      <Grid.Container
        alignItems={'center'}
        justify={'center'}
        direction={direction}
        className={classes.container}
      >
        <Grid>
          <UserPicture
            width={direction === 'row' ? 40 : 80}
            height={direction === 'row' ? 40 : 80}
          />
        </Grid>
        <Grid.Container
          md={9}
          sm={9}
          xs={9}
          direction={'column'}
          justify={'flex-start'}
          className={classes.userDescriptionContainer}
        >
          {session?.user.role === 'Administrator' ? (
            <Text size={direction === 'row' ? 'xs' : 'sm'} weight={500} mt={15}>
              Administrador
            </Text>
          ) : (
            <>
              <Text
                size={direction === 'row' ? 'xs' : 'sm'}
                weight={500}
                mt={15}
              >
                {session?.user?.info.name}
              </Text>
              <Text size={'xs'}>{session?.user?.info.lastname}</Text>
            </>
          )}
        </Grid.Container>
      </Grid.Container>
      {direction === 'row' && <Divider className={classes.divider} />}
    </MantineNavbar.Section>
  )
}

export default NavItemUser
