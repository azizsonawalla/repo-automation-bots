import {logger, GCFLogger} from './gcf-utils';
import {Octokit} from '@octokit/rest';

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

function logGithubIssueAction(
  type?: GitHubActionType,
  value?: string,
  params?: {issue_number?: number; repo: string; owner: string}
) {
  const hasIssueNumber: boolean =
    params?.hasOwnProperty('issue_number') || false;
  logGithubAction(
    type,
    value,
    hasIssueNumber ? GitHubObjectType.ISSUE : undefined,
    hasIssueNumber ? params?.issue_number : undefined,
    params?.repo,
    params?.owner,
    GitHubOwnerType.UNKNOWN
  );
}

function logGithubAction(
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
    action: {...general, ...destination_object},
  };
  logger.metric(githubAction);
}

module.exports = (octokit: Octokit, options: {customLogger?: GCFLogger}) => {
  const octoLogger: GCFLogger = options.customLogger || logger;

  // TODO: add comment about octokit version
  (<any>octokit).trackedAction = {
    issues: {
      addLabels: (
        params?: RequestOptions & Octokit.IssuesAddLabelsParams
      ): Response<Octokit.IssuesAddLabelsResponse> => {
        logGithubIssueAction(
          GitHubActionType.ADD_LABEL,
          params?.labels.join(', '),
          params
        );
        return octokit.issues.addLabels(params);
      },
      createComment: (
        params?: RequestOptions & Octokit.IssuesCreateCommentParams
      ): Response<Octokit.IssuesCreateCommentResponse> => {
        logGithubIssueAction(
          GitHubActionType.ADD_COMMENT,
          params?.body,
          params
        );
        return octokit.issues.createComment(params);
      },

      createLabel: (
        params?: RequestOptions & Octokit.IssuesCreateLabelParams
      ): Response<Octokit.IssuesCreateLabelResponse> => {
        logGithubIssueAction(
          GitHubActionType.CREATE_ISSUE_LABEL,
          params?.name,
          params
        );
        return octokit.issues.createLabel(params);
      },

      removeLabel: (
        params?: RequestOptions & Octokit.IssuesRemoveLabelParams
      ): Response<Octokit.IssuesRemoveLabelResponse> => {
        logGithubIssueAction(
          GitHubActionType.REMOVE_LABEL,
          params?.name,
          params
        );
        return octokit.issues.removeLabel(params);
      },

      updateLabel: (
        params?: RequestOptions & Octokit.IssuesUpdateLabelParams
      ): Response<Octokit.IssuesUpdateLabelResponse> => {
        logGithubIssueAction(
          GitHubActionType.UPDATE_ISSUE_LABEL,
          `${params?.current_name} to ${params?.name}`,
          params
        );
        return octokit.issues.updateLabel(params);
      },

      deleteLabel: (
        params?: RequestOptions & Octokit.IssuesDeleteLabelParams
      ): Promise<Octokit.AnyResponse> => {
        logGithubIssueAction(
          GitHubActionType.DELETE_ISSUE_LABEL,
          params?.name,
          params
        );
        return octokit.issues.deleteLabel(params);
      },

      update: (
        params?: RequestOptions & Octokit.IssuesUpdateParams
      ): Response<Octokit.IssuesUpdateResponse> => {
        logGithubIssueAction(
          GitHubActionType.UPDATE_ISSUE,
          "",
          params
        );
        return octokit.issues.update(params);
      },

      create: (
        params?: RequestOptions & Octokit.IssuesCreateParams
      ): Response<Octokit.IssuesCreateResponse> => {
        logGithubIssueAction(
          GitHubActionType.CREATE_ISSUE,
          "",
          params
        );
        return octokit.issues.create(params);
      },
    },
    pulls: {
      dismissReview: () => {},
      merge: () => {},
      updateBranch: () => {},
    },
  };
};
