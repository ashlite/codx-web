export function priceFormater(price, currency = 'IDR') {
  let formattedPrice
  if (currency == 'IDR'){
    formattedPrice = new Intl.NumberFormat('id-ID', {style:'currency', currency: 'IDR', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: 0}).format(price)
  } else {
    formattedPrice = new Intl.NumberFormat('id-ID', {style:'currency', currency: currency, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(price)
  }
  return formattedPrice
}

export function marginCalc(buy, sell, type = 'nominal'){
  if (type == 'nominal') return sell - buy
  if (type == 'percent') return Math.round(((sell - buy) / sell) * 100)
}

export function dateFormater(date, settings='date'){
  const formatedDate = new Date(date)

  if (settings == 'date') return new Intl.DateTimeFormat('id-ID', {dateStyle:'medium'}).format(formatedDate)
  else if (settings == 'time') return new Intl.DateTimeFormat('id-ID', {timeStyle:'short'}).format(formatedDate)
  else if (settings == 'datetime') return new Intl.DateTimeFormat('id-ID', {dateStyle:'medium', timeStyle:'short'}).format(formatedDate)
  else if (settings == 'isoDateTime') return formatedDate.toISOString()
  else if (settings == 'monthly') return new Intl.DateTimeFormat('id-ID',{month: 'long', year:'numeric'}).format(formatedDate)
  else if (settings == 'month') return new Intl.DateTimeFormat('id-ID',{month: 'long'}).format(formatedDate)
}