import { RouteRecordRaw } from 'vue-router'

export abstract class RouteName {
  static get home() {
    return 'home'
  }

  static get elementPlusSkuTable() {
    return 'elementPlusSkuTable'
  }

  static get notFound() {
    return 'notFound'
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.home,
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/element-plus/sku-table',
        component: () => import('@/pages/element-plus/sku-table-usage')
      },
      {
        path: '/x6/organization-chart',
        component: () => import('@/pages/x6/organization-chart-usage')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteName.notFound,
    component: () => import('@/pages/errors').then((v) => v.NotFound),
  },
]
