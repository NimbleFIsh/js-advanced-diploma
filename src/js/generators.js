import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Vampire from './Vampire';
import Undead from './Undead';
import Daemon from './Daemon';

// Разрешённые классы для создания персонажей
const allowedClasses = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

function generatorInputValidator(allowedTypes) {
  if (Array.isArray(allowedTypes)) { // Проверка списка итерируемых классов, является ли массивом
    allowedTypes.forEach((prop, i) => { // Перебор массива allowedTypes для проверки на iterable and class
      if (Object.getOwnPropertySymbols(new prop(1, prop).prototype).includes(Symbol.iterator)) {// Если эл.массива итерируемый
        // Если эл.массива нет в спике разрешённых классов
        if (!allowedClasses.includes(prop)) { throw new Error(`${prop} not allowed Type of character!`); }
      } else { throw new Error('allowedTypes not iterable of classes'); }
    });
  } else { throw new Error('allowedTypes is not array'); }
  return 'success';
}

// Генерирует рандомное число до длины массива, округляет и достаёт из массива класс
function generateRandomPersonage() {
  return allowedClasses[Math.floor(Math.random()*Math.floor(allowedClasses.length))];
}

export function* characterGenerator(allowedTypes, maxLevel) {
  let answer = generatorInputValidator(allowedTypes), randPers;
  if (answer === 'success') { // Если валидация успешна
    // Случайно генерирует персонажа по списку разрешённых
    do { randPers = generateRandomPersonage(); } while(!allowedTypes.includes(randPers));
    yield new randPers(Math.floor(Math.random() * (maxLevel - 1) + 1), randPers.name.toLowerCase());
  } else {
    throw new Error(answer);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  let answer = generatorInputValidator(allowedTypes), team = [];
  if (answer === 'success') { // Если валидация успешна
    while (team.length < characterCount) {
      for (let varIable of characterGenerator(allowedTypes, maxLevel)) team.push(varIable);
    }
    return team;
  } else {
    throw new Error(answer);
  }
}
