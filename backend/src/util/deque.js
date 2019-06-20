module.exports = class {
  constructor() {
    this.arr = new Array()
    this.limit = 10
  }

  addFirst(element) {
    if (this.arr.length < this.limit) {
      this.arr.unshift(element)
    } else {
      this.deleteLast()
      this.arr.unshift(element)
    }
    return this
  }

  addLast(element) {
    if (this.arr.length < this.limit) {
      this.arr.push(element)
    } else {
      this.deleteLast()
      this.arr.push(element)
    }
    return this
  }

  deleteFirst() {
    this.arr.shift()
    return this
  }

  deleteLast() {
    this.arr.pop()
    return this
  }

}