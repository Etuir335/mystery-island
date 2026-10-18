'use strict';
// =====================================================================
//  MYSTERY OF THE ISLAND — данные игры
// =====================================================================

// ---------- СЛОЖНОСТИ: отличаются механиками, а не только цифрами ----------
const MODES = {
  tourist: {
    n: 'Турист', ic: '🌴',
    tag: 'Для расслабленной игры и истории',
    rules: [
      'Простое здоровье: одна шкала, только кровотечение',
      'Нет болезней, заражения ран и радиации',
      'Еда не портится, нет холода',
      'Кровавая ночь слабая и не трогает склад',
      'Выброс предупреждают заранее (2 часа)',
      'Смерть: очнёшься на базе со всеми вещами',
      'На карте видны опасность и лут локаций',
    ],
    f: { parts: false, infection: false, illness: false, rad: false, spoil: false, cold: false, virus: false,
      death: 'wake', hints: 2, emWarn: 120, horde: 0.5, hordeLoot: false, needs: 0.6, enemies: 0.75, count: 0.8, fog: false, noise: 0.8 },
  },
  survivor: {
    n: 'Выживший', ic: '🧭',
    tag: 'Задуманный баланс',
    rules: [
      'Здоровье по частям тела: раны, кровотечения, переломы',
      'Необработанные раны воспаляются — нужны антисептик и антибиотики',
      'Простуда под дождём и при ночёвке без укрытия',
      'Радиация в Зоне, артефакты фонят',
      'Кровавая ночь каждые 7 дней — орда атакует базу',
      'Смерть: всё, что было при тебе, остаётся на трупе — можно вернуться и забрать',
      'На карте видна только опасность',
    ],
    f: { parts: true, infection: true, illness: true, rad: true, spoil: false, cold: false, virus: false,
      death: 'corpse', hints: 1, emWarn: 60, horde: 1, hordeLoot: true, needs: 1, enemies: 1, count: 1, fog: false, noise: 1 },
  },
  hardcore: {
    n: 'Хардкор', ic: '☠️',
    tag: 'Для заядлых — одна жизнь',
    rules: [
      'Всё из «Выжившего», плюс:',
      'Укус заражённого может занести вирус — лечится только редкой сывороткой',
      'Еда портится, холод ночью и под дождём: нужна тёплая одежда и огонь',
      'Выброс почти без предупреждения (30 мин)',
      'Неизведанные места скрыты туманом',
      'Смерть навсегда: новый персонаж в том же мире, база остаётся',
      'Враги сильнее, шум разносится дальше',
    ],
    f: { parts: true, infection: true, illness: true, rad: true, spoil: true, cold: true, virus: true,
      death: 'perma', hints: 0, emWarn: 30, horde: 1.4, hordeLoot: true, needs: 1.2, enemies: 1.15, count: 1.2, fog: true, noise: 1.3 },
  },
};

// ---------- ЧЕРТЫ (как в Project Zomboid): плюсы стоят очков, минусы дают ----------
const TRAITS = {
  strong:  { n: 'Сильный', ic: '💪', cost: 3, d: '+8 кг к переносимому весу, удары сильнее' },
  quiet:   { n: 'Тихоня', ic: '🤫', cost: 2, d: 'Скрытность +2' },
  medic:   { n: 'Медик', ic: '🩺', cost: 2, d: 'Медицина +2, стартовая аптечка' },
  hunter:  { n: 'Охотник', ic: '🏹', cost: 2, d: 'Выживание +2, Стрельба +1' },
  keen:    { n: 'Зоркий', ic: '👁️', cost: 2, d: 'Поиск +2: быстрее и больше находишь' },
  tough:   { n: 'Крепкий', ic: '🛡️', cost: 3, d: 'Реже болеешь, раны воспаляются вдвое медленнее' },
  smoker:  { n: 'Курильщик', ic: '🚬', cost: -2, d: 'Без сигарет каждые ~12 ч растёт стресс' },
  clumsy:  { n: 'Неуклюжий', ic: '🦶', cost: -2, d: 'Шумишь в полтора раза сильнее' },
  sickly:  { n: 'Слабое здоровье', ic: '🤧', cost: -3, d: 'Болеешь вдвое чаще' },
  glutton: { n: 'Обжора', ic: '🍔', cost: -2, d: 'Голод растёт на 40% быстрее' },
  coward:  { n: 'Трус', ic: '😰', cost: -2, d: 'В бою паникуешь сильнее' },
  myopic:  { n: 'Близорукий', ic: '👓', cost: -1, d: 'Поиск −1' },
};

const SKILLS = {
  stealth: { n: 'Скрытность', ic: '🐾' },
  melee:   { n: 'Ближний бой', ic: '🔪' },
  shoot:   { n: 'Стрельба', ic: '🎯' },
  med:     { n: 'Медицина', ic: '⛑️' },
  search:  { n: 'Поиск', ic: '🔍' },
  craft:   { n: 'Ремесло', ic: '🔨' },
  surv:    { n: 'Выживание', ic: '🌲' },
};
const SKILL_XP = [0, 20, 55, 110, 190, 300];

// ---------- ЧАСТИ ТЕЛА ----------
const PARTS = {
  head:  { n: 'Голова', max: 40, w: 10 },
  torso: { n: 'Торс', max: 100, w: 34 },
  larm:  { n: 'Л. рука', max: 50, w: 14 },
  rarm:  { n: 'П. рука', max: 50, w: 14 },
  lleg:  { n: 'Л. нога', max: 60, w: 14 },
  rleg:  { n: 'П. нога', max: 60, w: 14 },
};
const INJ = {
  scratch: { n: 'Царапина', bleed: 0.3, heal: 12 },
  lacer:   { n: 'Рваная рана', bleed: 1, heal: 36 },
  bite:    { n: 'Укус', bleed: 0.7, heal: 48 },
  bullet:  { n: 'Огнестрельное', bleed: 2, heal: 60 },
  burn:    { n: 'Ожог', bleed: 0, heal: 30 },
  frac:    { n: 'Перелом', bleed: 0, heal: 72 },
  bruise:  { n: 'Ушиб', bleed: 0, heal: 8 },
};

