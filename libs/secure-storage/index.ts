import * as SecureStore from 'expo-secure-store';
import { Logger } from '../log';
import { SecureStorageKey } from './keys';

export class SecureStorage {
    /**
     * Saves a key-value pair to secure storage.
     * @param key The key to store.
     * @param value The value to store.
     */
    static async setItem(key: SecureStorageKey, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
            Logger.debug(`SecureStorage: Set item for key "${key}"`);
        } catch (error) {
            Logger.exception(error as Error, `SecureStorage: Failed to set item for key "${key}"`);
            throw error;
        }
    }

    /**
     * Retrieves a value from secure storage.
     * @param key The key to retrieve.
     * @returns The value, or null if not found.
     */
    static async getItem(key: SecureStorageKey): Promise<string | null> {
        try {
            const value = await SecureStore.getItemAsync(key);
            if (value) {
                Logger.debug(`SecureStorage: Retrieved item for key "${key}"`);
            } else {
                Logger.debug(`SecureStorage: No item found for key "${key}"`);
            }
            return value;
        } catch (error) {
            Logger.exception(error as Error, `SecureStorage: Failed to get item for key "${key}"`);
            throw error;
        }
    }

    /**
     * Removes an item from secure storage.
     * @param key The key to remove.
     */
    static async removeItem(key: SecureStorageKey): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
            Logger.debug(`SecureStorage: Removed item for key "${key}"`);
        } catch (error) {
            Logger.exception(error as Error, `SecureStorage: Failed to remove item for key "${key}"`);
            throw error;
        }
    }
}