export class Whitelist {
    STORAGE_KEY = 'whitelist'
    list: Set<string>

    constructor() {
        let listJSON = sessionStorage.getItem(this.STORAGE_KEY)
        this.list = new Set(
            listJSON ? JSON.parse(listJSON) : []
        )
    }

    add(ids: string | string[]) {
        if (!Array.isArray(ids)) {
            ids = [ ids ]
        }
        ids.forEach(x => this.list.add(x))
        this.save()
    }

    remove(ids: string | string[]) {
        if (!Array.isArray(ids)) {
            ids = [ ids ]
        }
        ids.forEach(x => this.list.delete(x))
        this.save()
    }

    has(id: string) {
        return this.list.has(id)
    }

    private save() {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify([ ...this.list ]))
    }
}
