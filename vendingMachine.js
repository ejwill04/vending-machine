export default class VendingMachine {
  constructor() {
    this.state = {
      status: "idle",
      credits: 0,
      change: 0,
      message: '',
      userSelection: '',
      selection: {
        A1: [{ name: 'Skittles', price: 75}],
        B1: [{ name: 'Snickers', price: 75}],
        C1: [{ name: 'pot roast', price: 75}],
        A2: [{ name: 'pasta', price: 75}],
        B2: [{ name: 'cortado', price: 75}],
        C2: [{ name: 'bubble gum', price: 75}]
      }
     }
  }

  insertCredit(user, credit) {
    this.state.credits = credit
    this.state.status = 'credited'
  }

  itemSelected(selection) {
    this.state.userSelection = selection
    if (this.selectionExists()) {
      this.sufficientCredits() ?
        this.getItemAndChange() : this.state.message = 'insufficient credits'
    } else {
      this.state.message = 'That item does not exist'
    }
  }

  selectionExists() {
    let exists = Object.keys(this.state.selection).find(vend => vend === this.state.userSelection)
    return exists ? true : false
  }

  sufficientCredits() {
    let userSelection = this.state.userSelection
    return this.state.selection[userSelection][0].price <= this.state.credits
  }

  getItemAndChange() {
    this.state.message = 'Grab that which will kill you'
    let userSelection = this.state.userSelection
    let price = this.state.selection[userSelection].shift().price
    this.state.change = ( this.state.credits -= price)
    this.state.credits = 0
  }

  reset() {
    this.constructor()
  }

  // displayItems() {
  //   $('#items').empty()
  //   Object.keys(vendingMachine.state.selection).map(key => {
  //     if (!vendingMachine.state.selection[key][0]) {
  //       $('#items').append(`
  //         <div class='item'>
  //           <div>No longer available</div>
  //         </div>`)
  //       } else {
  //         $('#items').append(`
  //           <div class='item'>
  //             <div>${key}</div>
  //             <div>${vendingMachine.state.selection[key][0].name}</div>
  //             <div>$0.${vendingMachine.state.selection[key][0].price}</div>
  //           </div>
  //         `)
  //       }
  //   })
  // }
}

// const vendingMachine = new VendingMachine()
// vendingMachine.displayItems()
//
// $('#insert-coins-btn').on('click', () => {
//   let credit = $('#insert-hole').val()
//   vendingMachine.insertCredit('You', credit)
//   $('#credit-count').html(`$${vendingMachine.state.credits/100}`)
//   $('#insert-hole').val('')
// })
//
// $('#vend').on('click', () => {
//   let selection = $('#selection-input').val().toUpperCase()
//   vendingMachine.itemSelected(selection)
//   $('#message-display').html(vendingMachine.state.message)
//   vendingMachine.displayItems()
//   $('#selection-input').val('')
//   $('#credit-count').html(`Change: $${vendingMachine.state.change/100}`)
// })
