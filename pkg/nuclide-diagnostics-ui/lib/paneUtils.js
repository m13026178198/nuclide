'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {DiagnosticMessage} from '../../nuclide-diagnostics-common';
import type {MessageType} from '../../nuclide-diagnostics-common/lib/rpc-types';

function fileOfDiagnosticMessage(diagnostic: DiagnosticMessage): string {
  if (typeof diagnostic.filePath === 'string') {
    return diagnostic.filePath;
  } else {
    return '';
  }
}

function getProjectRelativePathOfDiagnostic(diagnostic: DiagnosticMessage): string {
  if (diagnostic.filePath != null) {
    const [, relativePath] = atom.project.relativizePath(diagnostic.filePath);
    return relativePath;
  } else {
    return '';
  }
}

function fileColumnCellDataGetter(cellDataKey: 'filePath', diagnostic: DiagnosticMessage): string {
  return getProjectRelativePathOfDiagnostic(diagnostic);
}

function compareMessagesByFile(a: DiagnosticMessage, b: DiagnosticMessage): number {
  // This will sort by:
  //  - errors before warnings
  //  - local before remote
  //  - Remote machine name/port
  //  - full path
  //

  let compareVal = compareMessagesByLevel(a, b);
  if (compareVal !== 0) {
    return compareVal;
  }

  // We don't sort by project relative path as that will interleave diagnostics from
  // different projects.
  compareVal = fileOfDiagnosticMessage(a).localeCompare(fileOfDiagnosticMessage(b));
  // If the messages are from the same file (`filePath` is equal and `localeCompare`
  // returns 0), compare the line numbers within the file to determine their sort order.
  if (compareVal === 0 && (a.range !== undefined && b.range !== undefined)) {
    compareVal = a.range.start.row - b.range.start.row;
  }

  return compareVal;
}

const messageLevelRank: {[key: MessageType]: number} = {
  Error: 0,
  Warning: 1,
};

function compareMessagesByLevel(a: DiagnosticMessage, b: DiagnosticMessage): number {
  return messageLevelRank[a.type] - messageLevelRank[b.type];
}

module.exports = {
  compareMessagesByFile,
  getProjectRelativePathOfDiagnostic,
  fileColumnCellDataGetter,
};
