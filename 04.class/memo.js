module.exports = class Memo {
  constructor (id, content) {
    this.id = id
    this.content = content
  }

  showTitle () {
    const memoLines = this.content.split('\n')
    return memoLines[0]
  }
}
