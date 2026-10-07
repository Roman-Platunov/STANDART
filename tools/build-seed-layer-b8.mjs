#!/usr/bin/env node
/**
 * Layer B8 — continue world-domain coverage.
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
const media = (pathStr, titleEn, titleRu) => ({
  path: pathStr, kind: "media", unit: "-", titleEn, titleRu,
  encodings: ["utf8"], sensitivity: "internal",
});

function write(name, types) {
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B8", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-nuclear_ops.json", [
  id("nuclear_ops.unit.id", "Nuclear unit id", "ID энергоблока"),
  id("nuclear_ops.channel.id", "Instrumentation channel id", "ID канала КИПиА"),
  q("nuclear_ops.reactor.power", "%", "Reactor thermal power", "Тепловая мощность реактора", { range: { min: 0, max: 110 } }),
  q("nuclear_ops.coolant.flow", "kg/s", "Primary coolant flow", "Расход теплоносителя I контура"),
  q("nuclear_ops.coolant.temperature", "Cel", "Coolant temperature", "Температура теплоносителя"),
  q("nuclear_ops.containment.pressure", "Pa", "Containment pressure", "Давление гермообъёма"),
  q("nuclear_ops.dose.rate", "uSv/h", "Area dose rate", "Мощность дозы"),
  logical("nuclear_ops.scram", "Reactor scram", "Аварийная защита"),
  enu("nuclear_ops.mode", ["startup", "power", "hot_standby", "cold_shutdown", "refuel"], "Nuclear unit mode", "Режим энергоблока"),
]);

write("layer-b-bess.json", [
  id("bess.system.id", "BESS system id", "ID СНЭЭ"),
  id("bess.rack.id", "Battery rack id", "ID стойки батарей"),
  q("bess.soc", "%", "BESS state of charge", "SoC СНЭЭ", { range: { min: 0, max: 100 } }),
  q("bess.soh", "%", "BESS state of health", "SoH СНЭЭ", { range: { min: 0, max: 100 } }),
  q("bess.power", "W", "BESS power (+dis/-chg)", "Мощность СНЭЭ"),
  q("bess.temp.max", "Cel", "Max cell temperature", "Макс. температура ячеек"),
  q("bess.availability", "%", "Availability", "Доступность", { range: { min: 0, max: 100 } }),
  logical("bess.contactor.closed", "Main contactor closed", "Контактор замкнут"),
  enu("bess.mode", ["idle", "charge", "discharge", "standby", "fault"], "BESS mode", "Режим СНЭЭ"),
]);

write("layer-b-charging_hub.json", [
  id("charging_hub.id", "EV charging hub id", "ID хаба зарядки"),
  id("charging_hub.stall.id", "Charger stall id", "ID зарядного места"),
  q("charging_hub.stalls.occupied", "-", "Occupied stalls", "Занятые места", { encodings: ["i16"] }),
  q("charging_hub.power.total", "W", "Total charging power", "Суммарная мощность зарядки"),
  q("charging_hub.queue.wait_min", "min", "Queue wait", "Ожидание в очереди"),
  q("charging_hub.session.energy", "Wh", "Session energy", "Энергия сессии"),
  logical("charging_hub.payment.ok", "Payment authorized", "Оплата авторизована"),
  enu("charging_hub.stall.state", ["free", "preparing", "charging", "finishing", "fault", "offline"], "Stall state", "Состояние места"),
]);

write("layer-b-battery_swap.json", [
  id("battery_swap.station.id", "Battery swap station id", "ID станции смены АКБ"),
  id("battery_swap.cabinet.id", "Swap cabinet id", "ID шкафа АКБ"),
  q("battery_swap.slots.full", "-", "Full batteries available", "Полевые АКБ", { encodings: ["i16"] }),
  q("battery_swap.slots.empty", "-", "Empty slots", "Пустые слоты", { encodings: ["i16"] }),
  q("battery_swap.cycle.time_s", "s", "Swap cycle time", "Время смены"),
  q("battery_swap.queue", "-", "Vehicles in queue", "Очередь ТС", { encodings: ["i16"] }),
  logical("battery_swap.robot.ready", "Swap robot ready", "Робот готов"),
  enu("battery_swap.state", ["open", "busy", "maintenance", "closed"], "Swap station state", "Состояние станции смены"),
]);

write("layer-b-genset.json", [
  id("genset.id", "Generator set id", "ID ДГУ"),
  q("genset.power", "W", "Gen set power", "Мощность ДГУ"),
  q("genset.frequency", "Hz", "Output frequency", "Частота"),
  q("genset.voltage", "V", "Output voltage", "Напряжение"),
  q("genset.fuel.level", "%", "Fuel level", "Уровень топлива", { range: { min: 0, max: 100 } }),
  q("genset.coolant.temperature", "Cel", "Coolant temperature", "Температура охлаждения"),
  q("genset.runtime.h", "h", "Runtime hours", "Моточасы"),
  logical("genset.auto.start", "Auto-start armed", "Автозапуск готов"),
  enu("genset.state", ["off", "cranking", "running", "cooldown", "fault"], "Genset state", "Состояние ДГУ"),
]);

write("layer-b-ups.json", [
  id("ups.id", "UPS system id", "ID ИБП"),
  q("ups.load.pct", "%", "UPS load", "Нагрузка ИБП", { range: { min: 0, max: 150 } }),
  q("ups.battery.soc", "%", "UPS battery SoC", "SoC батареи ИБП", { range: { min: 0, max: 100 } }),
  q("ups.input.voltage", "V", "Input voltage", "Входное напряжение"),
  q("ups.output.voltage", "V", "Output voltage", "Выходное напряжение"),
  q("ups.runtime.min", "min", "Estimated runtime", "Остаток автономии"),
  logical("ups.on_battery", "On battery", "Работа от батареи"),
  enu("ups.mode", ["online", "bypass", "battery", "eco", "fault"], "UPS mode", "Режим ИБП"),
]);

write("layer-b-switchgear.json", [
  id("switchgear.bay.id", "Switchgear bay id", "ID ячейки КРУ"),
  id("switchgear.breaker.id", "Circuit breaker id", "ID выключателя"),
  q("switchgear.voltage", "V", "Bay voltage", "Напряжение ячейки"),
  q("switchgear.current", "A", "Bay current", "Ток ячейки"),
  q("switchgear.sf6.pressure", "Pa", "SF6 pressure", "Давление SF₆"),
  logical("switchgear.breaker.closed", "Breaker closed", "Выключатель включён"),
  logical("switchgear.earth.closed", "Earth switch closed", "Заземление включено"),
  enu("switchgear.state", ["service", "test", "isolated", "earth", "fault"], "Bay state", "Состояние ячейки"),
]);

write("layer-b-scada_rtu.json", [
  id("scada_rtu.id", "RTU id", "ID RTU"),
  id("scada_rtu.point.id", "SCADA point id", "ID точки SCADA"),
  q("scada_rtu.scan.latency_ms", "ms", "Scan latency", "Задержка опроса"),
  q("scada_rtu.comm.uptime", "%", "Comm uptime", "Доступность связи", { range: { min: 0, max: 100 } }),
  q("scada_rtu.cpu", "%", "RTU CPU load", "Загрузка CPU RTU", { range: { min: 0, max: 100 } }),
  logical("scada_rtu.link.up", "RTU link up", "Связь RTU OK"),
  logical("scada_rtu.alarm.unacked", "Unacked alarm", "Неквитированная тревога"),
  enu("scada_rtu.protocol", ["dnp3", "iec104", "modbus", "opcua", "other"], "RTU protocol", "Протокол RTU"),
]);

write("layer-b-tank_farm.json", [
  id("tank_farm.tank.id", "Storage tank id", "ID резервуара"),
  id("tank_farm.site.id", "Tank farm site id", "ID резервуарного парка"),
  q("tank_farm.level", "%", "Tank level", "Уровень в резервуаре", { range: { min: 0, max: 100 } }),
  q("tank_farm.volume", "m3", "Product volume", "Объём продукта"),
  q("tank_farm.temperature", "Cel", "Product temperature", "Температура продукта"),
  q("tank_farm.vapor.pressure", "Pa", "Vapor pressure", "Давление паров"),
  logical("tank_farm.bund.alarm", "Bund high level", "Авария обвалования"),
  enu("tank_farm.product", ["crude", "gasoline", "diesel", "jet", "chemical", "other"], "Stored product", "Хранимый продукт"),
]);

write("layer-b-compressor_station.json", [
  id("compressor_station.id", "Compressor station id", "ID КС"),
  id("compressor_station.unit.id", "Compressor unit id", "ID ГПА"),
  q("compressor_station.suction.pressure", "Pa", "Suction pressure", "Давление всасывания"),
  q("compressor_station.discharge.pressure", "Pa", "Discharge pressure", "Давление нагнетания"),
  q("compressor_station.flow", "m3/h", "Gas flow", "Расход газа"),
  q("compressor_station.vibration", "mm/s", "Unit vibration", "Вибрация агрегата"),
  q("compressor_station.power", "W", "Unit power", "Мощность агрегата"),
  enu("compressor_station.state", ["offline", "start", "load", "unload", "fault"], "Compressor state", "Состояние КС"),
]);

write("layer-b-container_terminal.json", [
  id("container_terminal.id", "Container terminal id", "ID контейнерного терминала"),
  id("container_terminal.crane.id", "STS crane id", "ID причального крана"),
  id("container_terminal.box.id", "Container id", "ID контейнера"),
  q("container_terminal.moves.hour", "-", "Moves per hour", "Операций в час", { encodings: ["i16"] }),
  q("container_terminal.yard.utilization", "%", "Yard utilization", "Загрузка склада", { range: { min: 0, max: 100 } }),
  q("container_terminal.truck.turn_min", "min", "Truck turn time", "Оборот грузовика"),
  q("container_terminal.reefer.power_draw", "W", "Reefer power draw", "Мощность рефов"),
  enu("container_terminal.crane.state", ["idle", "ship", "yard", "maintenance", "fault"], "Crane state", "Состояние крана"),
]);

write("layer-b-railyard.json", [
  id("railyard.id", "Rail yard id", "ID сортировочной станции"),
  id("railyard.track.id", "Yard track id", "ID пути"),
  id("railyard.consist.id", "Consist id", "ID состава"),
  q("railyard.cars.staged", "-", "Cars staged", "Вагонов на путях", { encodings: ["i32"] }),
  q("railyard.hump.speed", "km/h", "Hump speed", "Скорость горки"),
  q("railyard.dwell.h", "h", "Average dwell", "Средний простой"),
  logical("railyard.derail.detector", "Hotbox / derail detector trip", "Срабатывание ДИСК/КТСМ"),
  enu("railyard.ops", ["receive", "classify", "build", "depart", "hold"], "Yard ops phase", "Фаза работы станции"),
]);

write("layer-b-bus_depot.json", [
  id("bus_depot.id", "Bus depot id", "ID автобусного парка"),
  id("bus_depot.vehicle.id", "Depot bus id", "ID автобуса"),
  q("bus_depot.fleet.available", "-", "Buses available", "Доступно автобусов", { encodings: ["i16"] }),
  q("bus_depot.fuel.dispensed", "L", "Fuel dispensed today", "Выдано топлива"),
  q("bus_depot.charger.power", "W", "Depot charger power", "Мощность зарядки парка"),
  q("bus_depot.wash.cycles", "-", "Wash cycles", "Циклы мойки", { encodings: ["i32"] }),
  logical("bus_depot.dispatch.ready", "Ready for dispatch", "Готов к выпуску"),
  enu("bus_depot.vehicle.state", ["parked", "prep", "out", "maintenance", "out_of_service"], "Depot vehicle state", "Состояние ТС в парке"),
]);

write("layer-b-parking_garage.json", [
  id("parking_garage.id", "Parking garage id", "ID паркинга"),
  id("parking_garage.level.id", "Parking level id", "ID уровня паркинга"),
  q("parking_garage.occupancy", "%", "Occupancy", "Занятость", { range: { min: 0, max: 100 } }),
  q("parking_garage.spaces.free", "-", "Free spaces", "Свободные места", { encodings: ["i32"] }),
  q("parking_garage.entry.rate", "/min", "Entry rate", "Въезд/мин"),
  q("parking_garage.co", "ppm", "CO level", "Уровень CO"),
  logical("parking_garage.full", "Garage full", "Паркинг полон"),
  enu("parking_garage.mode", ["open", "full", "event", "closed", "evacuation"], "Garage mode", "Режим паркинга"),
]);

write("layer-b-toll_plaza.json", [
  id("toll_plaza.id", "Toll plaza id", "ID пункта оплаты"),
  id("toll_plaza.lane.id", "Toll lane id", "ID полосы"),
  q("toll_plaza.throughput", "/min", "Vehicles per minute", "ТС в минуту"),
  q("toll_plaza.queue.length", "m", "Queue length", "Длина очереди"),
  q("toll_plaza.revenue.session", "-", "Session transactions", "Транзакций за сессию", { encodings: ["i32"] }),
  logical("toll_plaza.lane.open", "Lane open", "Полоса открыта"),
  logical("toll_plaza.violation", "Toll violation", "Нарушение оплаты"),
  enu("toll_plaza.lane.type", ["cash", "etc", "mixed", "hov", "closed"], "Lane type", "Тип полосы"),
]);

write("layer-b-bridge_health.json", [
  id("bridge_health.bridge.id", "Bridge id", "ID моста"),
  id("bridge_health.sensor.id", "SHM sensor id", "ID датчика SHM"),
  q("bridge_health.strain", "ue", "Strain", "Деформация"),
  q("bridge_health.deflection", "mm", "Midspan deflection", "Прогиб"),
  q("bridge_health.vibration.freq", "Hz", "Modal frequency", "Модальная частота"),
  q("bridge_health.tilt", "deg", "Pier tilt", "Крен опоры"),
  q("bridge_health.scour.depth", "m", "Scour depth", "Глубина размыва"),
  logical("bridge_health.alert", "Structural alert", "Конструктивное предупреждение"),
  enu("bridge_health.condition", ["good", "fair", "poor", "critical"], "Bridge condition", "Состояние моста"),
]);

write("layer-b-traffic_signal.json", [
  id("traffic_signal.intersection.id", "Intersection id", "ID перекрёстка"),
  id("traffic_signal.controller.id", "Signal controller id", "ID контроллера СО"),
  q("traffic_signal.cycle.s", "s", "Cycle length", "Длина цикла"),
  q("traffic_signal.green.s", "s", "Green time", "Время зелёного"),
  q("traffic_signal.queue.length", "m", "Approach queue", "Очередь на подходе"),
  q("traffic_signal.ped.wait_s", "s", "Pedestrian wait", "Ожидание пешехода"),
  logical("traffic_signal.preempt.active", "Transit/emergency preempt", "Приоритет спецтранспорта"),
  enu("traffic_signal.mode", ["fixed", "actuated", "adaptive", "flash", "dark"], "Signal mode", "Режим СО"),
]);

write("layer-b-dark_store.json", [
  id("dark_store.id", "Dark store id", "ID даркстора"),
  id("dark_store.order.id", "Pick order id", "ID заказа сборки"),
  q("dark_store.pick.rate", "/h", "Picks per hour", "Сборок в час"),
  q("dark_store.order.sla_min", "min", "Order SLA", "SLA заказа"),
  q("dark_store.sku.oos", "-", "OOS SKUs", "SKU out-of-stock", { encodings: ["i32"] }),
  q("dark_store.temp.cold", "Cel", "Cold zone temperature", "Температура холодной зоны"),
  logical("dark_store.capacity.full", "At capacity", "На пределе мощности"),
  enu("dark_store.order.state", ["queued", "picking", "packed", "handoff", "cancelled"], "Order state", "Состояние заказа"),
]);

write("layer-b-parcel_locker.json", [
  id("parcel_locker.bank.id", "Locker bank id", "ID постамата"),
  id("parcel_locker.cell.id", "Locker cell id", "ID ячейки"),
  id("parcel_locker.parcel.id", "Parcel id", "ID посылки"),
  q("parcel_locker.occupancy", "%", "Cell occupancy", "Занятость ячеек", { range: { min: 0, max: 100 } }),
  q("parcel_locker.dwell.h", "h", "Average dwell", "Среднее хранение"),
  logical("parcel_locker.door.open", "Cell door open", "Дверь ячейки открыта"),
  logical("parcel_locker.tamper", "Tamper detected", "Вскрытие"),
  enu("parcel_locker.cell.state", ["empty", "reserved", "occupied", "expired", "fault"], "Cell state", "Состояние ячейки"),
]);

write("layer-b-laundry_industrial.json", [
  id("laundry_industrial.plant.id", "Industrial laundry id", "ID прачечной"),
  id("laundry_industrial.batch.id", "Wash batch id", "ID партии стирки"),
  q("laundry_industrial.washer.load_kg", "kg", "Washer load", "Загрузка стиральной машины"),
  q("laundry_industrial.water.temp", "Cel", "Wash temperature", "Температура стирки"),
  q("laundry_industrial.dryer.moisture", "%", "Exit moisture", "Влажность на выходе", { range: { min: 0, max: 100 } }),
  q("laundry_industrial.chemical.dose", "mL", "Chemical dose", "Доза химии"),
  q("laundry_industrial.throughput", "kg/h", "Throughput", "Производительность"),
  enu("laundry_industrial.stage", ["sort", "wash", "extract", "dry", "finish", "pack"], "Laundry stage", "Стадия прачечной"),
]);

write("layer-b-textile_dye.json", [
  id("textile_dye.batch.id", "Dye batch id", "ID партии крашения"),
  id("textile_dye.machine.id", "Dye machine id", "ID красильной машины"),
  q("textile_dye.bath.temperature", "Cel", "Dye bath temperature", "Температура ванны"),
  q("textile_dye.bath.ph", "-", "Dye bath pH", "pH ванны"),
  q("textile_dye.liquor.ratio", "-", "Liquor ratio", "Модуль ванны"),
  q("textile_dye.color.delta_e", "-", "Color ΔE", "Цветовое отклонение ΔE"),
  q("textile_dye.water.use", "L/kg", "Water use", "Расход воды"),
  enu("textile_dye.process", ["reactive", "disperse", "vat", "pigment", "other"], "Dye process", "Процесс крашения"),
]);

write("layer-b-sawmill.json", [
  id("sawmill.line.id", "Sawmill line id", "ID лесопильной линии"),
  id("sawmill.log.id", "Log id", "ID бревна"),
  q("sawmill.log.diameter", "cm", "Log diameter", "Диаметр бревна"),
  q("sawmill.kerf", "mm", "Kerf width", "Ширина пропила"),
  q("sawmill.lumber.yield", "%", "Lumber yield", "Выход пиломатериала", { range: { min: 0, max: 100 } }),
  q("sawmill.moisture", "%", "Lumber moisture", "Влажность пиломатериала", { range: { min: 0, max: 100 } }),
  q("sawmill.throughput", "m3/h", "Log throughput", "Производительность"),
  enu("sawmill.grade", ["select", "common1", "common2", "utility", "other"], "Lumber grade", "Сорт пиломатериала"),
]);

write("layer-b-wood_panel.json", [
  id("wood_panel.press.id", "Panel press id", "ID пресса плит"),
  id("wood_panel.batch.id", "Panel batch id", "ID партии плит"),
  q("wood_panel.press.temperature", "Cel", "Press temperature", "Температура пресса"),
  q("wood_panel.press.pressure", "Pa", "Press pressure", "Давление пресса"),
  q("wood_panel.board.thickness", "mm", "Board thickness", "Толщина плиты"),
  q("wood_panel.board.density", "kg/m3", "Board density", "Плотность плиты"),
  q("wood_panel.formaldehyde", "mg/m3", "Formaldehyde emission", "Эмиссия формальдегида"),
  enu("wood_panel.type", ["particle", "mdf", "osb", "plywood", "other"], "Panel type", "Тип плиты"),
]);

write("layer-b-shoe_mfg.json", [
  id("shoe_mfg.sku.id", "Footwear SKU id", "ID артикула обуви"),
  id("shoe_mfg.line.id", "Footwear line id", "ID линии обуви"),
  q("shoe_mfg.cutting.yield", "%", "Cutting yield", "Выход раскроя", { range: { min: 0, max: 100 } }),
  q("shoe_mfg.stitch.spm", "/min", "Stitching SPM", "Стежков в минуту"),
  q("shoe_mfg.sole.bond_force", "N", "Sole bond force", "Сила склейки подошвы"),
  q("shoe_mfg.defect.rate", "%", "Defect rate", "Доля брака", { range: { min: 0, max: 100 } }),
  q("shoe_mfg.pairs.hour", "-", "Pairs per hour", "Пар в час", { encodings: ["i16"] }),
  enu("shoe_mfg.stage", ["cut", "stitch", "last", "sole", "finish", "pack"], "Footwear stage", "Стадия производства обуви"),
]);

write("layer-b-furniture_mfg.json", [
  id("furniture_mfg.workorder.id", "Furniture work order", "Наряд мебели"),
  id("furniture_mfg.sku.id", "Furniture SKU id", "ID артикула мебели"),
  q("furniture_mfg.cnc.cycle_s", "s", "CNC cycle time", "Цикл ЧПУ"),
  q("furniture_mfg.edge.glue_temp", "Cel", "Edge banding glue temp", "Температура клея кромки"),
  q("furniture_mfg.finish.thickness", "um", "Finish coat thickness", "Толщина покрытия"),
  q("furniture_mfg.assembly.torque", "N.m", "Assembly torque", "Момент сборки"),
  q("furniture_mfg.defect.count", "-", "Defects", "Дефекты", { encodings: ["i32"] }),
  enu("furniture_mfg.stage", ["cut", "edge", "drill", "finish", "assemble", "pack"], "Furniture stage", "Стадия производства мебели"),
]);

write("layer-b-cooling_tower.json", [
  id("cooling_tower.id", "Cooling tower id", "ID градирни"),
  q("cooling_tower.basin.temperature", "Cel", "Basin temperature", "Температура бассейна"),
  q("cooling_tower.temp.approach", "K", "Approach temperature", "Подход"),
  q("cooling_tower.fan.power", "W", "Fan power", "Мощность вентилятора"),
  q("cooling_tower.conductivity", "uS/cm", "Basin conductivity", "Электропроводность"),
  q("cooling_tower.cycles", "-", "Cycles of concentration", "Кратность упаривания"),
  logical("cooling_tower.legionella.risk", "Legionella risk flag", "Риск легионеллы"),
  enu("cooling_tower.mode", ["off", "fan_low", "fan_high", "bypass", "fault"], "Cooling tower mode", "Режим градирни"),
]);

write("layer-b-chiller_plant.json", [
  id("chiller_plant.id", "Chiller plant id", "ID холодильной станции"),
  id("chiller_plant.chiller.id", "Chiller id", "ID чиллера"),
  q("chiller_plant.chw.supply", "Cel", "CHW supply temp", "Температура подачи ХВ"),
  q("chiller_plant.chw.return", "Cel", "CHW return temp", "Температура обратки ХВ"),
  q("chiller_plant.power", "W", "Plant power", "Мощность станции"),
  q("chiller_plant.cop", "-", "Coefficient of performance", "Холодильный коэффициент"),
  q("chiller_plant.load", "%", "Plant load", "Нагрузка", { range: { min: 0, max: 100 } }),
  enu("chiller_plant.mode", ["off", "staging", "run", "economizer", "fault"], "Chiller plant mode", "Режим холодильной станции"),
]);

write("layer-b-heat_pump_fleet.json", [
  id("heat_pump_fleet.unit.id", "Heat pump unit id", "ID теплового насоса"),
  id("heat_pump_fleet.site.id", "Heat pump site id", "ID объекта ТН"),
  q("heat_pump_fleet.cop", "-", "Instant COP", "Мгновенный COP"),
  q("heat_pump_fleet.power", "W", "Electrical power", "Электрическая мощность"),
  q("heat_pump_fleet.outdoor.temp", "Cel", "Outdoor temperature", "Наружная температура"),
  q("heat_pump_fleet.supply.temp", "Cel", "Supply temperature", "Температура подачи"),
  logical("heat_pump_fleet.defrost", "Defrost active", "Оттайка"),
  enu("heat_pump_fleet.mode", ["heat", "cool", "dhw", "off", "fault"], "Heat pump mode", "Режим теплового насоса"),
]);

write("layer-b-solar_thermal.json", [
  id("solar_thermal.array.id", "Solar thermal array id", "ID солнечного коллектора"),
  q("solar_thermal.collector.temp", "Cel", "Collector temperature", "Температура коллектора"),
  q("solar_thermal.storage.temp", "Cel", "Storage temperature", "Температура аккумулятора"),
  q("solar_thermal.flow", "L/min", "Loop flow", "Расход контура"),
  q("solar_thermal.irradiance", "W/m2", "Irradiance", "Облучённость"),
  q("solar_thermal.energy.day", "Wh", "Daily energy", "Энергия за сутки"),
  logical("solar_thermal.stagnation", "Stagnation condition", "Застой перегрева"),
  enu("solar_thermal.type", ["flat", "evacuated", "concentrating", "other"], "Collector type", "Тип коллектора"),
]);

write("layer-b-wind_lidar.json", [
  id("wind_lidar.id", "Wind lidar id", "ID ветрового лидара"),
  q("wind_lidar.wind.speed", "m/s", "Hub-height wind speed", "Скорость ветра на высоте"),
  q("wind_lidar.wind.direction", "deg", "Wind direction", "Направление ветра"),
  q("wind_lidar.ti", "%", "Turbulence intensity", "Интенсивность турбулентности", { range: { min: 0, max: 100 } }),
  q("wind_lidar.shear", "-", "Wind shear exponent", "Показатель сдвига ветра"),
  q("wind_lidar.data.availability", "%", "Data availability", "Доступность данных", { range: { min: 0, max: 100 } }),
  media("wind_lidar.profile.ref", "Wind profile ref", "Референс профиля ветра"),
  enu("wind_lidar.mount", ["ground", "nacelle", "floating", "other"], "Lidar mount", "Тип установки лидара"),
]);

write("layer-b-inverter_string.json", [
  id("inverter_string.inverter.id", "PV inverter id", "ID инвертора"),
  id("inverter_string.string.id", "PV string id", "ID стринга"),
  q("inverter_string.dc.power", "W", "DC power", "Мощность DC"),
  q("inverter_string.ac.power", "W", "AC power", "Мощность AC"),
  q("inverter_string.dc.voltage", "V", "DC voltage", "Напряжение DC"),
  q("inverter_string.efficiency", "%", "Conversion efficiency", "КПД преобразования", { range: { min: 0, max: 100 } }),
  q("inverter_string.soiling", "%", "Soiling loss estimate", "Потери от загрязнения", { range: { min: 0, max: 100 } }),
  enu("inverter_string.state", ["producing", "mppt", "curtailed", "night", "fault"], "Inverter state", "Состояние инвертора"),
]);

write("layer-b-landfill_gas.json", [
  id("landfill_gas.well.id", "LFG well id", "ID скважины свалочного газа"),
  id("landfill_gas.flare.id", "Flare id", "ID факела"),
  q("landfill_gas.ch4", "%", "Methane fraction", "Доля метана", { range: { min: 0, max: 100 } }),
  q("landfill_gas.flow", "m3/h", "Gas flow", "Расход газа"),
  q("landfill_gas.vacuum", "Pa", "Well vacuum", "Вакуум скважины"),
  q("landfill_gas.o2", "%", "Oxygen fraction", "Доля кислорода", { range: { min: 0, max: 100 } }),
  q("landfill_gas.flare.temperature", "Cel", "Flare tip temperature", "Температура факела"),
  enu("landfill_gas.disposition", ["flare", "engine", "pipeline", "vent_emergency"], "Gas disposition", "Назначение газа"),
]);

write("layer-b-mrf.json", [
  id("mrf.plant.id", "MRF plant id", "ID мусоросортировки"),
  id("mrf.line.id", "Sorting line id", "ID линии сортировки"),
  q("mrf.throughput", "t/h", "Throughput", "Производительность"),
  q("mrf.recovery.rate", "%", "Material recovery rate", "Извлечение вторсырья", { range: { min: 0, max: 100 } }),
  q("mrf.contamination", "%", "Outbound contamination", "Засор исходящего", { range: { min: 0, max: 100 } }),
  q("mrf.baler.cycles", "-", "Baler cycles", "Циклы пресса", { encodings: ["i32"] }),
  logical("mrf.optical.online", "Optical sorter online", "Оптический сепаратор online"),
  enu("mrf.stream", ["single", "dual", "commingled", "cnd", "other"], "Inbound stream", "Входящий поток"),
]);

write("layer-b-ewaste.json", [
  id("ewaste.batch.id", "E-waste batch id", "ID партии электролома"),
  id("ewaste.line.id", "E-waste line id", "ID линии электролома"),
  q("ewaste.intake.mass", "kg", "Intake mass", "Масса приёма"),
  q("ewaste.shred.throughput", "kg/h", "Shred throughput", "Производительность шредера"),
  q("ewaste.metal.recovery", "%", "Metal recovery", "Извлечение металлов", { range: { min: 0, max: 100 } }),
  q("ewaste.battery.removed", "-", "Batteries removed", "Извлечено батарей", { encodings: ["i32"] }),
  logical("ewaste.hazard.hold", "Hazardous hold", "Удержание опасных"),
  enu("ewaste.stage", ["receive", "sort", "dismantle", "shred", "separate", "ship"], "E-waste stage", "Стадия электролома"),
]);

write("layer-b-battery_recycle.json", [
  id("battery_recycle.batch.id", "Battery recycle batch id", "ID партии переработки АКБ"),
  id("battery_recycle.furnace.id", "Recycling furnace id", "ID печи переработки"),
  q("battery_recycle.feed.mass", "kg", "Feed mass", "Масса загрузки"),
  q("battery_recycle.furnace.temperature", "Cel", "Furnace temperature", "Температура печи"),
  q("battery_recycle.black_mass.yield", "%", "Black mass yield", "Выход black mass", { range: { min: 0, max: 100 } }),
  q("battery_recycle.li.recovery", "%", "Lithium recovery", "Извлечение лития", { range: { min: 0, max: 100 } }),
  q("battery_recycle.emissions.hf", "mg/m3", "HF emissions", "Выбросы HF"),
  enu("battery_recycle.process", ["pyro", "hydro", "direct", "hybrid"], "Recycle process", "Процесс переработки"),
]);

write("layer-b-mri_suite.json", [
  id("mri_suite.system.id", "MRI system id", "ID МРТ"),
  id("mri_suite.study.id", "MRI study id", "ID исследования", { sensitivity: "personal" }),
  q("mri_suite.field.t", "T", "Main field strength", "Индукция поля"),
  q("mri_suite.helium.level", "%", "Helium level", "Уровень гелия", { range: { min: 0, max: 100 } }),
  q("mri_suite.sar", "W/kg", "SAR", "Удельное поглощение"),
  q("mri_suite.room.temperature", "Cel", "Equipment room temp", "Температура аппаратной"),
  logical("mri_suite.quench", "Magnet quench", "Квенч магнита"),
  enu("mri_suite.state", ["idle", "scan", "service", "quench_recovery", "fault"], "MRI state", "Состояние МРТ"),
]);

write("layer-b-ct_suite.json", [
  id("ct_suite.system.id", "CT system id", "ID КТ"),
  id("ct_suite.study.id", "CT study id", "ID исследования КТ", { sensitivity: "personal" }),
  q("ct_suite.tube.current", "mA", "Tube current", "Ток трубки"),
  q("ct_suite.tube.voltage", "kV", "Tube voltage", "Напряжение трубки"),
  q("ct_suite.dose.ctdi", "mGy", "CTDIvol", "CTDIvol"),
  q("ct_suite.gantry.temp", "Cel", "Gantry temperature", "Температура гентри"),
  q("ct_suite.contrast.volume", "mL", "Contrast volume", "Объём контраста"),
  enu("ct_suite.state", ["idle", "scan", "warmup", "service", "fault"], "CT state", "Состояние КТ"),
]);

write("layer-b-lab_analyzer.json", [
  id("lab_analyzer.device.id", "Lab analyzer id", "ID анализатора"),
  id("lab_analyzer.sample.id", "Lab sample id", "ID пробы", { sensitivity: "personal" }),
  q("lab_analyzer.throughput", "/h", "Samples per hour", "Проб в час"),
  q("lab_analyzer.qc.bias", "%", "QC bias", "Смещение QC"),
  q("lab_analyzer.reagent.remaining", "%", "Reagent remaining", "Остаток реагента", { range: { min: 0, max: 100 } }),
  logical("lab_analyzer.qc.fail", "QC failed", "QC не пройден"),
  logical("lab_analyzer.maintenance.due", "Maintenance due", "Требуется ТО"),
  enu("lab_analyzer.type", ["chem", "heme", "coag", "immunoassay", "molecular", "other"], "Analyzer type", "Тип анализатора"),
]);

write("layer-b-blood_gas.json", [
  id("blood_gas.device.id", "Blood gas analyzer id", "ID анализатора КЩС"),
  id("blood_gas.sample.id", "ABG sample id", "ID пробы КЩС", { sensitivity: "personal" }),
  q("blood_gas.ph", "-", "Blood pH", "pH крови", { sensitivity: "personal" }),
  q("blood_gas.pco2", "mm[Hg]", "pCO2", "pCO₂", { sensitivity: "personal" }),
  q("blood_gas.po2", "mm[Hg]", "pO2", "pO₂", { sensitivity: "personal" }),
  q("blood_gas.lactate", "mmol/L", "Lactate", "Лактат", { sensitivity: "personal" }),
  q("blood_gas.hco3", "mmol/L", "HCO3", "HCO₃", { sensitivity: "personal" }),
  enu("blood_gas.sample.type", ["arterial", "venous", "capillary"], "Sample type", "Тип пробы"),
]);

write("layer-b-pharmacy_compound.json", [
  id("pharmacy_compound.order.id", "Compound order id", "ID рецепта изготовления", { sensitivity: "internal" }),
  id("pharmacy_compound.batch.id", "Compound batch id", "ID серии изготовления"),
  q("pharmacy_compound.weigh.g", "g", "Weighed amount", "Взвешенная масса"),
  q("pharmacy_compound.volume.mL", "mL", "Compounded volume", "Объём препарата"),
  q("pharmacy_compound.beyond_use.d", "d", "Beyond-use date days", "Срок годности (дни)"),
  logical("pharmacy_compound.sterile", "Sterile compound", "Стерильное изготовление"),
  logical("pharmacy_compound.double_check", "Independent double-check", "Независимая двойная проверка"),
  enu("pharmacy_compound.status", ["queued", "weigh", "mix", "verify", "dispense", "reject"], "Compound status", "Статус изготовления"),
]);

write("layer-b-school_bus.json", [
  id("school_bus.vehicle.id", "School bus id", "ID школьного автобуса"),
  id("school_bus.route.id", "School bus route id", "ID школьного маршрута"),
  q("school_bus.riders", "-", "Riders on board", "Пассажиров на борту", { encodings: ["i16"] }),
  q("school_bus.speed", "km/h", "Bus speed", "Скорость автобуса"),
  q("school_bus.stop.dwell_s", "s", "Stop dwell", "Стоянка на остановке"),
  logical("school_bus.stop_arm", "Stop arm extended", "Стоп-сигнал выдвинут"),
  logical("school_bus.child.left_behind", "Child check alarm", "Проверка «ребёнок в салоне»"),
  enu("school_bus.status", ["depot", "to_school", "at_school", "to_home", "out_of_service"], "School bus status", "Статус школьного автобуса"),
]);

write("layer-b-campus_energy.json", [
  id("campus_energy.campus.id", "Campus id", "ID кампуса"),
  id("campus_energy.meter.id", "Campus meter id", "ID счётчика кампуса"),
  q("campus_energy.demand.kW", "W", "Campus demand", "Нагрузка кампуса"),
  q("campus_energy.pv.export", "W", "Campus PV export", "Выдача PV кампуса"),
  q("campus_energy.eui", "kWh/m2", "Energy use intensity", "Удельное энергопотребление"),
  q("campus_energy.carbon.intensity", "kg/kWh", "Grid carbon intensity", "Углеродоёмкость сети"),
  logical("campus_energy.dr.event", "Demand response event", "Событие управления спросом"),
  enu("campus_energy.mode", ["normal", "peak_shave", "island", "emergency"], "Campus energy mode", "Энергорежим кампуса"),
]);

write("layer-b-pool_ops.json", [
  id("pool_ops.pool.id", "Pool id", "ID бассейна"),
  q("pool_ops.temperature", "Cel", "Pool temperature", "Температура воды"),
  q("pool_ops.ph", "-", "Pool pH", "pH воды"),
  q("pool_ops.chlorine.free", "mg/L", "Free chlorine", "Свободный хлор"),
  q("pool_ops.turbidity", "NTU", "Turbidity", "Мутность"),
  q("pool_ops.flow.filter", "m3/h", "Filter flow", "Расход фильтрации"),
  logical("pool_ops.closure", "Pool closed", "Бассейн закрыт"),
  enu("pool_ops.type", ["lap", "leisure", "therapy", "spa", "other"], "Pool type", "Тип бассейна"),
]);

write("layer-b-spa_ops.json", [
  id("spa_ops.facility.id", "Spa facility id", "ID спа"),
  id("spa_ops.room.id", "Treatment room id", "ID кабинета"),
  q("spa_ops.occupancy", "%", "Facility occupancy", "Занятость", { range: { min: 0, max: 100 } }),
  q("spa_ops.sauna.temperature", "Cel", "Sauna temperature", "Температура сауны"),
  q("spa_ops.steam.humidity", "%", "Steam room humidity", "Влажность парной", { range: { min: 0, max: 100 } }),
  q("spa_ops.booking.wait_min", "min", "Booking wait", "Ожидание записи"),
  logical("spa_ops.room.ready", "Room ready", "Кабинет готов"),
  enu("spa_ops.room.state", ["free", "occupied", "turnover", "closed"], "Room state", "Состояние кабинета"),
]);

write("layer-b-concert_hall.json", [
  id("concert_hall.id", "Concert hall id", "ID концертного зала"),
  id("concert_hall.event.id", "Performance event id", "ID представления"),
  q("concert_hall.spl", "dB", "Hall SPL", "Уровень звука в зале"),
  q("concert_hall.rt60", "s", "Reverberation time", "Время реверберации"),
  q("concert_hall.occupancy", "-", "Audience count", "Число зрителей", { encodings: ["i32"] }),
  q("concert_hall.hvac.co2", "ppm", "Audience CO2", "CO₂ в зале"),
  logical("concert_hall.doors.locked", "House doors locked", "Двери зала закрыты"),
  enu("concert_hall.phase", ["dark", "load_in", "rehearsal", "doors", "show", "load_out"], "Show phase", "Фаза шоу"),
]);

write("layer-b-theater_ops.json", [
  id("theater_ops.house.id", "Theater house id", "ID театрального зала"),
  id("theater_ops.production.id", "Production id", "ID постановки"),
  q("theater_ops.fly.cue", "-", "Fly cue number", "Номер полётного кью", { encodings: ["i16"] }),
  q("theater_ops.dimmer.level", "%", "House dimmer level", "Уровень света", { range: { min: 0, max: 100 } }),
  q("theater_ops.stage.temp", "Cel", "Stage temperature", "Температура сцены"),
  logical("theater_ops.fire.curtain", "Fire curtain deployed", "Пожарный занавес"),
  logical("theater_ops.smx.active", "Stage manager GO", "СМ: GO"),
  enu("theater_ops.phase", ["rehearsal", "preset", "act", "intermission", "curtain", "strike"], "Theater phase", "Фаза спектакля"),
]);

write("layer-b-radio_tower.json", [
  id("radio_tower.id", "Radio tower id", "ID радиомачты"),
  id("radio_tower.tx.id", "Transmitter id", "ID передатчика"),
  q("radio_tower.tx.power", "W", "Transmit power", "Мощность передатчика"),
  q("radio_tower.vswr", "-", "VSWR", "КСВ"),
  q("radio_tower.tower.tilt", "deg", "Tower tilt", "Наклон мачты"),
  q("radio_tower.obstruction.light", "-", "Obstruction light status 1/0", "Заградительный огонь", { encodings: ["u8"] }),
  logical("radio_tower.ice.detected", "Ice on structure", "Обледенение"),
  enu("radio_tower.service", ["fm", "am", "tv", "cellular", "microwave", "other"], "Tower service", "Служба на мачте"),
]);

write("layer-b-edge_pop.json", [
  id("edge_pop.id", "Edge PoP id", "ID краевой точки"),
  id("edge_pop.rack.id", "Edge rack id", "ID стойки edge"),
  q("edge_pop.bandwidth.util", "%", "Bandwidth utilization", "Загрузка канала", { range: { min: 0, max: 100 } }),
  q("edge_pop.cache.hit_ratio", "%", "Cache hit ratio", "Cache hit ratio", { range: { min: 0, max: 100 } }),
  q("edge_pop.latency.p95", "ms", "P95 latency", "Задержка P95"),
  q("edge_pop.power", "W", "PoP power", "Мощность PoP"),
  logical("edge_pop.anycast.healthy", "Anycast healthy", "Anycast здоров"),
  enu("edge_pop.state", ["serving", "draining", "maintenance", "down"], "PoP state", "Состояние PoP"),
]);

write("layer-b-payment_terminal.json", [
  id("payment_terminal.device.id", "Payment terminal id", "ID платёжного терминала"),
  id("payment_terminal.merchant.id", "Merchant id", "ID мерчанта", { sensitivity: "internal" }),
  q("payment_terminal.txn.count", "-", "Transactions today", "Транзакций сегодня", { encodings: ["i32"] }),
  q("payment_terminal.txn.amount", "-", "Amount today (minor units)", "Сумма сегодня", { encodings: ["i32"] }),
  q("payment_terminal.battery.pct", "%", "Terminal battery", "Батарея терминала", { range: { min: 0, max: 100 } }),
  logical("payment_terminal.tamper", "Tamper flag", "Вскрытие"),
  logical("payment_terminal.offline", "Offline mode", "Офлайн-режим"),
  enu("payment_terminal.state", ["idle", "card", "pin", "auth", "approved", "declined", "fault"], "Terminal state", "Состояние терминала"),
]);

write("layer-b-atm_network.json", [
  id("atm_network.terminal.id", "ATM id", "ID банкомата"),
  id("atm_network.site.id", "ATM site id", "ID площадки банкомата"),
  q("atm_network.cash.level", "%", "Cash cassette level", "Уровень кассет", { range: { min: 0, max: 100 } }),
  q("atm_network.txn.count", "-", "Transactions today", "Транзакций сегодня", { encodings: ["i32"] }),
  q("atm_network.uptime", "%", "Availability", "Доступность", { range: { min: 0, max: 100 } }),
  logical("atm_network.jam", "Cash jam", "Замятие купюр"),
  logical("atm_network.skimmer.suspect", "Skimmer suspect", "Подозрение на скиммер"),
  enu("atm_network.state", ["online", "out_of_cash", "maintenance", "captured", "offline"], "ATM state", "Состояние банкомата"),
]);

write("layer-b-border_crossing.json", [
  id("border_crossing.point.id", "Border crossing id", "ID пункта пропуска"),
  id("border_crossing.lane.id", "Border lane id", "ID полосы пропуска"),
  q("border_crossing.queue.vehicles", "-", "Vehicles in queue", "ТС в очереди", { encodings: ["i32"] }),
  q("border_crossing.wait.min", "min", "Average wait", "Среднее ожидание"),
  q("border_crossing.throughput", "/h", "Vehicles per hour", "ТС в час"),
  logical("border_crossing.secondary", "Secondary inspection", "Досмотр второй линии"),
  logical("border_crossing.alert", "Watchlist alert", "Срабатывание списка"),
  enu("border_crossing.lane.type", ["car", "truck", "bus", "pedestrian", "closed"], "Lane type", "Тип полосы"),
]);

write("layer-b-weigh_station.json", [
  id("weigh_station.id", "Weigh station id", "ID весового контроля"),
  id("weigh_station.lane.id", "Weigh lane id", "ID полосы весов"),
  q("weigh_station.gross.kg", "kg", "Gross vehicle weight", "Полная масса ТС"),
  q("weigh_station.axle.kg", "kg", "Max axle weight", "Макс. нагрузка на ось"),
  q("weigh_station.speed", "km/h", "Approach speed", "Скорость на подъезде"),
  logical("weigh_station.overweight", "Overweight flag", "Перевес"),
  logical("weigh_station.open", "Station open", "Пункт открыт"),
  enu("weigh_station.result", ["bypass", "static", "citation", "out_of_service"], "Weigh result", "Результат взвешивания"),
]);

write("layer-b-vehicle_inspection.json", [
  id("vehicle_inspection.station.id", "Inspection station id", "ID пункта ТО"),
  id("vehicle_inspection.vehicle.id", "Inspected vehicle id", "ID проверяемого ТС"),
  q("vehicle_inspection.emissions.co", "%", "CO emissions", "Выбросы CO", { range: { min: 0, max: 100 } }),
  q("vehicle_inspection.emissions.hc", "ppm", "HC emissions", "Выбросы HC"),
  q("vehicle_inspection.brake.force", "N", "Brake force", "Тормозная сила"),
  q("vehicle_inspection.headlamp.intensity", "cd", "Headlamp intensity", "Сила света фар"),
  logical("vehicle_inspection.pass", "Inspection pass", "ТО пройдено"),
  enu("vehicle_inspection.result", ["pass", "fail", "advisory", "abort"], "Inspection result", "Результат ТО"),
]);

write("layer-b-radon_monitor.json", [
  id("radon_monitor.device.id", "Radon monitor id", "ID монитора радона"),
  id("radon_monitor.site.id", "Radon site id", "ID площадки радона"),
  q("radon_monitor.bq_m3", "Bq/m3", "Radon concentration", "Концентрация радона"),
  q("radon_monitor.avg_24h", "Bq/m3", "24h average radon", "Средний радон за 24ч"),
  q("radon_monitor.humidity", "%", "Room humidity", "Влажность помещения", { range: { min: 0, max: 100 } }),
  logical("radon_monitor.alarm", "Radon alarm", "Тревога по радону"),
  enu("radon_monitor.method", ["continuous", "charcoal", "electret", "alpha_track"], "Measurement method", "Метод измерения"),
]);

write("layer-b-indoor_air.json", [
  id("indoor_air.zone.id", "IAQ zone id", "ID зоны качества воздуха"),
  id("indoor_air.sensor.id", "IAQ sensor id", "ID датчика IAQ"),
  q("indoor_air.co2", "ppm", "Indoor CO2", "CO₂ в помещении"),
  q("indoor_air.pm25", "ug/m3", "Indoor PM2.5", "PM2.5 в помещении"),
  q("indoor_air.tvoc", "ppb", "TVOC", "ЛХОВ"),
  q("indoor_air.temperature", "Cel", "Indoor temperature", "Температура в помещении"),
  q("indoor_air.humidity", "%", "Indoor humidity", "Влажность в помещении", { range: { min: 0, max: 100 } }),
  enu("indoor_air.quality", ["excellent", "good", "moderate", "poor", "hazardous"], "IAQ category", "Категория IAQ"),
]);

write("layer-b-legionella.json", [
  id("legionella.loop.id", "Water loop id", "ID контура воды"),
  id("legionella.sample.id", "Legionella sample id", "ID пробы легионеллы"),
  q("legionella.cfu", "/L", "CFU per liter", "КОЕ/л"),
  q("legionella.temp.outlet", "Cel", "Outlet temperature", "Температура на точке"),
  q("legionella.chlorine", "mg/L", "Residual disinfectant", "Остаточный дезинфектант"),
  logical("legionella.flush.due", "Flush due", "Требуется промывка"),
  logical("legionella.positive", "Culture positive", "Культура положительная"),
  enu("legionella.risk.level", ["low", "medium", "high", "outbreak"], "Legionella risk", "Риск легионеллы"),
]);

write("layer-b-drought.json", [
  id("drought.region.id", "Drought region id", "ID региона засухи"),
  q("drought.spi", "-", "Standardized precipitation index", "Индекс SPI"),
  q("drought.soil.moisture", "%", "Soil moisture anomaly", "Аномалия влажности почвы"),
  q("drought.reservoir.pct", "%", "Reservoir storage", "Наполнение водохранилищ", { range: { min: 0, max: 100 } }),
  q("drought.days.without_rain", "d", "Days without rain", "Дней без дождя"),
  logical("drought.restriction.active", "Water restriction active", "Ограничения на воду"),
  media("drought.map.ref", "Drought map ref", "Референс карты засухи"),
  enu("drought.category", ["d0", "d1", "d2", "d3", "d4"], "Drought category", "Категория засухи"),
]);

write("layer-b-heat_stress.json", [
  id("heat_stress.station.id", "Heat stress station id", "ID станции теплового стресса"),
  q("heat_stress.wbgt", "Cel", "Wet-bulb globe temperature", "WBGT"),
  q("heat_stress.heat_index", "Cel", "Heat index", "Индекс жары"),
  q("heat_stress.duration.h", "h", "Hours above threshold", "Часы выше порога"),
  q("heat_stress.workforce.at_risk", "-", "Workers at risk count", "Работников в зоне риска", { encodings: ["i32"] }),
  logical("heat_stress.work.stop", "Work stoppage recommended", "Рекомендована остановка работ"),
  enu("heat_stress.level", ["caution", "warning", "danger", "extreme"], "Heat stress level", "Уровень теплового стресса"),
]);

write("layer-b-cubesat_ops.json", [
  id("cubesat_ops.sat.id", "CubeSat id", "ID CubeSat"),
  id("cubesat_ops.pass.id", "Ground pass id", "ID сеанса связи"),
  q("cubesat_ops.battery.soc", "%", "Satellite battery SoC", "SoC батареи спутника", { range: { min: 0, max: 100 } }),
  q("cubesat_ops.temp.board", "Cel", "Board temperature", "Температура платы"),
  q("cubesat_ops.link.snr", "dB", "Downlink SNR", "SNR линии вниз"),
  q("cubesat_ops.pointing.error", "deg", "Pointing error", "Ошибка наведения"),
  logical("cubesat_ops.safe.mode", "Safe mode", "Safe mode"),
  enu("cubesat_ops.mode", ["detumble", "nominal", "payload", "safe", "deorbit"], "CubeSat mode", "Режим CubeSat"),
]);

write("layer-b-telescope_array.json", [
  id("telescope_array.id", "Telescope array id", "ID массива телескопов"),
  id("telescope_array.unit.id", "Telescope unit id", "ID телескопа"),
  q("telescope_array.seeing", "arcsec", "Seeing", "Смётость"),
  q("telescope_array.sky.mag", "mag/arcsec2", "Sky background", "Фон неба"),
  q("telescope_array.humidity", "%", "Dome humidity", "Влажность купола", { range: { min: 0, max: 100 } }),
  q("telescope_array.tracking.error", "arcsec", "Tracking error", "Ошибка гидирования"),
  logical("telescope_array.dome.open", "Dome open", "Купол открыт"),
  enu("telescope_array.state", ["idle", "slewing", "tracking", "weather_hold", "fault"], "Telescope state", "Состояние телескопа"),
]);

write("layer-b-magnetometer_net.json", [
  id("magnetometer_net.station.id", "Magnetometer station id", "ID магнитометрической станции"),
  q("magnetometer_net.bx", "nT", "Magnetic field Bx", "Компонента Bx"),
  q("magnetometer_net.by", "nT", "Magnetic field By", "Компонента By"),
  q("magnetometer_net.bz", "nT", "Magnetic field Bz", "Компонента Bz"),
  q("magnetometer_net.kp", "-", "Kp index local", "Локальный Kp"),
  logical("magnetometer_net.storm", "Geomagnetic storm flag", "Геомагнитная буря"),
  media("magnetometer_net.plot.ref", "Magnetogram ref", "Референс магнитограммы"),
  enu("magnetometer_net.quality", ["good", "disturbed", "calibration", "offline"], "Data quality", "Качество данных"),
]);

console.log("Layer B8 seeds written");