// ---------- ПРЕДМЕТЫ ----------
// c: категория; w: вес (кг); v: ценность (₽)
const ITEMS = {
  // Еда
  canned:   { n: 'Тушёнка', ic: '🥫', c: 'food', w: 0.4, v: 25, f: 35 },
  crackers: { n: 'Галеты', ic: '🍘', c: 'food', w: 0.2, v: 12, f: 15, d: -3 },
  choco:    { n: 'Шоколад', ic: '🍫', c: 'food', w: 0.1, v: 18, f: 10, stress: -12 },
  apple:    { n: 'Яблоко', ic: '🍎', c: 'food', w: 0.2, v: 6, f: 8, d: 4, sp: 96 },
  berries:  { n: 'Ягоды', ic: '🫐', c: 'food', w: 0.1, v: 4, f: 5, d: 2, sp: 48 },
  mushroom: { n: 'Грибы', ic: '🍄', c: 'food', w: 0.2, v: 5, f: 8, raw: 0.25, cook: 'cmush', sp: 48 },
  cmush:    { n: 'Жареные грибы', ic: '🍳', c: 'food', w: 0.2, v: 10, f: 18, sp: 24 },
  meat:     { n: 'Сырое мясо', ic: '🥩', c: 'food', w: 0.6, v: 10, f: 10, raw: 0.45, cook: 'cmeat', sp: 24 },
  cmeat:    { n: 'Жареное мясо', ic: '🍖', c: 'food', w: 0.5, v: 20, f: 40, sp: 48 },
  fish:     { n: 'Сырая рыба', ic: '🐟', c: 'food', w: 0.4, v: 8, f: 8, raw: 0.35, cook: 'cfish', sp: 24 },
  cfish:    { n: 'Жареная рыба', ic: '🍣', c: 'food', w: 0.3, v: 16, f: 30, sp: 48 },
  smoked:   { n: 'Копчёная рыба', ic: '🐠', c: 'food', w: 0.3, v: 30, f: 32 },
  veg:      { n: 'Овощи с огорода', ic: '🥕', c: 'food', w: 0.3, v: 8, f: 12, d: 3, sp: 120 },
  ration:   { n: 'Армейский паёк', ic: '📦', c: 'food', w: 0.6, v: 45, f: 60, d: 10 },
  cigs:     { n: 'Сигареты', ic: '🚬', c: 'food', w: 0.05, v: 15, f: 0, stress: -20, smoke: 1 },
  // Питьё
  water:    { n: 'Чистая вода', ic: '💧', c: 'drink', w: 0.5, v: 8, d: 40, btl: 1 },
  seawater: { n: 'Морская вода', ic: '🌊', c: 'drink', w: 0.5, v: 0, d: -15, btl: 1, salt: 1 },
  bottle:   { n: 'Пустая бутылка', ic: '🍶', c: 'tool', w: 0.1, v: 2 },
  dwater:   { n: 'Грязная вода', ic: '🫗', c: 'drink', w: 0.5, v: 1, d: 30, raw: 0.4, cook: 'water', btl: 1 },
  soda:     { n: 'Газировка', ic: '🥤', c: 'drink', w: 0.4, v: 10, d: 30, f: 3, btl: 1 },
  vodka:    { n: 'Водка', ic: '🍾', c: 'drink', w: 0.5, v: 30, d: 5, rad: -25, stress: -15, btl: 1 },
  // Медицина
  rag:      { n: 'Тряпка', ic: '🧶', c: 'mat', w: 0.1, v: 2 },
  dband:    { n: 'Грязная повязка', ic: '🩹', c: 'med', w: 0.05, v: 3, med: 'band', dirty: 1 },
  bandage:  { n: 'Стерильный бинт', ic: '🩹', c: 'med', w: 0.05, v: 12, med: 'band' },
  antisep:  { n: 'Антисептик', ic: '🧴', c: 'med', w: 0.2, v: 20, med: 'disinf', uses: 3 },
  alcohol:  { n: 'Медицинский спирт', ic: '⚗️', c: 'med', w: 0.3, v: 18, med: 'disinf', uses: 2 },
  antibio:  { n: 'Антибиотики', ic: '💊', c: 'med', w: 0.05, v: 60, med: 'antibio' },
  painkill: { n: 'Обезболивающее', ic: '💉', c: 'med', w: 0.05, v: 30, med: 'pain' },
  splint:   { n: 'Шина', ic: '🦯', c: 'med', w: 0.4, v: 15, med: 'splint' },
  medkit:   { n: 'Аптечка АИ-2', ic: '🧰', c: 'med', w: 0.4, v: 90, med: 'kit' },
  antirad:  { n: 'Антирад', ic: '🟡', c: 'med', w: 0.05, v: 70, med: 'antirad' },
  coldpill: { n: 'Таблетки от простуды', ic: '🤧', c: 'med', w: 0.05, v: 25, med: 'cold' },
  serum:    { n: 'Экспериментальная сыворотка', ic: '🧪', c: 'med', w: 0.1, v: 600, med: 'serum' },
  // Ближний бой
  stick:    { n: 'Крепкая палка', ic: '🪵', c: 'melee', w: 1, v: 2, dmg: [4, 7], dur: 30, noise: 4 },
  knife:    { n: 'Кухонный нож', ic: '🔪', c: 'melee', w: 0.3, v: 20, dmg: [6, 10], dur: 45, noise: 2 },
  crowbar:  { n: 'Монтировка', ic: '🪛', c: 'melee', w: 1.5, v: 35, dmg: [8, 13], dur: 140, noise: 6, pry: 1 },
  bat:      { n: 'Бита', ic: '🏏', c: 'melee', w: 1.2, v: 30, dmg: [9, 14], dur: 80, noise: 6, push: 1 },
  axe:      { n: 'Топор', ic: '🪓', c: 'melee', w: 1.8, v: 55, dmg: [11, 17], dur: 100, noise: 6, chop: 1 },
  machete:  { n: 'Мачете', ic: '🗡️', c: 'melee', w: 0.9, v: 70, dmg: [12, 16], dur: 90, noise: 3 },
  spear:    { n: 'Копьё', ic: '🔱', c: 'melee', w: 1.5, v: 25, dmg: [10, 15], dur: 50, noise: 3, reach: 1 },
  nailbat:  { n: 'Дубина с гвоздями', ic: '🏑', c: 'melee', w: 1.6, v: 30, dmg: [11, 16], dur: 45, noise: 6, push: 1 },
  // Огнестрел
  pm:       { n: 'Пистолет ПМ', ic: '🔫', c: 'gun', w: 0.8, v: 180, dmg: [14, 20], ammo: 'a9', noise: 30, acc: 0.7 },
  sawn:     { n: 'Обрез', ic: '💥', c: 'gun', w: 2.5, v: 220, dmg: [24, 38], ammo: 'a12', noise: 45, acc: 0.65, spread: 2 },
  ak:       { n: 'АК-74', ic: '🪖', c: 'gun', w: 3.6, v: 600, dmg: [18, 26], ammo: 'a545', noise: 50, acc: 0.78 },
  a9:       { n: 'Патроны 9 мм', ic: '🟤', c: 'ammo', w: 0.01, v: 4 },
  a12:      { n: 'Патроны 12 кал.', ic: '🔴', c: 'ammo', w: 0.04, v: 7 },
  a545:     { n: 'Патроны 5.45', ic: '🟢', c: 'ammo', w: 0.01, v: 6 },
  // Одежда и снаряжение
  jacket:   { n: 'Куртка', ic: '🧥', c: 'wear', w: 1.2, v: 30, slot: 'body', warm: 2, arm: 1 },
  parka:    { n: 'Пуховик', ic: '🧥', c: 'wear', w: 1.8, v: 60, slot: 'body', warm: 4, arm: 1 },
  mjacket:  { n: 'Военная куртка', ic: '🥼', c: 'wear', w: 1.6, v: 80, slot: 'body', warm: 3, arm: 2 },
  vest:     { n: 'Бронежилет', ic: '🦺', c: 'wear', w: 7, v: 350, slot: 'vest', arm: 5 },
  gasmask:  { n: 'Противогаз', ic: '😷', c: 'wear', w: 1, v: 120, slot: 'mask', radp: 0.5 },
  bag1:     { n: 'Школьный рюкзак', ic: '🎒', c: 'wear', w: 0.6, v: 20, slot: 'bag', cap: 6 },
  bag2:     { n: 'Туристический рюкзак', ic: '🎒', c: 'wear', w: 1.2, v: 70, slot: 'bag', cap: 12 },
  bag3:     { n: 'Военный рюкзак', ic: '🎒', c: 'wear', w: 1.8, v: 180, slot: 'bag', cap: 18 },
  // Инструменты
  flash:    { n: 'Фонарик', ic: '🔦', c: 'tool', w: 0.3, v: 40, light: 1 },
  lighter:  { n: 'Зажигалка', ic: '🔥', c: 'tool', w: 0.05, v: 15 },
  rod:      { n: 'Удочка', ic: '🎣', c: 'tool', w: 1, v: 30 },
  picks:    { n: 'Отмычки', ic: '🗝️', c: 'tool', w: 0.05, v: 25, uses: 3 },
  bolts:    { n: 'Болты', ic: '🔩', c: 'tool', w: 0.02, v: 1 },
  detector: { n: 'Детектор аномалий', ic: '📟', c: 'tool', w: 0.4, v: 400 },
  tools:    { n: 'Набор инструментов', ic: '🧰', c: 'tool', w: 2, v: 80 },
  // Материалы
  wood:     { n: 'Дрова', ic: '🪵', c: 'mat', w: 1, v: 3 },
  planks:   { n: 'Доски', ic: '🟫', c: 'mat', w: 1.5, v: 6 },
  nails:    { n: 'Гвозди', ic: '📌', c: 'mat', w: 0.02, v: 1 },
  scrap:    { n: 'Металлолом', ic: '⚙️', c: 'mat', w: 1, v: 6 },
  tape:     { n: 'Скотч', ic: '🩶', c: 'mat', w: 0.2, v: 10 },
  wire:     { n: 'Проволока', ic: '➰', c: 'mat', w: 0.2, v: 6 },
  rope:     { n: 'Верёвка', ic: '🪢', c: 'mat', w: 0.4, v: 8 },
  elec:     { n: 'Электроника', ic: '🔌', c: 'mat', w: 0.3, v: 25 },
  battery:  { n: 'Батарейки', ic: '🔋', c: 'mat', w: 0.1, v: 12 },
  seeds:    { n: 'Семена', ic: '🌱', c: 'mat', w: 0.05, v: 15 },
  herbs:    { n: 'Лечебные травы', ic: '🌿', c: 'mat', w: 0.05, v: 8 },
  // Ценности
  watch:    { n: 'Часы', ic: '⌚', c: 'val', w: 0.1, v: 60 },
  ring:     { n: 'Золотое кольцо', ic: '💍', c: 'val', w: 0.01, v: 120 },
  cash:     { n: 'Пачка рублей', ic: '💵', c: 'val', w: 0.05, v: 50 },
  // Артефакты (Сталкер)
  medusa:   { n: 'Медуза', ic: '🪼', c: 'art', w: 0.5, v: 300, art: { heal: 2, rad: 1 }, d: 'Ускоряет заживление. Слабо фонит.' },
  crystal:  { n: 'Кристалл', ic: '💎', c: 'art', w: 0.5, v: 350, art: { cap: 6, rad: 1 }, d: 'Тот самый кристалл. Рюкзак будто легче (+6 кг). Фонит.' },
  fireball: { n: 'Огненный шар', ic: '🔥', c: 'art', w: 0.5, v: 280, art: { warm: 3, rad: 1 }, d: 'Тёплый на ощупь. Греет в холод.' },
  drop:     { n: 'Капля', ic: '💧', c: 'art', w: 0.5, v: 320, art: { rad: -2 }, d: 'Выводит радиацию.' },
  crown:    { n: 'Золотая корона', ic: '👑', c: 'art', w: 1, v: 5000, art: { heal: 3, cap: 10, warm: 3, rad: -2 }, d: 'Легенда острова. Говорят, её создал сам Аппарат.' },
  // Ключи и сюжет
  k_armory: { n: 'Ключ от оружейной', ic: '🔑', c: 'key', w: 0, v: 50 },
  k_farm:   { n: 'Ключ от подвала фермы', ic: '🔑', c: 'key', w: 0, v: 20 },
  pass:     { n: 'Пропуск НИИ «Остров-7»', ic: '🪪', c: 'key', w: 0, v: 200 },
  rpart:    { n: 'Радиодеталь', ic: '📻', c: 'quest', w: 0.5, v: 100 },
  dogtag:   { n: 'Жетон Миши', ic: '🏷️', c: 'quest', w: 0, v: 0 },
  kpplog:   { n: 'Журнал КПП', ic: '📒', c: 'quest', w: 0.3, v: 0 },
  niidata:  { n: 'Записи Левина-старшего', ic: '💾', c: 'quest', w: 0.1, v: 0 },
  core:     { n: 'Ядро Аппарата', ic: '🔮', c: 'quest', w: 2, v: 0 },
  // Чертежи (Rust): изучаешь — открывается рецепт/постройка
  bp_traps: { n: 'Чертёж: колья', ic: '📐', c: 'bp', w: 0.05, v: 40, bp: 'traps' },
  bp_rain:  { n: 'Чертёж: дождесборник', ic: '📐', c: 'bp', w: 0.05, v: 40, bp: 'rain' },
  bp_smoke: { n: 'Чертёж: коптильня', ic: '📐', c: 'bp', w: 0.05, v: 40, bp: 'smoke' },
  bp_garden:{ n: 'Чертёж: огород', ic: '📐', c: 'bp', w: 0.05, v: 40, bp: 'garden' },
  bp_nail:  { n: 'Чертёж: дубина с гвоздями', ic: '📐', c: 'bp', w: 0.05, v: 30, bp: 'nailbat' },
  bp_picks: { n: 'Чертёж: отмычки', ic: '📐', c: 'bp', w: 0.05, v: 30, bp: 'picks' },
  bp_ammo:  { n: 'Чертёж: патроны 12 кал.', ic: '📐', c: 'bp', w: 0.05, v: 80, bp: 'a12' },
};

