// 存储本地缓存数据(使用setStorageSync)

const storage = {};
storage.set = (key, value) => {
  if (!key) return null;
  // 复合类型转为json
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  uni.setStorageSync(key, value);
}

storage.get = (key) => {
  let value = uni.getStorageSync(key);
  if (isJson(value)) {
    value = JSON.parse(value);
  }
  return value;
}

storage.remove = function(key) {
  uni.removeStorageSync(key);
}

storage.clear = function() {
  uni.clearStorageSync();
}

function isJson(str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str);
      if (obj && typeof obj === 'object') {
        return true;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

export default storage;