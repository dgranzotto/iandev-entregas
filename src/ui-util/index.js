// import { i18n } from '../plugins/i18n'
import { Notify, Dialog, Loading } from 'quasar'

export default {
  gotoPage (vue, page) {
    vue.$router.push({
      name: page
    })
  },
  showSuccessMessage (message) {
    Notify.create({ message, type: 'positive', position: 'center', timeout: 800 })
  },
  showErrorMessage (message, detail) {
    if (detail) {
      message = message + '<p>' + detail
    }
    Notify.create({ message, type: 'negative', position: 'center' })
  },
  showWarningMessage (message) {
    Notify.create({ message, type: 'warning', position: 'center' })
  },
  showInfoMessage (message) {
    Notify.create({ message, type: 'info', position: 'center' })
  },
  showConfirmErrorMessage (message, title) {
    return Dialog.create({ title: title, message: message, ok: 'OK' })
  },
  showConfirmOkCancelMessage (message, title) {
    return Dialog.create({ title: title, message: message, ok: 'OK', cancel: 'Cancelar' })
  },
  showConfirmDeleteMessage (message, title) {
    message = message || 'Deseja excluir o registro selecionado ?'
    title = title || 'Confirmação'
    return this.showConfirmOkCancelMessage(message, title)
  },
  showConfirmSaveOrDiscardChangesMessage (message, title) {
    message = message || 'Existem alterações não salvas, deseja salvá-las antes de continuar ?'
    title = title || 'Confirmação'
    return Dialog.create({ title: title, message: message, ok: 'Salvar', cancel: 'Descartar Alterações' })
  },
  loading () {
    Loading.show({
      spinnerColor: 'blue',
      spinnerSize: 140,
      message: 'Aguarde, carregando...',
      messageColor: 'white',
      delay: 0
    })
  },
  dismissLoading () {
    Loading.hide()
  }
}
