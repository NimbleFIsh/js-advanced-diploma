import Character from './Character';

export default class Vampire extends Character {
  constructor(...args) {
    super(...args);
    this.name = 'Vampire';
    this.attack = 25;
    this.defence = 25;
  }
}