// ---------- КОНТЕЙНЕРЫ (как в Таркове: у каждого типа свой лут) ----------
const CONT = {
  shore:   { n: 'Ящик, выброшенный морем', ic: '📦', t: 15, roll: [1, 3], loot: [['canned', 3], ['water', 4], ['bottle', 4], ['rope', 3], ['rag', 4], ['scrap', 3], ['lighter', 2], ['cigs', 2], ['jacket', 1], ['bp_rain', 1]] },
  body:    { n: 'Тело', ic: '🧍', t: 10, roll: [1, 3], loot: [['rag', 4], ['cigs', 3], ['dband', 3], ['knife', 2], ['cash', 2], ['watch', 1], ['water', 2], ['crackers', 2], ['a9', 1], ['painkill', 1], ['picks', 1], ['bottle', 2]] },
  fridge:  { n: 'Холодильник', ic: '🧊', t: 8, roll: [0, 3], loot: [['canned', 4], ['soda', 4], ['apple', 3], ['vodka', 2], ['dwater', 2], ['meat', 1], ['bottle', 2]] },
  wardrobe:{ n: 'Шкаф', ic: '🚪', t: 15, roll: [1, 3], loot: [['rag', 6], ['jacket', 3], ['parka', 1], ['bag1', 2], ['cash', 1], ['ring', 1]] },
  night:   { n: 'Тумбочка', ic: '🗄️', t: 8, roll: [0, 2], loot: [['cigs', 3], ['painkill', 2], ['battery', 3], ['watch', 1], ['lighter', 2], ['choco', 2], ['coldpill', 2], ['ring', 1], ['bp_picks', 1]] },
  medcab:  { n: 'Аптечный шкафчик', ic: '⛑️', t: 10, roll: [1, 3], loot: [['bandage', 5], ['antisep', 3], ['painkill', 3], ['antibio', 2], ['coldpill', 3], ['alcohol', 2], ['splint', 1], ['medkit', 1]] },
  shelf:   { n: 'Стеллаж с продуктами', ic: '🛒', t: 12, roll: [1, 4], loot: [['canned', 4], ['crackers', 4], ['soda', 4], ['water', 4], ['choco', 3], ['cigs', 2], ['vodka', 1], ['battery', 1], ['bottle', 2]] },
  kassa:   { n: 'Касса', ic: '💰', t: 5, roll: [1, 2], loot: [['cash', 6], ['battery', 1]] },
  toolbox: { n: 'Ящик с инструментами', ic: '🧰', t: 15, roll: [1, 3], loot: [['nails', 6], ['tape', 4], ['wire', 4], ['scrap', 4], ['crowbar', 1], ['tools', 1], ['flash', 2], ['battery', 2], ['bp_nail', 1]] },
  shed:    { n: 'Сарай', ic: '🛖', t: 20, roll: [1, 4], loot: [['planks', 5], ['nails', 5], ['wood', 4], ['rope', 3], ['axe', 1], ['seeds', 2], ['bp_garden', 1], ['bp_traps', 1]] },
  car:     { n: 'Багажник машины', ic: '🚗', t: 12, roll: [0, 3], loot: [['tools', 1], ['tape', 3], ['water', 3], ['bat', 1], ['bag2', 1], ['scrap', 4], ['flash', 2], ['a12', 1]] },
  backpack:{ n: 'Брошенный рюкзак', ic: '🎒', t: 10, roll: [1, 3], loot: [['canned', 3], ['water', 3], ['bandage', 2], ['lighter', 2], ['rod', 1], ['bag2', 1], ['cigs', 2], ['a9', 1], ['antirad', 1], ['bolts', 2], ['bottle', 2]] },
  locker:  { n: 'Шкафчик солдата', ic: '🗄️', t: 12, roll: [1, 3], loot: [['ration', 3], ['mjacket', 2], ['a545', 2], ['a9', 3], ['bandage', 2], ['cigs', 3], ['k_armory', 1], ['watch', 1]] },
  milcrate:{ n: 'Военный ящик', ic: '🪖', t: 20, roll: [2, 4], loot: [['ration', 4], ['a545', 3], ['a9', 3], ['a12', 2], ['bandage', 3], ['medkit', 1], ['gasmask', 1], ['bag3', 1], ['antirad', 2], ['bp_ammo', 1]] },
  armory:  { n: 'Оружейная стойка', ic: '🗃️', t: 15, roll: [2, 3], loot: [['ak', 2], ['pm', 3], ['sawn', 2], ['a545', 4], ['a9', 4], ['a12', 3], ['vest', 2]] },
  safe:    { n: 'Сейф', ic: '🔐', t: 10, roll: [2, 3], loot: [['cash', 5], ['ring', 3], ['watch', 3], ['pm', 1], ['a9', 2], ['antibio', 1]] },
  labdesk: { n: 'Лабораторный стол', ic: '🧪', t: 15, roll: [1, 3], loot: [['antirad', 3], ['alcohol', 3], ['elec', 4], ['battery', 3], ['antibio', 2], ['gasmask', 1], ['serum', 1]] },
  desk:    { n: 'Письменный стол', ic: '🗂️', t: 10, roll: [0, 2], loot: [['battery', 3], ['elec', 2], ['cash', 2], ['cigs', 2], ['picks', 1], ['bp_smoke', 1]] },
  bushes:  { n: 'Кусты и поляна', ic: '🌿', t: 20, roll: [1, 3], loot: [['berries', 5], ['mushroom', 4], ['herbs', 3], ['wood', 4], ['stick', 2], ['apple', 1]] },
  tent:    { n: 'Палатка туристов', ic: '⛺', t: 15, roll: [1, 3], loot: [['canned', 3], ['water', 3], ['rod', 2], ['lighter', 2], ['bag2', 1], ['parka', 1], ['flash', 1], ['knife', 2]] },
  stash:   { n: 'Тайник сталкера', ic: '🕳️', t: 15, roll: [2, 3], loot: [['antirad', 3], ['bolts', 3], ['a545', 2], ['medkit', 1], ['vodka', 2], ['detector', 1], ['gasmask', 1], ['bandage', 2]] },
};

