import Character from './Character';

export default class Magician extends Character {
  constructor(...args) {
    super(...args);
    this.name = 'Magician';
    this.attack = 10;
    this.defence = 40;
    this.__proto__ = Character;
  }
}
