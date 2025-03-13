import * as SecureStore from 'expo-secure-store'

export const saveSecure = async (key, value) => {
    await SecureStore.setItemAsync(key, value)
}

export const getSecure = async (key) => {
    const result = await SecureStore.getItemAsync(key)
    return result
}

export const deleteSecure = async (key) => {
    await SecureStore.deleteItemAsync(key)
}