// ---------- ВРАГИ ----------
// sp: скорость (1 — медленный, 2 — быстрый); human — можно поговорить
const ENEMY = {
  zombie:  { n: 'Заражённый', ic: '🧟', hp: 26, dmg: [5, 9], sp: 1, acc: 0.55, inj: ['scratch', 'lacer', 'bite', 'bruise'], loot: 'body', xp: 4 },
  runner:  { n: 'Бегун', ic: '🏃', hp: 22, dmg: [5, 8], sp: 2, acc: 0.6, inj: ['scratch', 'lacer', 'bite'], loot: 'body', xp: 5 },
  drowned: { n: 'Утопленник', ic: '🧟‍♂️', hp: 35, dmg: [6, 10], sp: 1, acc: 0.5, inj: ['scratch', 'bite', 'bruise'], loot: 'body', xp: 5 },
  soldier: { n: 'Заражённый солдат', ic: '🪖', hp: 45, dmg: [7, 11], sp: 1, acc: 0.55, arm: 3, inj: ['lacer', 'bite', 'bruise'], loot: 'locker', xp: 8 },
  dog:     { n: 'Одичавший пёс', ic: '🐕', hp: 18, dmg: [5, 8], sp: 2, acc: 0.65, inj: ['bite', 'lacer'], noVirus: 1, xp: 4, drop: [['meat', 1]] },
  raider:  { n: 'Мародёр', ic: '🥷', hp: 40, dmg: [8, 14], sp: 1, acc: 0.6, arm: 1, human: 1, inj: ['bullet', 'lacer', 'bruise'], loot: 'body', xp: 10, noVirus: 1, gear: [['knife', 3], ['bat', 2], ['pm', 2], ['sawn', 1]] },
  pdog:    { n: 'Псевдопёс', ic: '🐺', hp: 38, dmg: [8, 13], sp: 2, acc: 0.65, inj: ['bite', 'lacer'], noVirus: 1, xp: 10, drop: [['meat', 2]] },
  swamper: { n: 'Болотник', ic: '👹', hp: 65, dmg: [12, 18], sp: 2, acc: 0.6, arm: 2, inj: ['lacer', 'frac', 'bruise'], noVirus: 1, xp: 18, cloak: 1 },
  sci:     { n: 'Заражённый учёный', ic: '🥼', hp: 32, dmg: [6, 10], sp: 1, acc: 0.55, inj: ['scratch', 'bite'], loot: 'labdesk', xp: 6 },
  guard:   { n: 'Страж Аппарата', ic: '🗿', hp: 160, dmg: [14, 22], sp: 1, acc: 0.6, arm: 5, inj: ['frac', 'lacer', 'burn'], noVirus: 1, xp: 60, boss: 1, drop: [['crown', 1]] },
};

