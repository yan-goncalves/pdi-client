import { Container, Grid } from '@mantine/core'
import HomeInfo, { HomeInfoProps } from 'components/HomeInfo'
import Image, { ImageProps } from 'components/Image'
import { useStyles } from './styles'

export type HomeTemplateProps = {
  info: HomeInfoProps
  hero: ImageProps
}

const HomeTemplate = ({ info, hero }: HomeTemplateProps) => {
  const { classes } = useStyles()

  return (
    <Container fluid className={classes.container}>
      <Grid justify={'center'} align={'center'} gutter={100}>
        <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
          <HomeInfo {...info} hero={hero} />
        </Grid.Col>
        <Grid.Col xl={6} lg={6} md={6} sm={6} xs={12}>
          <Image hideOnMobile {...hero} className={classes.hero} />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default HomeTemplate
