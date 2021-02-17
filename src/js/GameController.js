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
      this.gamePlay.cells.forEach((item, i) => this.gamePlay.deselectCell(i)); // Снять все выделения с персонажей
      const allCharaters = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon]; // все типы персонажей
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
    this.gamePlay.addCellClickListener(index => this.onCellClick(index));
  }

  setEventListenerCellEnter() {
    this.gamePlay.addCellEnterListener(index => this.onCellEnter(index));
  }

  setEventListenerCellLeave() {
    this.gamePlay.addCellLeaveListener(index => onCellLeave(index));
  }

  levelUp (playerTeam) {
    const levels = ['prairie', 'desert', 'arctic', 'mountain'];
    levels.forEach((lvl, i) => {
      if (this.currentLevel === lvl) {
        if (i === levels.length) {
          // Конец игры
        } else {
          this.currentLevel = levels[i+1];
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
    let personageSelected = false, selectedPID = null, teamObj = {};

    this.gamePlay.cells.forEach((el, i)=> { // Перебор игрового поля
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
            arrCharatersId.push(i);
          }
        });

        for (let team in this.teams) { // Перебор комманд
          if (this.teams.hasOwnProperty(team)) { // Есть ли команда в списке комманд
            teamObj[team] = []; // массив команды для записи персонажей
            this.teams[team].forEach((elem, i) => { // Перебор комманды
              if (selectedPID === elem.position) { // Если выделенный персонаж, то
                teamObj[team][i] = new PositionedCharacter(elem.character, index);
              } else {
                teamObj[team][i] = elem; // запись персонажей в массив
              }
            });
          }
        }
        this.gamePlay.cells.forEach((item, i) => this.gamePlay.deselectCell(i)); // Снять все выделения с персонажей
        console.log(teamObj.computerTeam.concat(teamObj.playerTeam));
        this.gamePlay.redrawPositions(teamObj.computerTeam.concat(teamObj.playerTeam)); // Отрисовка перемещения
      } else { // клетка с персонажем
        if (selectedPID === index) { // Если нажатие по выбранному персонажу, то
          this.gamePlay.deselectCell(index); // Снять выделение
        } else {
          this.teams.computerTeam.forEach(item => { // Перебор команды компьютера
            if (item.position === index) { // Если нажатие по персонажу компьютера, то
              // Проверить, в зоне досигаемости ли персонаж
                // Если да, то
                  // Атака
                  // Отнять хп врага
                  // Отобразить урон
                // Если нет, то заблокировать курсор и ничего не делать
            }
          });
        }
      }
    } else { // Если не выбран персонаж, то
      if (this.gamePlay.cells[index].childElementCount === 0) { // пустая клетка

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
            if (item.position !== index) {this.gamePlay.deselectCell(item.position)} // Снять со всех других выделение
          });
          this.gamePlay.selectCell(index); // Выделить текущего персонажа
        }
      }
    }


      // let access = true, currentPersonageActive = false, currentPersonageId;
      // this.teams.playerTeam.forEach((item) => { // перебор команды игрока
      //   if (this.gamePlay.cells[item.position].classList.contains('selected')) { // Если выбран какой-нибудь игрок, то переключить логику
      //     currentPersonageId = item.position;
      //     currentPersonageActive = true;
      //   }
      // });
      // if (!currentPersonageActive) { // Если персонаж не выделен
      //   this.teams.computerTeam.forEach((item, i) => { // Проверка на клик по персонажу компьютера
      //     if (item.position === index) {GamePlay.showError('Это персонаж компьютера');access = false;}
      //   });
      //   if (access) { // Если игрок выбрал не персонажа компьютера
      //     this.teams.playerTeam.forEach((item, i) => { // перебор команды игрока
      //       if (item.position !== index) {this.gamePlay.deselectCell(item.position)} // Снять со всех других выделение
      //     });
      //     this.gamePlay.selectCell(index); // Выделить текущего персонажа
      //   }
      // } else { // Если игрок нажал на выбранного персонажа
      //   this.gamePlay.deselectCell(index); // снять выделение
      // }
  }

  onCellEnter(index) {
    if (this.gamePlay.cells[index].childElementCount !== 0) {
      for (let team in this.teams) {
        if (this.teams.hasOwnProperty(team)) {
          this.teams[team].forEach((l) => {
            if (l.position === index) {
              this.gamePlay.showCellTooltip(`🎖${l.character.level} ⚔${l.character.attack} 🛡${l.character.defence} ❤${l.character.health}`, index);
            }
          });
        }
      }
    }
  }

  onCellLeave(index) {

  }
}
