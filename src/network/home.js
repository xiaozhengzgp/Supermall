import { request } from 'network/request'

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}

// 函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
// 函数调用结束 -> 弹出函数栈(释放函数所有的变量)
// function test() {
//   const names = ['why', 'aaa']
// }
//
// test()
//
// test()

// let totalNums = []

// const nums1 = [10, 20, 30, 40]
// const nums2 = [100, 200, 300, 400]

// // for (let n of nums1) {
// //   totalNums.push(n)
// //   console.log(totalNums);
// // } 

// totalNums.push(...nums1)
// console.log(totalNums);