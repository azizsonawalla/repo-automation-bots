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

describe('Octokit-Logger', () => {
  it('test', () => {
    const MyOctokit = Octokit.plugin(require('../src/octokit-logger.js'));
    const myOctokit: any = new MyOctokit();
    new Octokit().issues.createComment();
    console.log(myOctokit.withLogs.pulls.checkIfMerged());
    // myOctokit.withLogs.issues.addLabel('owner', 'repo', 123, 'label');
  });
});
