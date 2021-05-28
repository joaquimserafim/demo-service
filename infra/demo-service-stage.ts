import * as cdk from "@aws-cdk/core";
import DemoServiceStack from "./demo-service-stack";

const Application = "DemoService";

import { StageProps } from "./config";

export default class DemoServiceStage extends cdk.Stage {
  // public readonly urlOutput: cdk.CfnOutput;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StageProps,
    stage: StageProps
  ) {
    super(scope, id, props);

    // const service =
    new DemoServiceStack(
      this,
      Application,
      {
        tags: {
          Application,
          Enviroment: id,
        },
        env: props.env,
      },
      stage
    );

    //this.urlOutput = service.urlOutput;
  }
}
