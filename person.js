export default class Person {
  constructor() {
    // each person starts out with 5 dollars
    this.state = {
      name: '',
      credits: ''
    }
  }

  goToATM(cashOut) {
    this.state.credits = cashOut
  }

  userInsertsCredits(insertedCredits) {
    this.state.credits -= insertedCredits
  }

  userReceivedCredits(changeAmount) {
    this.state.credits += changeAmount
  }

}
