/**
 * Priority Queue implementation for NLibrary
 * Used for speed-based turn order in battle system
 */
export class PriorityQueue<T> {
    private items: Array<{ element: T; priority: number }> = [];
    
    /**
     * Add an element with priority
     */
    enqueue(element: T, priority: number): void {
        const queueElement = { element, priority };
        let added = false;
        
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority > this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        
        if (!added) {
            this.items.push(queueElement);
        }
    }
    
    /**
     * Remove and return the highest priority element
     */
    dequeue(): T | undefined {
        const item = this.items.shift();
        return item?.element;
    }
    
    /**
     * Get the highest priority element without removing
     */
    peek(): T | undefined {
        return this.items[0]?.element;
    }
    
    /**
     * Check if queue is empty
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
     * Clear all items
     */
    clear(): void {
        this.items = [];
    }
    
    /**
     * Get all elements as array (ordered by priority)
     */
    toArray(): T[] {
        return this.items.map(item => item.element);
    }
} 