export function calcTileType(index, boardSize) {
  let fullBoardSize = boardSize * boardSize,
      lastLine = fullBoardSize - boardSize;

  // Левая сторона
  if ((index) % boardSize === 0) { // Если индекс делится на размер поля без остатка, значит строка началась
    if (index === 0) { // Если это начало 1-й строки
      return 'top-left';
    } else if (lastLine === index && ((index) % boardSize) === 0) { // Если индекс === началу строки && эта строка последняя
      return 'bottom-left';
    } else { // Если не верх и не низ
      return 'left';
    }
  }

  // Правая сторона
  if ((index+1) % boardSize === 0) { // Если индекс делится на размер поля без остатка, значит строка закончилась
    if (index+1 <= boardSize) { // Если индекс меньше или равен размеру поля, то это 1-я строка
      return 'top-right';
    } else if (lastLine < index+1 && index+1 <= fullBoardSize) {
      // Если индекс больше чем размер всего поля - длина последней строки && меньше чем размер всего поля полностью, то это последняя строка
      return 'bottom-right';
    } else { // Если не верх и не низ
      return 'right';
    }
  }

  // Верхняя и нижняя стороны
  if (1 < index < boardSize) { // Если не является углом и левым или правым краем
    if (index+1 < boardSize) { // Если первая строка
      return 'top';
    }
    if (lastLine < index && index < fullBoardSize) { // Если последняя строка
      return 'bottom';
    }
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
