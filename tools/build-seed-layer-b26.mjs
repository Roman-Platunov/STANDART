#!/usr/bin/env node
/**
 * Layer B26 — steelmaking, rolling, finishing, meltshop utilities.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B26", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-steel_eaf.json", [
  id("steel_eaf.id", "Electric arc furnace id", "ID ДСП"),
  id("steel_eaf.heat.id", "Heat id", "ID плавки"),
  q("steel_eaf.power", "MW", "Active power", "Активная мощность"),
  q("steel_eaf.current", "kA", "Electrode current", "Ток электродов"),
  q("steel_eaf.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("steel_eaf.tap.weight", "t", "Tap weight", "Масса выпуска"),
  logical("steel_eaf.foaming", "Foamy slag", "Пенный шлак"),
  enu("steel_eaf.state", ["charge", "melt", "refine", "tap", "fault"], "EAF state", "Состояние ДСП"),
]);

write("layer-b-steel_bof.json", [
  id("steel_bof.id", "BOF converter id", "ID конвертера"),
  id("steel_bof.heat.id", "Heat id", "ID плавки"),
  q("steel_bof.o2", "Nm3/min", "Oxygen blow rate", "Расход кислорода"),
  q("steel_bof.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("steel_bof.carbon", "%", "Carbon estimate", "Оценка углерода", { range: { min: 0, max: 100 } }),
  q("steel_bof.lance.h", "m", "Lance height", "Высота фурмы"),
  logical("steel_bof.slopping", "Slopping", "Выброс"),
  enu("steel_bof.state", ["charge", "blow", "reblow", "tap", "fault"], "BOF state", "Состояние конвертера"),
]);

write("layer-b-steel_caster.json", [
  id("steel_caster.id", "Continuous caster id", "ID МНЛЗ"),
  id("steel_caster.heat.id", "Heat id", "ID плавки"),
  q("steel_caster.speed", "m/min", "Casting speed", "Скорость разливки"),
  q("steel_caster.mold.level", "%", "Mold level", "Уровень в кристаллизаторе", { range: { min: 0, max: 100 } }),
  q("steel_caster.superheat", "K", "Steel superheat", "Перегрев стали"),
  q("steel_caster.width", "mm", "Slab / billet width", "Ширина сляба/заготовки"),
  logical("steel_caster.breakout", "Breakout risk", "Риск прорыва"),
  enu("steel_caster.product", ["slab", "bloom", "billet", "beam_blank", "other"], "Product", "Продукт"),
]);

write("layer-b-hot_strip.json", [
  id("hot_strip.mill.id", "Hot strip mill id", "ID стана горячей полосы"),
  id("hot_strip.coil.id", "Coil id", "ID рулона"),
  q("hot_strip.exit.thick", "mm", "Exit thickness", "Толщина на выходе"),
  q("hot_strip.exit.temp", "Cel", "Exit temperature", "Температура на выходе"),
  q("hot_strip.speed", "m/min", "Mill speed", "Скорость стана"),
  q("hot_strip.width", "mm", "Strip width", "Ширина полосы"),
  logical("hot_strip.cobble", "Cobble", "Авария полосы"),
  enu("hot_strip.state", ["roll", "idle", "change", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-cold_mill.json", [
  id("cold_mill.id", "Cold rolling mill id", "ID стана холодной прокатки"),
  id("cold_mill.coil.id", "Coil id", "ID рулона"),
  q("cold_mill.exit.thick", "mm", "Exit thickness", "Толщина на выходе"),
  q("cold_mill.reduction", "%", "Total reduction", "Суммарное обжатие", { range: { min: 0, max: 100 } }),
  q("cold_mill.speed", "m/min", "Mill speed", "Скорость стана"),
  q("cold_mill.tension", "kN", "Strip tension", "Натяжение полосы"),
  logical("cold_mill.break", "Strip break", "Обрыв полосы"),
  enu("cold_mill.type", ["tandem", "reversing", "sendzimir", "other"], "Mill type", "Тип стана"),
]);

write("layer-b-pickling_line.json", [
  id("pickling_line.id", "Pickling line id", "ID линии травления"),
  id("pickling_line.coil.id", "Coil id", "ID рулона"),
  q("pickling_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("pickling_line.acid", "%", "Acid concentration", "Концентрация кислоты", { range: { min: 0, max: 100 } }),
  q("pickling_line.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("pickling_line.fe", "g/L", "Iron in bath", "Железо в ванне"),
  logical("pickling_line.underpickle", "Underpickle risk", "Риск недотрава"),
  enu("pickling_line.acid_type", ["hcl", "h2so4", "mixed", "other"], "Acid", "Кислота"),
]);

write("layer-b-galv_line.json", [
  id("galv_line.id", "Galvanizing line id", "ID линии цинкования"),
  id("galv_line.coil.id", "Coil id", "ID рулона"),
  q("galv_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("galv_line.coat", "g/m2", "Coating weight", "Масса покрытия"),
  q("galv_line.pot.temp", "Cel", "Zinc pot temperature", "Температура цинковой ванны"),
  q("galv_line.air.knife", "kPa", "Air knife pressure", "Давление воздушного ножа"),
  logical("galv_line.spangle", "Spangle control on", "Контроль узора включён"),
  enu("galv_line.process", ["hdg", "galvneal", "galfan", "other"], "Process", "Процесс"),
]);

write("layer-b-tinning_line.json", [
  id("tinning_line.id", "Electrolytic tinning line id", "ID линии лужения"),
  id("tinning_line.coil.id", "Coil id", "ID рулона"),
  q("tinning_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("tinning_line.coat", "g/m2", "Tin coating", "Оловянное покрытие"),
  q("tinning_line.current", "A", "Plating current", "Ток осаждения"),
  q("tinning_line.oil", "mg/m2", "DOS oil", "Масло DOS"),
  logical("tinning_line.pass", "Coat in spec", "Покрытие в норме"),
  enu("tinning_line.state", ["plate", "reflow", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-anneal_furnace.json", [
  id("anneal_furnace.id", "Annealing furnace id", "ID печи отжига"),
  id("anneal_furnace.coil.id", "Coil / charge id", "ID рулона/садки"),
  q("anneal_furnace.temp", "Cel", "Zone temperature", "Температура зоны"),
  q("anneal_furnace.dew", "Cel", "Atmosphere dew point", "Точка росы атмосферы"),
  q("anneal_furnace.h2", "%", "H2 in atmosphere", "H2 в атмосфере", { range: { min: 0, max: 100 } }),
  q("anneal_furnace.soak.min", "min", "Soak time", "Время выдержки"),
  logical("anneal_furnace.recipe.ok", "Recipe on track", "Режим по графику"),
  enu("anneal_furnace.type", ["batch", "cal", "cal_h2", "other"], "Type", "Тип"),
]);

write("layer-b-ladle_furn.json", [
  id("ladle_furn.id", "Ladle furnace id", "ID УПК"),
  id("ladle_furn.heat.id", "Heat id", "ID плавки"),
  q("ladle_furn.power", "MW", "Arc power", "Мощность дуги"),
  q("ladle_furn.temp", "Cel", "Steel temperature", "Температура стали"),
  q("ladle_furn.ar", "L/min", "Argon stir", "Продувка аргоном"),
  q("ladle_furn.alloy", "kg", "Alloy added", "Добавлено ферросплавов"),
  logical("ladle_furn.ready", "Ready to cast", "Готово к разливке"),
  enu("ladle_furn.state", ["heat", "stir", "alloy", "idle", "fault"], "LF state", "Состояние УПК"),
]);

write("layer-b-rh_degasser.json", [
  id("rh_degasser.id", "RH degasser id", "ID вакууматора RH"),
  id("rh_degasser.heat.id", "Heat id", "ID плавки"),
  q("rh_degasser.vacuum", "Pa", "Vessel vacuum", "Вакуум в камере"),
  q("rh_degasser.h", "ppm", "Hydrogen", "Водород"),
  q("rh_degasser.n", "ppm", "Nitrogen", "Азот"),
  q("rh_degasser.cycle.min", "min", "Treatment time", "Время обработки"),
  logical("rh_degasser.snorkel.ok", "Snorkel OK", "Патрубок OK"),
  enu("rh_degasser.state", ["evacuate", "treat", "idle", "fault"], "RH state", "Состояние RH"),
]);

write("layer-b-scrap_preheat.json", [
  id("scrap_preheat.id", "Scrap preheater id", "ID подогревателя лома"),
  q("scrap_preheat.temp", "Cel", "Scrap temperature", "Температура лома"),
  q("scrap_preheat.gas", "m3/h", "Off-gas flow", "Расход отходящих газов"),
  q("scrap_preheat.o2", "%", "Off-gas O2", "O2 в отходящих", { range: { min: 0, max: 100 } }),
  q("scrap_preheat.charge", "t", "Charge weight", "Масса шихты"),
  q("scrap_preheat.energy", "kWh/t", "Energy saved proxy", "Экономия энергии"),
  logical("scrap_preheat.dioxin", "Dioxin risk high", "Высокий риск диоксинов"),
  enu("scrap_preheat.state", ["preheat", "charge", "idle", "fault"], "Preheater state", "Состояние подогревателя"),
]);

write("layer-b-sinter_strand.json", [
  id("sinter_strand.id", "Sinter strand id", "ID агломерационной машины"),
  q("sinter_strand.speed", "m/min", "Strand speed", "Скорость ленты"),
  q("sinter_strand.btp", "m", "Burn-through point", "Точка дожига"),
  q("sinter_strand.fe", "%", "Fe content", "Содержание Fe", { range: { min: 0, max: 100 } }),
  q("sinter_strand.strength", "-", "Tumbler index", "Барабанный индекс"),
  q("sinter_strand.output", "t/h", "Sinter output", "Выпуск агломерата"),
  logical("sinter_strand.hot", "Hot return high", "Высокий горячий возврат"),
  enu("sinter_strand.state", ["sinter", "idle", "maintain", "fault"], "Strand state", "Состояние машины"),
]);

write("layer-b-coke_battery.json", [
  id("coke_battery.id", "Coke oven battery id", "ID коксовой батареи"),
  q("coke_battery.ovens", "-", "Ovens under fire", "Печей под обогревом", { encodings: ["i32"] }),
  q("coke_battery.temp", "Cel", "Flue temperature", "Температура борова"),
  q("coke_battery.coke", "t/d", "Coke production", "Выпуск кокса"),
  q("coke_battery.gas", "m3/h", "COG production", "Выпуск коксового газа"),
  q("coke_battery.push", "-", "Pushes today", "Выталкиваний за сутки", { encodings: ["i32"] }),
  logical("coke_battery.emission", "Door emission", "Эмиссия из дверей"),
  enu("coke_battery.state", ["carbonize", "push", "idle", "fault"], "Battery state", "Состояние батареи"),
]);

write("layer-b-bf_stave.json", [
  id("bf_stave.bf.id", "Blast furnace id", "ID доменной печи"),
  q("bf_stave.cool.flow", "m3/h", "Stave cooling flow", "Расход охлаждения холодильников"),
  q("bf_stave.heat.load", "kW", "Heat load", "Тепловая нагрузка"),
  q("bf_stave.temp", "Cel", "Stave temperature", "Температура холодильника"),
  q("bf_stave.leak", "-", "Cooling leaks", "Утечек охлаждения", { encodings: ["i32"] }),
  q("bf_stave.top.gas", "m3/h", "Top gas flow", "Расход колошникового газа"),
  logical("bf_stave.hotspot", "Hotspot", "Горячая точка"),
  enu("bf_stave.state", ["blow", "bank", "idle", "fault"], "BF cooling state", "Состояние охлаждения ДП"),
]);

write("layer-b-pellet_plant.json", [
  id("pellet_plant.id", "Iron ore pellet plant id", "ID фабрики окатышей"),
  q("pellet_plant.feed", "t/h", "Green pellet feed", "Подача сырых окатышей"),
  q("pellet_plant.output", "t/h", "Fired pellet output", "Выпуск обожжённых"),
  q("pellet_plant.temp", "Cel", "Induration temperature", "Температура обжига"),
  q("pellet_plant.ccs", "kN", "Cold compression strength", "Прочность на сжатие"),
  q("pellet_plant.feo", "%", "FeO content", "Содержание FeO", { range: { min: 0, max: 100 } }),
  logical("pellet_plant.quality.ok", "Quality OK", "Качество OK"),
  enu("pellet_plant.state", ["indurate", "idle", "maintain", "fault"], "Plant state", "Состояние фабрики"),
]);

write("layer-b-dri_plant.json", [
  id("dri_plant.id", "DRI / HBI plant id", "ID завода ПВЖ/HBI"),
  q("dri_plant.metallization", "%", "Metallization", "Степень металлизации", { range: { min: 0, max: 100 } }),
  q("dri_plant.output", "t/h", "DRI output", "Выпуск ПВЖ"),
  q("dri_plant.temp", "Cel", "Reduction temperature", "Температура восстановления"),
  q("dri_plant.gas", "m3/h", "Reducing gas", "Восстановительный газ"),
  q("dri_plant.carbon", "%", "Product carbon", "Углерод в продукте", { range: { min: 0, max: 100 } }),
  logical("dri_plant.reoxid", "Reoxidation risk", "Риск реоксидации"),
  enu("dri_plant.process", ["midrex", "hyl", "fluid", "other"], "Process", "Процесс"),
]);

write("layer-b-reheat_furn.json", [
  id("reheat_furn.id", "Reheating furnace id", "ID нагревательной печи"),
  id("reheat_furn.slab.id", "Slab / billet id", "ID сляба/заготовки"),
  q("reheat_furn.temp", "Cel", "Discharge temperature", "Температура выдачи"),
  q("reheat_furn.fuel", "m3/h", "Fuel rate", "Расход топлива"),
  q("reheat_furn.o2", "%", "Flue O2", "O2 в дымовых", { range: { min: 0, max: 100 } }),
  q("reheat_furn.scale", "kg/t", "Scale loss", "Угар"),
  logical("reheat_furn.ready", "Discharge ready", "Готово к выдаче"),
  enu("reheat_furn.type", ["walking_beam", "pusher", "rotary", "other"], "Type", "Тип"),
]);

write("layer-b-plate_mill.json", [
  id("plate_mill.id", "Plate mill id", "ID стана толстого листа"),
  id("plate_mill.plate.id", "Plate id", "ID листа"),
  q("plate_mill.thick", "mm", "Plate thickness", "Толщина листа"),
  q("plate_mill.width", "mm", "Plate width", "Ширина листа"),
  q("plate_mill.force", "MN", "Rolling force", "Усилие прокатки"),
  q("plate_mill.temp", "Cel", "Rolling temperature", "Температура прокатки"),
  logical("plate_mill.flat", "Flatness OK", "Плоскостность OK"),
  enu("plate_mill.state", ["roll", "cool", "level", "idle", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-wire_rod.json", [
  id("wire_rod.mill.id", "Wire rod mill id", "ID стана катанки"),
  id("wire_rod.coil.id", "Coil id", "ID бунта"),
  q("wire_rod.diameter", "mm", "Rod diameter", "Диаметр катанки"),
  q("wire_rod.speed", "m/s", "Finishing speed", "Скорость чистовой"),
  q("wire_rod.lay.temp", "Cel", "Laying head temperature", "Температура виткоукладчика"),
  q("wire_rod.stelm", "%", "Stelmor cooling proxy", "Охлаждение Stelmor", { range: { min: 0, max: 100 } }),
  logical("wire_rod.cobble", "Cobble", "Авария"),
  enu("wire_rod.state", ["roll", "cool", "coil", "idle", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-bar_mill.json", [
  id("bar_mill.id", "Bar / section mill id", "ID сортового стана"),
  id("bar_mill.bundle.id", "Bundle id", "ID пакета"),
  q("bar_mill.size", "mm", "Section size", "Размер профиля"),
  q("bar_mill.speed", "m/s", "Finishing speed", "Скорость чистовой"),
  q("bar_mill.temp", "Cel", "Finishing temperature", "Температура чистовой"),
  q("bar_mill.tonnage", "t/h", "Output", "Производительность"),
  logical("bar_mill.cobble", "Cobble", "Авария"),
  enu("bar_mill.product", ["rebar", "round", "angle", "channel", "other"], "Product", "Продукт"),
]);

write("layer-b-seamless_tube.json", [
  id("seamless_tube.mill.id", "Seamless tube mill id", "ID стана бесшовных труб"),
  id("seamless_tube.lot.id", "Lot id", "ID партии"),
  q("seamless_tube.od", "mm", "Outside diameter", "Наружный диаметр"),
  q("seamless_tube.wt", "mm", "Wall thickness", "Толщина стенки"),
  q("seamless_tube.speed", "m/min", "Mill speed", "Скорость стана"),
  q("seamless_tube.eccentric", "%", "Eccentricity", "Эксцентриситет", { range: { min: 0, max: 100 } }),
  logical("seamless_tube.reject", "NDT reject", "Брак по НК"),
  enu("seamless_tube.process", ["mandrel", "plug", "pilger", "other"], "Process", "Процесс"),
]);

write("layer-b-welded_pipe.json", [
  id("welded_pipe.mill.id", "Welded pipe mill id", "ID стана сварных труб"),
  id("welded_pipe.lot.id", "Lot id", "ID партии"),
  q("welded_pipe.od", "mm", "Outside diameter", "Наружный диаметр"),
  q("welded_pipe.wt", "mm", "Wall thickness", "Толщина стенки"),
  q("welded_pipe.speed", "m/min", "Line speed", "Скорость линии"),
  q("welded_pipe.weld.power", "kW", "Weld power", "Мощность сварки"),
  logical("welded_pipe.ut.fail", "Weld UT fail", "Провал УЗК шва"),
  enu("welded_pipe.process", ["erw", "saw", "hfw", "other"], "Process", "Процесс"),
]);

write("layer-b-slit_line.json", [
  id("slit_line.id", "Slitting line id", "ID линии продольной резки"),
  id("slit_line.coil.id", "Parent coil id", "ID исходного рулона"),
  q("slit_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("slit_line.strips", "-", "Number of strips", "Число полос", { encodings: ["i32"] }),
  q("slit_line.width", "mm", "Strip width", "Ширина полосы"),
  q("slit_line.burr", "um", "Edge burr", "Заусенец"),
  logical("slit_line.knife.change", "Knife change due", "Пора менять ножи"),
  enu("slit_line.state", ["slit", "setup", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-leveler_line.json", [
  id("leveler_line.id", "Leveler / straightener id", "ID правильно-растяжной машины"),
  id("leveler_line.coil.id", "Coil / plate id", "ID рулона/листа"),
  q("leveler_line.flatness", "-", "Flatness (I-units)", "Плоскостность (I)"),
  q("leveler_line.elong", "%", "Elongation", "Удлинение", { range: { min: 0, max: 100 } }),
  q("leveler_line.force", "kN", "Leveling force", "Усилие правки"),
  q("leveler_line.speed", "m/min", "Line speed", "Скорость линии"),
  logical("leveler_line.in_spec", "Flatness in spec", "Плоскостность в норме"),
  enu("leveler_line.type", ["roller", "tension", "stretch", "other"], "Type", "Тип"),
]);

write("layer-b-skin_pass.json", [
  id("skin_pass.id", "Skin-pass mill id", "ID дрессировочного стана"),
  id("skin_pass.coil.id", "Coil id", "ID рулона"),
  q("skin_pass.elong", "%", "Elongation", "Удлинение", { range: { min: 0, max: 100 } }),
  q("skin_pass.force", "kN", "Rolling force", "Усилие прокатки"),
  q("skin_pass.roughness", "um", "Surface roughness Ra", "Шероховатость Ra"),
  q("skin_pass.speed", "m/min", "Mill speed", "Скорость стана"),
  logical("skin_pass.pass", "Pass complete", "Проход завершён"),
  enu("skin_pass.state", ["roll", "idle", "change", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-temper_pass.json", [
  id("temper_pass.id", "Temper mill id", "ID темпера-стана"),
  id("temper_pass.coil.id", "Coil id", "ID рулона"),
  q("temper_pass.elong", "%", "Elongation", "Удлинение", { range: { min: 0, max: 100 } }),
  q("temper_pass.force", "MN", "Rolling force", "Усилие прокатки"),
  q("temper_pass.speed", "m/min", "Mill speed", "Скорость стана"),
  q("temper_pass.tension", "kN", "Entry tension", "Входное натяжение"),
  logical("temper_pass.break", "Strip break", "Обрыв полосы"),
  enu("temper_pass.state", ["roll", "idle", "change", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-slitter_metal.json", [
  id("slitter_metal.id", "Metal slitter id", "ID металлического слиттера"),
  q("slitter_metal.speed", "m/min", "Slit speed", "Скорость резки"),
  q("slitter_metal.knives", "-", "Knife sets", "Комплектов ножей", { encodings: ["i32"] }),
  q("slitter_metal.width.tol", "mm", "Width tolerance", "Допуск по ширине"),
  q("slitter_metal.scrap", "%", "Edge scrap", "Кромочный отход", { range: { min: 0, max: 100 } }),
  q("slitter_metal.uptime", "%", "Uptime", "Готовность", { range: { min: 0, max: 100 } }),
  logical("slitter_metal.jam", "Strip jam", "Затор полосы"),
  enu("slitter_metal.state", ["run", "setup", "idle", "fault"], "Slitter state", "Состояние слиттера"),
]);

write("layer-b-coil_yard.json", [
  id("coil_yard.id", "Coil yard id", "ID склада рулонов"),
  q("coil_yard.inventory", "t", "Inventory mass", "Масса запасов"),
  q("coil_yard.in", "t/d", "Inbound", "Поступление"),
  q("coil_yard.out", "t/d", "Outbound", "Отгрузка"),
  q("coil_yard.occupancy", "%", "Yard occupancy", "Занятость склада", { range: { min: 0, max: 100 } }),
  q("coil_yard.age.d", "d", "Average coil age", "Средний возраст рулона"),
  logical("coil_yard.full", "Yard full", "Склад полон"),
  enu("coil_yard.state", ["receive", "store", "ship", "idle"], "Yard state", "Состояние склада"),
]);

write("layer-b-crane_meltshop.json", [
  id("crane_meltshop.id", "Meltshop crane id", "ID крана сталеплавильного цеха"),
  q("crane_meltshop.load", "t", "Hook load", "Нагрузка на крюк"),
  q("crane_meltshop.swl", "t", "Safe working load", "Грузоподъёмность"),
  q("crane_meltshop.moves", "-", "Moves today", "Перемещений за сутки", { encodings: ["i32"] }),
  q("crane_meltshop.util", "%", "Utilization", "Загрузка", { range: { min: 0, max: 100 } }),
  q("crane_meltshop.temp", "Cel", "Cabin / motor temperature", "Температура кабины/двигателя"),
  logical("crane_meltshop.overload", "Overload", "Перегруз"),
  enu("crane_meltshop.state", ["idle", "travel", "lift", "fault"], "Crane state", "Состояние крана"),
]);

write("layer-b-fume_extract.json", [
  id("fume_extract.id", "Meltshop fume extraction id", "ID газоочистки сталеплавильного цеха"),
  q("fume_extract.flow", "m3/h", "Extracted flow", "Отсасываемый расход"),
  q("fume_extract.dp", "Pa", "Filter DP", "Перепад на фильтре"),
  q("fume_extract.dust", "mg/m3", "Outlet dust", "Пыль на выходе"),
  q("fume_extract.fan", "%", "Fan speed", "Скорость вентилятора", { range: { min: 0, max: 100 } }),
  q("fume_extract.power", "kW", "Fan power", "Мощность вентилятора"),
  logical("fume_extract.bypass", "Bypass open", "Байпас открыт"),
  enu("fume_extract.state", ["extract", "pulse", "idle", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-baghouse_steel.json", [
  id("baghouse_steel.id", "Steel plant baghouse id", "ID рукавного фильтра меткомбината"),
  q("baghouse_steel.dp", "Pa", "Baghouse DP", "Перепад на фильтре"),
  q("baghouse_steel.dust", "mg/m3", "Outlet dust", "Пыль на выходе"),
  q("baghouse_steel.pulse", "-", "Pulse cycles today", "Импульсов за сутки", { encodings: ["i32"] }),
  q("baghouse_steel.temp", "Cel", "Gas temperature", "Температура газа"),
  q("baghouse_steel.hoppers", "-", "Hoppers high", "Бункеров с высоким уровнем", { encodings: ["i32"] }),
  logical("baghouse_steel.bag.fail", "Bag failure", "Отказ рукава"),
  enu("baghouse_steel.state", ["filter", "pulse", "offline", "fault"], "Baghouse state", "Состояние фильтра"),
]);

write("layer-b-slag_yard.json", [
  id("slag_yard.id", "Slag yard id", "ID шлакового двора"),
  q("slag_yard.in", "t/d", "Slag inbound", "Поступление шлака"),
  q("slag_yard.processed", "t/d", "Processed", "Переработано"),
  q("slag_yard.metal.rec", "%", "Metal recovery", "Извлечение металла", { range: { min: 0, max: 100 } }),
  q("slag_yard.stock", "t", "Stockpile", "Отвал"),
  q("slag_yard.dust", "mg/m3", "Yard dust", "Пыль на дворе"),
  logical("slag_yard.hot", "Hot slag present", "Есть горячий шлак"),
  enu("slag_yard.state", ["receive", "process", "ship", "idle"], "Yard state", "Состояние двора"),
]);

write("layer-b-oxygen_plant.json", [
  id("oxygen_plant.id", "ASU / oxygen plant id", "ID КА / кислородной станции"),
  q("oxygen_plant.o2", "Nm3/h", "Oxygen production", "Выработка кислорода"),
  q("oxygen_plant.purity", "%", "O2 purity", "Чистота O2", { range: { min: 0, max: 100 } }),
  q("oxygen_plant.n2", "Nm3/h", "Nitrogen production", "Выработка азота"),
  q("oxygen_plant.power", "kW", "Plant power", "Мощность станции"),
  q("oxygen_plant.liquid", "t", "LOX inventory", "Запас ЖК"),
  logical("oxygen_plant.trip", "Plant trip", "Отключение станции"),
  enu("oxygen_plant.state", ["produce", "turndown", "idle", "fault"], "Plant state", "Состояние станции"),
]);

write("layer-b-argon_inject.json", [
  id("argon_inject.ladle.id", "Ladle argon stir id", "ID аргонной продувки ковша"),
  id("argon_inject.heat.id", "Heat id", "ID плавки"),
  q("argon_inject.flow", "L/min", "Argon flow", "Расход аргона"),
  q("argon_inject.pressure", "kPa", "Plug pressure", "Давление пробки"),
  q("argon_inject.time.min", "min", "Stir time", "Время продувки"),
  q("argon_inject.temp.drop", "K", "Temperature drop", "Падение температуры"),
  logical("argon_inject.plug.ok", "Porous plug OK", "Пористая пробка OK"),
  enu("argon_inject.state", ["stir", "idle", "blocked", "fault"], "Stir state", "Состояние продувки"),
]);

write("layer-b-mold_level.json", [
  id("mold_level.caster.id", "Caster mold level control id", "ID уровня в кристаллизаторе"),
  q("mold_level.level", "%", "Mold level", "Уровень металла", { range: { min: 0, max: 100 } }),
  q("mold_level.setpoint", "%", "Level setpoint", "Уставка уровня", { range: { min: 0, max: 100 } }),
  q("mold_level.noise", "mm", "Level noise", "Шум уровня"),
  q("mold_level.stopper", "%", "Stopper position", "Положение стопора", { range: { min: 0, max: 100 } }),
  q("mold_level.speed", "m/min", "Casting speed", "Скорость разливки"),
  logical("mold_level.alarm", "Level alarm", "Тревога уровня"),
  enu("mold_level.sensor", ["eddy", "radio", "optical", "other"], "Sensor", "Датчик"),
]);

write("layer-b-oscillator_mold.json", [
  id("oscillator_mold.caster.id", "Mold oscillator id", "ID качания кристаллизатора"),
  q("oscillator_mold.stroke", "mm", "Stroke", "Ход"),
  q("oscillator_mold.freq", "Hz", "Oscillation frequency", "Частота качания"),
  q("oscillator_mold.neg.strip", "%", "Negative strip time", "Время отрицательной полосы", { range: { min: 0, max: 100 } }),
  q("oscillator_mold.friction", "-", "Friction index", "Индекс трения"),
  q("oscillator_mold.powder", "kg/t", "Mold powder use", "Расход шлакообразующей смеси"),
  logical("oscillator_mold.stick", "Sticker alarm", "Тревога залипания"),
  enu("oscillator_mold.state", ["oscillate", "idle", "fault"], "Oscillator state", "Состояние качания"),
]);

write("layer-b-tundish_heat.json", [
  id("tundish_heat.id", "Tundish heater id", "ID подогрева промковша"),
  id("tundish_heat.caster.id", "Caster id", "ID МНЛЗ"),
  q("tundish_heat.temp", "Cel", "Tundish temperature", "Температура промковша"),
  q("tundish_heat.power", "kW", "Heater power", "Мощность нагрева"),
  q("tundish_heat.level", "%", "Steel level", "Уровень стали", { range: { min: 0, max: 100 } }),
  q("tundish_heat.cover", "%", "Cover powder", "Накрывающий порошок", { range: { min: 0, max: 100 } }),
  logical("tundish_heat.ready", "Ready for cast", "Готов к разливке"),
  enu("tundish_heat.state", ["preheat", "cast", "idle", "fault"], "Tundish state", "Состояние промковша"),
]);

write("layer-b-dummy_bar.json", [
  id("dummy_bar.caster.id", "Dummy bar system id", "ID системы затравки"),
  q("dummy_bar.position", "m", "Dummy bar position", "Позиция затравки"),
  q("dummy_bar.speed", "m/min", "Withdrawal speed", "Скорость вытягивания"),
  q("dummy_bar.force", "kN", "Withdrawal force", "Усилие вытягивания"),
  q("dummy_bar.temp", "Cel", "Head temperature", "Температура головки"),
  q("dummy_bar.cycles", "-", "Starts this campaign", "Пусков за кампанию", { encodings: ["i32"] }),
  logical("dummy_bar.engaged", "Dummy bar engaged", "Затравка введена"),
  enu("dummy_bar.state", ["ready", "insert", "withdraw", "fault"], "Dummy bar state", "Состояние затравки"),
]);

write("layer-b-torch_cut.json", [
  id("torch_cut.caster.id", "Torch cut-off id", "ID газовой резки"),
  id("torch_cut.slab.id", "Cut piece id", "ID отрезанной заготовки"),
  q("torch_cut.length", "mm", "Cut length", "Длина реза"),
  q("torch_cut.o2", "Nm3/h", "Cutting oxygen", "Кислород резки"),
  q("torch_cut.speed", "mm/min", "Cut speed", "Скорость резки"),
  q("torch_cut.kerf", "mm", "Kerf width", "Ширина реза"),
  logical("torch_cut.pass", "Cut complete", "Рез завершён"),
  enu("torch_cut.state", ["cut", "idle", "change", "fault"], "Torch state", "Состояние резки"),
]);

write("layer-b-scarfing_line.json", [
  id("scarfing_line.id", "Scarfing machine id", "ID машины огневой зачистки"),
  id("scarfing_line.slab.id", "Slab id", "ID сляба"),
  q("scarfing_line.depth", "mm", "Scarf depth", "Глубина зачистки"),
  q("scarfing_line.o2", "Nm3/h", "Oxygen use", "Расход кислорода"),
  q("scarfing_line.speed", "m/min", "Pass speed", "Скорость прохода"),
  q("scarfing_line.coverage", "%", "Surface coverage", "Покрытие поверхности", { range: { min: 0, max: 100 } }),
  logical("scarfing_line.pass", "Pass complete", "Проход завершён"),
  enu("scarfing_line.state", ["scarf", "idle", "maintain", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-eddy_inspect.json", [
  id("eddy_inspect.line.id", "Eddy-current inspection id", "ID вихретокового контроля"),
  id("eddy_inspect.coil.id", "Coil / tube id", "ID рулона/трубы"),
  q("eddy_inspect.defects", "-", "Defects found", "Дефектов найдено", { encodings: ["i32"] }),
  q("eddy_inspect.speed", "m/min", "Inspection speed", "Скорость контроля"),
  q("eddy_inspect.sensitivity", "%", "Sensitivity", "Чувствительность", { range: { min: 0, max: 100 } }),
  q("eddy_inspect.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("eddy_inspect.alarm", "Defect alarm", "Тревога дефекта"),
  enu("eddy_inspect.state", ["inspect", "calibrate", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-ut_plate.json", [
  id("ut_plate.line.id", "Plate ultrasonic test id", "ID УЗК листа"),
  id("ut_plate.plate.id", "Plate id", "ID листа"),
  q("ut_plate.coverage", "%", "Scan coverage", "Покрытие сканирования", { range: { min: 0, max: 100 } }),
  q("ut_plate.indications", "-", "Indications", "Индикаций", { encodings: ["i32"] }),
  q("ut_plate.depth", "mm", "Max indication depth", "Макс. глубина индикации"),
  q("ut_plate.speed", "m/min", "Scan speed", "Скорость сканирования"),
  logical("ut_plate.reject", "Reject", "Брак"),
  enu("ut_plate.class", ["pass", "repair", "reject", "retest"], "Class", "Класс"),
]);

write("layer-b-xray_gauge.json", [
  id("xray_gauge.mill.id", "X-ray thickness gauge id", "ID рентгеновского толщиномера"),
  q("xray_gauge.thick", "mm", "Measured thickness", "Измеренная толщина"),
  q("xray_gauge.dev", "um", "Deviation from target", "Отклонение от цели"),
  q("xray_gauge.alloy", "-", "Alloy compensation", "Компенсация сплава"),
  q("xray_gauge.temp", "Cel", "Strip temperature", "Температура полосы"),
  q("xray_gauge.rate", "/s", "Measurement rate", "Частота измерений"),
  logical("xray_gauge.alarm", "Thickness alarm", "Тревога толщины"),
  enu("xray_gauge.state", ["measure", "calibrate", "offline", "fault"], "Gauge state", "Состояние толщиномера"),
]);

write("layer-b-shape_meter.json", [
  id("shape_meter.mill.id", "Shape / flatness meter id", "ID измерителя плоскостности"),
  q("shape_meter.flatness", "-", "Flatness (I-units)", "Плоскостность (I)"),
  q("shape_meter.crown", "um", "Crown", "Выпуклость"),
  q("shape_meter.wedge", "um", "Wedge", "Клиновидность"),
  q("shape_meter.speed", "m/min", "Strip speed", "Скорость полосы"),
  q("shape_meter.zones", "-", "Active zones", "Активных зон", { encodings: ["i32"] }),
  logical("shape_meter.out", "Out of band", "Вне допуска"),
  enu("shape_meter.state", ["measure", "calibrate", "offline", "fault"], "Meter state", "Состояние измерителя"),
]);

write("layer-b-roll_grind.json", [
  id("roll_grind.id", "Roll grinding machine id", "ID вальцешлифовального станка"),
  id("roll_grind.roll.id", "Roll id", "ID валка"),
  q("roll_grind.diameter", "mm", "Roll diameter", "Диаметр валка"),
  q("roll_grind.crown", "um", "Ground crown", "Шлифованная выпуклость"),
  q("roll_grind.roughness", "um", "Ra", "Ra"),
  q("roll_grind.time.min", "min", "Grind time", "Время шлифовки"),
  logical("roll_grind.pass", "Grind pass", "Шлифовка принята"),
  enu("roll_grind.state", ["grind", "measure", "idle", "fault"], "Machine state", "Состояние станка"),
]);

write("layer-b-work_roll.json", [
  id("work_roll.id", "Work roll id", "ID рабочего валка"),
  id("work_roll.stand.id", "Stand id", "ID клети"),
  q("work_roll.diameter", "mm", "Diameter", "Диаметр"),
  q("work_roll.tonnage", "t", "Rolled tonnage", "Прокатанный тоннаж"),
  q("work_roll.temp", "Cel", "Roll temperature", "Температура валка"),
  q("work_roll.wear", "um", "Wear", "Износ"),
  logical("work_roll.change.due", "Change due", "Пора менять"),
  enu("work_roll.state", ["in_mill", "spare", "grind", "scrap"], "Roll state", "Состояние валка"),
]);

write("layer-b-backup_roll.json", [
  id("backup_roll.id", "Backup roll id", "ID опорного валка"),
  id("backup_roll.stand.id", "Stand id", "ID клети"),
  q("backup_roll.diameter", "mm", "Diameter", "Диаметр"),
  q("backup_roll.tonnage", "t", "Rolled tonnage", "Прокатанный тоннаж"),
  q("backup_roll.temp", "Cel", "Roll temperature", "Температура валка"),
  q("backup_roll.crown", "um", "Crown", "Выпуклость"),
  logical("backup_roll.change.due", "Change due", "Пора менять"),
  enu("backup_roll.state", ["in_mill", "spare", "grind", "scrap"], "Roll state", "Состояние валка"),
]);

write("layer-b-hydraulic_agc.json", [
  id("hydraulic_agc.stand.id", "Hydraulic AGC stand id", "ID клети с гидравлическим АРН"),
  q("hydraulic_agc.gap", "mm", "Roll gap", "Зазор валков"),
  q("hydraulic_agc.force", "MN", "Rolling force", "Усилие прокатки"),
  q("hydraulic_agc.thick.dev", "um", "Thickness deviation", "Отклонение толщины"),
  q("hydraulic_agc.cylinder", "mm", "Cylinder position", "Позиция цилиндра"),
  q("hydraulic_agc.pressure", "MPa", "Hydraulic pressure", "Давление гидравлики"),
  logical("hydraulic_agc.lock", "AGC locked", "АРН заблокирован"),
  enu("hydraulic_agc.mode", ["auto", "manual", "hold", "fault"], "Mode", "Режим"),
]);

write("layer-b-loop_tower.json", [
  id("loop_tower.line.id", "Looper / accumulator tower id", "ID петлевого/накопительного устройства"),
  q("loop_tower.fill", "%", "Fill level", "Степень заполнения", { range: { min: 0, max: 100 } }),
  q("loop_tower.tension", "kN", "Strip tension", "Натяжение полосы"),
  q("loop_tower.speed.in", "m/min", "Entry speed", "Скорость на входе"),
  q("loop_tower.speed.out", "m/min", "Exit speed", "Скорость на выходе"),
  q("loop_tower.dancers", "-", "Dancer position proxy", "Позиция танцора", { encodings: ["i32"] }),
  logical("loop_tower.empty", "Near empty", "Почти пуст"),
  enu("loop_tower.state", ["fill", "hold", "empty", "fault"], "Tower state", "Состояние накопителя"),
]);

write("layer-b-side_trim.json", [
  id("side_trim.line.id", "Side trimmer id", "ID кромкообрезных ножниц"),
  id("side_trim.coil.id", "Coil id", "ID рулона"),
  q("side_trim.width", "mm", "Trimmed width", "Ширина после обрезки"),
  q("side_trim.scrap", "kg/t", "Edge scrap", "Кромочный отход"),
  q("side_trim.speed", "m/min", "Line speed", "Скорость линии"),
  q("side_trim.knife.life", "%", "Knife life left", "Остаток ресурса ножей", { range: { min: 0, max: 100 } }),
  logical("side_trim.burr", "Burr high", "Высокий заусенец"),
  enu("side_trim.state", ["trim", "setup", "idle", "fault"], "Trimmer state", "Состояние ножниц"),
]);

write("layer-b-oiler_machine.json", [
  id("oiler_machine.line.id", "Strip oiler id", "ID маслонаносителя"),
  id("oiler_machine.coil.id", "Coil id", "ID рулона"),
  q("oiler_machine.coat", "g/m2", "Oil coat weight", "Масса масляного покрытия"),
  q("oiler_machine.speed", "m/min", "Line speed", "Скорость линии"),
  q("oiler_machine.temp", "Cel", "Oil temperature", "Температура масла"),
  q("oiler_machine.uniform", "%", "Coat uniformity", "Равномерность покрытия", { range: { min: 0, max: 100 } }),
  logical("oiler_machine.in_spec", "Coat in spec", "Покрытие в норме"),
  enu("oiler_machine.type", ["electrostatic", "spray", "roll", "other"], "Type", "Тип"),
]);

write("layer-b-paper_interleaf.json", [
  id("paper_interleaf.line.id", "Interleaving paper applicator id", "ID укладчика прокладочной бумаги"),
  id("paper_interleaf.coil.id", "Coil id", "ID рулона"),
  q("paper_interleaf.speed", "m/min", "Line speed", "Скорость линии"),
  q("paper_interleaf.tension", "N", "Paper tension", "Натяжение бумаги"),
  q("paper_interleaf.breaks", "-", "Paper breaks today", "Обрывов бумаги за сутки", { encodings: ["i32"] }),
  q("paper_interleaf.usage", "m2/t", "Paper use", "Расход бумаги"),
  logical("paper_interleaf.jam", "Paper jam", "Замятие бумаги"),
  enu("paper_interleaf.state", ["apply", "idle", "change", "fault"], "Applicator state", "Состояние укладчика"),
]);

write("layer-b-coil_pack.json", [
  id("coil_pack.line.id", "Coil packing line id", "ID линии упаковки рулонов"),
  id("coil_pack.coil.id", "Coil id", "ID рулона"),
  q("coil_pack.weight", "t", "Coil weight", "Масса рулона"),
  q("coil_pack.wrap", "-", "Wrap layers", "Слоёв обмотки", { encodings: ["i32"] }),
  q("coil_pack.cycle.s", "s", "Pack cycle", "Цикл упаковки"),
  q("coil_pack.throughput", "/h", "Coils per hour", "Рулонов в час"),
  logical("coil_pack.label.ok", "Label OK", "Этикетка OK"),
  enu("coil_pack.state", ["weigh", "wrap", "band", "label", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-weigh_bridge_st.json", [
  id("weigh_bridge_st.id", "Steel plant weighbridge id", "ID автовесов меткомбината"),
  id("weigh_bridge_st.ticket.id", "Weigh ticket id", "ID взвешивания"),
  q("weigh_bridge_st.gross", "t", "Gross weight", "Брутто"),
  q("weigh_bridge_st.tare", "t", "Tare weight", "Тара"),
  q("weigh_bridge_st.net", "t", "Net weight", "Нетто"),
  q("weigh_bridge_st.axles", "-", "Axles on scale", "Осей на весах", { encodings: ["i32"] }),
  logical("weigh_bridge_st.valid", "Weighing valid", "Взвешивание действительно"),
  enu("weigh_bridge_st.state", ["idle", "weigh", "print", "fault"], "Bridge state", "Состояние весов"),
]);

write("layer-b-sample_lab_st.json", [
  id("sample_lab_st.id", "Steel sample lab id", "ID экспресс-лаборатории стали"),
  id("sample_lab_st.heat.id", "Heat id", "ID плавки"),
  q("sample_lab_st.c", "%", "Carbon", "Углерод", { range: { min: 0, max: 100 } }),
  q("sample_lab_st.tat.min", "min", "Turnaround time", "Время анализа"),
  q("sample_lab_st.samples", "-", "Samples today", "Проб за сутки", { encodings: ["i32"] }),
  q("sample_lab_st.o", "ppm", "Oxygen", "Кислород"),
  logical("sample_lab_st.spec.ok", "Chemistry in spec", "Химия в норме"),
  enu("sample_lab_st.method", ["oes", "xrf", "combustion", "other"], "Method", "Метод"),
]);

write("layer-b-alloy_bunker.json", [
  id("alloy_bunker.id", "Ferroalloy bunker id", "ID бункера ферросплавов"),
  id("alloy_bunker.material", "Material code", "Код материала"),
  q("alloy_bunker.level", "%", "Bunker level", "Уровень бункера", { range: { min: 0, max: 100 } }),
  q("alloy_bunker.feed", "kg/min", "Feed rate", "Скорость подачи"),
  q("alloy_bunker.moisture", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  q("alloy_bunker.batch", "kg", "Last batch weight", "Масса последней порции"),
  logical("alloy_bunker.low", "Low level", "Низкий уровень"),
  enu("alloy_bunker.state", ["ready", "feed", "refill", "fault"], "Bunker state", "Состояние бункера"),
]);

write("layer-b-lime_kiln_st.json", [
  id("lime_kiln_st.id", "Steel plant lime kiln id", "ID известково-обжигательной печи"),
  q("lime_kiln_st.temp", "Cel", "Kiln temperature", "Температура печи"),
  q("lime_kiln_st.output", "t/h", "Lime output", "Выпуск извести"),
  q("lime_kiln_st.loi", "%", "LOI / residual CO2", "ППП / остаточный CO2", { range: { min: 0, max: 100 } }),
  q("lime_kiln_st.fuel", "m3/h", "Fuel rate", "Расход топлива"),
  q("lime_kiln_st.reactivity", "-", "Reactivity index", "Индекс реакционной способности"),
  logical("lime_kiln_st.spec.ok", "Quality OK", "Качество OK"),
  enu("lime_kiln_st.state", ["calcine", "idle", "maintain", "fault"], "Kiln state", "Состояние печи"),
]);

write("layer-b-desulf_hotmetal.json", [
  id("desulf_hotmetal.id", "Hot metal desulfurization id", "ID десульфурации чугуна"),
  id("desulf_hotmetal.heat.id", "Torpedo / ladle id", "ID миксера/ковша"),
  q("desulf_hotmetal.s.in", "ppm", "Sulfur in", "Сера на входе"),
  q("desulf_hotmetal.s.out", "ppm", "Sulfur out", "Сера на выходе"),
  q("desulf_hotmetal.reagent", "kg/t", "Reagent use", "Расход реагента"),
  q("desulf_hotmetal.temp", "Cel", "Hot metal temperature", "Температура чугуна"),
  logical("desulf_hotmetal.target", "S target met", "Цель по S достигнута"),
  enu("desulf_hotmetal.reagent_type", ["mg", "cao", "caf2", "mixed", "other"], "Reagent", "Реагент"),
]);

write("layer-b-electric_arc_sec.json", [
  id("electric_arc_sec.id", "Secondary EAF / ladle arc id", "ID вторичной дуги / ковшовой"),
  q("electric_arc_sec.power", "MW", "Arc power", "Мощность дуги"),
  q("electric_arc_sec.voltage", "V", "Arc voltage", "Напряжение дуги"),
  q("electric_arc_sec.current", "kA", "Current", "Ток"),
  q("electric_arc_sec.temp", "Cel", "Steel temperature", "Температура стали"),
  q("electric_arc_sec.foamy", "%", "Foamy slag index", "Индекс пенного шлака", { range: { min: 0, max: 100 } }),
  logical("electric_arc_sec.flicker", "Flicker high", "Высокий фликер"),
  enu("electric_arc_sec.state", ["arc", "idle", "tap", "fault"], "Arc state", "Состояние дуги"),
]);

console.log("Layer B26 seeds written");
