import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from '../log';
import { LocalStorageKey } from './keys';

export class LocalStorage {
    /**
     * Saves a key-value pair to local storage.
     * @param key The key to store.
     * @param value The value to store.
     */
    static async setItem(key: LocalStorageKey, value: string): Promise<void> {
        try {
            await AsyncStorage.setItem(key, value);
            Logger.debug(`LocalStorage: Set item for key "${key}"`);
        } catch (error) {
            Logger.exception(error as Error, `LocalStorage: Failed to set item for key "${key}"`);
            throw error;
        }
    }

    /**
     * Retrieves a value from local storage.
     * @param key The key to retrieve.
     * @returns The value, or null if not found.
     */
    static async getItem(key: LocalStorageKey): Promise<string | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value) {
                Logger.debug(`LocalStorage: Retrieved item for key "${key}"`);
            } else {
                Logger.debug(`LocalStorage: No item found for key "${key}"`);
            }
            return value;
        } catch (error) {
            Logger.exception(error as Error, `LocalStorage: Failed to get item for key "${key}"`);
            throw error;
        }
    }

    /**
     * Removes an item from local storage.
     * @param key The key to remove.
     */
    static async removeItem(key: LocalStorageKey): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
            Logger.debug(`LocalStorage: Removed item for key "${key}"`);
        } catch (error) {
            Logger.exception(error as Error, `LocalStorage: Failed to remove item for key "${key}"`);
            throw error;
        }
    }

    /**
     * Saves an object to local storage as JSON.
     * @param key The key to store.
     * @param value The object to store.
     */
    static async setObject<T>(key: LocalStorageKey, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            Logger.debug(`LocalStorage: Set object for key "${key}"`);
        } catch (error) {
            Logger.exception(error as Error, `LocalStorage: Failed to set object for key "${key}"`);
            throw error;
        }
    }

    /**
     * Retrieves an object from local storage.
     * @param key The key to retrieve.
     * @returns The parsed object, or null if not found.
     */
    static async getObject<T>(key: LocalStorageKey): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            if (jsonValue) {
                Logger.debug(`LocalStorage: Retrieved object for key "${key}"`);
                return JSON.parse(jsonValue) as T;
            } else {
                Logger.debug(`LocalStorage: No object found for key "${key}"`);
                return null;
            }
        } catch (error) {
            Logger.exception(error as Error, `LocalStorage: Failed to get object for key "${key}"`);
            throw error;
        }
    }
}