import PositionedCharacter from './PositionedCharacter';

export default class Team {
  static genRand(mode) { // генерация индексов расположения для компьютера и для игрока
    let index;
    if (mode === 'left') {
      do {index = Math.floor(Math.random() * (64 - 0) + 0)} while ((index % 8) !== 0 && (index % 8) !== 1);
    } else if (mode === 'right') {
      do {index = Math.floor(Math.random() * (64 - 0) + 0)} while ((index % 8) !== 6 && (index % 8) !== 7);
    }
    return index;
  }

  static checkTeam(team, mode) { // следит, чтобы индексы персонажей не повторялись и генерирует персонажей
    let render = [], index;
    team.forEach((item, i) => {
      index = this.genRand(mode); // генерация индекса расположения
      if (render.length > 0) { // Если в массиве рендер есть элементы, то
        render.forEach((item, i) => { // перебор элементов
          while (item.position === index) { // проверка на совпадение текущего индекста
            index = this.genRand(mode); // если совпадают, пересоздать индекс
          }
        });
      }
      render.push(new PositionedCharacter(team[i], index));
    });
    return render;
  }

  static renderTeam(playerTeam, computerTeam) { // генерирует 2 комманды и отрисовывает на игровом поле
    return {playerTeam: this.checkTeam(playerTeam, 'left'), computerTeam: this.checkTeam(computerTeam, 'right')};
  }
}
