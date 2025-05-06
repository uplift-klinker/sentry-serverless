import {Options, defineConfig} from 'tsup'
import {dependencies} from './layers/nodejs/package.json';

const layerDependencies = Object.keys(dependencies);
export function fromTsupBase(overrides?: Partial<Options>): ReturnType<typeof defineConfig> {
    return defineConfig({
        clean: true,
        minify: true,
        target: 'node20',
        sourcemap: true,
        external: [...layerDependencies],
        noExternal: layerDependencies.map(l => new RegExp(`^(?!(${l}))`)),
        ...overrides,
    })
}