// ---------- АНОМАЛИИ ----------
const ANOM = {
  fire:  { n: 'Жарка', ic: '🔥', inj: 'burn', dmg: [12, 20], hint: 'дрожит воздух' },
  elec:  { n: 'Электра', ic: '⚡', inj: 'burn', dmg: [15, 25], hint: 'потрескивают искры' },
  grav:  { n: 'Воронка', ic: '🌀', inj: 'frac', dmg: [18, 28], hint: 'кружатся листья' },
  gas:   { n: 'Ржавый газ', ic: '☁️', inj: null, dmg: [6, 10], rad: 25, hint: 'жёлтый туман', mask: 1 },
};

// ---------- ЛОКАЦИИ ----------
// links: {id: минут пути}; dg: опасность 0..3; zone: зона аномалии (радиация)
const LOCS = {
  base: { n: 'Лодочная станция', ic: '🏚️', x: 30, y: 72, dg: 0, shelter: 1, base: 1,
    d: 'Старый лодочный сарай у воды. Твоя база. Где-то тут живёт кот.',
    links: { beach: 40, village: 50, forest: 45 }, fish: 1, water: 'sea',
    rooms: [{ n: 'Пристань', cont: ['shore', 'toolbox'], once: 1 }] },
  beach: { n: 'Дикий пляж', ic: '🏖️', x: 13, y: 56, dg: 1,
    d: 'Песок, обломки и ящики, которые выносит прибой. Утопленники бродят у воды.',
    links: { base: 40, lighthouse: 70 }, fish: 1, water: 'sea',
    rooms: [
      { n: 'Полоса прибоя', cont: ['shore', 'shore', 'body'], en: [['drowned', 0, 2]] },
      { n: 'Перевёрнутая лодка', cont: ['shore', 'backpack'], en: [['drowned', 0, 1]] },
      { n: 'Скалы', cont: ['shore'], en: [['dog', 0, 2]], dark: 1, fixed: { note: 'n_rocks' } },
    ] },
  village: { n: 'Рыбацкая деревня', ic: '🏘️', x: 44, y: 84, dg: 1, shelter: 1, trader: 'semen',
    d: 'Десяток домиков. В крайнем живёт Семёныч — тот самый, что тебя вытащил.',
    links: { base: 50, gas: 60, farm: 70 }, fish: 1, water: 'well',
    rooms: [
      { n: 'Дом Семёныча', safe: 1, trader: 'semen' },
      { n: 'Магазин «Продукты»', cont: ['shelf', 'shelf', 'kassa'], en: [['zombie', 1, 3]] },
      { n: 'Жилой дом', cont: ['fridge', 'wardrobe', 'night', 'medcab'], en: [['zombie', 0, 2]] },
      { n: 'Лодочный гараж', cont: ['toolbox', 'shed'], en: [['zombie', 0, 2]] },
      { n: 'Часовня', cont: ['night'], en: [['runner', 0, 1]], dark: 1, fixed: { note: 'n_chapel' } },
    ] },
  forest: { n: 'Сосновый лес', ic: '🌲', x: 40, y: 52, dg: 1,
    d: 'Тихий сосняк. Грибы, ягоды, дичь — и стаи одичавших собак.',
    links: { base: 45, farm: 50, meteo: 80, swamp: 70, lighthouse: 60 }, forage: 1, hunt: 1, water: 'stream',
    rooms: [
      { n: 'Опушка', cont: ['bushes', 'bushes'], en: [['dog', 0, 1]] },
      { n: 'Охотничья вышка', cont: ['backpack', 'body'], en: [['zombie', 0, 1]] },
      { n: 'Лагерь туристов', cont: ['tent', 'tent', 'body'], en: [['zombie', 1, 2], ['dog', 0, 1]] },
      { n: 'Глухая чаща', cont: ['bushes', 'stash'], en: [['dog', 1, 3]], dark: 1 },
    ] },
  farm: { n: 'Заброшенная ферма', ic: '🌾', x: 66, y: 64, dg: 2,
    d: 'Ферма, где всё началось для местных. Заражённых тут много.',
    links: { village: 70, forest: 50, gas: 45, post: 90 },
    rooms: [
      { n: 'Двор', cont: ['shed', 'car'], en: [['zombie', 1, 2]] },
      { n: 'Амбар', cont: ['shed', 'body'], en: [['zombie', 2, 3]], fixed: { item: 'k_farm' } },
      { n: 'Хозяйский дом', cont: ['fridge', 'wardrobe', 'night', 'medcab'], en: [['zombie', 1, 2], ['runner', 0, 1]] },
      { n: 'Подвал', cont: ['shelf', 'safe'], en: [['zombie', 1, 1]], lock: 'k_farm', dark: 1, fixed: { note: 'n_farm' } },
    ] },
  gas: { n: 'Заправка «Остров»', ic: '⛽', x: 77, y: 80, dg: 2,
    d: 'Заправка у дороги. Мародёры любят это место.',
    links: { village: 60, farm: 45, post: 70 },
    rooms: [
      { n: 'Магазин заправки', cont: ['shelf', 'kassa', 'night'], en: [['zombie', 1, 2]] },
      { n: 'Автомастерская', cont: ['toolbox', 'toolbox', 'car'], en: [['zombie', 0, 1], ['raider', 0, 1]] },
      { n: 'Подсобка', cont: ['safe', 'desk'], lock: 'pry', en: [['runner', 0, 1]], fixed: { item: 'dogtag', note: 'n_misha' } },
      { n: 'Стоянка', cont: ['car', 'car', 'car'], en: [['raider', 0, 2]] },
    ] },
  post: { n: 'Военный блокпост', ic: '🪖', x: 86, y: 50, dg: 3,
    d: 'Карантинный блокпост. Солдаты остались на посту — уже мёртвыми.',
    links: { farm: 90, gas: 70, nii: 60 },
    rooms: [
      { n: 'КПП', cont: ['desk', 'body'], en: [['soldier', 1, 2]], fixed: { item: 'kpplog' } },
      { n: 'Казарма', cont: ['locker', 'locker', 'locker', 'body'], en: [['soldier', 2, 3], ['zombie', 0, 1]] },
      { n: 'Склад', cont: ['milcrate', 'milcrate', 'shelf'], en: [['soldier', 1, 2]] },
      { n: 'Оружейная', cont: ['armory', 'milcrate'], lock: 'k_armory', en: [['soldier', 1, 1]] },
      { n: 'Радиорубка', cont: ['desk'], en: [['soldier', 0, 1]], fixed: { item: 'rpart', note: 'n_radio' } },
    ] },
  lighthouse: { n: 'Маяк', ic: '🗼', x: 12, y: 28, dg: 1, shelter: 1, trader: 'serg',
    d: 'Маяк на скале. Сержант Ковальчук превратил его в крепость.',
    links: { beach: 70, forest: 60, meteo: 70 },
    rooms: [
      { n: 'Нижний этаж', safe: 1, trader: 'serg' },
      { n: 'Кладовка', cont: ['shelf', 'toolbox'], en: [['runner', 0, 1]] },
      { n: 'Фонарная', cont: ['desk'], en: [['runner', 0, 1]], fixed: { item: 'rpart', note: 'n_light' } },
    ] },
  meteo: { n: 'Метеостанция №7', ic: '📡', x: 40, y: 18, dg: 2, shelter: 1, trader: 'levin', zone: 1,
    d: 'Метеостанция на холме. В бункере под ней прячется доктор Левин.',
    links: { lighthouse: 70, forest: 80, swamp: 50 },
    rooms: [
      { n: 'Бункер Левина', safe: 1, trader: 'levin' },
      { n: 'Лаборатория', cont: ['labdesk', 'medcab', 'desk'], en: [['sci', 1, 2]], fixed: { item: 'rpart', note: 'n_meteo' } },
      { n: 'Метеоплощадка', cont: ['body'], en: [['dog', 0, 2]], anom: 2 },
    ] },
  swamp: { n: 'Ржавое болото', ic: '☣️', x: 62, y: 32, dg: 3, zone: 2,
    d: 'Болото, где пространство гнётся. Аномалии, артефакты и твари.',
    links: { forest: 70, meteo: 50, nii: 60 },
    rooms: [
      { n: 'Гать', cont: ['body'], en: [['pdog', 0, 2]], anom: 2 },
      { n: 'Ржавая баржа', cont: ['milcrate', 'backpack', 'body'], en: [['zombie', 1, 2]] },
      { n: 'Лагерь сталкеров', cont: ['stash', 'backpack', 'tent'], en: [['raider', 0, 2]], fixed: { note: 'n_stalker' } },
      { n: 'Сердце болота', cont: [], en: [['swamper', 0, 1], ['pdog', 0, 1]], anom: 4 },
    ] },
  nii: { n: 'НИИ «Остров-7»', ic: '🏛️', x: 84, y: 16, dg: 3, zone: 3, lock: 'pass',
    d: 'Закрытый институт. Здесь построили Аппарат. Здесь всё и началось.',
    links: { swamp: 60, post: 60 },
    rooms: [
      { n: 'Проходная', cont: ['desk', 'body', 'locker'], en: [['soldier', 1, 2]] },
      { n: 'Лаборатории', cont: ['labdesk', 'labdesk', 'medcab'], en: [['sci', 2, 3], ['pdog', 0, 1]], fixed: { item: 'niidata', note: 'n_nii' } },
      { n: 'Аномальный коридор', cont: ['body'], en: [['swamper', 0, 1]], anom: 5 },
      { n: 'Зал Аппарата', cont: [], en: [['guard', 1, 1]], final: 1, dark: 1 },
    ] },
};
const ZONE_RAD = [0, 1, 3, 5]; // радиация за 10 минут по уровню зоны

