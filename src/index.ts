/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { Config } from "./config";
import _TikiClient from "./client";

/**
 * TikiPlugin is a Vue plugin that integrates TIKI services into a Vue application.
 * 
 * To use this plugin, first initialize the TikiClient with appropriate configurations using [TikiClient.initialize],
 * or use it as a Vue plugin by calling [Vue.use] method as shown below:
 * 
 * ```typescript
 * import Vue from 'vue';
 * import TikiPlugin, { TikiClient } from 'path/to/tiki-plugin';
 * 
 * Vue.use(TikiPlugin, {
 *   providerId: "provider-id",
 *   publicKey: "public-key",
 *   companyName: "ACME Inc",
 *   companyJurisdiction: "Nashville, TN",
 *   tosUrl: "https://acme.inc/tos",
 *   privacyUrl: "https://acme.inc/privacy"
 * });
 * ```
 */
export default {
  install: function (_vue: any, options: Config) {
    _TikiClient.configuration(options)
  }
}

export const TikiClient = _TikiClient