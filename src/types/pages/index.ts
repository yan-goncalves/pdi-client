import { ButtonApiProps, ImageApiProps, TextFieldApiProps } from 'types/common'

export type HomePageProps = {
  homePage: {
    title: string
    description: string
    hero: ImageApiProps
    button: ButtonApiProps
  }
}

export type SignInProps = {
  signInPage: {
    title: string
    caption: string
    logo: ImageApiProps
    usernameTextField: TextFieldApiProps
    passwordTextField: TextFieldApiProps
    button: ButtonApiProps
  }
}

export type NotFoundProps = {
  notFoundPage: {
    message: string
    button: ButtonApiProps
  }
}
