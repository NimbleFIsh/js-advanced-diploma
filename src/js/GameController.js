import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import Character from './Character';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Vampire from './Vampire';
import Undead from './Undead';
import Daemon from './Daemon';
import Team from './Team';
import {generateTeam} from './generators';
import themes from './themes';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie); // установка темы 1-го уровня
    this.currentLevel = themes.prairie; // запоминание текущего уровня

    this.setEventListenerCellEnter(); // Регистрация события наведения на ячейки
    this.setEventListenerCellClick(); // Регистрация события нажатия на ячейку

    this.gamePlay.addNewGameListener(() => {
      const allCharaters = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon]; // все типы персонажей
      this.gamePlay.cells.forEach((item, i) => { // Перебор игрового поля
        this.gamePlay.deselectCell(i); // Снять все выделения с персонажей
      });
      this.teams = Team.renderTeam(generateTeam([Bowman, Swordsman], 1, 2), generateTeam(allCharaters, 1, 2)); // генерация команд
      this.gamePlay.redrawPositions(this.teams.playerTeam.concat(this.teams.computerTeam)); // отрисовка команд
    }

      // desert
      // lvlUp + healAllSurvive
      // let playerTeam = generateTeam(allCharaters, 2, 1);
      // let computerTeam = generateTeam(allCharaters, 2, playerTeam.length);

      // arctic
      // lvlUp + healAllSurvive
      // let playerTeam = generateTeam(allCharaters, 2, 2);
      // let computerTeam = generateTeam(allCharaters, 3, playerTeam.length);

      // mountain
      // lvlUp + healAllSurvive
      // let playerTeam = generateTeam(allCharaters, 3, 2);
      // let computerTeam = generateTeam(allCharaters, 4, playerTeam.length);
    );
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  setEventListenerCellClick() {
    this.gamePlay.addCellClickListener((index) => {
      this.onCellClick(index);
    })
  }

  setEventListenerCellEnter() {
    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index);
    })
  }

  setEventListenerCellLeave() { // Нет реакции
    this.gamePlay.addCellLeaveListener((index) => { // Нет реакции
      this.onCellLeave(index); // Нет реакции
    })
  }

  levelUp(playerTeam) {
    const levels = ['prairie', 'desert', 'arctic', 'mountain'];
    levels.forEach((lvl, i) => {
      if (this.currentLevel === lvl) {
        if (i === levels.length) {
          // Конец игры
        } else {
          this.currentLevel = levels[i + 1];
          playerTeam.forEach((person) => {
            heal(person);
            attackAfter(person);
          });
        }
      }
    });
  }

  heal(character) {
    if ((character.health + 80) < 100) {
      character.health += 80;
    } else {
      character.health = 100;
    }
  }

  currentPersonage() { // Считывает текущего выбранного персонажа
    let info = {};
    info.selected = false;
    this.gamePlay.cells.forEach((item, i) => {
      if (item.classList.contains('selected')) {
        info.selected = true;
        info.ID = i;
        this.teams.playerTeam.forEach((el) => {
          if (el.position === i) {
            info.personage = el.character;
          }
        });
      }
    });
    return info;
  }

  readCharasters() { // Считывает this.teams и выводит результаты в удобном виде
    let info = [];
    for (let i = 0; i < Object.keys(this.teams).length; i++) {
      for (let f = 0; f < this.teams[Object.keys(this.teams)[i]].length; f++) {
        info.push({
          'command': Object.keys(this.teams)[i],
          'position': this.teams[Object.keys(this.teams)[i]][f].position,
          'character': this.teams[Object.keys(this.teams)[i]][f].character
        });
      }
    }
    return info;
  }

  personageCellEnterInfo(index) { // Возвращает информацию о персонаже, над которым сейчас находится курсор мыши
    return this.readCharasters().filter((s) => {
      return s.position === index;
    })[0];
  }

  cellIsNotEmpty(index) { // Проверяет, не пустая ли клетка
    return this.gamePlay.cells[index].childElementCount !== 0;
  }

  checkEmptyCellTitle(index) { // Проверяет, есть ли у пустой клетки title и удаляет его
    if (this.gamePlay.cells[index].title !== '') { // Если вдруг случится так, что у пустой ячейки есть title
      this.gamePlay.cells[index].removeAttribute('title'); // Удалить атрибут title
    }
  }

  setCursor(cursour) { // небольшое API для эстетичности кода, устанавливает курсор
    this.gamePlay.setCursor(cursors[cursour]);
  }

  deselectAllCellColor(color = 'yellow') {
    for (let i = 0; i < this.gamePlay.cells.length; i++) {
      if (this.gamePlay.cells[i].classList.contains('selected-' + color)) {
        this.gamePlay.cells[i].classList.remove('selected');
        this.gamePlay.cells[i].classList.remove('selected-' + color);
      }
    }
  }

  attackAfter(character) {
    character.attack = Math.max(character.attack, character.attack * (1.8 - character.health) / 100);
  }

  onCellClick(index) {
    let currentPersonage = this.currentPersonage(), // Получение объекта с данными о текущем выбранном персонаже
        characters = this.readCharasters(); // Все персонажи

    if (currentPersonage.selected && currentPersonage.ID === index) { // Клик по текущему выбранному персонажу
      this.gamePlay.deselectCell(index);
      return 0;
    }

    if (this.cellIsNotEmpty(index)) { // Если клетка не пуста
      if (currentPersonage.selected) { // Если персонаж выбран
        // Если клик не по текущему выбранному персонажу
        for (let i = 0; i < characters.length; i++) { // Перебор всех персонажей
          if (characters[i].position === index) { // Если позиция персонажа совпадает с позицией нажатой ячейки
            if (characters[i].command === 'playerTeam') { // Если персонаж игрока
              this.deselectAllCellColor();
              this.gamePlay.selectCell(index);
            } else { // Если персонаж компьютера
              // проверка расстояния атаки
                // Атака
            }
          }
        }
      } else { // Персонаж не выбран
        for (let i = 0; i < characters.length; i++) { // Перебор всех персонажей
          if (characters[i].position === index) { // Персонаж в данной клетке
            if (characters[i].command === 'playerTeam') { // Если персонаж пренадлежить игроку
              this.deselectAllCellColor();
              this.gamePlay.selectCell(index); // Выбор персонажа
            } else {
              GamePlay.showError('Это персонаж компьютера!'); // Ошибка что персонаж не принадлежит игроку
              break; // Выход из цикла
            }
          }
        }
      }
    } else { // Если клетка пуста
      if (currentPersonage.selected) { // Если персонаж выбран
        let team = []; // Массив для отображения персонажей
        characters.forEach((item, i) => { // Перебор всех персонажей
          if (item.position === currentPersonage.ID) { // Поиск выбранного персонажа
            team.push(new PositionedCharacter(currentPersonage.personage, index));
            this.checkEmptyCellTitle(item.position); // Удаление title с старой ячейки
            this.gamePlay.showCellTooltip(`🎖${item.character.level} ⚔${item.character.attack} 🛡${item.character.defence} ❤${item.character.health}`, index); // Создание title у новой клетки
            this.teams[item.command].forEach((el) => { // Перебор комманды перемещённого персонажа
              el.position = index; // Запись в память комманд, что соверешенно перемещение
            });
          } else {
            team.push(new PositionedCharacter(item.character, item.position));
          }
        });
        this.deselectAllCellColor();
        console.log(team);
        this.gamePlay.redrawPositions(team); // Отрисовка перемещения
      }
    }
  }

  onCellEnter(index) {
    let currentPersonage = this.currentPersonage(); // Получение объекта с данными о текущем выбранном персонаже
    if (this.cellIsNotEmpty(index)) { // Если клетка не пуста
      if (currentPersonage.selected) { // Если персонаж выбран
        if (this.personageCellEnterInfo(index).command === 'playerTeam') { // Если курсор над союзником
          this.deselectAllCellColor('red');
          this.deselectAllCellColor('green');
          this.setCursor('pointer');
        } else if (this.personageCellEnterInfo(index).command === 'computerTeam') { // Если курсор над противником
          // Проверка зоны атаки
          if (true) { // В зоне атаки (пока загрушка)
            this.deselectAllCellColor('green');
            this.deselectAllCellColor('red');
            this.setCursor('crosshair');
            this.gamePlay.selectCell(index, 'red');
          } else { // Вне зоны атаки
            this.deselectAllCellColor('red');
            this.deselectAllCellColor('green');
            this.setCursor('notallowed');
          }
        } else { // Иначе же, пустота
          this.deselectAllCellColor('red');
          this.deselectAllCellColor('green');
          this.setCursor('auto');
        }
      } else { // Если персонаж не выбран
        let personageData = this.personageCellEnterInfo(index); // Получение данных о текущем персонаже
        this.gamePlay.showCellTooltip(`🎖 ${personageData.character.level} ⚔ ${personageData.character.attack} 🛡 ${personageData.character.defence} ❤ ${personageData.character.health}`, index); // Создание title для текущего персонажа
      }

      // Проверка зоны атаки/перемещения
      //             let layer = 0;
      //             for (let i = -item.character.range*2; i <= item.character.range*2; i++) {
      //               for (let r = 0; r < item.character.range; r++) {
      //                 console.log(selectedPID + '%8-(' + (i) + ')+(8*' + layer / 2 + ') ~ ' + (selectedPID % 8 - (i) + (8 * layer / 2)));
      //               }
      //               layer++;
      //             }
      //             // pos -range ... range
      //             // layer 2 * range
      //             // selectedPID % 8 - (pos) + (8 * layer)

    } else { // Если клетка пуста
      this.checkEmptyCellTitle(index);
      if (currentPersonage.selected) { // Если персонаж выбран
        this.deselectAllCellColor('red');
        this.deselectAllCellColor('green');
        // Проверка зоны перемещения
        if (true) { // В зоне перемещения (пока загрушка)
          this.setCursor('pointer');
          this.gamePlay.selectCell(index, 'green');
        }
      }
    }
  }

  onCellLeave(index) {// Нет реакции
    console.log(index); // Нет реакции
  }
}
