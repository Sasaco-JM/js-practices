const fs = require('fs')
const Enquirer = require('enquirer')
const jsonObject = JSON.parse(fs.readFileSync('./memos.json', 'utf8'))
const MemoJson = require('./memoJsonClass.js')

const memoData = new MemoJson(jsonObject)

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
  let masterData = []

  const input = fs.readFileSync('/dev/stdin', 'utf8')
  if (input === '') {
    console.log('メモ内容を入力してください。')
  } else {
    masterData = memoData.makeMasterData()

    const newMemo = {
      id: memoData.calcNextId(),
      content: input
    }
    masterData.push(newMemo)

    const newMasterData = JSON.stringify({ MyMemo: masterData }, null, ' ')
    fs.writeFileSync('memos.json', newMasterData)
  }
}

// ======一覧機能======
// メモタイトルのリスト作成
function showMemoTitles () {
  const memos = memoData.readMemos()

  memos.forEach((memo) => {
    console.log(memo.showTitle())
  })
}

// ======参照機能======
// ターミナルにメモタイトル一覧を表示、メモタイトル選択後に内容を表示
async function showMemoDetail () {
  const memos = memoData.readMemos()
  const choices = makeChoices(memos)

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

// メモ選択肢リストを作成
function makeChoices (memos) {
  return memos.map(memo => ({ name: memo.id, message: memo.showTitle() }))
}

// ======削除機能======
// ターミナルにメモタイトル一覧を表示、メモタイトル選択後に対象のメモを削除
async function deleteMemo () {
  const memos = memoData.readMemos()
  const choices = makeChoices(memos)

  const question = {
    type: 'select',
    name: 'value',
    message: 'Choose a note you want to delete:',
    choices
  }
  const answer = await Enquirer.prompt(question)

  const masterData = memoData.makeMasterDataAfterDelete(answer.value)

  const newMasterData = JSON.stringify({ MyMemo: masterData }, null, ' ')
  fs.writeFileSync('memos.json', newMasterData)
}
