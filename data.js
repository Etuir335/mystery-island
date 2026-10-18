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

// ---------- ПРОФЕССИИ (как в Project Zomboid): навыки, стартовые вещи и очки на черты ----------
// pts — очки на черты; sk — стартовые уровни навыков; kit — вещи; m — модификаторы (см. mod() в game.js)
const PROFS = {
  unemployed: { n: 'Безработный', ic: '🧍', pts: 8, d: 'Ничего не умеешь — зато больше всего очков на черты.' },
  fisher:     { n: 'Рыбак', ic: '🎣', pts: 4, sk: { surv: 1 }, kit: [['rod', 1], ['smoked', 1]], m: { fish: 1 }, d: 'Удочка с собой, улов больше.' },
  hunter:     { n: 'Охотник', ic: '🏹', pts: 1, sk: { surv: 2, shoot: 1 }, kit: [['knife', 1]], m: { hunt: 0.25 }, d: 'Выживание и стрельба, охота удачнее.' },
  carpenter:  { n: 'Плотник', ic: '🪚', pts: 3, sk: { craft: 2 }, kit: [['planks', 4], ['nails', 12]], m: { build: -0.15 }, d: 'Ремесло, доски и гвозди. Постройки дешевле.' },
  mechanic:   { n: 'Механик', ic: '🔧', pts: 2, sk: { craft: 1, search: 1 }, kit: [['tools', 1], ['tape', 1]], m: { car: 1, dur: -0.2 }, d: 'Набор инструментов. Машину чинить проще, оружие изнашивается медленнее.' },
  nurse:      { n: 'Медсестра', ic: '🩺', pts: 2, sk: { med: 3 }, kit: [['bandage', 3], ['antisep', 1]], m: { heal: 0.2 }, d: 'Медицина 3, бинты и антисептик.' },
  soldier:    { n: 'Солдат', ic: '🪖', pts: -2, sk: { shoot: 2, melee: 1 }, kit: [['pm', 1], ['a9', 8], ['mjacket', 1]], m: { panic: -1 }, d: 'Пистолет и куртка. Не паникует в бою.' },
  police:     { n: 'Полицейский', ic: '👮', pts: 0, sk: { shoot: 1, melee: 1, search: 1 }, kit: [['bat', 1], ['flash', 1]], m: { gunAcc: 0.04 }, d: 'Дубинка (бита) и фонарик.' },
  cook:       { n: 'Повар', ic: '👨‍🍳', pts: 4, sk: { surv: 1 }, kit: [['canned', 2], ['knife', 1]], m: { hunger: -0.1, eatRaw: -0.4 }, d: 'Меньше ест, реже травится.' },
  electric:   { n: 'Электрик', ic: '⚡', pts: 3, sk: { craft: 1 }, kit: [['battery', 2], ['elec', 1], ['wire', 2]], m: { craftTime: -0.1 }, d: 'Батарейки, электроника и проволока.' },
  farmer:     { n: 'Фермер', ic: '🧑‍🌾', pts: 4, sk: { surv: 1 }, kit: [['seeds', 2]], m: { garden: 0.5, forage: 1 }, d: 'Огород растит быстрее, собирательство богаче.' },
  lab:        { n: 'Лаборант НИИ', ic: '🥼', pts: 2, sk: { med: 1, search: 1 }, kit: [['antirad', 1], ['alcohol', 1]], m: { rad: -0.3 }, d: 'Знает Зону: радиация липнет меньше.' },
  burglar:    { n: 'Взломщик', ic: '🥷', pts: 1, sk: { stealth: 2, search: 1 }, kit: [['picks', 1]], m: { pick: 1 }, d: 'Отмычки не ломаются, тихий шаг.' },
  athlete:    { n: 'Спортсмен', ic: '🏃', pts: 2, m: { fatigue: -0.2, flee: 0.15, travel: -0.1, carry: 3 }, d: 'Выносливость, бег и лишние 3 кг.' },
};

