import MathGenerator from "../util/math-generator";
import Operators from "../util/Operators";

test('calculation cases', () => {
  expect(MathGenerator.calculate('1+2*3')).toStrictEqual(7)
  expect(MathGenerator.calculate('16/4+7*6/2')).toStrictEqual(25)
})

test('translate question cases', () => {
  expect(MathGenerator.translateQuestion([1,2,3], [Operators.ADDITION, Operators.MULTIPLICATION])).toStrictEqual('1+2X3')
  expect(MathGenerator.translateQuestion([16,4,7,6,2], [Operators.DIVISION, Operators.ADDITION, Operators.MULTIPLICATION, Operators.DIVISION])).toStrictEqual('16÷4+7X6÷2')
})

test('calculate question cases', () => {
  expect(MathGenerator.calculateQuestion([1,2,3], [Operators.ADDITION, Operators.MULTIPLICATION])).toStrictEqual(7)
  expect(MathGenerator.calculateQuestion([16,4,7,6,2], [Operators.DIVISION, Operators.ADDITION, Operators.MULTIPLICATION, Operators.DIVISION])).toStrictEqual(25)
})

test('is prime cases', () => {
  expect(MathGenerator.isPrime(7)).toStrictEqual(true)
  expect(MathGenerator.isPrime(13123219)).toStrictEqual(true)
})

test('find all divisors', () => {
  expect(MathGenerator.findAllDivisors(96)).toStrictEqual([2, 3, 4, 6, 8, 12, 16, 24, 32, 48])
  expect(MathGenerator.findAllDivisors(100)).toStrictEqual([2, 4, 5, 10, 20, 25, 50])
})

test('find all divisors less than', () => {
  expect(MathGenerator.findAllDivisorsLessThan(96, 10)).toStrictEqual([2, 3, 4, 6, 8])
  expect(MathGenerator.findAllDivisorsLessThan(100, 10)).toStrictEqual([2, 4, 5, 10])
})

test('random in range cases', () => {
  expect(MathGenerator.randomInRange(96, 10) >=10).toStrictEqual(true)
  expect(MathGenerator.randomInRange(100, 10) < 100).toStrictEqual(true)
  expect(MathGenerator.randomInRange(10, 10)).toStrictEqual(10)
})

test('random in array cases', () => {
  const source = [2, 33, 2938]
  const randomNumber = MathGenerator.randomInArray(source)
  expect(source.indexOf(randomNumber) >=0).toStrictEqual(true)
  const operators = [Operators.ADDITION, Operators.SUBSTRUCTION]
  const randomOperator = MathGenerator.randomInArray(operators)
  expect(operators.indexOf(randomOperator) >=0).toStrictEqual(true)
})

test('in division formula', () => {
  expect(MathGenerator.isWithinDivisionFormula(81)).toStrictEqual(true)
  expect(MathGenerator.isWithinDivisionFormula(48)).toStrictEqual(true)
  expect(MathGenerator.isWithinDivisionFormula(35)).toStrictEqual(true)
  expect(MathGenerator.isWithinDivisionFormula(28)).toStrictEqual(true)
  expect(MathGenerator.isWithinDivisionFormula(72)).toStrictEqual(true)
  expect(MathGenerator.isWithinDivisionFormula(76)).toStrictEqual(false)
  expect(MathGenerator.isWithinDivisionFormula(77)).toStrictEqual(false)
})

test('random generation', () => {
  const random1 = MathGenerator.getRandomNumberAndOperator(0, 100)
  expect(random1.operator !== Operators.DIVISION).toStrictEqual(true)
})
