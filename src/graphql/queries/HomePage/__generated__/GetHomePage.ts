/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetHomePage
// ====================================================

export interface GetHomePage_homePage_hero {
  __typename: "UploadFile";
  url: string;
  alternativeText: string | null;
}

export interface GetHomePage_homePage_button {
  __typename: "ComponentCommonButton";
  label: string;
}

export interface GetHomePage_homePage {
  __typename: "HomePage";
  title: string;
  description: string;
  hero: GetHomePage_homePage_hero;
  button: GetHomePage_homePage_button;
}

export interface GetHomePage {
  homePage: GetHomePage_homePage | null;
}

export interface GetHomePageVariables {
  locale?: any | null;
}
