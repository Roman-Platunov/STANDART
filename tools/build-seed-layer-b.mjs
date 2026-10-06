#!/usr/bin/env node
/**
 * Build registry/seeds/layer-b-*.json — industry packages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.join(__dirname, "..", "registry", "seeds");

function q(pathStr, unit, titleEn, titleRu, opts = {}) {
  return {
    path: pathStr,
    kind: "quantity",
    unit,
    titleEn,
    titleRu,
    encodings: opts.encodings || ["f32", "f64"],
    sensitivity: opts.sensitivity || "public",
    range: opts.range,
    descriptionEn: opts.descriptionEn,
    descriptionRu: opts.descriptionRu,
    status: opts.status || "stable",
  };
}
function id(pathStr, titleEn, titleRu, opts = {}) {
  return {
    path: pathStr,
    kind: "identity",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["utf8"],
    sensitivity: opts.sensitivity || "internal",
  };
}
function enu(pathStr, values, titleEn, titleRu, opts = {}) {
  return {
    path: pathStr,
    kind: opts.kind || "enum",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["enum", "utf8"],
    enumValues: values,
    sensitivity: opts.sensitivity || "public",
  };
}
function logical(pathStr, titleEn, titleRu) {
  return {
    path: pathStr,
    kind: "logical",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["bool", "u8"],
    sensitivity: "public",
  };
}
function cmd(pathStr, values, titleEn, titleRu) {
  return {
    path: pathStr,
    kind: "command",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["enum", "utf8"],
    enumValues: values,
    sensitivity: "public",
  };
}
function media(pathStr, titleEn, titleRu) {
  return {
    path: pathStr,
    kind: "media",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["utf8"],
    sensitivity: "internal",
  };
}

function write(name, layer, types) {
  const out = path.join(seedsDir, name);
  fs.writeFileSync(out, JSON.stringify({ layer, name, types }, null, 2));
  console.log(`${name}: ${types.length} types`);
}

fs.mkdirSync(seedsDir, { recursive: true });

// —— B1 Vehicle / automotive ——
write("layer-b-vehicle.json", "B", [
  q("vehicle.speed", "km/h", "Vehicle speed", "Скорость ТС", { range: { min: 0, max: 400 } }),
  q("vehicle.odometer", "km", "Odometer", "Одометр"),
  q("vehicle.trip_distance", "km", "Trip distance", "Пробег поездки"),
  q("vehicle.fuel_level", "%", "Fuel level", "Уровень топлива", { range: { min: 0, max: 100 } }),
  q("vehicle.fuel_rate", "L/h", "Fuel rate", "Расход топлива"),
  q("vehicle.fuel_economy", "L/100km", "Fuel economy", "Расход на 100 км"),
  q("vehicle.engine_rpm", "/min", "Engine RPM", "Обороты двигателя"),
  q("vehicle.engine_load", "%", "Engine load", "Нагрузка двигателя", { range: { min: 0, max: 100 } }),
  q("vehicle.engine_coolant_temp", "Cel", "Coolant temperature", "Температура ОЖ"),
  q("vehicle.engine_oil_temp", "Cel", "Oil temperature", "Температура масла"),
  q("vehicle.engine_oil_pressure", "kPa", "Oil pressure", "Давление масла"),
  q("vehicle.intake_air_temp", "Cel", "Intake air temperature", "Температура впуска"),
  q("vehicle.maf", "g/s", "Mass air flow", "МАФ"),
  q("vehicle.throttle_position", "%", "Throttle position", "Дроссель", { range: { min: 0, max: 100 } }),
  q("vehicle.accelerator_position", "%", "Accelerator position", "Педаль газа", { range: { min: 0, max: 100 } }),
  q("vehicle.brake_pressure", "kPa", "Brake pressure", "Давление тормозов"),
  q("vehicle.steering_angle", "deg", "Steering angle", "Угол руля"),
  q("vehicle.wheel_speed_fl", "km/h", "Wheel speed FL", "Скорость колеса ПЛ"),
  q("vehicle.wheel_speed_fr", "km/h", "Wheel speed FR", "Скорость колеса ПП"),
  q("vehicle.wheel_speed_rl", "km/h", "Wheel speed RL", "Скорость колеса ЗЛ"),
  q("vehicle.wheel_speed_rr", "km/h", "Wheel speed RR", "Скорость колеса ЗП"),
  q("vehicle.tire_pressure_fl", "kPa", "Tire pressure FL", "Давление шины ПЛ"),
  q("vehicle.tire_pressure_fr", "kPa", "Tire pressure FR", "Давление шины ПП"),
  q("vehicle.tire_pressure_rl", "kPa", "Tire pressure RL", "Давление шины ЗЛ"),
  q("vehicle.tire_pressure_rr", "kPa", "Tire pressure RR", "Давление шины ЗП"),
  q("vehicle.battery_voltage", "V", "Vehicle battery voltage", "Напряжение АКБ ТС"),
  q("vehicle.ambient_temp", "Cel", "Ambient temperature", "Наружная температура"),
  q("vehicle.cabin_temp", "Cel", "Cabin temperature", "Температура салона"),
  q("vehicle.range_remaining", "km", "Range remaining", "Запас хода"),
  q("vehicle.ev_battery_soc", "%", "EV battery SoC", "Заряд тяговой батареи", { range: { min: 0, max: 100 } }),
  q("vehicle.ev_battery_soh", "%", "EV battery SoH", "Здоровье тяговой батареи", { range: { min: 0, max: 100 } }),
  q("vehicle.ev_charge_power", "W", "EV charge power", "Мощность зарядки EV"),
  q("vehicle.ev_charge_energy", "Wh", "EV charge energy", "Энергия зарядки EV"),
  logical("vehicle.ignition_on", "Ignition on", "Зажигание включено"),
  logical("vehicle.door_driver_open", "Driver door open", "Дверь водителя открыта"),
  logical("vehicle.door_passenger_open", "Passenger door open", "Дверь пассажира открыта"),
  logical("vehicle.trunk_open", "Trunk open", "Багажник открыт"),
  logical("vehicle.hood_open", "Hood open", "Капот открыт"),
  logical("vehicle.seatbelt_driver", "Driver seatbelt", "Ремень водителя"),
  logical("vehicle.abs_active", "ABS active", "ABS активен"),
  logical("vehicle.esp_active", "ESP active", "ESP активен"),
  logical("vehicle.airbag_deployed", "Airbag deployed", "Подушка сработала"),
  enu("vehicle.gear", ["p", "r", "n", "d", "s", "1", "2", "3", "4", "5", "6"], "Gear", "Передача"),
  enu("vehicle.drive_mode", ["eco", "normal", "sport", "offroad", "snow"], "Drive mode", "Режим езды"),
  enu("vehicle.charge_state", ["idle", "charging", "complete", "error", "scheduled"], "EV charge state", "Состояние зарядки EV"),
  id("vehicle.vin", "VIN", "VIN", { sensitivity: "restricted" }),
  id("vehicle.license_plate", "License plate", "Госномер", { sensitivity: "personal" }),
  cmd("vehicle.lock", ["lock", "unlock"], "Door lock command", "Команда замков"),
  cmd("vehicle.engine", ["start", "stop"], "Engine command", "Команда двигателя"),
  q("vehicle.dtc_count", "-", "DTC count", "Число DTC", { encodings: ["u8", "i16"] }),
  id("vehicle.dtc_code", "DTC code", "Код DTC"),
]);

// —— B2 Industrial / process ——
write("layer-b-industrial.json", "B", [
  q("industrial.process.temperature", "Cel", "Process temperature", "Температура процесса"),
  q("industrial.process.pressure", "Pa", "Process pressure", "Давление процесса"),
  q("industrial.process.level", "%", "Process level", "Уровень процесса", { range: { min: 0, max: 100 } }),
  q("industrial.process.flow", "m3/h", "Process flow", "Расход процесса"),
  q("industrial.process.density", "kg/m3", "Process density", "Плотность процесса"),
  q("industrial.process.conductivity", "uS/cm", "Process conductivity", "Проводимость процесса"),
  q("industrial.process.ph", "-", "Process pH", "pH процесса", { range: { min: 0, max: 14 } }),
  q("industrial.process.orp", "mV", "ORP", "ОВП"),
  q("industrial.process.turbidity", "NTU", "Process turbidity", "Мутность процесса"),
  q("industrial.process.concentration", "%", "Concentration", "Концентрация", { range: { min: 0, max: 100 } }),
  q("industrial.motor.current", "A", "Motor current", "Ток двигателя"),
  q("industrial.motor.voltage", "V", "Motor voltage", "Напряжение двигателя"),
  q("industrial.motor.power", "W", "Motor power", "Мощность двигателя"),
  q("industrial.motor.rpm", "/min", "Motor RPM", "Обороты двигателя"),
  q("industrial.motor.torque", "N.m", "Motor torque", "Момент двигателя"),
  q("industrial.motor.temperature", "Cel", "Motor temperature", "Температура двигателя"),
  q("industrial.motor.vibration", "m/s2", "Motor vibration", "Вибрация двигателя"),
  q("industrial.motor.runtime_hours", "h", "Motor runtime hours", "Моточасы"),
  enu("industrial.motor.state", ["stopped", "starting", "running", "stopping", "fault"], "Motor state", "Состояние двигателя"),
  q("industrial.pump.head", "m", "Pump head", "Напор насоса"),
  q("industrial.pump.efficiency", "%", "Pump efficiency", "КПД насоса", { range: { min: 0, max: 100 } }),
  q("industrial.conveyor.speed", "m/s", "Conveyor speed", "Скорость конвейера"),
  q("industrial.conveyor.count", "-", "Unit count", "Счётчик изделий", { encodings: ["i32"] }),
  q("industrial.robot.joint_angle_1", "deg", "Robot joint 1", "Сустав робота 1"),
  q("industrial.robot.joint_angle_2", "deg", "Robot joint 2", "Сустав робота 2"),
  q("industrial.robot.joint_angle_3", "deg", "Robot joint 3", "Сустав робота 3"),
  q("industrial.robot.joint_angle_4", "deg", "Robot joint 4", "Сустав робота 4"),
  q("industrial.robot.joint_angle_5", "deg", "Robot joint 5", "Сустав робота 5"),
  q("industrial.robot.joint_angle_6", "deg", "Robot joint 6", "Сустав робота 6"),
  q("industrial.robot.tcp_x", "m", "TCP X", "TCP X"),
  q("industrial.robot.tcp_y", "m", "TCP Y", "TCP Y"),
  q("industrial.robot.tcp_z", "m", "TCP Z", "TCP Z"),
  enu("industrial.robot.mode", ["manual", "auto", "teach", "fault"], "Robot mode", "Режим робота"),
  logical("industrial.safety.e_stop", "E-stop active", "Аварийный стоп"),
  logical("industrial.safety.light_curtain", "Light curtain broken", "Световой барьер"),
  logical("industrial.safety.door_interlock", "Door interlock open", "Блокировка двери"),
  enu("industrial.batch.state", ["idle", "running", "paused", "complete", "aborted"], "Batch state", "Состояние партии"),
  id("industrial.batch.id", "Batch id", "Идентификатор партии"),
  id("industrial.workorder.id", "Work order id", "Наряд-заказ"),
  q("industrial.oee.availability", "%", "OEE availability", "OEE доступность", { range: { min: 0, max: 100 } }),
  q("industrial.oee.performance", "%", "OEE performance", "OEE производительность", { range: { min: 0, max: 100 } }),
  q("industrial.oee.quality", "%", "OEE quality", "OEE качество", { range: { min: 0, max: 100 } }),
  q("industrial.oee.overall", "%", "OEE overall", "OEE общий", { range: { min: 0, max: 100 } }),
  cmd("industrial.machine", ["start", "stop", "reset", "hold"], "Machine command", "Команда станка"),
]);

// —— B3 Health clinical-adjacent / wearables extended ——
write("layer-b-health.json", "B", [
  q("health.clinical.body_temperature", "Cel", "Clinical body temperature", "Клиническая температура тела", {
    sensitivity: "personal",
    descriptionEn: "Consumer/clinical device type — not a certification claim",
    descriptionRu: "Тип для устройств — не медицинская сертификация",
  }),
  q("health.clinical.heart_rate", "/min", "Clinical heart rate", "Клинический пульс", { sensitivity: "personal" }),
  q("health.clinical.spo2", "%", "Clinical SpO2", "Клинический SpO2", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  q("health.clinical.respiratory_rate", "/min", "Clinical respiratory rate", "Клиническая ЧД", { sensitivity: "personal" }),
  q("health.clinical.systolic_bp", "mm[Hg]", "Clinical systolic BP", "Клиническое САД", { sensitivity: "personal" }),
  q("health.clinical.diastolic_bp", "mm[Hg]", "Clinical diastolic BP", "Клиническое ДАД", { sensitivity: "personal" }),
  q("health.clinical.mean_arterial_pressure", "mm[Hg]", "Mean arterial pressure", "Среднее АД", { sensitivity: "personal" }),
  q("health.clinical.pulse_pressure", "mm[Hg]", "Pulse pressure", "Пульсовое давление", { sensitivity: "personal" }),
  q("health.clinical.glucose", "mmol/L", "Blood glucose", "Глюкоза крови", { sensitivity: "personal" }),
  q("health.clinical.ketone", "mmol/L", "Blood ketone", "Кетоны", { sensitivity: "personal" }),
  q("health.clinical.cholesterol_total", "mg/dL", "Total cholesterol", "Холестерин общий", { sensitivity: "personal" }),
  q("health.clinical.ecg_heart_rate", "/min", "ECG-derived heart rate", "ЧСС по ЭКГ", { sensitivity: "personal" }),
  q("health.clinical.perfusion_index", "%", "Perfusion index", "Индекс перфузии", { sensitivity: "personal" }),
  q("health.clinical.pain_score", "-", "Pain score", "Шкала боли", { sensitivity: "personal", encodings: ["u8", "f32"], range: { min: 0, max: 10 } }),
  enu("health.clinical.consciousness", ["alert", "verbal", "pain", "unresponsive"], "Consciousness AVPU", "Сознание AVPU", { sensitivity: "personal" }),
  id("health.clinical.patient_id", "Patient id", "ID пациента", { sensitivity: "restricted" }),
  id("health.clinical.encounter_id", "Encounter id", "ID обращения", { sensitivity: "restricted" }),
  q("health.wearable.steps_daily", "-", "Daily steps", "Шаги за день", { sensitivity: "personal", encodings: ["i32"] }),
  q("health.wearable.active_minutes", "min", "Active minutes", "Активные минуты", { sensitivity: "personal" }),
  q("health.wearable.floors_climbed", "-", "Floors climbed", "Этажи", { sensitivity: "personal", encodings: ["i16"] }),
  q("health.wearable.standing_hours", "h", "Standing hours", "Часы стояния", { sensitivity: "personal" }),
  q("health.wearable.sleep_score", "-", "Sleep score", "Оценка сна", { sensitivity: "personal", encodings: ["u8", "f32"] }),
  q("health.wearable.recovery_score", "-", "Recovery score", "Оценка восстановления", { sensitivity: "personal" }),
  enu("health.wearable.sleep_stage", ["awake", "light", "deep", "rem"], "Sleep stage", "Стадия сна", { sensitivity: "personal" }),
]);

// —— B4 Agriculture ——
write("layer-b-agriculture.json", "B", [
  q("agriculture.soil.moisture", "%", "Soil moisture ag", "Влажность почвы (агро)", { range: { min: 0, max: 100 } }),
  q("agriculture.soil.temperature", "Cel", "Soil temperature ag", "Температура почвы (агро)"),
  q("agriculture.soil.ec", "uS/cm", "Soil EC", "ЭС почвы"),
  q("agriculture.soil.ph", "-", "Soil pH", "pH почвы", { range: { min: 0, max: 14 } }),
  q("agriculture.soil.npk_n", "mg/kg", "Soil nitrogen", "Азот в почве"),
  q("agriculture.soil.npk_p", "mg/kg", "Soil phosphorus", "Фосфор в почве"),
  q("agriculture.soil.npk_k", "mg/kg", "Soil potassium", "Калий в почве"),
  q("agriculture.crop.canopy_temperature", "Cel", "Canopy temperature", "Температура кроны"),
  q("agriculture.crop.ndvi", "-", "NDVI", "NDVI", { range: { min: -1, max: 1 } }),
  q("agriculture.crop.leaf_area_index", "-", "Leaf area index", "LAI"),
  q("agriculture.irrigation.flow", "L/min", "Irrigation flow", "Поливной расход"),
  q("agriculture.irrigation.volume", "L", "Irrigation volume", "Объём полива"),
  q("agriculture.irrigation.pressure", "kPa", "Irrigation pressure", "Давление полива"),
  logical("agriculture.irrigation.valve_open", "Irrigation valve open", "Клапан полива открыт"),
  q("agriculture.greenhouse.co2", "ppm", "Greenhouse CO2", "CO2 теплицы"),
  q("agriculture.greenhouse.par", "umol/m2/s", "PAR", "ФАР"),
  q("agriculture.greenhouse.vpd", "kPa", "Vapor pressure deficit", "ДВД"),
  q("agriculture.livestock.weight", "kg", "Livestock weight", "Масса животного"),
  q("agriculture.livestock.activity", "-", "Livestock activity", "Активность животного"),
  id("agriculture.livestock.tag", "Livestock tag", "Бирка животного"),
  id("agriculture.field.id", "Field id", "ID поля"),
]);

// —— B5 Energy / grid ——
write("layer-b-energy.json", "B", [
  q("energy.grid.frequency", "Hz", "Grid frequency energy", "Частота сети (энергетика)"),
  q("energy.grid.voltage", "V", "Grid voltage", "Напряжение сети"),
  q("energy.grid.power_import", "W", "Power import", "Мощность импорта"),
  q("energy.grid.power_export", "W", "Power export", "Мощность экспорта"),
  q("energy.grid.energy_import", "Wh", "Energy import", "Энергия импорта"),
  q("energy.grid.energy_export", "Wh", "Energy export", "Энергия экспорта"),
  q("energy.storage.soc", "%", "Storage SoC", "Заряд накопителя", { range: { min: 0, max: 100 } }),
  q("energy.storage.power", "W", "Storage power", "Мощность накопителя"),
  q("energy.storage.capacity", "Wh", "Storage capacity", "Ёмкость накопителя"),
  q("energy.storage.temperature", "Cel", "Storage temperature", "Температура накопителя"),
  q("energy.solar.irradiance", "W/m2", "Solar irradiance", "Инсоляция"),
  q("energy.solar.panel_temperature", "Cel", "Panel temperature", "Температура панели"),
  q("energy.solar.dc_power", "W", "Solar DC power", "Мощность ФЭП DC"),
  q("energy.solar.ac_power", "W", "Solar AC power", "Мощность ФЭП AC"),
  q("energy.wind.turbine_power", "W", "Wind turbine power", "Мощность ветрогенератора"),
  q("energy.wind.rotor_rpm", "/min", "Rotor RPM", "Обороты ротора"),
  q("energy.evse.session_energy", "Wh", "EVSE session energy", "Энергия сессии ЗС"),
  q("energy.evse.session_power", "W", "EVSE session power", "Мощность сессии ЗС"),
  enu("energy.evse.connector_state", ["available", "occupied", "charging", "fault", "unavailable"], "EVSE connector state", "Состояние разъёма ЗС"),
  id("energy.meter.id", "Energy meter id", "ID счётчика энергии"),
  id("energy.tariff.id", "Tariff id", "ID тарифа"),
]);

// —— B6 Smart home appliances ——
write("layer-b-smarthome.json", "B", [
  q("smarthome.appliance.power", "W", "Appliance power", "Мощность прибора"),
  q("smarthome.appliance.energy", "Wh", "Appliance energy", "Энергия прибора"),
  enu("smarthome.appliance.state", ["off", "on", "standby", "running", "error"], "Appliance state", "Состояние прибора"),
  q("smarthome.refrigerator.temperature", "Cel", "Fridge temperature", "Температура холодильника"),
  q("smarthome.freezer.temperature", "Cel", "Freezer temperature", "Температура морозилки"),
  q("smarthome.oven.temperature", "Cel", "Oven temperature", "Температура духовки"),
  q("smarthome.oven.setpoint", "Cel", "Oven setpoint", "Уставка духовки"),
  q("smarthome.washer.cycle_progress", "%", "Washer progress", "Прогресс стирки", { range: { min: 0, max: 100 } }),
  enu("smarthome.washer.cycle", ["idle", "wash", "rinse", "spin", "done", "error"], "Washer cycle", "Цикл стиральной машины"),
  q("smarthome.dryer.remaining_time", "s", "Dryer remaining time", "Остаток сушки"),
  q("smarthome.dishwasher.remaining_time", "s", "Dishwasher remaining", "Остаток посудомойки"),
  q("smarthome.vacuum.battery", "%", "Vacuum battery", "Батарея робота-пылесоса", { range: { min: 0, max: 100 } }),
  enu("smarthome.vacuum.state", ["docked", "cleaning", "returning", "paused", "error"], "Vacuum state", "Состояние пылесоса"),
  q("smarthome.vacuum.area_cleaned", "m2", "Area cleaned", "Убранная площадь"),
  logical("smarthome.curtain.open", "Curtain open", "Штора открыта"),
  q("smarthome.curtain.position", "%", "Curtain position", "Положение шторы", { range: { min: 0, max: 100 } }),
  q("smarthome.lock.battery", "%", "Lock battery", "Батарея замка", { range: { min: 0, max: 100 } }),
  enu("smarthome.lock.state", ["locked", "unlocked", "jammed", "unknown"], "Lock state", "Состояние замка"),
  cmd("smarthome.lock", ["lock", "unlock"], "Lock command", "Команда замка"),
  logical("smarthome.doorbell.pressed", "Doorbell pressed", "Звонок нажат"),
  q("smarthome.camera.people_count", "-", "People count", "Число людей", { encodings: ["u8", "i16"], sensitivity: "personal" }),
  media("smarthome.camera.snapshot_ref", "Camera snapshot", "Снимок камеры"),
]);

console.log("Layer B seeds written");
