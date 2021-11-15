"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = void 0;

var _AdminLayout = _interopRequireDefault(require("./views/admin/AdminLayout.svelte"));

var _Home = _interopRequireDefault(require("./views/public/Home.svelte"));

var _LunchMenuView = _interopRequireDefault(require("./views/public/LunchMenuView.svelte"));

var _LunchMenuAdmin = _interopRequireDefault(require("./views/admin/LunchMenuAdmin.svelte"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = [{
  name: '/',
  component: _Home.default
}, {
  name: '/lunch-menu',
  component: _LunchMenuView.default
}, {
  name: '/admin/manage-menus',
  // same as /admin/manage-menus/index
  component: _AdminLayout.default,
  nestedRoutes: [{
    name: 'index',
    component: _LunchMenuAdmin.default
  }]
}];
exports.routes = routes;