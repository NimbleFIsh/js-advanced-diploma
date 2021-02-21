import Character from './Character';

export default class Bowman extends Character {
  constructor(...args) {
    super(...args);
    this.name = 'Bowman';
    this.attack = 25;
    this.defence = 25;
    this.range = 2;
    this.move = 2;
  }
}
