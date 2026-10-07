#!/usr/bin/env node
/**
 * Layer B21 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B21", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-smart_meter_gas.json", [
  id("smart_meter_gas.id", "Gas smart meter id", "ID умного газового счётчика"),
  q("smart_meter_gas.flow", "m3/h", "Gas flow", "Расход газа"),
  q("smart_meter_gas.volume", "m3", "Corrected volume", "Исправленный объём"),
  q("smart_meter_gas.pressure", "kPa", "Line pressure", "Давление в линии"),
  q("smart_meter_gas.temp", "Cel", "Gas temperature", "Температура газа"),
  q("smart_meter_gas.battery", "%", "Meter battery", "Батарея счётчика", { range: { min: 0, max: 100 } }),
  logical("smart_meter_gas.tamper", "Tamper", "Вскрытие"),
  enu("smart_meter_gas.state", ["ok", "low_batt", "tamper", "offline", "fault"], "Meter state", "Состояние счётчика"),
]);

write("layer-b-water_ami.json", [
  id("water_ami.meter.id", "AMI water meter id", "ID AMI-счётчика воды"),
  q("water_ami.flow", "L/h", "Instant flow", "Мгновенный расход"),
  q("water_ami.volume", "m3", "Cumulative volume", "Накопленный объём"),
  q("water_ami.pressure", "kPa", "Service pressure", "Давление у абонента"),
  q("water_ami.leak.score", "%", "Leak score", "Оценка утечки", { range: { min: 0, max: 100 } }),
  q("water_ami.battery", "%", "Meter battery", "Батарея счётчика", { range: { min: 0, max: 100 } }),
  logical("water_ami.leak", "Leak suspected", "Подозрение на утечку"),
  enu("water_ami.state", ["ok", "leak", "reverse", "offline", "fault"], "Meter state", "Состояние счётчика"),
]);

write("layer-b-heat_meter.json", [
  id("heat_meter.id", "Heat meter id", "ID теплосчётчика"),
  q("heat_meter.power", "W", "Thermal power", "Тепловая мощность"),
  q("heat_meter.energy", "Wh", "Thermal energy", "Тепловая энергия"),
  q("heat_meter.flow", "m3/h", "Volume flow", "Объёмный расход"),
  q("heat_meter.supply.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("heat_meter.return.temp", "Cel", "Return temperature", "Температура обратки"),
  logical("heat_meter.error", "Meter error", "Ошибка счётчика"),
  enu("heat_meter.state", ["ok", "error", "no_flow", "offline"], "Meter state", "Состояние счётчика"),
]);

write("layer-b-ev_charger_ac.json", [
  id("ev_charger_ac.id", "AC charger id", "ID AC-зарядки"),
  id("ev_charger_ac.session.id", "Charge session id", "ID сессии зарядки"),
  q("ev_charger_ac.power", "W", "Charge power", "Мощность зарядки"),
  q("ev_charger_ac.energy", "Wh", "Session energy", "Энергия сессии"),
  q("ev_charger_ac.current", "A", "Charge current", "Ток зарядки"),
  q("ev_charger_ac.soc", "%", "Vehicle SOC", "SOC автомобиля", { range: { min: 0, max: 100 } }),
  logical("ev_charger_ac.occupied", "Connector occupied", "Разъём занят"),
  enu("ev_charger_ac.state", ["available", "preparing", "charging", "finishing", "fault", "offline"], "Charger state", "Состояние зарядки"),
]);

write("layer-b-ev_charger_dc.json", [
  id("ev_charger_dc.id", "DC fast charger id", "ID DC-быстрой зарядки"),
  id("ev_charger_dc.session.id", "DCFC session id", "ID сессии DCFC"),
  q("ev_charger_dc.power", "W", "Charge power", "Мощность зарядки"),
  q("ev_charger_dc.voltage", "V", "DC voltage", "Напряжение DC"),
  q("ev_charger_dc.current", "A", "DC current", "Ток DC"),
  q("ev_charger_dc.temp", "Cel", "Connector temperature", "Температура разъёма"),
  logical("ev_charger_dc.liquid.cool", "Liquid cooled", "Жидкостное охлаждение"),
  enu("ev_charger_dc.state", ["available", "charging", "derate", "fault", "offline"], "Charger state", "Состояние зарядки"),
]);

write("layer-b-v2g.json", [
  id("v2g.station.id", "V2G station id", "ID станции V2G"),
  id("v2g.vehicle.id", "V2G vehicle id", "ID автомобиля V2G"),
  q("v2g.power", "W", "Bidirectional power", "Двунаправленная мощность"),
  q("v2g.export", "Wh", "Exported energy", "Отданная энергия"),
  q("v2g.import", "Wh", "Imported energy", "Принятая энергия"),
  q("v2g.soc", "%", "Vehicle SOC", "SOC автомобиля", { range: { min: 0, max: 100 } }),
  logical("v2g.dispatch", "Grid dispatch active", "Диспетчеризация сети активна"),
  enu("v2g.mode", ["charge", "discharge", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-battery_home.json", [
  id("battery_home.id", "Home battery id", "ID домашней батареи"),
  q("battery_home.soc", "%", "State of charge", "SOC", { range: { min: 0, max: 100 } }),
  q("battery_home.power", "W", "Battery power", "Мощность батареи"),
  q("battery_home.temp", "Cel", "Battery temperature", "Температура батареи"),
  q("battery_home.cycles", "-", "Cycle count", "Число циклов", { encodings: ["i32"] }),
  q("battery_home.soh", "%", "State of health", "SOH", { range: { min: 0, max: 100 } }),
  logical("battery_home.backup", "Backup mode", "Резервный режим"),
  enu("battery_home.state", ["idle", "charge", "discharge", "backup", "fault"], "Battery state", "Состояние батареи"),
]);

write("layer-b-micro_inverter.json", [
  id("micro_inverter.id", "Microinverter id", "ID микроинвертора"),
  id("micro_inverter.module.id", "PV module id", "ID модуля"),
  q("micro_inverter.power", "W", "AC power", "Мощность AC"),
  q("micro_inverter.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("micro_inverter.temp", "Cel", "Inverter temperature", "Температура инвертора"),
  q("micro_inverter.voltage.dc", "V", "DC voltage", "Напряжение DC"),
  logical("micro_inverter.grid", "Grid connected", "В сети"),
  enu("micro_inverter.state", ["mppt", "clip", "night", "fault", "offline"], "Inverter state", "Состояние инвертора"),
]);

write("layer-b-tracker_solar.json", [
  id("tracker_solar.id", "Solar tracker id", "ID солнечного трекера"),
  q("tracker_solar.angle", "deg", "Tilt / azimuth angle", "Угол наклона / азимута"),
  q("tracker_solar.setpoint", "deg", "Angle setpoint", "Уставка угла"),
  q("tracker_solar.wind", "m/s", "Wind speed", "Скорость ветра"),
  q("tracker_solar.stow", "%", "Stow progress", "Прогресс укладки", { range: { min: 0, max: 100 } }),
  q("tracker_solar.motor.current", "A", "Motor current", "Ток двигателя"),
  logical("tracker_solar.stowed", "Stowed", "Уложен"),
  enu("tracker_solar.mode", ["track", "stow", "clean", "manual", "fault"], "Mode", "Режим"),
]);

write("layer-b-soiling_sensor.json", [
  id("soiling_sensor.id", "Soiling sensor id", "ID датчика загрязнения"),
  q("soiling_sensor.ratio", "%", "Soiling ratio", "Коэффициент загрязнения", { range: { min: 0, max: 100 } }),
  q("soiling_sensor.loss", "%", "Power loss estimate", "Оценка потери мощности", { range: { min: 0, max: 100 } }),
  q("soiling_sensor.clean.d", "d", "Days since clean", "Дней с очистки"),
  q("soiling_sensor.irradiance", "W/m2", "Reference irradiance", "Эталонная освещённость"),
  q("soiling_sensor.temp", "Cel", "Sensor temperature", "Температура датчика"),
  logical("soiling_sensor.clean.due", "Cleaning due", "Пора чистить"),
  enu("soiling_sensor.quality", ["good", "suspect", "offline"], "Data quality", "Качество данных"),
]);

write("layer-b-electrolyzer_pem.json", [
  id("electrolyzer_pem.id", "PEM electrolyzer id", "ID PEM-электролизёра"),
  q("electrolyzer_pem.power", "W", "Stack power", "Мощность стека"),
  q("electrolyzer_pem.h2", "kg/h", "H2 production", "Выработка H2"),
  q("electrolyzer_pem.current", "A", "Stack current", "Ток стека"),
  q("electrolyzer_pem.voltage", "V", "Stack voltage", "Напряжение стека"),
  q("electrolyzer_pem.temp", "Cel", "Stack temperature", "Температура стека"),
  logical("electrolyzer_pem.trip", "Stack trip", "Отключение стека"),
  enu("electrolyzer_pem.state", ["idle", "ramp", "produce", "standby", "fault"], "Stack state", "Состояние стека"),
]);

write("layer-b-electrolyzer_alk.json", [
  id("electrolyzer_alk.id", "Alkaline electrolyzer id", "ID щелочного электролизёра"),
  q("electrolyzer_alk.power", "W", "System power", "Мощность системы"),
  q("electrolyzer_alk.h2", "kg/h", "H2 production", "Выработка H2"),
  q("electrolyzer_alk.koh", "%", "Electrolyte strength", "Концентрация щёлочи", { range: { min: 0, max: 100 } }),
  q("electrolyzer_alk.temp", "Cel", "Electrolyte temperature", "Температура электролита"),
  q("electrolyzer_alk.pressure", "kPa", "System pressure", "Давление системы"),
  logical("electrolyzer_alk.gas.cross", "Gas crossover", "Переток газа"),
  enu("electrolyzer_alk.state", ["idle", "produce", "purge", "maintain", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-h2_storage.json", [
  id("h2_storage.vessel.id", "H2 storage vessel id", "ID ёмкости хранения H2"),
  q("h2_storage.pressure", "kPa", "Vessel pressure", "Давление ёмкости"),
  q("h2_storage.temp", "Cel", "Gas temperature", "Температура газа"),
  q("h2_storage.mass", "kg", "H2 mass", "Масса H2"),
  q("h2_storage.fill", "%", "Fill level", "Степень заполнения", { range: { min: 0, max: 100 } }),
  q("h2_storage.leak", "ppm", "H2 leak sensor", "Датчик утечки H2"),
  logical("h2_storage.alarm", "Storage alarm", "Тревога хранения"),
  enu("h2_storage.type", ["cgH2", "lh2", "metal_hydride", "other"], "Storage type", "Тип хранения"),
]);

write("layer-b-hydrogen_comp.json", [
  id("hydrogen_comp.id", "H2 compressor id", "ID компрессора H2"),
  q("hydrogen_comp.suction.p", "kPa", "Suction pressure", "Давление всасывания"),
  q("hydrogen_comp.discharge.p", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("hydrogen_comp.flow", "kg/h", "H2 flow", "Расход H2"),
  q("hydrogen_comp.power", "W", "Compressor power", "Мощность компрессора"),
  q("hydrogen_comp.temp", "Cel", "Discharge temperature", "Температура нагнетания"),
  logical("hydrogen_comp.trip", "Compressor trip", "Отключение компрессора"),
  enu("hydrogen_comp.state", ["stop", "load", "unload", "fault"], "Compressor state", "Состояние компрессора"),
]);

write("layer-b-fuel_cell_stack.json", [
  id("fuel_cell_stack.id", "Fuel cell stack id", "ID стека ТЭ"),
  q("fuel_cell_stack.power", "W", "Stack power", "Мощность стека"),
  q("fuel_cell_stack.voltage", "V", "Stack voltage", "Напряжение стека"),
  q("fuel_cell_stack.current", "A", "Stack current", "Ток стека"),
  q("fuel_cell_stack.temp", "Cel", "Stack temperature", "Температура стека"),
  q("fuel_cell_stack.h2.use", "kg/h", "H2 consumption", "Расход H2"),
  logical("fuel_cell_stack.flood", "Cell flooding", "Затопление ячеек"),
  enu("fuel_cell_stack.type", ["pem", "sofc", "pafc", "other"], "Type", "Тип"),
]);

write("layer-b-cng_station.json", [
  id("cng_station.id", "CNG station id", "ID АГНКС"),
  id("cng_station.dispenser.id", "CNG dispenser id", "ID колонки КПГ"),
  q("cng_station.pressure", "kPa", "Cascade pressure", "Давление каскада"),
  q("cng_station.flow", "kg/min", "Fill rate", "Скорость заправки"),
  q("cng_station.temp", "Cel", "Gas temperature", "Температура газа"),
  q("cng_station.mass", "kg", "Dispensed mass", "Отданная масса"),
  logical("cng_station.priority", "Priority fill", "Приоритетная заправка"),
  enu("cng_station.state", ["idle", "fill", "vent", "maintain", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-lpg_terminal.json", [
  id("lpg_terminal.id", "LPG terminal id", "ID терминала СУГ"),
  q("lpg_terminal.tank.level", "%", "Tank level", "Уровень резервуара", { range: { min: 0, max: 100 } }),
  q("lpg_terminal.pressure", "kPa", "Tank pressure", "Давление резервуара"),
  q("lpg_terminal.temp", "Cel", "Product temperature", "Температура продукта"),
  q("lpg_terminal.load.rate", "t/h", "Loading rate", "Скорость налива"),
  q("lpg_terminal.odor", "ppm", "Odorant residual", "Остаток одоранта"),
  logical("lpg_terminal.esd", "ESD active", "Аварийный останов"),
  enu("lpg_terminal.state", ["receive", "store", "load", "idle", "fault"], "Terminal state", "Состояние терминала"),
]);

write("layer-b-steam_header.json", [
  id("steam_header.id", "Steam header id", "ID парового коллектора"),
  q("steam_header.pressure", "kPa", "Header pressure", "Давление коллектора"),
  q("steam_header.temp", "Cel", "Steam temperature", "Температура пара"),
  q("steam_header.flow", "t/h", "Steam flow", "Расход пара"),
  q("steam_header.superheat", "K", "Degrees superheat", "Перегрев"),
  q("steam_header.users", "-", "Users online", "Потребителей онлайн", { encodings: ["i32"] }),
  logical("steam_header.low.p", "Low pressure", "Низкое давление"),
  enu("steam_header.pressure_class", ["lp", "mp", "hp", "vhp"], "Pressure class", "Класс давления"),
]);

write("layer-b-deaerator.json", [
  id("deaerator.id", "Deaerator id", "ID деаэратора"),
  q("deaerator.temp", "Cel", "Water temperature", "Температура воды"),
  q("deaerator.pressure", "kPa", "Vessel pressure", "Давление аппарата"),
  q("deaerator.o2", "ppb", "Dissolved oxygen", "Растворённый кислород"),
  q("deaerator.level", "%", "Water level", "Уровень воды", { range: { min: 0, max: 100 } }),
  q("deaerator.steam", "kg/h", "Pegging steam", "Греющий пар"),
  logical("deaerator.o2.high", "O2 high", "Высокий O2"),
  enu("deaerator.state", ["run", "bypass", "idle", "fault"], "Deaerator state", "Состояние деаэратора"),
]);

write("layer-b-thermal_oil.json", [
  id("thermal_oil.heater.id", "Thermal oil heater id", "ID маслонагревателя"),
  q("thermal_oil.supply.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("thermal_oil.return.temp", "Cel", "Return temperature", "Температура обратки"),
  q("thermal_oil.flow", "m3/h", "Oil flow", "Расход масла"),
  q("thermal_oil.pressure", "kPa", "Loop pressure", "Давление контура"),
  q("thermal_oil.burner", "%", "Burner firing", "Нагрузка горелки", { range: { min: 0, max: 100 } }),
  logical("thermal_oil.expansion.high", "Expansion high", "Высокий уровень расширителя"),
  enu("thermal_oil.state", ["heat", "idle", "cool", "fault"], "Heater state", "Состояние нагревателя"),
]);

write("layer-b-lumber_kiln.json", [
  id("lumber_kiln.id", "Lumber kiln id", "ID сушильной камеры пиломатериалов"),
  id("lumber_kiln.charge.id", "Kiln charge id", "ID садки"),
  q("lumber_kiln.db.temp", "Cel", "Dry-bulb temperature", "Температура сухого термометра"),
  q("lumber_kiln.wb.temp", "Cel", "Wet-bulb temperature", "Температура мокрого термометра"),
  q("lumber_kiln.emc", "%", "EMC", "Равновесная влажность", { range: { min: 0, max: 100 } }),
  q("lumber_kiln.moisture", "%", "Wood moisture", "Влажность древесины", { range: { min: 0, max: 100 } }),
  logical("lumber_kiln.schedule.done", "Schedule complete", "Режим завершён"),
  enu("lumber_kiln.state", ["heat", "dry", "equalize", "cool", "fault"], "Kiln state", "Состояние камеры"),
]);

write("layer-b-plywood_line.json", [
  id("plywood_line.id", "Plywood line id", "ID линии фанеры"),
  q("plywood_line.press.temp", "Cel", "Press temperature", "Температура пресса"),
  q("plywood_line.press.p", "kPa", "Press pressure", "Давление пресса"),
  q("plywood_line.glue", "kg/h", "Glue spread", "Расход клея"),
  q("plywood_line.moisture", "%", "Veneer moisture", "Влажность шпона", { range: { min: 0, max: 100 } }),
  q("plywood_line.throughput", "m3/h", "Panel output", "Выпуск плит"),
  logical("plywood_line.delam", "Delamination risk", "Риск расслоения"),
  enu("plywood_line.state", ["layup", "press", "trim", "grade", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-mdf_line.json", [
  id("mdf_line.id", "MDF line id", "ID линии МДФ"),
  q("mdf_line.mat.moisture", "%", "Mat moisture", "Влажность ковра", { range: { min: 0, max: 100 } }),
  q("mdf_line.press.temp", "Cel", "Press temperature", "Температура пресса"),
  q("mdf_line.density", "kg/m3", "Board density", "Плотность плиты"),
  q("mdf_line.thickness", "mm", "Board thickness", "Толщина плиты"),
  q("mdf_line.speed", "m/min", "Press speed", "Скорость пресса"),
  logical("mdf_line.blow", "Blow / blister", "Вздутие"),
  enu("mdf_line.state", ["form", "press", "cool", "sand", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-osb_line.json", [
  id("osb_line.id", "OSB line id", "ID линии OSB"),
  q("osb_line.flake.moist", "%", "Flake moisture", "Влажность стружки", { range: { min: 0, max: 100 } }),
  q("osb_line.resin", "kg/h", "Resin rate", "Расход смолы"),
  q("osb_line.press.temp", "Cel", "Press temperature", "Температура пресса"),
  q("osb_line.density", "kg/m3", "Board density", "Плотность плиты"),
  q("osb_line.throughput", "m3/h", "Board output", "Выпуск плит"),
  logical("osb_line.orientation.ok", "Orientation OK", "Ориентация OK"),
  enu("osb_line.state", ["flake", "form", "press", "trim", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-rubber_plant.json", [
  id("rubber_plant.line.id", "Rubber compounding line id", "ID линии резиносмешения"),
  id("rubber_plant.batch.id", "Compound batch id", "ID партии смеси"),
  q("rubber_plant.mixer.temp", "Cel", "Mixer temperature", "Температура смесителя"),
  q("rubber_plant.energy", "Wh", "Specific energy", "Удельная энергия"),
  q("rubber_plant.mooney", "-", "Mooney viscosity", "Вязкость Муни"),
  q("rubber_plant.cycle.s", "s", "Mix cycle", "Цикл смешения"),
  logical("rubber_plant.scorch", "Scorch risk", "Риск подвулканизации"),
  enu("rubber_plant.state", ["load", "mix", "dump", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-tire_mold.json", [
  id("tire_mold.press.id", "Tire curing press id", "ID вулканизационного пресса"),
  id("tire_mold.green.id", "Green tire id", "ID сырой покрышки"),
  q("tire_mold.cure.temp", "Cel", "Cure temperature", "Температура вулканизации"),
  q("tire_mold.cure.p", "kPa", "Cure pressure", "Давление вулканизации"),
  q("tire_mold.time.min", "min", "Cure time", "Время вулканизации"),
  q("tire_mold.bladder.cycles", "-", "Bladder cycles", "Циклов диафрагмы", { encodings: ["i32"] }),
  logical("tire_mold.ready", "Cure complete", "Вулканизация завершена"),
  enu("tire_mold.state", ["load", "cure", "unload", "idle", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-retread.json", [
  id("retread.line.id", "Retread line id", "ID линии восстановления шин"),
  id("retread.casing.id", "Casing id", "ID каркаса"),
  q("retread.buff.depth", "mm", "Buff depth", "Глубина шероховки"),
  q("retread.cure.temp", "Cel", "Cure temperature", "Температура вулканизации"),
  q("retread.cure.min", "min", "Cure time", "Время вулканизации"),
  q("retread.inspect", "%", "NDT pass rate", "Прохождение НК", { range: { min: 0, max: 100 } }),
  logical("retread.reject", "Casing rejected", "Каркас забракован"),
  enu("retread.process", ["precu", "mold_cure", "other"], "Process", "Процесс"),
]);

write("layer-b-brake_pad.json", [
  id("brake_pad.line.id", "Brake pad line id", "ID линии тормозных колодок"),
  id("brake_pad.sku.id", "Pad SKU id", "ID SKU колодки"),
  q("brake_pad.press.force", "kN", "Press force", "Усилие пресса"),
  q("brake_pad.cure.temp", "Cel", "Cure temperature", "Температура отверждения"),
  q("brake_pad.thickness", "mm", "Pad thickness", "Толщина колодки"),
  q("brake_pad.shear", "MPa", "Shear strength", "Прочность на сдвиг"),
  logical("brake_pad.crack", "Crack detected", "Обнаружена трещина"),
  enu("brake_pad.state", ["mix", "press", "cure", "grind", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-bearing_mfg.json", [
  id("bearing_mfg.line.id", "Bearing line id", "ID линии подшипников"),
  id("bearing_mfg.serial", "Bearing serial", "Серийный номер подшипника"),
  q("bearing_mfg.roundness", "um", "Race roundness", "Круглость дорожки"),
  q("bearing_mfg.noise", "dB", "Noise test", "Шумовой тест"),
  q("bearing_mfg.torque", "N.m", "Starting torque", "Момент трогания"),
  q("bearing_mfg.vib", "mm/s", "Vibration", "Вибрация"),
  logical("bearing_mfg.pass", "EOL pass", "EOL пройден"),
  enu("bearing_mfg.type", ["ball", "roller", "needle", "other"], "Bearing type", "Тип подшипника"),
]);

write("layer-b-gear_cut.json", [
  id("gear_cut.machine.id", "Gear cutting machine id", "ID зуборезного станка"),
  id("gear_cut.part.id", "Gear part id", "ID зубчатой детали"),
  q("gear_cut.module", "mm", "Module", "Модуль"),
  q("gear_cut.speed", "rpm", "Cutter speed", "Обороты фрезы"),
  q("gear_cut.feed", "mm/min", "Feed rate", "Подача"),
  q("gear_cut.error", "um", "Tooth error", "Погрешность зуба"),
  logical("gear_cut.tool.wear", "Tool wear high", "Высокий износ инструмента"),
  enu("gear_cut.process", ["hob", "shape", "grind", "hone", "other"], "Process", "Процесс"),
]);

write("layer-b-igbt_module.json", [
  id("igbt_module.line.id", "IGBT module line id", "ID линии модулей IGBT"),
  id("igbt_module.serial", "Module serial", "Серийный номер модуля"),
  q("igbt_module.vcsat", "V", "Vce sat", "Vce нас"),
  q("igbt_module.rth", "K/W", "Thermal resistance", "Тепловое сопротивление"),
  q("igbt_module.void", "%", "Solder void", "Пустоты припоя", { range: { min: 0, max: 100 } }),
  q("igbt_module.isolation", "kV", "Isolation test", "Испытание изоляции"),
  logical("igbt_module.pass", "Module pass", "Модуль прошёл"),
  enu("igbt_module.state", ["solder", "bond", "pot", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-sic_wafer.json", [
  id("sic_wafer.lot.id", "SiC wafer lot id", "ID партии пластин SiC"),
  id("sic_wafer.id", "SiC wafer id", "ID пластины SiC"),
  q("sic_wafer.diameter", "mm", "Wafer diameter", "Диаметр пластины"),
  q("sic_wafer.bow", "um", "Bow", "Прогиб"),
  q("sic_wafer.mpd", "/cm2", "Micropipe density", "Плотность микротрубок"),
  q("sic_wafer.roughness", "nm", "Surface roughness", "Шероховатость"),
  logical("sic_wafer.accept", "Wafer accepted", "Пластина принята"),
  enu("sic_wafer.polytype", ["4h", "6h", "3c", "other"], "Polytype", "Политип"),
]);

write("layer-b-led_epitaxy.json", [
  id("led_epitaxy.reactor.id", "MOCVD reactor id", "ID реактора MOCVD"),
  id("led_epitaxy.wafer.id", "Epi wafer id", "ID эпитаксиальной пластины"),
  q("led_epitaxy.temp", "Cel", "Susceptor temperature", "Температура подложкодержателя"),
  q("led_epitaxy.growth", "nm/min", "Growth rate", "Скорость роста"),
  q("led_epitaxy.pl.wl", "nm", "PL wavelength", "Длина волны PL"),
  q("led_epitaxy.uniformity", "%", "Thickness uniformity", "Равномерность толщины", { range: { min: 0, max: 100 } }),
  logical("led_epitaxy.in_spec", "Epi in spec", "Эпитаксия в норме"),
  enu("led_epitaxy.state", ["heat", "grow", "cool", "idle", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-oled_panel.json", [
  id("oled_panel.line.id", "OLED panel line id", "ID линии OLED"),
  id("oled_panel.panel.id", "Panel id", "ID панели"),
  q("oled_panel.uniformity", "%", "Luminance uniformity", "Равномерность яркости", { range: { min: 0, max: 100 } }),
  q("oled_panel.particles", "-", "Particle defects", "Частицевых дефектов", { encodings: ["i32"] }),
  q("oled_panel.lifetime.h", "h", "Projected lifetime", "Прогноз ресурса"),
  q("oled_panel.yield", "%", "Panel yield", "Выход панелей", { range: { min: 0, max: 100 } }),
  logical("oled_panel.mura", "Mura detected", "Обнаружена муара"),
  enu("oled_panel.state", ["deposit", "encaps", "test", "module", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-camera_module.json", [
  id("camera_module.line.id", "Camera module line id", "ID линии камерных модулей"),
  id("camera_module.serial", "Module serial", "Серийный номер модуля"),
  q("camera_module.mtf", "%", "MTF score", "Оценка MTF", { range: { min: 0, max: 100 } }),
  q("camera_module.focus", "um", "Focus position", "Позиция фокуса"),
  q("camera_module.particles", "-", "Particle count", "Число частиц", { encodings: ["i32"] }),
  q("camera_module.yield", "%", "Line yield", "Выход линии", { range: { min: 0, max: 100 } }),
  logical("camera_module.pass", "Module pass", "Модуль прошёл"),
  enu("camera_module.state", ["aa", "bond", "test", "pack", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-lens_mold.json", [
  id("lens_mold.machine.id", "Lens molding machine id", "ID машины литья линз"),
  id("lens_mold.sku.id", "Lens SKU id", "ID SKU линзы"),
  q("lens_mold.temp", "Cel", "Mold temperature", "Температура формы"),
  q("lens_mold.cycle.s", "s", "Cycle time", "Время цикла"),
  q("lens_mold.power", "-", "Optical power", "Оптическая сила"),
  q("lens_mold.birefringence", "nm", "Birefringence", "Двулучепреломление"),
  logical("lens_mold.reject", "Optical reject", "Оптический брак"),
  enu("lens_mold.process", ["injection", "cast", "cnc", "other"], "Process", "Процесс"),
]);

write("layer-b-optical_coat.json", [
  id("optical_coat.chamber.id", "Optical coating chamber id", "ID камеры оптического покрытия"),
  id("optical_coat.lot.id", "Coating lot id", "ID партии покрытия"),
  q("optical_coat.vacuum", "Pa", "Chamber vacuum", "Вакуум камеры"),
  q("optical_coat.rate", "nm/s", "Deposition rate", "Скорость осаждения"),
  q("optical_coat.thickness", "nm", "Layer thickness", "Толщина слоя"),
  q("optical_coat.reflectance", "%", "Reflectance", "Отражение", { range: { min: 0, max: 100 } }),
  logical("optical_coat.endpoint", "Endpoint reached", "Достигнута конечная точка"),
  enu("optical_coat.process", ["evap", "sputter", "ald", "other"], "Process", "Процесс"),
]);

write("layer-b-smart_card.json", [
  id("smart_card.line.id", "Smart card line id", "ID линии смарт-карт"),
  id("smart_card.lot.id", "Card lot id", "ID партии карт"),
  q("smart_card.embed", "%", "Embed yield", "Выход встройки", { range: { min: 0, max: 100 } }),
  q("smart_card.atr.ok", "%", "ATR pass rate", "Прохождение ATR", { range: { min: 0, max: 100 } }),
  q("smart_card.throughput", "/h", "Cards per hour", "Карт в час"),
  q("smart_card.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("smart_card.perso", "Personalization running", "Персонализация идёт"),
  enu("smart_card.type", ["contact", "contactless", "dual", "sim", "other"], "Card type", "Тип карты"),
]);

write("layer-b-rfid_inlay.json", [
  id("rfid_inlay.line.id", "RFID inlay line id", "ID линии RFID-инлеев"),
  q("rfid_inlay.bond.yield", "%", "Chip bond yield", "Выход посадки чипа", { range: { min: 0, max: 100 } }),
  q("rfid_inlay.read", "%", "Read success", "Успешность считывания", { range: { min: 0, max: 100 } }),
  q("rfid_inlay.speed", "m/min", "Web speed", "Скорость полотна"),
  q("rfid_inlay.antenna", "-", "Antenna pitch", "Шаг антенны", { encodings: ["i32"] }),
  q("rfid_inlay.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("rfid_inlay.jam", "Web jam", "Замятие полотна"),
  enu("rfid_inlay.freq", ["hf", "uhf", "other"], "Frequency", "Частота"),
]);

write("layer-b-banknote_print.json", [
  id("banknote_print.press.id", "Banknote press id", "ID печатной машины банкнот"),
  id("banknote_print.job.id", "Print job id", "ID заказа печати"),
  q("banknote_print.speed", "/h", "Sheets per hour", "Листов в час"),
  q("banknote_print.register", "um", "Register error", "Ошибка приводки"),
  q("banknote_print.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("banknote_print.ink", "%", "Ink level", "Уровень краски", { range: { min: 0, max: 100 } }),
  logical("banknote_print.secure", "Secure mode", "Защищённый режим"),
  enu("banknote_print.process", ["intaglio", "offset", "silk", "number", "other"], "Process", "Процесс"),
]);

write("layer-b-passport_mfg.json", [
  id("passport_mfg.line.id", "Passport line id", "ID линии паспортов"),
  id("passport_mfg.lot.id", "Passport lot id", "ID партии паспортов", { sensitivity: "restricted" }),
  q("passport_mfg.chip.bind", "%", "Chip bind yield", "Выход привязки чипа", { range: { min: 0, max: 100 } }),
  q("passport_mfg.laminate", "Cel", "Laminate temperature", "Температура ламинации"),
  q("passport_mfg.throughput", "/h", "Booklets per hour", "Буклетов в час"),
  q("passport_mfg.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("passport_mfg.secure", "Secure area OK", "Зона безопасности OK"),
  enu("passport_mfg.state", ["print", "chip", "laminate", "qa", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-coin_mint.json", [
  id("coin_mint.press.id", "Coining press id", "ID чеканного пресса"),
  id("coin_mint.denom", "Denomination id", "ID номинала"),
  q("coin_mint.force", "kN", "Strike force", "Усилие удара"),
  q("coin_mint.speed", "/h", "Coins per hour", "Монет в час"),
  q("coin_mint.weight", "g", "Coin weight", "Масса монеты"),
  q("coin_mint.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("coin_mint.die.wear", "Die wear high", "Высокий износ штемпеля"),
  enu("coin_mint.metal", ["cu_ni", "steel", "ag", "au", "other"], "Metal", "Металл"),
]);

write("layer-b-jewelry_cast.json", [
  id("jewelry_cast.flask.id", "Casting flask id", "ID опоки"),
  id("jewelry_cast.alloy.id", "Alloy lot id", "ID партии сплава"),
  q("jewelry_cast.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("jewelry_cast.vacuum", "Pa", "Cast vacuum", "Вакуум литья"),
  q("jewelry_cast.weight", "g", "Cast weight", "Масса отливки"),
  q("jewelry_cast.porosity", "%", "Porosity", "Пористость", { range: { min: 0, max: 100 } }),
  logical("jewelry_cast.incomplete", "Incomplete fill", "Недолив"),
  enu("jewelry_cast.metal", ["au", "ag", "pt", "brass", "other"], "Metal", "Металл"),
]);

write("layer-b-nonwoven.json", [
  id("nonwoven.line.id", "Nonwoven line id", "ID линии нетканых материалов"),
  q("nonwoven.basis", "g/m2", "Basis weight", "Поверхностная плотность"),
  q("nonwoven.speed", "m/min", "Line speed", "Скорость линии"),
  q("nonwoven.thickness", "mm", "Web thickness", "Толщина полотна"),
  q("nonwoven.air", "m3/h", "Process air", "Технологический воздух"),
  q("nonwoven.bonding", "%", "Bonding energy proxy", "Энергия скрепления", { range: { min: 0, max: 100 } }),
  logical("nonwoven.break", "Web break", "Обрыв полотна"),
  enu("nonwoven.process", ["spunbond", "meltblown", "carded", "spunlace", "other"], "Process", "Процесс"),
]);

write("layer-b-carpet_tuft.json", [
  id("carpet_tuft.machine.id", "Tufting machine id", "ID тафтинговой машины"),
  id("carpet_tuft.style.id", "Carpet style id", "ID стиля ковра"),
  q("carpet_tuft.speed", "m/min", "Machine speed", "Скорость машины"),
  q("carpet_tuft.gauge", "-", "Gauge", "Гейдж"),
  q("carpet_tuft.pile", "mm", "Pile height", "Высота ворса"),
  q("carpet_tuft.yarn", "kg/h", "Yarn use", "Расход пряжи"),
  logical("carpet_tuft.needle.break", "Needle break", "Обрыв иглы"),
  enu("carpet_tuft.state", ["tuft", "coat", "shear", "inspect", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-mattress_line.json", [
  id("mattress_line.id", "Mattress line id", "ID линии матрасов"),
  id("mattress_line.sku.id", "Mattress SKU id", "ID SKU матраса"),
  q("mattress_line.coil", "-", "Coil count", "Число пружин", { encodings: ["i32"] }),
  q("mattress_line.foam.dens", "kg/m3", "Foam density", "Плотность пены"),
  q("mattress_line.quilt.speed", "m/min", "Quilt speed", "Скорость стёжки"),
  q("mattress_line.throughput", "/h", "Units per hour", "Единиц в час"),
  logical("mattress_line.tape.ok", "Tape edge OK", "Кант OK"),
  enu("mattress_line.type", ["innerspring", "foam", "hybrid", "other"], "Type", "Тип"),
]);

write("layer-b-airbag_cut.json", [
  id("airbag_cut.laser.id", "Airbag laser cutter id", "ID лазерной резки подушек"),
  id("airbag_cut.job.id", "Cut job id", "ID задания резки"),
  q("airbag_cut.speed", "mm/s", "Cut speed", "Скорость резки"),
  q("airbag_cut.power", "W", "Laser power", "Мощность лазера"),
  q("airbag_cut.panels", "-", "Panels cut", "Вырезано панелей", { encodings: ["i32"] }),
  q("airbag_cut.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("airbag_cut.seal.ok", "Edge seal OK", "Кромка OK"),
  enu("airbag_cut.fabric", ["nylon", "polyester", "other"], "Fabric", "Ткань"),
]);

write("layer-b-seatbelt_line.json", [
  id("seatbelt_line.id", "Seatbelt line id", "ID линии ремней"),
  id("seatbelt_line.sku.id", "Seatbelt SKU id", "ID SKU ремня"),
  q("seatbelt_line.webbing", "m/min", "Webbing speed", "Скорость ленты"),
  q("seatbelt_line.retractor.n", "N", "Retractor force", "Усилие втягивания"),
  q("seatbelt_line.tensile", "kN", "Tensile strength", "Прочность на разрыв"),
  q("seatbelt_line.throughput", "/h", "Assemblies per hour", "Сборок в час"),
  logical("seatbelt_line.lock.ok", "Lock function OK", "Блокировка OK"),
  enu("seatbelt_line.state", ["weave", "dye", "assemble", "test", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-palm_oil.json", [
  id("palm_oil.mill.id", "Palm oil mill id", "ID пальмового завода"),
  q("palm_oil.ffb", "t/h", "FFB throughput", "Переработка СПП"),
  q("palm_oil.oer", "%", "Oil extraction rate", "Выход масла", { range: { min: 0, max: 100 } }),
  q("palm_oil.sterilizer.p", "kPa", "Sterilizer pressure", "Давление стерилизатора"),
  q("palm_oil.clarifier.temp", "Cel", "Clarifier temperature", "Температура отстойника"),
  q("palm_oil.ffa", "%", "Free fatty acids", "СЖК", { range: { min: 0, max: 100 } }),
  logical("palm_oil.boiler.ok", "Boiler OK", "Котёл OK"),
  enu("palm_oil.state", ["sterilize", "press", "clarify", "idle", "fault"], "Mill state", "Состояние завода"),
]);

write("layer-b-bagasse_boiler.json", [
  id("bagasse_boiler.id", "Bagasse boiler id", "ID котла на багассе"),
  q("bagasse_boiler.steam", "t/h", "Steam production", "Выработка пара"),
  q("bagasse_boiler.pressure", "kPa", "Drum pressure", "Давление в барабане"),
  q("bagasse_boiler.temp", "Cel", "Steam temperature", "Температура пара"),
  q("bagasse_boiler.feed", "t/h", "Bagasse feed", "Подача багассы"),
  q("bagasse_boiler.o2", "%", "Flue O2", "O2 в дымовых", { range: { min: 0, max: 100 } }),
  logical("bagasse_boiler.grate.ok", "Grate OK", "Колосник OK"),
  enu("bagasse_boiler.state", ["start", "run", "bank", "stop", "fault"], "Boiler state", "Состояние котла"),
]);

write("layer-b-geo_textile.json", [
  id("geo_textile.line.id", "Geotextile line id", "ID линии геотекстиля"),
  q("geo_textile.basis", "g/m2", "Basis weight", "Поверхностная плотность"),
  q("geo_textile.tensile", "kN/m", "Tensile strength", "Прочность на растяжение"),
  q("geo_textile.perm", "L/m2/h", "Permittivity proxy", "Водопроницаемость"),
  q("geo_textile.speed", "m/min", "Line speed", "Скорость линии"),
  q("geo_textile.width", "m", "Roll width", "Ширина рулона"),
  logical("geo_textile.break", "Web break", "Обрыв полотна"),
  enu("geo_textile.type", ["woven", "nonwoven", "knitted", "other"], "Type", "Тип"),
]);

write("layer-b-watch_mvt.json", [
  id("watch_mvt.line.id", "Watch movement line id", "ID линии часовых механизмов"),
  id("watch_mvt.serial", "Movement serial", "Серийный номер механизма"),
  q("watch_mvt.rate", "s/d", "Rate error", "Суточный ход"),
  q("watch_mvt.amplitude", "deg", "Balance amplitude", "Амплитуда баланса"),
  q("watch_mvt.beat.error", "ms", "Beat error", "Ошибка хода"),
  q("watch_mvt.torque", "N.m", "Mainspring torque", "Момент заводной пружины"),
  logical("watch_mvt.pass", "Timing pass", "Ход принят"),
  enu("watch_mvt.type", ["mechanical", "quartz", "auto", "other"], "Movement type", "Тип механизма"),
]);

write("layer-b-ammonia_crack.json", [
  id("ammonia_crack.reactor.id", "Ammonia cracker id", "ID крекера аммиака"),
  q("ammonia_crack.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("ammonia_crack.nh3.conv", "%", "NH3 conversion", "Конверсия NH3", { range: { min: 0, max: 100 } }),
  q("ammonia_crack.h2", "kg/h", "H2 production", "Выработка H2"),
  q("ammonia_crack.pressure", "kPa", "Reactor pressure", "Давление реактора"),
  q("ammonia_crack.residual.nh3", "ppm", "Residual NH3", "Остаточный NH3"),
  logical("ammonia_crack.trip", "Reactor trip", "Отключение реактора"),
  enu("ammonia_crack.state", ["heat", "crack", "purge", "idle", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-methanation.json", [
  id("methanation.reactor.id", "Methanation reactor id", "ID реактора метанирования"),
  q("methanation.temp", "Cel", "Catalyst temperature", "Температура катализатора"),
  q("methanation.pressure", "kPa", "Reactor pressure", "Давление реактора"),
  q("methanation.ch4", "%", "Product CH4", "CH4 в продукте", { range: { min: 0, max: 100 } }),
  q("methanation.h2.co2", "-", "H2/CO2 ratio", "Соотношение H2/CO2"),
  q("methanation.prod", "m3/h", "SNG production", "Выпуск SNG"),
  logical("methanation.hotspot", "Hotspot", "Горячая точка"),
  enu("methanation.state", ["startup", "run", "turndown", "idle", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-string_monitor.json", [
  id("string_monitor.id", "PV string monitor id", "ID монитора стринга"),
  id("string_monitor.string.id", "PV string id", "ID стринга"),
  q("string_monitor.current", "A", "String current", "Ток стринга"),
  q("string_monitor.voltage", "V", "String voltage", "Напряжение стринга"),
  q("string_monitor.power", "W", "String power", "Мощность стринга"),
  q("string_monitor.imbalance", "%", "Current imbalance", "Дисбаланс тока", { range: { min: 0, max: 100 } }),
  logical("string_monitor.fault", "String fault", "Отказ стринга"),
  enu("string_monitor.state", ["ok", "shade", "fault", "offline"], "String state", "Состояние стринга"),
]);

write("layer-b-propane_tank.json", [
  id("propane_tank.id", "Propane tank id", "ID пропанового резервуара"),
  q("propane_tank.level", "%", "Liquid level", "Уровень жидкости", { range: { min: 0, max: 100 } }),
  q("propane_tank.pressure", "kPa", "Tank pressure", "Давление резервуара"),
  q("propane_tank.temp", "Cel", "Tank temperature", "Температура резервуара"),
  q("propane_tank.usage", "kg/d", "Daily usage", "Суточный расход"),
  q("propane_tank.ullage", "%", "Ullage", "Газовая подушка", { range: { min: 0, max: 100 } }),
  logical("propane_tank.low", "Low level", "Низкий уровень"),
  enu("propane_tank.state", ["ok", "refill_due", "alarm", "offline"], "Tank state", "Состояние резервуара"),
]);

write("layer-b-economizer.json", [
  id("economizer.id", "Boiler economizer id", "ID экономайзера"),
  q("economizer.gas.in", "Cel", "Flue gas inlet", "Дымовые на входе"),
  q("economizer.gas.out", "Cel", "Flue gas outlet", "Дымовые на выходе"),
  q("economizer.water.in", "Cel", "Feedwater inlet", "Питательная на входе"),
  q("economizer.water.out", "Cel", "Feedwater outlet", "Питательная на выходе"),
  q("economizer.dp", "Pa", "Gas-side DP", "Перепад по газу"),
  logical("economizer.foul", "Fouling high", "Высокое загрязнение"),
  enu("economizer.state", ["run", "bypass", "clean", "fault"], "Economizer state", "Состояние экономайзера"),
]);

write("layer-b-soot_blower.json", [
  id("soot_blower.id", "Soot blower id", "ID обдувочного аппарата"),
  id("soot_blower.boiler.id", "Host boiler id", "ID котла"),
  q("soot_blower.steam.p", "kPa", "Blowing steam pressure", "Давление пара обдувки"),
  q("soot_blower.travel", "%", "Lance travel", "Ход фурмы", { range: { min: 0, max: 100 } }),
  q("soot_blower.cycles", "-", "Blow cycles today", "Циклов обдувки за сутки", { encodings: ["i32"] }),
  q("soot_blower.duration.s", "s", "Blow duration", "Длительность обдувки"),
  logical("soot_blower.active", "Blowing", "Обдувка"),
  enu("soot_blower.type", ["retractable", "rotary", "wall", "other"], "Type", "Тип"),
]);

write("layer-b-air_preheat.json", [
  id("air_preheat.id", "Air preheater id", "ID воздухоподогревателя"),
  q("air_preheat.air.in", "Cel", "Air inlet", "Воздух на входе"),
  q("air_preheat.air.out", "Cel", "Air outlet", "Воздух на выходе"),
  q("air_preheat.gas.in", "Cel", "Gas inlet", "Газ на входе"),
  q("air_preheat.leak", "%", "Leakage estimate", "Оценка перетока", { range: { min: 0, max: 100 } }),
  q("air_preheat.dp", "Pa", "Gas DP", "Перепад по газу"),
  logical("air_preheat.fire", "Fire risk", "Риск возгорания"),
  enu("air_preheat.type", ["rotary", "tubular", "plate", "other"], "Type", "Тип"),
]);

write("layer-b-latex_proc.json", [
  id("latex_proc.plant.id", "Latex plant id", "ID латексного завода"),
  q("latex_proc.drc", "%", "Dry rubber content", "Содержание сухого каучука", { range: { min: 0, max: 100 } }),
  q("latex_proc.ammonia", "%", "Ammonia content", "Содержание аммиака", { range: { min: 0, max: 100 } }),
  q("latex_proc.vfa", "-", "VFA number", "Число ЛЖК"),
  q("latex_proc.centrifuge", "rpm", "Centrifuge speed", "Обороты центрифуги"),
  q("latex_proc.throughput", "t/h", "Latex throughput", "Переработка латекса"),
  logical("latex_proc.coag", "Coagulation", "Коагуляция"),
  enu("latex_proc.product", ["field", "concentrate", "cream", "other"], "Product", "Продукт"),
]);

write("layer-b-veneer_line.json", [
  id("veneer_line.lathe.id", "Veneer lathe id", "ID лущильного станка"),
  q("veneer_line.thickness", "mm", "Veneer thickness", "Толщина шпона"),
  q("veneer_line.speed", "m/min", "Peel speed", "Скорость лущения"),
  q("veneer_line.moisture", "%", "Green moisture", "Влажность сырого шпона", { range: { min: 0, max: 100 } }),
  q("veneer_line.recovery", "%", "Recovery", "Выход", { range: { min: 0, max: 100 } }),
  q("veneer_line.knife.wear", "%", "Knife wear", "Износ ножа", { range: { min: 0, max: 100 } }),
  logical("veneer_line.spinout", "Spinout", "Срыв чурака"),
  enu("veneer_line.state", ["peel", "clip", "dry", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-upholstery.json", [
  id("upholstery.station.id", "Upholstery station id", "ID станции обивки"),
  id("upholstery.sku.id", "Furniture SKU id", "ID SKU мебели"),
  q("upholstery.staple", "-", "Staples used", "Скоб использовано", { encodings: ["i32"] }),
  q("upholstery.foam", "kg", "Foam used", "Пены использовано"),
  q("upholstery.cycle.min", "min", "Station cycle", "Цикл станции"),
  q("upholstery.rework", "%", "Rework rate", "Доля переделок", { range: { min: 0, max: 100 } }),
  logical("upholstery.qc.pass", "QC pass", "ОТК пройден"),
  enu("upholstery.state", ["frame", "foam", "cover", "trim", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-nfc_tag.json", [
  id("nfc_tag.encode.id", "NFC encode station id", "ID станции кодирования NFC"),
  q("nfc_tag.encoded", "/h", "Tags encoded per hour", "Меток в час"),
  q("nfc_tag.yield", "%", "Encode yield", "Выход кодирования", { range: { min: 0, max: 100 } }),
  q("nfc_tag.read", "%", "Verify read rate", "Доля успешного чтения", { range: { min: 0, max: 100 } }),
  q("nfc_tag.uid.dup", "-", "UID duplicates", "Дублей UID", { encodings: ["i32"] }),
  q("nfc_tag.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("nfc_tag.lock", "Lock bits set", "Биты блокировки установлены"),
  enu("nfc_tag.type", ["ntagm", "ultralight", "desfire", "other"], "Tag type", "Тип метки"),
]);

console.log("Layer B21 seeds written");
