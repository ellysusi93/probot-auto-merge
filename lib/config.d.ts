import { Context } from 'probot';
export declare type Config = {
    minApprovals: {
        COLLABORATOR?: number;
        CONTRIBUTOR?: number;
        FIRST_TIMER?: number;
        FIRST_TIME_CONTRIBUTOR?: number;
        MEMBER?: number;
        NONE?: number;
        OWNER?: number;
    };
    maxRequestedChanges: {
        COLLABORATOR?: number;
        CONTRIBUTOR?: number;
        FIRST_TIMER?: number;
        FIRST_TIME_CONTRIBUTOR?: number;
        MEMBER?: number;
        NONE?: number;
        OWNER?: number;
    };
    updateBranch: boolean;
    deleteBranchAfterMerge: boolean;
    mergeMethod: 'merge' | 'rebase' | 'squash';
    requiredLabels: string[];
    blockingLabels: string[];
};
export declare const defaultConfig: Config;
export declare function loadConfig(context: Context): Promise<Config | null>;
