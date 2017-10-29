/**
 * Created by v.orel on 11.01.2017.
 */
function buildSql() {

}

class AliasCounter {
  constructor () {
    this._counter = 1
  }
  get counter () {
    if (this._counter < 100) {
      return this._counter++
    } else {
      throw new Error('Too many table in query')
    }
  }
}

class JoinItem {
// (this.datasource.builder, fromAttr, toAttr, ds, entity, enumExpr, enumGroup)
  constructor (builder, fromAttr, fromDs, toAttr, toDs, joinType) {
    this.fromAttr = fromAttr
    this.toAttr = toAttr
    this.fromDs = fromDs
    this.toDs = toDs
    this.joinType = (joinType || this.establishJoinType()).toUpperCase()

    this.whereItems = new Set()
    this.builder = builder
    this.getJoinText = builder.getJoinText
  }
  establishJoinType () {
    return (this.fromAttr.AllowNull || this.toAttr.dataType === 'Enum') ? 'LEFT' : 'INNER'
  }
  getSQL () {
    const res = [this.getJoinText()]
    if (this.toAttr.enumGroup) {
      res.push(`AND ${this.toDs.uniqCalcShortName}.${this.toAttr.name}="${this.toAttr.enumGroup}"`)
    }
    for (let whereItem of this.whereItems) {
      if (whereItem.inJoinAsPredicate) {
        res.push(`AND ${whereItem.getSQL()}`)
      }
    }
    return res
  }
}
class JoinList {
  constructor (dataSource) {
    this.dataSource = dataSource
    this.structuredItems = new Map() // of Map of Map of Map JoinItem (ds, from, to)
    this.items = []
  }
  add ({fromAttr, toAttr, dsTo, enumExpr, enumGroup, whereItem, joinType, isLastJoin}) {
    if (fromAttr && toAttr && dsTo) {
      let ds = this.structuredItems.get(dsTo)
      if (!ds) {
        ds = new Map()
        this.structuredItems.set(dsTo, ds)
      }
      let fromItem = ds.get(fromAttr)
      if (!fromItem) {
        fromItem = new Map()
        ds.set(fromAttr, fromItem)
      }
      let item = fromItem.get(toAttr)
      if (!item) {
        item = new JoinItem(this.dataSource.builder, fromAttr, this.dataSource, toAttr, dsTo, enumExpr, enumGroup, joinType)
        this.items.push(item)
        fromItem.set(toAttr, item)
      }
      if (isLastJoin) {
        item.whereItems.add(whereItem)
      }
      return item
    }
  }
  getSQL () {
    const res = []
    for (let item of this.items) {
      res.push.apply(res, item.getSQL())
    }
    return res
  }
}
const preparedShortNames = []
for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
  preparedShortNames.push(String.fromCharCode(i))
}
for (let i = 0; i < 1000; i++) {
  preparedShortNames.push(`${i}`)
}
const friendlySqlAliases = process.isDebug
class DataSource {
  constructor (dsList, entity, level) {
    // this.ownerEntityName = entity.name
    const mapping = entity.mapping
    if (mapping && mapping.selectName) {
      this.selectName = mapping.selectName
      this.execName = mapping.execName
    } else {
      this.selectName = entity.name
      this.execName = entity.name
    }
    this.joinList = new JoinList(this)
    // todo is level parameter needed
    this.level = level
    this.entity = entity

    this.builder = dsList.builder
    if (friendlySqlAliases) {
      this.shortName = dsList.shortNames[this.selectName]
      if (!this.shortName) {
        if (entity.sqlAlias && !dsList.registeredShortNames.includes(entity.sqlAlias)) {
          this.shortName = entity.sqlAlias
        } else {
          for (let preparedShortName of preparedShortNames) {
            if (!dsList.registeredShortNames.includes(preparedShortName)) {
              this.shortName = preparedShortName
              break
            }
          }
        }
        dsList.shortNames[this.selectName] = this.shortName
        dsList.registeredShortNames.push(this.shortName)
      }
      this.uniqCalcShortName = this.shortName
      let i = 2
      while (dsList.forbiddenAlias.includes(this.uniqCalcShortName)) {
        this.uniqCalcShortName = `${this.shortName}${i++}`
      }
      dsList.forbiddenAlias.push(this.uniqCalcShortName)
    } else {
      this.uniqCalcShortName = `A${dsList.aliasCounter.counter}`
    }
  }
}
class DataSourceList {
  constructor (builder) {
    this.builder = builder
    this.items = new Map()
    this.itemsArray = []
    this.shortNames = {}
    this.registeredShortNames = []
    this.getJoinText = builder.getJoinText
    if (friendlySqlAliases) {
      this.forbiddenAlias = builder.parentBuilder ? builder.parentBuilder.datasources.forbiddenAlias : []
    } else {
      this.aliasCounter = builder.parentBuilder ? builder.parentBuilder.datasources.aliasCounter : new AliasCounter()
    }
  }
  getItem (entity, level) {
    let levelItem = (this.items.get(level))
    if (!levelItem) {
      levelItem = new Map()
      this.items.set(level, levelItem)
    }
    const selectName = (entity.mapping && entity.mapping.selectName) || entity.name
    let item = levelItem.get(selectName)
    if (!item) {
      levelItem.set(selectName, item = new DataSource(this, entity, level))
      this.itemsArray.push(item)
      if (!this.mainDsItem) {
        this.mainDsItem = item
      }
    }
    return item
  }
  getSQL () {
    const res = []
    for (let item of this.itemsArray) {
      if (item === this.mainDsItem) {
        res.push(` FROM ${item.selectName} ${item.uniqCalcShortName}`)
      }
      res.push.apply(res, item.joinList.getSQL())
    }
    return res.join(' ')
  }
}

module.exports = DataSourceList