// ---------- ПОСТРОЙКИ БАЗЫ (уровни; bp — нужен чертёж) ----------
const STRUCT = {
  bed:    { n: 'Спальное место', ic: '🛏️', lv: [{ n: 'Спальник на полу' }, { n: 'Кровать', c: { planks: 4, rag: 3, nails: 6 } }] },
  fire:   { n: 'Очаг', ic: '🔥', lv: [{ n: 'Нет' }, { n: 'Костёр', c: { wood: 3 } }, { n: 'Печь', c: { scrap: 6, planks: 2, wire: 2 } }] },
  bench:  { n: 'Верстак', ic: '🪚', lv: [{ n: 'Нет' }, { n: 'Верстак', c: { planks: 4, nails: 8 } }, { n: 'Мастерская', c: { scrap: 6, tools: 1, wire: 3 } }] },
  walls:  { n: 'Укрепления', ic: '🧱', def: [0, 15, 30, 50], lv: [{ n: 'Нет' }, { n: 'Баррикады из досок', c: { planks: 6, nails: 12 } }, { n: 'Укреплённые стены', c: { planks: 6, scrap: 6, nails: 12 } }, { n: 'Стальные листы', c: { scrap: 12, wire: 4, tools: 1 } }] },
  traps:  { n: 'Ловушки', ic: '🪤', bp: 'traps', def: [0, 12, 25], lv: [{ n: 'Нет' }, { n: 'Колья у входа', c: { planks: 4, nails: 10 } }, { n: 'Растяжки и колья', c: { wire: 4, scrap: 3, planks: 2 } }] },
  distill:{ n: 'Опреснитель', ic: '⚗️', lv: [{ n: 'Нет' }, { n: 'Самодельный опреснитель', c: { scrap: 3, tape: 1, wire: 1 } }] },
  rain:   { n: 'Дождесборник', ic: '🌧️', bp: 'rain', lv: [{ n: 'Нет' }, { n: 'Дождесборник', c: { rag: 2, planks: 2, tape: 1 } }] },
  smoke:  { n: 'Коптильня', ic: '♨️', bp: 'smoke', lv: [{ n: 'Нет' }, { n: 'Коптильня', c: { scrap: 3, planks: 2 } }] },
  garden: { n: 'Огород', ic: '🥕', bp: 'garden', lv: [{ n: 'Нет' }, { n: 'Грядки', c: { planks: 3, seeds: 1 } }] },
  radio:  { n: 'Радиостанция', ic: '📻', lv: [{ n: 'Нет' }, { n: 'Радиостанция', c: { rpart: 3, wire: 2, battery: 2 } }] },
};

