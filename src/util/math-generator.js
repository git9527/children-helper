import Operators from "./Operators";

const math = require('mathjs');
import random from 'random'

export default class MathGenerator {

  static isLowerLeverOperator(operator) {
    return operator === Operators.ADDITION || operator === Operators.SUBSTRUCTION
  }

  static calculate(expression) {
    return math.evaluate(expression)
  }

  static translateQuestion(numbers, operators) {
    let question = ''
    for (let i = 0; i < numbers.length; i++) {
      question = question + numbers[i]
      if (i !== numbers.length - 1) {
        question = question + operators[i].label
      }
    }
    return question
  }

  static calculateQuestion(numbers, operators) {
    let question = ''
    for (let i = 0; i < numbers.length; i++) {
      question = question + numbers[i]
      if (i !== numbers.length - 1) {
        question = question + operators[i].operation
      }
    }
    try {
      return this.calculate(question)
    } catch (e) {
      console.error('numbers', numbers, 'operators', operators)
    }
  }

  static isPrime(num) {
    return math.isPrime(num)
  }

  static findAllDivisors(source) {
    return this.findAllDivisorsLessThan(source, source)
  }

  static findAllDivisorsLessThan(source, target) {
    let numbers = []
    let sqrt = math.sqrt(source)
    for (let i = 1; i < sqrt; i++) {
      if (source % i === 0) {
        if (source / i <= target) {
          numbers.push(source / i)
        }
        if (i <= target) {
          numbers.push(i)
        }
      }
    }
    if (sqrt * sqrt === source) {
      numbers.push(sqrt)
    }
    numbers.sort((a, b) => a - b)
    return numbers
  }

  static randomInRange(a, b) {
    const maxNum = a > b ? a : b
    const minNum = a > b ? b : a
    return random.int(minNum, maxNum - 1)
  }

  static randomInArray(sourceArray) {
    const randomIndex = this.randomInRange(0, sourceArray.length)
    return sourceArray[randomIndex]
  }

  static isWithinDivisionFormula(number) {
    if (number === 0) {
      return false
    }
    for (let i = 2; i < 10; i++) {
      if (number % i === 0 && number / i < 10) {
        return true
      }
    }
    return false
  }

  static getRandomNumberAndOperator(current, max) {
    let nextNumber = 0
    const operators = [Operators.ADDITION, Operators.SUBSTRUCTION]
    if (this.isWithinDivisionFormula(current)) {
      operators.push(Operators.DIVISION)
    }
    if (current < 10) {
      operators.push(Operators.MULTIPLICATION)
    }
    const randomOperator = this.randomInArray(operators)
    // const randomOperator = Operators.DIVISION
    if (randomOperator === Operators.ADDITION) {
      nextNumber = this.randomInRange(1, max - current)
    } else if (randomOperator === Operators.SUBSTRUCTION) {
      nextNumber = this.randomInRange(1, current)
    } else if (randomOperator === Operators.MULTIPLICATION) {
      nextNumber = this.randomInRange(2, 10)
    } else if (randomOperator === Operators.DIVISION) {
      const allDivisors = this.findAllDivisorsLessThan(current, 9)
      const largest = allDivisors[allDivisors.length - 1]
      const potentialNumbers = [largest, current / largest]
      nextNumber = this.randomInArray(potentialNumbers)
    }
    return {
      'number': nextNumber,
      'operator': randomOperator
    }
  }

  static addParenthesesIfNeed(numbers, operators) {
    const firstOperator = operators[0]
    const secondOperator = operators[1]
    if (this.isLowerLeverOperator(firstOperator) && !this.isLowerLeverOperator(secondOperator)) {
      let _numbers = []
      let _operators = []
      if (operators[1] === Operators.MULTIPLICATION) {
        _numbers = [numbers[2], '(' + numbers[0], numbers[1] + ')']
        _operators = [operators[1], operators[0]]
      } else {
        _numbers = ['(' + numbers[0], numbers[1] + ')', numbers[2]]
        _operators = operators
      }
      return {
        'numbers': _numbers,
        'operations': _operators
      }
    } else {
      return {
        'numbers': numbers,
        'operations': operators
      }
    }
  }
}

