#!/usr/bin/env node
/**
 * Layer B32 — food & beverage, agri-processing, cold chain packaging.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.join(__dirname, "..", "registry", "seeds");

const q = (pathStr, unit, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "quantity", unit, titleEn, titleRu,
  encodings: opts.encodings || ["f32", "f64"],
  sensitivity: opts.sensitivity || "public", range: opts.range, status: "stable",
});
const id = (pathStr, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "identity", unit: "-", titleEn, titleRu,
  encodings: ["utf8"], sensitivity: opts.sensitivity || "internal",
});
const enu = (pathStr, values, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "enum", unit: "-", titleEn, titleRu,
  encodings: ["enum", "utf8"], enumValues: values, sensitivity: opts.sensitivity || "public",
});
const logical = (pathStr, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "logical", unit: "-", titleEn, titleRu,
  encodings: ["bool", "u8"], sensitivity: opts.sensitivity || "public",
});

function write(name, types) {
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B32", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-cane_mill.json", [
  id("cane_mill.id", "Sugarcane mill id", "ID сахарного завода (тростник)"),
  q("cane_mill.crush", "t/h", "Cane crush rate", "Размол тростника"),
  q("cane_mill.brix", "%", "Juice Brix", "Брикс сока", { range: { min: 0, max: 100 } }),
  q("cane_mill.pol", "%", "Polarization", "Поляризация", { range: { min: 0, max: 100 } }),
  q("cane_mill.steam", "t/h", "Process steam", "Технологический пар"),
  q("cane_mill.bagasse", "t/h", "Bagasse output", "Выход жома"),
  logical("cane_mill.jam", "Mill jam", "Затор мельницы"),
  enu("cane_mill.state", ["crush", "idle", "maintain", "fault"], "Mill state", "Состояние завода"),
]);

write("layer-b-sugar_refin.json", [
  id("sugar_refin.id", "Sugar refinery id", "ID сахарного рафинада"),
  q("sugar_refin.feed", "t/h", "Raw sugar feed", "Подача сырца"),
  q("sugar_refin.output", "t/h", "White sugar output", "Выпуск белого сахара"),
  q("sugar_refin.color", "IU", "ICUMSA color", "Цвет ICUMSA"),
  q("sugar_refin.ash", "%", "Ash content", "Зольность", { range: { min: 0, max: 100 } }),
  q("sugar_refin.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("sugar_refin.spec.ok", "Spec OK", "Спецификация OK"),
  enu("sugar_refin.state", ["refine", "dry", "pack", "fault"], "Refinery state", "Состояние рафинада"),
]);

write("layer-b-ethanol_pl.json", [
  id("ethanol_pl.id", "Fuel ethanol plant id", "ID завода топливного этанола"),
  q("ethanol_pl.feed", "t/h", "Grain / molasses feed", "Подача зерна/мелассы"),
  q("ethanol_pl.output", "L/h", "Ethanol production", "Выработка этанола"),
  q("ethanol_pl.yield", "L/t", "Yield", "Выход"),
  q("ethanol_pl.purity", "%", "Anhydrous purity", "Чистота безводного", { range: { min: 0, max: 100 } }),
  q("ethanol_pl.ferment", "Cel", "Fermenter temperature", "Температура ферментёра"),
  logical("ethanol_pl.contamination", "Contamination", "Контаминация"),
  enu("ethanol_pl.feed.type", ["corn", "wheat", "cane", "cellulosic", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-brew_ferment.json", [
  id("brew_ferment.id", "Brewery fermenter id", "ID пивного ферментёра"),
  id("brew_ferment.batch.id", "Batch id", "ID партии"),
  q("brew_ferment.temp", "Cel", "Fermentation temperature", "Температура брожения"),
  q("brew_ferment.pressure", "kPa", "Tank pressure", "Давление танка"),
  q("brew_ferment.plato", "P", "Original / present gravity", "Плотность Плато"),
  q("brew_ferment.abv", "%", "ABV", "Объёмная доля спирта", { range: { min: 0, max: 100 } }),
  logical("brew_ferment.ready", "Ready to transfer", "Готово к перекачке"),
  enu("brew_ferment.state", ["fill", "ferment", "condition", "fault"], "Tank state", "Состояние танка"),
]);

write("layer-b-distill_sp.json", [
  id("distill_sp.id", "Spirits still id", "ID перегонного куба"),
  id("distill_sp.batch.id", "Batch id", "ID партии"),
  q("distill_sp.temp", "Cel", "Vapor temperature", "Температура пара"),
  q("distill_sp.abv", "%", "Spirit ABV", "Крепость спирта", { range: { min: 0, max: 100 } }),
  q("distill_sp.flow", "L/h", "Spirit take-off", "Отбор спирта"),
  q("distill_sp.cut", "%", "Hearts cut progress", "Прогресс отбора сердца", { range: { min: 0, max: 100 } }),
  logical("distill_sp.fores", "Foreshots running", "Головы идут"),
  enu("distill_sp.type", ["pot", "column", "hybrid", "other"], "Type", "Тип"),
]);

write("layer-b-dairy_uht.json", [
  id("dairy_uht.id", "UHT dairy line id", "ID линии УВТ молока"),
  q("dairy_uht.temp", "Cel", "UHT temperature", "Температура УВТ"),
  q("dairy_uht.hold.s", "s", "Hold time", "Время выдержки"),
  q("dairy_uht.flow", "L/h", "Product flow", "Расход продукта"),
  q("dairy_uht.homogen", "kPa", "Homogenizer pressure", "Давление гомогенизатора"),
  q("dairy_uht.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("dairy_uht.sterile", "Aseptic OK", "Асептика OK"),
  enu("dairy_uht.state", ["sterilize", "fill", "cip", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-cheese_vat.json", [
  id("cheese_vat.id", "Cheese vat id", "ID сырной ванны"),
  id("cheese_vat.batch.id", "Batch id", "ID партии"),
  q("cheese_vat.temp", "Cel", "Vat temperature", "Температура ванны"),
  q("cheese_vat.ph", "-", "Curd pH", "pH сгустка"),
  q("cheese_vat.milk", "L", "Milk volume", "Объём молока"),
  q("cheese_vat.yield", "%", "Cheese yield", "Выход сыра", { range: { min: 0, max: 100 } }),
  logical("cheese_vat.cut", "Curd cut done", "Резка сгустка"),
  enu("cheese_vat.state", ["fill", "set", "cut", "cook", "fault"], "Vat state", "Состояние ванны"),
]);

write("layer-b-yogurt_ln.json", [
  id("yogurt_ln.id", "Yogurt line id", "ID линии йогурта"),
  q("yogurt_ln.temp", "Cel", "Incubation temperature", "Температура сквашивания"),
  q("yogurt_ln.ph", "-", "Culture pH", "pH культуры"),
  q("yogurt_ln.output", "L/h", "Yogurt output", "Выпуск йогурта"),
  q("yogurt_ln.viscosity", "mPa.s", "Product viscosity", "Вязкость продукта"),
  q("yogurt_ln.fill", "/h", "Cups filled per hour", "Стаканчиков в час"),
  logical("yogurt_ln.culture", "Culture active", "Культура активна"),
  enu("yogurt_ln.type", ["set", "stirred", "drink", "other"], "Type", "Тип"),
]);

write("layer-b-ice_cream_ln.json", [
  id("ice_cream_ln.id", "Ice cream freezer line id", "ID линии мороженого"),
  q("ice_cream_ln.draw", "Cel", "Draw temperature", "Температура выгрузки"),
  q("ice_cream_ln.overrun", "%", "Overrun", "Взбитость", { range: { min: 0, max: 200 } }),
  q("ice_cream_ln.output", "L/h", "Mix throughput", "Пропуск смеси"),
  q("ice_cream_ln.viscosity", "mPa.s", "Mix viscosity", "Вязкость смеси"),
  q("ice_cream_ln.pack", "/h", "Units packed per hour", "Упаковок в час"),
  logical("ice_cream_ln.dasher", "Dasher OK", "Мешалка OK"),
  enu("ice_cream_ln.state", ["freeze", "fill", "harden", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-bakery_ov.json", [
  id("bakery_ov.id", "Bakery oven id", "ID пекарной печи"),
  q("bakery_ov.temp", "Cel", "Zone temperature", "Температура зоны"),
  q("bakery_ov.steam", "%", "Steam injection", "Подача пара", { range: { min: 0, max: 100 } }),
  q("bakery_ov.speed", "m/min", "Band speed", "Скорость ленты"),
  q("bakery_ov.output", "/h", "Loaves per hour", "Буханок в час"),
  q("bakery_ov.color", "-", "Crust color index", "Индекс цвета корки"),
  logical("bakery_ov.bake.ok", "Bake profile OK", "Профиль выпечки OK"),
  enu("bakery_ov.type", ["tunnel", "rack", "deck", "other"], "Type", "Тип"),
]);

write("layer-b-snack_fry.json", [
  id("snack_fry.id", "Snack fryer id", "ID фритюрницы снэков"),
  q("snack_fry.oil.t", "Cel", "Oil temperature", "Температура масла"),
  q("snack_fry.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("snack_fry.oil.use", "kg/t", "Oil uptake", "Поглощение масла"),
  q("snack_fry.output", "kg/h", "Product output", "Выпуск продукта"),
  q("snack_fry.ffa", "%", "Free fatty acids", "Свободные жирные кислоты", { range: { min: 0, max: 100 } }),
  logical("snack_fry.filter", "Oil filter due", "Фильтрация масла"),
  enu("snack_fry.state", ["fry", "idle", "clean", "fault"], "Fryer state", "Состояние фритюрницы"),
]);

write("layer-b-choco_temp.json", [
  id("choco_temp.id", "Chocolate tempering unit id", "ID темперирования шоколада"),
  q("choco_temp.temp", "Cel", "Chocolate temperature", "Температура шоколада"),
  q("choco_temp.viscosity", "mPa.s", "Viscosity", "Вязкость"),
  q("choco_temp.crystal", "%", "Stable crystal fraction", "Доля стабильных кристаллов", { range: { min: 0, max: 100 } }),
  q("choco_temp.flow", "kg/h", "Throughput", "Производительность"),
  q("choco_temp.cool", "Cel", "Cooling stage temperature", "Температура охлаждения"),
  logical("choco_temp.bloom", "Bloom risk", "Риск поседения"),
  enu("choco_temp.state", ["melt", "temper", "hold", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-coffee_roaster.json", [
  id("coffee_roaster.id", "Coffee roaster id", "ID кофейного ростера"),
  id("coffee_roaster.batch.id", "Batch id", "ID партии"),
  q("coffee_roaster.bean.t", "Cel", "Bean temperature", "Температура зерна"),
  q("coffee_roaster.air.t", "Cel", "Air temperature", "Температура воздуха"),
  q("coffee_roaster.time.s", "s", "Roast time", "Время обжарки"),
  q("coffee_roaster.charge", "kg", "Charge weight", "Масса загрузки"),
  logical("coffee_roaster.crack", "First crack detected", "Первый треск"),
  enu("coffee_roaster.profile", ["light", "medium", "dark", "other"], "Profile", "Профиль"),
]);

write("layer-b-tea_proc.json", [
  id("tea_proc.id", "Tea processing line id", "ID линии переработки чая"),
  q("tea_proc.wither", "%", "Wither moisture loss", "Потеря влаги при завяливании", { range: { min: 0, max: 100 } }),
  q("tea_proc.ferment", "Cel", "Oxidation temperature", "Температура окисления"),
  q("tea_proc.dry", "Cel", "Dryer temperature", "Температура сушки"),
  q("tea_proc.moisture", "%", "Made tea moisture", "Влажность готового чая", { range: { min: 0, max: 100 } }),
  q("tea_proc.output", "kg/h", "Made tea output", "Выпуск готового чая"),
  logical("tea_proc.spec.ok", "Grade OK", "Сорт OK"),
  enu("tea_proc.type", ["black", "green", "oolong", "other"], "Type", "Тип"),
]);

write("layer-b-juice_ext.json", [
  id("juice_ext.id", "Juice extractor id", "ID соковыжималки"),
  q("juice_ext.feed", "t/h", "Fruit feed", "Подача фруктов"),
  q("juice_ext.yield", "%", "Juice yield", "Выход сока", { range: { min: 0, max: 100 } }),
  q("juice_ext.brix", "%", "Brix", "Брикс", { range: { min: 0, max: 100 } }),
  q("juice_ext.pulp", "%", "Pulp content", "Содержание мякоти", { range: { min: 0, max: 100 } }),
  q("juice_ext.output", "L/h", "Juice output", "Выпуск сока"),
  logical("juice_ext.seed", "Seed carryover", "Унос семян"),
  enu("juice_ext.fruit", ["orange", "apple", "berry", "other"], "Fruit", "Фрукт"),
]);

write("layer-b-can_line_fd.json", [
  id("can_line_fd.id", "Food canning line id", "ID линии консервирования"),
  q("can_line_fd.speed", "/min", "Cans per minute", "Банок в минуту"),
  q("can_line_fd.fill", "g", "Fill weight", "Масса наполнения"),
  q("can_line_fd.vacuum", "kPa", "Can vacuum", "Вакуум банки"),
  q("can_line_fd.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("can_line_fd.seam", "%", "Seam check pass", "Шов OK", { range: { min: 0, max: 100 } }),
  logical("can_line_fd.metal", "Metal detector trip", "Срабатывание металлодетектора"),
  enu("can_line_fd.state", ["fill", "seam", "retort", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-retort_fd.json", [
  id("retort_fd.id", "Food retort id", "ID автоклава пищевого"),
  id("retort_fd.load.id", "Load id", "ID загрузки"),
  q("retort_fd.temp", "Cel", "Retort temperature", "Температура автоклава"),
  q("retort_fd.pressure", "kPa", "Retort pressure", "Давление автоклава"),
  q("retort_fd.f0", "min", "F0 value", "Значение F0"),
  q("retort_fd.hold.min", "min", "Hold time", "Время выдержки"),
  logical("retort_fd.pass", "Process pass", "Процесс пройден"),
  enu("retort_fd.type", ["steam", "water", "spray", "other"], "Type", "Тип"),
]);

write("layer-b-freeze_dry.json", [
  id("freeze_dry.id", "Food freeze dryer id", "ID пищевой сублимационной сушилки"),
  id("freeze_dry.batch.id", "Batch id", "ID партии"),
  q("freeze_dry.shelf", "Cel", "Shelf temperature", "Температура полок"),
  q("freeze_dry.product", "Cel", "Product temperature", "Температура продукта"),
  q("freeze_dry.vacuum", "Pa", "Chamber vacuum", "Вакуум камеры"),
  q("freeze_dry.moisture", "%", "Residual moisture", "Остаточная влажность", { range: { min: 0, max: 100 } }),
  logical("freeze_dry.primary", "Primary drying done", "Первичная сушка завершена"),
  enu("freeze_dry.phase", ["freeze", "primary", "secondary", "fault"], "Phase", "Фаза"),
]);

write("layer-b-iqf_tunnel.json", [
  id("iqf_tunnel.id", "IQF freezer tunnel id", "ID туннеля шоковой заморозки"),
  q("iqf_tunnel.temp", "Cel", "Air temperature", "Температура воздуха"),
  q("iqf_tunnel.speed", "m/min", "Belt speed", "Скорость ленты"),
  q("iqf_tunnel.output", "kg/h", "Frozen output", "Выпуск замороженного"),
  q("iqf_tunnel.core", "Cel", "Product core temperature", "Температура в сердцевине"),
  q("iqf_tunnel.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("iqf_tunnel.frost", "Frost buildup", "Намерзание"),
  enu("iqf_tunnel.state", ["freeze", "defrost", "idle", "fault"], "Tunnel state", "Состояние туннеля"),
]);

write("layer-b-meat_slaught.json", [
  id("meat_slaught.id", "Slaughter line id", "ID линии убоя"),
  q("meat_slaught.rate", "/h", "Animals per hour", "Голов в час"),
  q("meat_slaught.temp", "Cel", "Chill temperature", "Температура охлаждения"),
  q("meat_slaught.yield", "%", "Carcass yield", "Выход туши", { range: { min: 0, max: 100 } }),
  q("meat_slaught.condemn", "%", "Condemn rate", "Брак ветнадзора", { range: { min: 0, max: 100 } }),
  q("meat_slaught.stun", "%", "Stun efficacy", "Эффективность оглушения", { range: { min: 0, max: 100 } }),
  logical("meat_slaught.welfare", "Welfare OK", "Благополучие OK"),
  enu("meat_slaught.species", ["beef", "pork", "poultry", "other"], "Species", "Вид"),
]);

write("layer-b-deboning_ln.json", [
  id("deboning_ln.id", "Deboning line id", "ID линии обвалки"),
  q("deboning_ln.output", "kg/h", "Meat output", "Выпуск мяса"),
  q("deboning_ln.yield", "%", "Debone yield", "Выход обвалки", { range: { min: 0, max: 100 } }),
  q("deboning_ln.temp", "Cel", "Room temperature", "Температура цеха"),
  q("deboning_ln.bone", "%", "Bone residual", "Остаток кости", { range: { min: 0, max: 100 } }),
  q("deboning_ln.operators", "-", "Operators present", "Операторов", { encodings: ["i32"] }),
  logical("deboning_ln.metal", "Metal detector trip", "Срабатывание металлодетектора"),
  enu("deboning_ln.state", ["cut", "trim", "pack", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-smokehouse.json", [
  id("smokehouse.id", "Smokehouse id", "ID коптильной камеры"),
  id("smokehouse.batch.id", "Batch id", "ID партии"),
  q("smokehouse.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("smokehouse.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("smokehouse.core", "Cel", "Product core temperature", "Температура в сердцевине"),
  q("smokehouse.time.h", "h", "Process time", "Время процесса"),
  logical("smokehouse.smoke", "Smoke generator on", "Генератор дыма включён"),
  enu("smokehouse.process", ["cook", "smoke", "dry", "cool", "other"], "Process", "Процесс"),
]);

write("layer-b-fish_proc.json", [
  id("fish_proc.id", "Fish processing line id", "ID линии переработки рыбы"),
  q("fish_proc.feed", "t/h", "Fish feed rate", "Подача рыбы"),
  q("fish_proc.yield", "%", "Fillet yield", "Выход филе", { range: { min: 0, max: 100 } }),
  q("fish_proc.temp", "Cel", "Process temperature", "Температура процесса"),
  q("fish_proc.glaze", "%", "Glaze uptake", "Нанос глазури", { range: { min: 0, max: 100 } }),
  q("fish_proc.output", "kg/h", "Product output", "Выпуск продукта"),
  logical("fish_proc.histamine", "Histamine risk", "Риск гистамина"),
  enu("fish_proc.state", ["gut", "fillet", "freeze", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-feed_pellet.json", [
  id("feed_pellet.id", "Animal feed pellet mill id", "ID комбикормового гранулятора"),
  q("feed_pellet.feed", "t/h", "Meal feed", "Подача муки"),
  q("feed_pellet.output", "t/h", "Pellet output", "Выпуск гранул"),
  q("feed_pellet.moisture", "%", "Pellet moisture", "Влажность гранул", { range: { min: 0, max: 100 } }),
  q("feed_pellet.durability", "%", "PDI durability", "Прочность PDI", { range: { min: 0, max: 100 } }),
  q("feed_pellet.temp", "Cel", "Die temperature", "Температура матрицы"),
  logical("feed_pellet.die", "Die change due", "Замена матрицы"),
  enu("feed_pellet.species", ["poultry", "swine", "ruminant", "aqua", "other"], "Species", "Вид"),
]);

write("layer-b-chick_hatch.json", [
  id("chick_hatch.id", "Hatchery incubator id", "ID инкубатора птицефабрики"),
  q("chick_hatch.temp", "Cel", "Incubator temperature", "Температура инкубатора"),
  q("chick_hatch.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("chick_hatch.fertility", "%", "Fertility", "Оплодотворённость", { range: { min: 0, max: 100 } }),
  q("chick_hatch.hatch", "%", "Hatchability", "Выводимость", { range: { min: 0, max: 100 } }),
  q("chick_hatch.eggs", "-", "Eggs set", "Яиц заложено", { encodings: ["i32"] }),
  logical("chick_hatch.turn", "Turning active", "Поворот активен"),
  enu("chick_hatch.stage", ["set", "transfer", "hatch", "other"], "Stage", "Стадия"),
]);

write("layer-b-greenh_ctrl.json", [
  id("greenh_ctrl.id", "Greenhouse climate zone id", "ID климатической зоны теплицы"),
  q("greenh_ctrl.temp", "Cel", "Air temperature", "Температура воздуха"),
  q("greenh_ctrl.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("greenh_ctrl.co2", "ppm", "CO2 concentration", "Концентрация CO2"),
  q("greenh_ctrl.par", "umol/m2/s", "PAR light", "ФАР"),
  q("greenh_ctrl.vent", "%", "Vent opening", "Открытие форточек", { range: { min: 0, max: 100 } }),
  logical("greenh_ctrl.alarm", "Climate alarm", "Тревога климата"),
  enu("greenh_ctrl.state", ["day", "night", "flush", "fault"], "Zone state", "Состояние зоны"),
]);

write("layer-b-vert_farm.json", [
  id("vert_farm.id", "Vertical farm rack id", "ID стеллажа вертикальной фермы"),
  q("vert_farm.temp", "Cel", "Grow temperature", "Температура выращивания"),
  q("vert_farm.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("vert_farm.ppfd", "umol/m2/s", "PPFD", "ППФП"),
  q("vert_farm.ec", "mS/cm", "Nutrient EC", "Электропроводность раствора"),
  q("vert_farm.ph", "-", "Nutrient pH", "pH раствора"),
  logical("vert_farm.leak", "Irrigation leak", "Утечка полива"),
  enu("vert_farm.crop", ["leafy", "herb", "berry", "other"], "Crop", "Культура"),
]);

write("layer-b-irrig_pivot.json", [
  id("irrig_pivot.id", "Center pivot irrigation id", "ID круговой дождевальной машины"),
  q("irrig_pivot.flow", "L/s", "Water flow", "Расход воды"),
  q("irrig_pivot.pressure", "kPa", "System pressure", "Давление системы"),
  q("irrig_pivot.depth", "mm", "Application depth", "Норма полива"),
  q("irrig_pivot.speed", "%", "Percent timer", "Процент таймера", { range: { min: 0, max: 100 } }),
  q("irrig_pivot.area", "ha", "Area covered today", "Площадь за сутки"),
  logical("irrig_pivot.align", "Alignment fault", "Нарушение выравнивания"),
  enu("irrig_pivot.state", ["irrigate", "idle", "chems", "fault"], "Pivot state", "Состояние машины"),
]);

write("layer-b-grain_elev.json", [
  id("grain_elev.id", "Grain elevator id", "ID зернового элеватора"),
  q("grain_elev.inventory", "t", "Grain inventory", "Запас зерна"),
  q("grain_elev.moisture", "%", "Average moisture", "Средняя влажность", { range: { min: 0, max: 100 } }),
  q("grain_elev.temp", "Cel", "Bin temperature max", "Макс. температура силоса"),
  q("grain_elev.receive", "t/h", "Receiving rate", "Скорость приёмки"),
  q("grain_elev.ship", "t/h", "Shipping rate", "Скорость отгрузки"),
  logical("grain_elev.hotspot", "Hotspot detected", "Обнаружен очаг нагрева"),
  enu("grain_elev.grain", ["wheat", "corn", "barley", "soy", "other"], "Grain", "Культура"),
]);

write("layer-b-gin_cotton.json", [
  id("gin_cotton.id", "Cotton gin id", "ID хлопкоочистительного завода"),
  q("gin_cotton.feed", "t/h", "Seed cotton feed", "Подача хлопка-сырца"),
  q("gin_cotton.lint", "t/h", "Lint output", "Выход волокна"),
  q("gin_cotton.turnout", "%", "Lint turnout", "Выход волокна %", { range: { min: 0, max: 100 } }),
  q("gin_cotton.moisture", "%", "Lint moisture", "Влажность волокна", { range: { min: 0, max: 100 } }),
  q("gin_cotton.trash", "%", "Trash content", "Сорность", { range: { min: 0, max: 100 } }),
  logical("gin_cotton.fire", "Fire risk", "Риск возгорания"),
  enu("gin_cotton.state", ["gin", "bale", "idle", "fault"], "Gin state", "Состояние завода"),
]);

write("layer-b-oilseed_cr.json", [
  id("oilseed_cr.id", "Oilseed crush plant id", "ID маслоэкстракционного завода"),
  q("oilseed_cr.feed", "t/h", "Seed feed", "Подача семян"),
  q("oilseed_cr.oil", "t/h", "Crude oil output", "Выпуск сырого масла"),
  q("oilseed_cr.meal", "t/h", "Meal output", "Выпуск шрота"),
  q("oilseed_cr.residual", "%", "Residual oil in meal", "Остаток масла в шроте", { range: { min: 0, max: 100 } }),
  q("oilseed_cr.solvent", "ppm", "Solvent residual", "Остаток растворителя"),
  logical("oilseed_cr.spec.ok", "Spec OK", "Спецификация OK"),
  enu("oilseed_cr.seed", ["soy", "rapeseed", "sunflower", "other"], "Seed", "Семена"),
]);

write("layer-b-palm_mill.json", [
  id("palm_mill.id", "Palm oil mill id", "ID пальмового завода"),
  q("palm_mill.ffb", "t/h", "FFB feed", "Подача СПП"),
  q("palm_mill.cpo", "t/h", "CPO output", "Выпуск СПО"),
  q("palm_mill.oer", "%", "Oil extraction rate", "Коэффициент извлечения", { range: { min: 0, max: 100 } }),
  q("palm_mill.ffa", "%", "FFA in CPO", "СЖК в СПО", { range: { min: 0, max: 100 } }),
  q("palm_mill.steam", "t/h", "Process steam", "Технологический пар"),
  logical("palm_mill.sterilizer", "Sterilizer OK", "Стерилизатор OK"),
  enu("palm_mill.state", ["sterilize", "press", "clarify", "fault"], "Mill state", "Состояние завода"),
]);

write("layer-b-cocoa_proc.json", [
  id("cocoa_proc.id", "Cocoa processing line id", "ID линии переработки какао"),
  q("cocoa_proc.roast", "Cel", "Roast temperature", "Температура обжарки"),
  q("cocoa_proc.nib", "t/h", "Nib throughput", "Пропуск крупки"),
  q("cocoa_proc.butter", "%", "Butter yield", "Выход масла", { range: { min: 0, max: 100 } }),
  q("cocoa_proc.fineness", "um", "Liquor fineness", "Тонкость тёртого"),
  q("cocoa_proc.output", "t/h", "Liquor / powder output", "Выпуск тёртого/порошка"),
  logical("cocoa_proc.spec.ok", "Spec OK", "Спецификация OK"),
  enu("cocoa_proc.state", ["roast", "winnow", "grind", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-spice_grind.json", [
  id("spice_grind.id", "Spice grinder id", "ID мельницы специй"),
  id("spice_grind.batch.id", "Batch id", "ID партии"),
  q("spice_grind.size", "um", "Particle size D90", "Размер частиц D90"),
  q("spice_grind.temp", "Cel", "Product temperature", "Температура продукта"),
  q("spice_grind.output", "kg/h", "Output", "Производительность"),
  q("spice_grind.volatile", "%", "Volatile oil retained", "Сохранённые эфирные масла", { range: { min: 0, max: 100 } }),
  logical("spice_grind.metal", "Metal detector trip", "Срабатывание металлодетектора"),
  enu("spice_grind.state", ["grind", "blend", "pack", "fault"], "Mill state", "Состояние мельницы"),
]);

write("layer-b-flavor_mix.json", [
  id("flavor_mix.id", "Flavor compounding mixer id", "ID смесителя ароматизаторов"),
  id("flavor_mix.batch.id", "Batch id", "ID партии"),
  q("flavor_mix.temp", "Cel", "Mix temperature", "Температура смешения"),
  q("flavor_mix.time.min", "min", "Mix time", "Время смешения"),
  q("flavor_mix.viscosity", "mPa.s", "Product viscosity", "Вязкость продукта"),
  q("flavor_mix.weight", "kg", "Batch weight", "Масса партии"),
  logical("flavor_mix.spec.ok", "Sensory / GC OK", "Сенсорика / ГХ OK"),
  enu("flavor_mix.type", ["liquid", "powder", "emulsion", "other"], "Type", "Тип"),
]);

write("layer-b-enzyme_pl.json", [
  id("enzyme_pl.id", "Enzyme fermentation plant id", "ID завода ферментов"),
  id("enzyme_pl.batch.id", "Batch id", "ID партии"),
  q("enzyme_pl.temp", "Cel", "Fermenter temperature", "Температура ферментёра"),
  q("enzyme_pl.do", "%", "Dissolved oxygen", "Растворённый кислород", { range: { min: 0, max: 100 } }),
  q("enzyme_pl.activity", "U/mL", "Enzyme activity", "Активность фермента"),
  q("enzyme_pl.titer", "g/L", "Product titer", "Титр продукта"),
  logical("enzyme_pl.contamination", "Contamination", "Контаминация"),
  enu("enzyme_pl.state", ["ferment", "harvest", "purify", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-vit_premix.json", [
  id("vit_premix.id", "Vitamin premix blender id", "ID смесителя витаминных премиксов"),
  id("vit_premix.batch.id", "Batch id", "ID партии"),
  q("vit_premix.weight", "kg", "Batch weight", "Масса партии"),
  q("vit_premix.cv", "%", "Mix uniformity CV", "CV однородности", { range: { min: 0, max: 100 } }),
  q("vit_premix.time.min", "min", "Blend time", "Время смешения"),
  q("vit_premix.assay", "%", "Marker assay", "Анализ маркера", { range: { min: 0, max: 100 } }),
  logical("vit_premix.spec.ok", "Assay OK", "Анализ OK"),
  enu("vit_premix.state", ["weigh", "blend", "pack", "fault"], "Blender state", "Состояние смесителя"),
]);

write("layer-b-pet_food_ln.json", [
  id("pet_food_ln.id", "Pet food extrusion line id", "ID линии экструзии кормов"),
  q("pet_food_ln.feed", "t/h", "Meal feed", "Подача муки"),
  q("pet_food_ln.output", "t/h", "Kibble output", "Выпуск гранул"),
  q("pet_food_ln.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("pet_food_ln.bulk", "kg/m3", "Bulk density", "Насыпная плотность"),
  q("pet_food_ln.temp", "Cel", "Extruder die temperature", "Температура матрицы"),
  logical("pet_food_ln.spec.ok", "Kibble spec OK", "Спецификация гранул OK"),
  enu("pet_food_ln.type", ["dry", "wet", "treat", "other"], "Type", "Тип"),
]);

write("layer-b-aqua_farm.json", [
  id("aqua_farm.tank.id", "Aquaculture tank id", "ID бассейна аквакультуры"),
  q("aqua_farm.do", "mg/L", "Dissolved oxygen", "Растворённый кислород"),
  q("aqua_farm.temp", "Cel", "Water temperature", "Температура воды"),
  q("aqua_farm.nh3", "mg/L", "Ammonia", "Аммиак"),
  q("aqua_farm.biomass", "kg", "Estimated biomass", "Оценка биомассы"),
  q("aqua_farm.feed", "kg/d", "Daily feed", "Суточный корм"),
  logical("aqua_farm.alarm", "Water quality alarm", "Тревога качества воды"),
  enu("aqua_farm.species", ["salmon", "shrimp", "tilapia", "other"], "Species", "Вид"),
]);

write("layer-b-mushroom_fr.json", [
  id("mushroom_fr.id", "Mushroom growing room id", "ID грибной камеры"),
  q("mushroom_fr.temp", "Cel", "Room temperature", "Температура камеры"),
  q("mushroom_fr.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("mushroom_fr.co2", "ppm", "CO2", "CO2"),
  q("mushroom_fr.yield", "kg/m2", "Yield per flush", "Урожай за волну"),
  q("mushroom_fr.air", "m3/h", "Fresh air", "Свежий воздух"),
  logical("mushroom_fr.contam", "Contamination", "Контаминация"),
  enu("mushroom_fr.stage", ["spawn", "case", "pin", "harvest", "other"], "Stage", "Стадия"),
]);

write("layer-b-pasteur_ht.json", [
  id("pasteur_ht.id", "HTST pasteurizer id", "ID пастеризатора HTST"),
  q("pasteur_ht.temp", "Cel", "Pasteurization temperature", "Температура пастеризации"),
  q("pasteur_ht.hold.s", "s", "Hold time", "Время выдержки"),
  q("pasteur_ht.flow", "L/h", "Product flow", "Расход продукта"),
  q("pasteur_ht.regen", "%", "Regeneration efficiency", "КПД регенерации", { range: { min: 0, max: 100 } }),
  q("pasteur_ht.pressure", "kPa", "Differential pressure", "Перепад давления"),
  logical("pasteur_ht.fdv", "Flow diversion valve trip", "Срабатывание клапана отвода"),
  enu("pasteur_ht.state", ["pasteurize", "divert", "cip", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-homogenizer.json", [
  id("homogenizer.id", "Dairy homogenizer id", "ID гомогенизатора"),
  q("homogenizer.pressure", "kPa", "Homogenizing pressure", "Давление гомогенизации"),
  q("homogenizer.flow", "L/h", "Product flow", "Расход продукта"),
  q("homogenizer.temp", "Cel", "Product temperature", "Температура продукта"),
  q("homogenizer.stages", "-", "Stages active", "Активных ступеней", { encodings: ["i32"] }),
  q("homogenizer.power", "kW", "Drive power", "Мощность привода"),
  logical("homogenizer.valve", "Valve wear high", "Износ клапана"),
  enu("homogenizer.state", ["run", "idle", "maintain", "fault"], "Homogenizer state", "Состояние гомогенизатора"),
]);

write("layer-b-evapor_fd.json", [
  id("evapor_fd.id", "Food evaporator id", "ID пищевого выпарного аппарата"),
  q("evapor_fd.feed", "L/h", "Feed rate", "Подача"),
  q("evapor_fd.brix", "%", "Concentrate Brix", "Брикс концентрата", { range: { min: 0, max: 100 } }),
  q("evapor_fd.steam", "t/h", "Steam consumption", "Расход пара"),
  q("evapor_fd.vacuum", "kPa", "Vacuum", "Вакуум"),
  q("evapor_fd.temp", "Cel", "Product temperature", "Температура продукта"),
  logical("evapor_fd.fouling", "Fouling high", "Высокое загрязнение"),
  enu("evapor_fd.type", ["falling_film", "forced", "mvr", "other"], "Type", "Тип"),
]);

write("layer-b-spray_dry_fd.json", [
  id("spray_dry_fd.id", "Food spray dryer id", "ID пищевой распылительной сушилки"),
  q("spray_dry_fd.inlet", "Cel", "Inlet air temperature", "Температура воздуха на входе"),
  q("spray_dry_fd.outlet", "Cel", "Outlet air temperature", "Температура воздуха на выходе"),
  q("spray_dry_fd.feed", "L/h", "Feed rate", "Подача"),
  q("spray_dry_fd.moisture", "%", "Powder moisture", "Влажность порошка", { range: { min: 0, max: 100 } }),
  q("spray_dry_fd.output", "kg/h", "Powder output", "Выпуск порошка"),
  logical("spray_dry_fd.stick", "Chamber sticking", "Налипание в камере"),
  enu("spray_dry_fd.state", ["dry", "cip", "idle", "fault"], "Dryer state", "Состояние сушилки"),
]);

write("layer-b-extrude_fd.json", [
  id("extrude_fd.id", "Food extruder id", "ID пищевого экструдера"),
  q("extrude_fd.temp", "Cel", "Die temperature", "Температура матрицы"),
  q("extrude_fd.screw", "rpm", "Screw speed", "Обороты шнека"),
  q("extrude_fd.moisture", "%", "In-barrel moisture", "Влажность в цилиндре", { range: { min: 0, max: 100 } }),
  q("extrude_fd.output", "kg/h", "Product output", "Выпуск продукта"),
  q("extrude_fd.sme", "kWh/t", "Specific mechanical energy", "Удельная мех. энергия"),
  logical("extrude_fd.die", "Die pressure high", "Высокое давление матрицы"),
  enu("extrude_fd.product", ["cereal", "snack", "protein", "other"], "Product", "Продукт"),
]);

write("layer-b-soft_drink.json", [
  id("soft_drink.id", "Soft drink blender id", "ID купажёра безалкогольных напитков"),
  q("soft_drink.brix", "%", "Brix", "Брикс", { range: { min: 0, max: 100 } }),
  q("soft_drink.co2", "g/L", "CO2 content", "Содержание CO2"),
  q("soft_drink.flow", "L/h", "Product flow", "Расход продукта"),
  q("soft_drink.ratio", "-", "Syrup / water ratio", "Соотношение сироп/вода"),
  q("soft_drink.temp", "Cel", "Blend temperature", "Температура купажа"),
  logical("soft_drink.spec.ok", "Brix / CO2 OK", "Брикс / CO2 OK"),
  enu("soft_drink.state", ["blend", "carbonate", "idle", "fault"], "Blender state", "Состояние купажёра"),
]);

write("layer-b-bottle_fill_fd.json", [
  id("bottle_fill_fd.line.id", "Beverage bottle filler id", "ID линии розлива напитков"),
  q("bottle_fill_fd.speed", "/h", "Bottles per hour", "Бутылок в час"),
  q("bottle_fill_fd.volume", "mL", "Fill volume", "Объём наполнения"),
  q("bottle_fill_fd.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("bottle_fill_fd.co2", "g/L", "CO2 in bottle", "CO2 в бутылке"),
  q("bottle_fill_fd.foam", "%", "Foam rejects", "Брак по пене", { range: { min: 0, max: 100 } }),
  logical("bottle_fill_fd.cap", "Capper OK", "Укупорка OK"),
  enu("bottle_fill_fd.state", ["rinse", "fill", "cap", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-blast_freez.json", [
  id("blast_freez.id", "Blast freezer id", "ID камеры шоковой заморозки"),
  q("blast_freez.temp", "Cel", "Air temperature", "Температура воздуха"),
  q("blast_freez.core", "Cel", "Product core temperature", "Температура в сердцевине"),
  q("blast_freez.time.h", "h", "Freeze time", "Время заморозки"),
  q("blast_freez.load", "kg", "Product load", "Загрузка продукта"),
  q("blast_freez.energy", "kWh", "Energy this cycle", "Энергия цикла"),
  logical("blast_freez.done", "Freeze complete", "Заморозка завершена"),
  enu("blast_freez.state", ["freeze", "defrost", "idle", "fault"], "Freezer state", "Состояние камеры"),
]);

write("layer-b-cold_store_fd.json", [
  id("cold_store_fd.id", "Food cold store id", "ID холодильного склада пищевого"),
  q("cold_store_fd.temp", "Cel", "Room temperature", "Температура камеры"),
  q("cold_store_fd.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("cold_store_fd.occupancy", "%", "Space occupancy", "Заполненность", { range: { min: 0, max: 100 } }),
  q("cold_store_fd.door", "-", "Door openings today", "Открытий дверей", { encodings: ["i32"] }),
  q("cold_store_fd.energy", "kWh/d", "Daily energy", "Суточная энергия"),
  logical("cold_store_fd.excursion", "Temperature excursion", "Отклонение температуры"),
  enu("cold_store_fd.zone", ["chill", "frozen", "deep", "other"], "Zone", "Зона"),
]);

write("layer-b-ready_meal.json", [
  id("ready_meal.line.id", "Ready-meal line id", "ID линии готовых блюд"),
  q("ready_meal.output", "/h", "Meals per hour", "Блюд в час"),
  q("ready_meal.fill", "g", "Fill weight", "Масса наполнения"),
  q("ready_meal.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("ready_meal.seal", "%", "Seal pass rate", "Прохождение запайки", { range: { min: 0, max: 100 } }),
  q("ready_meal.temp", "Cel", "Hot-fill / chill temperature", "Температура горячего наполнения/охлаждения"),
  logical("ready_meal.metal", "Metal detector trip", "Срабатывание металлодетектора"),
  enu("ready_meal.state", ["cook", "fill", "seal", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-sauce_cook.json", [
  id("sauce_cook.id", "Sauce cooker id", "ID варочного котла соусов"),
  id("sauce_cook.batch.id", "Batch id", "ID партии"),
  q("sauce_cook.temp", "Cel", "Batch temperature", "Температура партии"),
  q("sauce_cook.brix", "%", "Brix / solids", "Брикс / сухие", { range: { min: 0, max: 100 } }),
  q("sauce_cook.viscosity", "mPa.s", "Viscosity", "Вязкость"),
  q("sauce_cook.agitation", "rpm", "Agitation", "Перемешивание"),
  logical("sauce_cook.burn", "Burn-on risk", "Риск пригара"),
  enu("sauce_cook.state", ["heat", "cook", "cool", "fault"], "Cooker state", "Состояние котла"),
]);

write("layer-b-margarine_ln.json", [
  id("margarine_ln.id", "Margarine / spreads line id", "ID линии маргарина/спредов"),
  q("margarine_ln.temp", "Cel", "Scraped-surface temperature", "Температура вытеснительного охладителя"),
  q("margarine_ln.output", "kg/h", "Product output", "Выпуск продукта"),
  q("margarine_ln.solid", "%", "Solid fat content", "Содержание твёрдого жира", { range: { min: 0, max: 100 } }),
  q("margarine_ln.water", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  q("margarine_ln.pack", "/h", "Packs per hour", "Упаковок в час"),
  logical("margarine_ln.spec.ok", "Texture OK", "Текстура OK"),
  enu("margarine_ln.state", ["emulsify", "cool", "pack", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-winery_crush.json", [
  id("winery_crush.id", "Winery crush line id", "ID линии дробления винодельни"),
  q("winery_crush.feed", "t/h", "Grape feed", "Подача винограда"),
  q("winery_crush.brix", "%", "Must Brix", "Брикс сусла", { range: { min: 0, max: 100 } }),
  q("winery_crush.yield", "L/t", "Juice yield", "Выход сока"),
  q("winery_crush.temp", "Cel", "Must temperature", "Температура сусла"),
  q("winery_crush.so2", "mg/L", "SO2 addition", "Добавка SO2"),
  logical("winery_crush.rot", "Rot / MOG high", "Гниль / сор высокий"),
  enu("winery_crush.state", ["crush", "press", "settle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-olive_press.json", [
  id("olive_press.id", "Olive oil mill id", "ID оливкового завода"),
  q("olive_press.feed", "t/h", "Olive feed", "Подача оливок"),
  q("olive_press.oil", "L/h", "Oil output", "Выпуск масла"),
  q("olive_press.yield", "%", "Oil yield", "Выход масла", { range: { min: 0, max: 100 } }),
  q("olive_press.temp", "Cel", "Malaxer temperature", "Температура малаксера"),
  q("olive_press.acidity", "%", "Free acidity", "Свободная кислотность", { range: { min: 0, max: 100 } }),
  logical("olive_press.evoo", "EVOO grade OK", "Класс EVOO OK"),
  enu("olive_press.state", ["wash", "crush", "malax", "fault"], "Mill state", "Состояние завода"),
]);

write("layer-b-starch_pl.json", [
  id("starch_pl.id", "Starch plant id", "ID крахмального завода"),
  q("starch_pl.feed", "t/h", "Corn / tuber feed", "Подача кукурузы/клубней"),
  q("starch_pl.starch", "t/h", "Starch output", "Выпуск крахмала"),
  q("starch_pl.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("starch_pl.protein", "%", "Residual protein", "Остаточный белок", { range: { min: 0, max: 100 } }),
  q("starch_pl.water", "m3/t", "Process water", "Технологическая вода"),
  logical("starch_pl.spec.ok", "Spec OK", "Спецификация OK"),
  enu("starch_pl.feed.type", ["corn", "wheat", "potato", "tapioca", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-metal_det.json", [
  id("metal_det.id", "Food metal detector id", "ID металлодетектора пищевого"),
  q("metal_det.rejects", "-", "Rejects today", "Отводов за сутки", { encodings: ["i32"] }),
  q("metal_det.fe", "mm", "Fe sensitivity", "Чувствительность Fe"),
  q("metal_det.nonfe", "mm", "Non-Fe sensitivity", "Чувствительность цветных"),
  q("metal_det.ss", "mm", "Stainless sensitivity", "Чувствительность нержавейки"),
  q("metal_det.test.h", "h", "Hours since test piece", "Часов с тест-образца"),
  logical("metal_det.cal", "Calibration OK", "Калибровка OK"),
  enu("metal_det.state", ["monitor", "reject", "test", "fault"], "Detector state", "Состояние детектора"),
]);

write("layer-b-case_pack.json", [
  id("case_pack.id", "Case packer id", "ID упаковщика в короба"),
  q("case_pack.speed", "/min", "Cases per minute", "Коробов в минуту"),
  q("case_pack.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("case_pack.glue", "%", "Glue / tape OK rate", "Клей/скотч OK", { range: { min: 0, max: 100 } }),
  q("case_pack.change.s", "s", "Changeover time", "Время переналадки"),
  q("case_pack.uptime", "%", "Uptime", "Готовность", { range: { min: 0, max: 100 } }),
  logical("case_pack.jam", "Jam", "Затор"),
  enu("case_pack.state", ["pack", "changeover", "idle", "fault"], "Packer state", "Состояние упаковщика"),
]);

write("layer-b-pallet_fd.json", [
  id("pallet_fd.id", "Food palletizer id", "ID паллетайзера пищевого"),
  q("pallet_fd.speed", "/h", "Pallets per hour", "Паллет в час"),
  q("pallet_fd.layers", "-", "Layers per pallet", "Слоёв на паллете", { encodings: ["i32"] }),
  q("pallet_fd.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("pallet_fd.wrap", "%", "Stretch wrap tension OK", "Обмотка OK", { range: { min: 0, max: 100 } }),
  q("pallet_fd.weight", "kg", "Pallet weight", "Масса паллеты"),
  logical("pallet_fd.pattern", "Pattern OK", "Схема укладки OK"),
  enu("pallet_fd.state", ["stack", "wrap", "idle", "fault"], "Palletizer state", "Состояние паллетайзера"),
]);

write("layer-b-keg_line.json", [
  id("keg_line.id", "Keg filling line id", "ID линии розлива в кеги"),
  q("keg_line.speed", "/h", "Kegs per hour", "Кег в час"),
  q("keg_line.volume", "L", "Fill volume", "Объём наполнения"),
  q("keg_line.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("keg_line.co2", "g/L", "CO2 content", "Содержание CO2"),
  q("keg_line.wash", "%", "Wash / sanitize OK", "Мойка/санитизация OK", { range: { min: 0, max: 100 } }),
  logical("keg_line.spear", "Spear seal OK", "Фитинг OK"),
  enu("keg_line.state", ["wash", "fill", "cap", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-mineral_wat.json", [
  id("mineral_wat.id", "Mineral water bottling line id", "ID линии минеральной воды"),
  q("mineral_wat.speed", "/h", "Bottles per hour", "Бутылок в час"),
  q("mineral_wat.tds", "mg/L", "TDS", "Общая минерализация"),
  q("mineral_wat.ozone", "ppm", "Ozone residual", "Остаточный озон"),
  q("mineral_wat.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("mineral_wat.flow", "L/h", "Water flow", "Расход воды"),
  logical("mineral_wat.spec.ok", "Micro / chem OK", "Микро / химия OK"),
  enu("mineral_wat.state", ["filter", "fill", "label", "fault"], "Line state", "Состояние линии"),
]);

console.log("Layer B32 seeds written");
