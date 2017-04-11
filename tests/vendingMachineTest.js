require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert
const VendingMachine = require('../vendingMachine').default
const Person = require('../person').default

describe('Elevator', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person("Alex", 100)

  afterEach(function() {
    vendingMachine.reset();
  });

  it('should take users creates and check for change', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    vendingMachine.insertCredit(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.change, 0)
  });

  it('should be able to make a correct selection and receive item if sufficient credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredit(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.itemSelected('A1')
    assert.equal(vendingMachine.state.userSelection, 'A1')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 25)
    assert.deepEqual(vendingMachine.state.selection['A1'], [])
    assert.equal(vendingMachine.state.message, 'Grab that which will kill you')
    vendingMachine.reset();
  })

  it('should be able to make a correct selection and receive error if insufficient credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredit(alex, 50)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 50)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.itemSelected('A1')
    assert.equal(vendingMachine.state.userSelection, 'A1')
    assert.equal(vendingMachine.state.credits, 50)
    assert.equal(vendingMachine.state.change, 0)
    assert.deepEqual(vendingMachine.state.selection['A1'], [{ name: 'Skittles', price: 75}])
    assert.equal(vendingMachine.state.message, 'insufficient credits')
    vendingMachine.reset()
  })

  it('should recive error if incorrect selection', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredit(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.itemSelected('Z13')
    assert.equal(vendingMachine.state.userSelection, 'Z13')
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.change, 0)
    assert.equal(vendingMachine.state.selection['Z13'], undefined)
    assert.equal(vendingMachine.state.message, 'That item does not exist')
    vendingMachine.reset()
  })

  it('should update update credits and status when insertCredit is called', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredit('alex', 300)

    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 300)
    vendingMachine.reset()
  })

  it('should check if item exists when selectionExists is called', () => {
    vendingMachine.state.userSelection = 'B1'
    assert.equal(vendingMachine.selectionExists(), true)
    vendingMachine.reset()
  })

  it('should return true when sufficientCredits is called and there are sufficient credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredit('alex', 300)

    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 300)
    vendingMachine.state.userSelection = 'B1'
    assert.equal(vendingMachine.sufficientCredits(), true)
    vendingMachine.reset()
  })

  it('should return false when sufficientCredits is called and there are insufficient credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredit('alex', 10)

    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 10)
    vendingMachine.state.userSelection = 'B1'
    assert.equal(vendingMachine.sufficientCredits(), false)
    vendingMachine.reset()
  })

  it('getItemAndChange should update selection, change, and credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredit('alex', 100)

    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    vendingMachine.state.userSelection = 'B1'
    vendingMachine.getItemAndChange()
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 25)
    assert.deepEqual(vendingMachine.state.selection['B1'], [])
    vendingMachine.reset()
  })

  it('A person inserts 200 credits ($2.00) and selects a specific treat that costs less than 100 credits. Same person selects another specific treat that costs less than 100 credits', () => {

    const elijah = new Person("Elijah")
    elijah.goToATM(200)
    assert.equal(elijah.state.credits, 200)

    assert.equal(vendingMachine.state.status, 'idle')
    vendingMachine.insertCredit(elijah, elijah.state.credits)
    elijah.userInsertsCredits(200)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 200)

    assert.equal(elijah.state.credits, 0)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.itemSelected('A1')
    assert.equal(vendingMachine.state.userSelection, 'A1')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 125)
    assert.deepEqual(vendingMachine.state.selection['A1'], [])
    assert.equal(vendingMachine.state.message, 'Grab that which will kill you')

    elijah.userReceivedCredits(vendingMachine.state.change)
    assert.equal(elijah.state.credits, 125)

    vendingMachine.insertCredit(elijah, elijah.state.credits)
    elijah.userInsertsCredits(125)
    assert.equal(elijah.state.credits, 0)

    vendingMachine.itemSelected('B1')
    assert.equal(vendingMachine.state.userSelection, 'B1')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 50)
    assert.deepEqual(vendingMachine.state.selection['B1'], [])
    assert.equal(vendingMachine.state.message, 'Grab that which will kill you')

    elijah.userReceivedCredits(vendingMachine.state.change)
    assert.equal(elijah.state.credits, 50)
  })

});
