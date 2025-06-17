import { writeFileSync } from 'fs';
import { join } from 'path';

const bundle = async () => {
  try {
    console.log('Starting ESM build...');
    await Bun.build({
      entrypoints: ['./src/index.ts'],
      outdir: './dist',
      naming: '[dir]/esm/[name].esm.js',
      format: 'esm',
      target: 'browser',
      minify: false,
      banner: '"use client";',
      external: ['ethers'],
    });
    console.log('ESM build completed');

    console.log('Starting CJS build...');
    await Bun.build({
      entrypoints: ['./src/index.ts'],
      outdir: './dist',
      naming: '[dir]/cjs/[name].cjs.js',
      format: 'cjs',
      target: 'node',
      minify: false,
      banner: '"use client";',
      external: ['ethers'],
    });
    console.log('CJS build completed');

    // Create package.json files for proper module resolution
    // Create package.json for ESM
    const esmPackageJson = { type: 'module', sideEffects: false };
    writeFileSync(join('./dist/esm', 'package.json'), JSON.stringify(esmPackageJson, null, 2));

    // Create package.json for CJS
    const cjsPackageJson = { type: 'commonjs' };
    writeFileSync(join('./dist/cjs', 'package.json'), JSON.stringify(cjsPackageJson, null, 2));

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

bundle();
