#!/usr/bin/env node
/**
 * Layer B24 — transit, airport airside, MRO, UAS, tunnels.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B24", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-metro_psd_ops.json", [
  id("metro_psd_ops.door.id", "Metro PSD door id", "ID платформенных дверей метро"),
  id("metro_psd_ops.station.id", "Station id", "ID станции"),
  q("metro_psd_ops.cycles", "-", "Open cycles today", "Циклов за сутки", { encodings: ["i32"] }),
  q("metro_psd_ops.align", "mm", "Train alignment error", "Ошибка выравнивания"),
  q("metro_psd_ops.open.s", "s", "Open duration", "Длительность открытия"),
  q("metro_psd_ops.faults", "-", "Faults today", "Отказов за сутки", { encodings: ["i32"] }),
  logical("metro_psd_ops.locked", "Doors locked", "Двери заблокированы"),
  enu("metro_psd_ops.state", ["closed", "open", "inhibited", "fault"], "Door state", "Состояние дверей"),
]);

write("layer-b-metro_trac.json", [
  id("metro_trac.section.id", "Metro traction section id", "ID тягового участка метро"),
  q("metro_trac.voltage", "V", "Third-rail / OCS voltage", "Напряжение тяги"),
  q("metro_trac.current", "A", "Section current", "Ток участка"),
  q("metro_trac.power", "W", "Traction power", "Тяговая мощность"),
  q("metro_trac.temp", "Cel", "Rail / feeder temperature", "Температура рельса/фидера"),
  q("metro_trac.regen", "%", "Regen share", "Доля рекуперации", { range: { min: 0, max: 100 } }),
  logical("metro_trac.energized", "Energized", "Под напряжением"),
  enu("metro_trac.state", ["live", "isolated", "fault", "maintain"], "Section state", "Состояние участка"),
]);

write("layer-b-tram_pan.json", [
  id("tram_pan.id", "Tram pantograph id", "ID пантографа трамвая"),
  id("tram_pan.vehicle.id", "Tram id", "ID трамвая"),
  q("tram_pan.force", "N", "Contact force", "Прижимное усилие"),
  q("tram_pan.height", "mm", "Collector height", "Высота токосъёмника"),
  q("tram_pan.arc", "-", "Arcing events", "Дуговых событий", { encodings: ["i32"] }),
  q("tram_pan.wear", "mm", "Strip wear", "Износ накладки"),
  logical("tram_pan.up", "Raised", "Поднят"),
  enu("tram_pan.state", ["up", "down", "fault", "inspect"], "State", "Состояние"),
]);

write("layer-b-trolley_cat.json", [
  id("trolley_cat.section.id", "Trolleybus catenary section id", "ID участка троллейбусной КС"),
  q("trolley_cat.voltage", "V", "Contact voltage", "Напряжение контактной сети"),
  q("trolley_cat.current", "A", "Section current", "Ток участка"),
  q("trolley_cat.tension", "kN", "Wire tension", "Натяжение провода"),
  q("trolley_cat.height", "mm", "Wire height", "Высота провода"),
  q("trolley_cat.ice", "mm", "Ice thickness", "Толщина льда"),
  logical("trolley_cat.live", "Energized", "Под напряжением"),
  enu("trolley_cat.state", ["ok", "ice", "fault", "outage"], "Section state", "Состояние участка"),
]);

write("layer-b-bus_depot_ev.json", [
  id("bus_depot_ev.id", "EV bus depot id", "ID депо электробусов"),
  q("bus_depot_ev.chargers", "-", "Chargers online", "Зарядок онлайн", { encodings: ["i32"] }),
  q("bus_depot_ev.power", "W", "Depot charge power", "Мощность зарядки депо"),
  q("bus_depot_ev.soc.avg", "%", "Fleet average SOC", "Средний SOC парка", { range: { min: 0, max: 100 } }),
  q("bus_depot_ev.buses", "-", "Buses on charge", "Автобусов на зарядке", { encodings: ["i32"] }),
  q("bus_depot_ev.queue", "-", "Buses waiting", "Автобусов в очереди", { encodings: ["i32"] }),
  logical("bus_depot_ev.peak", "Peak demand limit", "Лимит пиковой мощности"),
  enu("bus_depot_ev.state", ["idle", "charge", "dispatch", "fault"], "Depot state", "Состояние депо"),
]);

write("layer-b-fleet_hub.json", [
  id("fleet_hub.id", "Fleet telematics hub id", "ID хаба телематики флота"),
  q("fleet_hub.vehicles", "-", "Vehicles online", "ТС онлайн", { encodings: ["i32"] }),
  q("fleet_hub.alerts", "-", "Active alerts", "Активных тревог", { encodings: ["i32"] }),
  q("fleet_hub.latency.ms", "ms", "Telemetry latency", "Задержка телематики"),
  q("fleet_hub.uptime", "%", "Hub uptime", "Доступность хаба", { range: { min: 0, max: 100 } }),
  q("fleet_hub.msg", "/s", "Message rate", "Сообщений в секунду"),
  logical("fleet_hub.degraded", "Degraded mode", "Деградация"),
  enu("fleet_hub.state", ["ok", "degraded", "offline", "maintain"], "Hub state", "Состояние хаба"),
]);

write("layer-b-fleet_ev_bay.json", [
  id("fleet_ev_bay.id", "Fleet EV charge bay id", "ID поста зарядки флота"),
  id("fleet_ev_bay.vehicle.id", "Vehicle id", "ID ТС"),
  q("fleet_ev_bay.power", "W", "Charge power", "Мощность зарядки"),
  q("fleet_ev_bay.soc", "%", "Vehicle SOC", "SOC ТС", { range: { min: 0, max: 100 } }),
  q("fleet_ev_bay.energy", "Wh", "Session energy", "Энергия сессии"),
  q("fleet_ev_bay.temp", "Cel", "Connector temperature", "Температура разъёма"),
  logical("fleet_ev_bay.occupied", "Bay occupied", "Пост занят"),
  enu("fleet_ev_bay.state", ["available", "charging", "finishing", "fault"], "Bay state", "Состояние поста"),
]);

write("layer-b-h2_bus_fill.json", [
  id("h2_bus_fill.id", "Hydrogen bus fill station id", "ID заправки водородных автобусов"),
  id("h2_bus_fill.bus.id", "Bus id", "ID автобуса"),
  q("h2_bus_fill.pressure", "kPa", "Dispenser pressure", "Давление колонки"),
  q("h2_bus_fill.flow", "kg/min", "Fill rate", "Скорость заправки"),
  q("h2_bus_fill.mass", "kg", "Dispensed mass", "Отданная масса"),
  q("h2_bus_fill.temp", "Cel", "Gas temperature", "Температура газа"),
  logical("h2_bus_fill.active", "Filling", "Заправка"),
  enu("h2_bus_fill.state", ["idle", "fill", "vent", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-cng_bus_depot.json", [
  id("cng_bus_depot.id", "CNG bus depot fill id", "ID КПГ-заправки депо"),
  q("cng_bus_depot.pressure", "kPa", "Cascade pressure", "Давление каскада"),
  q("cng_bus_depot.flow", "kg/min", "Fill rate", "Скорость заправки"),
  q("cng_bus_depot.buses", "-", "Buses filled today", "Автобусов за сутки", { encodings: ["i32"] }),
  q("cng_bus_depot.temp", "Cel", "Gas temperature", "Температура газа"),
  q("cng_bus_depot.mass", "kg", "Mass dispensed today", "Масса за сутки"),
  logical("cng_bus_depot.esd", "ESD active", "Аварийный останов"),
  enu("cng_bus_depot.state", ["idle", "fill", "maintain", "fault"], "Depot fill state", "Состояние заправки"),
]);

write("layer-b-ags_airport.json", [
  id("ags_airport.id", "Airport AGS id", "ID AGS аэропорта"),
  q("ags_airport.carts", "-", "AGS carts online", "Тележек AGS онлайн", { encodings: ["i32"] }),
  q("ags_airport.trips", "/h", "Trips per hour", "Рейсов в час"),
  q("ags_airport.battery.avg", "%", "Average cart SOC", "Средний SOC тележек", { range: { min: 0, max: 100 } }),
  q("ags_airport.jams", "-", "Path conflicts today", "Конфликтов маршрута за сутки", { encodings: ["i32"] }),
  q("ags_airport.latency.ms", "ms", "Control latency", "Задержка управления"),
  logical("ags_airport.hold", "System hold", "Система на удержании"),
  enu("ags_airport.state", ["run", "hold", "maintain", "fault"], "AGS state", "Состояние AGS"),
]);

write("layer-b-apron_flood.json", [
  id("apron_flood.zone.id", "Apron floodlight zone id", "ID зоны освещения перрона"),
  q("apron_flood.lux", "lx", "Horizontal illuminance", "Освещённость"),
  q("apron_flood.power", "W", "Lighting power", "Мощность освещения"),
  q("apron_flood.dim", "%", "Dim level", "Уровень диммирования", { range: { min: 0, max: 100 } }),
  q("apron_flood.failed", "-", "Failed fixtures", "Неисправных светильников", { encodings: ["i32"] }),
  q("apron_flood.temp", "Cel", "Fixture temperature", "Температура светильника"),
  logical("apron_flood.night", "Night mode", "Ночной режим"),
  enu("apron_flood.state", ["on", "dim", "off", "fault"], "Zone state", "Состояние зоны"),
]);

write("layer-b-rwy_als.json", [
  id("rwy_als.id", "Runway ALS id", "ID ОВИ ВПП"),
  id("rwy_als.runway.id", "Runway id", "ID ВПП"),
  q("rwy_als.intensity", "%", "Light intensity step", "Ступень интенсивности", { range: { min: 0, max: 100 } }),
  q("rwy_als.failed", "-", "Failed lamps", "Неисправных ламп", { encodings: ["i32"] }),
  q("rwy_als.power", "W", "System power", "Мощность системы"),
  q("rwy_als.rvr", "m", "Reported RVR", "Заявленная RVR"),
  logical("rwy_als.catiii", "CAT III mode", "Режим CAT III"),
  enu("rwy_als.state", ["off", "low", "med", "high", "fault"], "ALS state", "Состояние ОВИ"),
]);

write("layer-b-ils_loc.json", [
  id("ils_loc.id", "ILS localizer id", "ID курсового маяка ILS"),
  id("ils_loc.runway.id", "Runway id", "ID ВПП"),
  q("ils_loc.ddm", "-", "DDM", "DDM"),
  q("ils_loc.sdm", "%", "SDM", "SDM", { range: { min: 0, max: 100 } }),
  q("ils_loc.ident", "-", "Ident quality", "Качество опознавания", { encodings: ["i32"] }),
  q("ils_loc.power", "W", "Transmitter power", "Мощность передатчика"),
  logical("ils_loc.alarm", "ILS alarm", "Тревога ILS"),
  enu("ils_loc.cat", ["i", "ii", "iii", "other"], "Category", "Категория"),
]);

write("layer-b-vor_beacon.json", [
  id("vor_beacon.id", "VOR / DME id", "ID VOR/DME"),
  q("vor_beacon.bearing", "deg", "Radial error", "Ошибка радиала"),
  q("vor_beacon.mod", "%", "Modulation depth", "Глубина модуляции", { range: { min: 0, max: 100 } }),
  q("vor_beacon.dme.nm", "NM", "DME range check", "Проверка дальности DME"),
  q("vor_beacon.power", "W", "TX power", "Мощность TX"),
  q("vor_beacon.monitors", "-", "Monitors OK", "Мониторов OK", { encodings: ["i32"] }),
  logical("vor_beacon.alarm", "Navi aid alarm", "Тревога средства"),
  enu("vor_beacon.type", ["vor", "dvor", "dme", "vor_dme"], "Type", "Тип"),
]);

write("layer-b-adsb_rx.json", [
  id("adsb_rx.id", "ADS-B ground receiver id", "ID наземного приёмника ADS-B"),
  q("adsb_rx.targets", "-", "Tracked targets", "Сопровождаемых целей", { encodings: ["i32"] }),
  q("adsb_rx.rate", "/s", "Message rate", "Сообщений в секунду"),
  q("adsb_rx.coverage", "%", "Coverage estimate", "Оценка покрытия", { range: { min: 0, max: 100 } }),
  q("adsb_rx.gps.ok", "%", "GPS health", "Здоровье GPS", { range: { min: 0, max: 100 } }),
  q("adsb_rx.latency.ms", "ms", "Feed latency", "Задержка потока"),
  logical("adsb_rx.spoof", "Spoof / anomaly", "Спуфинг / аномалия"),
  enu("adsb_rx.state", ["ok", "degraded", "offline", "fault"], "Receiver state", "Состояние приёмника"),
]);

write("layer-b-asr_radar.json", [
  id("asr_radar.id", "Airport surveillance radar id", "ID обзорного РЛС аэропорта"),
  q("asr_radar.targets", "-", "Tracked targets", "Целей", { encodings: ["i32"] }),
  q("asr_radar.rpm", "rpm", "Antenna RPM", "Обороты антенны"),
  q("asr_radar.range", "NM", "Instrumented range", "Инструментальная дальность"),
  q("asr_radar.clutter", "%", "Clutter level", "Уровень помех", { range: { min: 0, max: 100 } }),
  q("asr_radar.uptime", "%", "Uptime", "Доступность", { range: { min: 0, max: 100 } }),
  logical("asr_radar.stby", "Standby channel", "Резервный канал"),
  enu("asr_radar.state", ["ops", "stby", "maintain", "fault"], "Radar state", "Состояние РЛС"),
]);

write("layer-b-smr_radar.json", [
  id("smr_radar.id", "Surface movement radar id", "ID РЛС обзора лётного поля"),
  q("smr_radar.targets", "-", "Surface targets", "Наземных целей", { encodings: ["i32"] }),
  q("smr_radar.rpm", "rpm", "Antenna RPM", "Обороты антенны"),
  q("smr_radar.rain", "mm/h", "Rain attenuation proxy", "Осадки"),
  q("smr_radar.alerts", "-", "Runway incursion alerts", "Тревог выезда на ВПП", { encodings: ["i32"] }),
  q("smr_radar.uptime", "%", "Uptime", "Доступность", { range: { min: 0, max: 100 } }),
  logical("smr_radar.incursion", "Incursion alarm", "Тревога выезда"),
  enu("smr_radar.state", ["ops", "stby", "fault", "offline"], "SMR state", "Состояние SMR"),
]);

write("layer-b-atc_vox.json", [
  id("atc_vox.channel.id", "ATC voice channel id", "ID канала УВД"),
  q("atc_vox.occupancy", "%", "Channel occupancy", "Занятость канала", { range: { min: 0, max: 100 } }),
  q("atc_vox.snr", "dB", "Audio SNR", "ОСШ аудио"),
  q("atc_vox.tx", "-", "TX key-ups today", "Выходов на передачу за сутки", { encodings: ["i32"] }),
  q("atc_vox.latency.ms", "ms", "VoIP latency", "Задержка VoIP"),
  q("atc_vox.recorders", "-", "Recorders online", "Рекордеров онлайн", { encodings: ["i32"] }),
  logical("atc_vox.stuck", "Stuck mic", "Залипший микрофон"),
  enu("atc_vox.state", ["ok", "busy", "degraded", "fault"], "Channel state", "Состояние канала"),
]);

write("layer-b-gate_stand_ops.json", [
  id("gate_stand_ops.stand.id", "Gate / stand id", "ID стоянки/гейта"),
  id("gate_stand_ops.flight.id", "Flight id", "ID рейса"),
  q("gate_stand_ops.turn.min", "min", "Turnaround remaining", "Остаток оборота"),
  q("gate_stand_ops.delay.min", "min", "Delay", "Задержка"),
  q("gate_stand_ops.pax", "-", "Passengers boarded", "Пассажиров посажено", { encodings: ["i32"] }),
  q("gate_stand_ops.bags", "-", "Bags loaded", "Багажа загружено", { encodings: ["i32"] }),
  logical("gate_stand_ops.occupied", "Stand occupied", "Стоянка занята"),
  enu("gate_stand_ops.state", ["free", "inbound", "turn", "outbound", "blocked"], "Stand state", "Состояние стоянки"),
]);

write("layer-b-turn_timer.json", [
  id("turn_timer.flight.id", "Turnaround timer flight id", "ID рейса таймера оборота"),
  q("turn_timer.target.min", "min", "Target turn time", "Целевое время оборота"),
  q("turn_timer.elapsed.min", "min", "Elapsed", "Прошло"),
  q("turn_timer.critical", "-", "Critical path tasks open", "Открытых критических задач", { encodings: ["i32"] }),
  q("turn_timer.fuel.pct", "%", "Fueling progress", "Прогресс заправки", { range: { min: 0, max: 100 } }),
  q("turn_timer.clean.pct", "%", "Cabin clean progress", "Прогресс уборки", { range: { min: 0, max: 100 } }),
  logical("turn_timer.at_risk", "Turn at risk", "Оборот под риском"),
  enu("turn_timer.state", ["planned", "active", "complete", "late"], "Timer state", "Состояние таймера"),
]);

write("layer-b-cabin_svc_timer.json", [
  id("cabin_svc_timer.flight.id", "Cabin service flight id", "ID рейса кабинного сервиса"),
  q("cabin_svc_timer.clean.min", "min", "Clean duration", "Длительность уборки"),
  q("cabin_svc_timer.crew", "-", "Cabin crew on task", "Бригады на задаче", { encodings: ["i32"] }),
  q("cabin_svc_timer.supplies", "%", "Supplies restock", "Пополнение расходников", { range: { min: 0, max: 100 } }),
  q("cabin_svc_timer.findings", "-", "Defects found", "Найденных дефектов", { encodings: ["i32"] }),
  q("cabin_svc_timer.progress", "%", "Service progress", "Прогресс сервиса", { range: { min: 0, max: 100 } }),
  logical("cabin_svc_timer.done", "Service complete", "Сервис завершён"),
  enu("cabin_svc_timer.state", ["wait", "clean", "restock", "done", "hold"], "Service state", "Состояние сервиса"),
]);

write("layer-b-catering_cart.json", [
  id("catering_cart.id", "Catering cart / high-loader id", "ID кейтеринг-тележки"),
  id("catering_cart.flight.id", "Flight id", "ID рейса"),
  q("catering_cart.trolleys", "-", "Trolleys loaded", "Тележек загружено", { encodings: ["i32"] }),
  q("catering_cart.lift.m", "m", "Lift height", "Высота подъёма"),
  q("catering_cart.cycle.min", "min", "Service cycle", "Цикл обслуживания"),
  q("catering_cart.temp", "Cel", "Cold cart temperature", "Температура холодной тележки"),
  logical("catering_cart.docked", "Docked to aircraft", "Состыкован с ВС"),
  enu("catering_cart.state", ["load", "transit", "serve", "return", "fault"], "Cart state", "Состояние тележки"),
]);

write("layer-b-potable_cart.json", [
  id("potable_cart.id", "Potable water cart id", "ID тележки питьевой воды"),
  id("potable_cart.flight.id", "Flight id", "ID рейса"),
  q("potable_cart.volume", "L", "Water dispensed", "Отдано воды"),
  q("potable_cart.chlorine", "mg/L", "Chlorine residual", "Остаточный хлор"),
  q("potable_cart.flow", "L/min", "Fill rate", "Скорость наполнения"),
  q("potable_cart.tank", "%", "Cart tank level", "Уровень бака тележки", { range: { min: 0, max: 100 } }),
  logical("potable_cart.connected", "Hose connected", "Рукав подключён"),
  enu("potable_cart.state", ["idle", "fill", "flush", "fault"], "Cart state", "Состояние тележки"),
]);

write("layer-b-lav_svc_cart.json", [
  id("lav_svc_cart.id", "Lavatory service cart id", "ID тележки туалетного сервиса"),
  id("lav_svc_cart.flight.id", "Flight id", "ID рейса"),
  q("lav_svc_cart.waste", "L", "Waste pumped", "Откачано отходов"),
  q("lav_svc_cart.blue", "L", "Blue fluid added", "Добавлено синей жидкости"),
  q("lav_svc_cart.cycle.min", "min", "Service cycle", "Цикл обслуживания"),
  q("lav_svc_cart.tank", "%", "Waste tank fill", "Заполнение бака отходов", { range: { min: 0, max: 100 } }),
  logical("lav_svc_cart.connected", "Connected", "Подключено"),
  enu("lav_svc_cart.state", ["idle", "service", "dump", "fault"], "Cart state", "Состояние тележки"),
]);

write("layer-b-pushback_tractor.json", [
  id("pushback_tractor.id", "Pushback tractor id", "ID тягача буксировки"),
  id("pushback_tractor.flight.id", "Flight id", "ID рейса"),
  q("pushback_tractor.force", "kN", "Tow force", "Усилие буксировки"),
  q("pushback_tractor.speed", "km/h", "Tow speed", "Скорость буксировки"),
  q("pushback_tractor.soc", "%", "Tractor SOC / fuel", "SOC/топливо тягача", { range: { min: 0, max: 100 } }),
  q("pushback_tractor.angle", "deg", "Nosewheel angle", "Угол передней стойки"),
  logical("pushback_tractor.engaged", "Towbar engaged", "Буксир сцеплен"),
  enu("pushback_tractor.state", ["idle", "hook", "push", "return", "fault"], "Tractor state", "Состояние тягача"),
]);

write("layer-b-gpu_stand.json", [
  id("gpu_stand.id", "Stand GPU id", "ID GPU на стоянке"),
  id("gpu_stand.stand.id", "Stand id", "ID стоянки"),
  q("gpu_stand.power", "W", "Output power", "Выходная мощность"),
  q("gpu_stand.voltage", "V", "Output voltage", "Выходное напряжение"),
  q("gpu_stand.freq", "Hz", "Frequency", "Частота"),
  q("gpu_stand.fuel", "L/h", "Fuel / energy rate", "Расход топлива/энергии"),
  logical("gpu_stand.connected", "Connected to aircraft", "Подключено к ВС"),
  enu("gpu_stand.state", ["idle", "supply", "fault", "offline"], "GPU state", "Состояние GPU"),
]);

write("layer-b-asu_stand.json", [
  id("asu_stand.id", "Air start unit id", "ID установки воздушного запуска"),
  id("asu_stand.stand.id", "Stand id", "ID стоянки"),
  q("asu_stand.pressure", "kPa", "Bleed / air pressure", "Давление воздуха"),
  q("asu_stand.temp", "Cel", "Air temperature", "Температура воздуха"),
  q("asu_stand.flow", "kg/s", "Mass flow", "Массовый расход"),
  q("asu_stand.starts", "-", "Starts today", "Запусков за сутки", { encodings: ["i32"] }),
  logical("asu_stand.connected", "Hose connected", "Рукав подключён"),
  enu("asu_stand.state", ["idle", "ready", "start", "fault"], "ASU state", "Состояние ASU"),
]);

write("layer-b-hydrant_pit.json", [
  id("hydrant_pit.id", "Fuel hydrant pit id", "ID гидрантного колодца"),
  id("hydrant_pit.stand.id", "Stand id", "ID стоянки"),
  q("hydrant_pit.pressure", "kPa", "Hydrant pressure", "Давление гидранта"),
  q("hydrant_pit.flow", "L/min", "Fuel flow", "Расход топлива"),
  q("hydrant_pit.volume", "L", "Volume dispensed", "Отданный объём"),
  q("hydrant_pit.temp", "Cel", "Fuel temperature", "Температура топлива"),
  logical("hydrant_pit.esd", "ESD", "Аварийный останов"),
  enu("hydrant_pit.state", ["idle", "fuel", "flush", "fault"], "Pit state", "Состояние колодца"),
]);

write("layer-b-fuel_bowser_ops.json", [
  id("fuel_bowser_ops.id", "Fuel bowser id", "ID топливозаправщика"),
  id("fuel_bowser_ops.flight.id", "Flight id", "ID рейса"),
  q("fuel_bowser_ops.volume", "L", "Volume dispensed", "Отданный объём"),
  q("fuel_bowser_ops.flow", "L/min", "Flow rate", "Расход"),
  q("fuel_bowser_ops.tank", "%", "Bowser tank level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("fuel_bowser_ops.deadman", "s", "Deadman hold time", "Время удержания deadman"),
  logical("fuel_bowser_ops.bonding", "Bonding OK", "Заземление OK"),
  enu("fuel_bowser_ops.state", ["idle", "fuel", "transit", "fault"], "Bowser state", "Состояние заправщика"),
]);

write("layer-b-mro_bay.json", [
  id("mro_bay.id", "MRO hangar bay id", "ID бокса ТОиР"),
  id("mro_bay.ac.id", "Aircraft id", "ID ВС"),
  q("mro_bay.open.tasks", "-", "Open work orders", "Открытых нарядов", { encodings: ["i32"] }),
  q("mro_bay.progress", "%", "Check progress", "Прогресс формы", { range: { min: 0, max: 100 } }),
  q("mro_bay.man.hours", "h", "Man-hours logged", "Человеко-часов"),
  q("mro_bay.aog", "-", "AOG parts waiting", "Ожидание AOG-запчастей", { encodings: ["i32"] }),
  logical("mro_bay.grounded", "Aircraft grounded", "ВС на земле"),
  enu("mro_bay.check", ["a", "b", "c", "d", "line", "other"], "Check type", "Тип формы"),
]);

write("layer-b-ndt_comp.json", [
  id("ndt_comp.job.id", "Composite NDT job id", "ID НК композита"),
  id("ndt_comp.part.id", "Part id", "ID детали"),
  q("ndt_comp.coverage", "%", "Scan coverage", "Покрытие сканирования", { range: { min: 0, max: 100 } }),
  q("ndt_comp.indications", "-", "Indications", "Индикаций", { encodings: ["i32"] }),
  q("ndt_comp.depth", "mm", "Max indication depth", "Макс. глубина индикации"),
  q("ndt_comp.time.min", "min", "Inspection time", "Время контроля"),
  logical("ndt_comp.reject", "Reject", "Брак"),
  enu("ndt_comp.method", ["ut", "thermography", "shearography", "xray", "other"], "Method", "Метод"),
]);

write("layer-b-blade_shop.json", [
  id("blade_shop.cell.id", "Fan / blade repair cell id", "ID ячейки ремонта лопаток"),
  id("blade_shop.part.id", "Blade serial", "Серийный номер лопатки"),
  q("blade_shop.blend", "mm", "Blend depth", "Глубина зачистки"),
  q("blade_shop.coat.um", "um", "Coating thickness", "Толщина покрытия"),
  q("blade_shop.balance", "g.mm", "Balance correction", "Коррекция балансировки"),
  q("blade_shop.cycle.h", "h", "Repair cycle time", "Цикл ремонта"),
  logical("blade_shop.pass", "Repair pass", "Ремонт принят"),
  enu("blade_shop.process", ["blend", "weld", "coat", "balance", "other"], "Process", "Процесс"),
]);

write("layer-b-engine_cell.json", [
  id("engine_cell.id", "Engine test cell id", "ID стенда двигателя"),
  id("engine_cell.esn", "Engine serial", "Серийный номер двигателя"),
  q("engine_cell.thrust", "kN", "Thrust / shaft power proxy", "Тяга / мощность"),
  q("engine_cell.n1", "%", "N1", "N1", { range: { min: 0, max: 100 } }),
  q("engine_cell.egt", "Cel", "EGT / TOT", "EGT / TOT"),
  q("engine_cell.fuel", "kg/h", "Fuel flow", "Расход топлива"),
  logical("engine_cell.abort", "Test abort", "Прерывание испытания"),
  enu("engine_cell.state", ["idle", "run", "cool", "fault"], "Cell state", "Состояние стенда"),
]);

write("layer-b-apu_test_cell.json", [
  id("apu_test_cell.id", "APU test cell id", "ID стенда ВСУ"),
  id("apu_test_cell.serial", "APU serial", "Серийный номер ВСУ"),
  q("apu_test_cell.egt", "Cel", "EGT", "EGT"),
  q("apu_test_cell.speed", "%", "APU speed", "Обороты ВСУ", { range: { min: 0, max: 100 } }),
  q("apu_test_cell.bleed", "kPa", "Bleed pressure", "Давление отбора"),
  q("apu_test_cell.load", "kW", "Electrical load", "Электрическая нагрузка"),
  logical("apu_test_cell.pass", "Acceptance pass", "Приёмка пройдена"),
  enu("apu_test_cell.state", ["start", "load", "cool", "fault"], "Cell state", "Состояние стенда"),
]);

write("layer-b-ldg_gear_test.json", [
  id("ldg_gear_test.rig.id", "Landing gear test rig id", "ID стенда шасси"),
  id("ldg_gear_test.unit.id", "Gear unit id", "ID стойки"),
  q("ldg_gear_test.load", "kN", "Applied load", "Приложенная нагрузка"),
  q("ldg_gear_test.stroke", "mm", "Stroke", "Ход"),
  q("ldg_gear_test.pressure", "kPa", "Hydraulic pressure", "Давление гидравлики"),
  q("ldg_gear_test.cycles", "-", "Test cycles", "Циклов испытания", { encodings: ["i32"] }),
  logical("ldg_gear_test.leak", "Hydraulic leak", "Утечка гидравлики"),
  enu("ldg_gear_test.state", ["setup", "load", "cycle", "inspect", "fault"], "Rig state", "Состояние стенда"),
]);

write("layer-b-avionics_ate.json", [
  id("avionics_ate.bench.id", "Avionics ATE bench id", "ID стенда АТЭ авионики"),
  id("avionics_ate.lru.id", "LRU id", "ID LRU"),
  q("avionics_ate.pass", "%", "Test pass rate", "Доля прошедших тестов", { range: { min: 0, max: 100 } }),
  q("avionics_ate.time.min", "min", "Test duration", "Длительность теста"),
  q("avionics_ate.faults", "-", "Fault codes", "Кодов неисправностей", { encodings: ["i32"] }),
  q("avionics_ate.power", "W", "Bench power", "Мощность стенда"),
  logical("avionics_ate.fail", "Unit failed", "Блок не прошёл"),
  enu("avionics_ate.state", ["idle", "test", "calibrate", "fault"], "Bench state", "Состояние стенда"),
]);

write("layer-b-pitot_bench.json", [
  id("pitot_bench.id", "Pitot-static test bench id", "ID стенда ПВД"),
  id("pitot_bench.ac.id", "Aircraft id", "ID ВС"),
  q("pitot_bench.qc", "kPa", "Pitot pressure Qc", "Давление ПВД Qc"),
  q("pitot_bench.ps", "kPa", "Static pressure", "Статическое давление"),
  q("pitot_bench.leak", "Pa/min", "Leak rate", "Скорость утечки"),
  q("pitot_bench.alt", "ft", "Simulated altitude", "Имитируемая высота"),
  logical("pitot_bench.pass", "Leak check pass", "Проверка утечки OK"),
  enu("pitot_bench.state", ["setup", "test", "vent", "fault"], "Bench state", "Состояние стенда"),
]);

write("layer-b-oxygen_cart.json", [
  id("oxygen_cart.id", "Aircraft oxygen cart id", "ID кислородной тележки"),
  id("oxygen_cart.ac.id", "Aircraft id", "ID ВС"),
  q("oxygen_cart.pressure", "kPa", "Bottle pressure", "Давление баллона"),
  q("oxygen_cart.purity", "%", "Oxygen purity", "Чистота кислорода", { range: { min: 0, max: 100 } }),
  q("oxygen_cart.filled", "L", "Volume filled (NTP)", "Заполнено (н.у.)"),
  q("oxygen_cart.temp", "Cel", "Bottle temperature", "Температура баллона"),
  logical("oxygen_cart.connected", "Connected", "Подключено"),
  enu("oxygen_cart.state", ["idle", "fill", "purge", "fault"], "Cart state", "Состояние тележки"),
]);

write("layer-b-fire_bottle_ac.json", [
  id("fire_bottle_ac.id", "Aircraft fire bottle service id", "ID обслуживания огнетушителей ВС"),
  id("fire_bottle_ac.bottle.id", "Bottle serial", "Серийный номер баллона"),
  q("fire_bottle_ac.pressure", "kPa", "Bottle pressure", "Давление баллона"),
  q("fire_bottle_ac.weight", "kg", "Agent weight", "Масса состава"),
  q("fire_bottle_ac.due.d", "d", "Days to hydrostatic due", "Дней до гидроиспытания"),
  q("fire_bottle_ac.temp", "Cel", "Ambient temperature", "Температура среды"),
  logical("fire_bottle_ac.low", "Low pressure / weight", "Низкое давление/масса"),
  enu("fire_bottle_ac.agent", ["halon", "hfc", "water", "other"], "Agent", "Состав"),
]);

write("layer-b-galley_bench.json", [
  id("galley_bench.id", "Galley equipment test bench id", "ID стенда камбузного оборудования"),
  id("galley_bench.unit.id", "Galley unit id", "ID блока камбуза"),
  q("galley_bench.power", "W", "Power draw", "Потребляемая мощность"),
  q("galley_bench.temp", "Cel", "Oven / chiller temperature", "Температура духовки/охладителя"),
  q("galley_bench.cycle.min", "min", "Test cycle", "Цикл теста"),
  q("galley_bench.fail", "-", "Failed checks", "Проваленных проверок", { encodings: ["i32"] }),
  logical("galley_bench.pass", "Bench pass", "Стенд пройден"),
  enu("galley_bench.type", ["oven", "chiller", "boiler", "other"], "Unit type", "Тип блока"),
]);

write("layer-b-seat_fit_line.json", [
  id("seat_fit_line.id", "Cabin seat fitment line id", "ID линии установки кресел"),
  id("seat_fit_line.shipset.id", "Shipset id", "ID комплекта"),
  q("seat_fit_line.seats", "-", "Seats installed", "Кресел установлено", { encodings: ["i32"] }),
  q("seat_fit_line.torque", "N.m", "Track bolt torque", "Момент болтов рельса"),
  q("seat_fit_line.rework", "%", "Rework rate", "Доля переделок", { range: { min: 0, max: 100 } }),
  q("seat_fit_line.rate", "/h", "Seats per hour", "Кресел в час"),
  logical("seat_fit_line.ifo", "IFO / IFE connected", "IFO/IFE подключено"),
  enu("seat_fit_line.state", ["kit", "install", "test", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-press_test_cabin.json", [
  id("press_test_cabin.ac.id", "Cabin pressurization test aircraft id", "ID ВС испытания герметичности"),
  q("press_test_cabin.dp", "kPa", "Cabin differential", "Перепад кабины"),
  q("press_test_cabin.leak", "Pa/min", "Leak rate", "Скорость утечки"),
  q("press_test_cabin.alt", "ft", "Equivalent altitude", "Эквивалентная высота"),
  q("press_test_cabin.time.min", "min", "Hold time", "Время выдержки"),
  q("press_test_cabin.doors", "-", "Doors sealed", "Дверей герметично", { encodings: ["i32"] }),
  logical("press_test_cabin.pass", "Press test pass", "Испытание пройдено"),
  enu("press_test_cabin.state", ["prep", "press", "hold", "vent", "fault"], "Test state", "Состояние испытания"),
]);

write("layer-b-cargo_hold_mon.json", [
  id("cargo_hold_mon.hold.id", "Cargo hold monitor id", "ID монитора грузового отсека"),
  id("cargo_hold_mon.flight.id", "Flight id", "ID рейса"),
  q("cargo_hold_mon.temp", "Cel", "Hold temperature", "Температура отсека"),
  q("cargo_hold_mon.smoke", "%", "Smoke detector level", "Уровень дыма", { range: { min: 0, max: 100 } }),
  q("cargo_hold_mon.door", "%", "Door closed percent", "Процент закрытия двери", { range: { min: 0, max: 100 } }),
  q("cargo_hold_mon.uld", "-", "ULDs loaded", "ULD загружено", { encodings: ["i32"] }),
  logical("cargo_hold_mon.fire", "Fire / smoke alarm", "Пожар / дым"),
  enu("cargo_hold_mon.state", ["empty", "load", "secure", "alarm"], "Hold state", "Состояние отсека"),
]);

write("layer-b-uld_washer.json", [
  id("uld_washer.id", "ULD washer id", "ID мойки ULD"),
  id("uld_washer.uld.id", "ULD id", "ID ULD"),
  q("uld_washer.cycle.min", "min", "Wash cycle", "Цикл мойки"),
  q("uld_washer.temp", "Cel", "Wash temperature", "Температура мойки"),
  q("uld_washer.chem", "L", "Chemical use", "Расход химии"),
  q("uld_washer.throughput", "/h", "ULDs per hour", "ULD в час"),
  logical("uld_washer.dry", "Dry complete", "Сушка завершена"),
  enu("uld_washer.state", ["load", "wash", "dry", "idle", "fault"], "Washer state", "Состояние мойки"),
]);

write("layer-b-deice_tank.json", [
  id("deice_tank.id", "De-icing fluid storage id", "ID склада жидкости антиобледенения"),
  q("deice_tank.level", "%", "Tank level", "Уровень резервуара", { range: { min: 0, max: 100 } }),
  q("deice_tank.conc", "%", "Fluid concentration", "Концентрация жидкости", { range: { min: 0, max: 100 } }),
  q("deice_tank.temp", "Cel", "Fluid temperature", "Температура жидкости"),
  q("deice_tank.used", "L", "Used today", "Израсходовано за сутки"),
  q("deice_tank.refract", "-", "Refractometer reading", "Показание рефрактометра"),
  logical("deice_tank.low", "Low level", "Низкий уровень"),
  enu("deice_tank.type", ["type_i", "type_ii", "type_iv", "other"], "Fluid type", "Тип жидкости"),
]);

write("layer-b-snow_broom.json", [
  id("snow_broom.id", "Runway snow broom id", "ID щётки очистки ВПП"),
  id("snow_broom.runway.id", "Runway id", "ID ВПП"),
  q("snow_broom.speed", "km/h", "Sweep speed", "Скорость очистки"),
  q("snow_broom.width", "m", "Sweep width", "Ширина очистки"),
  q("snow_broom.snow", "mm", "Snow depth ahead", "Глубина снега впереди"),
  q("snow_broom.fuel", "L/h", "Fuel rate", "Расход топлива"),
  logical("snow_broom.active", "Sweeping", "Очистка"),
  enu("snow_broom.state", ["idle", "sweep", "dump", "fault"], "Broom state", "Состояние щётки"),
]);

write("layer-b-friction_truck.json", [
  id("friction_truck.id", "Runway friction truck id", "ID машины замера сцепления"),
  id("friction_truck.runway.id", "Runway id", "ID ВПП"),
  q("friction_truck.mu", "-", "Friction coefficient", "Коэффициент сцепления"),
  q("friction_truck.speed", "km/h", "Survey speed", "Скорость замера"),
  q("friction_truck.depth", "mm", "Contaminant depth", "Глубина загрязнения"),
  q("friction_truck.temp", "Cel", "Surface temperature", "Температура покрытия"),
  logical("friction_truck.poor", "Poor friction", "Плохое сцепление"),
  enu("friction_truck.contaminant", ["dry", "wet", "snow", "ice", "slush", "other"], "Contaminant", "Загрязнение"),
]);

write("layer-b-bird_detect.json", [
  id("bird_detect.id", "Airport bird radar / detect id", "ID орнитологического радара"),
  q("bird_detect.tracks", "-", "Bird tracks", "Траекторий птиц", { encodings: ["i32"] }),
  q("bird_detect.risk", "%", "Strike risk score", "Оценка риска столкновения", { range: { min: 0, max: 100 } }),
  q("bird_detect.range", "km", "Detection range", "Дальность обнаружения"),
  q("bird_detect.dispersals", "-", "Dispersals today", "Отпугиваний за сутки", { encodings: ["i32"] }),
  q("bird_detect.height", "m", "Mean flock height", "Средняя высота стаи"),
  logical("bird_detect.alert", "High risk alert", "Тревога высокого риска"),
  enu("bird_detect.state", ["scan", "alert", "disperse", "offline"], "System state", "Состояние системы"),
]);

write("layer-b-wildlife_fence.json", [
  id("wildlife_fence.zone.id", "Airport wildlife fence zone id", "ID зоны ограждения от животных"),
  q("wildlife_fence.integrity", "%", "Fence integrity", "Целостность ограждения", { range: { min: 0, max: 100 } }),
  q("wildlife_fence.breaches", "-", "Breaches today", "Прорывов за сутки", { encodings: ["i32"] }),
  q("wildlife_fence.cameras", "-", "Cameras online", "Камер онлайн", { encodings: ["i32"] }),
  q("wildlife_fence.detections", "-", "Animal detections", "Обнаружений животных", { encodings: ["i32"] }),
  q("wildlife_fence.voltage", "V", "Electrified fence voltage", "Напряжение электроизгороди"),
  logical("wildlife_fence.alarm", "Fence alarm", "Тревога ограждения"),
  enu("wildlife_fence.state", ["ok", "breach", "maintain", "offline"], "Zone state", "Состояние зоны"),
]);

write("layer-b-fbo_desk.json", [
  id("fbo_desk.id", "FBO operations desk id", "ID операционного стола FBO"),
  q("fbo_desk.movements", "-", "Aircraft movements today", "Движений ВС за сутки", { encodings: ["i32"] }),
  q("fbo_desk.fuel", "L", "Fuel sold today", "Топлива продано за сутки"),
  q("fbo_desk.hangar", "%", "Hangar occupancy", "Занятость ангара", { range: { min: 0, max: 100 } }),
  q("fbo_desk.wait.min", "min", "Average service wait", "Среднее ожидание сервиса"),
  q("fbo_desk.slots", "-", "Open slots", "Свободных слотов", { encodings: ["i32"] }),
  logical("fbo_desk.night", "Night ops", "Ночные операции"),
  enu("fbo_desk.state", ["open", "busy", "closed", "weather"], "Desk state", "Состояние стола"),
]);

write("layer-b-ga_hangar_ops.json", [
  id("ga_hangar_ops.id", "GA hangar ops id", "ID операций GA-ангара"),
  q("ga_hangar_ops.occupancy", "%", "Aircraft occupancy", "Занятость ВС", { range: { min: 0, max: 100 } }),
  q("ga_hangar_ops.door", "%", "Door open", "Открытие ворот", { range: { min: 0, max: 100 } }),
  q("ga_hangar_ops.temp", "Cel", "Hangar temperature", "Температура ангара"),
  q("ga_hangar_ops.moves", "-", "Aircraft moves today", "Перестановок за сутки", { encodings: ["i32"] }),
  q("ga_hangar_ops.power", "W", "Hangar electrical load", "Электронагрузка ангара"),
  logical("ga_hangar_ops.fire", "Fire alarm", "Пожарная тревога"),
  enu("ga_hangar_ops.state", ["open", "closed", "move", "fault"], "Hangar state", "Состояние ангара"),
]);

write("layer-b-heli_pad_ops.json", [
  id("heli_pad_ops.id", "Helipad ops id", "ID операций вертолётной площадки"),
  q("heli_pad_ops.movements", "-", "Movements today", "Движений за сутки", { encodings: ["i32"] }),
  q("heli_pad_ops.wind", "m/s", "Wind", "Ветер"),
  q("heli_pad_ops.lighting", "%", "Pad lighting", "Освещение площадки", { range: { min: 0, max: 100 } }),
  q("heli_pad_ops.fuel", "L", "JetA dispensed", "Выдано JetA"),
  q("heli_pad_ops.rvr", "m", "Visibility / RVR", "Видимость / RVR"),
  logical("heli_pad_ops.closed", "Pad closed", "Площадка закрыта"),
  enu("heli_pad_ops.state", ["open", "occupied", "closed", "weather"], "Pad state", "Состояние площадки"),
]);

write("layer-b-vertipad_ops.json", [
  id("vertipad_ops.id", "Vertiport pad id", "ID площадки вертипорта"),
  id("vertipad_ops.vehicle.id", "eVTOL id", "ID eVTOL"),
  q("vertipad_ops.charge", "W", "Charge power", "Мощность зарядки"),
  q("vertipad_ops.soc", "%", "Vehicle SOC", "SOC аппарата", { range: { min: 0, max: 100 } }),
  q("vertipad_ops.wind", "m/s", "Wind", "Ветер"),
  q("vertipad_ops.dwell.min", "min", "Pad dwell", "Стоянка на площадке"),
  logical("vertipad_ops.occupied", "Pad occupied", "Площадка занята"),
  enu("vertipad_ops.state", ["free", "arrive", "charge", "depart", "fault"], "Pad state", "Состояние площадки"),
]);

write("layer-b-uas_utm.json", [
  id("uas_utm.cell.id", "UAS UTM cell id", "ID ячейки UTM"),
  q("uas_utm.flights", "-", "Active UAS flights", "Активных полётов БВС", { encodings: ["i32"] }),
  q("uas_utm.conflicts", "-", "Conflicts today", "Конфликтов за сутки", { encodings: ["i32"] }),
  q("uas_utm.latency.ms", "ms", "C2 latency", "Задержка C2"),
  q("uas_utm.geofence", "-", "Geofence breaches", "Нарушений геозоны", { encodings: ["i32"] }),
  q("uas_utm.coverage", "%", "Surveillance coverage", "Покрытие наблюдения", { range: { min: 0, max: 100 } }),
  logical("uas_utm.lockdown", "Airspace lockdown", "Блокировка воздушного пространства"),
  enu("uas_utm.state", ["normal", "congested", "lockdown", "offline"], "UTM state", "Состояние UTM"),
]);

write("layer-b-drone_nest_ops.json", [
  id("drone_nest_ops.id", "Drone nest / dock id", "ID дронового гнезда"),
  id("drone_nest_ops.drone.id", "Drone id", "ID дрона"),
  q("drone_nest_ops.soc", "%", "Drone SOC", "SOC дрона", { range: { min: 0, max: 100 } }),
  q("drone_nest_ops.missions", "-", "Missions today", "Миссий за сутки", { encodings: ["i32"] }),
  q("drone_nest_ops.wind", "m/s", "Nest wind", "Ветер у гнезда"),
  q("drone_nest_ops.door", "%", "Nest door open", "Открытие двери гнезда", { range: { min: 0, max: 100 } }),
  logical("drone_nest_ops.ready", "Ready to launch", "Готов к запуску"),
  enu("drone_nest_ops.state", ["docked", "launch", "mission", "recover", "fault"], "Nest state", "Состояние гнезда"),
]);

write("layer-b-parcel_drone_ops.json", [
  id("parcel_drone_ops.id", "Parcel drone ops id", "ID операций дрона-доставки"),
  id("parcel_drone_ops.parcel.id", "Parcel id", "ID посылки"),
  q("parcel_drone_ops.mass", "kg", "Payload mass", "Масса полезной нагрузки"),
  q("parcel_drone_ops.eta.min", "min", "ETA", "ETA"),
  q("parcel_drone_ops.alt", "m", "Altitude AGL", "Высота AGL"),
  q("parcel_drone_ops.soc", "%", "Drone SOC", "SOC дрона", { range: { min: 0, max: 100 } }),
  logical("parcel_drone_ops.delivered", "Delivered", "Доставлено"),
  enu("parcel_drone_ops.state", ["prep", "cruise", "drop", "return", "fault"], "Mission state", "Состояние миссии"),
]);

write("layer-b-insp_drone_ind.json", [
  id("insp_drone_ind.id", "Industrial inspection drone id", "ID промышленного инспекционного дрона"),
  id("insp_drone_ind.asset.id", "Inspected asset id", "ID обследуемого актива"),
  q("insp_drone_ind.images", "-", "Images captured", "Снимков", { encodings: ["i32"] }),
  q("insp_drone_ind.coverage", "%", "Inspection coverage", "Покрытие обследования", { range: { min: 0, max: 100 } }),
  q("insp_drone_ind.soc", "%", "Drone SOC", "SOC дрона", { range: { min: 0, max: 100 } }),
  q("insp_drone_ind.findings", "-", "Findings flagged", "Замеченных дефектов", { encodings: ["i32"] }),
  logical("insp_drone_ind.critical", "Critical finding", "Критический дефект"),
  enu("insp_drone_ind.state", ["plan", "fly", "analyze", "dock", "fault"], "Mission state", "Состояние миссии"),
]);

write("layer-b-tunnel_vent_fan.json", [
  id("tunnel_vent_fan.id", "Road / rail tunnel fan id", "ID вентилятора тоннеля"),
  id("tunnel_vent_fan.tunnel.id", "Tunnel id", "ID тоннеля"),
  q("tunnel_vent_fan.speed", "rpm", "Fan speed", "Обороты вентилятора"),
  q("tunnel_vent_fan.flow", "m3/s", "Airflow", "Расход воздуха"),
  q("tunnel_vent_fan.co", "ppm", "CO level", "Уровень CO"),
  q("tunnel_vent_fan.visibility", "%", "Visibility", "Видимость", { range: { min: 0, max: 100 } }),
  logical("tunnel_vent_fan.fire", "Fire mode", "Режим пожара"),
  enu("tunnel_vent_fan.mode", ["normal", "pollution", "fire", "reverse", "fault"], "Mode", "Режим"),
]);

write("layer-b-road_tun_light.json", [
  id("road_tun_light.zone.id", "Road tunnel lighting zone id", "ID зоны освещения автотоннеля"),
  q("road_tun_light.lux", "lx", "Illuminance", "Освещённость"),
  q("road_tun_light.dim", "%", "Dim level", "Диммирование", { range: { min: 0, max: 100 } }),
  q("road_tun_light.power", "W", "Lighting power", "Мощность освещения"),
  q("road_tun_light.failed", "-", "Failed fixtures", "Неисправных светильников", { encodings: ["i32"] }),
  q("road_tun_light.entry", "lx", "Entry luminance proxy", "Яркость на въезде"),
  logical("road_tun_light.emergency", "Emergency lighting", "Аварийное освещение"),
  enu("road_tun_light.state", ["day", "night", "emergency", "fault"], "Zone state", "Состояние зоны"),
]);

write("layer-b-metro_tunnel.json", [
  id("metro_tunnel.section.id", "Metro tunnel section id", "ID участка тоннеля метро"),
  q("metro_tunnel.temp", "Cel", "Tunnel temperature", "Температура тоннеля"),
  q("metro_tunnel.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("metro_tunnel.co2", "ppm", "CO2", "CO2"),
  q("metro_tunnel.water", "mm", "Inflow / sump level", "Приток / уровень зумпфа"),
  q("metro_tunnel.vibration", "mm/s", "Structure vibration", "Вибрация конструкции"),
  logical("metro_tunnel.flood", "Flood risk", "Риск подтопления"),
  enu("metro_tunnel.state", ["ok", "wet", "alarm", "maintain"], "Section state", "Состояние участка"),
]);

console.log("Layer B24 seeds written");
