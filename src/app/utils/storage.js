"use client";

import secureLocalStorage from "react-secure-storage";

// Define constants for local storage keys to prevent key mismatches throughout the app.
export const STORAGE_KEYS = {
  GAME_OVER: btoa("govr"),
  GAME_STATE: btoa("mnc-gstt"),
  GAME_PROCESS: btoa("gpcs"),
  GAME_LEVEL: btoa("gslvl"),
  GAME_CONFIG_SOUND: btoa("gcfgsnd"),
  PLAYER_OBJECT: btoa("plr"),
  PLAYER_LIFES: btoa("plrlfe"),
};

/**
 * An abstraction over react-secure-storage to provide more specific storage operations
 * and to encapsulate the logic for storing different types of game state.
 */
export const storage = {
  /**
   * Saves a value under a specified key in secure local storage.
   * @param {string} key - Storage key under which the value is stored.
   * @param {any} value - Value to be stored.
   */
  save: (key, value) => {
    secureLocalStorage.setItem(key, value);
  },
  /**
   * Retrieves a value from secure local storage, returning a default if not found.
   * @param {string} key - Storage key to retrieve the value from.
   * @param {any} defaultValue - Default value to return if the key does not exist.
   * @returns {any} The value found in storage or the default value.
   */
  find: (key, defaultValue = null) => {
    const value = secureLocalStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return value;
  },
  /**
   * Enables a setting by setting its value to 1 in secure local storage.
   * @param {string} key - Storage key to enable.
   */
  enable: (key) => {
    secureLocalStorage.setItem(key, 1);
  },
  /**
   * Disables a setting by setting its value to 0 in secure local storage.
   * @param {string} key - Storage key to disable.
   */
  disable: (key) => {
    secureLocalStorage.setItem(key, 0);
  },
  /**
   * Checks if a setting is enabled (i.e., its value is truthy).
   * @param {string} key - Storage key to check.
   * @returns {boolean} True if the value is enabled, otherwise false.
   */
  isEnable: (key) => {
    const value = secureLocalStorage.getItem(key);
    return value ? Boolean(Number(value)) : false;
  },
  /**
   * Checks if a setting is disabled (i.e., its value is falsy).
   * @param {string} key - Storage key to check.
   * @returns {boolean} True if the value is disabled, otherwise false.
   */
  isDisable: (key) => {
    return !storage.isEnable(key);
  },
};

/**
 * Specific storage operations for game engine state, utilizing the storage object.
 */
export const DB = {
  setLevel: (level) => storage.save(STORAGE_KEYS.GAME_LEVEL, level),
  getLevel: () => storage.find(STORAGE_KEYS.GAME_LEVEL, 0),
  setState: (state) => storage.save(STORAGE_KEYS.GAME_STATE, state),
  getState: () => storage.find(STORAGE_KEYS.GAME_STATE),
  setLifes: (lifes) => storage.save(STORAGE_KEYS.PLAYER_LIFES, lifes),
  getLifes: () => storage.find(STORAGE_KEYS.PLAYER_LIFES, 0),
  setData: (player) =>
    storage.save(STORAGE_KEYS.PLAYER_OBJECT, JSON.stringify(player)),
  getData: () => JSON.parse(storage.find(STORAGE_KEYS.PLAYER_OBJECT)),
  mute: () => storage.save(STORAGE_KEYS.GAME_CONFIG_SOUND, true),
  unMute: () => storage.save(STORAGE_KEYS.GAME_CONFIG_SOUND, false),
  isMuted: () => storage.find(STORAGE_KEYS.GAME_CONFIG_SOUND, null),
};
