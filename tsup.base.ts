import {Options, defineConfig} from 'tsup'

export function fromTsupBase(overrides?: Partial<Options>): ReturnType<typeof defineConfig> {
    return defineConfig({
        clean: true,
        minify: true,
        target: 'node20',
        sourcemap: true,
        ...overrides,
    })
}