// ---------- ЧЕРТЫ: плюсы стоят очков, минусы дают ----------
// g — группа (взаимоисключающие черты), sk — навыки, m — модификаторы
const TRAITS = {
  // --- плюсы
  strong:   { n: 'Сильный', ic: '💪', cost: 4, g: 'str', m: { carry: 8, meleeDmg: 0.15 }, d: '+8 кг к весу, удары сильнее' },
  athletic: { n: 'Атлет', ic: '🏅', cost: 3, m: { fatigue: -0.25, carry: 3, flee: 0.1 }, d: 'Меньше устаёшь, +3 кг, легче убежать' },
  fast:     { n: 'Быстроногий', ic: '👟', cost: 2, m: { travel: -0.15, flee: 0.15 }, d: 'Путь короче на 15%, легче убежать' },
  quiet:    { n: 'Тихоня', ic: '🤫', cost: 2, g: 'noise', sk: { stealth: 2 }, d: 'Скрытность +2' },
  keen:     { n: 'Зоркий', ic: '👁️', cost: 2, g: 'eyes', sk: { search: 2 }, d: 'Поиск +2: быстрее и больше находишь' },
  tough:    { n: 'Крепкий', ic: '🛡️', cost: 3, g: 'health', m: { infect: -0.5, ill: -0.5 }, d: 'Реже болеешь, раны воспаляются вдвое медленнее' },
  lucky:    { n: 'Везунчик', ic: '🍀', cost: 3, g: 'luck', m: { loot: 0.15, crit: 0.05 }, d: 'Чаще лишняя находка и крит' },
  owl:      { n: 'Ночная сова', ic: '🦉', cost: 2, m: { nightEye: 1 }, d: 'Ночью не медленнее в пути, скрытнее в темноте' },
  cateyes:  { n: 'Кошачьи глаза', ic: '🐱', cost: 2, m: { dark: 1 }, d: 'В тёмных комнатах ищешь как днём, без фонарика' },
  learner:  { n: 'Быстро учится', ic: '📚', cost: 3, g: 'learn', m: { xp_all: 0.3 }, d: 'Опыт +30%' },
  smalleat: { n: 'Малоежка', ic: '🥢', cost: 2, g: 'food', m: { hunger: -0.3 }, d: 'Голод растёт на 30% медленнее' },
  camel:    { n: 'Верблюд', ic: '🐫', cost: 2, g: 'thirst', m: { thirst: -0.3 }, d: 'Жажда растёт на 30% медленнее' },
  thick:    { n: 'Толстокожий', ic: '🦏', cost: 2, g: 'skin', m: { injChance: -0.15, bleedRes: -0.25 }, d: 'Реже раны, слабее кровотечения' },
  regen:    { n: 'Быстрая регенерация', ic: '💚', cost: 2, g: 'heal', m: { heal: 0.4 }, d: 'Раны заживают на 40% быстрее' },
  brave:    { n: 'Храбрый', ic: '🦁', cost: 2, g: 'nerve', m: { panic: -1, stress: -0.2 }, d: 'Не паникует, стресс ниже' },
  marksman: { n: 'Меткий', ic: '🎯', cost: 2, g: 'aim', m: { gunAcc: 0.08 }, sk: { shoot: 1 }, d: 'Стрельба +1, точнее выстрелы' },
  brawler:  { n: 'Драчун', ic: '🥊', cost: 2, m: { meleeAcc: 0.06 }, sk: { melee: 1 }, d: 'Ближний бой +1, точнее удары' },
  handy:    { n: 'Мастер на все руки', ic: '🛠️', cost: 2, m: { craftTime: -0.3, dur: -0.25 }, sk: { craft: 1 }, d: 'Ремесло +1, крафт быстрее, оружие служит дольше' },
  haggler:  { n: 'Торгаш', ic: '🤑', cost: 2, m: { buy: -0.12, sell: 0.12 }, d: 'Покупаешь дешевле, продаёшь дороже' },
  scav:     { n: 'Мусорщик', ic: '🗑️', cost: 2, m: { loot: 0.1, searchTime: -0.15 }, d: 'Обыскиваешь быстрее и находишь больше' },
  angler:   { n: 'Заядлый рыбак', ic: '🐟', cost: 1, m: { fish: 1 }, d: '+1 рыба к улову' },
  herbal:   { n: 'Травник', ic: '🌿', cost: 1, m: { forage: 1, eatRaw: -0.3 }, d: 'Больше находок в лесу, реже травишься' },
  ironbelly:{ n: 'Железный желудок', ic: '🫃', cost: 2, g: 'belly', m: { eatRaw: -0.7 }, d: 'Сырое и тухлое почти не вредит' },
  radres:   { n: 'Радиостойкий', ic: '☢️', cost: 2, m: { rad: -0.4 }, d: 'Радиация липнет на 40% меньше' },
  walrus:   { n: 'Морж', ic: '🥶', cost: 2, g: 'cold', m: { cold: -0.5 }, d: 'Холод вдвое слабее' },
  sleeper:  { n: 'Крепкий сон', ic: '😴', cost: 1, g: 'sleep', m: { sleep: 0.3 }, d: 'Высыпаешься на 30% быстрее' },
  hearing:  { n: 'Чуткий слух', ic: '👂', cost: 2, g: 'ears', m: { ambush: -0.3 }, d: 'В пути реже попадаешь в засады' },
  medic:    { n: 'Медик', ic: '⛑️', cost: 2, sk: { med: 2 }, d: 'Медицина +2, стартовая аптечка' },
  hunter:   { n: 'Следопыт', ic: '🐾', cost: 2, sk: { surv: 2 }, m: { hunt: 0.15 }, d: 'Выживание +2, охота удачнее' },
  // --- минусы
  smoker:   { n: 'Курильщик', ic: '🚬', cost: -2, d: 'Без сигарет каждые ~12 ч растёт стресс' },
  clumsy:   { n: 'Неуклюжий', ic: '🦶', cost: -2, g: 'noise', m: { noise: 0.5, stealth: -0.15 }, d: 'Шумишь в полтора раза сильнее' },
  sickly:   { n: 'Слабое здоровье', ic: '🤧', cost: -3, g: 'health', m: { ill: 1 }, d: 'Болеешь вдвое чаще' },
  glutton:  { n: 'Обжора', ic: '🍔', cost: -2, g: 'food', m: { hunger: 0.4 }, d: 'Голод растёт на 40% быстрее' },
  thirsty:  { n: 'Сушняк', ic: '🥵', cost: -1, g: 'thirst', m: { thirst: 0.3 }, d: 'Жажда растёт на 30% быстрее' },
  coward:   { n: 'Трус', ic: '😰', cost: -2, g: 'nerve', m: { panic: 1, stress: 0.2 }, d: 'В бою паникуешь, стресс выше' },
  myopic:   { n: 'Близорукий', ic: '👓', cost: -1, g: 'eyes', sk: { search: -1 }, m: { gunAcc: -0.05 }, d: 'Поиск −1, стреляешь хуже' },
  hemo:     { n: 'Гемофилик', ic: '🩸', cost: -3, g: 'skin', m: { bleedRes: 0.7 }, d: 'Кровотечения на 70% сильнее' },
  slowlearn:{ n: 'Тугодум', ic: '🐌', cost: -3, g: 'learn', m: { xp_all: -0.3 }, d: 'Опыт −30%' },
  weak:     { n: 'Слабак', ic: '🪶', cost: -3, g: 'str', m: { carry: -5, meleeDmg: -0.15 }, d: '−5 кг к весу, удары слабее' },
  insomnia: { n: 'Бессонница', ic: '🌙', cost: -1, g: 'sleep', m: { sleep: -0.3, stress: 0.1 }, d: 'Спишь хуже, нервы на пределе' },
  asthma:   { n: 'Одышка', ic: '😮‍💨', cost: -2, m: { fatigue: 0.25, flee: -0.1 }, d: 'Быстрее устаёшь, труднее убежать' },
  slowheal: { n: 'Плохая регенерация', ic: '🩹', cost: -2, g: 'heal', m: { heal: -0.35 }, d: 'Раны заживают на 35% медленнее' },
  unlucky:  { n: 'Невезучий', ic: '🐈‍⬛', cost: -2, g: 'luck', m: { loot: -0.12, crit: -0.04 }, d: 'Находок меньше, критов меньше' },
  allergy:  { n: 'Аллергия на пыль', ic: '🤧', cost: -1, m: { sneeze: 1 }, d: 'При обыске можешь чихнуть — тебя услышат' },
  pacifist: { n: 'Пацифист', ic: '☮️', cost: -2, m: { xp_melee: -0.3, xp_shoot: -0.3 }, d: 'Боевые навыки растут на 30% медленнее' },
  deaf:     { n: 'Тугоухий', ic: '🦻', cost: -1, g: 'ears', m: { ambush: 0.3 }, d: 'В пути чаще попадаешь в засады' },
  claustro: { n: 'Клаустрофоб', ic: '😖', cost: -1, m: { claustro: 1 }, d: 'В тёмных помещениях растёт стресс' },
  chilly:   { n: 'Мерзляк', ic: '🧣', cost: -2, g: 'cold', m: { cold: 0.5 }, d: 'Холод в полтора раза сильнее' },
  fatlegs:  { n: 'Полноват', ic: '🍩', cost: -2, m: { fatigue: 0.15, travel: 0.1 }, d: 'Быстрее устаёшь, в пути дольше' },
};

