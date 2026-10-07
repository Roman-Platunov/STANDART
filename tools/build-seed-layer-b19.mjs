#!/usr/bin/env node
/**
 * Layer B19 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B19", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-data_hall.json", [
  id("data_hall.id", "Data hall id", "ID машинного зала"),
  q("data_hall.it.load", "W", "IT load", "ИТ-нагрузка"),
  q("data_hall.temp", "Cel", "Hall temperature", "Температура зала"),
  q("data_hall.humidity", "%", "Hall humidity", "Влажность зала", { range: { min: 0, max: 100 } }),
  q("data_hall.racks", "-", "Racks occupied", "Занято стоек", { encodings: ["i32"] }),
  q("data_hall.pue", "-", "Hall PUE", "PUE зала"),
  logical("data_hall.hot.spot", "Hot spot", "Горячая точка"),
  enu("data_hall.state", ["normal", "high_load", "maintenance", "emergency", "offline"], "Hall state", "Состояние зала"),
]);

write("layer-b-pdu_rack.json", [
  id("pdu_rack.id", "Rack PDU id", "ID PDU стойки"),
  id("pdu_rack.rack.id", "Rack id", "ID стойки"),
  q("pdu_rack.power", "W", "PDU power", "Мощность PDU"),
  q("pdu_rack.current", "A", "PDU current", "Ток PDU"),
  q("pdu_rack.voltage", "V", "PDU voltage", "Напряжение PDU"),
  q("pdu_rack.outlets", "-", "Outlets energized", "Включённых розеток", { encodings: ["i32"] }),
  logical("pdu_rack.overload", "Overload", "Перегрузка"),
  enu("pdu_rack.phase", ["single", "three", "other"], "Phase", "Фазность"),
]);

write("layer-b-busway_dc.json", [
  id("busway_dc.id", "DC busway id", "ID шинопровода ЦОД"),
  q("busway_dc.current", "A", "Busway current", "Ток шинопровода"),
  q("busway_dc.voltage", "V", "Busway voltage", "Напряжение шинопровода"),
  q("busway_dc.temp", "Cel", "Joint temperature", "Температура стыка"),
  q("busway_dc.load", "%", "Load", "Нагрузка", { range: { min: 0, max: 100 } }),
  q("busway_dc.taps", "-", "Tap-offs active", "Активных отводов", { encodings: ["i32"] }),
  logical("busway_dc.alarm", "Busway alarm", "Тревога шинопровода"),
  enu("busway_dc.state", ["energized", "isolated", "maintain", "fault"], "Busway state", "Состояние шинопровода"),
]);

write("layer-b-crac_unit.json", [
  id("crac_unit.id", "CRAC id", "ID кондиционера машинного зала"),
  q("crac_unit.supply.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("crac_unit.return.temp", "Cel", "Return temperature", "Температура обратки"),
  q("crac_unit.fan.speed", "%", "Fan speed", "Скорость вентилятора", { range: { min: 0, max: 100 } }),
  q("crac_unit.cooling", "W", "Cooling capacity", "Холодопроизводительность"),
  q("crac_unit.dewpoint", "Cel", "Supply dewpoint", "Точка росы подачи"),
  logical("crac_unit.humidify", "Humidifying", "Увлажнение"),
  enu("crac_unit.mode", ["cool", "dehumidify", "reheat", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-crah_unit.json", [
  id("crah_unit.id", "CRAH id", "ID воздухоохладителя ЦОД"),
  q("crah_unit.supply.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("crah_unit.chw.temp", "Cel", "CHW temperature", "Температура холодной воды"),
  q("crah_unit.valve", "%", "Valve position", "Положение клапана", { range: { min: 0, max: 100 } }),
  q("crah_unit.airflow", "m3/h", "Airflow", "Расход воздуха"),
  q("crah_unit.filter.dp", "Pa", "Filter DP", "Перепад на фильтре"),
  logical("crah_unit.freeze", "Freeze protect", "Защита от замерзания"),
  enu("crah_unit.state", ["run", "idle", "defrost", "fault"], "CRAH state", "Состояние CRAH"),
]);

write("layer-b-containment_dc.json", [
  id("containment_dc.aisle.id", "Containment aisle id", "ID изолированного ряда"),
  q("containment_dc.delta.t", "K", "Aisle delta-T", "Перепад температуры ряда"),
  q("containment_dc.pressure", "Pa", "Containment pressure", "Давление в изоляции"),
  q("containment_dc.bypass", "%", "Bypass air", "Байпас воздуха", { range: { min: 0, max: 100 } }),
  q("containment_dc.doors.open", "-", "Doors open", "Открытых дверей", { encodings: ["i32"] }),
  q("containment_dc.temp.max", "Cel", "Max aisle temperature", "Макс. температура ряда"),
  logical("containment_dc.breach", "Containment breach", "Нарушение изоляции"),
  enu("containment_dc.type", ["hot", "cold", "chimney", "other"], "Type", "Тип"),
]);

write("layer-b-leak_rope.json", [
  id("leak_rope.zone.id", "Leak detection zone id", "ID зоны контроля протечек"),
  q("leak_rope.distance", "m", "Leak distance", "Расстояние до протечки"),
  q("leak_rope.resistance", "Ohm", "Cable resistance", "Сопротивление кабеля"),
  q("leak_rope.zones", "-", "Zones alarmed", "Зон в тревоге", { encodings: ["i32"] }),
  q("leak_rope.temp", "Cel", "Controller temperature", "Температура контроллера"),
  q("leak_rope.battery", "%", "Backup battery", "Резервная батарея", { range: { min: 0, max: 100 } }),
  logical("leak_rope.alarm", "Leak alarm", "Тревога протечки"),
  enu("leak_rope.state", ["normal", "leak", "cable_fault", "offline"], "Zone state", "Состояние зоны"),
]);

write("layer-b-epms.json", [
  id("epms.meter.id", "EPMS meter id", "ID счётчика EPMS"),
  id("epms.branch.id", "Branch circuit id", "ID отходящей линии"),
  q("epms.power", "W", "Active power", "Активная мощность"),
  q("epms.energy", "Wh", "Energy", "Энергия"),
  q("epms.pf", "-", "Power factor", "Коэффициент мощности"),
  q("epms.thd", "%", "THD", "КНИ", { range: { min: 0, max: 100 } }),
  logical("epms.alarm", "Meter alarm", "Тревога счётчика"),
  enu("epms.quality", ["good", "suspect", "gap", "offline"], "Data quality", "Качество данных"),
]);

write("layer-b-dcim.json", [
  id("dcim.instance.id", "DCIM instance id", "ID инстанса DCIM"),
  q("dcim.assets", "-", "Managed assets", "Управляемых активов", { encodings: ["i32"] }),
  q("dcim.alarms", "-", "Open alarms", "Открытых аварий", { encodings: ["i32"] }),
  q("dcim.capacity.power", "%", "Power capacity used", "Использование мощности", { range: { min: 0, max: 100 } }),
  q("dcim.capacity.cool", "%", "Cooling capacity used", "Использование холода", { range: { min: 0, max: 100 } }),
  q("dcim.capacity.space", "%", "Space capacity used", "Использование пространства", { range: { min: 0, max: 100 } }),
  logical("dcim.sync.ok", "Collectors OK", "Сборщики OK"),
  enu("dcim.state", ["ok", "degraded", "maintenance", "offline"], "DCIM state", "Состояние DCIM"),
]);

write("layer-b-sts_switch.json", [
  id("sts_switch.id", "STS id", "ID статического переключателя"),
  q("sts_switch.load", "W", "Load power", "Мощность нагрузки"),
  q("sts_switch.pref.voltage", "V", "Preferred source voltage", "Напряжение предпочтительного ввода"),
  q("sts_switch.alt.voltage", "V", "Alternate source voltage", "Напряжение резервного ввода"),
  q("sts_switch.transfers", "-", "Transfer count", "Число переключений", { encodings: ["i32"] }),
  q("sts_switch.temp", "Cel", "SCR temperature", "Температура тиристоров"),
  logical("sts_switch.on_alt", "On alternate", "На резерве"),
  enu("sts_switch.source", ["preferred", "alternate", "offline", "fault"], "Active source", "Активный ввод"),
]);

write("layer-b-ats_switch.json", [
  id("ats_switch.id", "ATS id", "ID АВР"),
  q("ats_switch.utility.v", "V", "Utility voltage", "Напряжение сети"),
  q("ats_switch.gen.v", "V", "Generator voltage", "Напряжение генератора"),
  q("ats_switch.transfers", "-", "Transfer count", "Число переключений", { encodings: ["i32"] }),
  q("ats_switch.delay.s", "s", "Transfer delay", "Задержка переключения"),
  q("ats_switch.load", "W", "Load power", "Мощность нагрузки"),
  logical("ats_switch.on_gen", "On generator", "На генераторе"),
  enu("ats_switch.position", ["utility", "generator", "neutral", "fault"], "Position", "Положение"),
]);

write("layer-b-battery_monitor.json", [
  id("battery_monitor.string.id", "Battery string id", "ID батареиной сборки"),
  q("battery_monitor.voltage", "V", "String voltage", "Напряжение сборки"),
  q("battery_monitor.current", "A", "String current", "Ток сборки"),
  q("battery_monitor.temp", "Cel", "Battery temperature", "Температура АКБ"),
  q("battery_monitor.soc", "%", "State of charge", "SOC", { range: { min: 0, max: 100 } }),
  q("battery_monitor.impedance", "Ohm", "Internal impedance", "Внутреннее сопротивление"),
  logical("battery_monitor.weak.cell", "Weak cell", "Слабый элемент"),
  enu("battery_monitor.chem", ["vrla", "flooded", "li_ion", "ni_cd", "other"], "Chemistry", "Химия"),
]);

write("layer-b-pue_meter.json", [
  id("pue_meter.site.id", "PUE site id", "ID площадки PUE"),
  q("pue_meter.pue", "-", "PUE", "PUE"),
  q("pue_meter.dcie", "%", "DCiE", "DCiE", { range: { min: 0, max: 100 } }),
  q("pue_meter.it", "W", "IT energy rate", "Мощность ИТ"),
  q("pue_meter.facility", "W", "Facility energy rate", "Мощность инфраструктуры"),
  q("pue_meter.cooling", "W", "Cooling power", "Мощность охлаждения"),
  logical("pue_meter.target.ok", "On target", "В целевом диапазоне"),
  enu("pue_meter.window", ["instant", "daily", "monthly", "trailing"], "Window", "Окно"),
]);

write("layer-b-wue_meter.json", [
  id("wue_meter.site.id", "WUE site id", "ID площадки WUE"),
  q("wue_meter.wue", "L/kWh", "WUE", "WUE"),
  q("wue_meter.makeup", "L/h", "Makeup water", "Подпиточная вода"),
  q("wue_meter.blowdown", "L/h", "Blowdown", "Продувка"),
  q("wue_meter.cycles", "-", "Cycles of concentration", "Кратность концентрирования"),
  q("wue_meter.it.energy", "Wh", "IT energy", "Энергия ИТ"),
  logical("wue_meter.drought", "Drought mode", "Режим засухи"),
  enu("wue_meter.source", ["potable", "reclaimed", "rain", "mixed", "other"], "Water source", "Источник воды"),
]);

write("layer-b-hot_aisle.json", [
  id("hot_aisle.id", "Hot aisle id", "ID горячего ряда"),
  q("hot_aisle.temp", "Cel", "Return temperature", "Температура обратки"),
  q("hot_aisle.pressure", "Pa", "Aisle pressure", "Давление ряда"),
  q("hot_aisle.racks", "-", "Racks in aisle", "Стоек в ряду", { encodings: ["i32"] }),
  q("hot_aisle.exhaust.max", "Cel", "Max exhaust", "Макс. выхлоп"),
  q("hot_aisle.doors", "-", "Doors open", "Открытых дверей", { encodings: ["i32"] }),
  logical("hot_aisle.overtemp", "Overtemperature", "Перегрев"),
  enu("hot_aisle.state", ["sealed", "open", "maintain", "alarm"], "Aisle state", "Состояние ряда"),
]);

write("layer-b-cold_aisle.json", [
  id("cold_aisle.id", "Cold aisle id", "ID холодного ряда"),
  q("cold_aisle.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("cold_aisle.pressure", "Pa", "Aisle pressure", "Давление ряда"),
  q("cold_aisle.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("cold_aisle.racks", "-", "Racks in aisle", "Стоек в ряду", { encodings: ["i32"] }),
  q("cold_aisle.blanking", "%", "Blanking coverage", "Покрытие заглушками", { range: { min: 0, max: 100 } }),
  logical("cold_aisle.underpress", "Underpressure", "Разряжение"),
  enu("cold_aisle.state", ["sealed", "open", "maintain", "alarm"], "Aisle state", "Состояние ряда"),
]);

write("layer-b-in_row_cool.json", [
  id("in_row_cool.id", "In-row cooler id", "ID внутрирядного охладителя"),
  q("in_row_cool.supply.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("in_row_cool.return.temp", "Cel", "Return temperature", "Температура обратки"),
  q("in_row_cool.fan", "%", "Fan speed", "Скорость вентилятора", { range: { min: 0, max: 100 } }),
  q("in_row_cool.cooling", "W", "Cooling capacity", "Холодопроизводительность"),
  q("in_row_cool.water.flow", "L/min", "Water flow", "Расход воды"),
  logical("in_row_cool.leak", "Leak detected", "Обнаружена протечка"),
  enu("in_row_cool.state", ["run", "idle", "standby", "fault"], "Cooler state", "Состояние охладителя"),
]);

write("layer-b-rear_door.json", [
  id("rear_door.id", "Rear-door HX id", "ID теплообменника задней двери"),
  id("rear_door.rack.id", "HX rack id", "ID стойки теплообменника"),
  q("rear_door.air.in", "Cel", "Inlet air temperature", "Температура входящего воздуха"),
  q("rear_door.air.out", "Cel", "Outlet air temperature", "Температура исходящего воздуха"),
  q("rear_door.water.in", "Cel", "Water inlet", "Вход воды"),
  q("rear_door.water.flow", "L/min", "Water flow", "Расход воды"),
  logical("rear_door.clog", "Coil clog risk", "Риск засорения"),
  enu("rear_door.state", ["active", "bypass", "offline", "fault"], "HX state", "Состояние ТО"),
]);

write("layer-b-immersion_tank.json", [
  id("immersion_tank.id", "Immersion tank id", "ID ванны иммерсии"),
  q("immersion_tank.fluid.temp", "Cel", "Fluid temperature", "Температура жидкости"),
  q("immersion_tank.level", "%", "Fluid level", "Уровень жидкости", { range: { min: 0, max: 100 } }),
  q("immersion_tank.it.load", "W", "IT load", "ИТ-нагрузка"),
  q("immersion_tank.cdu.temp", "Cel", "CDU temperature", "Температура CDU"),
  q("immersion_tank.nodes", "-", "Nodes immersed", "Погружённых узлов", { encodings: ["i32"] }),
  logical("immersion_tank.leak", "External leak", "Внешняя протечка"),
  enu("immersion_tank.fluid", ["mineral", "synthetic", "engineered", "other"], "Fluid", "Жидкость"),
]);

write("layer-b-chip_cool.json", [
  id("chip_cool.loop.id", "Chip cooling loop id", "ID контура охлаждения чипов"),
  id("chip_cool.node.id", "Cooled node id", "ID охлаждаемого узла"),
  q("chip_cool.coolant.temp", "Cel", "Coolant temperature", "Температура теплоносителя"),
  q("chip_cool.flow", "L/min", "Coolant flow", "Расход теплоносителя"),
  q("chip_cool.pressure", "kPa", "Loop pressure", "Давление контура"),
  q("chip_cool.tj", "Cel", "Junction temperature", "Температура перехода"),
  logical("chip_cool.dry", "Low flow", "Малый расход"),
  enu("chip_cool.type", ["cold_plate", "microchannel", "spray", "other"], "Type", "Тип"),
]);

write("layer-b-server_bmc.json", [
  id("server_bmc.node.id", "Server node id", "ID серверного узла"),
  q("server_bmc.cpu.temp", "Cel", "CPU temperature", "Температура CPU"),
  q("server_bmc.power", "W", "Node power", "Мощность узла"),
  q("server_bmc.fan", "%", "Fan duty", "Скорость вентиляторов", { range: { min: 0, max: 100 } }),
  q("server_bmc.mem.ce", "-", "Correctable ECC", "Исправляемые ECC", { encodings: ["i32"] }),
  q("server_bmc.uptime.h", "h", "Uptime", "Аптайм"),
  logical("server_bmc.health.ok", "Health OK", "Состояние OK"),
  enu("server_bmc.state", ["on", "standby", "off", "fault"], "Power state", "Состояние питания"),
]);

write("layer-b-gpu_cluster.json", [
  id("gpu_cluster.id", "GPU cluster id", "ID GPU-кластера"),
  id("gpu_cluster.node.id", "GPU node id", "ID GPU-узла"),
  q("gpu_cluster.util", "%", "GPU utilization", "Загрузка GPU", { range: { min: 0, max: 100 } }),
  q("gpu_cluster.power", "W", "GPU power", "Мощность GPU"),
  q("gpu_cluster.temp", "Cel", "GPU temperature", "Температура GPU"),
  q("gpu_cluster.mem", "%", "GPU memory used", "Память GPU", { range: { min: 0, max: 100 } }),
  logical("gpu_cluster.throttle", "Thermal throttle", "Термотроттлинг"),
  enu("gpu_cluster.state", ["idle", "train", "infer", "maintain", "fault"], "Cluster state", "Состояние кластера"),
]);

write("layer-b-storage_array.json", [
  id("storage_array.id", "Storage array id", "ID дискового массива"),
  q("storage_array.iops", "/s", "IOPS", "IOPS"),
  q("storage_array.latency.ms", "ms", "Latency", "Задержка"),
  q("storage_array.capacity", "%", "Capacity used", "Использование ёмкости", { range: { min: 0, max: 100 } }),
  q("storage_array.throughput", "bit/s", "Throughput", "Пропускная способность"),
  q("storage_array.spares", "-", "Hot spares", "Горячих запасных", { encodings: ["i32"] }),
  logical("storage_array.degraded", "RAID degraded", "RAID деградирован"),
  enu("storage_array.state", ["optimal", "degraded", "rebuild", "fault"], "Array state", "Состояние массива"),
]);

write("layer-b-tape_library.json", [
  id("tape_library.id", "Tape library id", "ID ленточной библиотеки"),
  q("tape_library.slots", "-", "Occupied slots", "Занятых слотов", { encodings: ["i32"] }),
  q("tape_library.mounts", "/h", "Mounts per hour", "Монтирований в час"),
  q("tape_library.drives", "-", "Drives online", "Приводов онлайн", { encodings: ["i32"] }),
  q("tape_library.robots", "-", "Robot arms", "Манипуляторов", { encodings: ["i32"] }),
  q("tape_library.errors", "-", "Media errors", "Ошибок носителей", { encodings: ["i32"] }),
  logical("tape_library.door", "Door open", "Дверь открыта"),
  enu("tape_library.state", ["ready", "mount", "inventory", "offline", "fault"], "Library state", "Состояние библиотеки"),
]);

write("layer-b-san_switch.json", [
  id("san_switch.id", "SAN switch id", "ID SAN-коммутатора"),
  q("san_switch.ports.up", "-", "Ports up", "Портов up", { encodings: ["i32"] }),
  q("san_switch.crc", "-", "CRC errors", "Ошибок CRC", { encodings: ["i32"] }),
  q("san_switch.bb.credit", "-", "BB credit zero events", "Событий нулевого BB credit", { encodings: ["i32"] }),
  q("san_switch.temp", "Cel", "Switch temperature", "Температура коммутатора"),
  q("san_switch.util", "%", "Fabric utilization", "Загрузка фабрики", { range: { min: 0, max: 100 } }),
  logical("san_switch.isl.down", "ISL down", "ISL down"),
  enu("san_switch.state", ["online", "degraded", "offline", "fault"], "Switch state", "Состояние коммутатора"),
]);

write("layer-b-meet_me.json", [
  id("meet_me.room.id", "Meet-me room id", "ID узла взаимных соединений"),
  q("meet_me.cross.connects", "-", "Active cross-connects", "Активных кросс-коннектов", { encodings: ["i32"] }),
  q("meet_me.cabinets", "-", "Cabinets occupied", "Занято шкафов", { encodings: ["i32"] }),
  q("meet_me.power", "W", "Room power", "Мощность помещения"),
  q("meet_me.temp", "Cel", "Room temperature", "Температура помещения"),
  q("meet_me.orders", "-", "Open orders", "Открытых заказов", { encodings: ["i32"] }),
  logical("meet_me.access", "Access in progress", "Доступ выполняется"),
  enu("meet_me.state", ["open", "restricted", "audit", "offline"], "Room state", "Состояние помещения"),
]);

write("layer-b-cross_connect.json", [
  id("cross_connect.id", "Cross-connect id", "ID кросс-коннекта"),
  id("cross_connect.a.end", "A-end id", "ID стороны A"),
  id("cross_connect.z.end", "Z-end id", "ID стороны Z"),
  q("cross_connect.loss", "dB", "Link loss", "Потери линии"),
  q("cross_connect.length", "m", "Cable length", "Длина кабеля"),
  logical("cross_connect.active", "Circuit active", "Цепь активна"),
  enu("cross_connect.media", ["smf", "mmf", "cat6", "coax", "other"], "Media", "Среда"),
  enu("cross_connect.state", ["provisioned", "live", "pending", "decommission"], "State", "Состояние"),
]);

write("layer-b-dark_fiber.json", [
  id("dark_fiber.span.id", "Dark fiber span id", "ID тёмного волокна"),
  q("dark_fiber.length", "km", "Span length", "Длина участка"),
  q("dark_fiber.loss", "dB", "Span loss", "Потери участка"),
  q("dark_fiber.fibers", "-", "Fiber count", "Число волокон", { encodings: ["i32"] }),
  q("dark_fiber.lease", "%", "Lit / leased", "Засвечено / сдано", { range: { min: 0, max: 100 } }),
  q("dark_fiber.otdr", "dB", "OTDR event loss", "Потери события OTDR"),
  logical("dark_fiber.cut", "Fiber cut", "Обрыв волокна"),
  enu("dark_fiber.state", ["dark", "lit", "repair", "reserved"], "Span state", "Состояние участка"),
]);

write("layer-b-dwdm_line.json", [
  id("dwdm_line.system.id", "DWDM system id", "ID системы DWDM"),
  id("dwdm_line.channel.id", "Wavelength channel id", "ID длины волны"),
  q("dwdm_line.power", "dBm", "Channel power", "Мощность канала"),
  q("dwdm_line.osnr", "dB", "OSNR", "OSNR"),
  q("dwdm_line.q", "-", "Q-factor", "Q-фактор"),
  q("dwdm_line.channels", "-", "Channels lit", "Засвеченных каналов", { encodings: ["i32"] }),
  logical("dwdm_line.fec", "FEC active", "FEC активна"),
  enu("dwdm_line.state", ["up", "degraded", "down", "maintain"], "Line state", "Состояние линии"),
]);

write("layer-b-roadm.json", [
  id("roadm.id", "ROADM id", "ID ROADM"),
  q("roadm.degrees", "-", "Degrees equipped", "Оснащённых направлений", { encodings: ["i32"] }),
  q("roadm.add", "-", "Add channels", "Add-каналов", { encodings: ["i32"] }),
  q("roadm.drop", "-", "Drop channels", "Drop-каналов", { encodings: ["i32"] }),
  q("roadm.wss.temp", "Cel", "WSS temperature", "Температура WSS"),
  q("roadm.power", "W", "Shelf power", "Мощность полки"),
  logical("roadm.alarm", "ROADM alarm", "Тревога ROADM"),
  enu("roadm.state", ["normal", "reconfig", "degraded", "fault"], "ROADM state", "Состояние ROADM"),
]);

write("layer-b-amplifier_edfa.json", [
  id("amplifier_edfa.id", "EDFA id", "ID EDFA"),
  q("amplifier_edfa.gain", "dB", "Gain", "Усиление"),
  q("amplifier_edfa.input", "dBm", "Input power", "Входная мощность"),
  q("amplifier_edfa.output", "dBm", "Output power", "Выходная мощность"),
  q("amplifier_edfa.pump", "mA", "Pump current", "Ток накачки"),
  q("amplifier_edfa.temp", "Cel", "Module temperature", "Температура модуля"),
  logical("amplifier_edfa.los", "LOS", "Потеря сигнала"),
  enu("amplifier_edfa.type", ["booster", "line", "preamp", "other"], "Type", "Тип"),
]);

write("layer-b-otdr_monitor.json", [
  id("otdr_monitor.id", "OTDR monitor id", "ID монитора OTDR"),
  id("otdr_monitor.fiber.id", "Monitored fiber id", "ID контролируемого волокна"),
  q("otdr_monitor.loss", "dB", "Event loss", "Потери события"),
  q("otdr_monitor.distance", "km", "Event distance", "Дальность события"),
  q("otdr_monitor.reflectance", "dB", "Reflectance", "Отражение"),
  q("otdr_monitor.scan.h", "h", "Hours since scan", "Часов с последнего скана"),
  logical("otdr_monitor.alarm", "Fiber alarm", "Тревога волокна"),
  enu("otdr_monitor.event", ["ok", "splice", "bend", "cut", "unknown"], "Event type", "Тип события"),
]);

write("layer-b-ptp_clock.json", [
  id("ptp_clock.id", "PTP clock id", "ID часов PTP"),
  q("ptp_clock.offset", "ns", "Offset from master", "Смещение от мастера"),
  q("ptp_clock.path.delay", "ns", "Mean path delay", "Средняя задержка пути"),
  q("ptp_clock.freq", "ppb", "Frequency offset", "Частотное смещение"),
  q("ptp_clock.gm.class", "-", "GM class", "Класс GM", { encodings: ["i32"] }),
  q("ptp_clock.steps", "-", "Steps removed", "Шагов удаления", { encodings: ["i32"] }),
  logical("ptp_clock.locked", "Locked", "Захвачен"),
  enu("ptp_clock.role", ["gm", "bc", "tc", "oc", "slave"], "Role", "Роль"),
]);

write("layer-b-ntp_stratum.json", [
  id("ntp_stratum.server.id", "NTP server id", "ID сервера NTP"),
  q("ntp_stratum.stratum", "-", "Stratum", "Стратум", { encodings: ["i32"] }),
  q("ntp_stratum.offset", "ms", "Offset", "Смещение"),
  q("ntp_stratum.jitter", "ms", "Jitter", "Джиттер"),
  q("ntp_stratum.reach", "-", "Reach register", "Регистр достижимости", { encodings: ["i32"] }),
  q("ntp_stratum.peers", "-", "Active peers", "Активных пиров", { encodings: ["i32"] }),
  logical("ntp_stratum.sync", "Synchronized", "Синхронизирован"),
  enu("ntp_stratum.source", ["gps", "atomic", "upstream", "local", "other"], "Time source", "Источник времени"),
]);

write("layer-b-cdn_pop.json", [
  id("cdn_pop.id", "CDN PoP id", "ID PoP CDN"),
  q("cdn_pop.bandwidth", "bit/s", "Egress bandwidth", "Исходящая полоса"),
  q("cdn_pop.cache.hit", "%", "Cache hit ratio", "Доля попаданий в кэш", { range: { min: 0, max: 100 } }),
  q("cdn_pop.requests", "/s", "Requests per second", "Запросов в секунду"),
  q("cdn_pop.latency.ms", "ms", "Origin latency", "Задержка до origin"),
  q("cdn_pop.nodes", "-", "Cache nodes", "Кэш-узлов", { encodings: ["i32"] }),
  logical("cdn_pop.healthy", "PoP healthy", "PoP здоров"),
  enu("cdn_pop.state", ["serving", "drain", "maintain", "offline"], "PoP state", "Состояние PoP"),
]);

write("layer-b-load_balancer.json", [
  id("load_balancer.id", "Load balancer id", "ID балансировщика"),
  q("load_balancer.cps", "/s", "Connections per second", "Соединений в секунду"),
  q("load_balancer.active", "-", "Active connections", "Активных соединений", { encodings: ["i32"] }),
  q("load_balancer.backends.up", "-", "Backends up", "Бэкендов up", { encodings: ["i32"] }),
  q("load_balancer.cpu", "%", "CPU", "CPU", { range: { min: 0, max: 100 } }),
  q("load_balancer.latency.ms", "ms", "P95 latency", "Задержка P95"),
  logical("load_balancer.failover", "Failover active", "Отказоустойчивость активна"),
  enu("load_balancer.state", ["active", "standby", "degraded", "fault"], "LB state", "Состояние БЛ"),
]);

write("layer-b-waf_appliance.json", [
  id("waf_appliance.id", "WAF appliance id", "ID WAF"),
  q("waf_appliance.rps", "/s", "Requests per second", "Запросов в секунду"),
  q("waf_appliance.blocks", "/s", "Blocks per second", "Блокировок в секунду"),
  q("waf_appliance.cpu", "%", "CPU", "CPU", { range: { min: 0, max: 100 } }),
  q("waf_appliance.latency.ms", "ms", "Added latency", "Добавленная задержка"),
  q("waf_appliance.rules", "-", "Active rules", "Активных правил", { encodings: ["i32"] }),
  logical("waf_appliance.bypass", "Bypass mode", "Режим байпаса"),
  enu("waf_appliance.mode", ["block", "detect", "bypass", "fault"], "Mode", "Режим"),
]);

write("layer-b-ddos_scrub.json", [
  id("ddos_scrub.center.id", "Scrubbing center id", "ID центра очистки"),
  q("ddos_scrub.ingress", "bit/s", "Ingress traffic", "Входящий трафик"),
  q("ddos_scrub.clean", "bit/s", "Clean traffic", "Очищенный трафик"),
  q("ddos_scrub.drops", "bit/s", "Dropped attack", "Сброшенная атака"),
  q("ddos_scrub.mitigations", "-", "Active mitigations", "Активных митигаций", { encodings: ["i32"] }),
  q("ddos_scrub.latency.ms", "ms", "Scrub latency", "Задержка очистки"),
  logical("ddos_scrub.under.attack", "Under attack", "Под атакой"),
  enu("ddos_scrub.state", ["idle", "detect", "mitigate", "overflow", "fault"], "Center state", "Состояние центра"),
]);

write("layer-b-firewall_ha.json", [
  id("firewall_ha.pair.id", "Firewall HA pair id", "ID пары МЭ"),
  id("firewall_ha.node.id", "Firewall node id", "ID узла МЭ"),
  q("firewall_ha.sessions", "-", "Sessions", "Сессий", { encodings: ["i32"] }),
  q("firewall_ha.throughput", "bit/s", "Throughput", "Пропускная способность"),
  q("firewall_ha.cpu", "%", "CPU", "CPU", { range: { min: 0, max: 100 } }),
  q("firewall_ha.ha.age.s", "s", "HA sync age", "Возраст синхронизации HA"),
  logical("firewall_ha.active", "Active unit", "Активный узел"),
  enu("firewall_ha.role", ["active", "passive", "standalone", "fault"], "HA role", "Роль HA"),
]);

write("layer-b-sdwan_edge.json", [
  id("sdwan_edge.id", "SD-WAN edge id", "ID SD-WAN edge"),
  q("sdwan_edge.tunnels", "-", "Tunnels up", "Туннелей up", { encodings: ["i32"] }),
  q("sdwan_edge.latency.ms", "ms", "Underlay latency", "Задержка underlay"),
  q("sdwan_edge.loss", "%", "Packet loss", "Потери пакетов", { range: { min: 0, max: 100 } }),
  q("sdwan_edge.jitter.ms", "ms", "Jitter", "Джиттер"),
  q("sdwan_edge.bandwidth", "bit/s", "Available bandwidth", "Доступная полоса"),
  logical("sdwan_edge.sla.breach", "SLA breach", "Нарушение SLA"),
  enu("sdwan_edge.state", ["up", "degraded", "down", "provision"], "Edge state", "Состояние edge"),
]);

write("layer-b-spine_leaf.json", [
  id("spine_leaf.fabric.id", "Fabric id", "ID фабрики"),
  id("spine_leaf.switch.id", "Fabric switch id", "ID коммутатора фабрики"),
  q("spine_leaf.ecmp", "-", "ECMP paths", "Путей ECMP", { encodings: ["i32"] }),
  q("spine_leaf.bgp.peers", "-", "BGP peers up", "Пиров BGP up", { encodings: ["i32"] }),
  q("spine_leaf.drops", "/s", "Drop rate", "Скорость дропов"),
  q("spine_leaf.util", "%", "Link utilization", "Загрузка линков", { range: { min: 0, max: 100 } }),
  logical("spine_leaf.congestion", "Congestion", "Перегрузка"),
  enu("spine_leaf.role", ["spine", "leaf", "border", "other"], "Role", "Роль"),
]);

write("layer-b-tor_switch.json", [
  id("tor_switch.id", "ToR switch id", "ID ToR-коммутатора"),
  id("tor_switch.rack.id", "ToR rack id", "ID стойки ToR"),
  q("tor_switch.ports.up", "-", "Access ports up", "Access-портов up", { encodings: ["i32"] }),
  q("tor_switch.uplink.util", "%", "Uplink utilization", "Загрузка аплинков", { range: { min: 0, max: 100 } }),
  q("tor_switch.temp", "Cel", "Switch temperature", "Температура коммутатора"),
  q("tor_switch.power", "W", "Switch power", "Мощность коммутатора"),
  logical("tor_switch.fan.fail", "Fan fail", "Отказ вентилятора"),
  enu("tor_switch.state", ["up", "degraded", "down", "maintain"], "ToR state", "Состояние ToR"),
]);

write("layer-b-optic_xcvr.json", [
  id("optic_xcvr.id", "Optical transceiver id", "ID оптического трансивера"),
  id("optic_xcvr.port.id", "Host port id", "ID порта хоста"),
  q("optic_xcvr.tx.power", "dBm", "TX power", "Мощность TX"),
  q("optic_xcvr.rx.power", "dBm", "RX power", "Мощность RX"),
  q("optic_xcvr.temp", "Cel", "Module temperature", "Температура модуля"),
  q("optic_xcvr.bias", "mA", "Laser bias", "Ток смещения лазера"),
  logical("optic_xcvr.los", "LOS", "Потеря сигнала"),
  enu("optic_xcvr.form", ["sfp", "sfp28", "qsfp", "osfp", "other"], "Form factor", "Форм-фактор"),
]);

write("layer-b-raised_floor.json", [
  id("raised_floor.zone.id", "Raised floor zone id", "ID зоны фальшпола"),
  q("raised_floor.pressure", "Pa", "Plenum pressure", "Давление пленума"),
  q("raised_floor.tiles.open", "%", "Open tile area", "Доля открытых плиток", { range: { min: 0, max: 100 } }),
  q("raised_floor.height", "mm", "Floor height", "Высота пола"),
  q("raised_floor.leak", "-", "Leak points", "Точек протечки", { encodings: ["i32"] }),
  q("raised_floor.temp", "Cel", "Plenum temperature", "Температура пленума"),
  logical("raised_floor.access", "Tile removed", "Плитка снята"),
  enu("raised_floor.state", ["ok", "low_pressure", "flood", "maintain"], "Floor state", "Состояние пола"),
]);

write("layer-b-cable_tray.json", [
  id("cable_tray.segment.id", "Cable tray segment id", "ID участка лотка"),
  q("cable_tray.fill", "%", "Fill ratio", "Коэффициент заполнения", { range: { min: 0, max: 100 } }),
  q("cable_tray.weight", "kg/m", "Linear weight", "Погонная масса"),
  q("cable_tray.temp", "Cel", "Tray temperature", "Температура лотка"),
  q("cable_tray.cables", "-", "Cable count", "Число кабелей", { encodings: ["i32"] }),
  q("cable_tray.length", "m", "Segment length", "Длина участка"),
  logical("cable_tray.overfill", "Overfill", "Переполнение"),
  enu("cable_tray.type", ["ladder", "trough", "wire_mesh", "other"], "Type", "Тип"),
]);

write("layer-b-object_store.json", [
  id("object_store.cluster.id", "Object store cluster id", "ID кластера объектного хранилища"),
  q("object_store.capacity", "%", "Capacity used", "Использование ёмкости", { range: { min: 0, max: 100 } }),
  q("object_store.objects", "-", "Object count", "Число объектов", { encodings: ["i32"] }),
  q("object_store.get.rps", "/s", "GET rate", "Скорость GET"),
  q("object_store.put.rps", "/s", "PUT rate", "Скорость PUT"),
  q("object_store.latency.ms", "ms", "P99 latency", "Задержка P99"),
  logical("object_store.healthy", "Cluster healthy", "Кластер здоров"),
  enu("object_store.state", ["ok", "degraded", "rebalance", "fault"], "Cluster state", "Состояние кластера"),
]);

write("layer-b-backup_robot.json", [
  id("backup_robot.id", "Backup job robot id", "ID робота резервного копирования"),
  id("backup_robot.job.id", "Backup job id", "ID задания бэкапа"),
  q("backup_robot.progress", "%", "Job progress", "Прогресс задания", { range: { min: 0, max: 100 } }),
  q("backup_robot.throughput", "bit/s", "Throughput", "Скорость"),
  q("backup_robot.duration.min", "min", "Elapsed", "Прошло"),
  q("backup_robot.errors", "-", "Errors", "Ошибок", { encodings: ["i32"] }),
  logical("backup_robot.success", "Last job success", "Последнее задание успешно"),
  enu("backup_robot.state", ["idle", "run", "verify", "retry", "fault"], "Robot state", "Состояние робота"),
]);

write("layer-b-colocation.json", [
  id("colocation.cage.id", "Colo cage id", "ID клетки колокации"),
  id("colocation.customer.id", "Customer id", "ID клиента", { sensitivity: "internal" }),
  q("colocation.power", "W", "Contracted power", "Контрактная мощность"),
  q("colocation.used", "W", "Used power", "Используемая мощность"),
  q("colocation.racks", "-", "Racks", "Стоек", { encodings: ["i32"] }),
  q("colocation.temp", "Cel", "Cage temperature", "Температура клетки"),
  logical("colocation.access", "Access granted", "Доступ разрешён"),
  enu("colocation.state", ["active", "install", "decommission", "suspended"], "Cage state", "Состояние клетки"),
]);

write("layer-b-carbon_ops.json", [
  id("carbon_ops.site.id", "Carbon ops site id", "ID площадки углеродного учёта"),
  q("carbon_ops.intensity", "g/kWh", "Grid carbon intensity", "Углеродоёмкость сети"),
  q("carbon_ops.scope2", "kg", "Scope 2 emissions", "Выбросы Scope 2"),
  q("carbon_ops.renewable", "%", "Renewable share", "Доля ВИЭ", { range: { min: 0, max: 100 } }),
  q("carbon_ops.cfe", "%", "Carbon-free energy", "Безуглеродная энергия", { range: { min: 0, max: 100 } }),
  q("carbon_ops.load", "W", "Matched load", "Сопоставленная нагрузка"),
  logical("carbon_ops.target.ok", "On track", "В графике цели"),
  enu("carbon_ops.method", ["location", "market", "hourly", "other"], "Accounting method", "Метод учёта"),
]);

write("layer-b-generator_farm.json", [
  id("generator_farm.id", "Generator farm id", "ID фермы генераторов"),
  q("generator_farm.online", "-", "Units online", "Агрегатов онлайн", { encodings: ["i32"] }),
  q("generator_farm.power", "W", "Total power", "Суммарная мощность"),
  q("generator_farm.fuel", "%", "Fuel inventory", "Запас топлива", { range: { min: 0, max: 100 } }),
  q("generator_farm.runtime.h", "h", "Fleet runtime", "Наработка парка"),
  q("generator_farm.load", "%", "Average load", "Средняя нагрузка", { range: { min: 0, max: 100 } }),
  logical("generator_farm.test", "Test mode", "Режим теста"),
  enu("generator_farm.state", ["standby", "run", "test", "maintain", "fault"], "Farm state", "Состояние фермы"),
]);

write("layer-b-ids_sensor.json", [
  id("ids_sensor.id", "IDS sensor id", "ID датчика IDS"),
  q("ids_sensor.alerts", "/h", "Alerts per hour", "Алертов в час"),
  q("ids_sensor.throughput", "bit/s", "Inspected throughput", "Просматриваемый трафик"),
  q("ids_sensor.cpu", "%", "Sensor CPU", "CPU датчика", { range: { min: 0, max: 100 } }),
  q("ids_sensor.drops", "%", "Packet drop", "Дроп пакетов", { range: { min: 0, max: 100 } }),
  q("ids_sensor.signatures", "-", "Active signatures", "Активных сигнатур", { encodings: ["i32"] }),
  logical("ids_sensor.inline", "Inline mode", "Режим inline"),
  enu("ids_sensor.state", ["monitor", "inline", "bypass", "fault"], "Sensor state", "Состояние датчика"),
]);

write("layer-b-vpn_concentrator.json", [
  id("vpn_concentrator.id", "VPN concentrator id", "ID VPN-концентратора"),
  q("vpn_concentrator.tunnels", "-", "Tunnels up", "Туннелей up", { encodings: ["i32"] }),
  q("vpn_concentrator.users", "-", "Users connected", "Пользователей подключено", { encodings: ["i32"] }),
  q("vpn_concentrator.throughput", "bit/s", "Throughput", "Пропускная способность"),
  q("vpn_concentrator.cpu", "%", "CPU", "CPU", { range: { min: 0, max: 100 } }),
  q("vpn_concentrator.auth.fail", "/h", "Auth failures", "Ошибок аутентификации"),
  logical("vpn_concentrator.ha", "HA active", "HA активен"),
  enu("vpn_concentrator.state", ["active", "standby", "degraded", "fault"], "Concentrator state", "Состояние концентратора"),
]);

write("layer-b-access_switch.json", [
  id("access_switch.id", "Access switch id", "ID access-коммутатора"),
  q("access_switch.ports.up", "-", "Ports up", "Портов up", { encodings: ["i32"] }),
  q("access_switch.poe", "W", "PoE power drawn", "Потребление PoE"),
  q("access_switch.poe.budget", "W", "PoE budget", "Бюджет PoE"),
  q("access_switch.temp", "Cel", "Switch temperature", "Температура коммутатора"),
  q("access_switch.macs", "-", "MAC table size", "Размер таблицы MAC", { encodings: ["i32"] }),
  logical("access_switch.stack", "Stack member", "Участник стека"),
  enu("access_switch.state", ["up", "degraded", "down", "maintain"], "Switch state", "Состояние коммутатора"),
]);

write("layer-b-patch_panel.json", [
  id("patch_panel.id", "Patch panel id", "ID патч-панели"),
  q("patch_panel.ports", "-", "Ports populated", "Занятых портов", { encodings: ["i32"] }),
  q("patch_panel.capacity", "-", "Port capacity", "Ёмкость портов", { encodings: ["i32"] }),
  q("patch_panel.moves", "/d", "Moves per day", "Переключений в сутки"),
  q("patch_panel.errors", "-", "Label mismatches", "Несовпадений маркировки", { encodings: ["i32"] }),
  q("patch_panel.temp", "Cel", "Panel temperature", "Температура панели"),
  logical("patch_panel.locked", "Panel locked", "Панель заперта"),
  enu("patch_panel.media", ["copper", "fiber", "mixed"], "Media", "Среда"),
]);

write("layer-b-sync_e.json", [
  id("sync_e.node.id", "SyncE node id", "ID узла SyncE"),
  q("sync_e.ql", "-", "Quality level", "Уровень качества", { encodings: ["i32"] }),
  q("sync_e.offset", "ns", "Time error", "Ошибка времени"),
  q("sync_e.holdover.h", "h", "Holdover remaining", "Остаток holdover"),
  q("sync_e.ssm", "-", "SSM code", "Код SSM", { encodings: ["i32"] }),
  q("sync_e.ports", "-", "Sync ports locked", "Синхр. портов захвачено", { encodings: ["i32"] }),
  logical("sync_e.locked", "Frequency locked", "Частота захвачена"),
  enu("sync_e.state", ["locked", "holdover", "freerun", "fault"], "Sync state", "Состояние синхронизации"),
]);

write("layer-b-dns_anycast.json", [
  id("dns_anycast.node.id", "Anycast DNS node id", "ID anycast DNS-узла"),
  q("dns_anycast.qps", "/s", "Queries per second", "Запросов в секунду"),
  q("dns_anycast.latency.ms", "ms", "Response latency", "Задержка ответа"),
  q("dns_anycast.nxdomain", "%", "NXDOMAIN ratio", "Доля NXDOMAIN", { range: { min: 0, max: 100 } }),
  q("dns_anycast.cpu", "%", "CPU", "CPU", { range: { min: 0, max: 100 } }),
  q("dns_anycast.peers", "-", "Anycast peers", "Пиров anycast", { encodings: ["i32"] }),
  logical("dns_anycast.healthy", "Node healthy", "Узел здоров"),
  enu("dns_anycast.state", ["announce", "withdraw", "drain", "fault"], "Node state", "Состояние узла"),
]);

write("layer-b-thermal_map.json", [
  id("thermal_map.hall.id", "Mapped hall id", "ID картографируемого зала"),
  q("thermal_map.sensors", "-", "Sensor count", "Число датчиков", { encodings: ["i32"] }),
  q("thermal_map.temp.max", "Cel", "Max temperature", "Макс. температура"),
  q("thermal_map.temp.min", "Cel", "Min temperature", "Мин. температура"),
  q("thermal_map.hot.spots", "-", "Hot spots", "Горячих точек", { encodings: ["i32"] }),
  q("thermal_map.refresh.s", "s", "Map refresh", "Обновление карты"),
  logical("thermal_map.stale", "Map stale", "Карта устарела"),
  enu("thermal_map.quality", ["good", "sparse", "stale", "offline"], "Map quality", "Качество карты"),
]);

write("layer-b-nas_head.json", [
  id("nas_head.id", "NAS head id", "ID NAS-контроллера"),
  q("nas_head.ops", "/s", "NFS/SMB ops", "Операций NFS/SMB"),
  q("nas_head.latency.ms", "ms", "Op latency", "Задержка операций"),
  q("nas_head.capacity", "%", "Capacity used", "Использование ёмкости", { range: { min: 0, max: 100 } }),
  q("nas_head.clients", "-", "Connected clients", "Подключённых клиентов", { encodings: ["i32"] }),
  q("nas_head.cpu", "%", "CPU", "CPU", { range: { min: 0, max: 100 } }),
  logical("nas_head.ha", "HA partner up", "HA-партнёр up"),
  enu("nas_head.state", ["active", "standby", "degraded", "fault"], "Head state", "Состояние контроллера"),
]);

write("layer-b-disaster_site.json", [
  id("disaster_site.id", "DR site id", "ID площадки DR"),
  id("disaster_site.pair.id", "Paired production site id", "ID парной прод-площадки"),
  q("disaster_site.rpo.min", "min", "Achieved RPO", "Достигнутый RPO"),
  q("disaster_site.rto.min", "min", "Achieved RTO", "Достигнутый RTO"),
  q("disaster_site.replication", "%", "Replication lag proxy", "Отставание репликации", { range: { min: 0, max: 100 } }),
  q("disaster_site.capacity", "%", "Standby capacity", "Резервная ёмкость", { range: { min: 0, max: 100 } }),
  logical("disaster_site.ready", "Failover ready", "Готов к переключению"),
  enu("disaster_site.state", ["standby", "failover", "failback", "test", "fault"], "DR state", "Состояние DR"),
]);

write("layer-b-two_phase_cool.json", [
  id("two_phase_cool.loop.id", "Two-phase loop id", "ID двухфазного контура"),
  q("two_phase_cool.sat.temp", "Cel", "Saturation temperature", "Температура насыщения"),
  q("two_phase_cool.pressure", "kPa", "Loop pressure", "Давление контура"),
  q("two_phase_cool.quality", "%", "Vapor quality", "Паросодержание", { range: { min: 0, max: 100 } }),
  q("two_phase_cool.heat", "W", "Heat rejection", "Отвод тепла"),
  q("two_phase_cool.pump", "%", "Pump speed", "Скорость насоса", { range: { min: 0, max: 100 } }),
  logical("two_phase_cool.dryout", "Dryout risk", "Риск осушения"),
  enu("two_phase_cool.state", ["boil", "condense", "idle", "fault"], "Loop state", "Состояние контура"),
]);

write("layer-b-flywheel_ups.json", [
  id("flywheel_ups.id", "Flywheel UPS id", "ID маховикового ИБП"),
  q("flywheel_ups.rpm", "rpm", "Rotor RPM", "Обороты ротора"),
  q("flywheel_ups.energy", "Wh", "Stored energy", "Запасённая энергия"),
  q("flywheel_ups.power", "W", "Output power", "Выходная мощность"),
  q("flywheel_ups.bearing.temp", "Cel", "Bearing temperature", "Температура подшипника"),
  q("flywheel_ups.vacuum", "Pa", "Enclosure vacuum", "Вакуум корпуса"),
  logical("flywheel_ups.online", "Supporting load", "Поддерживает нагрузку"),
  enu("flywheel_ups.state", ["ready", "discharge", "recharge", "fault"], "Flywheel state", "Состояние маховика"),
]);

write("layer-b-siem_sensor.json", [
  id("siem_sensor.id", "SIEM sensor id", "ID сенсора SIEM"),
  q("siem_sensor.eps", "/s", "Events per second", "Событий в секунду"),
  q("siem_sensor.queue", "-", "Queue depth", "Глубина очереди", { encodings: ["i32"] }),
  q("siem_sensor.drop", "%", "Drop rate", "Доля дропов", { range: { min: 0, max: 100 } }),
  q("siem_sensor.sources", "-", "Log sources", "Источников логов", { encodings: ["i32"] }),
  q("siem_sensor.cpu", "%", "CPU", "CPU", { range: { min: 0, max: 100 } }),
  logical("siem_sensor.healthy", "Sensor healthy", "Сенсор здоров"),
  enu("siem_sensor.state", ["collect", "parse", "forward", "fault"], "Sensor state", "Состояние сенсора"),
]);

console.log("Layer B19 seeds written");
