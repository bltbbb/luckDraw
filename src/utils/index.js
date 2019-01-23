import request from './request'

/**
* 基于request.js二次封装 用于业务代码请求
* @param     { Sring }       url       请求地址
* @param     { Object }      data      请求参数
* @param     { String }      type      请求类型，get还是post  默认get
* @return    { Promise }     返回一个Promise  resove会返回请求成功的数据，reject会提示错误
*/
function fetchData(url, data = {}, type = 'get') {
  return new Promise((resolve, reject) => {
    if (type.toLowerCase() === 'get') {
      request.get(url, { ...data }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
      return
    } else if (type.toLowerCase() === 'put') {
      request.put(url, data).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
      return
    }
    request.post(url, data).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

export default {
  fetchData
}