// ---------- КРАФТ ----------
// st: станция (fire / bench / bench2); bp: нужен чертёж; sk: навык ремесла
const RECIPES = [
  { id: 'dband', n: 'Повязка из тряпки', need: { rag: 1 }, out: { dband: 1 }, t: 5 },
  { id: 'bandage', n: 'Прокипятить повязку', need: { dband: 1 }, out: { bandage: 1 }, st: 'fire', t: 15 },
  { id: 'water', n: 'Прокипятить грязную воду', need: { dwater: 1 }, out: { water: 1 }, st: 'fire', t: 15 },
  { id: 'desal', n: 'Опреснить морскую воду', need: { seawater: 2 }, out: { water: 1, bottle: 1 }, st: 'distill', t: 40 },
  { id: 'cmeat', n: 'Пожарить мясо', need: { meat: 1 }, out: { cmeat: 1 }, st: 'fire', t: 20 },
  { id: 'cfish', n: 'Пожарить рыбу', need: { fish: 1 }, out: { cfish: 1 }, st: 'fire', t: 15 },
  { id: 'cmush', n: 'Пожарить грибы', need: { mushroom: 1 }, out: { cmush: 1 }, st: 'fire', t: 10 },
  { id: 'smoked', n: 'Закоптить рыбу', need: { fish: 2, wood: 1 }, out: { smoked: 2 }, st: 'smoke', t: 60 },
  { id: 'splint', n: 'Шина', need: { stick: 2, rag: 1 }, out: { splint: 1 }, t: 10 },
  { id: 'stick', n: 'Палка из дров', need: { wood: 1 }, out: { stick: 1 }, t: 5 },
  { id: 'planks', n: 'Распилить дрова на доски', need: { wood: 2 }, out: { planks: 1 }, st: 'bench', t: 20 },
  { id: 'spear', n: 'Копьё', need: { stick: 1, knife: 1, tape: 1 }, out: { spear: 1 }, t: 20 },
  { id: 'nailbat', n: 'Дубина с гвоздями', need: { planks: 1, nails: 8 }, out: { nailbat: 1 }, st: 'bench', bp: 'nailbat', t: 25 },
  { id: 'picks', n: 'Отмычки', need: { wire: 2 }, out: { picks: 1 }, st: 'bench', bp: 'picks', t: 20 },
  { id: 'a12', n: 'Патроны 12 кал. (×4)', need: { scrap: 1, battery: 1 }, out: { a12: 4 }, st: 'bench2', bp: 'a12', t: 40 },
  { id: 'bolts', n: 'Болты (×10)', need: { scrap: 1 }, out: { bolts: 10 }, st: 'bench', t: 10 },
  { id: 'herbal', n: 'Травяная мазь (антисептик)', need: { herbs: 3, alcohol: 1 }, out: { antisep: 1 }, st: 'fire', t: 30 },
];

// ---------- ТОРГОВЦЫ И КВЕСТЫ ----------
const TRADERS = {
  semen: { n: 'Семёныч', ic: '🧓', d: 'Старый рыбак. Это он вытащил тебя на берег.',
    stock: [['canned', 0], ['water', 0], ['fish', 0], ['bandage', 0], ['rod', 0], ['seeds', 0], ['bag1', 0], ['smoked', 1], ['antisep', 1], ['bp_smoke', 1], ['bag2', 2], ['bp_garden', 2]],
    buys: ['food', 'drink', 'mat', 'val', 'tool', 'melee', 'wear', 'med'],
    quests: ['q_fish', 'q_farm', 'q_misha'] },
  serg: { n: 'Сержант Ковальчук', ic: '🪖', d: 'Единственный, кто остался от гарнизона. Подозрительный, но честный.',
    stock: [['a9', 0], ['bandage', 0], ['knife', 0], ['bat', 0], ['pm', 1], ['a12', 1], ['mjacket', 1], ['bp_traps', 1], ['sawn', 2], ['a545', 2], ['vest', 3], ['ak', 3]],
    buys: ['melee', 'gun', 'ammo', 'wear', 'val', 'med', 'food'],
    quests: ['q_post', 'q_kpp', 'q_guard'] },
  nomad: { n: 'Кочевой торговец', ic: '🧳', d: 'Ходит по острову с огромным рюкзаком. Никто не знает, откуда он берёт товар.',
    stock: [['bag3', 0], ['detector', 0], ['vest', 0], ['gasmask', 0], ['medkit', 0], ['antirad', 0], ['antibio', 0], ['a545', 0], ['a9', 0], ['bp_ammo', 0], ['bp_traps', 0], ['serum', 0]],
    buys: ['food', 'drink', 'med', 'melee', 'gun', 'ammo', 'wear', 'art', 'tool', 'mat', 'val'], artBonus: 1.2, quests: [] },
  levin: { n: 'Доктор Левин', ic: '👨‍🔬', d: 'Учёный из НИИ. Знает про Аппарат больше, чем говорит.',
    stock: [['antirad', 0], ['bolts', 0], ['antibio', 0], ['gasmask', 1], ['medkit', 1], ['detector', 2], ['coldpill', 0], ['serum', 3]],
    buys: ['art', 'med', 'val', 'mat'], artBonus: 1.5,
    quests: ['q_art', 'q_anom', 'q_nii'] },
};

