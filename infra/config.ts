//
// aws config
//

interface AWSProps {
  account: string;
  region: string;
}

export const aws: AWSProps = {
  account: process.env.AWS_ACCOUNT_ID || "028822468280",
  region: process.env.AWS_REGION || "eu-west-1",
};

//
//
//

interface SubnetProps {
  readonly subnetId: string;
  readonly availabilityZone: string;
}

interface VPCProps {
  name: string;
  securityGroup: string;
  subnets: SubnetProps[];
}

const vpc: VPCProps = {
  name: "vpc-0d9461c340f7aff8e",
  securityGroup: "sg-0ed34203a70e0da20",
  subnets: [
    {
      subnetId: "subnet-042602ba08aa975f5",
      availabilityZone: "eu-west-2a",
    },
    {
      subnetId: "subnet-094b6a7d8e1b9197b",
      availabilityZone: "eu-west-2b",
    },
  ],
};

//
// lambda config
//

interface LambdaProps {
  memorySize: number;
  timeout: number;
  reservedConcurrentExecutions?: number;
  isTracingOn: boolean;
  isProfilingOn: boolean;
  logRetentionDays: number;
}

const lambda: LambdaProps = {
  memorySize: 128,
  reservedConcurrentExecutions: 1000,
  timeout: 3,
  isTracingOn: true,
  isProfilingOn: true,
  logRetentionDays: 7,
};

//
// github config - immutable will be the same for every stage
//

interface GithubProps {
  readonly tokenKey: string;
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
}

export const github: GithubProps = {
  tokenKey: "infra/github-token",
  owner: "AkrodLtd",
  repo: "demo-service",
  branch: "main",
};

//
// stage configuration
//

export interface StageProps {
  name: string;
  aws: AWSProps;
  lambda: LambdaProps;
  vpc?: VPCProps;
}

//
// STAGES
//

//
// PreProd
//

const preProd: StageProps = {
  name: "PreProd",
  aws: { ...aws },
  lambda: {
    ...lambda,
    logRetentionDays: 3,
  },
  vpc: { ...vpc },
};

//
// Prod
//

const prod: StageProps = {
  name: "Prod",
  aws: { ...aws },
  lambda: {
    ...lambda,
  },
  vpc: { ...vpc },
};

//
// export as an array of stages
//

export const stages: StageProps[] = [preProd, prod];

//
// define a high level interface for config
//

export interface ConfigProps {
  readonly github: GithubProps;
  stages: StageProps[];
}
