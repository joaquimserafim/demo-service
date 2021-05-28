import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

import { StageProps } from "./config";

import DemoLambdaStack from "./demo-lambda-stack";

export default class DemoServiceStack extends cdk.Stack {
  //public readonly urlOutput: cdk.CfnOutput;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps,
    stage: StageProps
  ) {
    super(scope, id, props);

    //
    // Lambda config
    //

    const svcLambda = new DemoLambdaStack(this, "DemoLambda", stage);

    //const alias =
    new lambda.Alias(this, "x", {
      aliasName: "Current",
      version: svcLambda.handler.currentVersion,
    });
  }
}
