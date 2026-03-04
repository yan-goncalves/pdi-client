import { useQuery } from '@apollo/client'
import { Button, Grid as MantineGrid, Group, Space, Text, useMantineTheme } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { Grid, Input } from '@nextui-org/react'
import {
  IconChecks,
  IconExclamationMark,
  IconInfoCircle,
  IconLock,
  IconUser,
  IconX
} from '@tabler/icons'
import ErrorLabelInput from 'components/ErrorLabelInput'
import { ErrorsConstants } from 'constants/errors'
import { ROLES } from 'constants/role'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_REJECTED_EVALUATIONS_FOR_MANAGER } from 'graphql/queries/collection/EvaluationApproval'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { EvaluationApproval } from 'types/evaluation-approval'
import { GetEvaluationModelType } from 'types/collection/EvaluationModel'
import { GetEvaluationGoalsType } from 'types/collection/Goal'
import { GetTeamMembersType } from 'types/collection/Team'
import { ButtonApiProps } from 'types/common'
import { useStyles } from './styles'
import { Typography } from '@mui/material'

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
    },
    skip: true
  })
  const { refetch: fetchTeamMembers } = useQuery<GetTeamMembersType>(GET_TEAM_MEMBERS, {
    skip: true
  })
  const { refetch: fetchTeamGoals } = useQuery<GetEvaluationGoalsType>(GET_EVALUATION_GOALS, {
    skip: true
  })
  const { refetch: fetchRejectedEvaluations } = useQuery<{
    rejectedEvaluationsForManager: EvaluationApproval[]
  }>(GET_REJECTED_EVALUATIONS_FOR_MANAGER, { skip: true })

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
          color: 'red',
          message: (
            <Group>
              <IconX size={16} color={theme.colors.red[9]} />
              <Typography py={0.5} color={theme.colors.red[9]} fontSize={15}>
                {ErrorsConstants.login.credentials.message[locale]}
              </Typography>
            </Group>
          ),
          radius: 'md',
          autoClose: 850,
          styles: {
            root: {
              backgroundColor: theme.colors.red[0],
              borderColor: theme.colors.red[2],
              alignItems: 'flex-start',
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
                    <MantineGrid>
                      <MantineGrid.Col span={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconInfoCircle size={16} color={theme.colors.red[9]} width={'100%'} />
                      </MantineGrid.Col>
                      <MantineGrid.Col span={11}>
                        <Text
                          style={{ padding: 2 }}
                          dangerouslySetInnerHTML={{
                            __html: `<strong>${name}</strong>, há membros do time que não estão com os objetivos totalmente configurados para a avalição atual. <br/> <i>Ir para <a href="/manager/goals">Objetivos do Time</a>.</i>`
                          }}
                        />
                      </MantineGrid.Col>
                    </MantineGrid>
                  ),
                  color: 'red',
                  radius: 'md',
                  autoClose: false,
                  styles: (theme) => ({
                    root: {
                      backgroundColor: theme.colors.red[0],
                      borderColor: theme.colors.red[2],
                      alignItems: 'flex-start',
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

            // Check for rejected evaluations
            const { data: dataRejectedEvaluations } = await fetchRejectedEvaluations()
            if (dataRejectedEvaluations?.rejectedEvaluationsForManager?.length > 0) {
              const count = dataRejectedEvaluations.rejectedEvaluationsForManager.length
              const message =
                locale === 'br'
                  ? `<strong>${name}</strong>, você tem ${count} avaliação${
                      count > 1 ? 'ões' : ''
                    } reprovada${count > 1 ? 's' : ''} pelo RH que precisa${
                      count > 1 ? 'm' : ''
                    } ser revisada${
                      count > 1 ? 's' : ''
                    }. <br/> <i>Ir para <a href="/manager/evaluation">Avaliações do Time</a>.</i>`
                  : `<strong>${name}</strong>, you have ${count} evaluation${
                      count > 1 ? 's' : ''
                    } rejected by HR that need${
                      count > 1 ? '' : 's'
                    } to be reviewed. <br/> <i>Go to <a href="/manager/evaluation">Team Evaluations</a>.</i>`

              notifications.showNotification({
                message: (
                  <MantineGrid>
                    <MantineGrid.Col span={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconInfoCircle size={16} color={theme.colors.red[9]} width={'100%'} />
                    </MantineGrid.Col>
                    <MantineGrid.Col span={11}>
                      <Text
                        style={{ padding: 2 }}
                        dangerouslySetInnerHTML={{
                          __html: message
                        }}
                      />
                    </MantineGrid.Col>
                  </MantineGrid>
                ),
                color: 'red',
                radius: 'md',
                autoClose: false,
                styles: (theme) => ({
                  root: {
                    backgroundColor: theme.colors.red[0],
                    borderColor: theme.colors.red[2],
                    alignItems: 'flex-start',
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
