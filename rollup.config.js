import resolve    from '@rollup/plugin-node-resolve'
import commonjs   from '@rollup/plugin-commonjs'
import terser     from '@rollup/plugin-terser';


export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'screenWriter',
			file: 'dist/screen-writer.umd.js',
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
			, terser()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		external: [
                'ask-for-promise', 
                '@peter.naydenov/dynamic-import', 
                '@peter.naydenov/log', 
                '@peter.naydenov/shortcuts' 
            ],
		output: [
			{ file: 'dist/screen-writer.cjs'    , format: 'cjs' },
			{ file: 'dist/screen-writer.esm.mjs', format: 'es' }
		],
		plugins: [ terser() ]
	}
];


