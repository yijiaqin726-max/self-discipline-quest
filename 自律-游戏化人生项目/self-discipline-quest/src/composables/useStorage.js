import { ref, watch } from 'vue'

/**
 * 持久化到 LocalStorage 的响应式数据
 * @param {string} key - localStorage key
 * @param {any} defaultValue - 初始默认值
 */
export function useStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const data = ref(stored !== null ? JSON.parse(stored) : defaultValue)

  watch(
    data,
    (val) => {
      localStorage.setItem(key, JSON.stringify(val))
    },
    { deep: true }
  )

  return data
}
