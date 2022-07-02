const today = new Date()

// オプションがなければ今日の年月を使用するようにデフォルトを設定
const defaultOption = {
  default: {
    m: today.getMonth() + 1,
    y: today.getFullYear()
  }
}

// オプション引数を受け取る
const argv = require('minimist')(process.argv.slice(2), defaultOption)

// 年、月、日、月初日、月末日、月初曜日、曜日一覧を用意
const year = argv.y
const month = argv.m
const firstDay = 1
const lastDay = new Date(year, month, 0).getDate()
const doy = new Date(`${year}/${month}/${firstDay}`).getDay()
const dow = ['日 ', '月 ', '火 ', '水 ', '木 ', '金 ', '土']

// カレンダーの初日から最終日までの配列を作成
const cal = []
for (let i = firstDay; i <= lastDay; i++) {
  cal.push(i)
}

// 月初の曜日に合わせて空白を追加
while ((doy + cal[6]) % 7 !== 0) {
  cal.unshift(' ')
}

// 日付を出力する際、繰り返し回数を取得するための変数n
let n = 0

// 年月と曜日を表示
console.log(`      ${month}月 ${year}`)
console.log(dow.join(''))

// 曜日に合わせて日付を表示
for (let i = 0; i < cal.length; i++) {
  n += 1
  if (cal[i] < 10) {
    // 日付が1桁の場合は両側に空白を表示して見た目を揃える
    process.stdout.write(` ${cal[i]} `)
  } else {
    // 日付が2桁の場合は右側に空白を出力して見た目を揃える
    process.stdout.write(`${cal[i]} `)
  }

  // 7回表示した後改行
  if ((n % 7) === 0) {
    process.stdout.write('\n')
  }

  // 最後の日付を表示後に改行して空白行を挿入
  if (i === cal.length - 1) {
    console.log('\n ')
  }
}
