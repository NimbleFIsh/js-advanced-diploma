import Character from './Character';

export default class Undead extends Character {
  constructor(...args) {
    super(...args);
    this.name = 'Undead';
    this.attack = 40;
    this.defence = 10;
    this.__proto__ = Character;
  }
}
