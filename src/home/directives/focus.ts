import { App } from "vue"

function focus(el: HTMLElement) {
    if (el.nodeName !== 'INPUT') {
        el = el.querySelector('input') || el
    }
    el.focus()
}

const vFocus = {
    name: 'focus',
    mounted(el: HTMLElement) {
        focus(el)
    },
    updated(el: HTMLElement) {
        focus(el)
    }
}

export default {
    install(app: App) {
        app.directive(vFocus.name, vFocus)
    }
}