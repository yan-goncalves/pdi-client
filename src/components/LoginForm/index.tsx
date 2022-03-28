import { Button, Space } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { Grid, Input } from '@nextui-org/react'
import { IconLock, IconUser } from '@tabler/icons'
import ErrorLabelInput from 'components/ErrorLabelInput'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useStyles } from './styles'

type Inputs = {
  username: string
  password: string
}

const LoginForm = () => {
  const { push, query } = useRouter()
  const [loading, setLoading] = useState(false)
  const { classes } = useStyles({ loading })
  const notifications = useNotifications()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm<Inputs>()

  const username = watch('username')
  const password = watch('password')

  useEffect(() => {
    if (
      (!!username || !!password) &&
      (errors.username?.type === 'access_denied' ||
        errors.password?.type === 'access_denied')
    ) {
      clearErrors()
    }
  }, [username, password, errors])

  useEffect(() => {
    if (query?.error) {
      setLoading(false)

      setError('username', { type: 'access_denied' })
      setError('password', { type: 'access_denied' })

      notifications.showNotification({
        title: 'Não foi possível realizar o login',
        message: 'Usuário ou senha incorretos',
        color: 'red',
        radius: 'md',
        autoClose: 3000
      })
    }
  }, [query])

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)

    await signIn('credentials', {
      identifier: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: process.env.NEXT_PUBLIC_CLIENT_URL?.concat(
        (query.callbackUrl as string) || '/'
      )
    }).then(async (res) => {
      await push(res!.callbackUrl)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid.Container direction={'column'} gap={0.5}>
        <Grid>
          <ErrorLabelInput
            text={'* Este campo é obrigatório'}
            inError={errors.username && errors.username?.type === 'required'}
          />
          <Input
            {...register('username', { required: true })}
            id={'username'}
            required
            disabled={loading}
            contentLeft={<IconUser />}
            labelPlaceholder={'Usuário'}
            color={errors.username ? 'error' : 'default'}
            status={errors.username ? 'error' : 'default'}
            size={'lg'}
            fullWidth
          />
        </Grid>
        <Grid>
          <ErrorLabelInput
            text={'* Este campo é obrigatório'}
            inError={errors.password && errors.password?.type === 'required'}
          />
          <Input.Password
            {...register('password', { required: true })}
            id={'password'}
            required
            disabled={loading}
            contentLeft={<IconLock />}
            labelPlaceholder={'Senha'}
            color={errors.password ? 'error' : 'default'}
            status={errors.password ? 'error' : 'default'}
            size={'lg'}
            fullWidth
          />
        </Grid>
        <Space h={25} />
        <Grid>
          <div className={classes.buttonContainer}>
            <Button
              type={'submit'}
              radius={'md'}
              size={'md'}
              loading={loading}
              loaderPosition={'right'}
              fullWidth
            >
              {loading ? 'Autenticando...' : 'LOGIN'}
            </Button>
          </div>
        </Grid>
      </Grid.Container>
    </form>
  )
}

export default LoginForm
