import {logger, GCFLogger} from './gcf-utils';
import {Octokit} from '@octokit/rest';

enum GitHubActionType {}

enum GitHubObjectType {}

enum GitHubOwnerType {
  User = 'USER',
  Org = 'ORG',
}

interface GitHubAction {
  action: {
    type: GitHubActionType;
    value: string;
    destination_object?: {
      object_type: GitHubObjectType;
      object_id: string;
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

module.exports = (octokit: Octokit, options: {customLogger?: GCFLogger}) => {

  const octoLogger: GCFLogger = options.customLogger || logger;

  // TODO: add comment about octokit version
  (<any>octokit).trackedAction = {
    issues: {
      addLabels: (
        params?: RequestOptions & Octokit.IssuesAddLabelsParams
      ): Response<Octokit.IssuesAddLabelsResponse> => {
        // TODO: log
        return octokit.issues.addLabels(params);
      },
      createComment: (
        params?: RequestOptions & Octokit.IssuesCreateCommentParams
      ): Response<Octokit.IssuesCreateCommentResponse> => {
        // TODO: log
        return octokit.issues.createComment(params);
      },
      // createLabel: (
      //   params?: RequestOptions & Octokit.IssuesCreateLabelParams
      // ): Response<Octokit.IssuesCreateLabelResponse> => {},
      // removeLabel: (
      //   params?: RequestOptions & Octokit.IssuesRemoveLabelParams
      // ): Response<Octokit.IssuesRemoveLabelResponse> => {},
      // updateLabel: (
      //   params?: RequestOptions & Octokit.IssuesUpdateLabelParams
      // ): Response<Octokit.IssuesUpdateLabelResponse> => {},
      // deleteLabel: (
      //   params?: RequestOptions & Octokit.IssuesDeleteLabelParams
      // ): Promise<Octokit.AnyResponse> => {},
      // update: (
      //   params?: RequestOptions & Octokit.ChecksUpdateParams
      // ): Response<Octokit.ChecksUpdateResponse> => {},
      // create: (
      //   params?: RequestOptions & Octokit.GistsCreateParams
      // ): Response<Octokit.GistsCreateResponse> => {},
    },
    pulls: {
      dismissReview: () => {},
      merge: () => {},
      updateBranch: () => {},
    },
  };
};
