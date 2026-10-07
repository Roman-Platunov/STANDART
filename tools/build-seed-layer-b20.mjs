#!/usr/bin/env node
/**
 * Layer B20 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B20", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-sat_bus.json", [
  id("sat_bus.id", "Satellite bus id", "ID платформы КА"),
  q("sat_bus.power", "W", "Bus power", "Мощность шины"),
  q("sat_bus.voltage", "V", "Bus voltage", "Напряжение шины"),
  q("sat_bus.temp", "Cel", "Bus temperature", "Температура платформы"),
  q("sat_bus.mode.uptime.h", "h", "Mode uptime", "Время в режиме"),
  q("sat_bus.faults", "-", "Latched faults", "Зафиксированных отказов", { encodings: ["i32"] }),
  logical("sat_bus.safe", "Safe mode", "Безопасный режим"),
  enu("sat_bus.mode", ["nominal", "safe", "eclipse", "commission", "fault"], "Bus mode", "Режим платформы"),
]);

write("layer-b-reaction_wheel.json", [
  id("reaction_wheel.id", "Reaction wheel id", "ID маховика"),
  id("reaction_wheel.sat.id", "Host satellite id", "ID КА"),
  q("reaction_wheel.rpm", "rpm", "Wheel speed", "Обороты маховика"),
  q("reaction_wheel.torque", "N.m", "Commanded torque", "Заданный момент"),
  q("reaction_wheel.current", "A", "Motor current", "Ток двигателя"),
  q("reaction_wheel.temp", "Cel", "Bearing temperature", "Температура подшипника"),
  logical("reaction_wheel.saturate", "Saturated", "Насыщение"),
  enu("reaction_wheel.state", ["run", "idle", "desat", "fault"], "Wheel state", "Состояние маховика"),
]);

write("layer-b-star_tracker.json", [
  id("star_tracker.id", "Star tracker id", "ID звёздного датчика"),
  q("star_tracker.attitude.err", "deg", "Attitude error", "Ошибка ориентации"),
  q("star_tracker.stars", "-", "Stars tracked", "Сопровождаемых звёзд", { encodings: ["i32"] }),
  q("star_tracker.rate", "deg/s", "Angular rate", "Угловая скорость"),
  q("star_tracker.temp", "Cel", "Detector temperature", "Температура детектора"),
  q("star_tracker.fov", "deg", "Field of view", "Поле зрения"),
  logical("star_tracker.lost", "Lost in space", "Потеря ориентировки"),
  enu("star_tracker.state", ["track", "acquire", "blind", "fault"], "Tracker state", "Состояние датчика"),
]);

write("layer-b-thruster_cold.json", [
  id("thruster_cold.id", "Cold-gas thruster id", "ID холодогазового двигателя"),
  q("thruster_cold.pulse.ms", "ms", "Pulse width", "Длительность импульса"),
  q("thruster_cold.pressure", "kPa", "Feed pressure", "Давление питания"),
  q("thruster_cold.impulse", "N.m", "Impulse bit proxy", "Импульс (прокси)"),
  q("thruster_cold.temp", "Cel", "Nozzle temperature", "Температура сопла"),
  q("thruster_cold.cycles", "-", "Firing cycles", "Циклов включения", { encodings: ["i32"] }),
  logical("thruster_cold.valve.open", "Valve open", "Клапан открыт"),
  enu("thruster_cold.propellant", ["n2", "xe", "ar", "other"], "Propellant", "Рабочее тело"),
]);

write("layer-b-propellant_tank.json", [
  id("propellant_tank.id", "Propellant tank id", "ID бака топлива КА"),
  q("propellant_tank.pressure", "kPa", "Tank pressure", "Давление бака"),
  q("propellant_tank.temp", "Cel", "Tank temperature", "Температура бака"),
  q("propellant_tank.fill", "%", "Fill fraction", "Степень заполнения", { range: { min: 0, max: 100 } }),
  q("propellant_tank.mass", "kg", "Propellant mass", "Масса топлива"),
  q("propellant_tank.ullage", "%", "Ullage", "Газовая подушка", { range: { min: 0, max: 100 } }),
  logical("propellant_tank.low", "Low propellant", "Мало топлива"),
  enu("propellant_tank.fluid", ["hydrazine", "xenon", "n2o4", "green", "other"], "Fluid", "Жидкость"),
]);

write("layer-b-solar_array_sat.json", [
  id("solar_array_sat.id", "Solar array id", "ID солнечной батареи КА"),
  q("solar_array_sat.current", "A", "Array current", "Ток батареи"),
  q("solar_array_sat.voltage", "V", "Array voltage", "Напряжение батареи"),
  q("solar_array_sat.power", "W", "Array power", "Мощность батареи"),
  q("solar_array_sat.angle", "deg", "Sun angle", "Угол на Солнце"),
  q("solar_array_sat.temp", "Cel", "Panel temperature", "Температура панели"),
  logical("solar_array_sat.stowed", "Stowed", "Сложена"),
  enu("solar_array_sat.state", ["deploy", "track", "stow", "fault"], "Array state", "Состояние батареи"),
]);

write("layer-b-ttc_radio.json", [
  id("ttc_radio.id", "TT&C radio id", "ID радиолинии ТМИ"),
  id("ttc_radio.sat.id", "TT&C satellite id", "ID КА ТМИ"),
  q("ttc_radio.freq", "Hz", "Carrier frequency", "Несущая частота"),
  q("ttc_radio.ebno", "dB", "Eb/N0", "Eb/N0"),
  q("ttc_radio.ber", "-", "Bit error rate", "Частота ошибок"),
  q("ttc_radio.power", "dBm", "TX power", "Мощность передатчика"),
  logical("ttc_radio.lock", "Carrier lock", "Захват несущей"),
  enu("ttc_radio.band", ["uhf", "s", "x", "ka", "other"], "Band", "Диапазон"),
]);

write("layer-b-payload_cam.json", [
  id("payload_cam.id", "Payload camera id", "ID полезной нагрузки — камера"),
  q("payload_cam.integration.ms", "ms", "Integration time", "Время экспозиции"),
  q("payload_cam.temp", "Cel", "Focal plane temperature", "Температура ФП"),
  q("payload_cam.gain", "-", "Gain", "Усиление"),
  q("payload_cam.frames", "-", "Frames captured", "Снято кадров", { encodings: ["i32"] }),
  q("payload_cam.data.gb", "By", "Data volume", "Объём данных"),
  logical("payload_cam.imaging", "Imaging", "Съёмка"),
  enu("payload_cam.mode", ["pushbroom", "frame", "video", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-sar_radar.json", [
  id("sar_radar.id", "SAR payload id", "ID РСА"),
  q("sar_radar.prf", "Hz", "PRF", "Частота повторения"),
  q("sar_radar.bandwidth", "Hz", "Chirp bandwidth", "Полоса чирпа"),
  q("sar_radar.look.angle", "deg", "Look angle", "Угол визирования"),
  q("sar_radar.power", "W", "RF power", "Мощность СВЧ"),
  q("sar_radar.swath", "km", "Swath width", "Ширина полосы"),
  logical("sar_radar.transmit", "Transmitting", "Передача"),
  enu("sar_radar.mode", ["strip", "spot", "scan", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-ground_antlr.json", [
  id("ground_antlr.id", "Ground antenna id", "ID наземной антенны"),
  id("ground_antlr.pass.id", "Pass id", "ID сеанса"),
  q("ground_antlr.az", "deg", "Azimuth", "Азимут"),
  q("ground_antlr.el", "deg", "Elevation", "Угол места"),
  q("ground_antlr.snr", "dB", "Downlink SNR", "ОСШ нисходящей"),
  q("ground_antlr.wind", "m/s", "Site wind", "Ветер на площадке"),
  logical("ground_antlr.tracking", "Tracking", "Сопровождение"),
  enu("ground_antlr.state", ["idle", "slew", "track", "stow", "fault"], "Antenna state", "Состояние антенны"),
]);

write("layer-b-telecommand.json", [
  id("telecommand.session.id", "TC session id", "ID сеанса командования"),
  id("telecommand.sat.id", "Commanded satellite id", "ID управляемого КА"),
  q("telecommand.queue", "-", "Commands queued", "Команд в очереди", { encodings: ["i32"] }),
  q("telecommand.ack", "%", "ACK rate", "Доля подтверждений", { range: { min: 0, max: 100 } }),
  q("telecommand.latency.s", "s", "Round-trip latency", "Задержка туда-обратно"),
  q("telecommand.reject", "-", "Rejected commands", "Отклонённых команд", { encodings: ["i32"] }),
  logical("telecommand.armed", "Uplink armed", "Передача вооружена"),
  enu("telecommand.state", ["idle", "uplink", "verify", "abort", "fault"], "Session state", "Состояние сеанса"),
]);

write("layer-b-leo_constellation.json", [
  id("leo_constellation.id", "Constellation id", "ID группировки"),
  q("leo_constellation.sats", "-", "Satellites active", "Активных КА", { encodings: ["i32"] }),
  q("leo_constellation.planes", "-", "Orbital planes", "Плоскостей", { encodings: ["i32"] }),
  q("leo_constellation.coverage", "%", "Service coverage", "Покрытие услуги", { range: { min: 0, max: 100 } }),
  q("leo_constellation.handover", "/h", "Handovers per hour", "Хендоверов в час"),
  q("leo_constellation.latency.ms", "ms", "User latency", "Задержка пользователя"),
  logical("leo_constellation.degraded", "Service degraded", "Услуга деградирована"),
  enu("leo_constellation.state", ["nominal", "outage", "maneuver", "commission"], "Constellation state", "Состояние группировки"),
]);

write("layer-b-usage_based_ins.json", [
  id("usage_based_ins.policy.id", "UBI policy id", "ID полиса UBI", { sensitivity: "restricted" }),
  id("usage_based_ins.vehicle.id", "Insured vehicle id", "ID застрахованного ТС"),
  q("usage_based_ins.score", "-", "Driving score", "Оценка вождения"),
  q("usage_based_ins.km", "km", "Period distance", "Пробег за период"),
  q("usage_based_ins.hard.brake", "-", "Hard brakes", "Резких торможений", { encodings: ["i32"] }),
  q("usage_based_ins.night.pct", "%", "Night driving share", "Доля ночных поездок", { range: { min: 0, max: 100 } }),
  logical("usage_based_ins.claim.open", "Open claim", "Открытый убыток"),
  enu("usage_based_ins.tier", ["low", "medium", "high", "review"], "Risk tier", "Уровень риска"),
]);

write("layer-b-dashcam_fleet.json", [
  id("dashcam_fleet.device.id", "Dashcam id", "ID видеорегистратора"),
  id("dashcam_fleet.vehicle.id", "Fleet vehicle id", "ID ТС автопарка"),
  q("dashcam_fleet.events", "/d", "Events per day", "Событий в сутки"),
  q("dashcam_fleet.storage", "%", "Storage used", "Занято хранилища", { range: { min: 0, max: 100 } }),
  q("dashcam_fleet.upload", "By", "Upload volume", "Объём выгрузки"),
  q("dashcam_fleet.battery", "%", "Device battery", "Батарея устройства", { range: { min: 0, max: 100 } }),
  logical("dashcam_fleet.recording", "Recording", "Запись"),
  enu("dashcam_fleet.trigger", ["gforce", "manual", "geofence", "ai", "other"], "Last trigger", "Последний триггер"),
]);

write("layer-b-telematics_claim.json", [
  id("telematics_claim.claim.id", "Claim id", "ID убытка", { sensitivity: "restricted" }),
  id("telematics_claim.device.id", "Telematics device id", "ID телематики"),
  q("telematics_claim.severity", "m/s2", "Peak crash accel", "Пиковое ускорение ДТП"),
  q("telematics_claim.speed", "m/s", "Impact speed", "Скорость удара"),
  q("telematics_claim.severity.s", "s", "Event duration", "Длительность события"),
  q("telematics_claim.photos", "-", "Photos attached", "Прикреплённых фото", { encodings: ["i32"] }),
  logical("telematics_claim.fnol", "FNOL filed", "FNOL подан"),
  enu("telematics_claim.severity", ["crash", "near_miss", "theft", "other"], "Severity", "Тяжесть"),
]);

write("layer-b-shelf_cam.json", [
  id("shelf_cam.id", "Shelf camera id", "ID камеры полки"),
  id("shelf_cam.aisle.id", "Aisle id", "ID прохода"),
  q("shelf_cam.oos", "%", "Out-of-stock estimate", "Оценка out-of-stock", { range: { min: 0, max: 100 } }),
  q("shelf_cam.planogram", "%", "Planogram compliance", "Соответствие планограмме", { range: { min: 0, max: 100 } }),
  q("shelf_cam.events", "/h", "Shelf events", "Событий полки"),
  q("shelf_cam.confidence", "%", "Detection confidence", "Уверенность детекции", { range: { min: 0, max: 100 } }),
  logical("shelf_cam.alert", "Restock alert", "Тревога пополнения"),
  enu("shelf_cam.state", ["ok", "oos", "misplaced", "offline", "fault"], "Shelf state", "Состояние полки"),
]);

write("layer-b-esl_tag.json", [
  id("esl_tag.id", "ESL tag id", "ID электронных ценников"),
  id("esl_tag.sku.id", "Priced SKU id", "ID SKU ценника"),
  q("esl_tag.battery", "%", "Tag battery", "Батарея ценника", { range: { min: 0, max: 100 } }),
  q("esl_tag.updates", "/d", "Price updates", "Обновлений цены"),
  q("esl_tag.rssi", "dBm", "Gateway RSSI", "RSSI шлюза"),
  q("esl_tag.price", "-", "Displayed price", "Отображаемая цена"),
  logical("esl_tag.sync", "In sync", "Синхронизирован"),
  enu("esl_tag.state", ["ok", "update", "low_batt", "orphan", "fault"], "Tag state", "Состояние ценника"),
]);

write("layer-b-people_counter.json", [
  id("people_counter.id", "People counter id", "ID счётчика посетителей"),
  id("people_counter.zone.id", "Count zone id", "ID зоны подсчёта"),
  q("people_counter.in", "-", "Entries", "Входов", { encodings: ["i32"] }),
  q("people_counter.out", "-", "Exits", "Выходов", { encodings: ["i32"] }),
  q("people_counter.occupancy", "-", "Current occupancy", "Текущая заполненность", { encodings: ["i32"] }),
  q("people_counter.dwell.s", "s", "Average dwell", "Среднее время пребывания"),
  logical("people_counter.capacity", "At capacity", "Заполненность максимальна"),
  enu("people_counter.tech", ["tof", "stereo", "wifi", "thermal", "other"], "Technology", "Технология"),
]);

write("layer-b-queue_mgmt.json", [
  id("queue_mgmt.lane.id", "Queue lane id", "ID кассовой/очереди"),
  q("queue_mgmt.length", "-", "People in queue", "Людей в очереди", { encodings: ["i32"] }),
  q("queue_mgmt.wait.s", "s", "Expected wait", "Ожидаемое ожидание"),
  q("queue_mgmt.throughput", "/h", "Customers per hour", "Клиентов в час"),
  q("queue_mgmt.open.lanes", "-", "Open lanes", "Открытых линий", { encodings: ["i32"] }),
  q("queue_mgmt.abandon", "%", "Abandon rate", "Доля отказов", { range: { min: 0, max: 100 } }),
  logical("queue_mgmt.alert", "Long queue alert", "Тревога длинной очереди"),
  enu("queue_mgmt.state", ["open", "closed", "express", "self_checkout"], "Lane state", "Состояние линии"),
]);

write("layer-b-planogram_ops.json", [
  id("planogram_ops.store.id", "Store id", "ID магазина"),
  id("planogram_ops.fixture.id", "Fixture id", "ID стеллажа"),
  q("planogram_ops.compliance", "%", "Compliance", "Соответствие", { range: { min: 0, max: 100 } }),
  q("planogram_ops.gaps", "-", "Facing gaps", "Пропусков фейсингов", { encodings: ["i32"] }),
  q("planogram_ops.audits", "/d", "Audits per day", "Аудитов в сутки"),
  q("planogram_ops.skus", "-", "SKUs on fixture", "SKU на стеллаже", { encodings: ["i32"] }),
  logical("planogram_ops.due", "Reset due", "Пора переставлять"),
  enu("planogram_ops.state", ["compliant", "drift", "reset", "unknown"], "Planogram state", "Состояние планограммы"),
]);

write("layer-b-loss_prevention.json", [
  id("loss_prevention.store.id", "LP store id", "ID магазина LP"),
  id("loss_prevention.event.id", "LP event id", "ID события LP"),
  q("loss_prevention.alarms", "/h", "EAS alarms", "Срабатываний EAS"),
  q("loss_prevention.shrink", "%", "Shrink estimate", "Оценка потерь", { range: { min: 0, max: 100 } }),
  q("loss_prevention.cameras", "-", "Cameras online", "Камер онлайн", { encodings: ["i32"] }),
  q("loss_prevention.exceptions", "-", "POS exceptions", "Исключений POS", { encodings: ["i32"] }),
  logical("loss_prevention.escalate", "Escalation open", "Эскалация открыта"),
  enu("loss_prevention.severity", ["info", "watch", "incident", "theft"], "Severity", "Тяжесть"),
]);

write("layer-b-batch_reactor.json", [
  id("batch_reactor.id", "Batch reactor id", "ID периодического реактора"),
  id("batch_reactor.batch.id", "Reactor batch id", "ID партии реактора"),
  q("batch_reactor.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("batch_reactor.pressure", "kPa", "Reactor pressure", "Давление реактора"),
  q("batch_reactor.agitation", "rpm", "Agitator speed", "Обороты мешалки"),
  q("batch_reactor.level", "%", "Level", "Уровень", { range: { min: 0, max: 100 } }),
  logical("batch_reactor.exotherm", "Exotherm", "Экзотермия"),
  enu("batch_reactor.state", ["charge", "react", "cool", "discharge", "cip", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-distill_column.json", [
  id("distill_column.id", "Distillation column id", "ID ректификационной колонны"),
  q("distill_column.top.temp", "Cel", "Top temperature", "Температура верха"),
  q("distill_column.bottom.temp", "Cel", "Bottom temperature", "Температура низа"),
  q("distill_column.reflux", "-", "Reflux ratio", "Флегмовое число"),
  q("distill_column.pressure", "kPa", "Column pressure", "Давление колонны"),
  q("distill_column.feed", "kg/h", "Feed rate", "Подача"),
  logical("distill_column.flood", "Flooding", "Захлёбывание"),
  enu("distill_column.state", ["startup", "run", "turndown", "shutdown", "fault"], "Column state", "Состояние колонны"),
]);

write("layer-b-crystallizer.json", [
  id("crystallizer.id", "Crystallizer id", "ID кристаллизатора"),
  q("crystallizer.temp", "Cel", "Magma temperature", "Температура магмы"),
  q("crystallizer.supersat", "-", "Supersaturation", "Пересыщение"),
  q("crystallizer.level", "%", "Level", "Уровень", { range: { min: 0, max: 100 } }),
  q("crystallizer.agitation", "rpm", "Agitator speed", "Обороты мешалки"),
  q("crystallizer.size", "um", "Mean crystal size", "Средний размер кристаллов"),
  logical("crystallizer.foul", "Fouling", "Загрязнение"),
  enu("crystallizer.type", ["cooling", "evap", "reactive", "other"], "Type", "Тип"),
]);

write("layer-b-dryer_spray.json", [
  id("dryer_spray.id", "Spray dryer id", "ID распылительной сушилки"),
  q("dryer_spray.inlet.temp", "Cel", "Inlet temperature", "Температура на входе"),
  q("dryer_spray.outlet.temp", "Cel", "Outlet temperature", "Температура на выходе"),
  q("dryer_spray.feed", "kg/h", "Feed rate", "Подача"),
  q("dryer_spray.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("dryer_spray.atomizer", "rpm", "Atomizer speed", "Обороты распылителя"),
  logical("dryer_spray.stick", "Chamber sticking", "Налипание в камере"),
  enu("dryer_spray.state", ["heat", "spray", "cool", "cip", "fault"], "Dryer state", "Состояние сушилки"),
]);

write("layer-b-tablet_press.json", [
  id("tablet_press.id", "Tablet press id", "ID таблетпресса"),
  id("tablet_press.batch.id", "Tablet batch id", "ID партии таблеток"),
  q("tablet_press.speed", "/h", "Tablets per hour", "Таблеток в час"),
  q("tablet_press.force", "kN", "Compression force", "Усилие прессования"),
  q("tablet_press.weight", "mg", "Tablet weight", "Масса таблетки"),
  q("tablet_press.hardness", "N", "Hardness", "Твёрдость"),
  logical("tablet_press.reject", "Reject high", "Высокий брак"),
  enu("tablet_press.state", ["setup", "run", "sample", "clean", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-blister_line.json", [
  id("blister_line.id", "Blister line id", "ID линии блистеров"),
  id("blister_line.batch.id", "Blister batch id", "ID партии блистеров"),
  q("blister_line.speed", "/h", "Blisters per hour", "Блистеров в час"),
  q("blister_line.seal.temp", "Cel", "Seal temperature", "Температура сварки"),
  q("blister_line.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("blister_line.forming", "Cel", "Forming temperature", "Температура формовки"),
  logical("blister_line.vision.fail", "Vision fail", "Брак зрения"),
  enu("blister_line.state", ["form", "fill", "seal", "carton", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-ampoule_fill.json", [
  id("ampoule_fill.line.id", "Ampoule fill line id", "ID линии ампул"),
  id("ampoule_fill.batch.id", "Ampoule batch id", "ID партии ампул"),
  q("ampoule_fill.volume", "mL", "Fill volume", "Объём наполнения"),
  q("ampoule_fill.speed", "/h", "Ampoules per hour", "Ампул в час"),
  q("ampoule_fill.particles", "/L", "Particle count", "Счёт частиц"),
  q("ampoule_fill.seal.fail", "%", "Seal fail rate", "Брак запайки", { range: { min: 0, max: 100 } }),
  logical("ampoule_fill.aseptic.ok", "Aseptic OK", "Асептика OK"),
  enu("ampoule_fill.state", ["wash", "sterilize", "fill", "seal", "inspect", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-isolator_pharma.json", [
  id("isolator_pharma.id", "Pharma isolator id", "ID изолятора"),
  q("isolator_pharma.pressure", "Pa", "Chamber pressure", "Давление камеры"),
  q("isolator_pharma.particles", "/L", "Particle count", "Счёт частиц"),
  q("isolator_pharma.h2o2", "ppm", "H2O2 residual", "Остаток H2O2"),
  q("isolator_pharma.gloves", "-", "Glove integrity checks due", "Проверок перчаток к сроку", { encodings: ["i32"] }),
  q("isolator_pharma.temp", "Cel", "Chamber temperature", "Температура камеры"),
  logical("isolator_pharma.breach", "Containment breach", "Нарушение герметичности"),
  enu("isolator_pharma.state", ["idle", "decon", "process", "maintain", "fault"], "Isolator state", "Состояние изолятора"),
]);

write("layer-b-water_for_inj.json", [
  id("water_for_inj.system.id", "WFI system id", "ID системы ВДИ"),
  q("water_for_inj.temp", "Cel", "Loop temperature", "Температура контура"),
  q("water_for_inj.toc", "ppb", "TOC", "ООУ"),
  q("water_for_inj.conductivity", "uS/cm", "Conductivity", "Проводимость"),
  q("water_for_inj.flow", "L/h", "Loop flow", "Расход контура"),
  q("water_for_inj.endotoxin", "/L", "Endotoxin count", "Счёт эндотоксина"),
  logical("water_for_inj.in_spec", "In specification", "В спецификации"),
  enu("water_for_inj.state", ["produce", "sanitize", "idle", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-pure_steam.json", [
  id("pure_steam.generator.id", "Pure steam generator id", "ID генератора чистого пара"),
  q("pure_steam.pressure", "kPa", "Steam pressure", "Давление пара"),
  q("pure_steam.temp", "Cel", "Steam temperature", "Температура пара"),
  q("pure_steam.ncg", "%", "Non-condensables", "Неконденсируемые", { range: { min: 0, max: 100 } }),
  q("pure_steam.dryness", "-", "Dryness fraction", "Степень сухости"),
  q("pure_steam.prod", "kg/h", "Steam production", "Выработка пара"),
  logical("pure_steam.in_spec", "Quality OK", "Качество OK"),
  enu("pure_steam.state", ["produce", "idle", "sanitize", "fault"], "Generator state", "Состояние генератора"),
]);

write("layer-b-weigh_dispense.json", [
  id("weigh_dispense.booth.id", "Dispensing booth id", "ID кабины отвешивания"),
  id("weigh_dispense.batch.id", "Dispense batch id", "ID партии отвешивания"),
  q("weigh_dispense.target", "kg", "Target mass", "Целевая масса"),
  q("weigh_dispense.actual", "kg", "Actual mass", "Фактическая масса"),
  q("weigh_dispense.tolerance", "%", "Tolerance used", "Использованный допуск", { range: { min: 0, max: 100 } }),
  q("weigh_dispense.components", "-", "Components weighed", "Взвешенных компонентов", { encodings: ["i32"] }),
  logical("weigh_dispense.verified", "Second person verified", "Проверено вторым лицом"),
  enu("weigh_dispense.state", ["idle", "weigh", "verify", "complete", "fault"], "Booth state", "Состояние кабины"),
]);

write("layer-b-fume_hood.json", [
  id("fume_hood.id", "Fume hood id", "ID вытяжного шкафа"),
  q("fume_hood.face.vel", "m/s", "Face velocity", "Скорость в створе"),
  q("fume_hood.sash", "%", "Sash open", "Открытие створки", { range: { min: 0, max: 100 } }),
  q("fume_hood.alarm.s", "s", "Alarm duration", "Длительность тревоги"),
  q("fume_hood.exhaust", "m3/h", "Exhaust flow", "Расход вытяжки"),
  q("fume_hood.temp", "Cel", "Hood temperature", "Температура шкафа"),
  logical("fume_hood.safe", "Safe to work", "Безопасно работать"),
  enu("fume_hood.state", ["ok", "low_flow", "sash_high", "fault"], "Hood state", "Состояние шкафа"),
]);

write("layer-b-biosafety_cab.json", [
  id("biosafety_cab.id", "Biosafety cabinet id", "ID бокса биобезопасности"),
  q("biosafety_cab.downflow", "m/s", "Downflow velocity", "Скорость нисходящего потока"),
  q("biosafety_cab.inflow", "m/s", "Inflow velocity", "Скорость входящего потока"),
  q("biosafety_cab.filter.life", "%", "HEPA life remaining", "Остаток ресурса HEPA", { range: { min: 0, max: 100 } }),
  q("biosafety_cab.hours", "h", "Runtime hours", "Часы наработки"),
  q("biosafety_cab.sash", "%", "Sash height", "Высота створки", { range: { min: 0, max: 100 } }),
  logical("biosafety_cab.alarm", "Cabinet alarm", "Тревога бокса"),
  enu("biosafety_cab.class", ["i", "ii_a2", "ii_b2", "iii", "other"], "Class", "Класс"),
]);

write("layer-b-glovebox.json", [
  id("glovebox.id", "Glovebox id", "ID перчаточного бокса"),
  q("glovebox.o2", "ppm", "Oxygen", "Кислород"),
  q("glovebox.h2o", "ppm", "Moisture", "Влага"),
  q("glovebox.pressure", "Pa", "Box pressure", "Давление бокса"),
  q("glovebox.purge", "L/min", "Purge flow", "Расход продувки"),
  q("glovebox.solvent", "ppm", "Solvent vapor", "Пары растворителя"),
  logical("glovebox.regen", "Regenerating", "Регенерация"),
  enu("glovebox.atm", ["n2", "ar", "he", "air", "other"], "Atmosphere", "Атмосфера"),
]);

write("layer-b-incubator_co2.json", [
  id("incubator_co2.id", "CO2 incubator id", "ID CO2-инкубатора"),
  q("incubator_co2.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("incubator_co2.co2", "%", "CO2 concentration", "Концентрация CO2", { range: { min: 0, max: 100 } }),
  q("incubator_co2.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("incubator_co2.o2", "%", "O2 concentration", "Концентрация O2", { range: { min: 0, max: 100 } }),
  q("incubator_co2.door.open_s", "s", "Door open time", "Время открытой двери"),
  logical("incubator_co2.alarm", "Parameter alarm", "Тревога параметра"),
  enu("incubator_co2.state", ["ok", "recover", "decon", "fault"], "Incubator state", "Состояние инкубатора"),
]);

write("layer-b-plate_reader.json", [
  id("plate_reader.id", "Plate reader id", "ID ридера планшетов"),
  id("plate_reader.run.id", "Read run id", "ID прогона чтения"),
  q("plate_reader.temp", "Cel", "Read temperature", "Температура чтения"),
  q("plate_reader.wells", "-", "Wells read", "Прочитано лунок", { encodings: ["i32"] }),
  q("plate_reader.od", "-", "Mean OD", "Средняя ОП"),
  q("plate_reader.time.s", "s", "Read time", "Время чтения"),
  logical("plate_reader.cal", "Calibrated", "Откалиброван"),
  enu("plate_reader.mode", ["absorbance", "fluorescence", "luminescence", "other"], "Mode", "Режим"),
]);

write("layer-b-flow_cytometry.json", [
  id("flow_cytometry.id", "Flow cytometer id", "ID проточного цитометра"),
  id("flow_cytometry.run.id", "Cytometry run id", "ID прогона цитометрии"),
  q("flow_cytometry.events", "-", "Events acquired", "Событий собрано", { encodings: ["i32"] }),
  q("flow_cytometry.rate", "/s", "Event rate", "Скорость событий"),
  q("flow_cytometry.pressure", "kPa", "Sheath pressure", "Давление оболочки"),
  q("flow_cytometry.lasers", "-", "Lasers on", "Лазеров включено", { encodings: ["i32"] }),
  logical("flow_cytometry.clog", "Flow cell clog", "Засор проточной ячейки"),
  enu("flow_cytometry.state", ["ready", "acquire", "wash", "shutdown", "fault"], "Instrument state", "Состояние прибора"),
]);

write("layer-b-pcr_therm.json", [
  id("pcr_therm.id", "Thermal cycler id", "ID амплификатора"),
  id("pcr_therm.run.id", "PCR run id", "ID прогона ПЦР"),
  q("pcr_therm.block.temp", "Cel", "Block temperature", "Температура блока"),
  q("pcr_therm.cycle", "-", "Current cycle", "Текущий цикл", { encodings: ["i32"] }),
  q("pcr_therm.hold.s", "s", "Step hold", "Выдержка шага"),
  q("pcr_therm.lid.temp", "Cel", "Lid temperature", "Температура крышки"),
  logical("pcr_therm.running", "Protocol running", "Протокол выполняется"),
  enu("pcr_therm.state", ["idle", "run", "pause", "complete", "fault"], "Cycler state", "Состояние амплификатора"),
]);

write("layer-b-sequencer_ngs.json", [
  id("sequencer_ngs.id", "NGS sequencer id", "ID секвенатора NGS"),
  id("sequencer_ngs.run.id", "Sequencing run id", "ID прогона секвенирования"),
  q("sequencer_ngs.progress", "%", "Run progress", "Прогресс прогона", { range: { min: 0, max: 100 } }),
  q("sequencer_ngs.q30", "%", "Q30 bases", "Баз Q30", { range: { min: 0, max: 100 } }),
  q("sequencer_ngs.clusters", "-", "Clusters passing filter", "Кластеров прошедших фильтр", { encodings: ["i32"] }),
  q("sequencer_ngs.temp", "Cel", "Flow cell temperature", "Температура проточной ячейки"),
  logical("sequencer_ngs.complete", "Run complete", "Прогон завершён"),
  enu("sequencer_ngs.state", ["load", "sequence", "wash", "idle", "fault"], "Sequencer state", "Состояние секвенатора"),
]);

write("layer-b-freezer_ult.json", [
  id("freezer_ult.id", "ULT freezer id", "ID ультранизкотемпературного морозильника"),
  q("freezer_ult.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("freezer_ult.setpoint", "Cel", "Setpoint", "Уставка"),
  q("freezer_ult.door.open_s", "s", "Door open time", "Время открытой двери"),
  q("freezer_ult.alarm.h", "h", "Hours in alarm", "Часов в тревоге"),
  q("freezer_ult.battery", "%", "Backup battery", "Резервная батарея", { range: { min: 0, max: 100 } }),
  logical("freezer_ult.alarm", "Temperature alarm", "Тревога температуры"),
  enu("freezer_ult.state", ["ok", "warm", "alarm", "defrost", "fault"], "Freezer state", "Состояние морозильника"),
]);

write("layer-b-ln2_cryo_store.json", [
  id("ln2_cryo_store.tank.id", "Cryo storage tank id", "ID криохранилища"),
  q("ln2_cryo_store.level", "%", "LN2 level", "Уровень LN2", { range: { min: 0, max: 100 } }),
  q("ln2_cryo_store.temp", "Cel", "Sample temperature", "Температура образцов"),
  q("ln2_cryo_store.usage", "L/h", "LN2 usage", "Расход LN2"),
  q("ln2_cryo_store.samples", "-", "Samples stored", "Образцов на хранении", { encodings: ["i32"] }),
  q("ln2_cryo_store.lid.open_s", "s", "Lid open time", "Время открытой крышки"),
  logical("ln2_cryo_store.low", "LN2 low", "Мало LN2"),
  enu("ln2_cryo_store.state", ["ok", "fill", "alarm", "inventory", "fault"], "Tank state", "Состояние бака"),
]);

write("layer-b-vaccine_fridge.json", [
  id("vaccine_fridge.id", "Vaccine fridge id", "ID холодильника вакцин"),
  q("vaccine_fridge.temp", "Cel", "Fridge temperature", "Температура холодильника"),
  q("vaccine_fridge.min.24h", "Cel", "24h minimum", "Минимум за 24 ч"),
  q("vaccine_fridge.max.24h", "Cel", "24h maximum", "Максимум за 24 ч"),
  q("vaccine_fridge.door.open_s", "s", "Door open time", "Время открытой двери"),
  q("vaccine_fridge.doses", "-", "Doses on hand", "Дозов в наличии", { encodings: ["i32"] }),
  logical("vaccine_fridge.excursion", "Temp excursion", "Выход температуры"),
  enu("vaccine_fridge.state", ["ok", "warn", "excursion", "offline", "fault"], "Fridge state", "Состояние холодильника"),
]);

write("layer-b-eyewash.json", [
  id("eyewash.station.id", "Eyewash station id", "ID фонтанчика для глаз"),
  q("eyewash.flow", "L/min", "Flow rate", "Расход"),
  q("eyewash.temp", "Cel", "Water temperature", "Температура воды"),
  q("eyewash.last.test.d", "d", "Days since test", "Дней с проверки"),
  q("eyewash.pressure", "kPa", "Supply pressure", "Давление питания"),
  q("eyewash.activations", "-", "Activations", "Срабатываний", { encodings: ["i32"] }),
  logical("eyewash.ready", "Ready", "Готов"),
  enu("eyewash.state", ["ready", "test_due", "out_of_service", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-safety_shower.json", [
  id("safety_shower.id", "Safety shower id", "ID аварийного душа"),
  q("safety_shower.flow", "L/min", "Flow rate", "Расход"),
  q("safety_shower.temp", "Cel", "Water temperature", "Температура воды"),
  q("safety_shower.last.test.d", "d", "Days since test", "Дней с проверки"),
  q("safety_shower.duration.s", "s", "Last activation duration", "Длительность последнего срабатывания"),
  q("safety_shower.activations", "-", "Activations", "Срабатываний", { encodings: ["i32"] }),
  logical("safety_shower.ready", "Ready", "Готов"),
  enu("safety_shower.state", ["ready", "test_due", "out_of_service", "fault"], "Shower state", "Состояние душа"),
]);

write("layer-b-gas_cabin.json", [
  id("gas_cabin.id", "Gas cabinet id", "ID газового шкафа"),
  id("gas_cabin.cylinder.id", "Cylinder id", "ID баллона"),
  q("gas_cabin.pressure", "kPa", "Cylinder pressure", "Давление баллона"),
  q("gas_cabin.flow", "sccm", "Delivery flow", "Расход подачи"),
  q("gas_cabin.leak", "ppm", "Cabinet leak sensor", "Датчик утечки шкафа"),
  q("gas_cabin.exhaust", "m3/h", "Exhaust flow", "Расход вытяжки"),
  logical("gas_cabin.alarm", "Gas alarm", "Газовая тревога"),
  enu("gas_cabin.gas", ["n2", "h2", "cl2", "nh3", "other"], "Gas", "Газ"),
]);

write("layer-b-chem_store.json", [
  id("chem_store.room.id", "Chemical store room id", "ID химсклада"),
  q("chem_store.temp", "Cel", "Room temperature", "Температура помещения"),
  q("chem_store.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("chem_store.voc", "ppm", "VOC level", "Уровень ЛОС"),
  q("chem_store.containers", "-", "Containers on hand", "Ёмкостей в наличии", { encodings: ["i32"] }),
  q("chem_store.exhaust", "m3/h", "Exhaust flow", "Расход вытяжки"),
  logical("chem_store.incompat", "Incompatibility flag", "Флаг несовместимости"),
  enu("chem_store.state", ["ok", "alarm", "inventory", "offline"], "Store state", "Состояние склада"),
]);

write("layer-b-hot_work_permit.json", [
  id("hot_work_permit.id", "Hot work permit id", "ID наряда на огневые работы"),
  id("hot_work_permit.area.id", "Work area id", "ID зоны работ"),
  q("hot_work_permit.gas", "%", "LEL reading", "Показание НПВ", { range: { min: 0, max: 100 } }),
  q("hot_work_permit.duration.min", "min", "Permit duration", "Длительность наряда"),
  q("hot_work_permit.watchers", "-", "Fire watchers", "Постовых", { encodings: ["i32"] }),
  q("hot_work_permit.checks", "-", "Gas checks", "Газовых замеров", { encodings: ["i32"] }),
  logical("hot_work_permit.active", "Permit active", "Наряд активен"),
  enu("hot_work_permit.state", ["draft", "issued", "active", "closed", "suspended"], "Permit state", "Состояние наряда"),
]);

write("layer-b-loto_station.json", [
  id("loto_station.id", "LOTO station id", "ID станции LOTO"),
  id("loto_station.lock.id", "Lock id", "ID блокировки"),
  q("loto_station.locks", "-", "Locks applied", "Наложено блокировок", { encodings: ["i32"] }),
  q("loto_station.points", "-", "Isolation points", "Точек изоляции", { encodings: ["i32"] }),
  q("loto_station.duration.h", "h", "Isolation duration", "Длительность изоляции"),
  q("loto_station.workers", "-", "Workers under LOTO", "Работников под LOTO", { encodings: ["i32"] }),
  logical("loto_station.verified", "Zero energy verified", "Нулевая энергия подтверждена"),
  enu("loto_station.state", ["open", "isolated", "tryout", "release", "complete"], "LOTO state", "Состояние LOTO"),
]);

write("layer-b-confined_entry.json", [
  id("confined_entry.permit.id", "Confined space permit id", "ID наряда на замкнутое пространство"),
  id("confined_entry.space.id", "Space id", "ID пространства"),
  q("confined_entry.o2", "%", "Oxygen", "Кислород", { range: { min: 0, max: 100 } }),
  q("confined_entry.lel", "%", "LEL", "НПВ", { range: { min: 0, max: 100 } }),
  q("confined_entry.h2s", "ppm", "H2S", "H2S"),
  q("confined_entry.entrants", "-", "Entrants inside", "Входящих внутри", { encodings: ["i32"] }),
  logical("confined_entry.attendant", "Attendant present", "Наблюдатель на месте"),
  enu("confined_entry.state", ["test", "enter", "work", "exit", "rescue", "closed"], "Entry state", "Состояние входа"),
]);

write("layer-b-aed_cabinet.json", [
  id("aed_cabinet.id", "AED cabinet id", "ID шкафа АВД"),
  id("aed_cabinet.device.id", "AED device id", "ID АВД"),
  q("aed_cabinet.battery", "%", "AED battery", "Батарея АВД", { range: { min: 0, max: 100 } }),
  q("aed_cabinet.self.test.d", "d", "Days since self-test", "Дней с самотеста"),
  q("aed_cabinet.pads.expiry.d", "d", "Pad days to expiry", "Дней до срока электродов"),
  q("aed_cabinet.temp", "Cel", "Cabinet temperature", "Температура шкафа"),
  logical("aed_cabinet.ready", "AED ready", "АВД готов"),
  enu("aed_cabinet.state", ["ready", "open", "service", "missing", "fault"], "Cabinet state", "Состояние шкафа"),
]);

write("layer-b-alarm_mgmt.json", [
  id("alarm_mgmt.system.id", "Alarm system id", "ID системы аварий"),
  q("alarm_mgmt.active", "-", "Active alarms", "Активных аварий", { encodings: ["i32"] }),
  q("alarm_mgmt.priority1", "-", "Priority-1 alarms", "Аварий приоритета 1", { encodings: ["i32"] }),
  q("alarm_mgmt.flood", "/h", "Alarm rate", "Частота аварий"),
  q("alarm_mgmt.ack.s", "s", "Mean time to ack", "Среднее время квитирования"),
  q("alarm_mgmt.shelved", "-", "Shelved alarms", "Отложенных аварий", { encodings: ["i32"] }),
  logical("alarm_mgmt.flooding", "Alarm flood", "Лавина аварий"),
  enu("alarm_mgmt.state", ["normal", "busy", "flood", "suppress", "offline"], "Alarm state", "Состояние аварий"),
]);

write("layer-b-shift_handover.json", [
  id("shift_handover.id", "Handover id", "ID передачи смены"),
  id("shift_handover.unit.id", "Unit id", "ID установки"),
  q("shift_handover.open.items", "-", "Open items", "Открытых пунктов", { encodings: ["i32"] }),
  q("shift_handover.alarms", "-", "Standing alarms", "Стоящих аварий", { encodings: ["i32"] }),
  q("shift_handover.permits", "-", "Active permits", "Активных нарядов", { encodings: ["i32"] }),
  q("shift_handover.duration.min", "min", "Handover duration", "Длительность передачи"),
  logical("shift_handover.complete", "Handover complete", "Передача завершена"),
  enu("shift_handover.state", ["prep", "brief", "accept", "complete"], "Handover state", "Состояние передачи"),
]);

write("layer-b-historian_tag.json", [
  id("historian_tag.server.id", "Historian server id", "ID сервера историка"),
  q("historian_tag.tags", "-", "Tags collected", "Собираемых тегов", { encodings: ["i32"] }),
  q("historian_tag.rate", "/s", "Samples per second", "Отсчётов в секунду"),
  q("historian_tag.lag.s", "s", "Collection lag", "Отставание сбора"),
  q("historian_tag.disk", "%", "Disk used", "Занято диска", { range: { min: 0, max: 100 } }),
  q("historian_tag.gaps", "-", "Data gaps open", "Открытых разрывов", { encodings: ["i32"] }),
  logical("historian_tag.healthy", "Collection healthy", "Сбор здоров"),
  enu("historian_tag.state", ["collect", "backfill", "archive", "fault"], "Historian state", "Состояние историка"),
]);

write("layer-b-mes_batch.json", [
  id("mes_batch.id", "MES batch id", "ID партии MES"),
  id("mes_batch.recipe.id", "Recipe id", "ID рецепта"),
  q("mes_batch.progress", "%", "Batch progress", "Прогресс партии", { range: { min: 0, max: 100 } }),
  q("mes_batch.yield", "%", "Yield", "Выход", { range: { min: 0, max: 100 } }),
  q("mes_batch.exceptions", "-", "Exceptions", "Исключений", { encodings: ["i32"] }),
  q("mes_batch.duration.min", "min", "Elapsed", "Прошло"),
  logical("mes_batch.released", "Batch released", "Партия выпущена"),
  enu("mes_batch.state", ["setup", "run", "hold", "review", "complete", "abort"], "Batch state", "Состояние партии"),
]);

write("layer-b-retail_media.json", [
  id("retail_media.screen.id", "Retail media screen id", "ID экрана retail media"),
  id("retail_media.campaign.id", "Campaign id", "ID кампании"),
  q("retail_media.impressions", "-", "Impressions", "Показов", { encodings: ["i32"] }),
  q("retail_media.dwell.s", "s", "Dwell time", "Время просмотра"),
  q("retail_media.uptime", "%", "Screen uptime", "Аптайм экрана", { range: { min: 0, max: 100 } }),
  q("retail_media.brightness", "%", "Brightness", "Яркость", { range: { min: 0, max: 100 } }),
  logical("retail_media.playing", "Creative playing", "Ролик играет"),
  enu("retail_media.state", ["play", "idle", "update", "offline", "fault"], "Screen state", "Состояние экрана"),
]);

write("layer-b-fitting_room.json", [
  id("fitting_room.id", "Fitting room id", "ID примерочной"),
  q("fitting_room.occupancy", "-", "Occupied rooms", "Занятых кабин", { encodings: ["i32"] }),
  q("fitting_room.wait.s", "s", "Queue wait", "Ожидание в очереди"),
  q("fitting_room.calls", "-", "Assistance calls", "Вызовов помощи", { encodings: ["i32"] }),
  q("fitting_room.dwell.s", "s", "Average dwell", "Среднее время"),
  q("fitting_room.traffic", "/h", "Entries per hour", "Входов в час"),
  logical("fitting_room.assist", "Assistance requested", "Запрошена помощь"),
  enu("fitting_room.state", ["free", "occupied", "assist", "clean", "offline"], "Room state", "Состояние кабины"),
]);

write("layer-b-granulator.json", [
  id("granulator.id", "Granulator id", "ID гранулятора"),
  id("granulator.batch.id", "Granulation batch id", "ID партии грануляции"),
  q("granulator.power", "W", "Impeller power", "Мощность импеллера"),
  q("granulator.binder", "kg/h", "Binder rate", "Расход связующего"),
  q("granulator.temp", "Cel", "Product temperature", "Температура продукта"),
  q("granulator.size", "um", "Granule size", "Размер гранул"),
  logical("granulator.endpoint", "Endpoint reached", "Достигнута конечная точка"),
  enu("granulator.state", ["dry_mix", "wet_mass", "granulate", "discharge", "fault"], "Granulator state", "Состояние гранулятора"),
]);

write("layer-b-coating_pan.json", [
  id("coating_pan.id", "Coating pan id", "ID дражировочного котла"),
  id("coating_pan.batch.id", "Coating batch id", "ID партии покрытия"),
  q("coating_pan.drum.rpm", "rpm", "Drum speed", "Обороты барабана"),
  q("coating_pan.spray", "kg/h", "Spray rate", "Скорость напыления"),
  q("coating_pan.inlet.temp", "Cel", "Inlet air temperature", "Температура входящего воздуха"),
  q("coating_pan.weight.gain", "%", "Weight gain", "Прирост массы", { range: { min: 0, max: 100 } }),
  logical("coating_pan.twin", "Twinning", "Слипание"),
  enu("coating_pan.state", ["preheat", "spray", "dry", "cool", "fault"], "Pan state", "Состояние котла"),
]);

write("layer-b-solvent_recovery.json", [
  id("solvent_recovery.id", "Solvent recovery unit id", "ID установки рекуперации растворителя"),
  q("solvent_recovery.feed", "kg/h", "Solvent feed", "Подача растворителя"),
  q("solvent_recovery.recovery", "%", "Recovery efficiency", "КПД рекуперации", { range: { min: 0, max: 100 } }),
  q("solvent_recovery.purity", "%", "Recovered purity", "Чистота рекуперата", { range: { min: 0, max: 100 } }),
  q("solvent_recovery.condenser.temp", "Cel", "Condenser temperature", "Температура конденсатора"),
  q("solvent_recovery.vacuum", "Pa", "Still vacuum", "Вакуум куба"),
  logical("solvent_recovery.ready", "Product ready", "Продукт готов"),
  enu("solvent_recovery.state", ["feed", "distill", "condense", "idle", "fault"], "Unit state", "Состояние установки"),
]);

console.log("Layer B20 seeds written");
