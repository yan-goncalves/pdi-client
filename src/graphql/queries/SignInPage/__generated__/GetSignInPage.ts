/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSignInPage
// ====================================================

export interface GetSignInPage_signInPage_logo {
  __typename: "UploadFile";
  url: string;
  alternativeText: string | null;
}

export interface GetSignInPage_signInPage_usernameTextField {
  __typename: "ComponentCommonTextField";
  labelPlaceholder: string;
}

export interface GetSignInPage_signInPage_passwordTextField {
  __typename: "ComponentCommonTextField";
  labelPlaceholder: string;
}

export interface GetSignInPage_signInPage_button {
  __typename: "ComponentCommonButton";
  label: string;
  loadingLabel: string | null;
}

export interface GetSignInPage_signInPage {
  __typename: "SignInPage";
  title: string;
  caption: string;
  logo: GetSignInPage_signInPage_logo;
  usernameTextField: GetSignInPage_signInPage_usernameTextField;
  passwordTextField: GetSignInPage_signInPage_passwordTextField;
  button: GetSignInPage_signInPage_button;
}

export interface GetSignInPage {
  signInPage: GetSignInPage_signInPage | null;
}

export interface GetSignInPageVariables {
  locale?: any | null;
}
