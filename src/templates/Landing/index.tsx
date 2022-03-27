import { Container, Grid } from '@mantine/core'
import LandingInfo from 'components/LandingInfo'
import LandingLogo from 'components/Logo/LandingLogo'
import { useStyles } from './styles'

const Landing = () => {
  const { classes } = useStyles()

  return (
    <Container fluid className={classes.container}>
      <Grid justify={'center'} align={'center'} gutter={100}>
        <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
          <LandingInfo />
        </Grid.Col>
        <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
          <LandingLogo />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Landing
