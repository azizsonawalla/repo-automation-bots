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
import pino from 'pino';
import SonicBoom from 'sonic-boom';

interface LogFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (msg: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (obj: object, msg?: string, ...args: any[]): void;
}

/**
 * A logger standardized logger for Google Cloud Functions
 */
export interface GCFLogger {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  metric: LogFn;
  bindings: {(): {[key: string]: any}};
  flushSync: {(): void};
}

export interface GCFLoggerOptions {
  destination?: NodeJS.WritableStream | SonicBoom,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindings?: {[key: string]: any}
}

export function initLogger(options?: GCFLoggerOptions): GCFLogger {
  const DEFAULT_LOG_LEVEL = 'trace';
  const defaultOptions: pino.LoggerOptions = {
    formatters: {
      level: pinoLevelToCloudLoggingSeverity,
    },
    customLevels: {
      metric: 30,
    },
    base: null,
    messageKey: 'message',
    timestamp: false,
    level: DEFAULT_LOG_LEVEL,
  };

  const destination = options?.destination || pino.destination({sync: true});
  let logger = pino(defaultOptions, destination);

  if (options?.bindings) {
    logger = logger.child(options.bindings);
  }

  Object.keys(logger).map(prop => {
    if (logger[prop] instanceof Function) {
      logger[prop] = logger[prop].bind(logger);
    }
  });

  const flushSync = () => {
    // flushSync is only available for SonicBoom,
    // which is the default destination wrapper for GCFLogger
    if (destination instanceof SonicBoom) {
      destination.flushSync();
    }
  };

  return {
    ...logger,
    metric: logger.metric.bind(logger),
    flushSync: flushSync,
    bindings: logger.bindings
  };
}

/**
 * Maps Pino's number-based levels to Google Cloud Logging's string-based severity.
 * This allows Pino logs to show up with the correct severity in Logs Viewer.
 * Also preserves the original Pino level
 * @param label the label used by Pino for the level property
 * @param level the numbered level from Pino
 */
function pinoLevelToCloudLoggingSeverity(
  label: string,
  level: number
): {[label: string]: number | string} {
  const severityMap: {[level: number]: string} = {
    10: 'DEBUG',
    20: 'DEBUG',
    30: 'INFO',
    40: 'WARNING',
    50: 'ERROR',
  };
  const UNKNOWN_SEVERITY = 'DEFAULT';
  return {severity: severityMap[level] || UNKNOWN_SEVERITY, level: level};
}
