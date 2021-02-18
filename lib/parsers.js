"use strict";

import * as parserFactories from './parser-factories.js';

export const darwin = parserFactories.darwin();
export const win32 = parserFactories.win32();
export const linux = parserFactories.linux({
  parseName: false,
});
