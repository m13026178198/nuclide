#!/usr/bin/env node
'use strict';
/* @noflow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* NON-TRANSPILED FILE */
/* eslint-disable babel/func-params-comma-dangle, prefer-object-spread/prefer-object-spread */

/* eslint-disable no-console */

/**
 * This is a command-line utility to transpile a .js file in the same way that
 * Atom would.
 */

const fs = require('fs');
const NodeTranspiler = require('../lib/NodeTranspiler');

const nodeTranspiler = new NodeTranspiler();
const filePath = process.argv[2];

if (typeof filePath !== 'string') {
  console.error('No file specified. Usage: <file>');
  process.exit(1);
}

const src = fs.readFileSync(filePath);
const output = nodeTranspiler.transform(src, filePath);

console.log(output);
