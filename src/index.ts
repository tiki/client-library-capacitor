import { Config } from "./Config";
import _TikiClient from "./TikiClient";

export default {
  install: function(event: any, options: Config) {
    console.log( "running install", options, event)
    _TikiClient.configuration(options)
  }
}

export const TikiClient = _TikiClient