#!/usr/bin/env node
/**
 * Layer B33 — automotive OEM, EV powertrain, components, depots.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B33", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-stamp_press.json", [
  id("stamp_press.id", "Stamping press id", "ID штамповочного пресса"),
  q("stamp_press.force", "kN", "Press force", "Усилие пресса"),
  q("stamp_press.spm", "/min", "Strokes per minute", "Ходов в минуту"),
  q("stamp_press.parts", "-", "Parts per hour", "Деталей в час", { encodings: ["i32"] }),
  q("stamp_press.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  q("stamp_press.die", "-", "Die changes today", "Смен штампа", { encodings: ["i32"] }),
  logical("stamp_press.jam", "Blank jam", "Затор заготовки"),
  enu("stamp_press.type", ["tandem", "transfer", "servo", "other"], "Type", "Тип"),
]);

write("layer-b-weld_robot.json", [
  id("weld_robot.id", "Body weld robot id", "ID сварочного робота кузова"),
  q("weld_robot.spots", "/h", "Spot welds per hour", "Точек в час"),
  q("weld_robot.current", "kA", "Weld current", "Ток сварки"),
  q("weld_robot.uptime", "%", "Robot uptime", "Готовность робота", { range: { min: 0, max: 100 } }),
  q("weld_robot.tip", "-", "Tip dresses today", "Зачисток электродов", { encodings: ["i32"] }),
  q("weld_robot.quality", "%", "Nugget pass rate", "Прохождение ядра", { range: { min: 0, max: 100 } }),
  logical("weld_robot.gun", "Gun fault", "Отказ клещей"),
  enu("weld_robot.process", ["spot", "mig", "laser", "other"], "Process", "Процесс"),
]);

write("layer-b-paint_booth_au.json", [
  id("paint_booth_au.id", "Automotive paint booth id", "ID окрасочной камеры авто"),
  q("paint_booth_au.temp", "Cel", "Booth temperature", "Температура камеры"),
  q("paint_booth_au.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("paint_booth_au.air", "m3/h", "Supply air", "Приток воздуха"),
  q("paint_booth_au.voc", "mg/m3", "VOC", "ЛОС"),
  q("paint_booth_au.bodies", "/h", "Bodies per hour", "Кузовов в час"),
  logical("paint_booth_au.dirt", "Dirt defect high", "Много грязи"),
  enu("paint_booth_au.stage", ["ecoat", "primer", "base", "clear", "other"], "Stage", "Стадия"),
]);

write("layer-b-final_assy.json", [
  id("final_assy.line.id", "Final assembly line id", "ID линии окончательной сборки"),
  q("final_assy.jph", "/h", "Jobs per hour", "Автомобилей в час"),
  q("final_assy.ftt", "%", "First-time-through", "С первого раза", { range: { min: 0, max: 100 } }),
  q("final_assy.andons", "-", "Andons today", "Андонов за сутки", { encodings: ["i32"] }),
  q("final_assy.wip", "-", "Vehicles on line", "Авто на линии", { encodings: ["i32"] }),
  q("final_assy.tact.s", "s", "Takt time", "Такт"),
  logical("final_assy.stop", "Line stop", "Останов линии"),
  enu("final_assy.state", ["run", "changeover", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-eol_test_au.json", [
  id("eol_test_au.bay.id", "EOL test bay id", "ID поста EOL-тестов"),
  id("eol_test_au.vin", "VIN", "VIN"),
  q("eol_test_au.pass", "%", "Pass rate today", "Прохождение за сутки", { range: { min: 0, max: 100 } }),
  q("eol_test_au.time.min", "min", "Test time", "Время теста"),
  q("eol_test_au.defects", "-", "Defects found", "Найденных дефектов", { encodings: ["i32"] }),
  q("eol_test_au.queue", "-", "Vehicles in queue", "Авто в очереди", { encodings: ["i32"] }),
  logical("eol_test_au.rework", "Rework required", "Нужна переделка"),
  enu("eol_test_au.state", ["test", "rework", "idle", "fault"], "Bay state", "Состояние поста"),
]);

write("layer-b-engine_test.json", [
  id("engine_test.cell.id", "Engine test cell id", "ID стенда испытаний ДВС"),
  id("engine_test.engine.id", "Engine id", "ID двигателя"),
  q("engine_test.power", "kW", "Measured power", "Измеренная мощность"),
  q("engine_test.torque", "Nm", "Measured torque", "Измеренный момент"),
  q("engine_test.speed", "rpm", "Engine speed", "Обороты"),
  q("engine_test.temp", "Cel", "Coolant temperature", "Температура ОЖ"),
  logical("engine_test.pass", "Test pass", "Испытание пройдено"),
  enu("engine_test.mode", ["hot", "cold", "endurance", "other"], "Mode", "Режим"),
]);

write("layer-b-trans_assy.json", [
  id("trans_assy.line.id", "Transmission assembly line id", "ID линии сборки КПП"),
  q("trans_assy.output", "/h", "Units per hour", "Единиц в час"),
  q("trans_assy.torque", "Nm", "Fastener torque checks", "Контроль момента"),
  q("trans_assy.nvh", "-", "NVH index", "Индекс NVH"),
  q("trans_assy.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("trans_assy.leak", "Pa", "Leak test pressure drop", "Падение давления утечки"),
  logical("trans_assy.spec.ok", "EOL OK", "EOL OK"),
  enu("trans_assy.type", ["at", "mt", "dct", "cvt", "other"], "Type", "Тип"),
]);

write("layer-b-batt_pack_ev.json", [
  id("batt_pack_ev.line.id", "EV battery pack line id", "ID линии тяговых батарей EV"),
  q("batt_pack_ev.output", "/h", "Packs per hour", "Паков в час"),
  q("batt_pack_ev.capacity", "kWh", "Pack energy", "Энергия пака"),
  q("batt_pack_ev.weld", "%", "Busbar weld yield", "Выход сварки шин", { range: { min: 0, max: 100 } }),
  q("batt_pack_ev.leak", "Pa", "Cooling leak test", "Тест утечки охлаждения"),
  q("batt_pack_ev.ir", "mOhm", "Pack IR", "Внутреннее сопротивление пака"),
  logical("batt_pack_ev.bms", "BMS flash OK", "Прошивка BMS OK"),
  enu("batt_pack_ev.state", ["stack", "weld", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-chassis_dyn.json", [
  id("chassis_dyn.id", "Chassis dynamometer id", "ID стенда с беговыми барабанами"),
  id("chassis_dyn.vin", "VIN", "VIN"),
  q("chassis_dyn.power", "kW", "Wheel power", "Мощность на колёсах"),
  q("chassis_dyn.speed", "km/h", "Roller speed", "Скорость барабанов"),
  q("chassis_dyn.load", "N", "Road load", "Сопротивление дороги"),
  q("chassis_dyn.emissions", "g/km", "CO2 / pollutant", "CO2 / выбросы"),
  logical("chassis_dyn.pass", "Cycle pass", "Цикл пройден"),
  enu("chassis_dyn.cycle", ["wltp", "nedc", "ftp", "custom", "other"], "Cycle", "Цикл"),
]);

write("layer-b-body_assy.json", [
  id("body_assy.line.id", "Body assembly / BIW line id", "ID линии кузова / BIW"),
  q("body_assy.jph", "/h", "Bodies per hour", "Кузовов в час"),
  q("body_assy.spots", "-", "Spots per body", "Точек на кузов", { encodings: ["i32"] }),
  q("body_assy.geo", "mm", "Geometry deviation max", "Макс. отклонение геометрии"),
  q("body_assy.ftt", "%", "First-time-through", "С первого раза", { range: { min: 0, max: 100 } }),
  q("body_assy.robots", "-", "Robots online", "Роботов онлайн", { encodings: ["i32"] }),
  logical("body_assy.fixture", "Fixture fault", "Отказ оснастки"),
  enu("body_assy.state", ["weld", "geo", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-die_cast_au.json", [
  id("die_cast_au.id", "Automotive die-cast machine id", "ID машины литья под давлением авто"),
  q("die_cast_au.shot", "/h", "Shots per hour", "Впрысков в час"),
  q("die_cast_au.pressure", "kPa", "Injection pressure", "Давление впрыска"),
  q("die_cast_au.temp", "Cel", "Metal temperature", "Температура металла"),
  q("die_cast_au.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  q("die_cast_au.cycle.s", "s", "Cycle time", "Время цикла"),
  logical("die_cast_au.porosity", "Porosity high", "Высокая пористость"),
  enu("die_cast_au.alloy", ["al", "mg", "zn", "other"], "Alloy", "Сплав"),
]);

write("layer-b-mach_cnc_au.json", [
  id("mach_cnc_au.id", "Automotive CNC cell id", "ID ЧПУ-ячейки автокомпонентов"),
  q("mach_cnc_au.cycle.s", "s", "Cycle time", "Время цикла"),
  q("mach_cnc_au.spindle", "rpm", "Spindle speed", "Обороты шпинделя"),
  q("mach_cnc_au.parts", "-", "Parts per hour", "Деталей в час", { encodings: ["i32"] }),
  q("mach_cnc_au.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  q("mach_cnc_au.cpk", "-", "Process Cpk", "Cpk процесса"),
  logical("mach_cnc_au.tool", "Tool break", "Поломка инструмента"),
  enu("mach_cnc_au.state", ["cut", "setup", "idle", "fault"], "Cell state", "Состояние ячейки"),
]);

write("layer-b-heat_trt_au.json", [
  id("heat_trt_au.id", "Automotive heat-treat furnace id", "ID печи термообработки авто"),
  q("heat_trt_au.temp", "Cel", "Furnace temperature", "Температура печи"),
  q("heat_trt_au.time.h", "h", "Soak time", "Время выдержки"),
  q("heat_trt_au.hardness", "HV", "Hardness", "Твёрдость"),
  q("heat_trt_au.atmosphere", "%", "Atmosphere carbon potential", "Углеродный потенциал", { range: { min: 0, max: 100 } }),
  q("heat_trt_au.batch", "-", "Parts in load", "Деталей в садку", { encodings: ["i32"] }),
  logical("heat_trt_au.spec.ok", "Hardness OK", "Твёрдость OK"),
  enu("heat_trt_au.process", ["carburize", "quench", "temper", "other"], "Process", "Процесс"),
]);

write("layer-b-forge_press.json", [
  id("forge_press.id", "Forging press id", "ID ковочного пресса"),
  q("forge_press.force", "MN", "Press force", "Усилие пресса"),
  q("forge_press.temp", "Cel", "Billet temperature", "Температура заготовки"),
  q("forge_press.spm", "/min", "Strokes per minute", "Ходов в минуту"),
  q("forge_press.parts", "-", "Forgings per hour", "Поковок в час", { encodings: ["i32"] }),
  q("forge_press.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("forge_press.die", "Die crack risk", "Риск трещины штампа"),
  enu("forge_press.type", ["hot", "warm", "cold", "other"], "Type", "Тип"),
]);

write("layer-b-extrude_au.json", [
  id("extrude_au.id", "Automotive extrusion press id", "ID экструзионного пресса авто"),
  q("extrude_au.force", "MN", "Press force", "Усилие пресса"),
  q("extrude_au.temp", "Cel", "Billet temperature", "Температура слитка"),
  q("extrude_au.speed", "m/min", "Ram / exit speed", "Скорость прессования"),
  q("extrude_au.output", "t/h", "Profile output", "Выпуск профиля"),
  q("extrude_au.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("extrude_au.surface", "Surface defect", "Дефект поверхности"),
  enu("extrude_au.alloy", ["6xxx", "7xxx", "other"], "Alloy", "Сплав"),
]);

write("layer-b-tire_mount.json", [
  id("tire_mount.line.id", "Tire mounting line id", "ID линии монтажа шин"),
  q("tire_mount.speed", "/h", "Wheels per hour", "Колёс в час"),
  q("tire_mount.pressure", "kPa", "Inflation pressure", "Давление накачки"),
  q("tire_mount.balance", "g", "Balance correction", "Коррекция балансировки"),
  q("tire_mount.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("tire_mount.torque", "Nm", "Wheel nut torque", "Момент гаек"),
  logical("tire_mount.bead", "Bead seat OK", "Посадка борта OK"),
  enu("tire_mount.state", ["mount", "inflate", "balance", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-glass_auto.json", [
  id("glass_auto.line.id", "Automotive glass line id", "ID линии автостекла"),
  q("glass_auto.output", "/h", "Lites per hour", "Стёкол в час"),
  q("glass_auto.bend", "Cel", "Bending temperature", "Температура гибки"),
  q("glass_auto.laminate", "%", "Laminate yield", "Выход триплекса", { range: { min: 0, max: 100 } }),
  q("glass_auto.optics", "%", "Optical pass", "Оптика OK", { range: { min: 0, max: 100 } }),
  q("glass_auto.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("glass_auto.break", "Breakage", "Бой"),
  enu("glass_auto.type", ["windshield", "side", "rear", "other"], "Type", "Тип"),
]);

write("layer-b-seat_foam.json", [
  id("seat_foam.line.id", "Seat foam molding line id", "ID линии формования пены сидений"),
  q("seat_foam.shots", "/h", "Shots per hour", "Впрысков в час"),
  q("seat_foam.density", "kg/m3", "Foam density", "Плотность пены"),
  q("seat_foam.hardness", "N", "ILD hardness", "Жёсткость ILD"),
  q("seat_foam.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("seat_foam.cure.s", "s", "Cure time", "Время отверждения"),
  logical("seat_foam.void", "Void / collapse", "Пустота / схлопывание"),
  enu("seat_foam.state", ["pour", "cure", "trim", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-harness_ln.json", [
  id("harness_ln.id", "Wire harness line id", "ID линии жгутов"),
  q("harness_ln.output", "/h", "Harnesses per hour", "Жгутов в час"),
  q("harness_ln.crimps", "-", "Crimps per harness", "Обжимов на жгут", { encodings: ["i32"] }),
  q("harness_ln.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("harness_ln.test", "%", "Electrical test pass", "Электротест OK", { range: { min: 0, max: 100 } }),
  q("harness_ln.circuits", "-", "Circuits checked", "Проверенных цепей", { encodings: ["i32"] }),
  logical("harness_ln.continuity", "Continuity fail", "Обрыв цепи"),
  enu("harness_ln.state", ["cut", "crimp", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-ecu_flash.json", [
  id("ecu_flash.station.id", "ECU flash station id", "ID поста прошивки ЭБУ"),
  id("ecu_flash.ecu.id", "ECU id", "ID ЭБУ"),
  q("ecu_flash.time.s", "s", "Flash time", "Время прошивки"),
  q("ecu_flash.pass", "%", "Pass rate", "Прохождение", { range: { min: 0, max: 100 } }),
  q("ecu_flash.queue", "-", "Units in queue", "В очереди", { encodings: ["i32"] }),
  q("ecu_flash.version", "-", "Software builds today", "Сборок ПО", { encodings: ["i32"] }),
  logical("ecu_flash.verify", "Verify OK", "Проверка OK"),
  enu("ecu_flash.state", ["flash", "verify", "idle", "fault"], "Station state", "Состояние поста"),
]);

write("layer-b-adas_cal.json", [
  id("adas_cal.bay.id", "ADAS calibration bay id", "ID поста калибровки ADAS"),
  id("adas_cal.vin", "VIN", "VIN"),
  q("adas_cal.time.min", "min", "Calibration time", "Время калибровки"),
  q("adas_cal.pass", "%", "Pass rate", "Прохождение", { range: { min: 0, max: 100 } }),
  q("adas_cal.cameras", "-", "Cameras calibrated", "Калиброванных камер", { encodings: ["i32"] }),
  q("adas_cal.radar", "-", "Radars calibrated", "Калиброванных радаров", { encodings: ["i32"] }),
  logical("adas_cal.align", "Target alignment OK", "Мишени OK"),
  enu("adas_cal.state", ["static", "dynamic", "idle", "fault"], "Bay state", "Состояние поста"),
]);

write("layer-b-airbag_tst.json", [
  id("airbag_tst.bench.id", "Airbag test bench id", "ID стенда подушек безопасности"),
  id("airbag_tst.module.id", "Module id", "ID модуля"),
  q("airbag_tst.current", "A", "Squib current", "Ток пиропатрона"),
  q("airbag_tst.resistance", "Ohm", "Squib resistance", "Сопротивление пиропатрона"),
  q("airbag_tst.time.ms", "ms", "Deploy time", "Время срабатывания"),
  q("airbag_tst.pass", "%", "Pass rate", "Прохождение", { range: { min: 0, max: 100 } }),
  logical("airbag_tst.pass.ok", "Deploy test pass", "Тест срабатывания OK"),
  enu("airbag_tst.type", ["driver", "passenger", "side", "curtain", "other"], "Type", "Тип"),
]);

write("layer-b-brake_ln.json", [
  id("brake_ln.id", "Brake component line id", "ID линии тормозных компонентов"),
  q("brake_ln.output", "/h", "Units per hour", "Единиц в час"),
  q("brake_ln.thickness", "mm", "Pad / disc thickness", "Толщина колодки/диска"),
  q("brake_ln.runout", "um", "Disc runout", "Биение диска"),
  q("brake_ln.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("brake_ln.torque", "Nm", "Assembly torque", "Момент сборки"),
  logical("brake_ln.spec.ok", "Dimension OK", "Размер OK"),
  enu("brake_ln.product", ["pad", "disc", "caliper", "other"], "Product", "Продукт"),
]);

write("layer-b-exhaust_cat.json", [
  id("exhaust_cat.line.id", "Catalytic converter line id", "ID линии катализаторов"),
  q("exhaust_cat.output", "/h", "Converters per hour", "Катализаторов в час"),
  q("exhaust_cat.pgms", "g", "PGM loading", "Загрузка драгметаллов"),
  q("exhaust_cat.coat", "g/L", "Washcoat loading", "Нанос washcoat"),
  q("exhaust_cat.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("exhaust_cat.leak", "Pa", "Can leak test", "Тест герметичности"),
  logical("exhaust_cat.spec.ok", "Coating OK", "Покрытие OK"),
  enu("exhaust_cat.state", ["coat", "can", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-fuel_tank.json", [
  id("fuel_tank.line.id", "Fuel tank line id", "ID линии топливных баков"),
  q("fuel_tank.output", "/h", "Tanks per hour", "Баков в час"),
  q("fuel_tank.volume", "L", "Nominal volume", "Номинальный объём"),
  q("fuel_tank.leak", "Pa", "Leak test pressure", "Давление теста утечки"),
  q("fuel_tank.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("fuel_tank.weld", "%", "Weld / weld pass", "Сварка OK", { range: { min: 0, max: 100 } }),
  logical("fuel_tank.permeation", "Permeation OK", "Проницаемость OK"),
  enu("fuel_tank.type", ["plastic", "steel", "hybrid", "other"], "Type", "Тип"),
]);

write("layer-b-hvac_auto.json", [
  id("hvac_auto.line.id", "Automotive HVAC line id", "ID линии автоклиматики"),
  q("hvac_auto.output", "/h", "Units per hour", "Единиц в час"),
  q("hvac_auto.airflow", "m3/h", "Blower airflow", "Расход вентилятора"),
  q("hvac_auto.leak", "g/y", "Refrigerant leak rate", "Утечка хладагента"),
  q("hvac_auto.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("hvac_auto.noise", "dB", "Blower noise", "Шум вентилятора"),
  logical("hvac_auto.spec.ok", "Performance OK", "Характеристики OK"),
  enu("hvac_auto.state", ["assemble", "charge", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-air_filter.json", [
  id("air_filter.line.id", "Automotive air filter line id", "ID линии воздушных фильтров"),
  q("air_filter.output", "/h", "Filters per hour", "Фильтров в час"),
  q("air_filter.dp", "Pa", "Pressure drop", "Перепад давления"),
  q("air_filter.efficiency", "%", "Filtration efficiency", "Эффективность фильтрации", { range: { min: 0, max: 100 } }),
  q("air_filter.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("air_filter.media", "m2", "Media area", "Площадь материала"),
  logical("air_filter.spec.ok", "Spec OK", "Спецификация OK"),
  enu("air_filter.type", ["cabin", "engine", "hevpa", "other"], "Type", "Тип"),
]);

write("layer-b-oil_filter.json", [
  id("oil_filter.line.id", "Oil filter line id", "ID линии масляных фильтров"),
  q("oil_filter.output", "/h", "Filters per hour", "Фильтров в час"),
  q("oil_filter.burst", "kPa", "Burst pressure", "Давление разрыва"),
  q("oil_filter.efficiency", "%", "Particle efficiency", "Эффективность по частицам", { range: { min: 0, max: 100 } }),
  q("oil_filter.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("oil_filter.torque", "Nm", "Spin-on torque", "Момент затяжки"),
  logical("oil_filter.spec.ok", "Spec OK", "Спецификация OK"),
  enu("oil_filter.state", ["form", "assemble", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-spark_plug.json", [
  id("spark_plug.line.id", "Spark plug line id", "ID линии свечей зажигания"),
  q("spark_plug.output", "/h", "Plugs per hour", "Свечей в час"),
  q("spark_plug.gap", "mm", "Electrode gap", "Зазор электродов"),
  q("spark_plug.resistance", "kOhm", "Resistor value", "Сопротивление"),
  q("spark_plug.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("spark_plug.torque", "Nm", "Shell torque", "Момент корпуса"),
  logical("spark_plug.spec.ok", "Gap OK", "Зазор OK"),
  enu("spark_plug.type", ["iridium", "platinum", "copper", "other"], "Type", "Тип"),
]);

write("layer-b-bearing_ln.json", [
  id("bearing_ln.id", "Bearing production line id", "ID линии подшипников"),
  q("bearing_ln.output", "/h", "Bearings per hour", "Подшипников в час"),
  q("bearing_ln.noise", "dB", "Noise test", "Шумовой тест"),
  q("bearing_ln.clearance", "um", "Radial clearance", "Радиальный зазор"),
  q("bearing_ln.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("bearing_ln.hardness", "HRC", "Race hardness", "Твёрдость дорожки"),
  logical("bearing_ln.spec.ok", "Noise / clearance OK", "Шум / зазор OK"),
  enu("bearing_ln.type", ["ball", "roller", "taper", "other"], "Type", "Тип"),
]);

write("layer-b-gear_hob.json", [
  id("gear_hob.id", "Gear hobbing machine id", "ID зубофрезерного станка"),
  q("gear_hob.output", "/h", "Gears per hour", "Шестерён в час"),
  q("gear_hob.speed", "rpm", "Hob speed", "Обороты фрезы"),
  q("gear_hob.error", "um", "Profile error", "Погрешность профиля"),
  q("gear_hob.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("gear_hob.tool", "-", "Tool life remaining %", "Остаток ресурса инструмента", { encodings: ["i32"] }),
  logical("gear_hob.spec.ok", "Gear quality OK", "Качество зуба OK"),
  enu("gear_hob.state", ["hob", "shave", "idle", "fault"], "Machine state", "Состояние станка"),
]);

write("layer-b-spring_coil.json", [
  id("spring_coil.id", "Coil spring machine id", "ID станка навивки пружин"),
  q("spring_coil.output", "/h", "Springs per hour", "Пружин в час"),
  q("spring_coil.rate", "N/mm", "Spring rate", "Жёсткость пружины"),
  q("spring_coil.length", "mm", "Free length", "Свободная длина"),
  q("spring_coil.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("spring_coil.wire", "mm", "Wire diameter", "Диаметр проволоки"),
  logical("spring_coil.spec.ok", "Rate OK", "Жёсткость OK"),
  enu("spring_coil.type", ["suspension", "valve", "seat", "other"], "Type", "Тип"),
]);

write("layer-b-fastener_ln.json", [
  id("fastener_ln.id", "Fastener production line id", "ID линии крепежа"),
  q("fastener_ln.output", "/h", "Pieces per hour", "Штук в час"),
  q("fastener_ln.torque", "Nm", "Proof torque", "Контрольный момент"),
  q("fastener_ln.hardness", "HV", "Hardness", "Твёрдость"),
  q("fastener_ln.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("fastener_ln.coat", "um", "Coat thickness", "Толщина покрытия"),
  logical("fastener_ln.spec.ok", "Dim / hardness OK", "Размер / твёрдость OK"),
  enu("fastener_ln.type", ["bolt", "nut", "screw", "other"], "Type", "Тип"),
]);

write("layer-b-conn_mold.json", [
  id("conn_mold.id", "Connector molding machine id", "ID машины литья разъёмов"),
  q("conn_mold.shots", "/h", "Shots per hour", "Впрысков в час"),
  q("conn_mold.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("conn_mold.cycle.s", "s", "Cycle time", "Время цикла"),
  q("conn_mold.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("conn_mold.flash", "%", "Flash rate", "Облой", { range: { min: 0, max: 100 } }),
  logical("conn_mold.short", "Short shot", "Недолив"),
  enu("conn_mold.state", ["mold", "insert", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-sensor_cal.json", [
  id("sensor_cal.bench.id", "Automotive sensor cal bench id", "ID стенда калибровки датчиков"),
  id("sensor_cal.dut.id", "DUT id", "ID испытуемого"),
  q("sensor_cal.error", "%", "Calibration error", "Погрешность калибровки", { range: { min: 0, max: 100 } }),
  q("sensor_cal.time.s", "s", "Cal time", "Время калибровки"),
  q("sensor_cal.pass", "%", "Pass rate", "Прохождение", { range: { min: 0, max: 100 } }),
  q("sensor_cal.temp", "Cel", "Ambient temperature", "Температура среды"),
  logical("sensor_cal.spec.ok", "Within tolerance", "В допуске"),
  enu("sensor_cal.type", ["pressure", "temp", "position", "other"], "Type", "Тип"),
]);

write("layer-b-lidar_assy.json", [
  id("lidar_assy.line.id", "Lidar assembly line id", "ID линии сборки лидаров"),
  q("lidar_assy.output", "/h", "Units per hour", "Единиц в час"),
  q("lidar_assy.range", "m", "Max range verified", "Макс. дальность"),
  q("lidar_assy.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("lidar_assy.align", "mrad", "Beam alignment", "Юстировка луча"),
  q("lidar_assy.power", "W", "Laser power", "Мощность лазера"),
  logical("lidar_assy.eye", "Eye-safety OK", "Глазобезопасность OK"),
  enu("lidar_assy.state", ["assemble", "align", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-cam_module.json", [
  id("cam_module.line.id", "Camera module line id", "ID линии камерных модулей"),
  q("cam_module.output", "/h", "Modules per hour", "Модулей в час"),
  q("cam_module.focus", "%", "Focus pass", "Фокус OK", { range: { min: 0, max: 100 } }),
  q("cam_module.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("cam_module.dust", "-", "Dust particles found", "Частиц пыли", { encodings: ["i32"] }),
  q("cam_module.mtf", "%", "MTF score", "Оценка MTF", { range: { min: 0, max: 100 } }),
  logical("cam_module.spec.ok", "Optical OK", "Оптика OK"),
  enu("cam_module.state", ["bond", "focus", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-display_asy.json", [
  id("display_asy.line.id", "Automotive display assembly id", "ID сборки автодисплеев"),
  q("display_asy.output", "/h", "Displays per hour", "Дисплеев в час"),
  q("display_asy.brightness", "cd/m2", "Brightness", "Яркость"),
  q("display_asy.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("display_asy.dead", "-", "Dead pixels", "Мёртвых пикселей", { encodings: ["i32"] }),
  q("display_asy.uniform", "%", "Uniformity", "Равномерность", { range: { min: 0, max: 100 } }),
  logical("display_asy.spec.ok", "Optical OK", "Оптика OK"),
  enu("display_asy.state", ["laminate", "bond", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-speaker_ln.json", [
  id("speaker_ln.id", "Automotive speaker line id", "ID линии автодинамиков"),
  q("speaker_ln.output", "/h", "Speakers per hour", "Динамиков в час"),
  q("speaker_ln.spl", "dB", "SPL at test", "УЗД на тесте"),
  q("speaker_ln.thd", "%", "THD", "КНИ", { range: { min: 0, max: 100 } }),
  q("speaker_ln.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("speaker_ln.impedance", "Ohm", "Impedance", "Импеданс"),
  logical("speaker_ln.spec.ok", "Audio OK", "Аудио OK"),
  enu("speaker_ln.state", ["assemble", "test", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-headlamp.json", [
  id("headlamp.line.id", "Headlamp assembly line id", "ID линии фар"),
  q("headlamp.output", "/h", "Lamps per hour", "Фар в час"),
  q("headlamp.aim", "deg", "Aim angle error", "Ошибка регулировки"),
  q("headlamp.beam", "cd", "Beam intensity", "Сила света"),
  q("headlamp.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("headlamp.leak", "Pa", "Housing leak test", "Тест герметичности"),
  logical("headlamp.spec.ok", "Photometry OK", "Фотометрия OK"),
  enu("headlamp.type", ["halogen", "led", "matrix", "other"], "Type", "Тип"),
]);

write("layer-b-mirror_au.json", [
  id("mirror_au.line.id", "Automotive mirror line id", "ID линии зеркал"),
  q("mirror_au.output", "/h", "Mirrors per hour", "Зеркал в час"),
  q("mirror_au.reflect", "%", "Reflectance", "Отражение", { range: { min: 0, max: 100 } }),
  q("mirror_au.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("mirror_au.fold", "Nm", "Fold torque", "Момент складывания"),
  q("mirror_au.heat", "W", "Heater power", "Мощность обогрева"),
  logical("mirror_au.spec.ok", "Optics / fold OK", "Оптика / склад OK"),
  enu("mirror_au.type", ["side", "interior", "camera", "other"], "Type", "Тип"),
]);

write("layer-b-wiper_ln.json", [
  id("wiper_ln.id", "Wiper system line id", "ID линии стеклоочистителей"),
  q("wiper_ln.output", "/h", "Systems per hour", "Систем в час"),
  q("wiper_ln.torque", "Nm", "Motor torque", "Момент мотора"),
  q("wiper_ln.cycle.s", "s", "Wipe cycle time", "Время цикла"),
  q("wiper_ln.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("wiper_ln.noise", "dB", "Operating noise", "Шум работы"),
  logical("wiper_ln.spec.ok", "Park / wipe OK", "Парковка / очистка OK"),
  enu("wiper_ln.state", ["assemble", "test", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-door_mod.json", [
  id("door_mod.line.id", "Door module line id", "ID линии дверных модулей"),
  q("door_mod.output", "/h", "Modules per hour", "Модулей в час"),
  q("door_mod.cycle.s", "s", "Cycle time", "Время цикла"),
  q("door_mod.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("door_mod.window", "s", "Window up/down time", "Время стеклоподъёмника"),
  q("door_mod.torque", "Nm", "Latch torque", "Момент замка"),
  logical("door_mod.spec.ok", "Function OK", "Функции OK"),
  enu("door_mod.state", ["assemble", "test", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-sunroof.json", [
  id("sunroof.line.id", "Sunroof assembly line id", "ID линии люков"),
  q("sunroof.output", "/h", "Units per hour", "Единиц в час"),
  q("sunroof.force", "N", "Open / close force", "Усилие открытия/закрытия"),
  q("sunroof.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("sunroof.leak", "Pa", "Water leak test", "Тест на протечку"),
  q("sunroof.noise", "dB", "Operating noise", "Шум работы"),
  logical("sunroof.spec.ok", "Seal / motion OK", "Уплотнение / ход OK"),
  enu("sunroof.type", ["slide", "tilt", "panoramic", "other"], "Type", "Тип"),
]);

write("layer-b-air_susp.json", [
  id("air_susp.line.id", "Air suspension line id", "ID линии пневмоподвески"),
  q("air_susp.output", "/h", "Units per hour", "Единиц в час"),
  q("air_susp.pressure", "kPa", "System pressure", "Давление системы"),
  q("air_susp.leak", "Pa/min", "Leak rate", "Скорость утечки"),
  q("air_susp.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("air_susp.ride", "mm", "Ride height accuracy", "Точность клиренса"),
  logical("air_susp.spec.ok", "Pressure hold OK", "Удержание давления OK"),
  enu("air_susp.state", ["assemble", "charge", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-eps_motor.json", [
  id("eps_motor.line.id", "EPS motor line id", "ID линии моторов ЭУР"),
  q("eps_motor.output", "/h", "Motors per hour", "Моторов в час"),
  q("eps_motor.torque", "Nm", "Assist torque", "Момент помощи"),
  q("eps_motor.current", "A", "Motor current", "Ток мотора"),
  q("eps_motor.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("eps_motor.noise", "dB", "NVH", "Шум"),
  logical("eps_motor.spec.ok", "Torque map OK", "Карта момента OK"),
  enu("eps_motor.state", ["wind", "assemble", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-invert_ev.json", [
  id("invert_ev.line.id", "EV traction inverter line id", "ID линии тяговых инверторов"),
  q("invert_ev.output", "/h", "Inverters per hour", "Инверторов в час"),
  q("invert_ev.power", "kW", "Rated power", "Номинальная мощность"),
  q("invert_ev.efficiency", "%", "Efficiency at test", "КПД на тесте", { range: { min: 0, max: 100 } }),
  q("invert_ev.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("invert_ev.temp", "Cel", "IGBT temperature", "Температура IGBT"),
  logical("invert_ev.spec.ok", "Power test OK", "Силовой тест OK"),
  enu("invert_ev.state", ["assemble", "pot", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-obc_charge.json", [
  id("obc_charge.line.id", "On-board charger line id", "ID линии бортовых ЗУ"),
  q("obc_charge.output", "/h", "OBCs per hour", "ЗУ в час"),
  q("obc_charge.power", "kW", "Charge power", "Мощность зарядки"),
  q("obc_charge.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("obc_charge.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("obc_charge.temp", "Cel", "Heatsink temperature", "Температура радиатора"),
  logical("obc_charge.spec.ok", "Charge test OK", "Тест зарядки OK"),
  enu("obc_charge.state", ["assemble", "test", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-dcdc_conv.json", [
  id("dcdc_conv.line.id", "EV DC-DC converter line id", "ID линии DC-DC преобразователей"),
  q("dcdc_conv.output", "/h", "Converters per hour", "Преобразователей в час"),
  q("dcdc_conv.power", "kW", "Rated power", "Номинальная мощность"),
  q("dcdc_conv.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("dcdc_conv.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("dcdc_conv.ripple", "mV", "Output ripple", "Пульсации выхода"),
  logical("dcdc_conv.spec.ok", "Electrical OK", "Электрика OK"),
  enu("dcdc_conv.state", ["assemble", "test", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-bms_flash.json", [
  id("bms_flash.station.id", "BMS flash / test station id", "ID поста прошивки/теста BMS"),
  id("bms_flash.board.id", "BMS board id", "ID платы BMS"),
  q("bms_flash.time.s", "s", "Flash + test time", "Время прошивки+теста"),
  q("bms_flash.pass", "%", "Pass rate", "Прохождение", { range: { min: 0, max: 100 } }),
  q("bms_flash.cells", "-", "Cell channels checked", "Проверенных каналов", { encodings: ["i32"] }),
  q("bms_flash.balance", "mV", "Balance accuracy", "Точность балансировки"),
  logical("bms_flash.verify", "Firmware verify OK", "Проверка ПО OK"),
  enu("bms_flash.state", ["flash", "test", "idle", "fault"], "Station state", "Состояние поста"),
]);

write("layer-b-thermal_ev.json", [
  id("thermal_ev.line.id", "EV thermal system line id", "ID линии термосистем EV"),
  q("thermal_ev.output", "/h", "Systems per hour", "Систем в час"),
  q("thermal_ev.flow", "L/min", "Coolant flow", "Расход теплоносителя"),
  q("thermal_ev.leak", "Pa", "Leak test", "Тест утечки"),
  q("thermal_ev.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("thermal_ev.pressure", "kPa", "System pressure", "Давление системы"),
  logical("thermal_ev.spec.ok", "Flow / leak OK", "Расход / утечка OK"),
  enu("thermal_ev.state", ["assemble", "fill", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-coolant_lp.json", [
  id("coolant_lp.id", "Coolant loop fill station id", "ID поста заправки контура ОЖ"),
  id("coolant_lp.vin", "VIN", "VIN"),
  q("coolant_lp.volume", "L", "Fill volume", "Объём заправки"),
  q("coolant_lp.vacuum", "kPa", "Evacuation vacuum", "Вакуум эвакуации"),
  q("coolant_lp.time.s", "s", "Fill time", "Время заправки"),
  q("coolant_lp.concentration", "%", "Antifreeze concentration", "Концентрация антифриза", { range: { min: 0, max: 100 } }),
  logical("coolant_lp.pass", "Fill pass", "Заправка OK"),
  enu("coolant_lp.state", ["evacuate", "fill", "idle", "fault"], "Station state", "Состояние поста"),
]);

write("layer-b-heat_pump_ev.json", [
  id("heat_pump_ev.line.id", "EV heat-pump line id", "ID линии тепловых насосов EV"),
  q("heat_pump_ev.output", "/h", "Units per hour", "Единиц в час"),
  q("heat_pump_ev.cop", "-", "COP at test", "КОП на тесте"),
  q("heat_pump_ev.charge", "g", "Refrigerant charge", "Заправка хладагента"),
  q("heat_pump_ev.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("heat_pump_ev.leak", "g/y", "Leak rate", "Утечка"),
  logical("heat_pump_ev.spec.ok", "Performance OK", "Характеристики OK"),
  enu("heat_pump_ev.state", ["assemble", "charge", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-charge_pile.json", [
  id("charge_pile.id", "EV charging pile id", "ID зарядной станции EV"),
  q("charge_pile.power", "kW", "Delivered power", "Отданная мощность"),
  q("charge_pile.sessions", "-", "Sessions today", "Сессий за сутки", { encodings: ["i32"] }),
  q("charge_pile.energy", "kWh", "Energy today", "Энергия за сутки"),
  q("charge_pile.uptime", "%", "Uptime", "Готовность", { range: { min: 0, max: 100 } }),
  q("charge_pile.temp", "Cel", "Connector temperature", "Температура разъёма"),
  logical("charge_pile.fault", "Charger fault", "Отказ зарядки"),
  enu("charge_pile.type", ["ac", "dc_fast", "hpc", "other"], "Type", "Тип"),
]);

write("layer-b-v2g_unit.json", [
  id("v2g_unit.id", "V2G bidirectional charger id", "ID двунаправленного ЗУ V2G"),
  q("v2g_unit.power", "kW", "Import / export power", "Мощность приём/отдача"),
  q("v2g_unit.energy", "kWh", "Energy exchanged today", "Обмен энергии за сутки"),
  q("v2g_unit.soc", "%", "Vehicle SOC", "SOC автомобиля", { range: { min: 0, max: 100 } }),
  q("v2g_unit.pf", "-", "Power factor", "Коэффициент мощности"),
  q("v2g_unit.temp", "Cel", "Unit temperature", "Температура установки"),
  logical("v2g_unit.grid", "Grid support active", "Поддержка сети активна"),
  enu("v2g_unit.mode", ["charge", "discharge", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-depot_chg.json", [
  id("depot_chg.id", "Fleet depot charger bank id", "ID зарядного парка депо"),
  q("depot_chg.power", "MW", "Total power", "Суммарная мощность"),
  q("depot_chg.ports", "-", "Ports in use", "Портов в работе", { encodings: ["i32"] }),
  q("depot_chg.energy", "MWh", "Energy today", "Энергия за сутки"),
  q("depot_chg.load", "%", "Peak demand vs capacity", "Пик к мощности", { range: { min: 0, max: 100 } }),
  q("depot_chg.queue", "-", "Vehicles waiting", "Авто в ожидании", { encodings: ["i32"] }),
  logical("depot_chg.overload", "Demand limit", "Лимит мощности"),
  enu("depot_chg.state", ["charge", "schedule", "idle", "fault"], "Depot state", "Состояние депо"),
]);

write("layer-b-bus_garage.json", [
  id("bus_garage.id", "Bus garage id", "ID автобусного парка"),
  q("bus_garage.fleet", "-", "Buses available", "Автобусов в наличии", { encodings: ["i32"] }),
  q("bus_garage.out", "-", "Buses in service", "Автобусов на линии", { encodings: ["i32"] }),
  q("bus_garage.maint", "-", "In maintenance", "На ТО", { encodings: ["i32"] }),
  q("bus_garage.energy", "kWh", "Depot energy today", "Энергия депо за сутки"),
  q("bus_garage.fuel", "L", "Fuel / H2 dispensed", "Топливо / H2"),
  logical("bus_garage.ready", "Morning readiness OK", "Утренняя готовность OK"),
  enu("bus_garage.state", ["dispatch", "maintain", "charge", "idle"], "Garage state", "Состояние парка"),
]);

write("layer-b-rail_depot.json", [
  id("rail_depot.id", "Rail depot id", "ID железнодорожного депо"),
  q("rail_depot.units", "-", "Rolling stock available", "ПС в наличии", { encodings: ["i32"] }),
  q("rail_depot.maint", "-", "Units in maintenance", "На ТО", { encodings: ["i32"] }),
  q("rail_depot.roads", "-", "Roads occupied", "Занятых путей", { encodings: ["i32"] }),
  q("rail_depot.energy", "MWh", "Depot energy today", "Энергия депо за сутки"),
  q("rail_depot.wash", "-", "Washes today", "Моек за сутки", { encodings: ["i32"] }),
  logical("rail_depot.ready", "Service readiness OK", "Готовность к рейсам OK"),
  enu("rail_depot.state", ["stabling", "maintain", "wash", "fault"], "Depot state", "Состояние депо"),
]);

write("layer-b-loco_shop.json", [
  id("loco_shop.id", "Locomotive workshop id", "ID локомотивного цеха"),
  q("loco_shop.jobs", "-", "Open work orders", "Открытых нарядов", { encodings: ["i32"] }),
  q("loco_shop.tat.d", "d", "Average TAT", "Средний TAT"),
  q("loco_shop.power", "kW", "Shop power", "Мощность цеха"),
  q("loco_shop.cranes", "-", "Cranes in use", "Кранов в работе", { encodings: ["i32"] }),
  q("loco_shop.parts", "-", "Parts issued today", "Выдано деталей", { encodings: ["i32"] }),
  logical("loco_shop.overdue", "Overdue jobs", "Просроченные наряды"),
  enu("loco_shop.state", ["heavy", "light", "idle", "fault"], "Shop state", "Состояние цеха"),
]);

write("layer-b-wagon_rep.json", [
  id("wagon_rep.id", "Wagon repair shop id", "ID вагоноремонтного цеха"),
  q("wagon_rep.jobs", "-", "Wagons in repair", "Вагонов в ремонте", { encodings: ["i32"] }),
  q("wagon_rep.tat.d", "d", "Average TAT", "Средний TAT"),
  q("wagon_rep.wheels", "-", "Wheelsets changed", "Сменённых колёсных пар", { encodings: ["i32"] }),
  q("wagon_rep.weld", "-", "Weld hours today", "Часов сварки", { encodings: ["i32"] }),
  q("wagon_rep.paint", "-", "Wagons painted", "Окрашенных вагонов", { encodings: ["i32"] }),
  logical("wagon_rep.backlog", "Backlog high", "Большой задел"),
  enu("wagon_rep.state", ["repair", "inspect", "idle", "fault"], "Shop state", "Состояние цеха"),
]);

console.log("Layer B33 seeds written");
