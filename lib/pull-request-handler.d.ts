import { HandlerContext, PullRequestInfo } from "./models";
import { PullRequestStatus } from "./pull-request-status";
export declare function schedulePullRequestTrigger(context: HandlerContext, pullRequestInfo: PullRequestInfo): void;
export declare function handlePullRequestStatus(context: HandlerContext, pullRequestInfo: PullRequestInfo, pullRequestStatus: PullRequestStatus): Promise<void>;
