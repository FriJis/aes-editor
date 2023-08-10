export const copy = (text: string) => {
    const i = document.createElement('input')
    i.value = text
    document.body.append(i)
    i.select()
    document.execCommand('copy')
    i.remove()
}
