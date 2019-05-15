export default (elem = false) => {
    let h = elem ? elem : document.documentElement
    let b = elem ? elem : document.body
    let st = 'scrollTop'
    let sh = 'scrollHeight'
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}