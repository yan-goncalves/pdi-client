import { Container, Paper, Space, Text, Title } from '@mantine/core'
import { Grid } from '@nextui-org/react'
import Image, { ImageProps } from 'components/Image'
import LoginForm from 'components/LoginForm'
import { ButtonApiProps, TextFieldApiProps } from 'types/common'
import { useStyles } from './styles'

export type SignInTemplateProps = {
  title: string
  caption: string
  logo: ImageProps
  usernameTextField: TextFieldApiProps
  passwordTextField: TextFieldApiProps
  button: ButtonApiProps
}

const SignInTemplate = ({
  title,
  caption,
  logo,
  usernameTextField,
  passwordTextField,
  button
}: SignInTemplateProps) => {
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
          <Image
            url={logo.url}
            alternativeText={logo.alternativeText}
            width={100}
          />
        </Grid.Container>
        <Grid.Container gap={2}>
          <Grid>
            <Title order={2}>{title}</Title>
            <Space />
            <Text size={'xs'} color={'gray'}>
              {caption}
            </Text>
          </Grid>
        </Grid.Container>
        <Space h={'md'} />
        <LoginForm
          usernameLabel={usernameTextField.labelPlaceholder}
          passwordLabel={passwordTextField.labelPlaceholder}
          button={button}
        />
      </Paper>
    </Container>
  )
}

export default SignInTemplate
