import db from './db'

export default {
  // User Info
  saveUserInfo (userInfo) {
    return new Promise((resolve, reject) => {
      console.log('Saving User Info...')
      db.transaction((tx) => {
        db.saveSetup(userInfo, tx, (result) => {
          console.log('User Info saved')
          resolve(result)
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  getUserInfo () {
    return new Promise((resolve, reject) => {
      console.log('Getting User Info...')
      db.transaction((tx) => {
        db.getSetup('userInfo', tx, (userInfo) => {
          console.log(`User Info read: ${userInfo}`)
          resolve(userInfo)
        }, (error) => {
          console.log(error)
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  // Entregas Info
  saveEntregasInfo (entregasInfo) {
    return new Promise((resolve, reject) => {
      console.log('Saving Entregas Info...')
      db.transaction((tx) => {
        db.saveSetup(entregasInfo, tx, (result) => {
          console.log('Entregas Info saved')
          resolve(result)
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  getEntregasInfo () {
    return new Promise((resolve, reject) => {
      console.log('Getting Entregas Info...')
      db.transaction((tx) => {
        db.getSetup('entregasInfo', tx, (entregasInfo) => {
          console.log(`Entregas Info read: ${entregasInfo}`)
          if (entregasInfo) {
            entregasInfo.entregasLastSync = new Date(entregasInfo.entregasLastSync)
          }
          resolve(entregasInfo)
        }, (error) => {
          console.log(error)
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  // Entregas
  saveEntregas (entregas) {
    return new Promise((resolve, reject) => {
      console.log('Saving Entregas...')
      db.transaction((tx) => {
        db.saveEntregas(entregas, tx, (result) => {
          console.log('Entregas saved')
          resolve(result)
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  saveEntrega (entrega) {
    return new Promise((resolve, reject) => {
      console.log('Saving Entrega...')
      db.transaction((tx) => {
        db.saveEntrega(entrega, tx, (result) => {
          console.log('Entrega saved')
          resolve(result)
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  getEntregas () {
    return new Promise((resolve, reject) => {
      console.log('Getting Entregas...')
      db.transaction((tx) => {
        db.getEntregas(tx, (entregas) => {
          console.log('Entregas read:')
          console.log(entregas)
          resolve(entregas)
        }, (error) => {
          console.log(error)
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  // Motivos de Retorno
  saveMotivosRetorno (motivosRetorno) {
    return new Promise((resolve, reject) => {
      console.log('Saving Motivos de Retorno...')
      db.transaction((tx) => {
        db.saveMotivosRetorno(motivosRetorno, tx, (result) => {
          console.log('Motivos de Retorno saved')
          resolve(result)
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  },
  getMotivosRetorno () {
    return new Promise((resolve, reject) => {
      console.log('Getting Motivos de Retorno...')
      db.transaction((tx) => {
        db.getMotivosRetorno(tx, (motivosRetorno) => {
          console.log('Motivos de Retorno read:')
          console.log(motivosRetorno)
          resolve(motivosRetorno)
        }, (error) => {
          console.log(error)
          reject(error)
        })
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        console.log('Transaction End')
      })
    })
  }
}
