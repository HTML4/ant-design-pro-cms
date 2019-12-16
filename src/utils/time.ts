function paddingZero(num: number) {
  return num > 9 ? num.toString() : `0${num}`;
}

function replaceDate(date: string | number | Date) {
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/');
  }
  return date;
}

export const displayDate = (
  date: string | number | Date,
  y?: string,
  m?: string,
  day?: string,
  displayYear: boolean = true,
) => {
  date = replaceDate(date);
  if (!date) {
    return null;
  }
  const yText = y || '-';
  const mText = m || '-';
  const dayText = day || '';
  const d = new Date(date);
  const fullYear = displayYear ? d.getFullYear() + yText : '';
  const month = displayYear ? paddingZero(d.getMonth() + 1) : d.getMonth() + 1;
  return fullYear + month + mText + paddingZero(d.getDate()) + dayText;
};

export const displayDateAndTime = (d: string | number | Date, s?: string, m?: string) => {
  d = replaceDate(d);
  if (!d) {
    return null;
  }
  const date = new Date(d);
  if (!s) {
    return `${date.getFullYear()}
    -${paddingZero(date.getMonth() + 1)}
    -${paddingZero(date.getDate())}
     ${paddingZero(date.getHours())}
    :${paddingZero(date.getMinutes())}`;
  }
  return `${date.getFullYear()}
  ${s}${paddingZero(date.getMonth() + 1)}
  ${s}${paddingZero(date.getDate())}
   ${paddingZero(date.getHours())}
  :${paddingZero(date.getMinutes())}
   ${m ? `:${paddingZero(date.getSeconds())}` : null}`;
};
/*
exports = {
  displayDate: (date: string | number | Date, y: string, m: string, day: string, displayYear = true) => {
    date = replaceDate(date)
    if(!date) {
      return null
    }
    const yText = y || '-',
          mText = m || '-',
          dayText = day || '';
    const d = new Date(date)
    const fullYear = displayYear ? d.getFullYear() + yText : ''
    const month = displayYear ? paddingZero(d.getMonth() + 1) : d.getMonth() + 1
    return fullYear + month + mText + paddingZero(d.getDate()) + dayText
  },
  displayDateAndTime: (d, s, m) => {
    d = replaceDate(d)
    if(!d) {
      return null
    }
    const date = new Date(d)
    if(!s) {
      return date.getFullYear() + "-" +
        paddingZero(date.getMonth() + 1) + "-" +
        paddingZero(date.getDate()) + " " +
        paddingZero(date.getHours()) + ":" +
        paddingZero(date.getMinutes())
    } else {
      return date.getFullYear() + s +
        paddingZero(date.getMonth() + 1) + s +
        paddingZero(date.getDate()) + " " +
        paddingZero(date.getHours()) + ":" +
        paddingZero(date.getMinutes()) + (m ? ":" + paddingZero(date.getSeconds()) : "")
    }
  },
  //取一天的最小时间    0:0:0
  afterDate: function(date) {
    date = replaceDate(date)
    if(!date) {
      return null
    }
    const n = new Date(date)
    n.setHours(0)
    n.setMinutes(0)
    n.setSeconds(0)
    n.setMilliseconds(0)
    return this.displayDateAndTime(n, "-", true)
    //return this.displayDate(n)
  },
  //取一天最大时间
  beforeDate: function(date) {
    date = replaceDate(date)
    if(!date) {
      return null
    }
    const after = replaceDate(this.afterDate(date))
    const before =  new Date(new Date(after).getTime() - 1 + 24 * 60 * 60 * 1000)
    return this.displayDateAndTime(before, "-", true)
  },
  //设置前几个月
  setMonth: function(num){
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = currentDate.getDate()
    if(num >= month + 1) {
      const m = 12 - num
      currentDate.setMonth(month + m)
      currentDate.setFullYear(year - 1)
    } else {
      currentDate.setMonth(month - num)
    }
    return this.afterDate(currentDate)
  }
}
*/
