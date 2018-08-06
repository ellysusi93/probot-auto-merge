import { HandlerContext, PullRequestInfo } from "./models";
export interface OutOfDateBranchPullRequestStatus {
    code: "out_of_date_branch";
    message: string;
    merge: {
        owner: string;
        repo: string;
        base: string;
        head: string;
    };
}
export declare type PullRequestStatus = {
    code: "merged" | "closed" | "not_open" | "requires_label" | "blocking_label" | "pending_mergeable" | "conflicts" | "changes_requested" | "need_approvals" | "pending_checks" | "blocking_check" | "ready_for_merge";
    message: string;
} | OutOfDateBranchPullRequestStatus;
export declare type PullRequestStatusCode = PullRequestStatus["code"];
export declare const PullRequestStatusCodes: PullRequestStatusCode[];
export declare function getPullRequestStatus(context: HandlerContext, pullRequestInfo: PullRequestInfo): Promise<PullRequestStatus>;
