import entregaServices from '../../services/entrega-services'

export const getEntregas = (state) => {
  return entregaServices.getEntregas()
}
