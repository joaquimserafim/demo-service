import * as cdkAssert from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";

import { StageProps, stages } from "./config";

import DemoServiceStack from "./demo-service-stack";

const STACK_NAME = "TestStack";

const stackProps: cdk.StackProps = {
  env: {
    account: <string>process.env.AWS_ACCOUNT_ID,
    region: <string>process.env.AWS_REGION,
  },
};

const testStage: StageProps = stages[0];

describe("Testing the Infra Stack", () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new DemoServiceStack(app, STACK_NAME, stackProps, testStage);
  });

  test("should create IAM Role for AWSLambdaBasicExecutionRole", () => {
    cdkAssert.expect(stack).to(
      cdkAssert.haveResource("AWS::IAM::Role", {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: { Service: "lambda.amazonaws.com" },
            },
          ],
          Version: "2012-10-17",
        },
        ManagedPolicyArns: [
          {
            "Fn::Join": [
              "",
              [
                "arn:",
                { Ref: "AWS::Partition" },
                ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
              ],
            ],
          },
        ],
      })
    );
  });
});
