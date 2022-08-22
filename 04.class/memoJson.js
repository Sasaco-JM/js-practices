const Memo = require('./memo.js')

module.exports = class MemoJson {
  constructor (json) {
    this.json = json
    this.master = this.json.MyMemo.map(({ id, content }) => ({ id, content }))
  }

  // jsonファイルに存在するメモIDの最大値に+1した値を返却
  calcNextId () {
    const idList = this.json.MyMemo.map(memo => memo.id)
    const maxId = Math.max(...idList)

    return maxId + 1
  }

  // json内のメモを全てメモオブジェクトとして取得
  readMemos () {
    return this.json.MyMemo.map(memo => new Memo(memo.id, memo.content))
  }

  deleteMemo (id) {
    return this.json.MyMemo.filter(memo => memo.id !== id)
  }
}
