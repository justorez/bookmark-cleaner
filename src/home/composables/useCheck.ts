import { Bookmark, InvalidBookmark } from '../interface'
import Scheduler from '../utils/scheduler'
import whitelist from '../utils/whitelist'
import { checkURL } from '../utils/check'

export interface UseCheckOptions {
    bookmarks: Ref<Bookmark[]>
}
export function useCheck(options: UseCheckOptions) {
    const { bookmarks } = options
    const invalidBookmarks = ref<InvalidBookmark[]>([])
    const timeout = ref(10)
    const checkStartIndex = ref(0)
    const percentage = ref(0)
    const scheduler = new Scheduler(10)
    const showProgress = ref(false)
    const checkLoading = ref(false)
    const checkButtonText = computed(() => {
        return checkLoading.value
            ? '检测中...'
            : checkStartIndex.value === 0
            ? '开始检测'
            : '继续检测'
    })

    function start() {
        bookmarks.value = bookmarks.value.filter(
            (item) => item.url && !whitelist.has(item.url)
        )
        const list = bookmarks.value.slice(checkStartIndex.value)

        const step = 100 / bookmarks.value.length
        console.log('[startCheck]', checkStartIndex.value, step)

        showProgress.value = true
        checkLoading.value = true

        for (const item of list) {
            scheduler
                .add(() => checkURL(item.url, timeout.value))
                .catch((error) => {
                    invalidBookmarks.value.push({
                        ...item,
                        error
                    })
                })
                .finally(() => {
                    checkStartIndex.value++
                    percentage.value += step
                })
        }
    }

    function stop() {
        console.log(
            '[stopCheck]',
            checkStartIndex.value,
            bookmarks.value.length
        )
        scheduler.clear()
        showProgress.value = false
        checkLoading.value = false
    }

    function reset() {
        scheduler.clear()
        timeout.value = 10
        invalidBookmarks.value = []
        checkStartIndex.value = 0
        percentage.value = 0
        showProgress.value = false
        checkLoading.value = false
    }

    function formatProgress(percentage: number) {
        return percentage >= 100 ? '100%' : `${Number(percentage).toFixed(2)}%`
    }

    return {
        timeout,
        checkStartIndex,
        checkButtonText,
        checkLoading,
        showProgress,
        percentage,
        invalidBookmarks,
        start,
        stop,
        reset,
        formatProgress
    }
}
