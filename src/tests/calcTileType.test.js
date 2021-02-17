import {calcTileType} from '../js/utils';

test('generate gamePole by calcTileType()', () => {
  let pole = [];
  const result = [
    'top-left', 'top', 'top', 'top', 'top', 'top', 'top', 'top-right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'bottom-left', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom-right'
  ];
  for (let i = 0; i < 64; i++) pole.push(calcTileType(i, 8));
  expect(pole).toEqual(result);
});
