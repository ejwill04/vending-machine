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
    // Assert the current status of the vendingMachine is idle
    assert.equal(vendingMachine.state.status, 'idle')

    // Alex inserts a dollar into the vending machine
    vendingMachine.insertCredit(alex, 100)

    // Assert the current status of the vendingMachine is 'credited' after credits inserted
    assert.equal(vendingMachine.state.status, 'credited')
    // Assert the total number of credits is 100 cents ($1.00) after credits inserted
    assert.equal(vendingMachine.state.credits, 100)
    // Assert the total number of change is 0 cents ($0.00) before selection is made
    assert.equal(vendingMachine.state.change, 0)
  });

  it('should be able to check if a selection exists', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    vendingMachine.insertCredit(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.selectionExists('A1'), true)
    vendingMachine.reset();

    assert.equal(vendingMachine.state.status, 'idle')
    vendingMachine.insertCredit(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    vendingMachine.selectionExists('Z1')
    assert.equal(vendingMachine.state.message, 'That item does not exist')
  })

  it('should check for sufficient credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    vendingMachine.insertCredit(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    vendingMachine.sufficientCredits('A1')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 25)
    assert.deepEqual(vendingMachine.state.selection['A1'], [])
    vendingMachine.reset();

    assert.equal(vendingMachine.state.status, 'idle')
    vendingMachine.insertCredit(alex, 50)
    assert.equal(vendingMachine.state.status, 'credited')
    vendingMachine.sufficientCredits('A1')
    assert.equal(vendingMachine.state.message, 'insufficient credits')
  })

});
