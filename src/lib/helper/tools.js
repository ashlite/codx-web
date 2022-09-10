export function priceFormater(price, currency = 'IDR') {
  const formattedPrice = new Intl.NumberFormat('id-ID', {style:'currency', currency: currency}).format(price)
  return formattedPrice.slice(0, -3)
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
  else if (settings == 'isoDateTime') return new Date(date).toISOString()
  else if (settings == 'monthly') return new Intl.DateTimeFormat('id-ID',{month: 'long', year:'numeric'}).format(formatedDate)
  else if (settings == 'month') return new Intl.DateTimeFormat('id-ID',{month: 'long'}).format(formatedDate)
}