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
//

/**
 * Returns true if object is truthy, has type 'object' and all it's keys are strings
 * @param toCheck object to test
 */
export function isStringIndexed(
  toCheck: object
): toCheck is {[key: string]: any} {
  if (!toCheck || !isObject(toCheck)) {
    return false;
  }
  return !Object.keys(toCheck).every(isString);
}

/**
 * Returns true if the given paramter has type 'object'
 * @param toCheck object to check
 */
export function isObject(toCheck: any): toCheck is object {
  return typeof toCheck === 'object';
}

/**
 * Returns true if the given parameter has type 'string'
 * @param toCheck string to check
 */
export function isString(toCheck: any): toCheck is string {
  return typeof toCheck === 'string';
}
