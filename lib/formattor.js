import _ from 'lodash'


function timestampToString(value) {
  if (!value) {
    return ''
  }
  const d = new Date(value)
  return `${d.getFullYear()}-${_.padStart(d.getMonth() + 1, 2, 0)}-${_.padStart(d.getDate(), 2, 0)}`
}

function dateForHuman(date){

  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let now = new Date().getTime();
  function getDateDiff(dateTimeStamp) {
    let diffValue = now - dateTimeStamp;
    let result
    if (diffValue < 0) {
      result = new Date(dateTimeStamp).toLocaleDateString();
    }
    let diffByYear = diffValue /(month * 12)
    let diffByMonth = diffValue / month;
    let diffByWeek = diffValue / (7 * day);
    let diffByDay = diffValue / day;
    let diffByHour = diffValue / hour;
    let diffByMin = diffValue / minute;

    if(diffByYear >= 1){
      result = parseInt(diffByYear) + "年前";
    } else if (diffByMonth < 4 && diffByMonth >= 1) {
      result = parseInt(diffByMonth) + "个月前";
    } else if (diffByWeek >= 1) {
      result = parseInt(diffByWeek) + "周前";
    } else if (diffByDay >= 1) {
      result = parseInt(diffByDay) + "天前";
    } else if (diffByHour >= 1) {
      result = parseInt(diffByHour) + "小时前";
    } else if (diffByMin >= 1) {
      result = parseInt(diffByMin) + "分钟前";
    } else if(diffByMin < 0){
      result = "还未发生"
    } else
      result = "刚刚";
    return result;
  }
  return getDateDiff(Date.parse(date))
}

function dateFormat(date, format) {
  date = new Date(date)
  if (format === undefined) {
    format = date
    date = new Date()
  }
  let map = {
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    q: Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  }
  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    let v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    }
    else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })
  return format
}

const pad = n => n >= 10 ? `${n}` : `0${n}`

function secToTime(seconds) {
  if (seconds < 0) { seconds = 0 }
  seconds = parseInt(seconds, 10)
  let hour = parseInt(seconds / 3600, 10)
  let min = parseInt(seconds / 60, 10) % 60
  let sec = seconds % 60
  return [hour === 0 ? undefined : pad(hour), pad(min), pad(sec)].filter(v => v).join(':')
}

const getRemainTime = (s) => {
  let t = ''
  if (s > -1) {
    let day = Math.floor(s / 86400)
    let hour = Math.floor(s / 3600) % 24
    let min = Math.floor(s / 60) % 60
    let sec = s % 60
    if (day > 0) {t = day + '天'}
    if (day == 0 && hour == 0) {
      t = ''
    } else {
      t += hour + "小时"
    }
    if (min < 10) {t += "0"}
    t += min + "分"
    if (sec < 10) {t += "0"}
    t += sec + "秒"
  }
  return t
}

export {timestampToString, dateFormat, secToTime, getRemainTime, dateForHuman}
