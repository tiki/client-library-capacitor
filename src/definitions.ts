declare module '@capacitor/core' {
  interface PluginRegistry {
    TikiClient: TikiClientPlugin;
  }
}

export interface TikiClientPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
