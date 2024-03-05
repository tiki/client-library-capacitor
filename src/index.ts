import { Config } from "./Config";
import TikiClient from "./TikiClient";
import Vue from "vue";

export default {
  install: function(vue: Vue, config: Config) {
    TikiClient.configuration(config)
    Object.defineProperty(vue, "TikiClient", { value: TikiClient });
  }
}