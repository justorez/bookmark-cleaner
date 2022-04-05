async function checkURL(url, timeout) {
    if (url.includes('chrome://') || url.includes('edge://')) {
        return Promise.resolve()
    }

    return axios.get(url, { 
        timeout: timeout * 1000
    })
}

async function checkURLByFetch(url, timeout) {
    if (url.includes('chrome://') || url.includes('edge://')) {
        return Promise.resolve()
    }

    const controller = new AbortController()
    const signal = controller.signal
    return Promise.race([
        fetch(url, { signal }),
        new Promise((_, reject) => {
            setTimeout(() => {
                controller.abort()
                let err = new Error('Fetch Timeout')
                err.timeout = true
                reject(err)
            }, this.timeout * 1000)
        })
    ])
}

export {
    checkURL,
    checkURLByFetch
}