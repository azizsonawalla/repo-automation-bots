import {logger} from './gcf-utils';
import { Octokit } from '@octokit/rest';

module.exports = function addLogging(octokit) {

    octokit.withLogs.issues.addLabels = function(options) {
        const result = octokit.issues.addLabels(options);
        // log
        return result;
    }
}
