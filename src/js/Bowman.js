import Character from './Character';

export default class Bowman extends Character {
  constructor(...args) {
    super(...args);
    this.name = 'Bowman';
    this.attack = 25;
    this.defence = 25;
    this.__proto__ = Character;
  }
}
