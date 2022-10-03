import { toastAlert } from '$lib/helper/store'
import { epost } from '$lib/helper/api'
import { priceFormater } from '$lib/helper/tools'


export default async function PriceAnnouncement(listItem) {
  const newItem = listItem.filter(item => {if (item.is_new) return item})
  const oldItem = listItem.filter(item => {if (!item.is_new) return item})
  let requestContent = ''

  if (newItem.length > 0) {
    requestContent += '*New Item*\n'
    newItem.forEach(item => {
      requestContent += `${item.product.collection.name} (${item.product.name}) ${priceFormater(item.idr_sell_price, 'IDRshort')}\n`
    });
  }

  if (oldItem.length > 0) {
    requestContent += '\n*Restock*\n'
    oldItem.forEach(item => {
      requestContent += `${item.product.collection.name} (${item.product.name}) ${priceFormater(item.idr_sell_price, 'IDRshort')}\n`
    });
  }

  const response = await epost('https://discord.com/api/webhooks/1026476179651297330/m3NGdasPzdq2_RKz7gjKdVeHcLhBTB6ppJ9QHCqUm_mQJl30I4Gw7IyEbEfdqyqCDxZ6', {content: requestContent})

  if (response.status < 400) toastAlert.success('Successfully send to discord, please check in discord.')
  else toastAlert.error(`Error Status: ${response.status}. ${response.data}`)
}