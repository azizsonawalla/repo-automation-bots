import { Octokit } from "@octokit/rest";
import { logger, GCFLogger } from "./gcf-utils";

enum GitHubActionType {
    ISSUE_CREATE_LABEL,
    ISSUE_REMOVE_LABEL,
    ISSUE_CREATE_COMMENT,
    CREATE_ISSUE_LABEL,
    UPDATE_ISSUE_LABEL,
    DELETE_ISSUE_LABEL,
    UPDATE_ISSUE,
    CREATE_ISSUE,
    UNKNOWN,
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

let ActionUrlMap: {[url: string]: {[method: string]:GitHubActionType}} = {
    "/repos/:owner/:repo/issues/:issue_number/labels": {
        "POST": GitHubActionType.ISSUE_CREATE_LABEL,
    },
    "/repos/:owner/:repo/issues/:issue_number/comments": {
        "POST": GitHubActionType.ISSUE_CREATE_COMMENT
    },
    "/repos/:owner/:repo/issues/:issue_number/labels/:name": {
        "DELETE": GitHubActionType.ISSUE_REMOVE_LABEL,
    }
}

module.exports = (octokit: Octokit, pluginOptions: { customLogger?: GCFLogger }) => {
    octokit.hook.before("request", async options => {
        logger.metric(JSON.stringify(options))
        logger.metric({
            baseUrl: options.baseUrl,
            data: options.data,
            headers: options.headers,
            method: options.method,
            request: options.request,
            url: options.url
        });
    });
}