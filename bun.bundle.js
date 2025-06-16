const bundle = async () => {
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
};

bundle();
