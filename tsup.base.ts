import {Options, defineConfig} from 'tsup'
import {dependencies} from './layers/nodejs/package.json';

const layerDependencies = Object.keys(dependencies)
    .join('|');
export function fromTsupBase(overrides?: Partial<Options>): ReturnType<typeof defineConfig> {
    return defineConfig({
        clean: true,
        minify: true,
        target: 'node20',
        sourcemap: true,
        external: [new RegExp(`^(${layerDependencies})`)],
        noExternal: [new RegExp(`^(?!(${layerDependencies}))`)],
        ...overrides,
    })
}