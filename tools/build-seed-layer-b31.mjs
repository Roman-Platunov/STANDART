#!/usr/bin/env node
/**
 * Layer B31 — wood/furniture, battery manufacturing, semiconductor, data center.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B31", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-wood_saw.json", [
  id("wood_saw.id", "Sawmill primary saw id", "ID головной пилы лесопилки"),
  q("wood_saw.feed", "m/min", "Log feed speed", "Подача бревна"),
  q("wood_saw.kerf", "mm", "Kerf width", "Ширина пропила"),
  q("wood_saw.yield", "%", "Lumber recovery", "Выход пиломатериала", { range: { min: 0, max: 100 } }),
  q("wood_saw.logs", "-", "Logs per hour", "Брёвен в час", { encodings: ["i32"] }),
  q("wood_saw.power", "kW", "Saw power", "Мощность пилы"),
  logical("wood_saw.jam", "Log jam", "Затор бревна"),
  enu("wood_saw.type", ["band", "circular", "chipper", "other"], "Type", "Тип"),
]);

write("layer-b-veneer_dry.json", [
  id("veneer_dry.id", "Veneer dryer id", "ID сушилки шпона"),
  q("veneer_dry.temp", "Cel", "Zone temperature", "Температура зоны"),
  q("veneer_dry.speed", "m/min", "Deck speed", "Скорость этажерки"),
  q("veneer_dry.moisture", "%", "Exit moisture", "Влажность на выходе", { range: { min: 0, max: 100 } }),
  q("veneer_dry.output", "m3/h", "Veneer output", "Выпуск шпона"),
  q("veneer_dry.energy", "MJ/t", "Specific energy", "Удельная энергия"),
  logical("veneer_dry.overdry", "Overdry alarm", "Пересушка"),
  enu("veneer_dry.state", ["dry", "idle", "maintain", "fault"], "Dryer state", "Состояние сушилки"),
]);

write("layer-b-plywood_pr.json", [
  id("plywood_pr.id", "Plywood press id", "ID пресса фанеры"),
  q("plywood_pr.pressure", "kPa", "Press pressure", "Давление пресса"),
  q("plywood_pr.temp", "Cel", "Platen temperature", "Температура плит"),
  q("plywood_pr.cycle.s", "s", "Press cycle", "Цикл пресса"),
  q("plywood_pr.thickness", "mm", "Panel thickness", "Толщина плиты"),
  q("plywood_pr.output", "/h", "Panels per hour", "Плит в час"),
  logical("plywood_pr.blow", "Blow / delam", "Расслоение"),
  enu("plywood_pr.state", ["load", "press", "unload", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-mdf_press.json", [
  id("mdf_press.id", "MDF continuous press id", "ID непрерывного пресса МДФ"),
  q("mdf_press.speed", "m/min", "Press speed", "Скорость пресса"),
  q("mdf_press.pressure", "kPa", "Press pressure", "Давление"),
  q("mdf_press.temp", "Cel", "Platen temperature", "Температура плит"),
  q("mdf_press.density", "kg/m3", "Board density", "Плотность плиты"),
  q("mdf_press.thickness", "mm", "Board thickness", "Толщина плиты"),
  logical("mdf_press.blister", "Blister risk", "Риск вздутия"),
  enu("mdf_press.state", ["press", "idle", "maintain", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-osb_press.json", [
  id("osb_press.id", "OSB press id", "ID пресса OSB"),
  q("osb_press.speed", "m/min", "Press speed", "Скорость пресса"),
  q("osb_press.temp", "Cel", "Press temperature", "Температура пресса"),
  q("osb_press.resin", "%", "Resin content", "Доля смолы", { range: { min: 0, max: 100 } }),
  q("osb_press.moisture", "%", "Mat moisture", "Влажность ковра", { range: { min: 0, max: 100 } }),
  q("osb_press.output", "m3/h", "Board output", "Выпуск плит"),
  logical("osb_press.orient", "Orientation OK", "Ориентация OK"),
  enu("osb_press.state", ["form", "press", "idle", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-pellet_wd.json", [
  id("pellet_wd.id", "Wood pellet mill id", "ID пеллетного пресса"),
  q("pellet_wd.feed", "t/h", "Feed rate", "Подача"),
  q("pellet_wd.output", "t/h", "Pellet output", "Выпуск пеллет"),
  q("pellet_wd.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("pellet_wd.durability", "%", "Pellet durability", "Прочность пеллет", { range: { min: 0, max: 100 } }),
  q("pellet_wd.power", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("pellet_wd.die", "Die change due", "Замена матрицы"),
  enu("pellet_wd.state", ["pellet", "idle", "maintain", "fault"], "Mill state", "Состояние пресса"),
]);

write("layer-b-kiln_lumber.json", [
  id("kiln_lumber.id", "Lumber dry kiln id", "ID сушильной камеры пиломатериала"),
  q("kiln_lumber.temp", "Cel", "Dry-bulb temperature", "Температура сухого термометра"),
  q("kiln_lumber.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("kiln_lumber.moisture", "%", "Wood moisture", "Влажность древесины", { range: { min: 0, max: 100 } }),
  q("kiln_lumber.charge", "m3", "Charge volume", "Объём загрузки"),
  q("kiln_lumber.time.h", "h", "Schedule time", "Время режима"),
  logical("kiln_lumber.check", "Check / honeycomb", "Трещины / сотовость"),
  enu("kiln_lumber.state", ["heat", "dry", "equalize", "fault"], "Kiln state", "Состояние камеры"),
]);

write("layer-b-planermill.json", [
  id("planermill.id", "Planermill line id", "ID строгальной линии"),
  q("planermill.speed", "m/min", "Feed speed", "Скорость подачи"),
  q("planermill.depth", "mm", "Cut depth", "Глубина строгания"),
  q("planermill.output", "m3/h", "Dressed output", "Выпуск строганого"),
  q("planermill.reject", "%", "Grade reject", "Брак сортировки", { range: { min: 0, max: 100 } }),
  q("planermill.knives", "-", "Knife hours", "Часов ножей", { encodings: ["i32"] }),
  logical("planermill.snipe", "Snipe alarm", "Задир"),
  enu("planermill.state", ["plane", "idle", "maintain", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-furn_cnc.json", [
  id("furn_cnc.id", "Furniture CNC cell id", "ID ЧПУ-ячейки мебели"),
  q("furn_cnc.cycle.s", "s", "Cycle time", "Время цикла"),
  q("furn_cnc.spindle", "rpm", "Spindle speed", "Обороты шпинделя"),
  q("furn_cnc.parts", "-", "Parts per hour", "Деталей в час", { encodings: ["i32"] }),
  q("furn_cnc.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  q("furn_cnc.tool", "-", "Tool changes today", "Смен инструмента", { encodings: ["i32"] }),
  logical("furn_cnc.vacuum", "Vacuum hold OK", "Вакуумный прижим OK"),
  enu("furn_cnc.state", ["cut", "setup", "idle", "fault"], "Cell state", "Состояние ячейки"),
]);

write("layer-b-upholster.json", [
  id("upholster.line.id", "Upholstery line id", "ID линии обивки"),
  q("upholster.output", "/h", "Units per hour", "Изделий в час"),
  q("upholster.foam", "kg", "Foam used today", "Поролона за сутки"),
  q("upholster.fabric", "m", "Fabric used today", "Ткани за сутки"),
  q("upholster.rework", "%", "Rework rate", "Переделка", { range: { min: 0, max: 100 } }),
  q("upholster.wip", "-", "WIP units", "НЗП", { encodings: ["i32"] }),
  logical("upholster.staple", "Staple gun fault", "Отказ степлера"),
  enu("upholster.state", ["cut", "sew", "assemble", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-mattress_ln.json", [
  id("mattress_ln.id", "Mattress production line id", "ID линии матрасов"),
  q("mattress_ln.output", "/h", "Mattresses per hour", "Матрасов в час"),
  q("mattress_ln.coil", "-", "Coil units assembled", "Пружинных блоков", { encodings: ["i32"] }),
  q("mattress_ln.quilt", "m/min", "Quilter speed", "Скорость стёжки"),
  q("mattress_ln.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("mattress_ln.tape", "m/min", "Tape-edge speed", "Скорость окантовки"),
  logical("mattress_ln.spec.ok", "Firmness spec OK", "Жёсткость OK"),
  enu("mattress_ln.type", ["innerspring", "foam", "hybrid", "other"], "Type", "Тип"),
]);

write("layer-b-particlebd.json", [
  id("particlebd.id", "Particleboard line id", "ID линии ДСП"),
  q("particlebd.mat", "t/h", "Mat forming rate", "Формирование ковра"),
  q("particlebd.resin", "%", "Resin content", "Доля смолы", { range: { min: 0, max: 100 } }),
  q("particlebd.density", "kg/m3", "Board density", "Плотность плиты"),
  q("particlebd.formaldehyde", "mg/m3", "Formaldehyde emission", "Эмиссия формальдегида"),
  q("particlebd.output", "m3/h", "Board output", "Выпуск плит"),
  logical("particlebd.spec.ok", "Emission class OK", "Класс эмиссии OK"),
  enu("particlebd.state", ["form", "press", "sand", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-laminate_fl.json", [
  id("laminate_fl.id", "Laminate flooring line id", "ID линии ламината"),
  q("laminate_fl.speed", "m/min", "Line speed", "Скорость линии"),
  q("laminate_fl.press.t", "Cel", "Press temperature", "Температура пресса"),
  q("laminate_fl.wear", "-", "Taber revolutions", "Обороты Табера", { encodings: ["i32"] }),
  q("laminate_fl.click", "%", "Click profile yield", "Выход замка", { range: { min: 0, max: 100 } }),
  q("laminate_fl.output", "m2/h", "Flooring output", "Выпуск покрытия"),
  logical("laminate_fl.delam", "Delamination", "Расслоение"),
  enu("laminate_fl.state", ["press", "mill", "pack", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-edge_bander.json", [
  id("edge_bander.id", "Edge bander id", "ID кромкооблицовочного станка"),
  q("edge_bander.speed", "m/min", "Feed speed", "Скорость подачи"),
  q("edge_bander.glue.t", "Cel", "Glue temperature", "Температура клея"),
  q("edge_bander.parts", "-", "Parts per hour", "Деталей в час", { encodings: ["i32"] }),
  q("edge_bander.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("edge_bander.overhang", "mm", "Edge overhang", "Свес кромки"),
  logical("edge_bander.bond", "Bond OK", "Приклейка OK"),
  enu("edge_bander.state", ["band", "setup", "idle", "fault"], "Machine state", "Состояние станка"),
]);

write("layer-b-paint_wood.json", [
  id("paint_wood.line.id", "Wood finishing line id", "ID линии отделки древесины"),
  q("paint_wood.speed", "m/min", "Conveyor speed", "Скорость конвейера"),
  q("paint_wood.coat", "g/m2", "Coat weight", "Масса покрытия"),
  q("paint_wood.oven", "Cel", "Oven temperature", "Температура печи"),
  q("paint_wood.voc", "mg/m3", "VOC in booth", "ЛОС в камере"),
  q("paint_wood.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("paint_wood.dust", "Dust-free OK", "Пыль OK"),
  enu("paint_wood.state", ["sand", "spray", "cure", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-batt_cell.json", [
  id("batt_cell.line.id", "Battery cell line id", "ID линии ячеек АКБ"),
  q("batt_cell.output", "/h", "Cells per hour", "Ячеек в час"),
  q("batt_cell.capacity", "Ah", "Nominal capacity", "Номинальная ёмкость"),
  q("batt_cell.yield", "%", "First-pass yield", "Выход с первого прохода", { range: { min: 0, max: 100 } }),
  q("batt_cell.dew", "Cel", "Dry-room dew point", "Точка росы сухого помещения"),
  q("batt_cell.o2", "ppm", "Dry-room O2", "O2 сухого помещения"),
  logical("batt_cell.spec.ok", "Cell spec OK", "Спецификация ячейки OK"),
  enu("batt_cell.chem", ["nmc", "lfp", "nca", "lto", "other"], "Chemistry", "Химия"),
]);

write("layer-b-elec_coat.json", [
  id("elec_coat.id", "Electrode coater id", "ID покрытия электродов"),
  q("elec_coat.speed", "m/min", "Web speed", "Скорость полотна"),
  q("elec_coat.coat", "g/m2", "Areal loading", "Нагрузка покрытия"),
  q("elec_coat.oven", "Cel", "Oven temperature", "Температура печи"),
  q("elec_coat.moisture", "ppm", "Residual moisture", "Остаточная влага"),
  q("elec_coat.uniform", "%", "Coat uniformity", "Равномерность", { range: { min: 0, max: 100 } }),
  logical("elec_coat.pin", "Pinholes high", "Много пор"),
  enu("elec_coat.side", ["anode", "cathode", "both"], "Side", "Сторона"),
]);

write("layer-b-cell_assy.json", [
  id("cell_assy.line.id", "Cell assembly line id", "ID линии сборки ячеек"),
  q("cell_assy.speed", "/h", "Cells assembled per hour", "Ячеек в час"),
  q("cell_assy.stack", "-", "Electrode stack count", "Слоёв пакета", { encodings: ["i32"] }),
  q("cell_assy.weld", "%", "Weld pass rate", "Прохождение сварки", { range: { min: 0, max: 100 } }),
  q("cell_assy.electrolyte", "mL", "Electrolyte fill", "Заливка электролита"),
  q("cell_assy.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("cell_assy.leak", "Seal leak", "Утечка герметизации"),
  enu("cell_assy.format", ["pouch", "prismatic", "cyl", "other"], "Format", "Формат"),
]);

write("layer-b-form_batt.json", [
  id("form_batt.id", "Formation line id", "ID линии формирования"),
  q("form_batt.channels", "-", "Channels in use", "Каналов в работе", { encodings: ["i32"] }),
  q("form_batt.current", "A", "Formation current", "Ток формирования"),
  q("form_batt.voltage", "V", "Cell voltage", "Напряжение ячейки"),
  q("form_batt.temp", "Cel", "Formation temperature", "Температура формирования"),
  q("form_batt.time.h", "h", "Cycle time", "Время цикла"),
  logical("form_batt.sei", "SEI formation OK", "SEI OK"),
  enu("form_batt.state", ["charge", "rest", "discharge", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-mod_pack.json", [
  id("mod_pack.line.id", "Module / pack line id", "ID линии модулей/паков"),
  q("mod_pack.output", "/h", "Packs per hour", "Паков в час"),
  q("mod_pack.cells", "-", "Cells per pack", "Ячеек в паке", { encodings: ["i32"] }),
  q("mod_pack.weld", "%", "Busbar weld yield", "Выход сварки шин", { range: { min: 0, max: 100 } }),
  q("mod_pack.torque", "Nm", "Fastener torque", "Момент крепежа"),
  q("mod_pack.leak", "Pa", "Cooling circuit leak test", "Тест контура охлаждения"),
  logical("mod_pack.bms", "BMS flash OK", "Прошивка BMS OK"),
  enu("mod_pack.state", ["stack", "weld", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-batt_test.json", [
  id("batt_test.bench.id", "Battery test bench id", "ID стенда испытаний АКБ"),
  id("batt_test.dut.id", "DUT id", "ID испытуемого"),
  q("batt_test.capacity", "Ah", "Measured capacity", "Измеренная ёмкость"),
  q("batt_test.ir", "mOhm", "Internal resistance", "Внутреннее сопротивление"),
  q("batt_test.temp", "Cel", "Cell temperature", "Температура ячейки"),
  q("batt_test.cycles", "-", "Cycles completed", "Циклов", { encodings: ["i32"] }),
  logical("batt_test.pass", "Test pass", "Испытание пройдено"),
  enu("batt_test.mode", ["capacity", "cycle", "abuse", "other"], "Mode", "Режим"),
]);

write("layer-b-batt_recycle.json", [
  id("batt_recycle.line.id", "Battery recycling line id", "ID линии рециклинга АКБ"),
  q("batt_recycle.feed", "t/h", "Feed rate", "Подача"),
  q("batt_recycle.black", "t/h", "Black mass output", "Выход чёрной массы"),
  q("batt_recycle.recovery", "%", "Metal recovery", "Извлечение металлов", { range: { min: 0, max: 100 } }),
  q("batt_recycle.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  q("batt_recycle.discharge", "%", "Discharge complete", "Разряд завершён", { range: { min: 0, max: 100 } }),
  logical("batt_recycle.fire", "Thermal event", "Термическое событие"),
  enu("batt_recycle.process", ["pyro", "hydro", "direct", "other"], "Process", "Процесс"),
]);

write("layer-b-electrode_mix.json", [
  id("electrode_mix.id", "Electrode slurry mixer id", "ID смесителя электродной суспензии"),
  id("electrode_mix.batch.id", "Batch id", "ID партии"),
  q("electrode_mix.solids", "%", "Solids content", "Сухой остаток", { range: { min: 0, max: 100 } }),
  q("electrode_mix.viscosity", "mPa.s", "Slurry viscosity", "Вязкость суспензии"),
  q("electrode_mix.temp", "Cel", "Mix temperature", "Температура смешения"),
  q("electrode_mix.time.min", "min", "Mix time", "Время смешения"),
  logical("electrode_mix.gel", "Gelling", "Гелирование"),
  enu("electrode_mix.state", ["mix", "degas", "transfer", "fault"], "Mixer state", "Состояние смесителя"),
]);

write("layer-b-slurry_coat.json", [
  id("slurry_coat.id", "Slurry slot-die coater id", "ID щелевого покрытия суспензии"),
  q("slurry_coat.gap", "um", "Die gap", "Зазор головки"),
  q("slurry_coat.flow", "mL/min", "Slurry flow", "Расход суспензии"),
  q("slurry_coat.wet", "um", "Wet thickness", "Мокрая толщина"),
  q("slurry_coat.speed", "m/min", "Web speed", "Скорость полотна"),
  q("slurry_coat.edge", "mm", "Uncoated edge", "Непокрытый край"),
  logical("slurry_coat.streak", "Streak detected", "Полоса"),
  enu("slurry_coat.state", ["coat", "clean", "idle", "fault"], "Coater state", "Состояние покрытия"),
]);

write("layer-b-calender_el.json", [
  id("calender_el.id", "Electrode calender id", "ID каландра электродов"),
  q("calender_el.gap", "um", "Roll gap", "Зазор валков"),
  q("calender_el.force", "kN", "Line force", "Линейное усилие"),
  q("calender_el.density", "g/cm3", "Electrode density", "Плотность электрода"),
  q("calender_el.temp", "Cel", "Roll temperature", "Температура вала"),
  q("calender_el.speed", "m/min", "Web speed", "Скорость полотна"),
  logical("calender_el.wrinkle", "Wrinkle", "Складка"),
  enu("calender_el.state", ["calender", "idle", "maintain", "fault"], "Calender state", "Состояние каландра"),
]);

write("layer-b-smt_line.json", [
  id("smt_line.id", "SMT line id", "ID линии поверхностного монтажа"),
  q("smt_line.cph", "/h", "Components per hour", "Компонентов в час"),
  q("smt_line.ppm", "-", "Defects per million", "Дефектов на миллион", { encodings: ["i32"] }),
  q("smt_line.paste", "%", "Solder paste coverage", "Покрытие пастой", { range: { min: 0, max: 100 } }),
  q("smt_line.nozzle", "-", "Nozzle changes", "Смен насадок", { encodings: ["i32"] }),
  q("smt_line.feeder", "-", "Feeders online", "Питателей онлайн", { encodings: ["i32"] }),
  logical("smt_line.fiducial", "Fiducial miss", "Промах реперных"),
  enu("smt_line.state", ["place", "changeover", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-reflow_ov.json", [
  id("reflow_ov.id", "Reflow oven id", "ID печи оплавления"),
  q("reflow_ov.peak", "Cel", "Peak temperature", "Пиковая температура"),
  q("reflow_ov.tal", "s", "Time above liquidus", "Время выше ликвидуса"),
  q("reflow_ov.speed", "m/min", "Conveyor speed", "Скорость конвейера"),
  q("reflow_ov.o2", "ppm", "Nitrogen O2 residual", "Остаток O2 в азоте"),
  q("reflow_ov.zones", "-", "Zones in spec", "Зон в норме", { encodings: ["i32"] }),
  logical("reflow_ov.profile", "Profile OK", "Профиль OK"),
  enu("reflow_ov.atm", ["air", "n2", "other"], "Atmosphere", "Атмосфера"),
]);

write("layer-b-wave_sold.json", [
  id("wave_sold.id", "Wave solder machine id", "ID машины пайки волной"),
  q("wave_sold.temp", "Cel", "Solder pot temperature", "Температура ванны"),
  q("wave_sold.speed", "m/min", "Conveyor speed", "Скорость конвейера"),
  q("wave_sold.flux", "mL/min", "Flux rate", "Расход флюса"),
  q("wave_sold.dross", "kg", "Dross today", "Дросса за сутки"),
  q("wave_sold.bridges", "-", "Bridges per hour", "Перемычек в час", { encodings: ["i32"] }),
  logical("wave_sold.level", "Pot level OK", "Уровень ванны OK"),
  enu("wave_sold.state", ["solder", "idle", "maintain", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-aoi_insp.json", [
  id("aoi_insp.id", "AOI inspector id", "ID АОИ-инспектора"),
  q("aoi_insp.boards", "/h", "Boards per hour", "Платы в час"),
  q("aoi_insp.false", "%", "False call rate", "Ложные срабатывания", { range: { min: 0, max: 100 } }),
  q("aoi_insp.escape", "ppm", "Escape rate", "Пропуски"),
  q("aoi_insp.defects", "-", "True defects today", "Истинных дефектов", { encodings: ["i32"] }),
  q("aoi_insp.coverage", "%", "Inspection coverage", "Покрытие инспекции", { range: { min: 0, max: 100 } }),
  logical("aoi_insp.cal", "Calibration OK", "Калибровка OK"),
  enu("aoi_insp.state", ["inspect", "teach", "idle", "fault"], "Inspector state", "Состояние инспектора"),
]);

write("layer-b-pcb_ict.json", [
  id("pcb_ict.fixture.id", "ICT fixture id", "ID оснастки внутрисхемного теста"),
  q("pcb_ict.boards", "/h", "Boards tested per hour", "Плат в час"),
  q("pcb_ict.yield", "%", "First-pass yield", "Выход с первого прохода", { range: { min: 0, max: 100 } }),
  q("pcb_ict.probes", "-", "Probes contacting", "Контактирующих зондов", { encodings: ["i32"] }),
  q("pcb_ict.time.s", "s", "Test time", "Время теста"),
  q("pcb_ict.fails", "-", "Fails today", "Провалов за сутки", { encodings: ["i32"] }),
  logical("pcb_ict.contact", "Contact OK", "Контакт OK"),
  enu("pcb_ict.state", ["test", "debug", "idle", "fault"], "Tester state", "Состояние тестера"),
]);

write("layer-b-pcb_etch.json", [
  id("pcb_etch.line.id", "PCB etch line id", "ID линии травления печатных плат"),
  q("pcb_etch.speed", "m/min", "Conveyor speed", "Скорость конвейера"),
  q("pcb_etch.etchant", "g/L", "Etchant concentration", "Концентрация травителя"),
  q("pcb_etch.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("pcb_etch.under", "um", "Undercut", "Подтрав"),
  q("pcb_etch.cu", "um", "Copper remaining", "Остаток меди"),
  logical("pcb_etch.overetch", "Overetch", "Перетрав"),
  enu("pcb_etch.state", ["etch", "strip", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-wire_bond_ic.json", [
  id("wire_bond_ic.id", "IC wire bonder id", "ID разварки ИС"),
  q("wire_bond_ic.uph", "/h", "Units per hour", "Единиц в час"),
  q("wire_bond_ic.force", "cN", "Bond force", "Усилие сварки"),
  q("wire_bond_ic.pull", "cN", "Pull strength", "Прочность на отрыв"),
  q("wire_bond_ic.yield", "%", "Bond yield", "Выход разварки", { range: { min: 0, max: 100 } }),
  q("wire_bond_ic.temp", "Cel", "Stage temperature", "Температура столика"),
  logical("wire_bond_ic.nsop", "NSOP / NSOL", "Несварка"),
  enu("wire_bond_ic.type", ["ball", "wedge", "ribbon", "other"], "Type", "Тип"),
]);

write("layer-b-die_attach.json", [
  id("die_attach.id", "Die attach machine id", "ID машины посадки кристалла"),
  q("die_attach.uph", "/h", "Units per hour", "Единиц в час"),
  q("die_attach.force", "N", "Bond force", "Усилие посадки"),
  q("die_attach.void", "%", "Void area", "Площадь пустот", { range: { min: 0, max: 100 } }),
  q("die_attach.temp", "Cel", "Epoxy / sinter temperature", "Температура эпоксида/спекания"),
  q("die_attach.offset", "um", "Placement offset", "Смещение посадки"),
  logical("die_attach.spec.ok", "Placement OK", "Посадка OK"),
  enu("die_attach.method", ["epoxy", "solder", "sinter", "other"], "Method", "Метод"),
]);

write("layer-b-mold_ic.json", [
  id("mold_ic.id", "IC mold press id", "ID пресса корпусирования ИС"),
  q("mold_ic.temp", "Cel", "Mold temperature", "Температура пресс-формы"),
  q("mold_ic.pressure", "kPa", "Transfer pressure", "Давление передачи"),
  q("mold_ic.cycle.s", "s", "Cycle time", "Время цикла"),
  q("mold_ic.void", "%", "Mold void", "Пустоты заливки", { range: { min: 0, max: 100 } }),
  q("mold_ic.flash", "%", "Flash rate", "Облой", { range: { min: 0, max: 100 } }),
  logical("mold_ic.wire", "Wire sweep", "Снос проволок"),
  enu("mold_ic.state", ["mold", "cure", "idle", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-test_hand.json", [
  id("test_hand.id", "IC test handler id", "ID хендлера тестов ИС"),
  q("test_hand.uph", "/h", "Units per hour", "Единиц в час"),
  q("test_hand.yield", "%", "Bin 1 yield", "Выход bin 1", { range: { min: 0, max: 100 } }),
  q("test_hand.temp", "Cel", "Soak temperature", "Температура выдержки"),
  q("test_hand.jam", "-", "Jams today", "Заторов за сутки", { encodings: ["i32"] }),
  q("test_hand.sites", "-", "Parallel sites", "Параллельных мест", { encodings: ["i32"] }),
  logical("test_hand.contactor", "Contactor wear high", "Износ контактора"),
  enu("test_hand.state", ["test", "index", "idle", "fault"], "Handler state", "Состояние хендлера"),
]);

write("layer-b-semicon_et.json", [
  id("semicon_et.id", "Semiconductor etch tool id", "ID установки травления полупроводников"),
  q("semicon_et.rf", "W", "RF power", "Мощность ВЧ"),
  q("semicon_et.pressure", "Pa", "Chamber pressure", "Давление камеры"),
  q("semicon_et.rate", "nm/min", "Etch rate", "Скорость травления"),
  q("semicon_et.uniform", "%", "Uniformity", "Равномерность", { range: { min: 0, max: 100 } }),
  q("semicon_et.select", "-", "Selectivity", "Селективность"),
  logical("semicon_et.endpoint", "Endpoint detected", "Конец травления"),
  enu("semicon_et.type", ["rie", "wet", "ash", "other"], "Type", "Тип"),
]);

write("layer-b-wafer_cmp.json", [
  id("wafer_cmp.id", "CMP polisher id", "ID полировщика CMP"),
  q("wafer_cmp.downforce", "kPa", "Downforce", "Прижим"),
  q("wafer_cmp.speed", "rpm", "Platen speed", "Обороты планшайбы"),
  q("wafer_cmp.rate", "nm/min", "Removal rate", "Скорость съёма"),
  q("wafer_cmp.rr", "nm", "Within-wafer range", "Разброс по пластине"),
  q("wafer_cmp.slurry", "mL/min", "Slurry flow", "Расход суспензии"),
  logical("wafer_cmp.scratch", "Scratch high", "Царапины"),
  enu("wafer_cmp.state", ["polish", "clean", "idle", "fault"], "Tool state", "Состояние установки"),
]);

write("layer-b-litho_scan.json", [
  id("litho_scan.id", "Lithography scanner id", "ID сканера литографии"),
  q("litho_scan.dose", "mJ/cm2", "Exposure dose", "Доза экспозиции"),
  q("litho_scan.overlay", "nm", "Overlay error", "Ошибка совмещения"),
  q("litho_scan.cd", "nm", "Critical dimension", "Критический размер"),
  q("litho_scan.wph", "/h", "Wafers per hour", "Пластины в час"),
  q("litho_scan.focus", "nm", "Focus offset", "Смещение фокуса"),
  logical("litho_scan.reticle", "Reticle OK", "Ретикл OK"),
  enu("litho_scan.type", ["duv", "euv", "immersion", "other"], "Type", "Тип"),
]);

write("layer-b-cvd_tool.json", [
  id("cvd_tool.id", "CVD tool id", "ID установки CVD"),
  q("cvd_tool.temp", "Cel", "Process temperature", "Температура процесса"),
  q("cvd_tool.pressure", "Pa", "Chamber pressure", "Давление камеры"),
  q("cvd_tool.thick", "nm", "Film thickness", "Толщина плёнки"),
  q("cvd_tool.uniform", "%", "Thickness uniformity", "Равномерность толщины", { range: { min: 0, max: 100 } }),
  q("cvd_tool.rate", "nm/min", "Deposition rate", "Скорость осаждения"),
  logical("cvd_tool.particle", "Particle adders high", "Много частиц"),
  enu("cvd_tool.process", ["pecvd", "lpcvd", "ald", "other"], "Process", "Процесс"),
]);

write("layer-b-pvd_tool.json", [
  id("pvd_tool.id", "PVD / sputter tool id", "ID установки PVD / напыления"),
  q("pvd_tool.power", "kW", "Target power", "Мощность мишени"),
  q("pvd_tool.pressure", "Pa", "Process pressure", "Давление процесса"),
  q("pvd_tool.thick", "nm", "Film thickness", "Толщина плёнки"),
  q("pvd_tool.rs", "Ohm/sq", "Sheet resistance", "Поверхностное сопротивление"),
  q("pvd_tool.uniform", "%", "Uniformity", "Равномерность", { range: { min: 0, max: 100 } }),
  logical("pvd_tool.arc", "Target arcing", "Дуги на мишени"),
  enu("pvd_tool.state", ["sputter", "idle", "maintain", "fault"], "Tool state", "Состояние установки"),
]);

write("layer-b-ion_impl.json", [
  id("ion_impl.id", "Ion implanter id", "ID ионного имплантатора"),
  q("ion_impl.dose", "/cm2", "Implant dose", "Доза имплантации"),
  q("ion_impl.energy", "keV", "Beam energy", "Энергия пучка"),
  q("ion_impl.current", "mA", "Beam current", "Ток пучка"),
  q("ion_impl.uniform", "%", "Dose uniformity", "Равномерность дозы", { range: { min: 0, max: 100 } }),
  q("ion_impl.wph", "/h", "Wafers per hour", "Пластины в час"),
  logical("ion_impl.glitch", "Beam glitch", "Сбой пучка"),
  enu("ion_impl.species", ["b", "p", "as", "bf2", "other"], "Species", "Ион"),
]);

write("layer-b-wafer_cln.json", [
  id("wafer_cln.id", "Wafer clean tool id", "ID установки очистки пластин"),
  q("wafer_cln.particles", "-", "Adders ≥0.1 µm", "Добавленных ≥0.1 мкм", { encodings: ["i32"] }),
  q("wafer_cln.chem", "L/min", "Chemistry flow", "Расход химии"),
  q("wafer_cln.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("wafer_cln.megasonic", "kHz", "Megasonic frequency", "Частота мегазвука"),
  q("wafer_cln.time.s", "s", "Recipe time", "Время рецепта"),
  logical("wafer_cln.watermark", "Watermark risk", "Риск разводов"),
  enu("wafer_cln.process", ["sc1", "sc2", "hf", "dry", "other"], "Process", "Процесс"),
]);

write("layer-b-probe_tst.json", [
  id("probe_tst.id", "Wafer probe tester id", "ID тестера зондажа пластин"),
  q("probe_tst.wph", "/h", "Wafers per hour", "Пластины в час"),
  q("probe_tst.yield", "%", "Die yield", "Выход кристаллов", { range: { min: 0, max: 100 } }),
  q("probe_tst.temp", "Cel", "Chuck temperature", "Температура столика"),
  q("probe_tst.touchdowns", "-", "Touchdowns today", "Касаний за сутки", { encodings: ["i32"] }),
  q("probe_tst.current", "A", "Force current", "Ток форсирования"),
  logical("probe_tst.card", "Probe card OK", "Зондовая карта OK"),
  enu("probe_tst.state", ["probe", "setup", "idle", "fault"], "Tester state", "Состояние тестера"),
]);

write("layer-b-dicing_saw.json", [
  id("dicing_saw.id", "Wafer dicing saw id", "ID дисковой резки пластин"),
  q("dicing_saw.speed", "mm/s", "Cut speed", "Скорость резки"),
  q("dicing_saw.spindle", "rpm", "Spindle speed", "Обороты шпинделя"),
  q("dicing_saw.kerf", "um", "Kerf width", "Ширина пропила"),
  q("dicing_saw.chipping", "um", "Chipping", "Выкрашивание"),
  q("dicing_saw.wph", "/h", "Wafers per hour", "Пластины в час"),
  logical("dicing_saw.blade", "Blade wear high", "Износ диска"),
  enu("dicing_saw.state", ["dice", "clean", "idle", "fault"], "Saw state", "Состояние пилы"),
]);

write("layer-b-fab_upw.json", [
  id("fab_upw.id", "Fab UPW system id", "ID системы ультрачистой воды фаба"),
  q("fab_upw.resistivity", "MOhm.cm", "Resistivity", "Удельное сопротивление"),
  q("fab_upw.toc", "ug/L", "TOC", "ТОС"),
  q("fab_upw.silica", "ug/L", "Silica", "Кремнезём"),
  q("fab_upw.flow", "m3/h", "Loop flow", "Расход контура"),
  q("fab_upw.particles", "/L", "Particles ≥0.05 µm", "Частиц ≥0.05 мкм"),
  logical("fab_upw.spec.ok", "UPW spec OK", "Спецификация УЧВ OK"),
  enu("fab_upw.state", ["supply", "polish", "idle", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-euv_src.json", [
  id("euv_src.id", "EUV source id", "ID источника EUV"),
  q("euv_src.power", "W", "In-band power", "Мощность в полосе"),
  q("euv_src.dose", "%", "Dose stability", "Стабильность дозы", { range: { min: 0, max: 100 } }),
  q("euv_src.tin", "kg/h", "Tin consumption", "Расход олова"),
  q("euv_src.collector", "%", "Collector reflectivity", "Отражение коллектора", { range: { min: 0, max: 100 } }),
  q("euv_src.availability", "%", "Source availability", "Готовность источника", { range: { min: 0, max: 100 } }),
  logical("euv_src.droplet", "Droplet stable", "Капли стабильны"),
  enu("euv_src.state", ["expose", "idle", "maintain", "fault"], "Source state", "Состояние источника"),
]);

write("layer-b-photoresist.json", [
  id("photoresist.track.id", "Resist track id", "ID трека фоторезиста"),
  q("photoresist.thick", "nm", "Resist thickness", "Толщина резиста"),
  q("photoresist.spin", "rpm", "Spin speed", "Обороты центрифуги"),
  q("photoresist.bake", "Cel", "Softbake temperature", "Температура мягкого отжига"),
  q("photoresist.uniform", "%", "Thickness uniformity", "Равномерность толщины", { range: { min: 0, max: 100 } }),
  q("photoresist.dispense", "mL", "Dispense volume", "Объём нанесения"),
  logical("photoresist.edge", "Edge bead OK", "Кромка OK"),
  enu("photoresist.state", ["coat", "bake", "develop", "fault"], "Track state", "Состояние трека"),
]);

write("layer-b-gas_cab_sc.json", [
  id("gas_cab_sc.id", "Specialty gas cabinet id", "ID газового шкафа"),
  q("gas_cab_sc.pressure", "kPa", "Delivery pressure", "Давление подачи"),
  q("gas_cab_sc.flow", "sccm", "Flow", "Расход"),
  q("gas_cab_sc.purity", "%", "Purity", "Чистота", { range: { min: 0, max: 100 } }),
  q("gas_cab_sc.cylinder", "%", "Cylinder remaining", "Остаток баллона", { range: { min: 0, max: 100 } }),
  q("gas_cab_sc.leak", "ppm", "Cabinet leak", "Утечка в шкафу"),
  logical("gas_cab_sc.toxic", "Toxic alarm", "Тревога токсичности"),
  enu("gas_cab_sc.state", ["supply", "purge", "change", "fault"], "Cabinet state", "Состояние шкафа"),
]);

write("layer-b-scrub_sc.json", [
  id("scrub_sc.id", "Fab exhaust scrubber id", "ID скруббера вытяжки фаба"),
  q("scrub_sc.flow", "m3/h", "Exhaust flow", "Расход вытяжки"),
  q("scrub_sc.efficiency", "%", "Abatement efficiency", "Эффективность очистки", { range: { min: 0, max: 100 } }),
  q("scrub_sc.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("scrub_sc.ph", "-", "Scrubber liquor pH", "pH раствора"),
  q("scrub_sc.power", "kW", "Scrubber power", "Мощность скруббера"),
  logical("scrub_sc.bypass", "Bypass open", "Байпас открыт"),
  enu("scrub_sc.type", ["burn", "wet", "plasma", "other"], "Type", "Тип"),
]);

write("layer-b-chiller_fb.json", [
  id("chiller_fb.id", "Fab process chiller id", "ID технологического чиллера фаба"),
  q("chiller_fb.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("chiller_fb.flow", "L/min", "Coolant flow", "Расход теплоносителя"),
  q("chiller_fb.capacity", "kW", "Cooling capacity", "Холодопроизводительность"),
  q("chiller_fb.dp", "kPa", "Circuit DP", "Перепад контура"),
  q("chiller_fb.power", "kW", "Chiller power", "Мощность чиллера"),
  logical("chiller_fb.alarm", "Temperature alarm", "Тревога температуры"),
  enu("chiller_fb.state", ["cool", "standby", "maintain", "fault"], "Chiller state", "Состояние чиллера"),
]);

write("layer-b-dc_pdu.json", [
  id("dc_pdu.id", "Data-center PDU id", "ID PDU ЦОД"),
  q("dc_pdu.power", "kW", "Active power", "Активная мощность"),
  q("dc_pdu.load", "%", "Load", "Загрузка", { range: { min: 0, max: 100 } }),
  q("dc_pdu.voltage", "V", "Voltage", "Напряжение"),
  q("dc_pdu.current", "A", "Current", "Ток"),
  q("dc_pdu.pf", "-", "Power factor", "Коэффициент мощности"),
  logical("dc_pdu.overload", "Overload", "Перегрузка"),
  enu("dc_pdu.state", ["on", "alarm", "offline", "fault"], "PDU state", "Состояние PDU"),
]);

write("layer-b-crac_hall.json", [
  id("crac_hall.id", "CRAC / CRAH unit id", "ID кондиционера машинного зала"),
  q("crac_hall.supply", "Cel", "Supply air temperature", "Температура притока"),
  q("crac_hall.return", "Cel", "Return air temperature", "Температура рециркуляции"),
  q("crac_hall.air", "m3/h", "Airflow", "Расход воздуха"),
  q("crac_hall.cooling", "kW", "Cooling duty", "Холодопроизводительность"),
  q("crac_hall.humidity", "%", "Hall humidity", "Влажность зала", { range: { min: 0, max: 100 } }),
  logical("crac_hall.alarm", "Environmental alarm", "Тревога среды"),
  enu("crac_hall.state", ["cool", "standby", "maintain", "fault"], "Unit state", "Состояние агрегата"),
]);

write("layer-b-ups_dc.json", [
  id("ups_dc.id", "Data-center UPS id", "ID ИБП ЦОД"),
  q("ups_dc.load", "%", "Load", "Загрузка", { range: { min: 0, max: 100 } }),
  q("ups_dc.runtime.min", "min", "Battery runtime", "Время автономии"),
  q("ups_dc.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("ups_dc.input", "V", "Input voltage", "Входное напряжение"),
  q("ups_dc.output", "kW", "Output power", "Выходная мощность"),
  logical("ups_dc.bypass", "On bypass", "На байпасе"),
  enu("ups_dc.state", ["online", "battery", "bypass", "fault"], "UPS state", "Состояние ИБП"),
]);

write("layer-b-gen_dc.json", [
  id("gen_dc.id", "Data-center generator id", "ID генератора ЦОД"),
  q("gen_dc.power", "kW", "Output power", "Выходная мощность"),
  q("gen_dc.freq", "Hz", "Frequency", "Частота"),
  q("gen_dc.fuel", "%", "Fuel level", "Уровень топлива", { range: { min: 0, max: 100 } }),
  q("gen_dc.runtime.h", "h", "Runtime today", "Наработка за сутки"),
  q("gen_dc.temp", "Cel", "Coolant temperature", "Температура охлаждения"),
  logical("gen_dc.ready", "Auto-start ready", "Автозапуск готов"),
  enu("gen_dc.state", ["standby", "run", "test", "fault"], "Generator state", "Состояние генератора"),
]);

write("layer-b-cdu_liquid.json", [
  id("cdu_liquid.id", "Liquid cooling CDU id", "ID CDU жидкостного охлаждения"),
  q("cdu_liquid.supply", "Cel", "Facility water supply", "Подача техводы"),
  q("cdu_liquid.return", "Cel", "Facility water return", "Обратка техводы"),
  q("cdu_liquid.flow", "L/min", "Secondary flow", "Расход вторичного контура"),
  q("cdu_liquid.capacity", "kW", "Cooling capacity", "Холодопроизводительность"),
  q("cdu_liquid.leak", "-", "Leak sensors tripped", "Сработавших датчиков утечки", { encodings: ["i32"] }),
  logical("cdu_liquid.iso", "Isolation valve closed", "Отсечной закрыт"),
  enu("cdu_liquid.state", ["cool", "standby", "maintain", "fault"], "CDU state", "Состояние CDU"),
]);

write("layer-b-rack_pdu.json", [
  id("rack_pdu.id", "Rack PDU id", "ID стоечного PDU"),
  q("rack_pdu.power", "kW", "Rack power", "Мощность стойки"),
  q("rack_pdu.outlets", "-", "Outlets on", "Включённых розеток", { encodings: ["i32"] }),
  q("rack_pdu.current", "A", "Phase current max", "Макс. ток фазы"),
  q("rack_pdu.temp", "Cel", "Inlet temperature", "Температура на входе"),
  q("rack_pdu.load", "%", "Rated load", "Загрузка номинала", { range: { min: 0, max: 100 } }),
  logical("rack_pdu.alarm", "PDU alarm", "Тревога PDU"),
  enu("rack_pdu.state", ["on", "alarm", "offline"], "PDU state", "Состояние PDU"),
]);

write("layer-b-bmc_srv.json", [
  id("bmc_srv.host.id", "Server BMC host id", "ID хоста BMC"),
  q("bmc_srv.inlet", "Cel", "Inlet temperature", "Температура на входе"),
  q("bmc_srv.cpu", "Cel", "CPU temperature", "Температура CPU"),
  q("bmc_srv.power", "W", "Server power", "Мощность сервера"),
  q("bmc_srv.fans", "%", "Fan duty", "Скорость вентиляторов", { range: { min: 0, max: 100 } }),
  q("bmc_srv.health", "-", "Health events", "Событий здоровья", { encodings: ["i32"] }),
  logical("bmc_srv.predict", "Predictive fail", "Прогноз отказа"),
  enu("bmc_srv.state", ["on", "standby", "off", "fault"], "Host state", "Состояние хоста"),
]);

write("layer-b-storage_ar.json", [
  id("storage_ar.id", "Storage array id", "ID дискового массива"),
  q("storage_ar.iops", "/s", "IOPS", "IOPS"),
  q("storage_ar.latency", "ms", "Latency", "Задержка"),
  q("storage_ar.used", "%", "Capacity used", "Занятая ёмкость", { range: { min: 0, max: 100 } }),
  q("storage_ar.temp", "Cel", "Enclosure temperature", "Температура корпуса"),
  q("storage_ar.failed", "-", "Failed drives", "Отказов дисков", { encodings: ["i32"] }),
  logical("storage_ar.degraded", "RAID degraded", "RAID деградирован"),
  enu("storage_ar.state", ["ok", "degraded", "rebuild", "fault"], "Array state", "Состояние массива"),
]);

write("layer-b-net_spine.json", [
  id("net_spine.id", "Spine switch id", "ID spine-коммутатора"),
  q("net_spine.util", "%", "Uplink utilization", "Загрузка аплинков", { range: { min: 0, max: 100 } }),
  q("net_spine.drops", "/s", "Drop rate", "Потери"),
  q("net_spine.temp", "Cel", "ASIC temperature", "Температура ASIC"),
  q("net_spine.power", "W", "Switch power", "Мощность коммутатора"),
  q("net_spine.errors", "-", "Interface errors", "Ошибок интерфейсов", { encodings: ["i32"] }),
  logical("net_spine.congestion", "Congestion", "Затор"),
  enu("net_spine.state", ["forward", "maintain", "fault"], "Switch state", "Состояние коммутатора"),
]);

write("layer-b-vesda_dc.json", [
  id("vesda_dc.id", "VESDA / aspirating smoke id", "ID аспирационного дымового"),
  q("vesda_dc.level", "%", "Smoke obscuration", "Затемнение дымом", { range: { min: 0, max: 100 } }),
  q("vesda_dc.flow", "%", "Sample flow", "Расход пробы", { range: { min: 0, max: 100 } }),
  q("vesda_dc.alert", "-", "Alerts today", "Предупреждений за сутки", { encodings: ["i32"] }),
  q("vesda_dc.filter", "%", "Filter remaining", "Остаток фильтра", { range: { min: 0, max: 100 } }),
  q("vesda_dc.zones", "-", "Zones in alarm", "Зон в тревоге", { encodings: ["i32"] }),
  logical("vesda_dc.fire", "Fire alarm", "Пожарная тревога"),
  enu("vesda_dc.state", ["monitor", "alert", "alarm", "fault"], "Detector state", "Состояние извещателя"),
]);

console.log("Layer B31 seeds written");
