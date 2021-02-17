import Character from './Character';

export default class Swordsman extends Character {
  constructor(...args) {
    super(...args);
    this.name = 'Swordsman';
    this.attack = 40;
    this.defence = 10;
    this.__proto__ = Character;
  }
}
