/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_EVALUATIONMODEL_PERIOD } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GET_ALL_EVALUATION_MODELS
// ====================================================

export interface GET_ALL_EVALUATION_MODELS_evaluationModels {
  __typename: "EvaluationModel";
  year: string;
  period: ENUM_EVALUATIONMODEL_PERIOD;
  finished: boolean;
}

export interface GET_ALL_EVALUATION_MODELS {
  evaluationModels: GET_ALL_EVALUATION_MODELS_evaluationModels[] | null;
}
