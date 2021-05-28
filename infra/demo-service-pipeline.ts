import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as cpa from "@aws-cdk/aws-codepipeline-actions";
import * as cdk from "@aws-cdk/core";
import * as pipelines from "@aws-cdk/pipelines";

import { ConfigProps } from "./config";
import DemoServiceStage from "./demo-service-stage";

export default class DemoServicePipeline extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps,
    { github, stages }: ConfigProps
  ) {
    super(scope, id, props);

    const [preProd, prod] = stages;

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new pipelines.CdkPipeline(this, "Pipeline", {
      pipelineName: "DemoService",
      cloudAssemblyArtifact,

      sourceAction: new cpa.GitHubSourceAction({
        actionName: "GitHub",
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager(github.tokenKey),
        owner: github.owner,
        repo: github.repo,
        branch: github.branch,
      }),

      synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: "npm run build",
      }),
    });

    // PreProd

    const preProdService = new DemoServiceStage(
      this,
      preProd.name,
      {
        env: {
          account: preProd.aws.account,
          region: preProd.aws.region,
        },
      },
      preProd
    );

    const preProdStage = pipeline.addApplicationStage(preProdService);

    // Prod

    preProdStage.addActions(
      new cpa.ManualApprovalAction({
        actionName: "PromoteToProd",
        runOrder: preProdStage.nextSequentialRunOrder(),
      })
    );

    pipeline.addApplicationStage(
      new DemoServiceStage(
        this,
        prod.name,
        {
          env: { account: prod.aws.account, region: prod.aws.region },
        },
        prod
      )
    );
  }
}
