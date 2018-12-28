// import { i18n } from '../plugins/i18n'
import { Notify, Dialog, Loading } from 'quasar'

export default {
  gotoPage (vue, page, onComplete, onAbort) {
    if (typeof page === 'string') {
      vue.$router.push({ name: page }, onComplete, onAbort)
    } else {
      vue.$router.push(page, onComplete, onAbort)
    }
  },
  replacePage (vue, page, onComplete, onAbort) {
    if (typeof page === 'string') {
      vue.$router.replace({ name: page }, onComplete, onAbort)
    } else {
      vue.$router.replace(page, onComplete, onAbort)
    }
  },
  showSuccessMessage (message) {
    Notify.create({ message, type: 'positive', position: 'top', timeout: 800 })
  },
  showErrorMessage (message, detail) {
    if (detail) {
      message = message + '<p>' + detail
    }
    Notify.create({ message, type: 'negative', position: 'top' })
  },
  showWarningMessage (message) {
    Notify.create({ message, type: 'warning', position: 'top' })
  },
  showInfoMessage (message) {
    Notify.create({ message, type: 'info', position: 'top' })
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
