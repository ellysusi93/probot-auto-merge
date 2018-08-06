"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var association_1 = require("./association");
exports.PullRequestStatusCodes = [
    "merged",
    "closed",
    "not_open",
    "pending_mergeable",
    "conflicts",
    "changes_requested",
    "need_approvals",
    "pending_checks",
    "blocking_check",
    "out_of_date_branch",
    "ready_for_merge"
];
function getPullRequestStatusFromPullRequest(pullRequest) {
    if (pullRequest.merged) {
        return {
            code: "merged",
            message: "Pull request was already merged"
        };
    }
    if (pullRequest.state === "closed") {
        return {
            code: "closed",
            message: "Pull request is closed"
        };
    }
    if (pullRequest.state !== "open") {
        return {
            code: "not_open",
            message: "Pull request is not open"
        };
    }
    if (pullRequest.mergeable === null) {
        return {
            code: "pending_mergeable",
            message: "Mergeablity of pull request could not yet be determined"
        };
    }
    if (pullRequest.mergeable === false) {
        return {
            code: "conflicts",
            message: "Could not merge pull request due to conflicts"
        };
    }
    return null;
}
function getPullRequestStatusFromLabels(context, pullRequest) {
    var config = context.config;
    function hasLabel(labelName) {
        return pullRequest.labels.some(function (label) { return label.name === labelName; });
    }
    var missingRequiredLabels = config.requiredLabels.filter(function (requiredLabel) { return !hasLabel(requiredLabel); });
    if (missingRequiredLabels.length > 0) {
        return {
            code: "requires_label",
            message: "Required labels are missing (" + missingRequiredLabels.join(", ") + ")"
        };
    }
    var matchingBlockingLabels = config.blockingLabels.filter(function (blockingLabel) { return hasLabel(blockingLabel); });
    if (matchingBlockingLabels.length > 0) {
        return {
            code: "blocking_label",
            message: "Blocking labels were added to the pull request (" + matchingBlockingLabels.join(", ") + ")"
        };
    }
    return null;
}
function getPullRequestStatusFromReviews(context, pullRequestInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var github, config, log, reviews, _a, sortedReviews, latestReviewsByUser, reviewSummary, latestReviews, approvedByOneAssociation, _loop_1, _i, associations_1, association, state_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    github = context.github, config = context.config, log = context.log;
                    _a = utils_1.result;
                    return [4 /*yield*/, github.pullRequests.getReviews(pullRequestInfo)];
                case 1:
                    reviews = _a.apply(void 0, [_b.sent()]);
                    sortedReviews = reviews.sort(function (a, b) {
                        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
                    });
                    latestReviewsByUser = utils_1.groupByLast(function (review) { return review.user.login; }, sortedReviews);
                    reviewSummary = Object.entries(latestReviewsByUser)
                        .map(function (_a) {
                        var user = _a[0], review = _a[1];
                        return user + ": " + review.state;
                    })
                        .join("\n");
                    log("\nReviews:\n" + reviewSummary + "\n\n");
                    latestReviews = Object.values(latestReviewsByUser);
                    approvedByOneAssociation = false;
                    _loop_1 = function (association) {
                        var associationReviews = latestReviews.filter(function (review) { return association_1.getAssociationPriority(review.author_association) >= association_1.getAssociationPriority(association); });
                        var changesRequestedCount = associationReviews.filter(function (review) { return review.state === 'CHANGES_REQUESTED'; }).length;
                        var maxRequestedChanges = config.maxRequestedChanges[association];
                        if (maxRequestedChanges !== undefined && changesRequestedCount > maxRequestedChanges) {
                            return { value: {
                                    code: "changes_requested",
                                    message: "There are changes requested by a reviewer."
                                } };
                        }
                        var approvalCount = associationReviews.filter(function (review) { return review.state === 'APPROVED'; }).length;
                        var minApprovals = config.minApprovals[association];
                        if (minApprovals !== undefined && approvalCount >= minApprovals) {
                            approvedByOneAssociation = true;
                        }
                    };
                    for (_i = 0, associations_1 = association_1.associations; _i < associations_1.length; _i++) {
                        association = associations_1[_i];
                        state_1 = _loop_1(association);
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                    }
                    if (approvedByOneAssociation) {
                        return [2 /*return*/, null];
                    }
                    else {
                        return [2 /*return*/, {
                                code: "need_approvals",
                                message: "There are not enough approvals by reviewers"
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getPullRequestStatusFromChecks(context, pullRequestInfo, headSha) {
    return __awaiter(this, void 0, void 0, function () {
        var github, log, owner, repo, checks, _a, checkRuns, checksSummary, allChecksCompleted, checkConclusions, checksBlocking;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    github = context.github, log = context.log;
                    owner = pullRequestInfo.owner, repo = pullRequestInfo.repo;
                    _a = utils_1.result;
                    return [4 /*yield*/, github.checks.listForRef({
                            owner: owner,
                            repo: repo,
                            ref: headSha,
                            filter: "latest"
                        })];
                case 1:
                    checks = _a.apply(void 0, [_b.sent()]);
                    checkRuns = checks.check_runs;
                    checksSummary = checkRuns
                        .map(function (checkRun) { return checkRun.name + ": " + checkRun.status + ": " + checkRun.conclusion; })
                        .join("\n");
                    log("\nChecks:\n" + checksSummary + "\n\n");
                    allChecksCompleted = checkRuns.every(function (checkRun) { return checkRun.status === "completed"; });
                    if (!allChecksCompleted) {
                        return [2 /*return*/, {
                                code: "pending_checks",
                                message: "There are still pending checks"
                            }];
                    }
                    checkConclusions = utils_1.groupByLastMap(function (checkRun) { return checkRun.conclusion; }, function (_) { return true; }, checkRuns);
                    log("conclusions: " + JSON.stringify(checkConclusions));
                    checksBlocking = checkConclusions.failure ||
                        checkConclusions.cancelled ||
                        checkConclusions.timed_out ||
                        checkConclusions.action_required;
                    if (checksBlocking) {
                        return [2 /*return*/, {
                                code: "blocking_check",
                                message: "There are blocking checks"
                            }];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function getPullRequestStatusFromProtectedBranch(context, pullRequest) {
    return __awaiter(this, void 0, void 0, function () {
        var github, log, branchProtection, _a, branch, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    github = context.github, log = context.log;
                    _a = utils_1.result;
                    return [4 /*yield*/, github.repos.getBranchProtection({
                            owner: pullRequest.base.user.login,
                            repo: pullRequest.base.repo.name,
                            branch: pullRequest.base.ref
                        })];
                case 1:
                    branchProtection = _a.apply(void 0, [_c.sent()]);
                    if (!branchProtection.required_status_checks.strict) return [3 /*break*/, 3];
                    log("baseRef: " + pullRequest.base.ref);
                    _b = utils_1.result;
                    return [4 /*yield*/, github.repos.getBranch({
                            owner: pullRequest.base.user.login,
                            repo: pullRequest.base.repo.name,
                            branch: pullRequest.base.ref
                        })];
                case 2:
                    branch = _b.apply(void 0, [_c.sent()]);
                    if (pullRequest.base.sha !== branch.commit.sha) {
                        return [2 /*return*/, {
                                code: "out_of_date_branch",
                                message: "Pull request is based on a strict protected branch (" + pullRequest.base.ref + ") and base sha of pull request (" + pullRequest.base.sha + ") differs from sha of branch (" + branch.commit.sha + ")",
                                merge: {
                                    owner: pullRequest.head.user.login,
                                    repo: pullRequest.head.repo.name,
                                    base: pullRequest.head.ref,
                                    head: pullRequest.base.ref
                                }
                            }];
                    }
                    _c.label = 3;
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
function getPullRequestStatus(context, pullRequestInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var github, pullRequest, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    github = context.github;
                    _a = utils_1.result;
                    return [4 /*yield*/, github.pullRequests.get(pullRequestInfo)];
                case 1:
                    pullRequest = _a.apply(void 0, [_e.sent()]);
                    _d = getPullRequestStatusFromPullRequest(pullRequest) ||
                        getPullRequestStatusFromLabels(context, pullRequest);
                    if (_d) return [3 /*break*/, 3];
                    return [4 /*yield*/, getPullRequestStatusFromReviews(context, pullRequestInfo)];
                case 2:
                    _d = (_e.sent());
                    _e.label = 3;
                case 3:
                    _c = _d;
                    if (_c) return [3 /*break*/, 5];
                    return [4 /*yield*/, getPullRequestStatusFromChecks(context, pullRequestInfo, pullRequest.head.sha)];
                case 4:
                    _c = (_e.sent());
                    _e.label = 5;
                case 5:
                    _b = _c;
                    if (_b) return [3 /*break*/, 7];
                    return [4 /*yield*/, getPullRequestStatusFromProtectedBranch(context, pullRequest)];
                case 6:
                    _b = (_e.sent());
                    _e.label = 7;
                case 7: return [2 /*return*/, (_b || {
                        code: "ready_for_merge",
                        message: "Pull request successfully merged"
                    })];
            }
        });
    });
}
exports.getPullRequestStatus = getPullRequestStatus;
//# sourceMappingURL=pull-request-status.js.map