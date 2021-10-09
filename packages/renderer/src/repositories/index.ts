import { BaseLeanCloudRepository } from './baseRepository'
import { DataModel } from '@Ma'
import { init } from 'leancloud-storage'

// https://console.leancloud.cn/apps
export const initRepository = () => {
  init({
    appId: 'j7J65YbfrIfdtk5D9Iaifg0S-gzGzoHsz',
    appKey: 'JFGFT4KW2KFbLCGuYAF4H2tH',
    serverURL: 'https://j7j65ybf.lc-cn-n1-shared.com',
  })
}

initRepository()

export const ReporterRepository = new BaseLeanCloudRepository<DataModel.Reporter>('reporter')

export const ProblemRepository = new BaseLeanCloudRepository<DataModel.Problem>('problem')
