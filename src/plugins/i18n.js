import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

let i18n = null

export default ({ app, Vue }) => {
  Vue.use(VueI18n)
  i18n = new VueI18n({
    locale: 'en-us',
    fallbackLocale: 'en-us',
    messages
  })
  // Set i18n instance on app
  app.i18n = i18n
}

export { i18n }
