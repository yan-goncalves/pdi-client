import { Button, Space, Text, useMantineTheme } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { Grid, Input } from '@nextui-org/react'
import { IconLock, IconUser } from '@tabler/icons'
import ErrorLabelInput from 'components/ErrorLabelInput'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ButtonProps } from 'types/common'
import { useStyles } from './styles'

type Inputs = {
  username: string
  password: string
}

type LoginFormProps = {
  usernameLabel: string
  passwordLabel: string
  button: ButtonProps
}

const LoginForm = ({
  usernameLabel,
  passwordLabel,
  button
}: LoginFormProps) => {
  const theme = useMantineTheme()
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)

    await signIn<'credentials'>('credentials', {
      identifier: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: process.env.NEXT_PUBLIC_CLIENT_URL?.concat(
        (query.callbackUrl as string) || '/'
      )
    }).then(async (res) => {
      if (res?.error) {
        setLoading(false)

        setError('username', { type: 'access_denied' })
        setError('password', { type: 'access_denied' })

        notifications.showNotification({
          title: (
            <Text style={{ padding: 2 }}>
              Não foi possível realizar o login 😢
            </Text>
          ),
          message: 'Usuário ou senha incorretos',
          color: 'red',
          radius: 'md',
          autoClose: 3000,
          styles: {
            root: {
              backgroundColor: theme.colors.red[1],
              borderColor: theme.colors.red[1],

              '&::before': { backgroundColor: theme.colors.red[9] }
            },
            closeButton: {
              color: theme.colors.red[7],
              '&:hover': { backgroundColor: theme.colors.red[2] }
            }
          }
        })
      } else if (res?.url) {
        await push(res.url).then(async () => {
          const session = await getSession()
          const user = session?.user
          const info = user?.info
          const name = user?.role === 'Administrator' ? 'Admin' : info?.name

          notifications.showNotification({
            message: (
              <Text style={{ padding: 2 }}>
                Olá, <b>{name}</b>. Bem-vindo(a) de volta! 😎
              </Text>
            ),
            color: 'green',
            radius: 'md',
            autoClose: 3000,
            styles: (theme) => ({
              root: {
                backgroundColor: theme.colors.green[1],
                borderColor: theme.colors.green[1],

                '&::before': { backgroundColor: theme.colors.green[9] }
              },
              closeButton: {
                color: theme.colors.green[7],
                '&:hover': { backgroundColor: theme.colors.green[2] }
              }
            })
          })
        })
      }
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
            labelPlaceholder={usernameLabel}
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
            labelPlaceholder={passwordLabel}
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
              size={'md'}
              loading={loading}
              loaderPosition={'right'}
              fullWidth
            >
              {loading ? button.loadingLabel : button.label}
            </Button>
          </div>
        </Grid>
      </Grid.Container>
    </form>
  )
}

export default LoginForm
