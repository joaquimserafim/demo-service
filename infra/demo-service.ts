#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";

import DemoServicePipeline from "./demo-service-pipeline";

import { aws, github, stages } from "./config";

const { region, account } = aws;

const app = new cdk.App();

new DemoServicePipeline(
  app,
  "DemoService",
  {
    env: { account, region },
    description: "Pipeline stack for the demo service",
  },
  { github, stages }
);

app.synth();
