import { test, expect } from 'vitest'
import Scheduler from '../src/home/utils/scheduler'

test('Concurrency limit', async () => {
    const scheduler = new Scheduler(2)
    const tasks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const task = async (i: number) => {
            if (i === 5) {
                throw new Error('Test Case ' + i)
            }
            return Promise.resolve(i)
        }

        return scheduler
            .add(() => task(i))
            .then((res) => {
                console.log(res, scheduler.activeCount, scheduler.pendingCount)
                return res
            })
    })
    const result = await Promise.allSettled(tasks)

    for (let i = 0; i < 10; i++) {
        const res = result[i]
        if (i === 5) {
            expect(res.status).toBe('rejected')
            expect(res['reason'].message).toBe('Test Case 5')
        } else {
            expect(res.status).toBe('fulfilled')
            expect(res['value']).toBe(i)
        }
    }
})
