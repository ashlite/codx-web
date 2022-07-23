import {XMLParser} from 'fast-xml-parser'

export async function BggSingleItem(bggId){
  const fixArray = [] 
  const responseBgg = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${bggId}&stats=1`)
  const stringData = await responseBgg.text()
  const parser = new XMLParser({
    ignoreAttributes : false,
    attributeNamePrefix : "",
  })
  const bggObject = parser.parse(stringData).items.item
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
    boardgame:{
      name: bggObject.name[0].value,
      released: bggObject.yearpublished.value,
      category: (bggObject.type == 'boardgame' ? 'core game' : 'expansion'),
      min_player: bggObject.minplayers.value,
      max_player: bggObject.maxplayers.value,
      min_playtime: bggObject.minplaytime.value,
      max_playtime: bggObject.maxplaytime.value,
      min_age: bggObject.minage.value,
      game_difficulties: bggObject.statistics.ratings.averageweight.value,
      cover: bggObject.image,
      thumb_cover: bggObject.thumbnail,
      description: bggObject.description,
    },
    bggGroup: fixArray
  }
}