#!/usr/bin/env node
/**
 * Layer B34 — mining, mineral processing, aggregates, heavy construction.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B34", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-mine_shovel.json", [
  id("mine_shovel.id", "Mining shovel / excavator id", "ID карьерного экскаватора"),
  q("mine_shovel.payload", "t", "Bucket payload", "Масса в ковше"),
  q("mine_shovel.cycles", "/h", "Cycles per hour", "Циклов в час"),
  q("mine_shovel.fuel", "L/h", "Fuel rate", "Расход топлива"),
  q("mine_shovel.availability", "%", "Availability", "Готовность", { range: { min: 0, max: 100 } }),
  q("mine_shovel.dig", "kN", "Crowd / breakout force", "Усилие копания"),
  logical("mine_shovel.delay", "Loading delay", "Задержка погрузки"),
  enu("mine_shovel.type", ["rope", "hydraulic", "electric", "other"], "Type", "Тип"),
]);

write("layer-b-haul_truck.json", [
  id("haul_truck.id", "Haul truck id", "ID карьерного самосвала"),
  q("haul_truck.payload", "t", "Payload", "Полезная нагрузка"),
  q("haul_truck.speed", "km/h", "Travel speed", "Скорость"),
  q("haul_truck.fuel", "L/h", "Fuel rate", "Расход топлива"),
  q("haul_truck.cycle.min", "min", "Cycle time", "Время цикла"),
  q("haul_truck.tire", "kPa", "Tire pressure min", "Мин. давление шин"),
  logical("haul_truck.overload", "Overload", "Перегруз"),
  enu("haul_truck.state", ["load", "haul", "dump", "fault"], "Truck state", "Состояние самосвала"),
]);

write("layer-b-drill_rig_mn.json", [
  id("drill_rig_mn.id", "Blast-hole drill id", "ID бурового станка"),
  q("drill_rig_mn.depth", "m", "Hole depth", "Глубина скважины"),
  q("drill_rig_mn.rate", "m/h", "Penetration rate", "Скорость бурения"),
  q("drill_rig_mn.holes", "-", "Holes today", "Скважин за сутки", { encodings: ["i32"] }),
  q("drill_rig_mn.fuel", "L/h", "Fuel rate", "Расход топлива"),
  q("drill_rig_mn.angle", "deg", "Hole angle", "Угол скважины"),
  logical("drill_rig_mn.bit", "Bit change due", "Замена долота"),
  enu("drill_rig_mn.state", ["drill", "move", "idle", "fault"], "Rig state", "Состояние станка"),
]);

write("layer-b-crush_prim.json", [
  id("crush_prim.id", "Primary crusher id", "ID первичной дробилки"),
  q("crush_prim.feed", "t/h", "Feed rate", "Подача"),
  q("crush_prim.power", "kW", "Crusher power", "Мощность дробилки"),
  q("crush_prim.gap", "mm", "CSS / OSS", "Щель"),
  q("crush_prim.p80", "mm", "Product P80", "P80 продукта"),
  q("crush_prim.util", "%", "Utilization", "Загрузка", { range: { min: 0, max: 100 } }),
  logical("crush_prim.tramp", "Tramp metal", "Металл в руде"),
  enu("crush_prim.type", ["gyratory", "jaw", "impact", "other"], "Type", "Тип"),
]);

write("layer-b-sag_mill_mn.json", [
  id("sag_mill_mn.id", "SAG mill id", "ID SAG-мельницы"),
  q("sag_mill_mn.power", "MW", "Mill power", "Мощность мельницы"),
  q("sag_mill_mn.feed", "t/h", "Fresh feed", "Свежая подача"),
  q("sag_mill_mn.speed", "%", "Critical speed", "Критическая скорость", { range: { min: 0, max: 100 } }),
  q("sag_mill_mn.bearing", "kPa", "Bearing pressure", "Давление подшипника"),
  q("sag_mill_mn.sound", "dB", "Mill sound", "Звук мельницы"),
  logical("sag_mill_mn.overload", "Mill overload", "Перегруз мельницы"),
  enu("sag_mill_mn.state", ["grind", "idle", "maintain", "fault"], "Mill state", "Состояние мельницы"),
]);

write("layer-b-ball_mill_mn.json", [
  id("ball_mill_mn.id", "Ball mill id", "ID шаровой мельницы"),
  q("ball_mill_mn.power", "kW", "Mill power", "Мощность мельницы"),
  q("ball_mill_mn.feed", "t/h", "Feed rate", "Подача"),
  q("ball_mill_mn.density", "%", "Pulp density", "Плотность пульпы", { range: { min: 0, max: 100 } }),
  q("ball_mill_mn.p80", "um", "Product P80", "P80 продукта"),
  q("ball_mill_mn.charge", "%", "Ball charge", "Загрузка шаров", { range: { min: 0, max: 100 } }),
  logical("ball_mill_mn.liner", "Liner change due", "Замена футеровки"),
  enu("ball_mill_mn.state", ["grind", "idle", "maintain", "fault"], "Mill state", "Состояние мельницы"),
]);

write("layer-b-flot_cell.json", [
  id("flot_cell.id", "Flotation cell id", "ID флотационной камеры"),
  q("flot_cell.air", "Nm3/h", "Air rate", "Расход воздуха"),
  q("flot_cell.level", "%", "Froth / pulp level", "Уровень пены/пульпы", { range: { min: 0, max: 100 } }),
  q("flot_cell.recovery", "%", "Metal recovery", "Извлечение металла", { range: { min: 0, max: 100 } }),
  q("flot_cell.grade", "%", "Concentrate grade", "Содержание в концентрате", { range: { min: 0, max: 100 } }),
  q("flot_cell.reagent", "g/t", "Reagent dose", "Доза реагента"),
  logical("flot_cell.froth", "Froth collapse", "Схлопывание пены"),
  enu("flot_cell.duty", ["rougher", "cleaner", "scavenger", "other"], "Duty", "Назначение"),
]);

write("layer-b-thicken_mn.json", [
  id("thicken_mn.id", "Thickener id", "ID сгустителя"),
  q("thicken_mn.feed", "t/h", "Solids feed", "Подача твёрдого"),
  q("thicken_mn.uflow", "%", "Underflow density", "Плотность сгущенного", { range: { min: 0, max: 100 } }),
  q("thicken_mn.clarity", "NTU", "Overflow clarity", "Прозрачность слива"),
  q("thicken_mn.torque", "%", "Rake torque", "Момент граблин", { range: { min: 0, max: 100 } }),
  q("thicken_mn.floc", "g/t", "Flocculant dose", "Доза флокулянта"),
  logical("thicken_mn.bed", "Bed level high", "Высокий слой"),
  enu("thicken_mn.state", ["thicken", "idle", "maintain", "fault"], "Thickener state", "Состояние сгустителя"),
]);

write("layer-b-leach_heap.json", [
  id("leach_heap.id", "Heap leach pad id", "ID кучного выщелачивания"),
  q("leach_heap.irrigation", "L/m2/h", "Irrigation rate", "Норма орошения"),
  q("leach_heap.ph", "-", "Pregnant solution pH", "pH продуктивного раствора"),
  q("leach_heap.grade", "mg/L", "Pregnant solution grade", "Содержание в растворе"),
  q("leach_heap.flow", "m3/h", "PLS flow", "Расход ПР"),
  q("leach_heap.recovery", "%", "Pad recovery", "Извлечение с кучи", { range: { min: 0, max: 100 } }),
  logical("leach_heap.pond", "Pond overflow risk", "Риск переполнения пруда"),
  enu("leach_heap.state", ["irrigate", "rest", "rinse", "fault"], "Pad state", "Состояние кучи"),
]);

write("layer-b-cip_tank.json", [
  id("cip_tank.id", "CIP / CIL tank id", "ID чана CIP/CIL"),
  q("cip_tank.cyanide", "ppm", "Free cyanide", "Свободный цианид"),
  q("cip_tank.do", "mg/L", "Dissolved oxygen", "Растворённый кислород"),
  q("cip_tank.carbon", "g/L", "Carbon concentration", "Концентрация угля"),
  q("cip_tank.gold", "g/t", "Gold on carbon", "Золото на угле"),
  q("cip_tank.ph", "-", "pH", "pH"),
  logical("cip_tank.screen", "Screen OK", "Сито OK"),
  enu("cip_tank.duty", ["leach", "adsorb", "elute", "other"], "Duty", "Назначение"),
]);

write("layer-b-electrowin_mn.json", [
  id("electrowin_mn.id", "Electrowinning cell id", "ID электролизной ванны добычи"),
  q("electrowin_mn.current", "kA", "Cell current", "Ток ванны"),
  q("electrowin_mn.voltage", "V", "Cell voltage", "Напряжение ванны"),
  q("electrowin_mn.temp", "Cel", "Electrolyte temperature", "Температура электролита"),
  q("electrowin_mn.cathode", "t/d", "Cathode production", "Выпуск катодов"),
  q("electrowin_mn.ce", "%", "Current efficiency", "Выход по току", { range: { min: 0, max: 100 } }),
  logical("electrowin_mn.short", "Short circuit", "Короткое замыкание"),
  enu("electrowin_mn.metal", ["cu", "zn", "ni", "au", "other"], "Metal", "Металл"),
]);

write("layer-b-convey_long.json", [
  id("convey_long.id", "Overland conveyor id", "ID магистрального конвейера"),
  q("convey_long.rate", "t/h", "Throughput", "Производительность"),
  q("convey_long.speed", "m/s", "Belt speed", "Скорость ленты"),
  q("convey_long.power", "kW", "Drive power", "Мощность привода"),
  q("convey_long.tension", "kN", "Belt tension", "Натяжение ленты"),
  q("convey_long.temp", "Cel", "Drive temperature", "Температура привода"),
  logical("convey_long.rip", "Belt rip", "Порыв ленты"),
  enu("convey_long.state", ["run", "idle", "maintain", "fault"], "Conveyor state", "Состояние конвейера"),
]);

write("layer-b-stacker_mn.json", [
  id("stacker_mn.id", "Stockyard stacker id", "ID стакера склада"),
  q("stacker_mn.rate", "t/h", "Stacking rate", "Скорость укладки"),
  q("stacker_mn.boom", "m", "Boom length / reach", "Вылет стрелы"),
  q("stacker_mn.luff", "deg", "Luff angle", "Угол подъёма"),
  q("stacker_mn.slew", "deg", "Slew angle", "Угол поворота"),
  q("stacker_mn.power", "kW", "Machine power", "Мощность машины"),
  logical("stacker_mn.wind", "Wind trip", "Останов по ветру"),
  enu("stacker_mn.state", ["stack", "idle", "maintain", "fault"], "Stacker state", "Состояние стакера"),
]);

write("layer-b-reclaim_mn.json", [
  id("reclaim_mn.id", "Stockyard reclaimer id", "ID реклаймера склада"),
  q("reclaim_mn.rate", "t/h", "Reclaim rate", "Скорость забора"),
  q("reclaim_mn.wheel", "rpm", "Bucket-wheel speed", "Обороты ротора"),
  q("reclaim_mn.slew", "deg", "Slew angle", "Угол поворота"),
  q("reclaim_mn.power", "kW", "Machine power", "Мощность машины"),
  q("reclaim_mn.blend", "%", "Blend accuracy", "Точность смешения", { range: { min: 0, max: 100 } }),
  logical("reclaim_mn.jam", "Wheel jam", "Затор ротора"),
  enu("reclaim_mn.state", ["reclaim", "idle", "maintain", "fault"], "Reclaimer state", "Состояние реклаймера"),
]);

write("layer-b-tailings_dm.json", [
  id("tailings_dm.id", "Tailings dam / TSF id", "ID хвостохранилища"),
  q("tailings_dm.level", "m", "Pond water level", "Уровень прудка"),
  q("tailings_dm.freeboard", "m", "Freeboard", "Запас высоты"),
  q("tailings_dm.seepage", "L/s", "Seepage rate", "Фильтрация"),
  q("tailings_dm.piezo", "kPa", "Piezometer max", "Макс. пьезометр"),
  q("tailings_dm.rate", "t/h", "Tailings deposition", "Укладка хвостов"),
  logical("tailings_dm.alarm", "Dam integrity alarm", "Тревога целостности"),
  enu("tailings_dm.state", ["deposit", "decant", "maintain", "alarm"], "TSF state", "Состояние ХВХ"),
]);

write("layer-b-pasteback.json", [
  id("pasteback.id", "Paste backfill plant id", "ID завода закладочной пасты"),
  q("pasteback.output", "m3/h", "Paste output", "Выпуск пасты"),
  q("pasteback.slump", "mm", "Slump", "Осадка конуса"),
  q("pasteback.binder", "%", "Binder content", "Доля вяжущего", { range: { min: 0, max: 100 } }),
  q("pasteback.density", "t/m3", "Paste density", "Плотность пасты"),
  q("pasteback.pressure", "kPa", "Pipeline pressure", "Давление трубопровода"),
  logical("pasteback.plug", "Line plug risk", "Риск пробки"),
  enu("pasteback.state", ["mix", "pump", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-vent_shaft.json", [
  id("vent_shaft.id", "Mine ventilation shaft / fan id", "ID вентиляционного ствола/вентилятора"),
  q("vent_shaft.flow", "m3/s", "Airflow", "Расход воздуха"),
  q("vent_shaft.pressure", "Pa", "Fan pressure", "Напор вентилятора"),
  q("vent_shaft.power", "kW", "Fan power", "Мощность вентилятора"),
  q("vent_shaft.temp", "Cel", "Air temperature", "Температура воздуха"),
  q("vent_shaft.gas", "ppm", "CH4 / CO max", "Макс. CH4 / CO"),
  logical("vent_shaft.alarm", "Gas / airflow alarm", "Тревога газа/расхода"),
  enu("vent_shaft.duty", ["intake", "exhaust", "booster", "other"], "Duty", "Назначение"),
]);

write("layer-b-dewater_mn.json", [
  id("dewater_mn.id", "Mine dewatering pump station id", "ID станции водоотлива рудника"),
  q("dewater_mn.flow", "m3/h", "Pump flow", "Расход насосов"),
  q("dewater_mn.head", "m", "Total head", "Напор"),
  q("dewater_mn.level", "m", "Sumps level", "Уровень зумпфов"),
  q("dewater_mn.power", "kW", "Station power", "Мощность станции"),
  q("dewater_mn.pumps", "-", "Pumps running", "Насосов в работе", { encodings: ["i32"] }),
  logical("dewater_mn.flood", "Flood risk", "Риск затопления"),
  enu("dewater_mn.state", ["pump", "standby", "maintain", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-assay_lab_mn.json", [
  id("assay_lab_mn.id", "Mine assay lab id", "ID аналитической лаборатории рудника"),
  q("assay_lab_mn.samples", "-", "Samples in process", "Проб в работе", { encodings: ["i32"] }),
  q("assay_lab_mn.tat.h", "h", "Average TAT", "Средний TAT"),
  q("assay_lab_mn.backlog", "-", "Backlog samples", "Задел проб", { encodings: ["i32"] }),
  q("assay_lab_mn.qc", "%", "QC pass rate", "Прохождение ОК", { range: { min: 0, max: 100 } }),
  q("assay_lab_mn.fire", "-", "Fire assays today", "Пробирных анализов", { encodings: ["i32"] }),
  logical("assay_lab_mn.oos", "OOS result", "Результат вне нормы"),
  enu("assay_lab_mn.state", ["prep", "assay", "report", "idle"], "Lab state", "Состояние лаборатории"),
]);

write("layer-b-grade_ctrl.json", [
  id("grade_ctrl.id", "Grade control system id", "ID системы управления качеством руды"),
  q("grade_ctrl.blocks", "-", "Blocks modeled today", "Блоков за сутки", { encodings: ["i32"] }),
  q("grade_ctrl.grade", "%", "Predicted head grade", "Прогноз содержания", { range: { min: 0, max: 100 } }),
  q("grade_ctrl.ore", "t", "Ore flagged", "Руда отмечена"),
  q("grade_ctrl.waste", "t", "Waste flagged", "Вскрыша отмечена"),
  q("grade_ctrl.accuracy", "%", "Prediction accuracy", "Точность прогноза", { range: { min: 0, max: 100 } }),
  logical("grade_ctrl.misclass", "Misclassification high", "Высокая ошибка классификации"),
  enu("grade_ctrl.state", ["model", "flag", "reconcile", "idle"], "System state", "Состояние системы"),
]);

write("layer-b-hpgr_mill.json", [
  id("hpgr_mill.id", "HPGR mill id", "ID валковой дробилки высокого давления"),
  q("hpgr_mill.feed", "t/h", "Feed rate", "Подача"),
  q("hpgr_mill.force", "N/mm", "Specific grinding force", "Удельное усилие"),
  q("hpgr_mill.gap", "mm", "Working gap", "Рабочий зазор"),
  q("hpgr_mill.power", "kW", "Roll power", "Мощность валков"),
  q("hpgr_mill.p80", "mm", "Product P80", "P80 продукта"),
  logical("hpgr_mill.skew", "Roll skew", "Перекос валков"),
  enu("hpgr_mill.state", ["crush", "idle", "maintain", "fault"], "HPGR state", "Состояние HPGR"),
]);

write("layer-b-skip_hoist.json", [
  id("skip_hoist.id", "Mine skip hoist id", "ID скиповой подъёмной машины"),
  q("skip_hoist.payload", "t", "Skip payload", "Полезная нагрузка скипа"),
  q("skip_hoist.trips", "/h", "Trips per hour", "Рейсов в час"),
  q("skip_hoist.speed", "m/s", "Rope speed", "Скорость каната"),
  q("skip_hoist.depth", "m", "Shaft depth", "Глубина ствола"),
  q("skip_hoist.power", "kW", "Hoist power", "Мощность подъёма"),
  logical("skip_hoist.overwind", "Overwind protection", "Защита от переподъёма"),
  enu("skip_hoist.state", ["hoist", "idle", "maintain", "fault"], "Hoist state", "Состояние подъёма"),
]);

write("layer-b-lhd_loader.json", [
  id("lhd_loader.id", "LHD / scooptram id", "ID ПДМ / LHD"),
  q("lhd_loader.payload", "t", "Bucket payload", "Масса в ковше"),
  q("lhd_loader.cycles", "/h", "Cycles per hour", "Циклов в час"),
  q("lhd_loader.fuel", "L/h", "Fuel / energy rate", "Расход топлива/энергии"),
  q("lhd_loader.distance", "km", "Tramming distance today", "Пробег за сутки"),
  q("lhd_loader.availability", "%", "Availability", "Готовность", { range: { min: 0, max: 100 } }),
  logical("lhd_loader.autonomous", "Autonomous mode", "Автономный режим"),
  enu("lhd_loader.state", ["muck", "tram", "dump", "fault"], "LHD state", "Состояние ПДМ"),
]);

write("layer-b-blast_mn.json", [
  id("blast_mn.id", "Blast pattern id", "ID блока взрывных работ"),
  q("blast_mn.holes", "-", "Holes charged", "Заряженных скважин", { encodings: ["i32"] }),
  q("blast_mn.explosive", "t", "Explosive mass", "Масса ВВ"),
  q("blast_mn.powder", "kg/m3", "Powder factor", "Удельный расход ВВ"),
  q("blast_mn.vibration", "mm/s", "PPV max", "Макс. скорость колебаний"),
  q("blast_mn.airblast", "dB", "Airblast", "Воздушная волна"),
  logical("blast_mn.clear", "Blast clearance OK", "Оцепление OK"),
  enu("blast_mn.state", ["drill", "charge", "fire", "muck"], "Blast state", "Состояние блока"),
]);

write("layer-b-stockpile.json", [
  id("stockpile.pile.id", "Ore stockpile id", "ID рудного склада"),
  q("stockpile.inventory", "t", "Inventory", "Запас"),
  q("stockpile.grade", "%", "Average grade", "Среднее содержание", { range: { min: 0, max: 100 } }),
  q("stockpile.in", "t/h", "Stacking rate", "Скорость укладки"),
  q("stockpile.out", "t/h", "Reclaim rate", "Скорость забора"),
  q("stockpile.moisture", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  logical("stockpile.segregation", "Segregation risk", "Риск сегрегации"),
  enu("stockpile.type", ["rom", "crushed", "concentrate", "other"], "Type", "Тип"),
]);

write("layer-b-asphalt_plt.json", [
  id("asphalt_plt.id", "Asphalt plant id", "ID асфальтобетонного завода"),
  q("asphalt_plt.output", "t/h", "Mix output", "Выпуск смеси"),
  q("asphalt_plt.temp", "Cel", "Mix temperature", "Температура смеси"),
  q("asphalt_plt.bitumen", "%", "Bitumen content", "Доля битума", { range: { min: 0, max: 100 } }),
  q("asphalt_plt.agg", "t/h", "Aggregate feed", "Подача щебня"),
  q("asphalt_plt.energy", "MJ/t", "Specific energy", "Удельная энергия"),
  logical("asphalt_plt.spec.ok", "Mix spec OK", "Спецификация смеси OK"),
  enu("asphalt_plt.type", ["batch", "drum", "warm", "other"], "Type", "Тип"),
]);

write("layer-b-conc_batch.json", [
  id("conc_batch.id", "Concrete batch plant id", "ID бетонного завода"),
  q("conc_batch.output", "m3/h", "Concrete output", "Выпуск бетона"),
  q("conc_batch.slump", "mm", "Slump", "Осадка конуса"),
  q("conc_batch.cement", "kg/m3", "Cement content", "Расход цемента"),
  q("conc_batch.water", "L/m3", "Water content", "Расход воды"),
  q("conc_batch.temp", "Cel", "Mix temperature", "Температура смеси"),
  logical("conc_batch.spec.ok", "Mix design OK", "Состав OK"),
  enu("conc_batch.state", ["batch", "wash", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-crush_agg.json", [
  id("crush_agg.id", "Aggregate crushing plant id", "ID дробильно-сортировочного завода"),
  q("crush_agg.feed", "t/h", "Feed rate", "Подача"),
  q("crush_agg.output", "t/h", "Product output", "Выпуск продукции"),
  q("crush_agg.fines", "%", "Fines fraction", "Доля мелочи", { range: { min: 0, max: 100 } }),
  q("crush_agg.power", "kW", "Plant power", "Мощность завода"),
  q("crush_agg.stock", "t", "Product stockpile", "Склад продукции"),
  logical("crush_agg.jam", "Crusher jam", "Затор дробилки"),
  enu("crush_agg.state", ["crush", "screen", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-ready_mix.json", [
  id("ready_mix.truck.id", "Ready-mix truck id", "ID автобетоносмесителя"),
  q("ready_mix.volume", "m3", "Drum load", "Загрузка барабана"),
  q("ready_mix.slump", "mm", "Slump at site", "Осадка на объекте"),
  q("ready_mix.temp", "Cel", "Concrete temperature", "Температура бетона"),
  q("ready_mix.revs", "-", "Drum revolutions", "Оборотов барабана", { encodings: ["i32"] }),
  q("ready_mix.eta.min", "min", "ETA to site", "ETA на объект"),
  logical("ready_mix.rejected", "Load rejected", "Загрузка отклонена"),
  enu("ready_mix.state", ["load", "transit", "pour", "wash"], "Truck state", "Состояние машины"),
]);

write("layer-b-precast_pl.json", [
  id("precast_pl.id", "Precast concrete plant id", "ID завода ЖБИ"),
  q("precast_pl.pours", "-", "Pours today", "Заливок за сутки", { encodings: ["i32"] }),
  q("precast_pl.strength", "MPa", "28-day strength proxy", "Прочность (прокси)"),
  q("precast_pl.cure", "Cel", "Curing temperature", "Температура твердения"),
  q("precast_pl.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("precast_pl.output", "m3/d", "Daily volume", "Суточный объём"),
  logical("precast_pl.spec.ok", "Dimension OK", "Размер OK"),
  enu("precast_pl.state", ["form", "pour", "cure", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-hot_mix.json", [
  id("hot_mix.silo.id", "Hot-mix silo id", "ID бункера горячей смеси"),
  q("hot_mix.level", "%", "Silo level", "Уровень бункера", { range: { min: 0, max: 100 } }),
  q("hot_mix.temp", "Cel", "Mix temperature", "Температура смеси"),
  q("hot_mix.loadout", "t/h", "Loadout rate", "Скорость отгрузки"),
  q("hot_mix.trucks", "-", "Trucks loaded today", "Машин загружено", { encodings: ["i32"] }),
  q("hot_mix.age.min", "min", "Mix age in silo", "Возраст смеси в бункере"),
  logical("hot_mix.cold", "Temperature low", "Низкая температура"),
  enu("hot_mix.state", ["store", "loadout", "empty", "fault"], "Silo state", "Состояние бункера"),
]);

write("layer-b-batch_plant.json", [
  id("batch_plant.id", "Mobile batch plant id", "ID мобильного бетонного узла"),
  q("batch_plant.output", "m3/h", "Output", "Производительность"),
  q("batch_plant.cement", "t", "Cement inventory", "Запас цемента"),
  q("batch_plant.agg", "t", "Aggregate inventory", "Запас заполнителей"),
  q("batch_plant.water", "m3", "Water inventory", "Запас воды"),
  q("batch_plant.power", "kW", "Plant power", "Мощность узла"),
  logical("batch_plant.low", "Material low", "Мало материала"),
  enu("batch_plant.state", ["batch", "idle", "move", "fault"], "Plant state", "Состояние узла"),
]);

write("layer-b-tunnel_tbm.json", [
  id("tunnel_tbm.id", "Tunnel boring machine id", "ID ТПМК / ТБМ"),
  q("tunnel_tbm.advance", "mm/min", "Advance rate", "Скорость проходки"),
  q("tunnel_tbm.thrust", "MN", "Total thrust", "Суммарный распор"),
  q("tunnel_tbm.torque", "MNm", "Cutterhead torque", "Момент ротора"),
  q("tunnel_tbm.pressure", "kPa", "Face pressure", "Давление забоя"),
  q("tunnel_tbm.rings", "-", "Rings erected today", "Колец за сутки", { encodings: ["i32"] }),
  logical("tunnel_tbm.settle", "Settlement alarm", "Тревога осадки"),
  enu("tunnel_tbm.type", ["epb", "slurry", "hard_rock", "other"], "Type", "Тип"),
]);

write("layer-b-pile_drive.json", [
  id("pile_drive.id", "Pile driver id", "ID сваебойной установки"),
  q("pile_drive.energy", "kJ", "Blow energy", "Энергия удара"),
  q("pile_drive.depth", "m", "Embedment depth", "Глубина погружения"),
  q("pile_drive.blows", "-", "Blows per pile", "Ударов на сваю", { encodings: ["i32"] }),
  q("pile_drive.piles", "-", "Piles today", "Свай за сутки", { encodings: ["i32"] }),
  q("pile_drive.vib", "mm/s", "Ground vibration", "Вибрация грунта"),
  logical("pile_drive.refusal", "Refusal reached", "Отказ достигнут"),
  enu("pile_drive.type", ["diesel", "hydraulic", "vibro", "other"], "Type", "Тип"),
]);

write("layer-b-crane_twr.json", [
  id("crane_twr.id", "Tower crane id", "ID башенного крана"),
  q("crane_twr.load", "t", "Hook load", "Масса на крюке"),
  q("crane_twr.radius", "m", "Working radius", "Вылет"),
  q("crane_twr.height", "m", "Hook height", "Высота крюка"),
  q("crane_twr.wind", "m/s", "Wind speed", "Скорость ветра"),
  q("crane_twr.cycles", "-", "Lifts today", "Подъёмов за сутки", { encodings: ["i32"] }),
  logical("crane_twr.overload", "Load moment trip", "Срабатывание по моменту"),
  enu("crane_twr.state", ["lift", "idle", "climb", "fault"], "Crane state", "Состояние крана"),
]);

write("layer-b-scaffold_mn.json", [
  id("scaffold_mn.id", "Scaffold zone id", "ID зоны лесов"),
  q("scaffold_mn.area", "m2", "Scaffold area", "Площадь лесов"),
  q("scaffold_mn.height", "m", "Max height", "Макс. высота"),
  q("scaffold_mn.load", "kg/m2", "Design load", "Расчётная нагрузка"),
  q("scaffold_mn.inspections", "-", "Inspections due", "Проверок к сроку", { encodings: ["i32"] }),
  q("scaffold_mn.tags", "-", "Open tags", "Открытых бирок", { encodings: ["i32"] }),
  logical("scaffold_mn.safe", "Tagged safe to use", "Допуск к работе"),
  enu("scaffold_mn.state", ["erect", "use", "alter", "dismantle"], "Scaffold state", "Состояние лесов"),
]);

write("layer-b-form_work.json", [
  id("form_work.id", "Formwork system id", "ID опалубочной системы"),
  q("form_work.area", "m2", "Formed area today", "Площадь опалубки за сутки"),
  q("form_work.pressure", "kPa", "Fresh concrete pressure", "Давление свежего бетона"),
  q("form_work.cycle.d", "d", "Form cycle days", "Цикл опалубки в днях"),
  q("form_work.reuse", "-", "Reuse count", "Число оборачиваний", { encodings: ["i32"] }),
  q("form_work.deflection", "mm", "Max deflection", "Макс. прогиб"),
  logical("form_work.ready", "Ready for pour", "Готово к бетонированию"),
  enu("form_work.type", ["wall", "slab", "column", "climb", "other"], "Type", "Тип"),
]);

write("layer-b-rebar_cut.json", [
  id("rebar_cut.id", "Rebar cutting / bending yard id", "ID арматурного двора"),
  q("rebar_cut.tonnage", "t", "Steel processed today", "Металла за сутки"),
  q("rebar_cut.bars", "-", "Bars cut", "Прутьев нарезано", { encodings: ["i32"] }),
  q("rebar_cut.scrap", "%", "Scrap rate", "Брак / обрезь", { range: { min: 0, max: 100 } }),
  q("rebar_cut.bends", "-", "Bends today", "Гибов за сутки", { encodings: ["i32"] }),
  q("rebar_cut.orders", "-", "Open orders", "Открытых заказов", { encodings: ["i32"] }),
  logical("rebar_cut.tag", "Bundle tagged", "Пачка промаркирована"),
  enu("rebar_cut.state", ["cut", "bend", "idle", "fault"], "Yard state", "Состояние двора"),
]);

write("layer-b-weld_site.json", [
  id("weld_site.id", "Construction welding station id", "ID сварочного поста на стройке"),
  q("weld_site.meters", "m", "Weld length today", "Метров шва за сутки"),
  q("weld_site.ndt", "%", "NDT pass rate", "Прохождение НК", { range: { min: 0, max: 100 } }),
  q("weld_site.gas", "L", "Shielding gas used", "Расход защитного газа"),
  q("weld_site.wire", "kg", "Wire / electrode used", "Расход проволоки/электродов"),
  q("weld_site.repairs", "-", "Repairs today", "Ремонтов за сутки", { encodings: ["i32"] }),
  logical("weld_site.qualify", "Welder qualified", "Сварщик аттестован"),
  enu("weld_site.process", ["smaw", "gmaw", "gtaw", "other"], "Process", "Процесс"),
]);

write("layer-b-paint_site.json", [
  id("paint_site.id", "Site coating / paint crew id", "ID бригады окраски на объекте"),
  q("paint_site.area", "m2", "Area coated today", "Площадь за сутки"),
  q("paint_site.dft", "um", "Dry film thickness", "Толщина сухой плёнки"),
  q("paint_site.temp", "Cel", "Surface temperature", "Температура поверхности"),
  q("paint_site.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("paint_site.voc", "g/L", "VOC of coating", "ЛОС покрытия"),
  logical("paint_site.spec.ok", "DFT / adhesion OK", "ТСП / адгезия OK"),
  enu("paint_site.state", ["prep", "coat", "cure", "inspect"], "Crew state", "Состояние бригады"),
]);

write("layer-b-paver_road.json", [
  id("paver_road.id", "Asphalt paver id", "ID асфальтоукладчика"),
  q("paver_road.speed", "m/min", "Paving speed", "Скорость укладки"),
  q("paver_road.width", "m", "Paving width", "Ширина укладки"),
  q("paver_road.temp", "Cel", "Mat temperature", "Температура слоя"),
  q("paver_road.tonnage", "t", "Mix laid today", "Смеси за сутки"),
  q("paver_road.thickness", "mm", "Mat thickness", "Толщина слоя"),
  logical("paver_road.segregation", "Segregation", "Сегрегация"),
  enu("paver_road.state", ["pave", "idle", "maintain", "fault"], "Paver state", "Состояние укладчика"),
]);

write("layer-b-roller_cmp.json", [
  id("roller_cmp.id", "Compaction roller id", "ID катка уплотнения"),
  q("roller_cmp.passes", "-", "Passes", "Проходов", { encodings: ["i32"] }),
  q("roller_cmp.amplitude", "mm", "Vibration amplitude", "Амплитуда вибрации"),
  q("roller_cmp.frequency", "Hz", "Vibration frequency", "Частота вибрации"),
  q("roller_cmp.density", "%", "Compaction %", "Степень уплотнения", { range: { min: 0, max: 100 } }),
  q("roller_cmp.speed", "km/h", "Travel speed", "Скорость"),
  logical("roller_cmp.target", "Target density reached", "Целевая плотность"),
  enu("roller_cmp.type", ["smooth", "padfoot", "pneumatic", "other"], "Type", "Тип"),
]);

write("layer-b-grader_rd.json", [
  id("grader_rd.id", "Motor grader id", "ID автогрейдера"),
  q("grader_rd.blade", "deg", "Blade angle", "Угол отвала"),
  q("grader_rd.speed", "km/h", "Travel speed", "Скорость"),
  q("grader_rd.grade", "%", "Cross-slope", "Поперечный уклон", { range: { min: -20, max: 20 } }),
  q("grader_rd.fuel", "L/h", "Fuel rate", "Расход топлива"),
  q("grader_rd.distance", "km", "Distance today", "Пробег за сутки"),
  logical("grader_rd.gps", "GPS grade control", "GPS-нивелирование"),
  enu("grader_rd.state", ["grade", "idle", "maintain", "fault"], "Grader state", "Состояние грейдера"),
]);

write("layer-b-excav_site.json", [
  id("excav_site.id", "Site excavator id", "ID экскаватора на объекте"),
  q("excav_site.cycles", "/h", "Cycles per hour", "Циклов в час"),
  q("excav_site.payload", "t", "Bucket payload", "Масса в ковше"),
  q("excav_site.fuel", "L/h", "Fuel rate", "Расход топлива"),
  q("excav_site.depth", "m", "Dig depth", "Глубина копания"),
  q("excav_site.hours", "h", "Engine hours today", "Моточасов за сутки"),
  logical("excav_site.utility", "Utility strike risk", "Риск повреждения коммуникаций"),
  enu("excav_site.state", ["dig", "load", "idle", "fault"], "Excavator state", "Состояние экскаватора"),
]);

write("layer-b-bulldozer.json", [
  id("bulldozer.id", "Bulldozer id", "ID бульдозера"),
  q("bulldozer.blade", "m3", "Blade load proxy", "Нагрузка отвала"),
  q("bulldozer.speed", "km/h", "Travel speed", "Скорость"),
  q("bulldozer.fuel", "L/h", "Fuel rate", "Расход топлива"),
  q("bulldozer.track", "%", "Track slip", "Пробуксовка гусениц", { range: { min: 0, max: 100 } }),
  q("bulldozer.hours", "h", "Engine hours today", "Моточасов за сутки"),
  logical("bulldozer.ripper", "Ripper engaged", "Рыхлитель в работе"),
  enu("bulldozer.state", ["push", "rip", "idle", "fault"], "Dozer state", "Состояние бульдозера"),
]);

write("layer-b-loader_whl.json", [
  id("loader_whl.id", "Wheel loader id", "ID фронтального погрузчика"),
  q("loader_whl.payload", "t", "Bucket payload", "Масса в ковше"),
  q("loader_whl.cycles", "/h", "Cycles per hour", "Циклов в час"),
  q("loader_whl.fuel", "L/h", "Fuel rate", "Расход топлива"),
  q("loader_whl.tire", "kPa", "Tire pressure min", "Мин. давление шин"),
  q("loader_whl.hours", "h", "Engine hours today", "Моточасов за сутки"),
  logical("loader_whl.overload", "Overload", "Перегруз"),
  enu("loader_whl.state", ["load", "carry", "dump", "fault"], "Loader state", "Состояние погрузчика"),
]);

write("layer-b-compactor.json", [
  id("compactor.id", "Soil / landfill compactor id", "ID грунтового / полигонного уплотнения"),
  q("compactor.n.passes", "-", "Passes", "Проходов", { encodings: ["i32"] }),
  q("compactor.density", "%", "Compaction %", "Степень уплотнения", { range: { min: 0, max: 100 } }),
  q("compactor.moisture", "%", "Soil moisture", "Влажность грунта", { range: { min: 0, max: 100 } }),
  q("compactor.speed", "km/h", "Travel speed", "Скорость"),
  q("compactor.fuel", "L/h", "Fuel rate", "Расход топлива"),
  logical("compactor.target", "Target density", "Целевая плотность"),
  enu("compactor.type", ["soil", "landfill", "vibratory", "other"], "Type", "Тип"),
]);

write("layer-b-pump_conc.json", [
  id("pump_conc.id", "Concrete pump id", "ID бетононасоса"),
  q("pump_conc.rate", "m3/h", "Pump rate", "Производительность"),
  q("pump_conc.pressure", "kPa", "Line pressure", "Давление в линии"),
  q("pump_conc.boom", "m", "Boom reach", "Вылет стрелы"),
  q("pump_conc.volume", "m3", "Pumped today", "Прокачано за сутки"),
  q("pump_conc.strokes", "-", "Strokes today", "Ходов за сутки", { encodings: ["i32"] }),
  logical("pump_conc.block", "Line blockage", "Засор линии"),
  enu("pump_conc.type", ["boom", "line", "trailer", "other"], "Type", "Тип"),
]);

write("layer-b-shot_crete.json", [
  id("shot_crete.id", "Shotcrete / sprayed concrete unit id", "ID установки торкретбетона"),
  q("shot_crete.rate", "m3/h", "Spray rate", "Скорость набрызга"),
  q("shot_crete.rebound", "%", "Rebound", "Отскок", { range: { min: 0, max: 100 } }),
  q("shot_crete.thickness", "mm", "Layer thickness", "Толщина слоя"),
  q("shot_crete.accel", "kg/m3", "Accelerator dose", "Доза ускорителя"),
  q("shot_crete.air", "m3/min", "Air consumption", "Расход воздуха"),
  logical("shot_crete.dust", "Dust high", "Много пыли"),
  enu("shot_crete.type", ["wet", "dry", "robot", "other"], "Type", "Тип"),
]);

write("layer-b-grout_plnt.json", [
  id("grout_plnt.id", "Grout plant id", "ID инъекционного узла"),
  q("grout_plnt.flow", "L/min", "Grout flow", "Расход раствора"),
  q("grout_plnt.pressure", "kPa", "Injection pressure", "Давление нагнетания"),
  q("grout_plnt.volume", "L", "Volume injected today", "Объём за сутки"),
  q("grout_plnt.density", "kg/L", "Grout density", "Плотность раствора"),
  q("grout_plnt.holes", "-", "Holes treated", "Обработанных скважин", { encodings: ["i32"] }),
  logical("grout_plnt.refuse", "Refusal pressure", "Давление отказа"),
  enu("grout_plnt.state", ["mix", "inject", "idle", "fault"], "Plant state", "Состояние узла"),
]);

write("layer-b-geotech_mon.json", [
  id("geotech_mon.id", "Geotechnical monitoring point id", "ID точки геотехнического мониторинга"),
  q("geotech_mon.settle", "mm", "Settlement", "Осадка"),
  q("geotech_mon.incline", "mm", "Inclinometer deflection", "Отклонение инклинометра"),
  q("geotech_mon.pore", "kPa", "Pore pressure", "Поровое давление"),
  q("geotech_mon.crack", "mm", "Crack width", "Ширина трещины"),
  q("geotech_mon.rate", "mm/d", "Settlement rate", "Скорость осадки"),
  logical("geotech_mon.alarm", "Threshold exceed", "Превышение порога"),
  enu("geotech_mon.type", ["settle", "inclino", "piezo", "crack", "other"], "Type", "Тип"),
]);

write("layer-b-vib_mon.json", [
  id("vib_mon.id", "Construction vibration monitor id", "ID монитора вибрации на стройке"),
  q("vib_mon.ppv", "mm/s", "Peak particle velocity", "Пиковая скорость частиц"),
  q("vib_mon.freq", "Hz", "Dominant frequency", "Доминирующая частота"),
  q("vib_mon.events", "-", "Events today", "Событий за сутки", { encodings: ["i32"] }),
  q("vib_mon.limit", "mm/s", "PPV limit", "Лимит PPV"),
  q("vib_mon.distance", "m", "Distance to source", "Расстояние до источника"),
  logical("vib_mon.exceed", "Limit exceeded", "Лимит превышен"),
  enu("vib_mon.state", ["monitor", "alarm", "offline"], "Monitor state", "Состояние монитора"),
]);

write("layer-b-dust_mon.json", [
  id("dust_mon.id", "Site dust monitor id", "ID монитора пыли на объекте"),
  q("dust_mon.pm10", "ug/m3", "PM10", "PM10"),
  q("dust_mon.pm25", "ug/m3", "PM2.5", "PM2.5"),
  q("dust_mon.wind", "m/s", "Wind speed", "Скорость ветра"),
  q("dust_mon.dir", "deg", "Wind direction", "Направление ветра"),
  q("dust_mon.excursions", "-", "Excursions today", "Превышений за сутки", { encodings: ["i32"] }),
  logical("dust_mon.alarm", "Dust alarm", "Тревога пыли"),
  enu("dust_mon.state", ["monitor", "alarm", "offline"], "Monitor state", "Состояние монитора"),
]);

write("layer-b-noise_mon.json", [
  id("noise_mon.id", "Site noise monitor id", "ID монитора шума на объекте"),
  q("noise_mon.leq", "dB", "Leq", "Leq"),
  q("noise_mon.lmax", "dB", "Lmax", "Lmax"),
  q("noise_mon.events", "-", "Exceedances today", "Превышений за сутки", { encodings: ["i32"] }),
  q("noise_mon.limit", "dB", "Permit limit", "Лимит разрешения"),
  q("noise_mon.period.h", "h", "Monitoring period", "Период мониторинга"),
  logical("noise_mon.alarm", "Noise alarm", "Тревога шума"),
  enu("noise_mon.state", ["monitor", "alarm", "offline"], "Monitor state", "Состояние монитора"),
]);

write("layer-b-dewater_site.json", [
  id("dewater_site.id", "Construction dewatering system id", "ID системы водопонижения"),
  q("dewater_site.flow", "m3/h", "Discharge flow", "Расход сброса"),
  q("dewater_site.level", "m", "Groundwater level", "Уровень грунтовых вод"),
  q("dewater_site.pumps", "-", "Pumps running", "Насосов в работе", { encodings: ["i32"] }),
  q("dewater_site.turbidity", "NTU", "Discharge turbidity", "Мутность сброса"),
  q("dewater_site.power", "kW", "System power", "Мощность системы"),
  logical("dewater_site.permit", "Discharge permit OK", "Разрешение на сброс OK"),
  enu("dewater_site.state", ["pump", "treat", "idle", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-genset_site.json", [
  id("genset_site.id", "Site generator set id", "ID дизель-генератора на объекте"),
  q("genset_site.power", "kW", "Output power", "Выходная мощность"),
  q("genset_site.load", "%", "Load", "Загрузка", { range: { min: 0, max: 100 } }),
  q("genset_site.fuel", "%", "Fuel level", "Уровень топлива", { range: { min: 0, max: 100 } }),
  q("genset_site.runtime.h", "h", "Runtime today", "Наработка за сутки"),
  q("genset_site.temp", "Cel", "Coolant temperature", "Температура ОЖ"),
  logical("genset_site.ready", "Auto-start ready", "Автозапуск готов"),
  enu("genset_site.state", ["run", "standby", "test", "fault"], "Genset state", "Состояние ДГУ"),
]);

write("layer-b-site_water.json", [
  id("site_water.id", "Construction site water system id", "ID системы водоснабжения стройки"),
  q("site_water.flow", "m3/h", "Supply flow", "Расход подачи"),
  q("site_water.pressure", "kPa", "Supply pressure", "Давление подачи"),
  q("site_water.tank", "%", "Tank level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("site_water.quality", "NTU", "Turbidity / quality", "Мутность / качество"),
  q("site_water.use", "m3", "Use today", "Расход за сутки"),
  logical("site_water.low", "Pressure / level low", "Низкое давление/уровень"),
  enu("site_water.state", ["supply", "store", "idle", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-waste_site.json", [
  id("waste_site.id", "Construction waste yard id", "ID площадки строительных отходов"),
  q("waste_site.volume", "m3", "Waste staged", "Отходов на площадке"),
  q("waste_site.divert", "%", "Diversion rate", "Доля переработки", { range: { min: 0, max: 100 } }),
  q("waste_site.hauls", "-", "Hauls today", "Вывозов за сутки", { encodings: ["i32"] }),
  q("waste_site.hazard", "t", "Hazardous staged", "Опасных отходов"),
  q("waste_site.recycle", "t", "Recycled today", "Переработано за сутки"),
  logical("waste_site.permit", "Storage within permit", "Хранение в лимите"),
  enu("waste_site.state", ["receive", "sort", "haul", "idle"], "Yard state", "Состояние площадки"),
]);

write("layer-b-safety_gate.json", [
  id("safety_gate.id", "Site access / safety gate id", "ID КПП / ворот стройплощадки"),
  q("safety_gate.entries", "-", "Entries today", "Входов за сутки", { encodings: ["i32"] }),
  q("safety_gate.exits", "-", "Exits today", "Выходов за сутки", { encodings: ["i32"] }),
  q("safety_gate.inductions", "-", "Inductions today", "Инструктажей за сутки", { encodings: ["i32"] }),
  q("safety_gate.vehicles", "-", "Vehicles on site", "Техники на площадке", { encodings: ["i32"] }),
  q("safety_gate.denied", "-", "Access denied", "Отказов в доступе", { encodings: ["i32"] }),
  logical("safety_gate.open", "Gate open for traffic", "Ворота открыты"),
  enu("safety_gate.state", ["open", "secure", "evacuate", "fault"], "Gate state", "Состояние КПП"),
]);

write("layer-b-survey_gps.json", [
  id("survey_gps.id", "Site survey / GNSS rover id", "ID геодезического GNSS-ровера"),
  q("survey_gps.points", "-", "Points collected today", "Точек за сутки", { encodings: ["i32"] }),
  q("survey_gps.hdop", "-", "HDOP", "HDOP"),
  q("survey_gps.accuracy", "mm", "Horizontal accuracy", "Горизонтальная точность"),
  q("survey_gps.base", "km", "Distance to base", "Расстояние до базы"),
  q("survey_gps.battery", "%", "Battery", "Батарея", { range: { min: 0, max: 100 } }),
  logical("survey_gps.fix", "Fixed RTK solution", "Фиксированное RTK"),
  enu("survey_gps.state", ["survey", "stakeout", "idle", "fault"], "Rover state", "Состояние ровера"),
]);

console.log("Layer B34 seeds written");
