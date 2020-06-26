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

const {execSync} = require('child_process');
execSync('git fetch origin master');
const status = execSync('git diff --name-only origin/master', { encoding: 'utf-8'});
console.log(status);
const changes = status.split('\n');
const nodePaths = new Set();
const goPaths = new Set();
const bashPaths = new Set();
for (const change of changes) {
  if (change.startsWith('packages/')) {
    nodePaths.add(change.split('/')[1]);
  };
  if (change.startsWith('packages/buildcop/')) {
    goPaths.add('packages/buildcop')
  }
  if (change.startsWith('serverless-scheduler-proxy/')) {
    goPaths.add('serverless-scheduler-proxy');
  }
  if (change.startsWith('scripts/')) {
    bashPaths.add('scripts');
  }
}
console.log(`::set-output name=nodePaths::${JSON.stringify(Array.from(nodePaths))}`);
console.log(`::set-output name=goPaths::${JSON.stringify(Array.from(goPaths))}`);
console.log(`::set-output name=bashPaths::${JSON.stringify(Array.from(bashPaths))}`);
