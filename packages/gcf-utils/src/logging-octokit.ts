import { Octokit } from "@octokit/rest";
import { logger, GCFLogger } from "./gcf-utils";

enum GitHubActionType {
    ADD_LABEL,
    REMOVE_LABEL,
    ADD_COMMENT,
    CREATE_ISSUE_LABEL,
    UPDATE_ISSUE_LABEL,
    UNKNOWN,
    DELETE_ISSUE_LABEL,
    UPDATE_ISSUE,
    CREATE_ISSUE
}

enum GitHubObjectType {
    ISSUE,
    UNKNOWN,
}

enum GitHubOwnerType {
    USER,
    ORG,
    UNKNOWN,
}

interface GitHubAction {
    action: {
        type: GitHubActionType;
        value: string;
        destination_object?: {
            object_type: GitHubObjectType;
            object_id: string | number;
        };
        destination_repo: {
            repo_name: string;
            owner: string;
            owner_type: GitHubOwnerType;
        };
    };
}

// Some aliases for shorter code
type RequestOptions = Octokit.RequestOptions;
type Response<T> = Promise<Octokit.Response<T>>;


export class LoggingOctokit extends Octokit {

    private logger: GCFLogger;

    // issues = {
    //     ...super.issues,
    //     ...{
    //         addLabels: (
    //             params?: Octokit.RequestOptions & Octokit.IssuesAddLabelsParams
    //         ): Promise<Octokit.Response<Octokit.IssuesAddLabelsResponse>> => {
    //             // log
    //             return super.issues.addLabels(params);
    //         }
    //     }
    // }

    constructor(options?: Octokit.Options, customLogger?: GCFLogger) {
        super(options);
        this.logger = customLogger || logger;
    }

    private static logGithubIssueAction(
        type?: GitHubActionType,
        value?: string,
        params?: { issue_number?: number; repo: string; owner: string }
    ) {
        const hasIssueNumber: boolean =
            params?.hasOwnProperty('issue_number') || false;
        this.logGithubAction(
            type,
            value,
            hasIssueNumber ? GitHubObjectType.ISSUE : undefined,
            hasIssueNumber ? params?.issue_number : undefined,
            params?.repo,
            params?.owner,
            GitHubOwnerType.UNKNOWN
        );
    }

    private static logGithubAction(
        type?: GitHubActionType,
        value?: string,
        dstObjType?: GitHubObjectType,
        dstObjId?: string | number,
        repoName?: string,
        repoOwner?: string,
        repoOwnerType?: GitHubOwnerType
    ) {
        const general = {
            type: type || GitHubActionType.UNKNOWN,
            value: value || 'UNKNOWN',
            destination_repo: {
                repo_name: repoName || 'UNKNOWN',
                owner: repoOwner || 'UNKNOWN',
                owner_type: repoOwnerType || GitHubOwnerType.UNKNOWN,
            },
        };

        const destination_object =
            dstObjType || dstObjId
                ? {
                    destination_object: {
                        object_type: dstObjType || GitHubObjectType.UNKNOWN,
                        object_id: dstObjId || 'UNKNOWN',
                    },
                }
                : {};

        const githubAction: GitHubAction = {
            action: { ...general, ...destination_object },
        };
        logger.metric(githubAction);
    }
}