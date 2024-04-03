class Whitelist {
    STORAGE_KEY = 'whitelist'
    list: Set<string>
    storage = window.localStorage

    constructor() {
        let listJSON = this.storage.getItem(this.STORAGE_KEY)
        this.list = new Set(
            listJSON ? JSON.parse(listJSON) : []
        )
    }

    add(urls: string | string[]) {
        if (!Array.isArray(urls)) {
            urls = [ urls ]
        }
        urls.forEach(url => url && this.list.add(url))
        this.save()
    }

    remove(urls: string | string[]) {
        if (!Array.isArray(urls)) {
            urls = [ urls ]
        }
        urls.forEach(x => this.list.delete(x))
        this.save()
    }

    has(url: string) {
        return this.list.has(url)
    }

    private save() {
        this.storage.setItem(this.STORAGE_KEY, JSON.stringify([ ...this.list ]))
    }
}

export default new Whitelist()
