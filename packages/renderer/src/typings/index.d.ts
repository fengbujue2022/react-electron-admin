declare module '@Ma' {
  type OmitId<T> = Omit<T, 'objectId'>
  interface BaseEntity {
    objectId: string
  }

  interface RowReturnType<T> {
    totalCount: number
    data: T[]
    relatedDataMap?: { [key in string]: any[] }
  }

  module DataModel {
    interface Reporter extends BaseEntity {
      name: string
      phonenumber: string
      account: string
      project_group: number
      mail: string
    }

    interface Problem extends BaseEntity {
      description: string
      reporterId: string
    }
  }

  module ViewModel {
    interface Problem extends BaseEntity {
      description: string
      reporterName?: string
      reporterTel?: string
    }
  }
}
