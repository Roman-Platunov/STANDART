#!/usr/bin/env node
/**
 * Layer B2 — additional industry packages (aviation, maritime, logistics, telecom, oilgas, retail, rail, robotics, public safety).
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
    kind: "enum",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["enum", "utf8"],
    enumValues: values,
    sensitivity: opts.sensitivity || "public",
  };
}
function logical(pathStr, titleEn, titleRu, opts = {}) {
  return {
    path: pathStr,
    kind: "logical",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["bool", "u8"],
    sensitivity: opts.sensitivity || "public",
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
function write(name, types) {
  fs.writeFileSync(
    path.join(seedsDir, name),
    JSON.stringify({ layer: "B2", name, types }, null, 2)
  );
  console.log(`${name}: ${types.length} types`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-aviation.json", [
  q("aviation.airspeed.ias", "m/s", "Indicated airspeed", "Приборная скорость"),
  q("aviation.airspeed.tas", "m/s", "True airspeed", "Истинная воздушная скорость"),
  q("aviation.airspeed.gs", "m/s", "Ground speed aviation", "Путевая скорость (Авиа)"),
  q("aviation.altitude.baro", "m", "Barometric altitude aviation", "Барометрическая высота (Авиа)"),
  q("aviation.altitude.radio", "m", "Radio altitude", "Радиовысота"),
  q("aviation.altitude.gps", "m", "GPS altitude aviation", "GPS-высота (Авиа)"),
  q("aviation.attitude.roll", "deg", "Aircraft roll", "Крен ВС", { range: { min: -180, max: 180 } }),
  q("aviation.attitude.pitch", "deg", "Aircraft pitch", "Тангаж ВС", { range: { min: -90, max: 90 } }),
  q("aviation.attitude.yaw", "deg", "Aircraft yaw", "Рыскание ВС"),
  q("aviation.heading.magnetic", "deg", "Magnetic heading aviation", "Магнитный курс (Авиа)", { range: { min: 0, max: 360 } }),
  q("aviation.heading.true", "deg", "True heading", "Истинный курс", { range: { min: 0, max: 360 } }),
  q("aviation.vertical_speed", "m/s", "Vertical speed", "Вертикальная скорость"),
  q("aviation.mach", "-", "Mach number", "Число Маха"),
  q("aviation.aoa", "deg", "Angle of attack", "Угол атаки"),
  q("aviation.fuel.quantity", "kg", "Fuel quantity", "Количество топлива"),
  q("aviation.fuel.flow", "kg/h", "Fuel flow aviation", "Расход топлива (Авиа)"),
  q("aviation.engine.n1", "%", "Engine N1", "Обороты N1", { range: { min: 0, max: 120 } }),
  q("aviation.engine.n2", "%", "Engine N2", "Обороты N2", { range: { min: 0, max: 120 } }),
  q("aviation.engine.egt", "Cel", "Exhaust gas temperature", "Температура выхлопа"),
  q("aviation.engine.oil_pressure", "kPa", "Engine oil pressure aviation", "Давление масла (Авиа)"),
  q("aviation.cabin.pressure", "hPa", "Cabin pressure", "Давление в кабине"),
  q("aviation.cabin.altitude", "m", "Cabin altitude", "Высота кабины"),
  logical("aviation.gear.down", "Landing gear down", "Шасси выпущено"),
  logical("aviation.flaps.extended", "Flaps extended", "Закрылки выпущены"),
  enu("aviation.flight_phase", ["parked", "taxi", "takeoff", "climb", "cruise", "descent", "approach", "landing"], "Flight phase", "Фаза полёта"),
  id("aviation.tail_number", "Aircraft tail number", "Бортовой номер"),
  id("aviation.flight_number", "Flight number", "Номер рейса"),
  id("aviation.icao24", "ICAO 24-bit address", "ICAO 24-bit"),
  q("aviation.squawk", "-", "Squawk code", "Код ответчика", { encodings: ["i16", "utf8"] }),
]);

write("layer-b-maritime.json", [
  q("maritime.speed.sog", "kn", "Speed over ground", "Скорость относительно грунта"),
  q("maritime.speed.stw", "kn", "Speed through water", "Скорость относительно воды"),
  q("maritime.course.cog", "deg", "Course over ground maritime", "ПУ (море)", { range: { min: 0, max: 360 } }),
  q("maritime.heading", "deg", "Ship heading", "Курс судна", { range: { min: 0, max: 360 } }),
  q("maritime.depth", "m", "Water depth", "Глубина"),
  q("maritime.draft", "m", "Draft", "Осадка"),
  q("maritime.heave", "m", "Heave", "Вертикальная качка"),
  q("maritime.pitch", "deg", "Ship pitch", "Дифферент/килевая качка"),
  q("maritime.roll", "deg", "Ship roll", "Крен судна"),
  q("maritime.wind.true_speed", "m/s", "True wind speed", "Истинная скорость ветра"),
  q("maritime.wind.true_direction", "deg", "True wind direction", "Истинное направление ветра"),
  q("maritime.wind.apparent_speed", "m/s", "Apparent wind speed", "Кажущаяся скорость ветра"),
  q("maritime.engine.rpm", "/min", "Marine engine RPM", "Обороты судового двигателя"),
  q("maritime.engine.fuel_rate", "L/h", "Marine fuel rate", "Расход топлива судна"),
  q("maritime.cargo.weight", "t", "Cargo weight", "Масса груза"),
  q("maritime.tank.level", "%", "Tank level maritime", "Уровень танка", { range: { min: 0, max: 100 } }),
  enu("maritime.nav_status", ["underway", "anchored", "moored", "aground", "restricted", "undefined"], "AIS nav status", "Навигационный статус AIS"),
  id("maritime.mmsi", "MMSI", "MMSI"),
  id("maritime.imo", "IMO number", "Номер IMO"),
  id("maritime.callsign", "Call sign", "Позывной"),
  id("maritime.voyage.id", "Voyage id", "ID рейса"),
]);

write("layer-b-logistics.json", [
  id("logistics.shipment.id", "Shipment id", "ID отправления"),
  id("logistics.parcel.id", "Parcel id", "ID посылки"),
  id("logistics.container.id", "Container id", "ID контейнера"),
  id("logistics.pallet.id", "Pallet id", "ID палеты"),
  id("logistics.order.id", "Order id", "ID заказа"),
  enu("logistics.shipment.status", ["created", "picked", "in_transit", "out_for_delivery", "delivered", "exception", "returned"], "Shipment status", "Статус отправления"),
  q("logistics.package.weight", "kg", "Package weight", "Масса посылки"),
  q("logistics.package.length", "m", "Package length", "Длина посылки"),
  q("logistics.package.width", "m", "Package width", "Ширина посылки"),
  q("logistics.package.height", "m", "Package height", "Высота посылки"),
  q("logistics.package.volume", "m3", "Package volume", "Объём посылки"),
  logical("logistics.coldchain.breach", "Cold chain breach", "Нарушение холодовой цепи"),
  q("logistics.coldchain.temperature", "Cel", "Cold chain temperature", "Температура холодовой цепи"),
  q("logistics.coldchain.humidity", "%", "Cold chain humidity", "Влажность холодовой цепи", { range: { min: 0, max: 100 } }),
  q("logistics.eta", "s", "ETA unix time", "ETA (unix)", { encodings: ["i32", "f64"] }),
  q("logistics.distance_remaining", "km", "Distance remaining logistics", "Оставшаяся дистанция"),
  id("logistics.carrier.id", "Carrier id", "ID перевозчика"),
  id("logistics.hub.id", "Hub id", "ID хаба"),
  id("logistics.route.id", "Route id", "ID маршрута"),
  q("logistics.scan.count", "-", "Scan count", "Число сканирований", { encodings: ["i32"] }),
  media("logistics.proof_of_delivery_ref", "Proof of delivery", "Подтверждение доставки"),
]);

write("layer-b-telecom.json", [
  q("telecom.cellular.rsrp", "dBm", "RSRP", "RSRP"),
  q("telecom.cellular.rsrq", "dB", "RSRQ", "RSRQ"),
  q("telecom.cellular.sinr", "dB", "SINR", "SINR"),
  q("telecom.cellular.rssi", "dBm", "Cellular RSSI", "RSSI сотовой сети"),
  q("telecom.cellular.earfcn", "-", "EARFCN", "EARFCN", { encodings: ["i32"] }),
  q("telecom.cellular.pci", "-", "PCI", "PCI", { encodings: ["i16"] }),
  q("telecom.cellular.cell_id", "-", "Cell id", "ID соты", { encodings: ["i32", "utf8"] }),
  id("telecom.cellular.imsi", "IMSI", "IMSI", { sensitivity: "restricted" }),
  id("telecom.cellular.imei", "Device IMEI telecom", "IMEI (telecom)", { sensitivity: "restricted" }),
  enu("telecom.cellular.rat", ["gsm", "umts", "lte", "nr", "unknown"], "Radio access technology", "Технология радиодоступа"),
  enu("telecom.cellular.reg_state", ["unknown", "searching", "home", "roaming", "denied"], "Registration state", "Состояние регистрации"),
  q("telecom.wifi.rssi", "dBm", "Wi-Fi RSSI", "RSSI Wi-Fi"),
  q("telecom.wifi.channel", "-", "Wi-Fi channel", "Канал Wi-Fi", { encodings: ["u8", "i16"] }),
  q("telecom.wifi.bandwidth_mhz", "MHz", "Wi-Fi channel width", "Ширина канала Wi-Fi"),
  q("telecom.data.bytes_up", "By", "Uplink bytes", "Байт uplink"),
  q("telecom.data.bytes_down", "By", "Downlink bytes", "Байт downlink"),
  q("telecom.voice.mos", "-", "Voice MOS", "MOS голоса", { range: { min: 1, max: 5 } }),
  q("telecom.session.duration", "s", "Session duration", "Длительность сессии"),
  logical("telecom.emergency.call_active", "Emergency call active", "Экстренный вызов активен"),
]);

write("layer-b-oilgas.json", [
  q("oilgas.wellhead.pressure", "Pa", "Wellhead pressure", "Устьевое давление"),
  q("oilgas.wellhead.temperature", "Cel", "Wellhead temperature", "Устьевая температура"),
  q("oilgas.tubing.pressure", "Pa", "Tubing pressure", "Давление в НКТ"),
  q("oilgas.casing.pressure", "Pa", "Casing pressure", "Затрубное давление"),
  q("oilgas.flow.oil", "m3/h", "Oil flow rate", "Дебит нефти"),
  q("oilgas.flow.gas", "m3/h", "Gas flow rate", "Дебит газа"),
  q("oilgas.flow.water", "m3/h", "Water flow rate", "Дебит воды"),
  q("oilgas.gor", "-", "Gas-oil ratio", "Газовый фактор"),
  q("oilgas.water_cut", "%", "Water cut", "Обводнённость", { range: { min: 0, max: 100 } }),
  q("oilgas.pipeline.pressure", "Pa", "Pipeline pressure", "Давление трубопровода"),
  q("oilgas.pipeline.flow", "m3/h", "Pipeline flow", "Расход трубопровода"),
  q("oilgas.pipeline.leak_probability", "%", "Leak probability", "Вероятность утечки", { range: { min: 0, max: 100 } }),
  q("oilgas.flare.temperature", "Cel", "Flare temperature", "Температура факела"),
  q("oilgas.tank.level", "%", "Oil tank level", "Уровень нефтерезервуара", { range: { min: 0, max: 100 } }),
  q("oilgas.tank.volume", "m3", "Oil tank volume", "Объём нефтерезервуара"),
  q("oilgas.h2s", "ppm", "H2S oilgas", "H2S (нефтегаз)"),
  logical("oilgas.safety.esd_active", "ESD active", "Аварийное отключение активно"),
  logical("oilgas.safety.gas_alarm", "Gas alarm", "Газовая тревога"),
  id("oilgas.well.id", "Well id", "ID скважины"),
  id("oilgas.pad.id", "Pad id", "ID куста"),
  cmd("oilgas.well", ["open", "close", "choke"], "Well command", "Команда скважины"),
]);

write("layer-b-retail.json", [
  id("retail.store.id", "Store id", "ID магазина"),
  id("retail.sku.id", "SKU id retail", "SKU (ритейл)"),
  id("retail.pos.terminal_id", "POS terminal id", "ID кассы"),
  id("retail.transaction.id", "Transaction id", "ID транзакции"),
  q("retail.inventory.count", "-", "Inventory count", "Остаток на складе", { encodings: ["i32"] }),
  q("retail.inventory.reserved", "-", "Reserved count", "Резерв", { encodings: ["i32"] }),
  q("retail.price.amount", "-", "Price amount", "Цена", { encodings: ["f64"] }),
  id("retail.price.currency", "Currency code", "Код валюты"),
  q("retail.sales.quantity", "-", "Sales quantity", "Количество продаж", { encodings: ["i32", "f32"] }),
  q("retail.sales.amount", "-", "Sales amount", "Сумма продаж", { encodings: ["f64"] }),
  q("retail.footfall.count", "-", "Footfall count", "Посещаемость", { encodings: ["i32"] }),
  q("retail.queue.length", "-", "Queue length", "Длина очереди", { encodings: ["u8", "i16"] }),
  q("retail.shelf.temperature", "Cel", "Shelf temperature", "Температура витрины"),
  logical("retail.shelf.stockout", "Stockout", "Out of stock / нет товара"),
  logical("retail.door.open", "Retail door open", "Дверь магазина открыта"),
  enu("retail.payment.method", ["cash", "card", "qr", "nfc", "other"], "Payment method", "Способ оплаты"),
  enu("retail.transaction.status", ["started", "authorized", "captured", "void", "refund", "failed"], "Transaction status", "Статус транзакции"),
]);

write("layer-b-rail.json", [
  q("rail.train.speed", "km/h", "Train speed", "Скорость поезда"),
  q("rail.train.acceleration", "m/s2", "Train acceleration", "Ускорение поезда"),
  q("rail.wheel.temperature", "Cel", "Wheel temperature", "Температура колеса"),
  q("rail.bearing.temperature", "Cel", "Bearing temperature", "Температура буксы"),
  q("rail.pantograph.force", "N", "Pantograph force", "Усилие токоприёмника"),
  q("rail.catenary.voltage", "V", "Catenary voltage", "Напряжение КС"),
  q("rail.brake.pressure", "kPa", "Brake pipe pressure", "Давление ТМ"),
  q("rail.cabin.temperature", "Cel", "Rail cabin temperature", "Температура вагона"),
  logical("rail.door.closed", "Rail door closed", "Двери вагона закрыты"),
  logical("rail.tcs.emergency_brake", "Emergency brake", "Экстренное торможение"),
  enu("rail.train.mode", ["parked", "shunting", "service", "fault"], "Train mode", "Режим поезда"),
  id("rail.train.id", "Train id", "ID поезда"),
  id("rail.wagon.id", "Wagon id", "ID вагона"),
  id("rail.line.id", "Line id", "ID линии"),
  id("rail.signal.id", "Signal id", "ID светофора"),
  enu("rail.signal.state", ["red", "yellow", "green", "flashing", "unknown"], "Signal state", "Состояние светофора"),
]);

write("layer-b-robotics.json", [
  q("robotics.battery.soc", "%", "Robot battery SoC", "Заряд батареи робота", { range: { min: 0, max: 100 } }),
  q("robotics.battery.voltage", "V", "Robot battery voltage", "Напряжение батареи робота"),
  q("robotics.pose.x", "m", "Robot pose X", "Поза робота X"),
  q("robotics.pose.y", "m", "Robot pose Y", "Поза робота Y"),
  q("robotics.pose.z", "m", "Robot pose Z", "Поза робота Z"),
  q("robotics.pose.yaw", "deg", "Robot pose yaw", "Курс робота"),
  q("robotics.velocity.linear", "m/s", "Linear velocity robot", "Линейная скорость робота"),
  q("robotics.velocity.angular", "deg/s", "Angular velocity robot", "Угловая скорость робота"),
  q("robotics.lidar.range_min", "m", "Lidar min range", "Мин. дальность лидара"),
  q("robotics.lidar.range_max", "m", "Lidar max range", "Макс. дальность лидара"),
  q("robotics.obstacle.distance", "m", "Obstacle distance", "Дистанция до препятствия"),
  logical("robotics.obstacle.detected", "Obstacle detected", "Препятствие обнаружено"),
  enu("robotics.nav.state", ["idle", "mapping", "localizing", "navigating", "docking", "fault"], "Navigation state", "Состояние навигации"),
  enu("robotics.task.state", ["idle", "assigned", "running", "paused", "done", "failed"], "Task state", "Состояние задачи"),
  id("robotics.robot.id", "Robot id", "ID робота"),
  id("robotics.mission.id", "Mission id", "ID миссии"),
  id("robotics.map.id", "Map id", "ID карты"),
  cmd("robotics.mission", ["start", "pause", "resume", "abort", "dock"], "Mission command", "Команда миссии"),
  media("robotics.camera.stream_ref", "Robot camera stream", "Поток камеры робота"),
]);

write("layer-b-safety.json", [
  logical("safety.fire.alarm", "Fire alarm", "Пожарная тревога"),
  logical("safety.fire.smoke", "Smoke alarm", "Дымовая тревога"),
  logical("safety.fire.heat", "Heat alarm", "Тепловая тревога"),
  q("safety.fire.temperature", "Cel", "Fire zone temperature", "Температура зоны пожара"),
  logical("safety.gas.alarm", "Gas safety alarm", "Газовая тревога (безопасность)"),
  q("safety.gas.co", "ppm", "CO safety", "CO (безопасность)"),
  q("safety.gas.ch4", "ppm", "CH4 safety", "CH4 (безопасность)"),
  logical("safety.intrusion.alarm", "Intrusion alarm", "Охранная тревога"),
  logical("safety.panic.button", "Panic button", "Кнопка тревоги"),
  enu("safety.system.state", ["normal", "alarm", "fault", "maintenance", "disabled"], "Safety system state", "Состояние системы безопасности"),
  id("safety.zone.id", "Safety zone id", "ID зоны безопасности"),
  id("safety.detector.id", "Detector id", "ID извещателя"),
  q("safety.evacuation.progress", "%", "Evacuation progress", "Прогресс эвакуации", { range: { min: 0, max: 100 } }),
  cmd("safety.alarm", ["silence", "reset", "evacuate"], "Safety alarm command", "Команда тревоги"),
]);

write("layer-b-finance.json", [
  id("finance.account.id", "Account id", "ID счёта", { sensitivity: "restricted" }),
  id("finance.merchant.id", "Merchant id", "ID мерчанта"),
  id("finance.terminal.id", "Payment terminal id", "ID платёжного терминала"),
  q("finance.amount.value", "-", "Money amount", "Сумма", { encodings: ["f64"], sensitivity: "restricted" }),
  id("finance.amount.currency", "ISO currency", "Валюта ISO"),
  enu("finance.tx.type", ["purchase", "refund", "transfer", "withdrawal", "deposit", "fee"], "Transaction type", "Тип операции"),
  enu("finance.tx.status", ["pending", "authorized", "settled", "declined", "reversed"], "Finance tx status", "Статус фин. операции"),
  q("finance.balance.available", "-", "Available balance", "Доступный баланс", { encodings: ["f64"], sensitivity: "restricted" }),
  q("finance.balance.ledger", "-", "Ledger balance", "Бухгалтерский баланс", { encodings: ["f64"], sensitivity: "restricted" }),
  q("finance.fx.rate", "-", "FX rate", "Курс FX", { encodings: ["f64"] }),
  logical("finance.fraud.flag", "Fraud flag", "Флаг мошенничества", { sensitivity: "restricted" }),
  q("finance.fraud.score", "-", "Fraud score", "Скорфрод", { sensitivity: "restricted", range: { min: 0, max: 100 } }),
]);

console.log("Layer B2 seeds written");
