export default class GameState {
  static step() {
    if (step === 'player') {
      this.currentStep = 'player';
      this.nextStep = 'computer';
    } else {
      this.currentStep = 'computer';
      this.nextStep = 'player';
    }
  }

  static set step(step) {
    this.currentStep = step;
    this.nextStep = this.step();
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
