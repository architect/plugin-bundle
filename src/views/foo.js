export function foo() {
  let message = 'we called foo!'
  console.log(message)
  window.document.getElementsByTagName('main')[0].innerHTML = message
}
