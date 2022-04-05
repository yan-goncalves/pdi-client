/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_EVALUATIONMODEL_PERIOD } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAllEvaluationModel
// ====================================================

export interface GetAllEvaluationModel_evaluationModels {
  __typename: "EvaluationModel";
  year: string;
  period: ENUM_EVALUATIONMODEL_PERIOD;
  finished: boolean;
}

export interface GetAllEvaluationModel {
  evaluationModels: GetAllEvaluationModel_evaluationModels[] | null;
}
