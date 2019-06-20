module.exports = class {
  constructor() {
    this.arr = new Array()
  }

  addFirst(element) {
    this.arr.unshift(element)
  }

  addLast(element) {
    this.arr.push(element)
  }

  deleteFirst() {
    this.arr.shift()
  }

  deleteLast() {
    this.arr.pop()
  }

}