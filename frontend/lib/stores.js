"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.user = void 0;

var _store = require("svelte/store");

const user = (0, _store.writable)();
exports.user = user;