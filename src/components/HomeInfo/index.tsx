import { Button, Text, Title } from '@mantine/core'
import { Grid } from '@nextui-org/react'
import { useAppDispatch } from 'app/hooks'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useStyles } from './styles'

export type HomeInfoProps = {
  title: string
  description: string
}

const HomeInfo = ({ title, description }: HomeInfoProps) => {
  const { push, asPath, locale } = useRouter()
  const { status } = useSession()
  const { classes, cx } = useStyles()
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    if (status === 'authenticated') {
      push('/dashboard')
    } else {
      dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))
      await signIn(undefined, {
        callbackUrl: encodeURIComponent(`/${locale}/dashboard`)
      })
    }
  }

  return (
    <Grid.Container direction={'column'} gap={3}>
      <Grid>
        <Title order={1} className={classes.title}>
          Plano de{' '}
          <Text
            variant={'gradient'}
            gradient={{
              from: 'dark',
              to: 'blue'
            }}
            className={classes.title}
          >
            Desenvolvimento{' '}
          </Text>
          Individual
        </Title>
      </Grid>
      <Grid>
        <Text size={'xs'} className={classes.description}>
          Seja bem-vindo(a) ao portal de avaliação de performance da SL do
          Brasil.
        </Text>
        <Text size={'xs'} className={classes.description}>
          Esta ferramenta é valiosa para o desenvolvimento pessoal e
          profissional de nossos colaboradores.
        </Text>

        <Text
          size={'sm'}
          variant={'gradient'}
          gradient={{
            from: 'blue',
            to: 'dark',
            deg: 135
          }}
          className={cx(classes.description, classes.footerDescription)}
        >
          Utilize-a sempre que necessário.
        </Text>
      </Grid>
      <Grid>
        <Button radius={'md'} className={classes.button} onClick={handleClick}>
          Acessar o portal
        </Button>
      </Grid>
    </Grid.Container>
  )
}

export default HomeInfo
