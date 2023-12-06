import { StudentModel } from '../student.model'

// Counter class
class Counter {
  count: number = 0
  //Methods
  increment() {
    return (this.count = this.count + 1)
  }
  //Methods
  decrement() {
    return (this.count = this.count - 1)
  }
}

//** Creating instance of counter class */
const counter1 = new Counter()
counter1.increment() // instance method
counter1.decrement() // instance method

//& *** Static method ******************************************* /
//& *** Static method ******************************************* /
class staticCounter {
  static count: number = 0

  static increment() {
    return (this.count = this.count + 1)
  }

  static decrement() {
    return (this.count = this.count - 1)
  }
}

// By using static methods, no need to create a new instance
staticCounter.increment() // static method
staticCounter.decrement() // static method

//! Mongoose Built-in Methods ****************************************************************
StudentModel.create() //built in static method

const student = new StudentModel()
student.save() //built in instance method
