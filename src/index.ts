import { Config } from "./Config";
import _TikiClient from "./TikiClient";

export default {
  install: function(_vue: any, options: Config) {
    _TikiClient.configuration(options)
  }
}

export const TikiClient = _TikiClient