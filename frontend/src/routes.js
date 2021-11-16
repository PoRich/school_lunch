import AdminLayout from './views/admin/AdminLayout.svelte'
import Home from './views/public/Home.svelte'
import LunchMenuView from './views/public/LunchMenuView.svelte'
import LunchMenuAdmin from './views/admin/LunchMenuAdmin.svelte'
import LunchMenuAdminDetails from './views/admin/LunchMenuAdminDetails.svelte'
import Callback from './views/admin/Callback.svelte'

const routes = [
  { name: '/', component: Home },
  { name: '/lunch-menu/:school/:weekOf', component: LunchMenuView },
  { name: '/callback', component: Callback },
  {
    name: '/admin/manage-menus', // same as /admin/manage-menus/index
    component: AdminLayout,
    nestedRoutes: [
      { name: 'index', component: LunchMenuAdmin },
      { name: 'week-details/:lunchWeekId', component: LunchMenuAdminDetails },
    ],
  },
]

export { routes }
