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

        if (this.activeCount < this.limit) {
            this.activeCount++
            try {
                return await action()
            } finally {
                this.activeCount--
                this.next()
            }
        } else {
            let resolve: (value: unknown) => void
            let reject: (reason?: any) => void
            const ret = new Promise((res, rej) => {
                resolve = res
                reject = rej
            })
            const actionFunc = async () => {
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
            this.queue.push(actionFunc as never)
            return ret
        }
    }

    next() {
        if (this.pendingCount > 0 && this.activeCount < this.limit) {
            let task = this.queue.shift()
            this.activeCount++
            task && task()
        }
    }
    
    clear() {
        this.queue.length = 0
    }
}

export default Scheduler
