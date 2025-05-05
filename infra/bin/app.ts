import {App} from 'aws-cdk-lib';
import {AppStack} from "../src/app-stack";

const app = new App();

new AppStack(app);