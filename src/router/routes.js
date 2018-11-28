
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Login.vue') },
      { path: '/home', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/entregas', name: 'entregas', component: () => import('pages/Entregas.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/BackLayout.vue'),
    children: [
      { path: '/entrega', name: 'entrega', component: () => import('pages/Entrega.vue') },
      { path: '/midias', name: 'midias', component: () => import('pages/Midias.vue') },
      { path: '/imagem', name: 'imagem', component: () => import('pages/Imagem.vue') },
      { path: '/entregarota', name: 'entregarota', component: () => import('pages/EntregaRota.vue') },
      { path: '/about', name: 'about', component: () => import('pages/About.vue') }
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
