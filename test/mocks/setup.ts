import path from 'node:path';

type MockNuxt = {
  hook(
    name: 'imports:extend',
    callback: (imports: Array<{ name: string; from: string }>) => void
  ): void;
  hook(name: 'nitro:config', callback: (config: { alias?: Record<string, string> }) => void): void;
};

export default (_options: unknown, nuxt: MockNuxt) => {
  const pathToMocks = path.resolve(process.cwd(), 'test/mocks/auth.ts');

  nuxt.hook('imports:extend', (_imports) => {
    _imports.push({ name: 'useAuth', from: pathToMocks });
  });

  nuxt.hook('nitro:config', (nitroConfig) => {
    if (!nitroConfig.alias) {
      throw new Error('Alias must exist at this point, otherwise server-side cannot be mocked');
    }
    nitroConfig.alias['#auth'] = pathToMocks;
  });
};
