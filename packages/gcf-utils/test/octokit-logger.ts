// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {describe, beforeEach, it} from 'mocha';
import {Octokit} from '@octokit/rest';
import assert from 'assert';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LoggingOctokitPlugin = require('../src/octokit-request-logger.js');

interface LogStatement {
  [key: string]: string | number | LogStatement;
}

class MockLogger {
  lastLogData: LogStatement | undefined;
  metric(json: LogStatement) {
    this.lastLogData = json;
  }
}

describe('Octokit-Logger', () => {
  let loggingOctokit: Octokit;
  let logger: MockLogger;

  beforeEach(() => {
    const LoggingOctokit = Octokit.plugin(LoggingOctokitPlugin);
    logger = new MockLogger();
    loggingOctokit = new LoggingOctokit({customLogger: logger});
  });

  it('logs information for issues.addLabels', () => {
    loggingOctokit.issues
      .addLabels({
        owner: 'fooOwner',
        issue_number: 2,
        repo: 'barRepo',
        labels: ['a', 'b'],
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_ADD_LABELS',
            value: ['a', 'b'],
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
            destination_object: {
              object_type: 'ISSUE',
              object_id: 2,
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('logs information for issues.createComment', () => {
    loggingOctokit.issues
      .createComment({
        owner: 'fooOwner',
        issue_number: 2,
        repo: 'barRepo',
        body: 'comment body',
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_CREATE_COMMENT',
            value: 'comment body',
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
            destination_object: {
              object_type: 'ISSUE',
              object_id: 2,
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('logs information for issues.createLabel', () => {
    loggingOctokit.issues
      .createLabel({
        owner: 'fooOwner',
        repo: 'barRepo',
        name: 'labelName',
        color: 'blue',
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_CREATE_LABEL',
            value: 'labelName',
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('logs information for issues.removeLabel', () => {
    loggingOctokit.issues
      .removeLabel({
        owner: 'fooOwner',
        repo: 'barRepo',
        issue_number: 3,
        name: 'labelName',
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_REMOVE_LABEL',
            value: 'labelName',
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
            destination_object: {
              object_type: 'ISSUE',
              object_id: 3,
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('logs information for issues.deleteLabel', () => {
    loggingOctokit.issues
      .deleteLabel({owner: 'fooOwner', repo: 'barRepo', name: 'labelName'})
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_DELETE_LABEL',
            value: 'labelName',
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('logs information for issues.updateLabel', () => {
    loggingOctokit.issues
      .updateLabel({
        owner: 'fooOwner',
        repo: 'barRepo',
        current_name: 'currName',
        name: 'labelName',
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_UPDATE_LABEL',
            value: 'currName to labelName',
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('logs information for issues.update', () => {
    loggingOctokit.issues
      .update({
        owner: 'fooOwner',
        repo: 'barRepo',
        issue_number: 3,
        body: 'issue body',
        state: 'open',
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_UPDATE',
            value: 'updated: body,state',
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
            destination_object: {
              object_type: 'ISSUE',
              object_id: 3,
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('logs information for issues.create', () => {
    loggingOctokit.issues
      .create({owner: 'fooOwner', repo: 'barRepo', title: 'new issue'})
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = {
          action: {
            type: 'ISSUE_CREATE',
            value: 'new issue',
            destination_repo: {
              repo_name: 'barRepo',
              owner: 'fooOwner',
            },
          },
        };
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });

  it('does not log information for unknown actions', () => {
    loggingOctokit.issues
      .checkAssignee({owner: 'fooOwner', repo: 'barRepo', assignee: 'bar'})
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(e => {
        /**ignore rejected promise**/
      })
      .finally(() => {
        const expected = undefined;
        const actual = logger.lastLogData;
        assert.deepEqual(actual, expected);
      });
  });
});
