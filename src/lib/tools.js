export function priceFormater(price, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {style:'currency', currency: currency}).format(price)
}

export function marginCalc(buy, sell, type = 'nominal'){
  if (type == 'nominal') return sell - buy
  if (type == 'percent') return ((sell - buy) / sell) * 100
}