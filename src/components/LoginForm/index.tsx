import { useQuery } from '@apollo/client'
import { Button, Space, Text, useMantineTheme } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { Grid, Input } from '@nextui-org/react'
import { IconLock, IconUser } from '@tabler/icons'
import ErrorLabelInput from 'components/ErrorLabelInput'
import { CommonConstants } from 'constants/common'
import { ErrorsConstants } from 'constants/errors'
import { ROLES } from 'constants/role'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { GetEvaluationModelType } from 'types/collection/EvaluationModel'
import { GetEvaluationGoalsType } from 'types/collection/Goal'
import { GetTeamMembersType } from 'types/collection/Team'
import { ButtonApiProps } from 'types/common'
import { useStyles } from './styles'

type Inputs = {
  username: string
  password: string
}

type LoginFormProps = {
  usernameLabel: string
  passwordLabel: string
  button: ButtonApiProps
}

const LoginForm = ({ usernameLabel, passwordLabel, button }: LoginFormProps) => {
  const theme = useMantineTheme()
  const { push, query } = useRouter()
  const { locale } = useLocale()
  const [loading, setLoading] = useState<boolean>(false)
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

  const { refetch: fetchEvaluationModel } = useQuery<GetEvaluationModelType>(GET_EVALUATION_MODEL, {
    variables: {
      year: new Date().getFullYear()
    }
  })
  const { refetch: fetchTeamMembers } = useQuery<GetTeamMembersType>(GET_TEAM_MEMBERS)
  const { refetch: fetchTeamGoals } = useQuery<GetEvaluationGoalsType>(GET_EVALUATION_GOALS)

  const username = watch('username')
  const password = watch('password')

  useEffect(() => {
    if (
      (!!username || !!password) &&
      (errors.username?.type === 'access_denied' || errors.password?.type === 'access_denied')
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
      callbackUrl: process.env.NEXT_PUBLIC_CLIENT_URL?.concat((query.callbackUrl as string) || '/')
    }).then(async (res) => {
      if (res?.error) {
        setLoading(false)

        setError('username', { type: 'access_denied' })
        setError('password', { type: 'access_denied' })

        notifications.showNotification({
          title: <Text p={2}>{ErrorsConstants.login.credentials.title[locale]} 😢</Text>,
          message: ErrorsConstants.login.credentials.message[locale],
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
        await push(res.url)
          .then(async () => {
            const session = await getSession()
            const user = session?.user
            const info = user?.info
            const name = user?.role === ROLES.ADMIN ? 'Admin' : info?.name

            notifications.showNotification({
              message: (
                <Text
                  style={{ padding: 2 }}
                  dangerouslySetInnerHTML={{
                    __html: `${CommonConstants.welcome[locale](name)} 😎`
                  }}
                />
              ),
              color: 'green',
              radius: 'md',
              autoClose: 3000,
              styles: (theme) => ({
                root: {
                  borderColor: theme.colors.green[6],
                  '&::before': { backgroundColor: theme.colors.green[6] }
                }
              })
            })
          })
          .finally(async () => {
            const session = await getSession()
            const user = session?.user
            const info = user?.info
            const name = user?.role === ROLES.ADMIN ? 'Admin' : info?.name

            if (user?.role !== ROLES.USER) {
              const { data: dataEvaluationModel } = await fetchEvaluationModel()
              const { data: dataTeamMembers } = await fetchTeamMembers()
              let missingTotalWeight = false

              if (dataEvaluationModel?.evaluation && dataTeamMembers?.team) {
                const evaluation = dataEvaluationModel.evaluation
                const team = dataTeamMembers.team

                for (const user of team) {
                  const { data: dataTeamGoals } = await fetchTeamGoals({
                    idEvaluation: evaluation.id,
                    idUser: user.id
                  })
                  const total = dataTeamGoals?.evaluationGoals
                    .map(({ kpis }) => {
                      return kpis
                        .map(({ weight }) => weight)
                        .reduce((prevWeight, currWeight) => prevWeight + currWeight, 0)
                    })
                    .reduce((prevWeight, currWeight) => prevWeight + currWeight, 0)

                  if (total < 100) {
                    missingTotalWeight = true
                    break
                  }
                }

                if (missingTotalWeight) {
                  notifications.showNotification({
                    message: (
                      <Text
                        style={{ padding: 2 }}
                        dangerouslySetInnerHTML={{
                          __html: `<strong>${name}</strong>, há membros do time que não estão com os objetivos totalmente configurados para a avalição atual. <br/> <i>Ir para <a href="/manager/goals">Objetivos do Time</a>.</i>`
                        }}
                      />
                    ),
                    color: 'red',
                    radius: 'md',
                    autoClose: false,
                    styles: (theme) => ({
                      root: {
                        backgroundColor: theme.colors.red[1],
                        borderColor: theme.colors.red[1],

                        '&::before': { backgroundColor: theme.colors.red[9] }
                      },
                      closeButton: {
                        color: theme.colors.red[7],
                        '&:hover': { backgroundColor: theme.colors.red[2] }
                      }
                    })
                  })
                }
              }
            }
          })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid.Container direction={'column'} gap={0.5}>
        <Grid>
          <ErrorLabelInput
            text={ErrorsConstants.input.required[locale]}
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
            text={ErrorsConstants.input.required[locale]}
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
