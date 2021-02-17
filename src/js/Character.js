export default class Character {
  constructor(level, type = 'generic') {
    if (this.constructor.name === 'Object') {
      throw new Error('class Character: can not create instance of abstact class!');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
  }
}

Character.prototype = {
  [Symbol.iterator]() {
    const propertyes = [this.level, this.attack, this.defence, this.health]; let index = -1;
    return { next: () => ({ value: propertyes[++index], done: !(index in propertyes) }) };
  }
}
