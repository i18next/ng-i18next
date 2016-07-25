import typescript from 'rollup-plugin-typescript';

export default {
    entry: 'src/provider.ts',
    format: 'umd',
    moduleName: 'ngI18next',
    dest: 'dist/ng-i18next.js',
    external: [
        'compare-versions',
        'path',
        'fs',
        'object-assign',
        'rollup-pluginutils',
        'tippex',
        'typescript'
    ],
    plugins: [
        typescript()
    ]
};