const Memo = require('./memoClass.js')

module.exports = class MemoJson {
  constructor (jsonObjet) {
    this.jsonObject = jsonObjet
  }

  makeMasterData () {
    return this.jsonObject.MyMemo.map(obj => ({ id: obj.id, content: obj.content }))
  }

  // jsonファイルに存在するメモIDの最大値に+1した値を返却
  calcNextId () {
    const idList = this.jsonObject.MyMemo.map(obj => obj.id)
    const maxId = Math.max(...idList)

    return maxId + 1
  }

  // json内のメモを全てメモオブジェクトとして取得
  readMemos () {
    return this.jsonObject.MyMemo.map(obj => new Memo(obj.id, obj.content))
  }

  makeMasterDataAfterDelete (id) {
    const masterData = []
    this.jsonObject.MyMemo.forEach((obj) => {
      if (obj.id !== id) {
        const data = {
          id: obj.id,
          content: obj.content
        }
        masterData.push(data)
      }
    })
    return masterData
  }
}
