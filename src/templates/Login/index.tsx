import { Container, Paper, Space, Text, Title } from '@mantine/core'
import { Grid } from '@nextui-org/react'
import LoginForm from 'components/LoginForm'
import LogoMinimal from 'components/Logo/LogoMinimal'
import { useStyles } from './styles'

const Login = () => {
  const { classes } = useStyles()

  return (
    <Container className={classes.container}>
      <Paper
        p={'xl'}
        shadow={'xl'}
        radius={'lg'}
        withBorder
        className={classes.paper}
      >
        <Grid.Container justify={'center'} className={classes.logo}>
          <LogoMinimal width={100} />
        </Grid.Container>
        <Grid.Container gap={2}>
          <Grid>
            <Title order={2}>Bem-vindo(a) de volta!</Title>
            <Space />
            <Text size={'xs'} color={'gray'}>
              Insira seu usuário e senha de rede para continuar
            </Text>
          </Grid>
        </Grid.Container>
        <Space h={'md'} />
        <LoginForm />
      </Paper>
    </Container>
  )
}

export default Login
