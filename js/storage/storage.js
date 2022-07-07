/**
 * 设置本地存储键值对
 * @param {*} key 
 * @param {*} value 
 */
function setLocalValue(key, value) {
    localStorage.setItem(key, value)
}
/**
 * 获取本地存储值
 * @param {*} key 
 * @returns 
 */
function getLocalValue(key) {
    return localStorage.getItem(key)
}
export { setLocalValue, getLocalValue }