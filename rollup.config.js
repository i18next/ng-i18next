import typescript from 'rollup-plugin-typescript';

export default {
    input: 'src/provider.ts',
    format: 'amd',
    file: 'dist/ng-i18next.js',
    name: 'ngI18next',
    globals: ['angular', 'i18next'],
    external: [
        'typescript'
    ],
    plugins: [
        typescript()
    ]
};