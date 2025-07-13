/**
 * Generic Queue implementation for NLibrary
 * Used for managing turn order in battle system
 */
export class Queue<T> {
    private items: T[] = [];
    
    /**
     * Add an item to the end of the queue
     */
    enqueue(item: T): void {
        this.items.push(item);
    }
    
    /**
     * Remove and return the first item from the queue
     */
    dequeue(): T | undefined {
        return this.items.shift();
    }
    
    /**
     * Get the first item without removing it
     */
    peek(): T | undefined {
        return this.items[0];
    }
    
    /**
     * Check if the queue is empty
     */
    isEmpty(): boolean {
        return this.items.length === 0;
    }
    
    /**
     * Get the size of the queue
     */
    size(): number {
        return this.items.length;
    }
    
    /**
     * Clear all items from the queue
     */
    clear(): void {
        this.items = [];
    }
    
    /**
     * Convert queue to array
     */
    toArray(): T[] {
        return [...this.items];
    }
} 