// type: items (принести), kill (убить в локации), flag (событие), visit
const QUESTS = {
  // Главная линия
  m_camp:  { g: 'main', n: 'Обжиться', d: 'Разведи костёр (3 дров) и сделай спальное место получше на базе. Дрова — в лесу или из досок.', type: 'flag', flag: 'camp_ready', rew: { xp: { surv: 10 } }, next: 'm_radio' },
  m_radio: { g: 'main', n: 'Голос в эфире', d: 'Собери на базе радиостанцию: 3 радиодетали (Метеостанция, Маяк, Блокпост), 2 проволоки, 2 батарейки.', type: 'flag', flag: 'radio_built', rew: {}, next: 'm_nii' },
  m_nii:   { g: 'main', n: 'Остров-7', d: 'Радио поймало запись: остров на карантине из-за Аппарата в НИИ. Нужен пропуск — спроси Сержанта. Дойди до Зала Аппарата.', type: 'flag', flag: 'apparatus', rew: {} },
  // Семёныч
  q_fish:  { g: 'semen', n: 'Улов', d: 'Принеси 3 сырые рыбы — у старика спина не та, чтобы рыбачить.', type: 'items', need: { fish: 3 }, rew: { money: 60, items: { rod: 1, smoked: 2 }, rep: 1 } },
  q_farm:  { g: 'semen', n: 'Зачистка фермы', d: 'На ферме бродят бывшие соседи. Упокой хотя бы 6 из них.', type: 'kill', loc: 'farm', count: 6, rew: { money: 120, items: { antibio: 1, bp_garden: 1 }, rep: 1 } },
  q_misha: { g: 'semen', n: 'Сын Семёныча', d: 'Сын Семёныча, Миша, ушёл на заправку и не вернулся. Найди хоть что-нибудь.', type: 'items', need: { dogtag: 1 }, rew: { money: 150, items: { bag2: 1 }, rep: 2 } },
  // Сержант
  q_post:  { g: 'serg', n: 'Бывшие сослуживцы', d: 'На блокпосту мои ребята… уже не мои. Упокой 5 солдат.', type: 'kill', loc: 'post', count: 5, rew: { money: 150, items: { k_armory: 1 }, rep: 1 } },
  q_kpp:   { g: 'serg', n: 'Журнал КПП', d: 'Принеси журнал с КПП. Хочу знать, кто приказал закрыть остров.', type: 'items', need: { kpplog: 1 }, rew: { money: 100, items: { pass: 1 }, rep: 1 } },
  q_guard: { g: 'serg', n: 'Сердце проблемы', d: 'Если доберёшься до Зала Аппарата — уничтожь то, что его охраняет.', type: 'flag', flag: 'guard_dead', rew: { money: 500, items: { ak: 1, a545: 60 }, rep: 2 } },
  // Левин
  q_art:   { g: 'levin', n: 'Образец', d: 'Принеси любой артефакт. Они рождаются в аномалиях после Выброса.', type: 'art', rew: { money: 200, items: { detector: 1 }, rep: 1 } },
  q_anom:  { g: 'levin', n: 'Замеры', d: 'Найди болтами 6 аномалий (на болоте, у метеостанции, в НИИ).', type: 'count', key: 'anomFound', count: 6, rew: { money: 150, items: { gasmask: 1, antirad: 2 }, rep: 1 } },
  q_nii:   { g: 'levin', n: 'Записи брата', d: 'Мой брат вёл записи в лабораториях НИИ. Принеси их.', type: 'items', need: { niidata: 1 }, rew: { money: 300, items: { serum: 1 }, rep: 2 } },
};

// ---------- ЗАПИСКИ (сюжет по кусочкам) ----------
const NOTES = {
  n_start:   { t: 'Записка в кармане', x: 'Ты не помнишь, как оказался на острове. В кармане — билет на паром «Остров-7 — Большая земля». Дата — три месяца назад.' },
  n_rocks:   { t: 'Нацарапано на скале', x: '«Кто бы ни читал — не пей из болота. И не верь синему свету.»' },
  n_chapel:  { t: 'Дневник священника', x: '«Сначала заболели рабочие из института. Потом их родственники. Потом все, кого они укусили. Господи, прости нас.»' },
  n_farm:    { t: 'Письмо фермера', x: '«Учёные платили за воду из нашего колодца. Говорили — для анализов. А потом вода засветилась.»' },
  n_misha:   { t: 'Записка Миши', x: '«Пап, если найдёшь — я ушёл за лекарствами на блокпост. Не ругайся. Мама бы поняла.»' },
  n_radio:   { t: 'Радиожурнал', x: '«Приказ штаба: остров закрыть. Связь глушить. Эвакуации не будет. Повторяю: эвакуации не будет.»' },
  n_light:   { t: 'Записи смотрителя', x: '«Каждые несколько дней небо краснеет. Кто не успел спрятаться — того больше нет. Кто успел — видит потом странные камни в аномалиях.»' },
  n_meteo:   { t: 'Отчёт метеостанции', x: '«Выбросы цикличны. Источник — НИИ. Мощность растёт. Аппарат питается… чем? Левин-старший не отвечает.»' },
  n_stalker: { t: 'ПДА сталкера', x: '«Кристаллы — самые ценные. Говорят, если собрать много, Аппарат сделает из них корону. Бред, конечно. Но я видел светящийся венец в коридоре НИИ…»' },
  n_nii:     { t: 'Записи Левина-старшего', x: '«Аппарат не создаёт аномалии — он их притягивает. Он открывает дверь. Если вынуть ядро — дверь закроется. Или распахнётся настежь. Я не знаю.»' },
  n_vk:      { t: 'Старая рация в сарае', x: '«…Mystery of the Island… Выживание… если вы это слышите — команды: Искать, Копать, Крафт… [шум]…» — Похоже, кто-то играл здесь в игру. Давно, ещё до всего этого.' },
};

const WEATHER = [
  { id: 'clear', n: 'Ясно', ic: '☀️', w: 4 },
  { id: 'cloud', n: 'Облачно', ic: '⛅', w: 3 },
  { id: 'rain', n: 'Дождь', ic: '🌧️', w: 2, wet: 1 },
  { id: 'fog', n: 'Туман', ic: '🌫️', w: 2, stealth: 0.12 },
  { id: 'storm', n: 'Гроза', ic: '⛈️', w: 1, wet: 2 },
];
