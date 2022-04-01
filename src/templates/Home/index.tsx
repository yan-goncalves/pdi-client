import { Container, Grid } from '@mantine/core'
import HomeInfo, { HomeInfoProps } from 'components/HomeInfo'
import HomeLogo, { HomeLogoProps } from 'components/Logo/LandingLogo'
import { useStyles } from './styles'

export type HomeTemplateProps = {
  info: HomeInfoProps
  logo: HomeLogoProps
}

const HomeTemplate = ({ info, logo }: HomeTemplateProps) => {
  const { classes } = useStyles()
  const { title, description } = info
  const { url, alternativeText } = logo

  return (
    <Container fluid className={classes.container}>
      <Grid justify={'center'} align={'center'} gutter={100}>
        <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
          <HomeInfo title={title} description={description} />
        </Grid.Col>
        <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
          <HomeLogo url={url} alternativeText={alternativeText} />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default HomeTemplate
