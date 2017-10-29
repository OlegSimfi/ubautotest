/**
 * @module class1
*/

const Class1 = require('./class1')

class Class2 extends Class1 {
  someMethod () {
    for (let i = 0; i < 2; i++) {
      console.log(i)
    }
  }

  testMethod () {
    console.log('class2 testMethod')
    console.log(`class2 testMethod ${this.prop1}`)
  }
}

module.exports = Class2
