/**
 * Typed Event Bus for cross-feature communication
 *
 * Enables decoupled communication between features (e.g., lesson completion
 * triggers XP earning without direct imports between modules).
 */

import type { EventMap } from '../types/gamification'

type EventCallback<K extends keyof EventMap> = (payload: EventMap[K]) => void

type Listener = {
  callback: EventCallback<keyof EventMap>
  once: boolean
}

/**
 * Type-safe event bus implementing publish/subscribe pattern
 */
class EventBus {
  private listeners: Map<keyof EventMap, Set<Listener>> = new Map()
  private eventHistory: Array<{ event: keyof EventMap; payload: EventMap[keyof EventMap]; timestamp: number }> = []
  private maxHistorySize = 100
  private debugMode: boolean = false

  /**
   * Enable or disable debug mode for development
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled
  }

  /**
   * Subscribe to an event
   * @returns Unsubscribe function
   */
  on<K extends keyof EventMap>(event: K, callback: EventCallback<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const listener: Listener = {
      callback: callback as EventCallback<keyof EventMap>,
      once: false,
    }

    this.listeners.get(event)!.add(listener)

    if (this.debugMode) {
      console.log(`[EventBus] Subscribed to "${String(event)}"`)
    }

    // Return unsubscribe function
    return () => {
      this.off(event, callback)
    }
  }

  /**
   * Subscribe to an event once (auto-unsubscribes after first emission)
   * @returns Unsubscribe function
   */
  once<K extends keyof EventMap>(event: K, callback: EventCallback<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const listener: Listener = {
      callback: callback as EventCallback<keyof EventMap>,
      once: true,
    }

    this.listeners.get(event)!.add(listener)

    if (this.debugMode) {
      console.log(`[EventBus] Subscribed once to "${String(event)}"`)
    }

    return () => {
      this.listeners.get(event)?.delete(listener)
    }
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof EventMap>(event: K, callback: EventCallback<K>): void {
    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return

    for (const listener of eventListeners) {
      if (listener.callback === callback) {
        eventListeners.delete(listener)
        break
      }
    }

    if (this.debugMode) {
      console.log(`[EventBus] Unsubscribed from "${String(event)}"`)
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    // Record in history
    this.eventHistory.push({
      event,
      payload,
      timestamp: Date.now(),
    })

    // Trim history if needed
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }

    if (this.debugMode) {
      console.log(`[EventBus] Emitting "${String(event)}"`, payload)
    }

    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return

    const listenersToRemove: Listener[] = []

    for (const listener of eventListeners) {
      try {
        listener.callback(payload)
        if (listener.once) {
          listenersToRemove.push(listener)
        }
      } catch (error) {
        console.error(`[EventBus] Error in listener for "${String(event)}":`, error)
      }
    }

    // Remove one-time listeners
    for (const listener of listenersToRemove) {
      eventListeners.delete(listener)
    }
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.listeners.get(event)?.size ?? 0
  }

  /**
   * Remove all listeners for a specific event
   */
  removeAllListeners<K extends keyof EventMap>(event?: K): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }

    if (this.debugMode) {
      console.log(`[EventBus] Removed all listeners${event ? ` for "${String(event)}"` : ''}`)
    }
  }

  /**
   * Get event history for debugging
   */
  getHistory(): Array<{ event: keyof EventMap; payload: EventMap[keyof EventMap]; timestamp: number }> {
    return [...this.eventHistory]
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = []
  }

  /**
   * Get all registered event types
   */
  getRegisteredEvents(): Array<keyof EventMap> {
    return Array.from(this.listeners.keys())
  }
}

// Singleton instance
export const eventBus = new EventBus()

// Enable debug mode in development
if (import.meta.env.DEV) {
  eventBus.setDebugMode(true)
  // Expose to window for debugging
  ;(window as unknown as { __eventBus: EventBus }).__eventBus = eventBus
}

export default eventBus
