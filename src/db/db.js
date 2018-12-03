let db = null

export default {
  /*
  * Database
  */
  openDB () {
    // console.log('Open Database')
    db = window.sqlitePlugin.openDatabase({
      name: 'entregas.db',
      location: 'default'
    })
  },
  initializeDB () {
    if (!db) {
      this.openDB()
    }
    db.transaction((tx) => {
      // tx.executeSql('DROP TABLE Entrega')
      // tx.executeSql('DROP TABLE MotivoRetorno')
      tx.executeSql('CREATE TABLE IF NOT EXISTS Entrega (idcargaentrega, idsaidaorigem, jsonobject)')
      tx.executeSql('CREATE TABLE IF NOT EXISTS MotivoRetorno (idmotivoretorno, jsonobject)')
      // this.saveEntregas([{ idcargaentrega: 111, idsaidaorigem: 12, col1: 'xyz' },
      //   { idcargaentrega: 1, idsaidaorigem: 13, col1: 'xyz...' },
      //   { idcargaentrega: 1, idsaidaorigem: 14, col1: 'xyz' }], tx)
      // this.saveEntrega({ idcargaentrega: 1, idsaidaorigem: 15, col1: 'xyz' }, tx)
    }, (error) => {
      console.log('Transaction ERROR: ' + error.message)
    }, () => {
      console.log('Database initialized')
    })
  },
  dumpDB () {
    db.transaction((tx) => {
      console.log('Dumping Database')
      console.log('ENTREGAS')
      this.getEntregas(tx, (entregas) => {
        console.log(entregas)
      }, (error) => {
        console.log(error)
      })
      console.log('MOTIVOS DE RETORNO')
      this.getMotivosRetorno(tx, (motivosRetorno) => {
        console.log(motivosRetorno)
      }, (error) => {
        console.log(error)
      })
    }, (error) => {
      console.log('Transaction ERROR: ' + error.message)
    }, () => {
      console.log('Database dump finished')
    })
  },
  /*
  * Entregas
  */
  getEntregas (tx, success, error) {
    tx.executeSql(`SELECT jsonobject FROM Entrega`, [], (tx, r) => {
      let entregas = []
      const len = r.rows.length
      for (let i = 0; i < len; i++) {
        console.log(r.rows.item(i).jsonobject)
        entregas.push(JSON.parse(r.rows.item(i).jsonobject))
      }
      success && success(entregas)
    }, (e) => {
      error && error(e)
    })
  },
  saveEntregas (entregas, tx) {
    const len = entregas.length
    for (let i = 0; i < len; i++) {
      this.saveEntrega(entregas[i], tx)
    }
  },
  saveEntrega (entrega, tx, success, error) {
    this.entregaExists(entrega, tx, (exists) => {
      if (!exists) {
        console.log('inserting ' + JSON.stringify(entrega))
        tx.executeSql('INSERT INTO Entrega VALUES (?, ?, ?)', [entrega.idcargaentrega, entrega.idsaidaorigem, JSON.stringify(entrega)])
        console.log('row inserted')
        success && success('inserted')
      } else {
        console.log('updating ' + JSON.stringify(entrega))
        tx.executeSql('UPDATE Entrega SET jsonobject = ? WHERE idcargaentrega = ? AND idsaidaorigem = ?', [JSON.stringify(entrega), entrega.idcargaentrega, entrega.idsaidaorigem])
        console.log('row updated')
        success && success('updated')
      }
    }, (e) => {
      error && error(e)
    })
  },
  entregaExists (entrega, tx, success, error) {
    this.rowExists(`Entrega WHERE idcargaentrega = ${entrega.idcargaentrega} AND idsaidaorigem = '${entrega.idsaidaorigem}'`, tx, success, error)
  },
  /*
  * Motivos de Retorno
  */
  getMotivosRetorno (tx, success, error) {
    tx.executeSql(`SELECT jsonobject FROM MotivoRetorno`, [], (tx, r) => {
      let motivosRetorno = []
      const len = r.rows.length
      for (let i = 0; i < len; i++) {
        console.log(r.rows.item(i).jsonobject)
        motivosRetorno.push(JSON.parse(r.rows.item(i).jsonobject))
      }
      success && success(motivosRetorno)
    }, (e) => {
      error && error(e)
    })
  },
  saveMotivosRetorno (motivosRetorno, tx) {
    this.deleteMotivosRetorno(tx)
    const len = motivosRetorno.length
    for (let i = 0; i < len; i++) {
      tx.executeSql('INSERT INTO MotivoRetorno VALUES (?, ?)', [motivosRetorno[i].idmotivoretorno, JSON.stringify(motivosRetorno[i])])
    }
  },
  deleteMotivosRetorno (tx) {
    tx.executeSql('DELETE FROM MotivoRetorno', [])
  },
  /*
  * Commons
  */
  rowExists (test, tx, success, error) {
    tx.executeSql(`SELECT EXISTS(SELECT 1 FROM ${test} LIMIT 1) AS c`, [], (tx, r) => {
      success && success(r.rows.item(0).c > 0)
    }, (e) => {
      error && error(e)
    })
  },
  countRows (test, tx, success, error) {
    tx.executeSql(`SELECT COUNT(*) AS c FROM ${test}`, [], (tx, r) => {
      success && success(r.rows.item(0).c)
    }, (e) => {
      error && error(e)
    })
  },
  transaction (execute, error, success) {
    db.transaction(execute, error, success)
  }
}
