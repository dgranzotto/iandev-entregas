
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Login.vue'), meta: { title: '' } },
      { path: '/home', name: 'home', component: () => import('pages/Index.vue'), meta: { title: '' } }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/BackLayout.vue'),
    children: [
      { path: '/entrega', name: 'entrega', component: () => import('pages/Entrega.vue'), meta: { title: 'Realizar Entrega' } },
      { path: '/midias', name: 'midias', component: () => import('pages/Midias.vue'), meta: { title: 'Midias' } },
      { path: '/entregarota', name: 'entregarota', component: () => import('pages/EntregaRota.vue'), meta: { title: 'Rota' } },
      { path: '/about', name: 'about', component: () => import('pages/About.vue'), meta: { title: 'Sobre' } },
      { path: '/entregas', name: 'entregas', component: () => import('pages/Entregas.vue'), meta: { title: 'Entregas' } },
      { path: '/entregasrealizadas', name: 'entregasrealizadas', component: () => import('pages/EntregasRealizadas.vue'), meta: { title: 'Realizadas' } },
      { path: '/entregasretornos', name: 'entregasretornos', component: () => import('pages/EntregasRetornos.vue'), meta: { title: 'Retornos' } },
      { path: '/entregaspendentes', name: 'entregaspendentes', component: () => import('pages/EntregasPendentes.vue'), meta: { title: 'Pendentes' } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
