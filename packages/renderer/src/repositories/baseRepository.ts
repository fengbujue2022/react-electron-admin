import { BaseEntity, RowReturnType } from '@Ma'
import AV from 'leancloud-storage/live-query'

const inherentProperties = ['id', 'objectId', 'updatedAt', 'createdAt']

export class BaseLeanCloudRepository<TEntity extends BaseEntity> {
  private _className: string
  constructor(className: string) {
    this._className = className
  }

  protected newQueryObject() {
    return new AV.Query(this._className)
  }

  async getPagingList(
    rows: number,
    page: number,
    configureQuery?: (query: AV.Query<AV.Queriable>) => void,
    castRelatedDataMap?: (pagingResult: AV.Queriable[]) => { [key in string]: any[] }
  ): Promise<RowReturnType<TEntity>> {
    let relatedDataMap: { [key in string]: any[] } | undefined = undefined
    const query = this.newQueryObject()
    query.limit(rows)
    query.skip(page * rows)
    configureQuery?.call(undefined, query)
    const totalCount = await query.count()
    const pagingResult = await query.find()
    if (castRelatedDataMap) {
      relatedDataMap = castRelatedDataMap(pagingResult)
    }
    return {
      totalCount,
      data: pagingResult.map((x) => x.toJSON() as TEntity),
      relatedDataMap,
    }
  }

  async getCount(configureQuery: (query: AV.Query<AV.Queriable>) => void): Promise<number> {
    const query = this.newQueryObject()
    configureQuery.call(undefined, query)
    return await query.count()
  }

  async getOneById(objectId: string): Promise<TEntity> {
    const result = await this.newQueryObject().equalTo('objectId', objectId).first()
    return result?.toJSON()
  }

  async getManyByIds(objectIds: string[]): Promise<TEntity[]> {
    const result = await AV.Query.or(
      ...objectIds.map((id) => this.newQueryObject().equalTo('objectId', id))
    ).find()
    return result?.map((x) => x.toJSON())
  }

  async create(entity: Omit<TEntity, 'objectId'>): Promise<TEntity> {
    const _class = AV.Object.extend(this._className)
    const data = new _class()
    for (const field of Object.keys(entity)) {
      data.set(field, entity[field])
    }
    const result = await data.save()
    return result.toJSON()
  }

  async update(objectId: string, entity: Partial<TEntity>): Promise<TEntity> {
    const data = AV.Object.createWithoutData(this._className, objectId)

    for (const field of Object.keys(entity)) {
      if (!inherentProperties.includes(field)) {
        data.set(field, entity[field])
      }
    }
    const result = await data.save()
    return result.toJSON()
  }

  async deleteById(objectId: string) {
    const result = await AV.Object.createWithoutData(this._className, objectId).destroy()
    return result
  }

  async deleteByIds(objectIds: string[]) {
    const result = await AV.Object.destroyAll(
      objectIds.map((objectId) => AV.Object.createWithoutData(this._className, objectId))
    )
    return result
  }
}
