class Scheduler {
    queue: Function[]
    limit: number
    activeCount: number

    constructor(limit = 2) {
        this.queue = []
        this.limit = limit
        this.activeCount = 0
    }

    get pendingCount() {
        return this.queue.length
    }

    async add(action: () => Promise<any>) {
        if (typeof action !== 'function') {
            throw new TypeError('action is not a function')
        }

        return new Promise((resolve, reject) => {
            const task = async () => {
                try {
                    const res = await action()
                    resolve(res)
                } catch (error) {
                    reject(error)
                } finally {
                    this.activeCount--
                    this.next()
                }
            }
            this.queue.push(task)
            this.next()
        })
    }

    next() {
        if (this.pendingCount > 0 && this.activeCount < this.limit) {
            this.activeCount++
            const task = this.queue.shift()
            task && task()
        }
    }
    
    clear() {
        this.queue.length = 0
    }
}

export default Scheduler
