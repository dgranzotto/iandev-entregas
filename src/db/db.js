let db = null

export default {
  /*
  * Database
  */
  openDB (userSession, success, error) {
    db = window.sqlitePlugin.openDatabase({
      name: userSession.dbName,
      location: 'default'
    }, (db) => {
      db.transaction((tx) => {
        this.tableExists('MotivoRetorno', tx, (exists) => {
          if (!exists) {
            console.log(`Creating database schema for ${userSession.dbName}`)
            tx.executeSql('CREATE TABLE IF NOT EXISTS Setup (idsetup, jsonobject)')
            tx.executeSql('CREATE TABLE IF NOT EXISTS Entrega (idcargaentrega, idsaidaorigem, jsonobject)')
            tx.executeSql('CREATE TABLE IF NOT EXISTS MotivoRetorno (idmotivoretorno, jsonobject)')
            console.log('Database schema created')
          } else {
            console.log('Database schema is up to date')
          }
        }, (e) => {
          console.log(e)
          error && error(e)
        })
      }, (e) => {
        console.log('Transaction error: ' + e.message)
        error && error(e)
      }, () => {
        console.log('Database initialized')
        success && success(true)
      })
    }, (e) => {
      console.log('Open database error: ' + e.message)
      error && error(e)
    })
  },
  openExistentDB (userSession, success, error) {
    let dbExists = false
    db = window.sqlitePlugin.openDatabase({
      name: userSession.dbName,
      location: 'default'
    }, (db) => {
      db.transaction((tx) => {
        this.tableExists('MotivoRetorno', tx, (exists) => {
          console.log(`Database ${userSession.dbName} existent`)
          dbExists = exists
        }, (e) => {
          console.log(e)
          error && error(e)
        })
      }, (e) => {
        console.log('Transaction error: ' + e.message)
      }, () => {
        console.log('Database initialized')
        success && success(dbExists)
      })
    }, function (e) {
      console.log('Open database error: ' + e.message)
      error && error(e)
    })
  },
  initializeDB () {
    db.transaction((tx) => {
      // tx.executeSql('DROP TABLE Setup')
      // tx.executeSql('DROP TABLE Entrega')
      // tx.executeSql('DROP TABLE MotivoRetorno')
      tx.executeSql('CREATE TABLE IF NOT EXISTS Setup (idsetup, jsonobject)')
      tx.executeSql('CREATE TABLE IF NOT EXISTS Entrega (idcargaentrega, idsaidaorigem, jsonobject)')
      tx.executeSql('CREATE TABLE IF NOT EXISTS MotivoRetorno (idmotivoretorno, jsonobject)')
    }, (error) => {
      console.log('Transaction ERROR: ' + error.message)
    }, () => {
      console.log('Database initialized')
    })
  },
  dumpDB () {
    db.transaction((tx) => {
      console.log('Dumping Database')
      console.log('TABLES')
      this.getTables(tx, (tables) => {
        console.log(tables)
        console.log('SETUPS')
        this.getSetups(tx, (setups) => {
          console.log(setups)
          console.log('ENTREGAS')
          this.getEntregas(tx, (entregas) => {
            console.log(entregas)
            console.log('MOTIVOS DE RETORNO')
            this.getMotivosRetorno(tx, (motivosRetorno) => {
              console.log(motivosRetorno)
            }, (error) => {
              console.log(error)
            })
          }, (error) => {
            console.log(error)
          })
        }, (error) => {
          console.log(error)
        })
      }, (error) => {
        console.log(error)
      })
    }, (error) => {
      console.log('Transaction ERROR: ' + error.message)
    }, () => {
      console.log('Database dump finished')
    })
  },
  getTables (tx, success, error) {
    tx.executeSql('SELECT * FROM sqlite_master', [], (tx, r) => {
      let tables = []
      const len = r.rows.length
      for (let i = 0; i < len; i++) {
        // console.log(r.rows.item(i))
        tables.push(r.rows.item(i))
      }
      success && success(tables)
    }, (e) => {
      error && error(e)
    })
  },
  /*
  * Setup
  */
  getSetups (tx, success, error) {
    tx.executeSql(`SELECT jsonobject FROM Setup`, [], (tx, r) => {
      let setups = []
      const len = r.rows.length
      for (let i = 0; i < len; i++) {
        // console.log(r.rows.item(i).jsonobject)
        setups.push(JSON.parse(r.rows.item(i).jsonobject))
      }
      success && success(setups)
    }, (e) => {
      error && error(e)
    })
  },
  getSetup (idsetup, tx, success, error) {
    tx.executeSql(`SELECT jsonobject FROM Setup WHERE idsetup = '${idsetup}'`, [], (tx, r) => {
      let setup = (r.rows.length > 0 ? JSON.parse(r.rows.item(0).jsonobject) : null)
      success && success(setup)
    }, (e) => {
      error && error(e)
    })
  },
  saveSetup (setup, tx, success, error) {
    this.setupExists(setup, tx, (exists) => {
      if (!exists) {
        console.log('inserting ' + JSON.stringify(setup))
        tx.executeSql('INSERT INTO Setup VALUES (?, ?)', [setup.idsetup, JSON.stringify(setup)])
        console.log('row inserted')
        success && success('inserted')
      } else {
        console.log('updating ' + JSON.stringify(setup))
        tx.executeSql('UPDATE Setup SET jsonobject = ? WHERE idsetup = ?', [JSON.stringify(setup), setup.idsetup])
        console.log('row updated')
        success && success('updated')
      }
    }, (e) => {
      error && error(e)
    })
  },
  setupExists (setup, tx, success, error) {
    this.rowExists(`Setup WHERE idsetup = '${setup.idsetup}'`, tx, success, error)
  },
  /*
  * Entregas
  */
  getEntregas (tx, success, error) {
    tx.executeSql(`SELECT jsonobject FROM Entrega`, [], (tx, r) => {
      let entregas = []
      const len = r.rows.length
      for (let i = 0; i < len; i++) {
        // console.log(r.rows.item(i).jsonobject)
        entregas.push(JSON.parse(r.rows.item(i).jsonobject))
      }
      success && success(entregas)
    }, (e) => {
      error && error(e)
    })
  },
  saveEntregas (entregas, tx, success, error) {
    const len = entregas.length
    for (let i = 0; i < len; i++) {
      this.saveEntrega(entregas[i], tx)
    }
    success && success(`${len} Entregas inserted`)
  },
  saveEntrega (entrega, tx, success, error) {
    this.entregaExists(entrega, tx, (exists) => {
      if (!exists) {
        // console.log('inserting ' + JSON.stringify(entrega))
        tx.executeSql('INSERT INTO Entrega VALUES (?, ?, ?)', [entrega.idcargaentrega, entrega.idsaidaorigem, JSON.stringify(entrega)])
        // console.log('row inserted')
        success && success('inserted')
      } else {
        // console.log('updating ' + JSON.stringify(entrega))
        tx.executeSql('UPDATE Entrega SET jsonobject = ? WHERE idcargaentrega = ? AND idsaidaorigem = ?', [JSON.stringify(entrega), entrega.idcargaentrega, entrega.idsaidaorigem])
        // console.log('row updated')
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
        // console.log(r.rows.item(i).jsonobject)
        motivosRetorno.push(JSON.parse(r.rows.item(i).jsonobject))
      }
      success && success(motivosRetorno)
    }, (e) => {
      error && error(e)
    })
  },
  saveMotivosRetorno (motivosRetorno, tx, success, error) {
    this.deleteMotivosRetorno(tx, result => {
      const len = motivosRetorno.length
      for (let i = 0; i < len; i++) {
        tx.executeSql('INSERT INTO MotivoRetorno VALUES (?, ?)', [motivosRetorno[i].idmotivoretorno, JSON.stringify(motivosRetorno[i])])
      }
      success && success(`${len} Motivos de retorno inserted`)
    }, e => {
      error && error(e)
    })
  },
  deleteMotivosRetorno (tx, success, error) {
    tx.executeSql('DELETE FROM MotivoRetorno', [], () => {
      console.log('Motivos de Retorno deleted')
      success && success('rows deleted')
    }, error => {
      console.log('Erro ao excluir motivos de retorno')
      error && error(error)
    })
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
  tableExists (tableName, tx, success, error) {
    tx.executeSql(`SELECT COUNT(*) AS c FROM sqlite_master WHERE type = 'table' AND name = '${tableName}'`, [], (tx, r) => {
      success && success(r.rows.item(0).c > 0)
    }, (e) => {
      error && error(e)
    })
  },
  transaction (execute, error, success) {
    db.transaction(execute, error, success)
  }
}
