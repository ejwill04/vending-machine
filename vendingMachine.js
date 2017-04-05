export default class VendingMachine {
  constructor() {
    // status can be ["idle", "credited", "vending"]
    this.state = {
      status: "idle",
      credits: 0,
      change: 0,
      message: '',
      selection: {
        A1: [75],
        B1: [75],
        C1: [75],
        A2: [75],
        B2: [75],
        C2: [75]
      }
     }
  }

  insertCredit(user, credit) {
    this.state.credits = credit
    this.state.status = 'credited'
  }

  selectionExists(selection) {
    let exists = Object.keys(this.state.selection).find(vend => vend === selection)
    return exists ? true : this.state.message = 'That item does not exist'
  }

  sufficientCredits(selection) {
    if (this.state.selection[selection][0] <= this.state.credits) {
      let price = this.state.selection[selection].shift()
      this.state.change = ( this.state.credits -= price )
      this.state.credits = 0
    } else {
      this.state.message = 'insufficient credits'
    }
  }

  reset() {
    this.constructor()
  }
}
