import { Config } from "./Config";
import _TikiClient from "./TikiClient";

export default {
  install: function(options: Config) {
    console.log( "running install")
    _TikiClient.configuration(options)
  }
}

export const TikiClient = _TikiClient