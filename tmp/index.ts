import { Config } from "./config";
import _TikiClient from "./client";

export default {
  /**
   * The Vue method to install the library as a plugin
   * @param _vue - The vue application instance to install the plugin.
   * @param options - The object that contains the company information necessary to instantiate the class and create license/publish data.
   */
  install: function (_vue: any, options: Config) {
    _TikiClient.configuration(options)
  }
}

export const TikiClient = _TikiClient