// ---------- ПЕРКИ: на 2-м и 4-м уровне навыка — выбор одного из двух ----------
const PERKS = {
  melee:   { 2: [{ id: 'butcher', n: 'Мясник', ic: '🪓', m: { crit: 0.1 }, d: 'Крит +10%' }, { id: 'defender', n: 'Защитник', ic: '🛡️', m: { block: 0.15 }, d: '15%: блок — урон вдвое меньше' }],
             4: [{ id: 'executioner', n: 'Палач', ic: '🗡️', m: { sneakDmg: 0.6 }, d: 'Удар из засады ещё на 60% сильнее' }, { id: 'ironskin', n: 'Железная кожа', ic: '🦾', m: { injChance: -0.2 }, d: 'Раны на 20% реже' }] },
  shoot:   { 2: [{ id: 'steady', n: 'Твёрдая рука', ic: '✋', m: { gunAcc: 0.08 }, d: 'Точность +8%' }, { id: 'thrifty', n: 'Экономный', ic: '🧮', m: { ammoSave: 0.25 }, d: '25%: патрон не тратится' }],
             4: [{ id: 'headhunter', n: 'Охотник за головами', ic: '🎯', m: { gunCrit: 0.15 }, d: 'Выстрел может нанести двойной урон (15%)' }, { id: 'silent', n: 'Глушитель', ic: '🔇', m: { gunNoise: -0.4 }, d: 'Выстрелы на 40% тише' }] },
  stealth: { 2: [{ id: 'shadow', n: 'Тень', ic: '🌑', m: { stealth: 0.1 }, d: 'Шанс остаться незамеченным +10%' }, { id: 'pickpocket', n: 'Карманник', ic: '🫳', m: { loot: 0.08 }, d: 'Находки +8%' }],
             4: [{ id: 'assassin', n: 'Убийца', ic: '🥷', m: { sneakDmg: 0.6 }, d: 'Удар из засады на 60% сильнее' }, { id: 'ghost', n: 'Призрак', ic: '👻', m: { noise: -0.3 }, d: 'Шумишь на 30% меньше' }] },
  med:     { 2: [{ id: 'fieldmed', n: 'Полевой медик', ic: '🩹', m: { heal: 0.25 }, d: 'Заживление +25%' }, { id: 'pharma', n: 'Фармацевт', ic: '💊', m: { medEff: 0.5 }, d: 'Лекарства и аптечки на 50% сильнее' }],
             4: [{ id: 'surgeon', n: 'Хирург', ic: '🔬', m: { infect: -0.4 }, d: 'Воспаления на 40% слабее' }, { id: 'immune', n: 'Иммунитет', ic: '🧬', m: { ill: -0.4, virus: -0.4 }, d: 'Болезни и вирус на 40% реже' }] },
  search:  { 2: [{ id: 'quickhands', n: 'Быстрые руки', ic: '🤲', m: { searchTime: -0.25 }, d: 'Обыск на 25% быстрее' }, { id: 'treasure', n: 'Кладоискатель', ic: '💰', m: { loot: 0.12 }, d: 'Находки +12%' }],
             4: [{ id: 'lockmaster', n: 'Медвежатник', ic: '🔓', m: { pick: 1 }, d: 'Отмычки не ломаются и почти не подводят' }, { id: 'appraiser', n: 'Оценщик', ic: '🧐', m: { sell: 0.15 }, d: 'Продаёшь на 15% дороже' }] },
  craft:   { 2: [{ id: 'saver', n: 'Бережливый', ic: '♻️', m: { refund: 0.25 }, d: '25%: один материал возвращается' }, { id: 'repairman', n: 'Ремонтник', ic: '🔧', m: { dur: -0.35 }, d: 'Оружие изнашивается на 35% медленнее' }],
             4: [{ id: 'engineer', n: 'Инженер', ic: '📐', m: { build: -0.2 }, d: 'Постройки на 20% дешевле' }, { id: 'gunsmith', n: 'Оружейник', ic: '🔫', m: { ammoCraft: 1 }, d: 'Патронов и взрывчатки при крафте вдвое больше' }] },
  surv:    { 2: [{ id: 'anglerP', n: 'Рыболов', ic: '🎣', m: { fish: 1 }, d: '+1 рыба к улову' }, { id: 'gatherer', n: 'Собиратель', ic: '🧺', m: { forage: 1 }, d: '+1 находка при собирательстве' }],
             4: [{ id: 'tracker', n: 'Следопыт', ic: '🐺', m: { hunt: 0.3, ambush: -0.25 }, d: 'Охота +30%, засады реже' }, { id: 'iceman', n: 'Закалённый', ic: '❄️', m: { cold: -0.4, hunger: -0.15 }, d: 'Холод −40%, голод −15%' }] },
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
  cblade:   { n: 'Кристальный клинок', ic: '🔷', c: 'melee', w: 0.8, v: 260, dmg: [17, 23], dur: 140, noise: 2 },
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
  cvest:    { n: 'Кристальная броня', ic: '🛡️', c: 'wear', w: 5, v: 700, slot: 'vest', arm: 8, warm: 1 },
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
  cshard:   { n: 'Осколок кристалла', ic: '🔹', c: 'mat', w: 0.1, v: 40, d: 'Холодный, светится изнутри. Появились после того, как ты забрал ядро.' },
  cheart:   { n: 'Сердце острова', ic: '💠', c: 'art', w: 1, v: 8000, art: { heal: 3, cap: 8, warm: 2, rad: -3 }, d: 'Огромный кристалл, бьющийся как сердце. Сила Мастера острова.' },
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
  crys:    { n: 'Кристаллид', ic: '💠', hp: 55, dmg: [9, 14], sp: 1, acc: 0.6, arm: 4, inj: ['lacer', 'burn'], noVirus: 1, xp: 14, drop: [['cshard', 2]] },
  keeper:  { n: 'Хранитель Кристаллов', ic: '🔷', hp: 260, dmg: [16, 26], sp: 1, acc: 0.62, arm: 6, inj: ['frac', 'lacer', 'burn'], noVirus: 1, xp: 120, boss: 1, drop: [['cshard', 8]] },
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
    links: { beach: 40, village: 50, forest: 45, reef: 120 }, fish: 1, water: 'sea',
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
  // Глава 2: доступен только по морю, на лодке с кристальным двигателем
  reef: { n: 'Остров-8', ic: '🏝️', x: 10, y: 94, dg: 3, zone: 2, ch2: 1, boat: 1,
    d: 'Скалистый островок за проливом. Отсюда в небо бьёт синий шпиль — второй Аппарат, о котором молчали все записи.',
    links: { base: 120 }, fish: 1, water: 'sea',
    rooms: [
      { n: 'Причал-призрак', cont: ['shore', 'body', 'backpack'], en: [['drowned', 1, 2]] },
      { n: 'Кристальный грот', cont: ['stash'], en: [['crys', 1, 2]], anom: 3 },
      { n: 'Лаборатория «Б»', cont: ['labdesk', 'safe', 'medcab'], en: [['sci', 1, 2], ['crys', 0, 1]], fixed: { note: 'n_reef' } },
      { n: 'Шпиль', cont: [], en: [['keeper', 1, 1]], final2: 1, dark: 1 },
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
  boat:   { n: 'Лодка', ic: '⛵', ch2: 1, lv: [{ n: 'Разбитая лодка у пристани' }, { n: 'Залатанный корпус', c: { planks: 8, nails: 20, rope: 4 } }, { n: 'Кристальный двигатель', c: { core: 1, cshard: 6, elec: 3, wire: 4 } }] },
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
  { id: 'planks_hand', n: 'Грубо обтесать доску (без верстака)', need: { wood: 3 }, out: { planks: 1 }, t: 45 },
  { id: 'spear', n: 'Копьё', need: { stick: 1, knife: 1, tape: 1 }, out: { spear: 1 }, t: 20 },
  { id: 'nailbat', n: 'Дубина с гвоздями', need: { planks: 1, nails: 8 }, out: { nailbat: 1 }, st: 'bench', bp: 'nailbat', t: 25 },
  { id: 'picks', n: 'Отмычки', need: { wire: 2 }, out: { picks: 1 }, st: 'bench', bp: 'picks', t: 20 },
  { id: 'a12', n: 'Патроны 12 кал. (×4)', need: { scrap: 1, battery: 1 }, out: { a12: 4 }, st: 'bench2', bp: 'a12', t: 40 },
  { id: 'bolts', n: 'Болты (×10)', need: { scrap: 1 }, out: { bolts: 10 }, st: 'bench', t: 10 },
  { id: 'cblade', n: 'Кристальный клинок', need: { knife: 1, cshard: 4, tape: 1 }, out: { cblade: 1 }, st: 'bench', ch2: 1, t: 40 },
  { id: 'cvest', n: 'Кристальная броня', need: { vest: 1, cshard: 6, wire: 2 }, out: { cvest: 1 }, st: 'bench2', ch2: 1, t: 60 },
  { id: 'herbal', n: 'Травяная мазь (антисептик)', need: { herbs: 3, alcohol: 1 }, out: { antisep: 1 }, st: 'fire', t: 30 },
];

// ---------- ТОРГОВЦЫ И КВЕСТЫ ----------
const TRADERS = {
  semen: { n: 'Семёныч', ic: '🧓', d: 'Старый рыбак. Это он вытащил тебя на берег.',
    stock: [['canned', 0], ['water', 0], ['fish', 0], ['bandage', 0], ['rod', 0], ['seeds', 0], ['bag1', 0], ['smoked', 1], ['antisep', 1], ['bp_smoke', 1], ['bag2', 2], ['bp_garden', 2]],
    buys: ['food', 'drink', 'mat', 'val', 'tool', 'melee', 'wear', 'med'],
    quests: ['q_fish', 'q_farm', 'q_misha', 'q_hull'] },
  serg: { n: 'Сержант Ковальчук', ic: '🪖', d: 'Единственный, кто остался от гарнизона. Подозрительный, но честный.',
    stock: [['a9', 0], ['bandage', 0], ['knife', 0], ['bat', 0], ['pm', 1], ['a12', 1], ['mjacket', 1], ['bp_traps', 1], ['sawn', 2], ['a545', 2], ['vest', 3], ['ak', 3]],
    buys: ['melee', 'gun', 'ammo', 'wear', 'val', 'med', 'food'],
    quests: ['q_post', 'q_kpp', 'q_guard', 'q_awake'] },
  nomad: { n: 'Кочевой торговец', ic: '🧳', d: 'Ходит по острову с огромным рюкзаком. Никто не знает, откуда он берёт товар.',
    stock: [['bag3', 0], ['detector', 0], ['vest', 0], ['gasmask', 0], ['medkit', 0], ['antirad', 0], ['antibio', 0], ['a545', 0], ['a9', 0], ['bp_ammo', 0], ['bp_traps', 0], ['serum', 0]],
    buys: ['food', 'drink', 'med', 'melee', 'gun', 'ammo', 'wear', 'art', 'tool', 'mat', 'val'], artBonus: 1.2, quests: [] },
  levin: { n: 'Доктор Левин', ic: '👨‍🔬', d: 'Учёный из НИИ. Знает про Аппарат больше, чем говорит.',
    stock: [['antirad', 0], ['bolts', 0], ['antibio', 0], ['gasmask', 1], ['medkit', 1], ['detector', 2], ['coldpill', 0], ['serum', 3]],
    buys: ['art', 'med', 'val', 'mat'], artBonus: 1.5,
    quests: ['q_art', 'q_anom', 'q_nii', 'q_shards'] },
};

// type: items (принести), kill (убить в локации), flag (событие), visit
const QUESTS = {
  // Главная линия
  m_camp:  { g: 'main', n: 'Обжиться', d: 'Разведи костёр (3 дров) и сделай спальное место получше на базе. Дрова — в лесу или из досок.', type: 'flag', flag: 'camp_ready', rew: { xp: { surv: 10 } }, next: 'm_radio' },
  m_radio: { g: 'main', n: 'Голос в эфире', d: 'Собери на базе радиостанцию: 3 радиодетали (Метеостанция, Маяк, Блокпост), 2 проволоки, 2 батарейки.', type: 'flag', flag: 'radio_built', rew: {}, next: 'm_nii' },
  m_nii:   { g: 'main', n: 'Остров-7', d: 'Радио поймало запись: остров на карантине из-за Аппарата в НИИ. Нужен пропуск — спроси Сержанта. Дойди до Зала Аппарата.', type: 'flag', flag: 'apparatus', rew: {} },
  // Глава 2 «Мастер»
  c2_shards: { g: 'main', n: 'Пробуждение', d: 'Без ядра остров «проснулся»: в аномалиях растут кристаллы, бродят кристаллиды. Собери 6 осколков кристалла.', type: 'items', need: { cshard: 6 }, rew: { xp: { surv: 15 } }, next: 'c2_boat' },
  c2_boat:   { g: 'main', n: 'Кристальный двигатель', d: 'Синий свет бьёт в небо с островка за проливом. Почини лодку на базе (Постройки → Лодка): корпус, а затем двигатель на ядре и осколках.', type: 'flag', flag: 'boat_ready', rew: { xp: { craft: 15 } }, next: 'c2_reef' },
  c2_reef:   { g: 'main', n: 'Остров-8', d: 'Доплыви до островка со шпилем (карта → Остров-8, от базы).', type: 'flag', flag: 'reef_seen', rew: {}, next: 'c2_keeper' },
  c2_keeper: { g: 'main', n: 'Хранитель', d: 'В Шпиле что-то охраняет второй Аппарат. Победи Хранителя Кристаллов и реши судьбу острова.', type: 'flag', flag: 'keeper_dead', rew: { money: 800 } },
  // Семёныч
  q_fish:  { g: 'semen', n: 'Улов', d: 'Принеси 3 сырые рыбы — у старика спина не та, чтобы рыбачить.', type: 'items', need: { fish: 3 }, rew: { money: 60, items: { rod: 1, smoked: 2 }, rep: 1 } },
  q_farm:  { g: 'semen', n: 'Зачистка фермы', d: 'На ферме бродят бывшие соседи. Упокой хотя бы 6 из них.', type: 'kill', loc: 'farm', count: 6, rew: { money: 120, items: { antibio: 1, bp_garden: 1 }, rep: 1 } },
  q_misha: { g: 'semen', n: 'Сын Семёныча', d: 'Сын Семёныча, Миша, ушёл на заправку и не вернулся. Найди хоть что-нибудь.', type: 'items', need: { dogtag: 1 }, rew: { money: 150, items: { bag2: 1 }, rep: 2 } },
  q_hull:  { g: 'semen', ch2: 1, n: 'Старая лодка', d: 'Хочешь в пролив? Принеси 6 досок и 2 верёвки — помогу залатать корпус, у меня и гвозди есть.', type: 'items', need: { planks: 6, rope: 2 }, rew: { items: { nails: 20, rope: 2, tools: 1 }, rep: 1 } },
  // Сержант
  q_post:  { g: 'serg', n: 'Бывшие сослуживцы', d: 'На блокпосту мои ребята… уже не мои. Упокой 5 солдат.', type: 'kill', loc: 'post', count: 5, rew: { money: 150, items: { k_armory: 1 }, rep: 1 } },
  q_kpp:   { g: 'serg', n: 'Журнал КПП', d: 'Принеси журнал с КПП. Хочу знать, кто приказал закрыть остров.', type: 'items', need: { kpplog: 1 }, rew: { money: 100, items: { pass: 1 }, rep: 1 } },
  q_guard: { g: 'serg', n: 'Сердце проблемы', d: 'Если доберёшься до Зала Аппарата — уничтожь то, что его охраняет.', type: 'flag', flag: 'guard_dead', rew: { money: 500, items: { ak: 1, a545: 60 }, rep: 2 } },
  q_awake: { g: 'serg', ch2: 1, n: 'Пробуждённые', d: 'Мертвецы на блокпосту стали злее. Упокой 8 из них, пока они не пошли к маяку.', type: 'kill', loc: 'post', count: 8, rew: { money: 300, items: { a545: 40, medkit: 1 }, rep: 2 } },
  // Левин
  q_art:   { g: 'levin', n: 'Образец', d: 'Принеси любой артефакт. Они рождаются в аномалиях после Выброса.', type: 'art', rew: { money: 200, items: { detector: 1 }, rep: 1 } },
  q_anom:  { g: 'levin', n: 'Замеры', d: 'Найди болтами 6 аномалий (на болоте, у метеостанции, в НИИ).', type: 'count', key: 'anomFound', count: 6, rew: { money: 150, items: { gasmask: 1, antirad: 2 }, rep: 1 } },
  q_nii:   { g: 'levin', n: 'Записи брата', d: 'Мой брат вёл записи в лабораториях НИИ. Принеси их.', type: 'items', need: { niidata: 1 }, rew: { money: 300, items: { serum: 1 }, rep: 2 } },
  q_shards:{ g: 'levin', ch2: 1, n: 'Кристаллография', d: 'Осколки — это не артефакты, это семена. Принеси 5, я должен понять, что из них вырастет.', type: 'items', need: { cshard: 5 }, rew: { money: 400, items: { serum: 1, antirad: 2 }, rep: 2 } },
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
  n_ch2:     { t: 'Ядро в рюкзаке', x: 'Ядро гудит всё громче. По ночам с юго-запада, из-за пролива, в небо бьёт синий луч. В аномалиях проросли кристаллы — холодные, как лёд. Остров проснулся. Ты — его новый Мастер. Или его следующая жертва.' },
  n_reef:    { t: 'Журнал лаборатории «Б»', x: '«Аппарат на Острове-7 был лишь антенной. Источник — здесь, под Шпилем. Кристаллы — его нервы. Хранитель не пускает никого. Если ядро вернётся к Сердцу — всё уснёт. Если Сердце заберут — у острова будет хозяин.»' },
  n_vk:      { t: 'Старая рация в сарае', x: '«…Mystery of the Island… Выживание… если вы это слышите — команды: Искать, Копать, Крафт… [шум]…» — Похоже, кто-то играл здесь в игру. Давно, ещё до всего этого.' },
};

const WEATHER = [
  { id: 'clear', n: 'Ясно', ic: '☀️', w: 4 },
  { id: 'cloud', n: 'Облачно', ic: '⛅', w: 3 },
  { id: 'rain', n: 'Дождь', ic: '🌧️', w: 2, wet: 1 },
  { id: 'fog', n: 'Туман', ic: '🌫️', w: 2, stealth: 0.12 },
  { id: 'storm', n: 'Гроза', ic: '⛈️', w: 1, wet: 2 },
];
