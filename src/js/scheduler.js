class Scheduler {
    constructor(limit = 2) {
        this.queue = []
        this.limit = limit
        this.activeCount = 0
    }

    get pendingCount() {
        return this.queue.length
    }

    add(action) {
        if (typeof action !== 'function') {
            throw new TypeError('action is not a function')
        }

        if (this.activeCount < this.limit) {
            this.activeCount++
            return action().then(res => {
                this.activeCount--
                this.next()
                return res
            })
        } else {
            let resolve, reject
            let ret = new Promise((r, j) => { 
                resolve = r
                reject = j
            })
            this.queue.push(() => {
                action()
                    .then(res => {
                        resolve(res)
                        this.activeCount--
                        this.next()
                    })
                    .catch(err => {
                        reject(err)
                        this.activeCount--
                        this.next()
                    })
            })
            return ret
        }
    }

    next() {
        if (this.pendingCount > 0 && this.activeCount < this.limit) {
            let task = this.queue.shift()
            this.activeCount++
            task()
        }
    }
    
    clear() {
        this.queue.length = 0
    }
}

export default Scheduler
