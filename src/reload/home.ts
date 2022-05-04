if (import.meta.env.DEV) {
    const ws = new WebSocket('ws://localhost:2333')
    
    ws.onmessage = (event) => {
        let msg = JSON.parse(event.data)
        if (msg === 'watch-build-ok') {
            window.location.reload()
        }
    }
}