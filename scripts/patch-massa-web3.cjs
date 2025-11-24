/* Patch @massalabs/massa-web3 to avoid circular SIZE_BIT dependencies.
 * This script is idempotent and safe to run multiple times.
 */

const fs = require('fs');
const path = require('path');

function patchFile(filePath, transform) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = transform(original);
  if (typeof updated !== 'string' || updated === original) {
    return;
  }
  fs.writeFileSync(filePath, updated, 'utf8');
}

function patch() {
  let pkgPath;
  try {
    pkgPath = require.resolve('@massalabs/massa-web3/package.json');
  } catch {
    console.warn('[patch-massa-web3] @massalabs/massa-web3 not found, skipping');
    return;
  }

  const rootDir = path.dirname(pkgPath);
  const esmNumberDir = path.join(rootDir, 'dist', 'esm', 'basicElements', 'serializers', 'number');
  const cmdNumberDir = path.join(rootDir, 'dist', 'cmd', 'basicElements', 'serializers', 'number');

  // Patch ESM integers.js
  patchFile(path.join(esmNumberDir, 'integers.js'), (src) => {
    if (src.includes('// Define constants inline to avoid circular dependency')) {
      return src; // already patched
    }

    let s = src;

    s = s.replace(
      "import { U8, U16, U32, U64, U128, U256 } from '..';",
      [
        '// Define constants inline to avoid circular dependency',
        'const U8_SIZE_BIT = 8;',
        'const U8_SIZE_BYTE = 1;',
        'const U16_SIZE_BIT = 16;',
        'const U32_SIZE_BIT = 32;',
        'const U64_SIZE_BIT = 64;',
        'const U64_SIZE_BYTE = 8;',
        'const U64_MAX = (1n << 64n) - 1n;',
        'const U128_SIZE_BIT = 128;',
        'const U256_SIZE_BIT = 256;',
        'const U256_SIZE_BYTE = 32;',
      ].join('\n')
    );

    s = s
      .replace(/U8\.SIZE_BIT/g, 'U8_SIZE_BIT')
      .replace(/U16\.SIZE_BIT/g, 'U16_SIZE_BIT')
      .replace(/U32\.SIZE_BIT/g, 'U32_SIZE_BIT')
      .replace(/U64\.SIZE_BIT/g, 'U64_SIZE_BIT')
      .replace(/U128\.SIZE_BIT/g, 'U128_SIZE_BIT')
      .replace(/U256\.SIZE_BIT/g, 'U256_SIZE_BIT')
      .replace(/U64\.SIZE_BYTE/g, 'U64_SIZE_BYTE')
      .replace(/U256\.SIZE_BYTE/g, 'U256_SIZE_BYTE')
      .replace(/U64\.MAX/g, 'U64_MAX');

    return s;
  });

  // Patch ESM U16/U32/U64/U128/U256 to remove dependency on U8 from '.'
  const sizes = [
    ['u16.js', 16],
    ['u32.js', 32],
    ['u64.js', 64],
    ['u128.js', 128],
    ['u256.js', 256],
  ];

  for (const [file, bits] of sizes) {
    patchFile(path.join(esmNumberDir, file), (src) => {
      if (src.includes(`export const SIZE_BIT = ${bits};`)) {
        return src; // already patched
      }
      let s = src;
      s = s.replace(
        "import { U8 } from '.';\nimport { numberToInteger, integerFromByte, integerToByte } from './integers';",
        "import { numberToInteger, integerFromByte, integerToByte } from './integers';"
      );
      s = s.replace(
        'export const SIZE_BIT = SIZE_BYTE * U8.SIZE_BIT;',
        `export const SIZE_BIT = ${bits};`
      );
      return s;
    });
  }

  // Patch CJS integers.js
  patchFile(path.join(cmdNumberDir, 'integers.js'), (src) => {
    if (src.includes('// Define constants inline to avoid circular dependency on index exports')) {
      return src; // already patched
    }

    let s = src;

    s = s.replace(
      'const __1 = require("..\");',
      [
        '// Define constants inline to avoid circular dependency on index exports',
        'const U8_SIZE_BIT = 8;',
        'const U8_SIZE_BYTE = 1;',
        'const U16_SIZE_BIT = 16;',
        'const U32_SIZE_BIT = 32;',
        'const U64_SIZE_BIT = 64;',
        'const U64_SIZE_BYTE = 8;',
        'const U64_MAX = (1n << 64n) - 1n;',
        'const U128_SIZE_BIT = 128;',
        'const U256_SIZE_BIT = 256;',
        'const U256_SIZE_BYTE = 32;',
      ].join('\n')
    );

    s = s
      .replace(/__1\.U8\.SIZE_BIT/g, 'U8_SIZE_BIT')
      .replace(/__1\.U16\.SIZE_BIT/g, 'U16_SIZE_BIT')
      .replace(/__1\.U32\.SIZE_BIT/g, 'U32_SIZE_BIT')
      .replace(/__1\.U64\.SIZE_BIT/g, 'U64_SIZE_BIT')
      .replace(/__1\.U128\.SIZE_BIT/g, 'U128_SIZE_BIT')
      .replace(/__1\.U256\.SIZE_BIT/g, 'U256_SIZE_BIT')
      .replace(/__1\.U64\.SIZE_BYTE/g, 'U64_SIZE_BYTE')
      .replace(/__1\.U256\.SIZE_BYTE/g, 'U256_SIZE_BYTE')
      .replace(/__1\.U64\.MAX/g, 'U64_MAX');

    return s;
  });

  // Patch ESM serializers/index.js to remove circular dependency on Args
  const serializersIndex = path.join(rootDir, 'dist', 'esm', 'basicElements', 'serializers', 'index.js');
  patchFile(serializersIndex, (src) => {
    if (src.includes('function concatArrays(a, b)')) {
      return src; // already patched
    }
    let s = src;
    s = s.replace("import { Args } from '../args';", '');
    s = s.replace(
      'export function argsListToBytes(argsList) {',
      'function concatArrays(a, b) { return new Uint8Array([...a, ...b]); }\nexport function argsListToBytes(argsList) {'
    );
    s = s.replace(/Args\.concatArrays/g, 'concatArrays');
    return s;
  });

  // Patch ESM serializers/arrays.js to reduce circular dependency on Args
  const arraysIndex = path.join(rootDir, 'dist', 'esm', 'basicElements', 'serializers', 'arrays.js');
  patchFile(arraysIndex, (src) => {
    if (src.includes('var ArrayTypes;')) {
      return src; // already patched
    }
    let s = src;

    // Remove ArrayTypes and DEFAULT_OFFSET from imports
    s = s.replace(
      "import { Args, ArrayTypes, DEFAULT_OFFSET, } from '../args';",
      "import { Args } from '../args';"
    );

    // Define DEFAULT_OFFSET and ArrayTypes locally
    const localDefs = `
const DEFAULT_OFFSET = 0;
var ArrayTypes;
(function (ArrayTypes) {
    ArrayTypes[ArrayTypes["STRING"] = 0] = "STRING";
    ArrayTypes[ArrayTypes["BOOL"] = 1] = "BOOL";
    ArrayTypes[ArrayTypes["U8"] = 2] = "U8";
    ArrayTypes[ArrayTypes["U16"] = 3] = "U16";
    ArrayTypes[ArrayTypes["U32"] = 4] = "U32";
    ArrayTypes[ArrayTypes["U64"] = 5] = "U64";
    ArrayTypes[ArrayTypes["U128"] = 6] = "U128";
    ArrayTypes[ArrayTypes["U256"] = 7] = "U256";
    ArrayTypes[ArrayTypes["I8"] = 8] = "I8";
    ArrayTypes[ArrayTypes["I16"] = 9] = "I16";
    ArrayTypes[ArrayTypes["I32"] = 10] = "I32";
    ArrayTypes[ArrayTypes["I64"] = 11] = "I64";
    ArrayTypes[ArrayTypes["I128"] = 12] = "I128";
    ArrayTypes[ArrayTypes["I256"] = 13] = "I256";
    ArrayTypes[ArrayTypes["F32"] = 14] = "F32";
    ArrayTypes[ArrayTypes["F64"] = 15] = "F64";
})(ArrayTypes || (ArrayTypes = {}));
function concatArrays(a, b) { return new Uint8Array([...a, ...b]); }
`;

    // Insert local defs after imports
    s = s.replace("import { U8, U16, U32, U64, U128, U256, I8, I16, I32, I64, I128, I256 } from '.';",
      "import { U8, U16, U32, U64, U128, U256, I8, I16, I32, I64, I128, I256 } from '.';\n" + localDefs);

    // Replace Args.concatArrays
    s = s.replace(/Args\.concatArrays/g, 'concatArrays');

    return s;
  });
}

patch();
