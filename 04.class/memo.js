const fs = require('fs')
const Enquirer = require('enquirer')
const Memo = require('./memoClass.js')
const jsonObject = JSON.parse(fs.readFileSync('./memos.json', 'utf8'))

switch (process.argv[2]) {
  case '-l':
    showMemoTitles()
    break
  case '-r':
    showMemoDetail()
    break
  case '-d':
    deleteMemo()
    break
  default:
    addNewMemoToJson()
}

// ==================関数群======================
// ======登録機能======
function addNewMemoToJson () {
  const masterData = []

  const input = fs.readFileSync('/dev/stdin', 'utf8')
  if (input === '') {
    console.log('メモ内容を入力してください。')
  } else {
    jsonObject.MyMemo.forEach((obj) => {
      const memo = {
        id: obj.id,
        content: obj.content
      }
      masterData.push(memo)
    })

    const newMemo = {
      id: calcNextId(jsonObject),
      content: input
    }
    masterData.push(newMemo)

    const newMasterData = JSON.stringify({ MyMemo: masterData }, null, ' ')
    fs.writeFileSync('memos.json', newMasterData)
  }
}

// jsonファイルに存在するメモIDの最大値に+1した値を返却
function calcNextId (jsonObject) {
  const idList = jsonObject.MyMemo.map((obj) => obj.id)
  const maxId = Math.max(...idList)

  return maxId + 1
}

// ======一覧機能======
// メモタイトルのリスト作成
function showMemoTitles () {
  const memos = []
  readMemos(jsonObject, memos)

  memos.forEach((memo) => {
    console.log(memo.showTitle())
  })
}

// ======参照機能======
// ターミナルにメモタイトル一覧を表示、メモタイトル選択後に内容を表示
async function showMemoDetail () {
  const memos = []
  const choices = []

  readMemos(jsonObject, memos)
  makeChoices(memos, choices)

  const question = {
    type: 'select',
    name: 'value',
    message: 'Choose a note you want to see:',
    choices
  }
  const answer = await Enquirer.prompt(question)

  memos.forEach((memo) => {
    if (memo.id === answer.value) {
      console.log(memo.content)
      return true
    }
  })
}

// json内のメモを全てメモオブジェクトとして取得
function readMemos (jsonObject, memos) {
  jsonObject.MyMemo.forEach((obj) => {
    const memo = new Memo(obj.id, obj.content)
    memos.push(memo)
  })
}

// メモ選択肢リストを作成
function makeChoices (memos, choices) {
  memos.forEach((memo) => {
    const data = { name: memo.id, message: memo.showTitle() }
    choices.push(data)
  })
}

// ======削除機能======
// ターミナルにメモタイトル一覧を表示、メモタイトル選択後に対象のメモを削除
async function deleteMemo () {
  const memos = []
  const choices = []
  const masterData = []
  readMemos(jsonObject, memos)
  makeChoices(memos, choices)

  const question = {
    type: 'select',
    name: 'value',
    message: 'Choose a note you want to delete:',
    choices
  }
  const answer = await Enquirer.prompt(question)

  jsonObject.MyMemo.forEach((obj) => {
    if (obj.id !== answer.value) {
      const data = {
        id: obj.id,
        content: obj.content
      }
      masterData.push(data)
    }
  })

  const newMasterData = JSON.stringify({ MyMemo: masterData }, null, ' ')
  fs.writeFileSync('memos.json', newMasterData)
}
