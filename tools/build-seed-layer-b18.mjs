#!/usr/bin/env node
/**
 * Layer B18 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B18", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-tunnel_boring.json", [
  id("tunnel_boring.tbm.id", "TBM id", "ID ТПМК"),
  id("tunnel_boring.drive.id", "Drive id", "ID проходки"),
  q("tunnel_boring.advance", "mm/min", "Advance rate", "Скорость проходки"),
  q("tunnel_boring.thrust", "kN", "Total thrust", "Суммарный распор"),
  q("tunnel_boring.torque", "N.m", "Cutterhead torque", "Момент ротора"),
  q("tunnel_boring.face.p", "kPa", "Face pressure", "Давление забоя"),
  logical("tunnel_boring.stuck", "TBM stuck", "ТПМК зажат"),
  enu("tunnel_boring.mode", ["epb", "slurry", "hard_rock", "open", "other"], "TBM mode", "Режим ТПМК"),
]);

write("layer-b-shotcrete.json", [
  id("shotcrete.rig.id", "Shotcrete rig id", "ID торкрет-установки"),
  q("shotcrete.output", "m3/h", "Spray rate", "Производительность набрызга"),
  q("shotcrete.accel", "%", "Accelerator dose", "Доза ускорителя", { range: { min: 0, max: 100 } }),
  q("shotcrete.rebound", "%", "Rebound", "Отскок", { range: { min: 0, max: 100 } }),
  q("shotcrete.thickness", "mm", "Layer thickness", "Толщина слоя"),
  q("shotcrete.air.p", "kPa", "Air pressure", "Давление воздуха"),
  logical("shotcrete.blockage", "Hose blockage", "Засор рукава"),
  enu("shotcrete.method", ["wet", "dry", "robot", "other"], "Method", "Метод"),
]);

write("layer-b-grout_plant.json", [
  id("grout_plant.id", "Grout plant id", "ID растворного узла"),
  id("grout_plant.hole.id", "Grout hole id", "ID скважины инъекции"),
  q("grout_plant.pressure", "kPa", "Injection pressure", "Давление инъекции"),
  q("grout_plant.flow", "L/min", "Grout flow", "Расход раствора"),
  q("grout_plant.volume", "L", "Injected volume", "Закачанный объём"),
  q("grout_plant.wcr", "-", "Water-cement ratio", "В/Ц"),
  logical("grout_plant.take.done", "Refusal reached", "Отказ достигнут"),
  enu("grout_plant.type", ["cement", "chemical", "foam", "bentonite", "other"], "Grout type", "Тип раствора"),
]);

write("layer-b-segment_lining.json", [
  id("segment_lining.ring.id", "Ring id", "ID кольца обделки"),
  id("segment_lining.tbm.id", "Lining TBM id", "ID ТПМК обделки"),
  q("segment_lining.rings", "-", "Rings built", "Собрано колец", { encodings: ["i32"] }),
  q("segment_lining.gap", "mm", "Annulus gap", "Зазор за обделкой"),
  q("segment_lining.bolt.torque", "N.m", "Bolt torque", "Момент болтов"),
  q("segment_lining.oval", "mm", "Ovality", "Овальность"),
  logical("segment_lining.damage", "Segment damage", "Повреждение тюбинга"),
  enu("segment_lining.state", ["erect", "grout", "advance", "idle", "fault"], "Lining state", "Состояние обделки"),
]);

write("layer-b-rock_bolt.json", [
  id("rock_bolt.pattern.id", "Bolt pattern id", "ID схемы анкеров"),
  id("rock_bolt.hole.id", "Bolt hole id", "ID шпура анкера"),
  q("rock_bolt.length", "m", "Bolt length", "Длина анкера"),
  q("rock_bolt.torque", "N.m", "Install torque", "Момент установки"),
  q("rock_bolt.load", "kN", "Bolt load", "Нагрузка на анкер"),
  q("rock_bolt.grout", "L", "Grout volume", "Объём раствора"),
  logical("rock_bolt.fail", "Bolt failed", "Анкер отказал"),
  enu("rock_bolt.type", ["resin", "grouted", "swellex", "cable", "other"], "Bolt type", "Тип анкера"),
]);

write("layer-b-ground_freeze.json", [
  id("ground_freeze.plant.id", "Freeze plant id", "ID замораживающей станции"),
  id("ground_freeze.hole.id", "Freeze hole id", "ID замораживающей скважины"),
  q("ground_freeze.brine.temp", "Cel", "Brine temperature", "Температура рассола"),
  q("ground_freeze.flow", "L/min", "Brine flow", "Расход рассола"),
  q("ground_freeze.wall.temp", "Cel", "Frozen wall temperature", "Температура ледогрунтовой стенки"),
  q("ground_freeze.thickness", "m", "Wall thickness", "Толщина стенки"),
  logical("ground_freeze.breach", "Wall breach risk", "Риск прорыва стенки"),
  enu("ground_freeze.state", ["freeze", "hold", "thaw", "idle", "fault"], "Plant state", "Состояние станции"),
]);

write("layer-b-sheet_pile.json", [
  id("sheet_pile.wall.id", "Sheet pile wall id", "ID шпунтовой стенки"),
  id("sheet_pile.rig.id", "Driving rig id", "ID копра"),
  q("sheet_pile.depth", "m", "Driven depth", "Глубина забивки"),
  q("sheet_pile.blow", "-", "Blow count", "Число ударов", { encodings: ["i32"] }),
  q("sheet_pile.vib.freq", "Hz", "Vibrator frequency", "Частота вибратора"),
  q("sheet_pile.deviation", "mm", "Plumb deviation", "Отклонение от вертикали"),
  logical("sheet_pile.refusal", "Driving refusal", "Отказ при забивке"),
  enu("sheet_pile.method", ["vibro", "impact", "press", "other"], "Method", "Метод"),
]);

write("layer-b-soil_nail.json", [
  id("soil_nail.wall.id", "Soil nail wall id", "ID стены грунтовых анкеров"),
  id("soil_nail.nail.id", "Nail id", "ID анкера"),
  q("soil_nail.length", "m", "Nail length", "Длина анкера"),
  q("soil_nail.grout.p", "kPa", "Grout pressure", "Давление инъекции"),
  q("soil_nail.test.load", "kN", "Proof load", "Контрольная нагрузка"),
  q("soil_nail.face.thick", "mm", "Facing thickness", "Толщина облицовки"),
  logical("soil_nail.creep", "Creep alarm", "Тревога ползучести"),
  enu("soil_nail.state", ["drill", "grout", "test", "face", "complete"], "Stage", "Стадия"),
]);

write("layer-b-inclinometer.json", [
  id("inclinometer.borehole.id", "Inclinometer borehole id", "ID инклинометрической скважины"),
  q("inclinometer.depth", "m", "Probe depth", "Глубина зонда"),
  q("inclinometer.disp", "mm", "Cumulative displacement", "Накопленное смещение"),
  q("inclinometer.rate", "mm/d", "Displacement rate", "Скорость смещения"),
  q("inclinometer.azimuth", "deg", "Movement azimuth", "Азимут смещения"),
  q("inclinometer.temp", "Cel", "Probe temperature", "Температура зонда"),
  logical("inclinometer.alarm", "Movement alarm", "Тревога смещения"),
  enu("inclinometer.quality", ["good", "suspect", "gap", "offline"], "Data quality", "Качество данных"),
]);

write("layer-b-extensometer.json", [
  id("extensometer.id", "Extensometer id", "ID экстензометра"),
  q("extensometer.disp", "mm", "Displacement", "Смещение"),
  q("extensometer.rate", "mm/d", "Rate", "Скорость"),
  q("extensometer.anchors", "-", "Active anchors", "Активных анкеров", { encodings: ["i32"] }),
  q("extensometer.temp", "Cel", "Sensor temperature", "Температура датчика"),
  q("extensometer.battery", "%", "Logger battery", "Батарея логгера", { range: { min: 0, max: 100 } }),
  logical("extensometer.alarm", "Displacement alarm", "Тревога смещения"),
  enu("extensometer.type", ["rod", "wire", "magnetic", "other"], "Type", "Тип"),
]);

write("layer-b-piezo_net.json", [
  id("piezo_net.sensor.id", "Piezometer id", "ID пьезометра"),
  q("piezo_net.head", "m", "Hydraulic head", "Напор"),
  q("piezo_net.pressure", "kPa", "Pore pressure", "Поровое давление"),
  q("piezo_net.temp", "Cel", "Sensor temperature", "Температура датчика"),
  q("piezo_net.depth", "m", "Tip depth", "Глубина наконечника"),
  q("piezo_net.battery", "%", "Logger battery", "Батарея логгера", { range: { min: 0, max: 100 } }),
  logical("piezo_net.alarm", "Pressure alarm", "Тревога давления"),
  enu("piezo_net.type", ["vibrating_wire", "pneumatic", "standpipe", "other"], "Type", "Тип"),
]);

write("layer-b-dust_suppress.json", [
  id("dust_suppress.system.id", "Dust suppress system id", "ID системы пылеподавления"),
  q("dust_suppress.water", "L/min", "Water rate", "Расход воды"),
  q("dust_suppress.chem", "L/h", "Chemical rate", "Расход реагента"),
  q("dust_suppress.pm10", "ug/m3", "PM10", "PM10"),
  q("dust_suppress.coverage", "%", "Area coverage", "Покрытие площади", { range: { min: 0, max: 100 } }),
  q("dust_suppress.nozzles", "-", "Nozzles active", "Активных форсунок", { encodings: ["i32"] }),
  logical("dust_suppress.wind.high", "Wind too high", "Слишком сильный ветер"),
  enu("dust_suppress.mode", ["spray", "fog", "foam", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-blast_pattern.json", [
  id("blast_pattern.id", "Blast pattern id", "ID схемы взрыва"),
  id("blast_pattern.bench.id", "Bench id", "ID уступа"),
  q("blast_pattern.holes", "-", "Hole count", "Число скважин", { encodings: ["i32"] }),
  q("blast_pattern.burden", "m", "Burden", "Л.с.с."),
  q("blast_pattern.spacing", "m", "Spacing", "Расстояние между скважинами"),
  q("blast_pattern.pf", "kg/m3", "Powder factor", "Удельный расход ВВ"),
  logical("blast_pattern.cleared", "Area cleared", "Зона очищена"),
  enu("blast_pattern.state", ["design", "drill", "load", "fire", "muck", "complete"], "Blast state", "Состояние взрыва"),
]);

write("layer-b-vibration_blast.json", [
  id("vibration_blast.monitor.id", "Blast vibration monitor id", "ID монитора вибрации взрыва"),
  id("vibration_blast.shot.id", "Shot id", "ID взрыва"),
  q("vibration_blast.ppv", "mm/s", "Peak particle velocity", "Пиковая скорость частиц"),
  q("vibration_blast.freq", "Hz", "Dominant frequency", "Доминирующая частота"),
  q("vibration_blast.airblast", "Pa", "Airblast overpressure", "Воздушная волна"),
  q("vibration_blast.distance", "m", "Distance to blast", "Расстояние до взрыва"),
  logical("vibration_blast.exceed", "Limit exceeded", "Превышение лимита"),
  enu("vibration_blast.quality", ["good", "clip", "noise", "offline"], "Record quality", "Качество записи"),
]);

write("layer-b-magazine_store.json", [
  id("magazine_store.id", "Explosives magazine id", "ID склада ВВ"),
  q("magazine_store.temp", "Cel", "Magazine temperature", "Температура склада"),
  q("magazine_store.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("magazine_store.inventory", "kg", "Explosive inventory", "Запас ВВ"),
  q("magazine_store.detonators", "-", "Detonator count", "Число детонаторов", { encodings: ["i32"] }),
  q("magazine_store.access", "-", "Access events today", "Доступов за сутки", { encodings: ["i32"] }),
  logical("magazine_store.intrusion", "Intrusion alarm", "Тревога проникновения"),
  enu("magazine_store.state", ["secure", "issue", "return", "audit", "alarm"], "Magazine state", "Состояние склада"),
]);

write("layer-b-emulsion_plant.json", [
  id("emulsion_plant.id", "Emulsion plant id", "ID завода эмульсии"),
  q("emulsion_plant.prod", "t/h", "Emulsion production", "Выпуск эмульсии"),
  q("emulsion_plant.an.ratio", "-", "AN/fuel ratio", "Соотношение AN/ГСМ"),
  q("emulsion_plant.viscosity", "mPa.s", "Viscosity", "Вязкость"),
  q("emulsion_plant.temp", "Cel", "Process temperature", "Температура процесса"),
  q("emulsion_plant.density", "g/cm3", "Density", "Плотность"),
  logical("emulsion_plant.quality.ok", "Quality OK", "Качество OK"),
  enu("emulsion_plant.state", ["mix", "sensitize", "load", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-crusher_primary.json", [
  id("crusher_primary.id", "Primary crusher id", "ID первичной дробилки"),
  q("crusher_primary.power", "W", "Motor power", "Мощность двигателя"),
  q("crusher_primary.throughput", "t/h", "Throughput", "Производительность"),
  q("crusher_primary.css", "mm", "Closed-side setting", "Разгрузочная щель"),
  q("crusher_primary.level", "%", "Chamber level", "Уровень в камере", { range: { min: 0, max: 100 } }),
  q("crusher_primary.lube.p", "kPa", "Lube pressure", "Давление смазки"),
  logical("crusher_primary.tramp", "Tramp metal", "Недробимый предмет"),
  enu("crusher_primary.type", ["gyratory", "jaw", "impact", "other"], "Type", "Тип"),
]);

write("layer-b-sag_mill.json", [
  id("sag_mill.id", "SAG mill id", "ID SAG-мельницы"),
  q("sag_mill.power", "W", "Mill power", "Мощность мельницы"),
  q("sag_mill.speed", "%", "Critical speed", "Доля критической скорости", { range: { min: 0, max: 100 } }),
  q("sag_mill.bearing.p", "kPa", "Bearing pressure", "Давление подшипника"),
  q("sag_mill.feed", "t/h", "Fresh feed", "Свежее питание"),
  q("sag_mill.fill", "%", "Charge fill", "Заполнение барабана", { range: { min: 0, max: 100 } }),
  logical("sag_mill.overload", "Mill overload", "Перегруз мельницы"),
  enu("sag_mill.state", ["run", "inch", "idle", "maintain", "fault"], "Mill state", "Состояние мельницы"),
]);

write("layer-b-ball_mill.json", [
  id("ball_mill.id", "Ball mill id", "ID шаровой мельницы"),
  q("ball_mill.power", "W", "Mill power", "Мощность мельницы"),
  q("ball_mill.feed", "t/h", "Feed rate", "Подача"),
  q("ball_mill.density", "%", "Pulp density", "Плотность пульпы", { range: { min: 0, max: 100 } }),
  q("ball_mill.product.p80", "um", "Product P80", "P80 продукта"),
  q("ball_mill.ball.charge", "%", "Ball charge", "Загрузка шаров", { range: { min: 0, max: 100 } }),
  logical("ball_mill.sound.high", "Mill sound high", "Высокий шум мельницы"),
  enu("ball_mill.circuit", ["overflow", "grate", "peripheral", "other"], "Discharge", "Разгрузка"),
]);

write("layer-b-hpgr.json", [
  id("hpgr.id", "HPGR id", "ID валковой дробилки высокого давления"),
  q("hpgr.pressure", "MPa", "Specific pressure", "Удельное давление"),
  q("hpgr.gap", "mm", "Roll gap", "Зазор валков"),
  q("hpgr.throughput", "t/h", "Throughput", "Производительность"),
  q("hpgr.power", "W", "Drive power", "Мощность привода"),
  q("hpgr.roll.speed", "m/s", "Roll speed", "Скорость валков"),
  logical("hpgr.skew", "Roll skew", "Перекос валков"),
  enu("hpgr.state", ["run", "idle", "maintain", "fault"], "HPGR state", "Состояние HPGR"),
]);

write("layer-b-flotation_cell.json", [
  id("flotation_cell.id", "Flotation cell id", "ID флотомашины"),
  id("flotation_cell.bank.id", "Flotation bank id", "ID ряда флотации"),
  q("flotation_cell.air", "m3/h", "Air rate", "Расход воздуха"),
  q("flotation_cell.level", "%", "Pulp level", "Уровень пульпы", { range: { min: 0, max: 100 } }),
  q("flotation_cell.frother", "mL/min", "Frother dose", "Доза пенообразователя"),
  q("flotation_cell.recovery", "%", "Cell recovery", "Извлечение в камере", { range: { min: 0, max: 100 } }),
  logical("flotation_cell.sanded", "Cell sanded", "Заиление камеры"),
  enu("flotation_cell.type", ["mech", "column", "jameson", "other"], "Cell type", "Тип камеры"),
]);

write("layer-b-thickener.json", [
  id("thickener.id", "Thickener id", "ID сгустителя"),
  q("thickener.torque", "N.m", "Rake torque", "Момент скребков"),
  q("thickener.bed", "m", "Bed level", "Уровень слоя"),
  q("thickener.underflow", "%", "Underflow density", "Плотность сгущенного", { range: { min: 0, max: 100 } }),
  q("thickener.floc", "mL/min", "Flocculant dose", "Доза флокулянта"),
  q("thickener.overflow.turb", "NTU", "Overflow turbidity", "Мутность слива"),
  logical("thickener.rake.up", "Rake raised", "Скребки подняты"),
  enu("thickener.state", ["run", "rake_up", "idle", "fault"], "Thickener state", "Состояние сгустителя"),
]);

write("layer-b-filter_press.json", [
  id("filter_press.id", "Filter press id", "ID фильтр-пресса"),
  q("filter_press.cycle.min", "min", "Cycle time", "Время цикла"),
  q("filter_press.cake.moist", "%", "Cake moisture", "Влажность кека", { range: { min: 0, max: 100 } }),
  q("filter_press.feed.p", "kPa", "Feed pressure", "Давление питания"),
  q("filter_press.plates", "-", "Plates in service", "Плит в работе", { encodings: ["i32"] }),
  q("filter_press.throughput", "t/h", "Dry solids rate", "Производительность по сухому"),
  logical("filter_press.leak", "Cloth leak", "Протечка ткани"),
  enu("filter_press.state", ["fill", "press", "dry", "discharge", "idle", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-hydrocyclone.json", [
  id("hydrocyclone.cluster.id", "Cyclone cluster id", "ID блока гидроциклонов"),
  q("hydrocyclone.pressure", "kPa", "Feed pressure", "Давление питания"),
  q("hydrocyclone.feed.dens", "%", "Feed density", "Плотность питания", { range: { min: 0, max: 100 } }),
  q("hydrocyclone.uf.dens", "%", "Underflow density", "Плотность песков", { range: { min: 0, max: 100 } }),
  q("hydrocyclone.cut.size", "um", "Cut size", "Размер разделения"),
  q("hydrocyclone.units", "-", "Cyclones online", "Циклонов онлайн", { encodings: ["i32"] }),
  logical("hydrocyclone.roping", "Roping", "Жгут"),
  enu("hydrocyclone.duty", ["classify", "dewater", "deslime", "other"], "Duty", "Назначение"),
]);

write("layer-b-gravity_circuit.json", [
  id("gravity_circuit.id", "Gravity circuit id", "ID гравитационного контура"),
  q("gravity_circuit.feed", "t/h", "Feed rate", "Подача"),
  q("gravity_circuit.conc.grade", "g/t", "Concentrate grade", "Содержание в концентрате"),
  q("gravity_circuit.recovery", "%", "Gravity recovery", "Гравитационное извлечение", { range: { min: 0, max: 100 } }),
  q("gravity_circuit.fluidize", "L/min", "Fluidization water", "Вода псевдоожижения"),
  q("gravity_circuit.speed", "rpm", "Bowl speed", "Обороты чаши"),
  logical("gravity_circuit.purge", "Purge active", "Продувка активна"),
  enu("gravity_circuit.unit", ["knelson", "falcon", "spiral", "jig", "other"], "Unit type", "Тип аппарата"),
]);

write("layer-b-elution_circuit.json", [
  id("elution_circuit.id", "Elution circuit id", "ID контура элюирования"),
  q("elution_circuit.temp", "Cel", "Elution temperature", "Температура элюирования"),
  q("elution_circuit.flow", "L/h", "Eluant flow", "Расход элюента"),
  q("elution_circuit.au", "mg/L", "Pregnant Au", "Au в ПР"),
  q("elution_circuit.cn", "mg/L", "Cyanide", "Цианид"),
  q("elution_circuit.carbon", "t", "Carbon inventory", "Запас угля"),
  logical("elution_circuit.ready", "Strip ready", "Готово к снятию"),
  enu("elution_circuit.process", ["zadra", "aal", "anglo", "other"], "Process", "Процесс"),
]);

write("layer-b-electrowin_cu.json", [
  id("electrowin_cu.cell.id", "EW cell id", "ID ванны электроэкстракции"),
  id("electrowin_cu.tankhouse.id", "EW tankhouse id", "ID цеха электроэкстракции"),
  q("electrowin_cu.current", "A", "Cell current", "Ток ванны"),
  q("electrowin_cu.voltage", "V", "Cell voltage", "Напряжение ванны"),
  q("electrowin_cu.ce", "%", "Current efficiency", "Выход по току", { range: { min: 0, max: 100 } }),
  q("electrowin_cu.cathode", "t/d", "Cathode production", "Выпуск катодов"),
  logical("electrowin_cu.short", "Cell short", "Короткое замыкание"),
  enu("electrowin_cu.state", ["plate", "strip", "idle", "maintain", "fault"], "Cell state", "Состояние ванны"),
]);

write("layer-b-stranding.json", [
  id("stranding.machine.id", "Stranding machine id", "ID крутильной машины"),
  id("stranding.reel.id", "Product reel id", "ID барабана продукции"),
  q("stranding.speed", "m/min", "Line speed", "Скорость линии"),
  q("stranding.lay", "mm", "Lay length", "Шаг свивки"),
  q("stranding.tension", "N", "Wire tension", "Натяжение проволоки"),
  q("stranding.diameter", "mm", "Strand diameter", "Диаметр пряди"),
  logical("stranding.break", "Wire break", "Обрыв проволоки"),
  enu("stranding.product", ["conductor", "armor", "rope", "other"], "Product", "Продукция"),
]);

write("layer-b-cv_line.json", [
  id("cv_line.id", "CV line id", "ID линии непрерывной вулканизации"),
  id("cv_line.reel.id", "CV reel id", "ID барабана CV"),
  q("cv_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("cv_line.tube.temp", "Cel", "CV tube temperature", "Температура трубы CV"),
  q("cv_line.pressure", "kPa", "Tube pressure", "Давление трубы"),
  q("cv_line.diameter", "mm", "Cable diameter", "Диаметр кабеля"),
  logical("cv_line.eccentric", "Eccentricity high", "Высокий эксцентриситет"),
  enu("cv_line.compound", ["xlpe", "epr", "pe", "other"], "Compound", "Компаунд"),
]);

write("layer-b-test_bay.json", [
  id("test_bay.id", "HV test bay id", "ID высоковольтного испытательного стенда"),
  id("test_bay.dut.id", "DUT id", "ID испытуемого"),
  q("test_bay.voltage", "kV", "Test voltage", "Испытательное напряжение"),
  q("test_bay.current", "mA", "Leakage current", "Ток утечки"),
  q("test_bay.duration.s", "s", "Hold duration", "Длительность выдержки"),
  q("test_bay.pd", "pC", "Partial discharge", "Частичные разряды"),
  logical("test_bay.pass", "Test pass", "Испытание пройдено"),
  enu("test_bay.test", ["ac", "dc", "impulse", "pd", "other"], "Test type", "Тип испытания"),
]);

write("layer-b-impulse_test.json", [
  id("impulse_test.generator.id", "Impulse generator id", "ID импульсного генератора"),
  id("impulse_test.dut.id", "Impulse DUT id", "ID испытуемого импульсом"),
  q("impulse_test.peak", "kV", "Peak voltage", "Пиковое напряжение"),
  q("impulse_test.front.us", "us", "Front time", "Длительность фронта"),
  q("impulse_test.tail.us", "us", "Tail time", "Длительность хвоста"),
  q("impulse_test.shots", "-", "Shot count", "Число импульсов", { encodings: ["i32"] }),
  logical("impulse_test.chop", "Chopped wave", "Срезанная волна"),
  enu("impulse_test.wave", ["li", "si", "chopped", "other"], "Waveform", "Форма волны"),
]);

write("layer-b-tap_changer.json", [
  id("tap_changer.id", "OLTC id", "ID РПН"),
  id("tap_changer.xfmr.id", "Transformer id", "ID трансформатора"),
  q("tap_changer.position", "-", "Tap position", "Положение анцапфы", { encodings: ["i32"] }),
  q("tap_changer.ops", "-", "Operation count", "Число переключений", { encodings: ["i32"] }),
  q("tap_changer.motor.current", "A", "Motor current", "Ток двигателя"),
  q("tap_changer.oil.temp", "Cel", "Compartment oil temperature", "Температура масла отсека"),
  logical("tap_changer.in_progress", "Tap in progress", "Переключение идёт"),
  enu("tap_changer.state", ["idle", "raise", "lower", "block", "fault"], "OLTC state", "Состояние РПН"),
]);

write("layer-b-gis_bay.json", [
  id("gis_bay.id", "GIS bay id", "ID ячейки КРУЭ"),
  q("gis_bay.sf6.p", "kPa", "SF6 pressure", "Давление SF6"),
  q("gis_bay.sf6.dew", "Cel", "SF6 dewpoint", "Точка росы SF6"),
  q("gis_bay.pd", "pC", "Partial discharge", "Частичные разряды"),
  q("gis_bay.temp", "Cel", "Bay temperature", "Температура ячейки"),
  q("gis_bay.ops", "-", "CB operations", "Переключений выключателя", { encodings: ["i32"] }),
  logical("gis_bay.sf6.low", "SF6 low", "Низкий SF6"),
  enu("gis_bay.state", ["energized", "isolated", "earthed", "maintain", "fault"], "Bay state", "Состояние ячейки"),
]);

write("layer-b-breaker_test.json", [
  id("breaker_test.set.id", "Breaker test set id", "ID испытательной установки выключателя"),
  id("breaker_test.breaker.id", "Breaker under test id", "ID испытуемого выключателя"),
  q("breaker_test.timing.ms", "ms", "Contact timing", "Время контактов"),
  q("breaker_test.travel", "mm", "Contact travel", "Ход контактов"),
  q("breaker_test.resistance", "Ohm", "Contact resistance", "Сопротивление контактов"),
  q("breaker_test.coil.current", "A", "Coil current", "Ток катушки"),
  logical("breaker_test.pass", "Test pass", "Испытание пройдено"),
  enu("breaker_test.result", ["pass", "fail", "retest", "abort"], "Result", "Результат"),
]);

write("layer-b-relay_test.json", [
  id("relay_test.set.id", "Relay test set id", "ID испытательной установки реле"),
  id("relay_test.relay.id", "Relay under test id", "ID испытуемого реле"),
  q("relay_test.pickup", "A", "Pickup current", "Ток срабатывания"),
  q("relay_test.time.ms", "ms", "Operate time", "Время срабатывания"),
  q("relay_test.points", "-", "Test points", "Точек теста", { encodings: ["i32"] }),
  q("relay_test.fail", "-", "Failed points", "Непройденных точек", { encodings: ["i32"] }),
  logical("relay_test.pass", "Relay pass", "Реле прошло"),
  enu("relay_test.result", ["pass", "fail", "retest", "abort"], "Result", "Результат"),
]);

write("layer-b-ct_vt_lab.json", [
  id("ct_vt_lab.bench.id", "Instrument transformer bench id", "ID стенда ТТ/ТН"),
  id("ct_vt_lab.dut.id", "CT/VT under test id", "ID испытуемого ТТ/ТН"),
  q("ct_vt_lab.ratio.error", "%", "Ratio error", "Погрешность коэффициента", { range: { min: -100, max: 100 } }),
  q("ct_vt_lab.phase.error", "deg", "Phase displacement", "Угловая погрешность"),
  q("ct_vt_lab.burden", "W", "Test burden", "Нагрузка испытания"),
  q("ct_vt_lab.voltage", "V", "Applied voltage", "Приложенное напряжение"),
  logical("ct_vt_lab.pass", "Class pass", "Класс пройден"),
  enu("ct_vt_lab.type", ["ct", "vt", "cvt", "other"], "Type", "Тип"),
]);

write("layer-b-black_start.json", [
  id("black_start.unit.id", "Black-start unit id", "ID блока чёрного пуска"),
  id("black_start.plan.id", "Black-start plan id", "ID плана чёрного пуска"),
  q("black_start.progress", "%", "Restoration progress", "Прогресс восстановления", { range: { min: 0, max: 100 } }),
  q("black_start.freq", "Hz", "Island frequency", "Частота острова"),
  q("black_start.voltage", "kV", "Bus voltage", "Напряжение шин"),
  q("black_start.crank.min", "min", "Crank time remaining", "Остаток времени запуска"),
  logical("black_start.active", "Black-start active", "Чёрный пуск активен"),
  enu("black_start.phase", ["idle", "crank", "energize", "sync", "complete", "abort"], "Phase", "Фаза"),
]);

write("layer-b-island_mode.json", [
  id("island_mode.microgrid.id", "Island microgrid id", "ID островной микросети"),
  q("island_mode.freq", "Hz", "Island frequency", "Частота острова"),
  q("island_mode.voltage", "V", "Island voltage", "Напряжение острова"),
  q("island_mode.load", "W", "Island load", "Нагрузка острова"),
  q("island_mode.gen", "W", "Island generation", "Генерация острова"),
  q("island_mode.soc", "%", "Storage SOC", "SOC накопителя", { range: { min: 0, max: 100 } }),
  logical("island_mode.islanded", "Islanded", "В острове"),
  enu("island_mode.state", ["grid", "island", "resynch", "fault"], "Mode", "Режим"),
]);

write("layer-b-freq_control.json", [
  id("freq_control.area.id", "Control area id", "ID зоны регулирования"),
  q("freq_control.freq", "Hz", "System frequency", "Частота системы"),
  q("freq_control.ace", "W", "ACE", "ACE"),
  q("freq_control.reg", "W", "Regulation MW", "Регулирующая мощность"),
  q("freq_control.bias", "W/Hz", "Frequency bias", "Статизм по частоте"),
  q("freq_control.cps1", "-", "CPS1", "CPS1"),
  logical("freq_control.alert", "Frequency alert", "Тревога частоты"),
  enu("freq_control.mode", ["agc", "manual", "emergency", "other"], "Control mode", "Режим управления"),
]);

write("layer-b-voltage_control.json", [
  id("voltage_control.bus.id", "Controlled bus id", "ID регулируемой шины"),
  q("voltage_control.voltage", "kV", "Bus voltage", "Напряжение шины"),
  q("voltage_control.setpoint", "kV", "Voltage setpoint", "Уставка напряжения"),
  q("voltage_control.reactive", "var", "Reactive output", "Выдача реактивной"),
  q("voltage_control.tap", "-", "Tap position", "Положение анцапфы", { encodings: ["i32"] }),
  q("voltage_control.cap", "var", "Cap bank vars", "Вар батареи"),
  logical("voltage_control.limit", "Voltage limit", "Предел напряжения"),
  enu("voltage_control.device", ["avr", "oltc", "svc", "statcom", "cap", "other"], "Device", "Устройство"),
]);

write("layer-b-load_shed.json", [
  id("load_shed.scheme.id", "Load-shed scheme id", "ID схемы АЧР"),
  id("load_shed.feeder.id", "Shed feeder id", "ID отключаемого фидера"),
  q("load_shed.freq", "Hz", "Trigger frequency", "Частота срабатывания"),
  q("load_shed.armed", "-", "Steps armed", "Вооружённых ступеней", { encodings: ["i32"] }),
  q("load_shed.shed.mw", "W", "Shed MW", "Отключённая мощность"),
  q("load_shed.delay.ms", "ms", "Step delay", "Задержка ступени"),
  logical("load_shed.tripped", "Scheme tripped", "Схема сработала"),
  enu("load_shed.state", ["armed", "tripped", "blocked", "reset", "fault"], "Scheme state", "Состояние схемы"),
]);

write("layer-b-spinning_reserve.json", [
  id("spinning_reserve.unit.id", "Reserve unit id", "ID блока резерва"),
  q("spinning_reserve.headroom", "W", "Headroom", "Свободная мощность"),
  q("spinning_reserve.ramp", "W", "Ramp rate", "Скорость набора"),
  q("spinning_reserve.response.s", "s", "Response time", "Время отклика"),
  q("spinning_reserve.committed", "W", "Committed reserve", "Заявленный резерв"),
  q("spinning_reserve.deployed", "W", "Deployed reserve", "Выданный резерв"),
  logical("spinning_reserve.available", "Reserve available", "Резерв доступен"),
  enu("spinning_reserve.class", ["spinning", "non_spin", "replacement", "other"], "Class", "Класс"),
]);

write("layer-b-inertia_monitor.json", [
  id("inertia_monitor.area.id", "Inertia area id", "ID зоны инерции"),
  q("inertia_monitor.inertia", "J.s", "System inertia", "Инерция системы"),
  q("inertia_monitor.rocof", "Hz/s", "RoCoF", "Скорость изменения частоты"),
  q("inertia_monitor.nadir", "Hz", "Frequency nadir", "Минимум частоты"),
  q("inertia_monitor.snsp", "%", "SNSP", "Доля несинхронной генерации", { range: { min: 0, max: 100 } }),
  q("inertia_monitor.online", "J.s", "Online inertia", "Онлайн-инерция"),
  logical("inertia_monitor.low", "Low inertia alert", "Тревога низкой инерции"),
  enu("inertia_monitor.quality", ["good", "estimated", "degraded", "offline"], "Estimate quality", "Качество оценки"),
]);

write("layer-b-ore_pass.json", [
  id("ore_pass.id", "Ore pass id", "ID рудоспуска"),
  q("ore_pass.level", "%", "Fill level", "Уровень заполнения", { range: { min: 0, max: 100 } }),
  q("ore_pass.flow", "t/h", "Draw rate", "Скорость выпуска"),
  q("ore_pass.hang.up", "-", "Hang-up events", "Зависаний", { encodings: ["i32"] }),
  q("ore_pass.vibration", "mm/s", "Wall vibration", "Вибрация стенок"),
  q("ore_pass.temp", "Cel", "Pass temperature", "Температура рудоспуска"),
  logical("ore_pass.blocked", "Pass blocked", "Рудоспуск забит"),
  enu("ore_pass.state", ["open", "draw", "hang", "blast_clear", "closed", "fault"], "Pass state", "Состояние рудоспуска"),
]);

write("layer-b-muck_haul.json", [
  id("muck_haul.truck.id", "Muck truck id", "ID самосвала породы"),
  id("muck_haul.cycle.id", "Haul cycle id", "ID рейса"),
  q("muck_haul.load", "t", "Payload", "Груз"),
  q("muck_haul.cycle.min", "min", "Cycle time", "Время цикла"),
  q("muck_haul.distance", "km", "Haul distance", "Дальность откатки"),
  q("muck_haul.fuel", "L/h", "Fuel rate", "Расход топлива"),
  logical("muck_haul.queue", "At queue", "В очереди"),
  enu("muck_haul.state", ["load", "haul", "dump", "spot", "idle", "fault"], "Truck state", "Состояние самосвала"),
]);

write("layer-b-core_stack.json", [
  id("core_stack.line.id", "Core stacking line id", "ID линии шихтовки магнитопровода"),
  id("core_stack.core.id", "Core id", "ID магнитопровода"),
  q("core_stack.lamination", "-", "Laminations stacked", "Набрано листов", { encodings: ["i32"] }),
  q("core_stack.gap", "mm", "Joint gap", "Зазор стыка"),
  q("core_stack.pressure", "kPa", "Clamp pressure", "Давление зажима"),
  q("core_stack.loss", "W/kg", "Predicted core loss", "Прогноз потерь в стали"),
  logical("core_stack.burr", "Burr detected", "Обнаружен заусенец"),
  enu("core_stack.type", ["step_lap", "butt", "wound", "other"], "Core type", "Тип магнитопровода"),
]);

write("layer-b-winding_machine.json", [
  id("winding_machine.id", "Winding machine id", "ID намоточного станка"),
  id("winding_machine.coil.id", "Coil id", "ID катушки"),
  q("winding_machine.turns", "-", "Turns wound", "Намотано витков", { encodings: ["i32"] }),
  q("winding_machine.tension", "N", "Wire tension", "Натяжение провода"),
  q("winding_machine.speed", "rpm", "Spindle speed", "Обороты шпинделя"),
  q("winding_machine.layer", "-", "Current layer", "Текущий слой", { encodings: ["i32"] }),
  logical("winding_machine.break", "Wire break", "Обрыв провода"),
  enu("winding_machine.type", ["hv", "lv", "foil", "disc", "other"], "Winding type", "Тип обмотки"),
]);

write("layer-b-oil_fill_xfmr.json", [
  id("oil_fill_xfmr.tank.id", "Transformer tank id", "ID бака трансформатора"),
  q("oil_fill_xfmr.vacuum", "Pa", "Fill vacuum", "Вакуум при заливке"),
  q("oil_fill_xfmr.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  q("oil_fill_xfmr.moisture", "ppm", "Oil moisture", "Влага в масле"),
  q("oil_fill_xfmr.level", "%", "Oil level", "Уровень масла", { range: { min: 0, max: 100 } }),
  q("oil_fill_xfmr.bdv", "kV", "Oil BDV", "Пробивное напряжение масла"),
  logical("oil_fill_xfmr.ready", "Ready for energize", "Готов к включению"),
  enu("oil_fill_xfmr.state", ["evac", "fill", "impregnate", "settle", "complete", "fault"], "Fill state", "Состояние заливки"),
]);

write("layer-b-bushing_test.json", [
  id("bushing_test.set.id", "Bushing test set id", "ID установки испытания вводов"),
  id("bushing_test.bushing.id", "Bushing id", "ID ввода"),
  q("bushing_test.cap", "F", "Capacitance", "Ёмкость"),
  q("bushing_test.pf", "%", "Power factor", "Тангенс угла потерь", { range: { min: 0, max: 100 } }),
  q("bushing_test.voltage", "kV", "Test voltage", "Испытательное напряжение"),
  q("bushing_test.temp", "Cel", "Bushing temperature", "Температура ввода"),
  logical("bushing_test.pass", "Test pass", "Испытание пройдено"),
  enu("bushing_test.result", ["pass", "fail", "retest", "abort"], "Result", "Результат"),
]);

write("layer-b-synch_check.json", [
  id("synch_check.bay.id", "Sync-check bay id", "ID ячейки синхронизации"),
  q("synch_check.dV", "V", "Voltage difference", "Разность напряжений"),
  q("synch_check.df", "Hz", "Frequency difference", "Разность частот"),
  q("synch_check.dangle", "deg", "Angle difference", "Разность углов"),
  q("synch_check.window.s", "s", "Sync window", "Окно синхронизации"),
  q("synch_check.slip", "Hz", "Slip frequency", "Частота скольжения"),
  logical("synch_check.in_window", "In sync window", "В окне синхронизации"),
  enu("synch_check.state", ["monitor", "ready", "close", "block", "fault"], "Sync state", "Состояние синхронизации"),
]);

write("layer-b-caisson.json", [
  id("caisson.id", "Caisson id", "ID кессона"),
  q("caisson.air.lock.p", "kPa", "Air-lock pressure", "Давление шлюза"),
  q("caisson.advance", "m/d", "Sink rate", "Скорость погружения"),
  q("caisson.edge.resist", "kPa", "Cutting-edge resistance", "Сопротивление ножа"),
  q("caisson.tilt", "deg", "Tilt", "Крен"),
  q("caisson.workers", "-", "Workers below", "Рабочих внизу", { encodings: ["i32"] }),
  logical("caisson.blow", "Blow risk", "Риск выброса"),
  enu("caisson.state", ["sink", "excavate", "seal", "hold", "fault"], "Caisson state", "Состояние кессона"),
]);

write("layer-b-cofferdam.json", [
  id("cofferdam.id", "Cofferdam id", "ID перемычки"),
  q("cofferdam.water.out", "m", "Inside water level", "Уровень воды внутри"),
  q("cofferdam.pump.rate", "m3/h", "Dewatering rate", "Производительность откачки"),
  q("cofferdam.seepage", "L/min", "Seepage", "Фильтрация"),
  q("cofferdam.strut.force", "kN", "Strut force", "Усилие распорки"),
  q("cofferdam.freeboard", "m", "Freeboard", "Запас борта"),
  logical("cofferdam.flood", "Flood risk", "Риск затопления"),
  enu("cofferdam.state", ["install", "dewater", "work", "flood", "remove"], "Cofferdam state", "Состояние перемычки"),
]);

write("layer-b-auger_cast.json", [
  id("auger_cast.rig.id", "CFA rig id", "ID буровой CFA"),
  id("auger_cast.pile.id", "CFA pile id", "ID сваи CFA"),
  q("auger_cast.depth", "m", "Drill depth", "Глубина бурения"),
  q("auger_cast.concrete", "m3", "Concrete volume", "Объём бетона"),
  q("auger_cast.pressure", "kPa", "Concrete pressure", "Давление бетона"),
  q("auger_cast.auger.rpm", "rpm", "Auger RPM", "Обороты шнека"),
  logical("auger_cast.overbreak", "Overbreak", "Перебур"),
  enu("auger_cast.state", ["drill", "concrete", "cage", "complete", "fault"], "Pile state", "Состояние сваи"),
]);

write("layer-b-slope_monitor.json", [
  id("slope_monitor.site.id", "Slope site id", "ID склонового участка"),
  id("slope_monitor.prism.id", "Prism id", "ID призмы"),
  q("slope_monitor.disp", "mm", "Displacement", "Смещение"),
  q("slope_monitor.rate", "mm/d", "Velocity", "Скорость"),
  q("slope_monitor.accel", "mm/d", "Acceleration", "Ускорение"),
  q("slope_monitor.rain", "mm", "Rain since last", "Осадки с прошлого замера"),
  logical("slope_monitor.alarm", "Slope alarm", "Тревога склона"),
  enu("slope_monitor.level", ["green", "yellow", "orange", "red"], "Alarm level", "Уровень тревоги"),
]);

write("layer-b-partial_discharge.json", [
  id("partial_discharge.sensor.id", "PD sensor id", "ID датчика ЧР"),
  id("partial_discharge.asset.id", "Monitored asset id", "ID контролируемого актива"),
  q("partial_discharge.qiec", "pC", "Apparent charge", "Кажущийся заряд"),
  q("partial_discharge.pps", "/s", "Pulses per second", "Импульсов в секунду"),
  q("partial_discharge.noise", "dB", "Noise floor", "Шумовой пол"),
  q("partial_discharge.phase", "deg", "Phase resolved peak", "Фазовый пик"),
  logical("partial_discharge.alarm", "PD alarm", "Тревога ЧР"),
  enu("partial_discharge.source", ["void", "corona", "surface", "floating", "unknown"], "Likely source", "Вероятный источник"),
]);

write("layer-b-meter_lab.json", [
  id("meter_lab.bench.id", "Meter lab bench id", "ID стенда поверки счётчиков"),
  id("meter_lab.meter.id", "Meter under test id", "ID поверяемого счётчика"),
  q("meter_lab.error", "%", "Registration error", "Погрешность учёта", { range: { min: -100, max: 100 } }),
  q("meter_lab.current", "A", "Test current", "Ток испытания"),
  q("meter_lab.pf", "-", "Test power factor", "Коэффициент мощности испытания"),
  q("meter_lab.points", "-", "Load points", "Точек нагрузки", { encodings: ["i32"] }),
  logical("meter_lab.pass", "Calibration pass", "Поверка пройдена"),
  enu("meter_lab.result", ["pass", "fail", "adjust", "abort"], "Result", "Результат"),
]);

write("layer-b-converter_vessel.json", [
  id("converter_vessel.id", "Converter vessel id", "ID конвертера"),
  id("converter_vessel.heat.id", "Converter heat id", "ID плавки конвертера"),
  q("converter_vessel.blow.o2", "m3/h", "Oxygen blow", "Продувка кислородом"),
  q("converter_vessel.bath.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("converter_vessel.slag.basicity", "-", "Slag basicity", "Основность шлака"),
  q("converter_vessel.lance.height", "m", "Lance height", "Высота фурмы"),
  logical("converter_vessel.slopping", "Slopping", "Выбросы"),
  enu("converter_vessel.state", ["charge", "blow", "reblow", "tap", "idle", "fault"], "Converter state", "Состояние конвертера"),
]);

write("layer-b-anode_furnace.json", [
  id("anode_furnace.id", "Anode furnace id", "ID анодной печи"),
  id("anode_furnace.heat.id", "Anode furnace heat id", "ID плавки анодной печи"),
  q("anode_furnace.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("anode_furnace.s", "%", "Sulfur content", "Содержание серы", { range: { min: 0, max: 100 } }),
  q("anode_furnace.o2", "m3/h", "Poling / O2 rate", "Расход кислорода/дразнения"),
  q("anode_furnace.cu", "%", "Copper grade", "Содержание меди", { range: { min: 0, max: 100 } }),
  logical("anode_furnace.ready", "Cast ready", "Готово к разливке"),
  enu("anode_furnace.state", ["charge", "oxidize", "reduce", "cast", "idle", "fault"], "Furnace state", "Состояние печи"),
]);

console.log("Layer B18 seeds written");
