// Copyright 2018-2023 @polkadot/api-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ArgV } from './types.js';

import fs from 'node:fs';

import { assert } from '@polkadot/util';

function asJson (_param: string | number): string {
  const param = _param.toString();

  try {
    return JSON.parse(param) as string;
  } catch {
    return param;
  }
}

export function hexMiddleware (argv: ArgV): void {
  // a parameter whose initial character is @ treated as a path and replaced
  // with the hexadecimal representation of the binary contents of that file
  argv._ = argv._.map((_param) => {
    const param = _param.toString();

    if (param.startsWith('@')) {
      const path = param.substring(1);

      assert(fs.existsSync(path), `Cannot find path ${path}`);

      return `0x${fs.readFileSync(path).toString('hex')}`;
    }

    return param;
  });
}

export function jsonMiddleware (argv: ArgV): void {
  argv._ = argv._.map(asJson);
}

export function parseParams (inline: string[], file?: string): string[] {
  if (file) {
    assert(fs.existsSync(file), 'Cannot find supplied transaction parameters file');

    try {
      return fs.readFileSync(file, 'utf8').split(' ').map(asJson);
    } catch {
      assert(false, 'Error loading supplied transaction parameters file');
    }
  }

  return inline;
}
