#!/usr/bin/env node
/**
 * Layer B17 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B17", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-scrubber_fgd.json", [
  id("scrubber_fgd.id", "FGD scrubber id", "ID скруббера сероочистки"),
  q("scrubber_fgd.so2.in", "ppm", "Inlet SO2", "SO2 на входе"),
  q("scrubber_fgd.so2.out", "ppm", "Outlet SO2", "SO2 на выходе"),
  q("scrubber_fgd.ph", "-", "Slurry pH", "pH суспензии"),
  q("scrubber_fgd.limestone", "t/h", "Limestone feed", "Подача известняка"),
  q("scrubber_fgd.gypsum", "t/h", "Gypsum make", "Выпуск гипса"),
  logical("scrubber_fgd.bypass", "Bypass open", "Байпас открыт"),
  enu("scrubber_fgd.type", ["wet", "dry", "semidry", "other"], "Type", "Тип"),
]);

write("layer-b-esp_dust.json", [
  id("esp_dust.id", "ESP id", "ID электрофильтра"),
  q("esp_dust.voltage", "kV", "Field voltage", "Напряжение поля"),
  q("esp_dust.current", "mA", "Field current", "Ток поля"),
  q("esp_dust.opacity", "%", "Outlet opacity", "Дымность на выходе", { range: { min: 0, max: 100 } }),
  q("esp_dust.rapping", "/h", "Rapping rate", "Частота встряхивания"),
  q("esp_dust.spark", "/min", "Spark rate", "Частота пробоев"),
  logical("esp_dust.hopper.full", "Hopper full", "Бункер полон"),
  enu("esp_dust.state", ["energized", "offline", "purge", "fault"], "ESP state", "Состояние ЭФ"),
]);

write("layer-b-baghouse.json", [
  id("baghouse.id", "Baghouse id", "ID рукавного фильтра"),
  q("baghouse.dp", "Pa", "Differential pressure", "Перепад давления"),
  q("baghouse.pulse", "/min", "Pulse rate", "Частота импульсов"),
  q("baghouse.temp", "Cel", "Gas temperature", "Температура газа"),
  q("baghouse.dust", "mg/m3", "Outlet dust", "Пыль на выходе"),
  q("baghouse.bags", "-", "Bags in service", "Рукавов в работе", { encodings: ["i32"] }),
  logical("baghouse.broken.bag", "Broken bag", "Порванный рукав"),
  enu("baghouse.state", ["filter", "pulse", "offline", "fault"], "Baghouse state", "Состояние фильтра"),
]);

write("layer-b-flare_gas.json", [
  id("flare_gas.id", "Flare stack id", "ID факела"),
  q("flare_gas.flow", "m3/h", "Flare gas flow", "Расход факельного газа"),
  q("flare_gas.pilot.flame", "-", "Pilot flame strength", "Сила пламени запальника"),
  q("flare_gas.tip.temp", "Cel", "Tip temperature", "Температура оголовка"),
  q("flare_gas.steam", "kg/h", "Assist steam", "Пар помощи"),
  q("flare_gas.smokeless", "%", "Smokeless capacity", "Бездымная способность", { range: { min: 0, max: 100 } }),
  logical("flare_gas.pilot.out", "Pilot out", "Запальник погас"),
  enu("flare_gas.state", ["standby", "purge", "flaring", "emergency", "offline"], "Flare state", "Состояние факела"),
]);

write("layer-b-vapor_recovery.json", [
  id("vapor_recovery.id", "VRU id", "ID установки рекуперации паров"),
  q("vapor_recovery.flow", "m3/h", "Vapor flow", "Расход паров"),
  q("vapor_recovery.efficiency", "%", "Recovery efficiency", "КПД рекуперации", { range: { min: 0, max: 100 } }),
  q("vapor_recovery.hc.out", "ppm", "Outlet HC", "УВ на выходе"),
  q("vapor_recovery.adsorb.temp", "Cel", "Adsorbent temperature", "Температура адсорбента"),
  q("vapor_recovery.vacuum", "kPa", "Regeneration vacuum", "Вакуум регенерации"),
  logical("vapor_recovery.breakthrough", "Breakthrough", "Проскок"),
  enu("vapor_recovery.process", ["adsorb", "absorb", "condense", "membrane", "other"], "Process", "Процесс"),
]);

write("layer-b-tank_gauging.json", [
  id("tank_gauging.tank.id", "Gauged tank id", "ID измеряемого резервуара"),
  q("tank_gauging.level", "m", "Product level", "Уровень продукта"),
  q("tank_gauging.temp", "Cel", "Average temperature", "Средняя температура"),
  q("tank_gauging.density", "kg/m3", "Observed density", "Наблюдаемая плотность"),
  q("tank_gauging.volume", "m3", "Gross volume", "Валовый объём"),
  q("tank_gauging.water", "mm", "Free water", "Свободная вода"),
  logical("tank_gauging.alarm.hh", "High-high alarm", "Авария верхнего уровня"),
  enu("tank_gauging.method", ["servo", "radar", "float", "htg", "other"], "Method", "Метод"),
]);

write("layer-b-jetty_ops.json", [
  id("jetty_ops.id", "Jetty id", "ID причала"),
  id("jetty_ops.vessel.id", "Berthed vessel id", "ID ошвартованного судна"),
  q("jetty_ops.load.rate", "t/h", "Transfer rate", "Скорость перевалки"),
  q("jetty_ops.draft", "m", "Alongside draft", "Осадка у причала"),
  q("jetty_ops.wind", "m/s", "Jetty wind", "Ветер на причале"),
  q("jetty_ops.current", "m/s", "Current", "Течение"),
  logical("jetty_ops.esd", "ESD active", "Аварийный останов"),
  enu("jetty_ops.state", ["idle", "berth", "connect", "transfer", "disconnect", "weather"], "Jetty state", "Состояние причала"),
]);

write("layer-b-mooring_sys.json", [
  id("mooring_sys.berth.id", "Mooring berth id", "ID швартовного причала"),
  id("mooring_sys.line.id", "Mooring line id", "ID швартова"),
  q("mooring_sys.tension", "kN", "Line tension", "Натяжение швартова"),
  q("mooring_sys.hook.load", "kN", "Quick-release hook load", "Нагрузка на гак"),
  q("mooring_sys.fender", "kN", "Fender load", "Нагрузка на кранцы"),
  q("mooring_sys.offset", "m", "Ship offset", "Смещение судна"),
  logical("mooring_sys.alarm", "Tension alarm", "Тревога натяжения"),
  enu("mooring_sys.state", ["secure", "adjust", "release", "idle", "fault"], "Mooring state", "Состояние швартовки"),
]);

write("layer-b-bunker_fuel.json", [
  id("bunker_fuel.barge.id", "Bunker barge id", "ID бункеровщика"),
  id("bunker_fuel.delivery.id", "Bunker delivery id", "ID бункеровки"),
  q("bunker_fuel.mass", "t", "Delivered mass", "Отданная масса"),
  q("bunker_fuel.flow", "t/h", "Transfer rate", "Скорость перекачки"),
  q("bunker_fuel.temp", "Cel", "Fuel temperature", "Температура топлива"),
  q("bunker_fuel.viscosity", "mPa.s", "Viscosity", "Вязкость"),
  logical("bunker_fuel.sample", "Sample taken", "Проба отобрана"),
  enu("bunker_fuel.grade", ["vlsfo", "hsfo", "mgo", "lng", "methanol", "other"], "Grade", "Марка"),
]);

write("layer-b-ship_engine.json", [
  id("ship_engine.id", "Main engine id", "ID ГД"),
  id("ship_engine.vessel.id", "Vessel id", "ID судна"),
  q("ship_engine.power", "W", "Shaft power", "Мощность на валу"),
  q("ship_engine.rpm", "rpm", "Engine RPM", "Обороты двигателя"),
  q("ship_engine.fuel.rate", "kg/h", "Fuel rate", "Расход топлива"),
  q("ship_engine.exhaust.temp", "Cel", "Exhaust temperature", "Температура выхлопа"),
  logical("ship_engine.slowdown", "Slowdown active", "Замедление активно"),
  enu("ship_engine.state", ["stop", "standby", "run", "maneuver", "fault"], "Engine state", "Состояние двигателя"),
]);

write("layer-b-propulsion.json", [
  id("propulsion.shaft.id", "Propulsion shaft id", "ID гребного вала"),
  q("propulsion.thrust", "kN", "Thrust", "Упор"),
  q("propulsion.torque", "N.m", "Shaft torque", "Крутящий момент"),
  q("propulsion.pitch", "%", "Propeller pitch", "Шаг винта", { range: { min: 0, max: 100 } }),
  q("propulsion.bearing.temp", "Cel", "Bearing temperature", "Температура подшипника"),
  q("propulsion.vibration", "mm/s", "Shaft vibration", "Вибрация вала"),
  logical("propulsion.astern", "Astern", "Задний ход"),
  enu("propulsion.type", ["fpp", "cpp", "azimuth", "waterjet", "other"], "Propulsor", "Движитель"),
]);

write("layer-b-thruster.json", [
  id("thruster.id", "Thruster id", "ID подруливающего устройства"),
  q("thruster.power", "W", "Thruster power", "Мощность ПУ"),
  q("thruster.angle", "deg", "Azimuth angle", "Угол азимута"),
  q("thruster.unit.rpm", "rpm", "Thruster RPM", "Обороты ПУ"),
  q("thruster.load", "%", "Load", "Нагрузка", { range: { min: 0, max: 100 } }),
  q("thruster.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  logical("thruster.emstop", "Emergency stop", "Аварийный останов"),
  enu("thruster.type", ["tunnel", "azimuth", "retractable", "other"], "Type", "Тип"),
]);

write("layer-b-dp_system.json", [
  id("dp_system.vessel.id", "DP vessel id", "ID судна с ДП"),
  q("dp_system.pos.error", "m", "Position error", "Ошибка позиции"),
  q("dp_system.heading.error", "deg", "Heading error", "Ошибка курса"),
  q("dp_system.wind", "m/s", "Relative wind", "Относительный ветер"),
  q("dp_system.power.avail", "%", "Power available", "Доступная мощность", { range: { min: 0, max: 100 } }),
  q("dp_system.consequence", "-", "Consequence class", "Класс последствий", { encodings: ["i32"] }),
  logical("dp_system.green", "Green zone", "Зелёная зона"),
  enu("dp_system.class", ["dp1", "dp2", "dp3", "other"], "DP class", "Класс ДП"),
]);

write("layer-b-radar_nav.json", [
  id("radar_nav.id", "Nav radar id", "ID навигационного радара"),
  id("radar_nav.vessel.id", "Radar vessel id", "ID судна радара"),
  q("radar_nav.range", "km", "Range scale", "Шкала дальности"),
  q("radar_nav.targets", "-", "Tracked targets", "Сопровождаемых целей", { encodings: ["i32"] }),
  q("radar_nav.heading", "deg", "Heading marker", "Курсовая черта"),
  q("radar_nav.sea.clutter", "%", "Sea clutter", "Морские помехи", { range: { min: 0, max: 100 } }),
  logical("radar_nav.arpa", "ARPA active", "ARPA активна"),
  enu("radar_nav.band", ["x", "s", "dual", "other"], "Band", "Диапазон"),
]);

write("layer-b-autopilot_nav.json", [
  id("autopilot_nav.id", "Autopilot id", "ID авторулевого"),
  id("autopilot_nav.vessel.id", "Autopilot vessel id", "ID судна авторулевого"),
  q("autopilot_nav.set.heading", "deg", "Set heading", "Заданный курс"),
  q("autopilot_nav.actual.heading", "deg", "Actual heading", "Фактический курс"),
  q("autopilot_nav.rudder", "deg", "Rudder angle", "Угол руля"),
  q("autopilot_nav.yaw.rate", "deg/s", "Yaw rate", "Угловая скорость рыскания"),
  logical("autopilot_nav.engaged", "Autopilot engaged", "Авторулевой включён"),
  enu("autopilot_nav.mode", ["heading", "track", "wind", "standby", "fault"], "Mode", "Режим"),
]);

write("layer-b-hull_stress.json", [
  id("hull_stress.vessel.id", "Hull monitor vessel id", "ID судна мониторинга корпуса"),
  q("hull_stress.sagging", "MPa", "Sagging stress", "Напряжение прогиба"),
  q("hull_stress.hogging", "MPa", "Hogging stress", "Напряжение перегиба"),
  q("hull_stress.torsion", "MPa", "Torsional stress", "Кручение"),
  q("hull_stress.accel", "m/s2", "Bow acceleration", "Ускорение носа"),
  q("hull_stress.slamming", "/h", "Slam events", "Удары волн"),
  logical("hull_stress.alarm", "Stress alarm", "Тревога напряжений"),
  enu("hull_stress.sea", ["calm", "moderate", "rough", "extreme"], "Sea state", "Волнение"),
]);

write("layer-b-inert_gas.json", [
  id("inert_gas.system.id", "IG system id", "ID системы инертного газа"),
  q("inert_gas.o2", "%", "IG oxygen", "Кислород в ИГ", { range: { min: 0, max: 100 } }),
  q("inert_gas.pressure", "kPa", "Deck pressure", "Давление на палубе"),
  q("inert_gas.flow", "m3/h", "IG flow", "Расход ИГ"),
  q("inert_gas.temp", "Cel", "IG temperature", "Температура ИГ"),
  q("inert_gas.dewpoint", "Cel", "IG dewpoint", "Точка росы ИГ"),
  logical("inert_gas.high.o2", "High O2", "Высокий O2"),
  enu("inert_gas.state", ["produce", "topup", "vent", "offline", "fault"], "IG state", "Состояние ИГ"),
]);

write("layer-b-cargo_pump.json", [
  id("cargo_pump.id", "Cargo pump id", "ID грузового насоса"),
  id("cargo_pump.tank.id", "Source tank id", "ID танка-источника"),
  q("cargo_pump.rate", "m3/h", "Pump rate", "Производительность"),
  q("cargo_pump.pressure", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("cargo_pump.rpm", "rpm", "Pump RPM", "Обороты насоса"),
  q("cargo_pump.temp", "Cel", "Casing temperature", "Температура корпуса"),
  logical("cargo_pump.cavitation", "Cavitation", "Кавитация"),
  enu("cargo_pump.state", ["stop", "start", "run", "strip", "fault"], "Pump state", "Состояние насоса"),
]);

write("layer-b-gangway.json", [
  id("gangway.id", "Gangway id", "ID трапа"),
  id("gangway.berth.id", "Gangway berth id", "ID причала трапа"),
  q("gangway.angle", "deg", "Gangway angle", "Угол трапа"),
  q("gangway.length", "m", "Extended length", "Выдвинутая длина"),
  q("gangway.load", "kg", "Live load", "Полезная нагрузка"),
  q("gangway.motion", "mm", "Relative motion", "Относительное перемещение"),
  logical("gangway.landed", "Landed", "Посажен"),
  enu("gangway.state", ["stowed", "deploy", "landed", "recover", "fault"], "Gangway state", "Состояние трапа"),
]);

write("layer-b-jet_bridge.json", [
  id("jet_bridge.id", "Jet bridge id", "ID телетрапа"),
  id("jet_bridge.stand.id", "Gate stand id", "ID стоянки у выхода"),
  q("jet_bridge.cabin.height", "m", "Cabin height", "Высота кабины"),
  q("jet_bridge.extension", "m", "Bridge extension", "Выдвижение моста"),
  q("jet_bridge.rotation", "deg", "Rotation angle", "Угол поворота"),
  q("jet_bridge.floor.slope", "%", "Floor slope", "Уклон пола", { range: { min: 0, max: 100 } }),
  logical("jet_bridge.docked", "Aircraft docked", "Стыковка с ВС"),
  enu("jet_bridge.state", ["park", "approach", "docked", "retract", "fault"], "Bridge state", "Состояние телетрапа"),
]);

write("layer-b-apron_ops.json", [
  id("apron_ops.stand.id", "Apron stand id", "ID стоянки на перроне"),
  id("apron_ops.flight.id", "Flight id", "ID рейса"),
  q("apron_ops.vehicles", "-", "Vehicles on stand", "Техники на стоянке", { encodings: ["i32"] }),
  q("apron_ops.turn.min", "min", "Turnaround time", "Время оборота"),
  q("apron_ops.fuel.progress", "%", "Fueling progress", "Прогресс заправки", { range: { min: 0, max: 100 } }),
  q("apron_ops.bag.progress", "%", "Bag progress", "Прогресс багажа", { range: { min: 0, max: 100 } }),
  logical("apron_ops.fod", "FOD detected", "Обнаружен FOD"),
  enu("apron_ops.phase", ["inbound", "onblock", "service", "push", "clear", "idle"], "Phase", "Фаза"),
]);

write("layer-b-gpu_unit.json", [
  id("gpu_unit.id", "GPU id", "ID наземного источника питания"),
  id("gpu_unit.stand.id", "GPU stand id", "ID стоянки GPU"),
  q("gpu_unit.voltage", "V", "Output voltage", "Выходное напряжение"),
  q("gpu_unit.current", "A", "Output current", "Выходной ток"),
  q("gpu_unit.freq", "Hz", "Frequency", "Частота"),
  q("gpu_unit.load", "%", "Load", "Нагрузка", { range: { min: 0, max: 100 } }),
  logical("gpu_unit.connected", "Aircraft connected", "Подключено к ВС"),
  enu("gpu_unit.type", ["fixed", "mobile", "diesel", "electric", "other"], "Type", "Тип"),
]);

write("layer-b-pushback_ops.json", [
  id("pushback_ops.tug.id", "Pushback tug id", "ID тягача"),
  id("pushback_ops.flight.id", "Pushback flight id", "ID рейса на выталкивании"),
  q("pushback_ops.force", "kN", "Push force", "Усилие выталкивания"),
  q("pushback_ops.speed", "m/s", "Push speed", "Скорость выталкивания"),
  q("pushback_ops.heading", "deg", "Aircraft heading", "Курс ВС"),
  q("pushback_ops.duration.s", "s", "Push duration", "Длительность выталкивания"),
  logical("pushback_ops.towbar", "Towbar connected", "Штанга подключена"),
  enu("pushback_ops.state", ["connect", "push", "disconnect", "idle", "fault"], "Push state", "Состояние выталкивания"),
]);

write("layer-b-fids.json", [
  id("fids.display.id", "FIDS display id", "ID табло FIDS"),
  id("fids.flight.id", "Displayed flight id", "ID отображаемого рейса"),
  q("fids.updates", "/h", "Update rate", "Частота обновлений"),
  q("fids.latency.s", "s", "Data latency", "Задержка данных"),
  q("fids.brightness", "%", "Brightness", "Яркость", { range: { min: 0, max: 100 } }),
  q("fids.errors", "-", "Display errors", "Ошибки отображения", { encodings: ["i32"] }),
  logical("fids.online", "Display online", "Табло онлайн"),
  enu("fids.view", ["departures", "arrivals", "gate", "baggage", "other"], "View", "Вид"),
]);

write("layer-b-gate_assign.json", [
  id("gate_assign.gate.id", "Gate id", "ID выхода"),
  id("gate_assign.flight.id", "Assigned flight id", "ID назначенного рейса"),
  q("gate_assign.dwell.min", "min", "Gate dwell", "Простой у выхода"),
  q("gate_assign.conflicts", "-", "Conflict count", "Число конфликтов", { encodings: ["i32"] }),
  q("gate_assign.buffer.min", "min", "Buffer time", "Буферное время"),
  q("gate_assign.pax", "-", "Expected passengers", "Ожидаемые пассажиры", { encodings: ["i32"] }),
  logical("gate_assign.locked", "Assignment locked", "Назначение зафиксировано"),
  enu("gate_assign.status", ["free", "assigned", "boarding", "closed", "blocked"], "Status", "Статус"),
]);

write("layer-b-turnaround_ops.json", [
  id("turnaround_ops.flight.id", "Turnaround flight id", "ID рейса на обороте"),
  id("turnaround_ops.stand.id", "Turnaround stand id", "ID стоянки оборота"),
  q("turnaround_ops.planned.min", "min", "Planned turn", "Плановый оборот"),
  q("turnaround_ops.actual.min", "min", "Actual turn", "Фактический оборот"),
  q("turnaround_ops.critical.path", "%", "Critical path progress", "Прогресс критического пути", { range: { min: 0, max: 100 } }),
  q("turnaround_ops.delays", "-", "Open delays", "Открытые задержки", { encodings: ["i32"] }),
  logical("turnaround_ops.ready", "Ready for departure", "Готов к вылету"),
  enu("turnaround_ops.phase", ["inbound", "onblock", "service", "boarding", "push", "complete"], "Phase", "Фаза"),
]);

write("layer-b-catering_load.json", [
  id("catering_load.truck.id", "Catering truck id", "ID кейтерингового грузовика"),
  id("catering_load.flight.id", "Catering flight id", "ID рейса кейтеринга"),
  q("catering_load.carts", "-", "Carts loaded", "Загружено тележек", { encodings: ["i32"] }),
  q("catering_load.mass", "kg", "Load mass", "Масса загрузки"),
  q("catering_load.lift.height", "m", "Lift height", "Высота подъёма"),
  q("catering_load.duration.min", "min", "Service duration", "Длительность обслуживания"),
  logical("catering_load.secure", "Load secured", "Груз закреплён"),
  enu("catering_load.state", ["stage", "dock", "load", "offload", "complete", "fault"], "State", "Состояние"),
]);

write("layer-b-uld_ops.json", [
  id("uld_ops.uld.id", "ULD id", "ID ULD"),
  id("uld_ops.flight.id", "ULD flight id", "ID рейса ULD"),
  q("uld_ops.mass", "kg", "ULD mass", "Масса ULD"),
  q("uld_ops.volume", "m3", "Used volume", "Используемый объём"),
  q("uld_ops.build.min", "min", "Build time", "Время сборки"),
  q("uld_ops.pieces", "-", "Pieces", "Мест", { encodings: ["i32"] }),
  logical("uld_ops.secured", "Net secured", "Сетка закреплена"),
  enu("uld_ops.type", ["pmc", "ake", "akn", "pag", "other"], "ULD type", "Тип ULD"),
]);

write("layer-b-tilt_tray.json", [
  id("tilt_tray.id", "Tilt-tray sorter id", "ID сортера с опрокидыванием"),
  q("tilt_tray.rate", "/h", "Sort rate", "Производительность сортировки"),
  q("tilt_tray.accuracy", "%", "Sort accuracy", "Точность сортировки", { range: { min: 0, max: 100 } }),
  q("tilt_tray.recirc", "%", "Recirc rate", "Доля рециркуляции", { range: { min: 0, max: 100 } }),
  q("tilt_tray.chutes", "-", "Active chutes", "Активных лотков", { encodings: ["i32"] }),
  q("tilt_tray.speed", "m/s", "Carrier speed", "Скорость носителя"),
  logical("tilt_tray.jam", "Jam", "Замятие"),
  enu("tilt_tray.state", ["run", "idle", "purge", "maintain", "fault"], "Sorter state", "Состояние сортера"),
]);

write("layer-b-shoe_sorter.json", [
  id("shoe_sorter.id", "Shoe sorter id", "ID сортера с башмаками"),
  q("shoe_sorter.rate", "/h", "Sort rate", "Производительность"),
  q("shoe_sorter.divert.acc", "%", "Divert accuracy", "Точность отвода", { range: { min: 0, max: 100 } }),
  q("shoe_sorter.gap", "mm", "Item gap", "Интервал между грузами"),
  q("shoe_sorter.lanes", "-", "Active lanes", "Активных линий", { encodings: ["i32"] }),
  q("shoe_sorter.missort", "%", "Missort rate", "Доля ошибочной сортировки", { range: { min: 0, max: 100 } }),
  logical("shoe_sorter.photoeye", "Photoeye blocked", "Фотодатчик перекрыт"),
  enu("shoe_sorter.state", ["run", "idle", "clear", "fault"], "Sorter state", "Состояние сортера"),
]);

write("layer-b-putwall.json", [
  id("putwall.id", "Putwall id", "ID стены выкладки"),
  id("putwall.order.id", "Putwall order id", "ID заказа putwall"),
  q("putwall.slots", "-", "Active slots", "Активных ячеек", { encodings: ["i32"] }),
  q("putwall.puts", "/h", "Puts per hour", "Выкладок в час"),
  q("putwall.complete", "%", "Orders complete", "Заказов завершено", { range: { min: 0, max: 100 } }),
  q("putwall.exceptions", "-", "Exceptions", "Исключения", { encodings: ["i32"] }),
  logical("putwall.full", "Slot full", "Ячейка полна"),
  enu("putwall.state", ["open", "put", "pack", "idle", "fault"], "Putwall state", "Состояние putwall"),
]);

write("layer-b-voice_pick.json", [
  id("voice_pick.device.id", "Voice device id", "ID голосового терминала"),
  id("voice_pick.picker.id", "Picker id", "ID комплектовщика"),
  q("voice_pick.lines", "/h", "Lines per hour", "Строк в час"),
  q("voice_pick.accuracy", "%", "Pick accuracy", "Точность отбора", { range: { min: 0, max: 100 } }),
  q("voice_pick.battery", "%", "Device battery", "Батарея устройства", { range: { min: 0, max: 100 } }),
  q("voice_pick.exceptions", "-", "Exceptions", "Исключения", { encodings: ["i32"] }),
  logical("voice_pick.online", "Device online", "Устройство онлайн"),
  enu("voice_pick.state", ["login", "pick", "break", "logout", "fault"], "Session state", "Состояние сессии"),
]);

write("layer-b-autostore.json", [
  id("autostore.grid.id", "AutoStore grid id", "ID сетки AutoStore"),
  id("autostore.robot.id", "AutoStore robot id", "ID робота AutoStore"),
  q("autostore.bins", "-", "Bins in system", "Контейнеров в системе", { encodings: ["i32"] }),
  q("autostore.robots", "-", "Robots online", "Роботов онлайн", { encodings: ["i32"] }),
  q("autostore.ports", "-", "Ports active", "Активных портов", { encodings: ["i32"] }),
  q("autostore.tph", "/h", "Bins per hour", "Контейнеров в час"),
  logical("autostore.blocked", "Grid blocked", "Сетка заблокирована"),
  enu("autostore.state", ["run", "idle", "recover", "maintain", "fault"], "Grid state", "Состояние сетки"),
]);

write("layer-b-shuttle_asrs.json", [
  id("shuttle_asrs.aisle.id", "Shuttle aisle id", "ID прохода шаттлов"),
  id("shuttle_asrs.shuttle.id", "Shuttle id", "ID шаттла"),
  q("shuttle_asrs.speed", "m/s", "Shuttle speed", "Скорость шаттла"),
  q("shuttle_asrs.lifts", "-", "Lifts online", "Подъёмников онлайн", { encodings: ["i32"] }),
  q("shuttle_asrs.tph", "/h", "Transactions per hour", "Транзакций в час"),
  q("shuttle_asrs.util", "%", "Utilization", "Загрузка", { range: { min: 0, max: 100 } }),
  logical("shuttle_asrs.stuck", "Shuttle stuck", "Шаттл застрял"),
  enu("shuttle_asrs.state", ["run", "idle", "recover", "maintain", "fault"], "Aisle state", "Состояние прохода"),
]);

write("layer-b-stretch_hood.json", [
  id("stretch_hood.id", "Stretch-hood machine id", "ID машины стретч-худа"),
  id("stretch_hood.pallet.id", "Pallet id", "ID паллеты"),
  q("stretch_hood.film", "um", "Film thickness", "Толщина плёнки"),
  q("stretch_hood.cycle.s", "s", "Cycle time", "Время цикла"),
  q("stretch_hood.height", "mm", "Hood height", "Высота колпака"),
  q("stretch_hood.force", "N", "Hold-down force", "Усилие прижима"),
  logical("stretch_hood.tear", "Film tear", "Разрыв плёнки"),
  enu("stretch_hood.state", ["feed", "hood", "seal", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-inkjet_code.json", [
  id("inkjet_code.head.id", "Inkjet head id", "ID струйной головки"),
  id("inkjet_code.job.id", "Print job id", "ID задания печати"),
  q("inkjet_code.speed", "m/min", "Line speed", "Скорость линии"),
  q("inkjet_code.viscosity", "mPa.s", "Ink viscosity", "Вязкость чернил"),
  q("inkjet_code.reject", "%", "Code reject rate", "Брак кода", { range: { min: 0, max: 100 } }),
  q("inkjet_code.solvent", "%", "Solvent level", "Уровень растворителя", { range: { min: 0, max: 100 } }),
  logical("inkjet_code.grade.ok", "Code grade OK", "Класс кода OK"),
  enu("inkjet_code.tech", ["cij", "tij", "dod", "laser", "other"], "Technology", "Технология"),
]);

write("layer-b-laser_mark.json", [
  id("laser_mark.id", "Laser marker id", "ID лазерного маркиратора"),
  id("laser_mark.job.id", "Mark job id", "ID задания маркировки"),
  q("laser_mark.power", "W", "Laser power", "Мощность лазера"),
  q("laser_mark.speed", "mm/s", "Mark speed", "Скорость маркировки"),
  q("laser_mark.depth", "um", "Engrave depth", "Глубина гравировки"),
  q("laser_mark.cycle.s", "s", "Cycle time", "Время цикла"),
  logical("laser_mark.interlock", "Interlock OK", "Блокировка OK"),
  enu("laser_mark.source", ["fiber", "co2", "uv", "green", "other"], "Source", "Источник"),
]);

write("layer-b-force_torque.json", [
  id("force_torque.sensor.id", "FT sensor id", "ID датчика сила-момент"),
  id("force_torque.robot.id", "Robot id", "ID робота"),
  q("force_torque.fx", "N", "Force X", "Сила X"),
  q("force_torque.fy", "N", "Force Y", "Сила Y"),
  q("force_torque.fz", "N", "Force Z", "Сила Z"),
  q("force_torque.tz", "N.m", "Torque Z", "Момент Z"),
  logical("force_torque.overload", "Overload", "Перегрузка"),
  enu("force_torque.mode", ["monitor", "control", "teach", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-screwdriving.json", [
  id("screwdriving.station.id", "Screwdriving station id", "ID станции завинчивания"),
  id("screwdriving.program.id", "Screw program id", "ID программы завинчивания"),
  q("screwdriving.torque", "N.m", "Final torque", "Конечный момент"),
  q("screwdriving.angle", "deg", "Final angle", "Конечный угол"),
  q("screwdriving.rpm", "rpm", "Driver RPM", "Обороты шуруповёрта"),
  q("screwdriving.cycle.s", "s", "Cycle time", "Время цикла"),
  logical("screwdriving.ok", "OK result", "Результат OK"),
  enu("screwdriving.result", ["ok", "nook", "rewok", "abort"], "Result", "Результат"),
]);

write("layer-b-riveting.json", [
  id("riveting.gun.id", "Riveter id", "ID клепального пистолета"),
  id("riveting.job.id", "Rivet job id", "ID задания клёпки"),
  q("riveting.force", "kN", "Set force", "Усилие постановки"),
  q("riveting.stroke", "mm", "Stroke", "Ход"),
  q("riveting.cycles", "-", "Rivets set", "Поставлено заклёпок", { encodings: ["i32"] }),
  q("riveting.air.p", "kPa", "Air pressure", "Давление воздуха"),
  logical("riveting.ok", "Set OK", "Постановка OK"),
  enu("riveting.type", ["blind", "solid", "self_pierce", "other"], "Rivet type", "Тип заклёпки"),
]);

write("layer-b-sealant_robot.json", [
  id("sealant_robot.cell.id", "Sealant cell id", "ID ячейки герметика"),
  id("sealant_robot.job.id", "Sealant job id", "ID задания герметика"),
  q("sealant_robot.bead.width", "mm", "Bead width", "Ширина валика"),
  q("sealant_robot.flow", "mL/min", "Dispense flow", "Расход дозирования"),
  q("sealant_robot.speed", "mm/s", "Tool speed", "Скорость инструмента"),
  q("sealant_robot.pressure", "kPa", "Cartridge pressure", "Давление картриджа"),
  logical("sealant_robot.gap", "Gap in bead", "Разрыв валика"),
  enu("sealant_robot.chem", ["pu", "ms", "silicone", "epoxy", "other"], "Chemistry", "Химия"),
]);

write("layer-b-potting.json", [
  id("potting.station.id", "Potting station id", "ID станции заливки компаунда"),
  id("potting.batch.id", "Potting batch id", "ID партии компаунда"),
  q("potting.mix.ratio", "-", "Mix ratio", "Соотношение смешения"),
  q("potting.shot", "mL", "Shot volume", "Объём дозы"),
  q("potting.viscosity", "mPa.s", "Viscosity", "Вязкость"),
  q("potting.cure.temp", "Cel", "Cure temperature", "Температура отверждения"),
  logical("potting.void", "Void detected", "Обнаружена раковина"),
  enu("potting.chem", ["epoxy", "pu", "silicone", "other"], "Chemistry", "Химия"),
]);

write("layer-b-underfill.json", [
  id("underfill.station.id", "Underfill station id", "ID станции подзаливки"),
  id("underfill.board.id", "Board id", "ID платы"),
  q("underfill.volume", "uL", "Dispense volume", "Объём дозирования"),
  q("underfill.temp", "Cel", "Substrate temperature", "Температура подложки"),
  q("underfill.flow.time", "s", "Flow time", "Время растекания"),
  q("underfill.void.pct", "%", "Void percentage", "Доля пустот", { range: { min: 0, max: 100 } }),
  logical("underfill.filleted", "Fillet complete", "Галтель завершена"),
  enu("underfill.state", ["preheat", "dispense", "flow", "cure", "idle", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-die_bond.json", [
  id("die_bond.machine.id", "Die bonder id", "ID установки посадки кристалла"),
  id("die_bond.lot.id", "Bond lot id", "ID партии посадки"),
  q("die_bond.force", "N", "Bond force", "Усилие посадки"),
  q("die_bond.temp", "Cel", "Bond temperature", "Температура посадки"),
  q("die_bond.accuracy", "um", "Placement accuracy", "Точность посадки"),
  q("die_bond.uph", "/h", "Units per hour", "Единиц в час"),
  logical("die_bond.epoxy.ok", "Epoxy OK", "Эпоксид OK"),
  enu("die_bond.process", ["epoxy", "eutectic", "solder", "sinter", "other"], "Process", "Процесс"),
]);

write("layer-b-wire_bond.json", [
  id("wire_bond.machine.id", "Wire bonder id", "ID разварщика"),
  id("wire_bond.lot.id", "Wire bond lot id", "ID партии разварки"),
  q("wire_bond.force", "N", "Bond force", "Усилие разварки"),
  q("wire_bond.us.power", "%", "Ultrasonic power", "Мощность ультразвука", { range: { min: 0, max: 100 } }),
  q("wire_bond.pull", "g", "Pull strength", "Прочность на отрыв"),
  q("wire_bond.uph", "/h", "Bonds per hour", "Разварок в час"),
  logical("wire_bond.nsop", "NSOP", "Неприварка"),
  enu("wire_bond.wire", ["au", "cu", "al", "ag", "other"], "Wire metal", "Металл проволоки"),
]);

write("layer-b-flip_chip.json", [
  id("flip_chip.bonder.id", "Flip-chip bonder id", "ID установки флип-чип"),
  id("flip_chip.lot.id", "Flip-chip lot id", "ID партии флип-чип"),
  q("flip_chip.force", "N", "Bond force", "Усилие посадки"),
  q("flip_chip.temp", "Cel", "Reflow temperature", "Температура оплавления"),
  q("flip_chip.accuracy", "um", "Placement accuracy", "Точность посадки"),
  q("flip_chip.bumps", "-", "Bump count", "Число бампов", { encodings: ["i32"] }),
  logical("flip_chip.void", "Joint void", "Пустота в соединении"),
  enu("flip_chip.process", ["c4", "tcub", "tcncp", "solder", "other"], "Process", "Процесс"),
]);

write("layer-b-ict_test.json", [
  id("ict_test.fixture.id", "ICT fixture id", "ID оснастки ICT"),
  id("ict_test.board.id", "ICT board id", "ID платы ICT"),
  q("ict_test.points", "-", "Test points", "Точек теста", { encodings: ["i32"] }),
  q("ict_test.fail", "-", "Fail count", "Число отказов", { encodings: ["i32"] }),
  q("ict_test.cycle.s", "s", "Cycle time", "Время цикла"),
  q("ict_test.yield", "%", "First-pass yield", "Выход с первого прохода", { range: { min: 0, max: 100 } }),
  logical("ict_test.pass", "Board pass", "Плата прошла"),
  enu("ict_test.result", ["pass", "fail", "retest", "abort"], "Result", "Результат"),
]);

write("layer-b-fct_test.json", [
  id("fct_test.station.id", "FCT station id", "ID станции FCT"),
  id("fct_test.uut.id", "UUT id", "ID испытуемого изделия"),
  q("fct_test.duration.s", "s", "Test duration", "Длительность теста"),
  q("fct_test.steps", "-", "Steps executed", "Выполнено шагов", { encodings: ["i32"] }),
  q("fct_test.yield", "%", "Yield", "Выход", { range: { min: 0, max: 100 } }),
  q("fct_test.power", "W", "UUT power", "Потребление ИИ"),
  logical("fct_test.pass", "FCT pass", "FCT пройден"),
  enu("fct_test.result", ["pass", "fail", "retest", "abort"], "Result", "Результат"),
]);

write("layer-b-htol_test.json", [
  id("htol_test.chamber.id", "HTOL chamber id", "ID камеры HTOL"),
  id("htol_test.lot.id", "HTOL lot id", "ID партии HTOL"),
  q("htol_test.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("htol_test.bias", "V", "Bias voltage", "Напряжение смещения"),
  q("htol_test.duration.h", "h", "Stress duration", "Длительность стресса"),
  q("htol_test.fail", "%", "Fail rate", "Доля отказов", { range: { min: 0, max: 100 } }),
  logical("htol_test.dut.fail", "DUT failed", "Отказ ИС"),
  enu("htol_test.state", ["load", "stress", "readout", "unload", "fault"], "Chamber state", "Состояние камеры"),
]);

write("layer-b-hast_test.json", [
  id("hast_test.chamber.id", "HAST chamber id", "ID камеры HAST"),
  id("hast_test.lot.id", "HAST lot id", "ID партии HAST"),
  q("hast_test.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("hast_test.rh", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("hast_test.pressure", "kPa", "Chamber pressure", "Давление камеры"),
  q("hast_test.duration.h", "h", "Stress duration", "Длительность стресса"),
  logical("hast_test.leak", "Chamber leak", "Натекание камеры"),
  enu("hast_test.bias", ["biased", "unbiased", "other"], "Bias mode", "Режим смещения"),
]);

write("layer-b-boundary_scan.json", [
  id("boundary_scan.station.id", "Boundary scan station id", "ID станции boundary scan"),
  id("boundary_scan.board.id", "JTAG board id", "ID платы JTAG"),
  q("boundary_scan.chains", "-", "TAP chains", "Цепей TAP", { encodings: ["i32"] }),
  q("boundary_scan.faults", "-", "Faults found", "Найдено неисправностей", { encodings: ["i32"] }),
  q("boundary_scan.coverage", "%", "Net coverage", "Покрытие сетей", { range: { min: 0, max: 100 } }),
  q("boundary_scan.time.s", "s", "Test time", "Время теста"),
  logical("boundary_scan.pass", "Scan pass", "Скан пройден"),
  enu("boundary_scan.result", ["pass", "fail", "infra_fail", "abort"], "Result", "Результат"),
]);

write("layer-b-bga_rework.json", [
  id("bga_rework.station.id", "BGA rework station id", "ID станции ремонта BGA"),
  id("bga_rework.board.id", "Rework board id", "ID платы ремонта"),
  q("bga_rework.peak.temp", "Cel", "Peak temperature", "Пиковая температура"),
  q("bga_rework.profile.s", "s", "Profile duration", "Длительность профиля"),
  q("bga_rework.force", "N", "Placement force", "Усилие посадки"),
  q("bga_rework.alignment", "um", "Alignment error", "Ошибка совмещения"),
  logical("bga_rework.xray.ok", "X-ray OK", "Рентген OK"),
  enu("bga_rework.step", ["remove", "clean", "place", "reflow", "inspect", "fault"], "Step", "Шаг"),
]);

write("layer-b-drone_inventory.json", [
  id("drone_inventory.drone.id", "Inventory drone id", "ID дрона инвентаризации"),
  id("drone_inventory.mission.id", "Inventory mission id", "ID миссии инвентаризации"),
  q("drone_inventory.scans", "/h", "Scans per hour", "Сканов в час"),
  q("drone_inventory.accuracy", "%", "Location accuracy", "Точность локации", { range: { min: 0, max: 100 } }),
  q("drone_inventory.battery", "%", "Battery", "Батарея", { range: { min: 0, max: 100 } }),
  q("drone_inventory.aisles", "-", "Aisles covered", "Пройдено проходов", { encodings: ["i32"] }),
  logical("drone_inventory.low.light", "Low light", "Мало света"),
  enu("drone_inventory.state", ["fly", "scan", "charge", "idle", "fault"], "Drone state", "Состояние дрона"),
]);

write("layer-b-rf_gun.json", [
  id("rf_gun.device.id", "RF gun id", "ID ТСД"),
  id("rf_gun.user.id", "Operator id", "ID оператора"),
  q("rf_gun.scans", "/h", "Scans per hour", "Сканов в час"),
  q("rf_gun.battery", "%", "Battery", "Батарея", { range: { min: 0, max: 100 } }),
  q("rf_gun.errors", "-", "Scan errors", "Ошибки сканирования", { encodings: ["i32"] }),
  q("rf_gun.signal", "dBm", "WLAN RSSI", "RSSI WLAN"),
  logical("rf_gun.online", "Device online", "Устройство онлайн"),
  enu("rf_gun.app", ["receive", "pick", "pack", "count", "other"], "Application", "Приложение"),
]);

write("layer-b-wearable_scan.json", [
  id("wearable_scan.device.id", "Wearable scanner id", "ID носимого сканера"),
  id("wearable_scan.user.id", "Wearable user id", "ID пользователя"),
  q("wearable_scan.scans", "/h", "Scans per hour", "Сканов в час"),
  q("wearable_scan.battery", "%", "Battery", "Батарея", { range: { min: 0, max: 100 } }),
  q("wearable_scan.trigger", "-", "Triggers", "Нажатий", { encodings: ["i32"] }),
  q("wearable_scan.uptime.h", "h", "Session uptime", "Время сессии"),
  logical("wearable_scan.paired", "Paired", "Сопряжён"),
  enu("wearable_scan.form", ["ring", "glove", "wrist", "headset", "other"], "Form factor", "Форм-фактор"),
]);

write("layer-b-echo_sounder.json", [
  id("echo_sounder.id", "Echo sounder id", "ID эхолота"),
  id("echo_sounder.vessel.id", "Sounder vessel id", "ID судна эхолота"),
  q("echo_sounder.depth", "m", "Water depth", "Глубина"),
  q("echo_sounder.freq", "Hz", "Frequency", "Частота"),
  q("echo_sounder.draft", "m", "Transducer draft", "Осадка антенны"),
  q("echo_sounder.offset", "m", "Keel offset", "Смещение от киля"),
  logical("echo_sounder.shallow", "Shallow alarm", "Тревога мелководья"),
  enu("echo_sounder.mode", ["single", "dual", "multibeam", "other"], "Mode", "Режим"),
]);

write("layer-b-bilge_sys.json", [
  id("bilge_sys.vessel.id", "Bilge vessel id", "ID судна льял"),
  id("bilge_sys.pump.id", "Bilge pump id", "ID льяльного насоса"),
  q("bilge_sys.level", "mm", "Bilge level", "Уровень в льяле"),
  q("bilge_sys.flow", "L/min", "Pump flow", "Расход насоса"),
  q("bilge_sys.oil", "ppm", "Oil content", "Содержание нефти"),
  q("bilge_sys.runtime.h", "h", "Pump runtime", "Наработка насоса"),
  logical("bilge_sys.high", "High bilge", "Высокий уровень льял"),
  enu("bilge_sys.state", ["dry", "auto", "manual", "alarm", "fault"], "Bilge state", "Состояние льял"),
]);

write("layer-b-hangar_ops.json", [
  id("hangar_ops.id", "Hangar id", "ID ангара"),
  id("hangar_ops.aircraft.id", "Hangar aircraft id", "ID ВС в ангаре"),
  q("hangar_ops.door.open", "%", "Door open", "Открытие ворот", { range: { min: 0, max: 100 } }),
  q("hangar_ops.temp", "Cel", "Hangar temperature", "Температура ангара"),
  q("hangar_ops.occupancy", "-", "Aircraft inside", "ВС внутри", { encodings: ["i32"] }),
  q("hangar_ops.crane.load", "t", "Crane load", "Нагрузка крана"),
  logical("hangar_ops.fire.clear", "Fire clear", "Пожарная готовность OK"),
  enu("hangar_ops.state", ["open", "work", "closed", "emergency", "fault"], "Hangar state", "Состояние ангара"),
]);

write("layer-b-snow_clear.json", [
  id("snow_clear.vehicle.id", "Snow clear vehicle id", "ID снегоуборочной машины"),
  id("snow_clear.runway.id", "Cleared surface id", "ID очищаемой поверхности"),
  q("snow_clear.speed", "m/s", "Vehicle speed", "Скорость машины"),
  q("snow_clear.width", "m", "Clearing width", "Ширина очистки"),
  q("snow_clear.depth", "mm", "Snow depth", "Высота снега"),
  q("snow_clear.friction", "-", "Friction estimate", "Оценка трения"),
  logical("snow_clear.chemical", "Chemical applied", "Химия нанесена"),
  enu("snow_clear.tool", ["plow", "broom", "blower", "spreader", "other"], "Tool", "Орудие"),
]);

write("layer-b-cabin_clean.json", [
  id("cabin_clean.flight.id", "Cabin clean flight id", "ID рейса уборки салона"),
  id("cabin_clean.crew.id", "Clean crew id", "ID бригады уборки"),
  q("cabin_clean.duration.min", "min", "Clean duration", "Длительность уборки"),
  q("cabin_clean.seats", "-", "Seats cleaned", "Очищено кресел", { encodings: ["i32"] }),
  q("cabin_clean.progress", "%", "Progress", "Прогресс", { range: { min: 0, max: 100 } }),
  q("cabin_clean.findings", "-", "Findings", "Находки", { encodings: ["i32"] }),
  logical("cabin_clean.ready", "Cabin ready", "Салон готов"),
  enu("cabin_clean.type", ["transit", "overnight", "deep", "other"], "Clean type", "Тип уборки"),
]);

write("layer-b-potable_water_svc.json", [
  id("potable_water_svc.truck.id", "Water service truck id", "ID водозаправщика"),
  id("potable_water_svc.flight.id", "Water service flight id", "ID рейса водозаправки"),
  q("potable_water_svc.volume", "L", "Water delivered", "Подано воды"),
  q("potable_water_svc.flow", "L/min", "Fill flow", "Расход заправки"),
  q("potable_water_svc.chlorine", "mg/L", "Chlorine residual", "Остаточный хлор"),
  q("potable_water_svc.duration.min", "min", "Service duration", "Длительность обслуживания"),
  logical("potable_water_svc.sample", "Sample taken", "Проба отобрана"),
  enu("potable_water_svc.state", ["approach", "connect", "fill", "disconnect", "complete", "fault"], "State", "Состояние"),
]);

write("layer-b-waste_service.json", [
  id("waste_service.truck.id", "Lavatory truck id", "ID ассенизаторской машины"),
  id("waste_service.flight.id", "Waste service flight id", "ID рейса ассенизации"),
  q("waste_service.volume", "L", "Waste removed", "Откачано отходов"),
  q("waste_service.duration.min", "min", "Service duration", "Длительность обслуживания"),
  q("waste_service.tank.level", "%", "Truck tank level", "Уровень бака машины", { range: { min: 0, max: 100 } }),
  q("waste_service.rinse", "L", "Rinse water", "Вода промывки"),
  logical("waste_service.spill", "Spill", "Разлив"),
  enu("waste_service.state", ["approach", "connect", "pump", "rinse", "complete", "fault"], "State", "Состояние"),
]);

write("layer-b-mail_sort.json", [
  id("mail_sort.machine.id", "Mail sorter id", "ID сортировщика почты"),
  q("mail_sort.rate", "/h", "Items per hour", "Отправлений в час"),
  q("mail_sort.ocr.acc", "%", "OCR accuracy", "Точность OCR", { range: { min: 0, max: 100 } }),
  q("mail_sort.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("mail_sort.bins", "-", "Active bins", "Активных накопителей", { encodings: ["i32"] }),
  q("mail_sort.thickness", "mm", "Max thickness", "Макс. толщина"),
  logical("mail_sort.jam", "Jam", "Замятие"),
  enu("mail_sort.stream", ["letter", "flat", "parcel", "mixed", "other"], "Stream", "Поток"),
]);

write("layer-b-express_hub.json", [
  id("express_hub.id", "Express hub id", "ID экспресс-хаба"),
  q("express_hub.inbound", "/h", "Inbound rate", "Входящий поток"),
  q("express_hub.outbound", "/h", "Outbound rate", "Исходящий поток"),
  q("express_hub.dwell.min", "min", "Average dwell", "Средний простой"),
  q("express_hub.exceptions", "-", "Exceptions open", "Открытых исключений", { encodings: ["i32"] }),
  q("express_hub.dock.util", "%", "Dock utilization", "Загрузка доков", { range: { min: 0, max: 100 } }),
  logical("express_hub.congested", "Hub congested", "Хаб перегружен"),
  enu("express_hub.state", ["peak", "normal", "valley", "closed", "fault"], "Hub state", "Состояние хаба"),
]);

write("layer-b-dispensing.json", [
  id("dispensing.valve.id", "Dispense valve id", "ID дозирующего клапана"),
  id("dispensing.recipe.id", "Dispense recipe id", "ID рецепта дозирования"),
  q("dispensing.volume", "uL", "Dispense volume", "Объём дозы"),
  q("dispensing.pressure", "kPa", "Valve pressure", "Давление клапана"),
  q("dispensing.speed", "mm/s", "Path speed", "Скорость траектории"),
  q("dispensing.weight", "mg", "Shot weight", "Масса дозы"),
  logical("dispensing.clog", "Nozzle clog", "Засор сопла"),
  enu("dispensing.mode", ["dot", "line", "area", "fill", "other"], "Mode", "Режим"),
]);

console.log("Layer B17 seeds written");
