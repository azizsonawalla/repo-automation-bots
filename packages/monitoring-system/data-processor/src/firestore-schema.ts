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
 * Placeholder value for unknown fields
 */
export const UNKNOWN_FIRESTORE_VALUE = 'Unknown';

/**
 * GitHub repository owner type
 */
export enum OwnerType {
  /* Repository is owned by an organization */
  ORG = 'Org',
  /* Repository is owned by a user */
  USER = 'User',
  /* Repository ownership type is unknown */
  UNKNOWN = 'Unknown',
}

/**
 * A document in the Firestore Bot collection
 * Represents a repo automation bot
 *
 * Primary Key = bot_name
 */
export interface BotDocument {
  /* The name of the bot */
  bot_name: string;
}

/**
 * A document in the Firestore Bot_Execution collection
 * Represents a repo automation bot execution
 *
 * Primary Key = execution_id
 * Foreign Keys = bot_name
 */
export interface BotExecutionDocument {
  /* Execution ID generated by GCF */
  execution_id: string;
  /* References BotDocument.bot_name */
  bot_name?: string;
  /* UNIX timestamp of execution start */
  start_time?: number;
  /* UNIX timestamp of execution end */
  end_time?: number;
  /* URL to logs in GCP */
  logs_url?: string;
}

/**
 * A document in the Firestore Task_Queue_Status collection
 * Represents the status of a bot's task queue at a given timestamp
 *
 * Primary Key = ${queue_name}_${timestamp}
 */
export interface TaskQueueStatusDocument {
  /* UNIX timestamp at which status was checked */
  timestamp: number;
  /* Name of the queue */
  queue_name: string;
  /* Number of tasks in queue at given timestamp */
  in_queue?: number;
}

/**
 * A document in the Firestore Error collection
 * Represents an error in a bot execution
 *
 * Primary Key = ${execution_id}_${timestamp}
 * Foreign Keys = execution_id
 */
export interface ErrorDocument {
  /* References BotExecutionDocument.execution_id */
  execution_id: string;
  /* UNIX timestamp at which error occured */
  timestamp: number;
  /* The text payload associated with the error */
  error_msg?: string;
}

/**
 * A document in the Firestore Trigger collection
 * Represents a bot execution trigger
 *
 * Primary Key = execution_id
 * Foreign Key = execution_id, github_event
 */
export interface TriggerDocument {
  /* References BotExecutionDocument.execution_id */
  execution_id: string;
  /* References GitHubEventDocument.payload_hash */
  github_event?: string;
  /* The type of trigger that started the execution */
  trigger_type?: string;
}

/**
 * A document in the Firestore Action collection
 * Represents an action taken on GitHub by a bot execution
 *
 * Primary Key = ${execution_id}_${action_type}_${timestamp}
 * Foreign Key = execution_id, action_type, destination_object, destination_repo
 */
export interface ActionDocument {
  /* References BotExecutionDocument.execution_id */
  execution_id: string;
  /* References ActionTypeDocument.name */
  action_type: string;
  /* UNIX timestamp at which action was taken */
  timestamp: number;
  /* References GitHubObjectDocument */
  destination_object?: string;
  /* References GitHubRepositoryDocument */
  destination_repo?: string;
  /* The value associated with the action */
  value?: string;
}

/**
 * A document in the Firestore GitHub_Repository collection
 * Represents a GitHub Repository
 *
 * Primary Key = ${repo_name}_${owner_name}_${owner_type}
 */
export interface GitHubRepositoryDocument {
  /* The name of the GitHub repository */
  repo_name: string;
  /* The name of the user/org that owns the repository */
  owner_name: string;
  /* The account type of the owner. See OwnerType */
  owner_type: OwnerType;
}

/**
 * A document in the Firestore Action_Type collection
 * Represents a category of actions that can be taken by
 * bot executions on GitHub
 *
 * Primary Key = name
 */
export interface ActionTypeDocument {
  /* The name of the action category */
  name: string;
  /* A description of the category */
  description?: string;
  /* The number of dev hours that are saved by type of bot action */
  dev_hours_saved?: number;
}

/**
 * A document in the Firestore GitHub_Event collection
 * Represents a GitHub Event
 *
 * Primary Key = payload_hash
 * Foreign Keys = repository
 */
export interface GitHubEventDocument {
  /* An md5 hash of the payload */
  payload_hash: string;
  /* References a GitHubRepositoryDocument */
  repository?: string;
  /* The category of the event */
  event_type?: string;
  /* UNIX timestamp of when the event occured */
  timestamp?: number;
  /* The username that triggered the event */
  actor?: string;
}

/**
 * A document in the Firestore GitHub_Object collection
 * Represents a GitHub Object (eg. a GitHub Issue)
 *
 * Primary Key = ${object_type}_${repository}_${object_id}
 * Foreign Keys = repository
 */
export interface GitHubObjectDocument {
  /* The category of the GitHub object (eg. Pull Request) */
  object_type: string;
  /* References a GitHubRepositoryDocument */
  repository: string;
  /* The ID associated with the object */
  object_id: number;
}

/**
 * The schema for the Data Processor Firestore
 */
export interface FirestoreSchema {
  Bot: {
    [primary_key: string]: BotDocument;
  };
  Bot_Execution: {
    [primary_key: string]: BotExecutionDocument;
  };
  Task_Queue_Status: {
    [primary_key: string]: TaskQueueStatusDocument;
  };
  Error: {
    [primary_key: string]: ErrorDocument;
  };
  Trigger: {
    [primary_key: string]: TriggerDocument;
  };
  Action: {
    [primary_key: string]: ActionDocument;
  };
  Action_Type: {
    [primary_key: string]: ActionTypeDocument;
  };
  GitHub_Event: {
    [primary_key: string]: GitHubEventDocument;
  };
  GitHub_Repository: {
    [primary_key: string]: GitHubRepositoryDocument;
  };
  GitHub_Object: {
    [primary_key: string]: GitHubObjectDocument;
  };
}

export function getRepositoryPrimaryKey(doc: GitHubRepositoryDocument): string {
  if (doc.repo_name && doc.owner_name && doc.owner_type && doc.owner_type !== OwnerType.UNKNOWN) {
    return `${doc.repo_name}_${doc.owner_name}_${doc.owner_type}`;
  }
  return UNKNOWN_FIRESTORE_VALUE;
}
