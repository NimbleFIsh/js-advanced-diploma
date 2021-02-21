import Character from './Character';

export default class Daemon extends Character {
  constructor(...args) {
    super(...args);
    this.name = 'Daemon';
    this.attack = 10;
    this.defence = 40;
    this.range = 4;
    this.move = 1;
  }
}
