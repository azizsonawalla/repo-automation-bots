import {logger, GCFLogger} from './gcf-utils';

enum GitHubActionType {

}

enum GitHubObjectType {

}

enum GitHubOwnerType {
  User = 'USER',
  Org = 'ORG'
}

interface GitHubAction {
  action: {
    type: GitHubActionType,
    value: string,
    destination_object?: {
      object_type: GitHubObjectType,
      object_id: string
    }
    destination_repo: {
      repo_name: string,
      owner: string,
      owner_type: GitHubOwnerType
    }
  }
}

module.exports = (octokit: any, options: { customLogger?: GCFLogger }) => {

  const octoLogger: GCFLogger = options.customLogger || logger;

  octokit.withLogs = {
    issues: {
      listComments: () => {},
      listLabelsOnIssue: () => {},
    },
    licenses: {},
    orgs: {},
    projects: {},
    pulls: {
      get: () => {},
      checkIfMerged: () => {},
      listCommits: () => {},
    },
    repos: {
      getBranchProtection: () => {},
    },
    search: {},
    teams: {},
    users: {},
  };
};
