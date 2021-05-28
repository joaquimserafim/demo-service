import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

import { StageProps } from "./config";

export default class DemoLambdaStack extends cdk.Construct {
  public readonly handler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, stage: StageProps) {
    super(scope, id);

    this.handler = new lambda.Function(this, "Lambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("build/src/"),
      functionName: `DemoLambda${stage.name}`,
      memorySize: stage.lambda.memorySize,
      timeout: cdk.Duration.seconds(stage.lambda.timeout),

      tracing: stage.lambda.isTracingOn ? lambda.Tracing.ACTIVE : undefined,
      // profiling: stage.lambda.isProfilingOn,
      description: `${stage.name} stage - Lambda for Demo purpose`,
      logRetention: stage.lambda.logRetentionDays,
      environment: {
        STAGE: stage.name,
        REGION: stage.aws.region,
      },
    });
  }
}
