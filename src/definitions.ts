export interface TikiClientPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
