
/**
 * 表单身份验证 结合element-form
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validatorIdCard(rule, value, callback) {
  const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (rule.required && value === '') {
    callback('请输入身份证号')
  } else if (value === '') {
    callback()
  } else if (value && !regIdCard.test(value)) {
    return callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}

/**
 * 结合element-form 表单手机号验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validatorPhone(rule, value, callback) {
  const regPhone = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
  if (rule.required && value === '') {
    callback('请输入手机号码')
  } else if (value === '') {
    callback('')
  } else if (!regPhone.test(value)) {
    return callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
