export function priceFormater(price, currency = 'IDR') {
  const formattedPrice = new Intl.NumberFormat('id-ID', {style:'currency', currency: currency}).format(price)
  return formattedPrice.slice(0, -3)
}

export function marginCalc(buy, sell, type = 'nominal'){
  if (type == 'nominal') return sell - buy
  if (type == 'percent') return Math.round(((sell - buy) / sell) * 100)
}

export function dateFormater(date, settings='date'){
  if (settings == 'date') return new Date(date).toLocaleString('id-ID', {dateStyle:'medium'})
  else if (settings == 'time') return new Date(date).toLocaleString('id-ID', {timeStyle:'short'})
  else if (settings == 'datetime') return new Date(date).toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'})
}