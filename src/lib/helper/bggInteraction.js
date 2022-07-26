import {XMLParser} from 'fast-xml-parser'
import { toastAlert } from './store'
import axios from 'axios'
import { decodeXML } from 'entities'

export async function BggSingleItem(bggId){
  const fixArray = [] 
  const responseBgg = await axios.get(`https://boardgamegeek.com/xmlapi2/thing?id=${bggId}&stats=1`)
  const stringData = await responseBgg.data
  const parser = new XMLParser({
    ignoreAttributes : false,
    attributeNamePrefix : "",
  })
  const bggObject = parser.parse(stringData).items.item
  
  if (bggObject === undefined){
    toastAlert.error('Failed to get BGG data')
    return false
  }else if(bggObject.type == 'boardgameaccessory') {
    return {
      is_game: false,
      data: {
        name: decodeXML(decodeXML(Array.isArray(bggObject.name) ? bggObject.name[0].value : bggObject.name.value)),
        released: bggObject.yearpublished.value,
        category: 'Game Aksesori',
        cover: bggObject.image,
        thumb_cover: bggObject.thumbnail,
        description: decodeXML(decodeXML(bggObject.description)),
      },
      group: []
    }
  } else {
    const arrayBggStat = bggObject.link
    arrayBggStat.forEach(item => {
      if(item.type == 'boardgamecategory' || item.type == 'boardgamemechanic' || item.type == 'boardgamefamily') {
        fixArray.push({
          group_type: item.type,
          id: item.id,
          value: item.value
        })
      }
    })
  
    return {
      is_game: true,
      data:{
        name: decodeXML(decodeXML(Array.isArray(bggObject.name) ? bggObject.name[0].value : bggObject.name.value)),
        released: bggObject.yearpublished.value,
        category: (bggObject.type == 'boardgame' ? 'Core Game' : 'Expansion'),
        min_player: bggObject.minplayers.value,
        max_player: bggObject.maxplayers.value,
        min_playtime: bggObject.minplaytime.value,
        max_playtime: bggObject.maxplaytime.value,
        min_age: bggObject.minage.value,
        game_difficulties: bggObject.statistics.ratings.averageweight.value,
        cover: bggObject.image,
        thumb_cover: bggObject.thumbnail,
        description: decodeXML(decodeXML(bggObject.description)),
      },
      group: fixArray
    }
  }
}