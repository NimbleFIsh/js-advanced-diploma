import Character from '../js/Character';
import Bowman from '../js/Bowman';

test('Abstract class Character', () => {
  try { new Character(); }
  catch (e) { expect(`${e}`).toEqual('Error: class Character: can not create instance of abstact class!'); }
});

test('childrens', () => {
  expect(new Bowman(1)).toEqual(new Bowman(1));
});
