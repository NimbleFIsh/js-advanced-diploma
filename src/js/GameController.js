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

  setEventListenerCellLeave() {
    this.gamePlay.addCellLeaveListener((index) => {
      this.onCellLeave(index);
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

  attackAfter(character) {
    character.attack = Math.max(character.attack, character.attack * (1.8 - character.health) / 100);
  }

  onCellClick(index) {
    let personageSelected = false,
        selectedPID = null,
        teamObj = {};

    this.gamePlay.cells.forEach((el, i) => { // Перебор игрового поля
      if (el.classList.contains('selected')) { // Сканирование поля есть ли выбранный персонаж
        personageSelected = true;
        selectedPID = i;
      }
    });

    if (personageSelected) { // Если выбран персонаж, то
      if (this.gamePlay.cells[index].childElementCount === 0) { // пустая клетка
        let arrCharatersId = []; // Массив для хранения id для получения объектов персонажей
        this.gamePlay.cells.forEach((item, i) => { // Перебор игрового поля
          if (item.childElementCount > 0) { // Если есть дочерние элементы, значит это не пустая клетка
            arrCharatersId.push(i); // Запись в массив id персонажей
          }
        });

        for (let team in this.teams) { // Перебор комманд
          if (this.teams.hasOwnProperty(team)) { // Есть ли команда в списке комманд
            teamObj[team] = []; // массив команды для записи персонажей
            this.teams[team].forEach((elem, i) => { // Перебор комманды
              if (selectedPID === elem.position) { // Если выделенный персонаж, то
                teamObj[team][i] = new PositionedCharacter(elem.character, index);
                this.gamePlay.cells[elem.position].removeAttribute('title'); // Удаление title со старой клетки
                this.gamePlay.showCellTooltip(`🎖${elem.character.level} ⚔${elem.character.attack} 🛡${elem.character.defence} ❤${elem.character.health}`, index); // Создание title у новой клетки
                this.teams[team][i].position = index; // Запись в память комманд, что совершенно перемещение
              } else {
                teamObj[team][i] = elem; // запись персонажей в массив
              }
            });
          }
        }

        this.gamePlay.cells.forEach((item, i) => { // Перебор игрового поля
          this.gamePlay.deselectCell(i); // Снять все выделения с персонажей
        });

        this.gamePlay.redrawPositions(teamObj.computerTeam.concat(teamObj.playerTeam)); // Отрисовка перемещения
      } else { // клетка с персонажем
        if (selectedPID === index) { // Если нажатие по выбранному персонажу, то
          this.gamePlay.deselectCell(index); // Снять выделение
        } else {
          let teammate = true;
          this.teams.computerTeam.forEach(item => { // Перебор команды компьютера
            if (item.position === index) { // Если нажатие по персонажу компьютера, то
              teammate = false;
              // Проверить, в зоне досигаемости ли персонаж
              // Если да, то
              // Атака
              // Отнять хп врага
              // Отобразить урон
              // Если нет, то заблокировать курсор и ничего не делать
            }
          });
          if (teammate) { // Если свой, то
            this.gamePlay.deselectCell(selectedPID); // Снять с текущего выделение
            this.gamePlay.selectCell(index); // Выделить другого персонажа
          }
        }
      }
    } else { // Если не выбран персонаж, то
      if (this.gamePlay.cells[index].childElementCount === 0) { // пустая клетка
        // Ничего не делать
      } else { // Если в клетке персонаж
        let access = true;
        this.teams.computerTeam.forEach((item, i) => { // Проверка на клик по персонажу компьютера
          if (item.position === index) {
            GamePlay.showError('Это персонаж компьютера');
            access = false;
          }
        });
        if (access) { // Если персонаж не компьютера
          this.teams.playerTeam.forEach((item, i) => { // перебор команды игрока
            if (item.position !== index) { // Снять со всех других выделение
              this.gamePlay.deselectCell(item.position);
            }
          });
          this.gamePlay.selectCell(index); // Выделить текущего персонажа
        }
      }
    }

    this.gamePlay.cells.forEach((cell) => { // Перебор игрового поля
      if (cell.childElementCount ===0 && cell.getAttributeNames().includes('title')) { // Если клетка пуста и у неё есть title
        cell.removeAttribute('title'); // То удалить его
      }
    });
  }

  onCellEnter(index) {
    if (this.gamePlay.cells[index].childElementCount !== 0) { // Если клетка не пуста
      for (let team in this.teams) { // Перебор комманд
        if (this.teams.hasOwnProperty(team)) {
          this.teams[team].forEach((l) => { // Перебор комманды
            if (l.position === index) { // Если персонаж в клетке соответсвует персонажу в комманде, то
              this.gamePlay.showCellTooltip(`🎖${l.character.level} ⚔${l.character.attack} 🛡${l.character.defence} ❤${l.character.health}`, index); // Создать ему title
            }
          });
        }
      }
    }
  }

  onCellLeave(index) {

  }
}
