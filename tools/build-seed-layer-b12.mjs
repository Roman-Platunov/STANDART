#!/usr/bin/env node
/**
 * Layer B12 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B12", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-gnss_cors.json", [
  id("gnss_cors.station.id", "CORS station id", "ID станции CORS"),
  q("gnss_cors.satellites", "-", "Tracked satellites", "Сопровождаемых спутников", { encodings: ["i16"] }),
  q("gnss_cors.pdop", "-", "PDOP", "PDOP"),
  q("gnss_cors.latency.ms", "ms", "Correction latency", "Задержка поправок"),
  q("gnss_cors.availability", "%", "Service availability", "Доступность сервиса", { range: { min: 0, max: 100 } }),
  logical("gnss_cors.integrity.ok", "Integrity OK", "Целостность OK"),
  enu("gnss_cors.constellation", ["gps", "glonass", "galileo", "beidou", "multi"], "Constellation", "Созвездие"),
  enu("gnss_cors.state", ["online", "degraded", "offline", "maintenance"], "Station state", "Состояние станции"),
]);

write("layer-b-satcom.json", [
  id("satcom.terminal.id", "Satcom terminal id", "ID спутникового терминала"),
  id("satcom.beam.id", "Beam id", "ID луча"),
  q("satcom.snr", "dB", "Link SNR", "SNR канала"),
  q("satcom.throughput", "bit/s", "Throughput", "Пропускная способность"),
  q("satcom.latency.ms", "ms", "Round-trip latency", "Задержка RTT"),
  q("satcom.antenna.az", "deg", "Antenna azimuth", "Азимут антенны"),
  q("satcom.antenna.el", "deg", "Antenna elevation", "Угол места антенны"),
  enu("satcom.state", ["idle", "acquiring", "online", "rain_fade", "fault"], "Terminal state", "Состояние терминала"),
]);

write("layer-b-ads_b.json", [
  id("ads_b.receiver.id", "ADS-B receiver id", "ID приёмника ADS-B"),
  id("ads_b.aircraft.id", "Aircraft ICAO id", "ICAO код ВС"),
  q("ads_b.altitude", "ft", "Pressure altitude", "Барометрическая высота"),
  q("ads_b.speed", "kn", "Ground speed", "Путевая скорость"),
  q("ads_b.track", "deg", "Track angle", "Путевой угол"),
  q("ads_b.messages.s", "/s", "Message rate", "Скорость сообщений"),
  logical("ads_b.emergency", "Emergency squawk", "Аварийный код"),
  enu("ads_b.category", ["light", "small", "large", "heavy", "rotor", "other"], "Emitter category", "Категория излучателя"),
]);

write("layer-b-ais_shore.json", [
  id("ais_shore.station.id", "AIS shore station id", "ID береговой станции АИС"),
  id("ais_shore.vessel.mmsi", "Vessel MMSI", "MMSI судна"),
  q("ais_shore.range.nm", "NM", "Coverage range", "Дальность покрытия"),
  q("ais_shore.targets", "-", "Tracked targets", "Сопровождаемых целей", { encodings: ["i32"] }),
  q("ais_shore.sog", "kn", "Speed over ground", "Скорость относительно грунта"),
  q("ais_shore.cog", "deg", "Course over ground", "Курс относительно грунта"),
  logical("ais_shore.aton", "AtoN message", "Сообщение СНО"),
  enu("ais_shore.class", ["a", "b", "base", "aton", "sar"], "AIS class", "Класс АИС"),
]);

write("layer-b-lidar_mapping.json", [
  id("lidar_mapping.mission.id", "Lidar mission id", "ID миссии лидара"),
  id("lidar_mapping.sensor.id", "Lidar sensor id", "ID лидарного сенсора"),
  q("lidar_mapping.points", "-", "Point count", "Число точек", { encodings: ["i32"] }),
  q("lidar_mapping.density", "/m2", "Point density", "Плотность точек"),
  q("lidar_mapping.accuracy", "cm", "Vertical accuracy", "Вертикальная точность"),
  q("lidar_mapping.coverage.km2", "km2", "Coverage area", "Площадь покрытия"),
  media("lidar_mapping.cloud.ref", "Point cloud ref", "Референс облака точек"),
  enu("lidar_mapping.platform", ["airborne", "mobile", "uav", "terrestrial", "bathymetric"], "Platform", "Платформа"),
]);

write("layer-b-photogrammetry.json", [
  id("photogrammetry.project.id", "Photogrammetry project id", "ID проекта фотограмметрии"),
  id("photogrammetry.flight.id", "Flight id", "ID облёта"),
  q("photogrammetry.images", "-", "Image count", "Число снимков", { encodings: ["i32"] }),
  q("photogrammetry.gsd", "cm", "Ground sample distance", "GSD"),
  q("photogrammetry.overlap", "%", "Forward overlap", "Продольное перекрытие", { range: { min: 0, max: 100 } }),
  q("photogrammetry.rmse", "cm", "Control RMSE", "RMSE опорных точек"),
  media("photogrammetry.ortho.ref", "Orthomosaic ref", "Референс ортофото"),
  enu("photogrammetry.state", ["capture", "process", "qc", "deliver", "archive"], "Project state", "Состояние проекта"),
]);

write("layer-b-bim_site.json", [
  id("bim_site.model.id", "BIM model id", "ID BIM-модели"),
  id("bim_site.element.id", "BIM element id", "ID элемента BIM"),
  q("bim_site.lod", "-", "Level of detail", "Уровень детализации", { encodings: ["i16"] }),
  q("bim_site.clash.count", "-", "Clash count", "Число коллизий", { encodings: ["i32"] }),
  q("bim_site.progress", "%", "Construction progress", "Прогресс строительства", { range: { min: 0, max: 100 } }),
  logical("bim_site.federated", "Federated model", "Федеративная модель"),
  media("bim_site.ifc.ref", "IFC model ref", "Референс IFC"),
  enu("bim_site.discipline", ["arch", "struct", "mep", "civil", "combined"], "Discipline", "Дисциплина"),
]);

write("layer-b-concrete_pour.json", [
  id("concrete_pour.id", "Concrete pour id", "ID бетонирования"),
  id("concrete_pour.truck.id", "Mixer truck id", "ID автобетоносмесителя"),
  q("concrete_pour.volume", "m3", "Pour volume", "Объём укладки"),
  q("concrete_pour.slump", "mm", "Slump", "Осадка конуса"),
  q("concrete_pour.temp", "Cel", "Concrete temperature", "Температура бетона"),
  q("concrete_pour.maturity", "-", "Maturity index", "Индекс зрелости"),
  logical("concrete_pour.hold", "Pour on hold", "Укладка на паузе"),
  enu("concrete_pour.state", ["batch", "transit", "place", "cure", "test", "reject"], "Pour state", "Состояние укладки"),
]);

write("layer-b-pile_driving.json", [
  id("pile_driving.pile.id", "Pile id", "ID сваи"),
  id("pile_driving.rig.id", "Piling rig id", "ID сваебойной установки"),
  q("pile_driving.depth", "m", "Embedded depth", "Глубина погружения"),
  q("pile_driving.blows", "-", "Blow count", "Число ударов", { encodings: ["i32"] }),
  q("pile_driving.energy", "J", "Hammer energy", "Энергия молота"),
  q("pile_driving.refusal", "mm", "Refusal set", "Отказ"),
  logical("pile_driving.accepted", "Pile accepted", "Свая принята"),
  enu("pile_driving.method", ["driven", "cfa", "bored", "screw", "other"], "Piling method", "Метод погружения"),
]);

write("layer-b-geotech.json", [
  id("geotech.borehole.id", "Borehole id", "ID скважины изысканий"),
  id("geotech.sample.id", "Soil sample id", "ID пробы грунта"),
  q("geotech.spt.n", "-", "SPT N-value", "Число ударов SPT", { encodings: ["i16"] }),
  q("geotech.cpt.qc", "MPa", "CPT tip resistance", "Сопротивление конуса CPT"),
  q("geotech.water.table_m", "m", "Water table depth", "Глубина УГВ"),
  q("geotech.moisture", "%", "Soil moisture", "Влажность грунта", { range: { min: 0, max: 100 } }),
  media("geotech.log.ref", "Borehole log ref", "Референс колонки"),
  enu("geotech.method", ["spt", "cpt", "auger", "core", "geophysics", "other"], "Investigation method", "Метод изысканий"),
]);

write("layer-b-formwork.json", [
  id("formwork.system.id", "Formwork system id", "ID опалубки"),
  id("formwork.pour.id", "Related pour id", "ID связанного бетонирования"),
  q("formwork.pressure", "Pa", "Form pressure", "Давление на опалубку"),
  q("formwork.area", "m2", "Form contact area", "Площадь контакта"),
  q("formwork.reuse.count", "-", "Reuse cycles", "Циклы повторного использования", { encodings: ["i32"] }),
  logical("formwork.stripped", "Forms stripped", "Опалубка снята"),
  enu("formwork.type", ["timber", "steel", "aluminum", "plastic", "tunnel", "other"], "Formwork type", "Тип опалубки"),
  enu("formwork.state", ["erect", "ready", "pour", "cure", "strip", "store"], "Formwork state", "Состояние опалубки"),
]);

write("layer-b-tower_crane.json", [
  id("tower_crane.id", "Tower crane id", "ID башенного крана"),
  id("tower_crane.lift.id", "Lift id", "ID подъёма"),
  q("tower_crane.load", "t", "Hook load", "Нагрузка на крюке"),
  q("tower_crane.radius", "m", "Working radius", "Вылет"),
  q("tower_crane.height", "m", "Hook height", "Высота крюка"),
  q("tower_crane.wind", "m/s", "Wind at jib", "Ветер на стреле"),
  logical("tower_crane.overload", "Overload cutout", "Отсечка по перегрузу"),
  enu("tower_crane.state", ["idle", "slewing", "hoisting", "traveling", "outofservice", "fault"], "Crane state", "Состояние крана"),
]);

write("layer-b-hoist.json", [
  id("hoist.id", "Material hoist id", "ID подъёмника"),
  q("hoist.load", "kg", "Cage load", "Нагрузка кабины"),
  q("hoist.floor", "-", "Current floor", "Текущий этаж", { encodings: ["i16"] }),
  q("hoist.trips.hour", "/h", "Trips per hour", "Рейсов в час"),
  q("hoist.wind", "m/s", "Wind speed", "Скорость ветра"),
  logical("hoist.gate.closed", "Landing gate closed", "Дверь площадки закрыта"),
  enu("hoist.direction", ["up", "down", "stopped"], "Direction", "Направление"),
  enu("hoist.state", ["idle", "run", "overload", "fault", "maintenance"], "Hoist state", "Состояние подъёмника"),
]);

write("layer-b-site_power.json", [
  id("site_power.distro.id", "Temporary distro id", "ID временного щита"),
  id("site_power.genset.id", "Site genset id", "ID площадочного ДГУ"),
  q("site_power.load", "W", "Site electrical load", "Электронагрузка площадки"),
  q("site_power.voltage", "V", "Distro voltage", "Напряжение щита"),
  q("site_power.fuel.level", "%", "Genset fuel", "Топливо ДГУ", { range: { min: 0, max: 100 } }),
  q("site_power.rcd.trips", "-", "RCD trips", "Срабатывания УЗО", { encodings: ["i32"] }),
  logical("site_power.earth.ok", "Earth continuity OK", "Заземление OK"),
  enu("site_power.source", ["grid", "genset", "hybrid", "battery"], "Power source", "Источник питания"),
]);

write("layer-b-site_security.json", [
  id("site_security.gate.id", "Site gate id", "ID ворот площадки"),
  id("site_security.zone.id", "Site security zone id", "ID зоны охраны площадки"),
  q("site_security.entries.day", "-", "Entries today", "Входов сегодня", { encodings: ["i32"] }),
  q("site_security.cameras.online", "%", "Cameras online", "Камер online", { range: { min: 0, max: 100 } }),
  logical("site_security.intrusion", "Site intrusion", "Вторжение на площадку"),
  logical("site_security.after_hours", "After-hours access", "Доступ вне смены"),
  enu("site_security.mode", ["open", "controlled", "locked", "emergency"], "Security mode", "Режим охраны"),
  enu("site_security.state", ["normal", "alarm", "patrol", "incident"], "Security state", "Состояние охраны"),
]);

write("layer-b-facade.json", [
  id("facade.panel.id", "Facade panel id", "ID фасадной панели"),
  id("facade.zone.id", "Facade zone id", "ID зоны фасада"),
  q("facade.deflection", "mm", "Panel deflection", "Прогиб панели"),
  q("facade.leak.pressure", "Pa", "Water test pressure", "Давление испытания на воду"),
  q("facade.u_value", "W/m2/K", "U-value", "Коэффициент теплопередачи"),
  logical("facade.leak", "Water ingress", "Проникновение воды"),
  enu("facade.type", ["curtain", "rainscreen", "brick", "metal", "glass", "other"], "Facade type", "Тип фасада"),
  enu("facade.state", ["install", "seal", "test", "complete", "defect"], "Facade state", "Состояние фасада"),
]);

write("layer-b-roofing.json", [
  id("roofing.section.id", "Roof section id", "ID участка кровли"),
  id("roofing.job.id", "Roofing job id", "ID кровельных работ"),
  q("roofing.moisture", "%", "Deck moisture", "Влажность основания", { range: { min: 0, max: 100 } }),
  q("roofing.temp", "Cel", "Membrane temperature", "Температура мембраны"),
  q("roofing.wind.uplift", "Pa", "Uplift pressure", "Отрывное давление"),
  logical("roofing.leak", "Roof leak", "Протечка кровли"),
  enu("roofing.type", ["tpo", "epdm", "bitumen", "metal", "green", "other"], "Roof type", "Тип кровли"),
  enu("roofing.state", ["prep", "install", "flash", "inspect", "complete"], "Roofing state", "Состояние кровли"),
]);

write("layer-b-commissioning.json", [
  id("commissioning.system.id", "Commissioned system id", "ID вводимой системы"),
  id("commissioning.test.id", "Commissioning test id", "ID приёмочного испытания"),
  q("commissioning.tests.pass", "%", "Tests passed", "Пройденных испытаний", { range: { min: 0, max: 100 } }),
  q("commissioning.open.issues", "-", "Open issues", "Открытых замечаний", { encodings: ["i32"] }),
  q("commissioning.progress", "%", "Commissioning progress", "Прогресс пусконаладки", { range: { min: 0, max: 100 } }),
  logical("commissioning.ready", "Ready for occupancy", "Готово к эксплуатации"),
  enu("commissioning.phase", ["design", "install", "prefunc", "func", "seasonal", "complete"], "Cx phase", "Фаза пусконаладки"),
  enu("commissioning.result", ["pass", "fail", "deferred", "na"], "Test result", "Результат испытания"),
]);

write("layer-b-punch_list.json", [
  id("punch_list.item.id", "Punch item id", "ID пункта дефектовки"),
  id("punch_list.area.id", "Punch area id", "ID зоны дефектовки"),
  q("punch_list.open", "-", "Open punch items", "Открытых пунктов", { encodings: ["i32"] }),
  q("punch_list.overdue", "-", "Overdue items", "Просроченных пунктов", { encodings: ["i32"] }),
  q("punch_list.age.d", "d", "Item age days", "Возраст пункта (дни)"),
  logical("punch_list.critical", "Critical punch", "Критический пункт"),
  enu("punch_list.discipline", ["arch", "struct", "mep", "civil", "fire", "other"], "Discipline", "Дисциплина"),
  enu("punch_list.status", ["open", "wip", "ready", "closed", "void"], "Item status", "Статус пункта"),
]);

write("layer-b-facility_ops.json", [
  id("facility_ops.building.id", "Facility building id", "ID здания"),
  id("facility_ops.wo.id", "Facility work order id", "ID заявки эксплуатации"),
  q("facility_ops.wo.open", "-", "Open work orders", "Открытых заявок", { encodings: ["i32"] }),
  q("facility_ops.energy.eui", "kWh/m2", "Energy use intensity", "Удельное энергопотребление"),
  q("facility_ops.occupancy", "%", "Building occupancy", "Заполненность здания", { range: { min: 0, max: 100 } }),
  q("facility_ops.comfort.complaints", "-", "Comfort complaints today", "Жалоб на комфорт сегодня", { encodings: ["i16"] }),
  enu("facility_ops.wo.priority", ["low", "medium", "high", "emergency"], "WO priority", "Приоритет заявки"),
  enu("facility_ops.wo.status", ["new", "assigned", "wip", "done", "cancelled"], "WO status", "Статус заявки"),
]);

write("layer-b-space_mgmt.json", [
  id("space_mgmt.space.id", "Space id", "ID помещения"),
  id("space_mgmt.floor.id", "Floor id", "ID этажа"),
  q("space_mgmt.area", "m2", "Space area", "Площадь помещения"),
  q("space_mgmt.capacity", "-", "Seat capacity", "Вместимость", { encodings: ["i16"] }),
  q("space_mgmt.utilization", "%", "Space utilization", "Использование пространства", { range: { min: 0, max: 100 } }),
  logical("space_mgmt.vacant", "Space vacant", "Помещение свободно"),
  enu("space_mgmt.type", ["office", "meeting", "lab", "warehouse", "retail", "other"], "Space type", "Тип помещения"),
  enu("space_mgmt.status", ["occupied", "vacant", "fitout", "closed"], "Space status", "Статус помещения"),
]);

write("layer-b-desk_booking.json", [
  id("desk_booking.desk.id", "Desk id", "ID рабочего места"),
  id("desk_booking.user.id", "Booker user id", "ID пользователя", { sensitivity: "internal" }),
  q("desk_booking.occupancy.day", "%", "Daily desk occupancy", "Занятость мест за день", { range: { min: 0, max: 100 } }),
  q("desk_booking.no_show.rate", "%", "No-show rate", "Доля неявок", { range: { min: 0, max: 100 } }),
  logical("desk_booking.checked_in", "Checked in", "Чек-ин выполнен"),
  logical("desk_booking.sensor.occupied", "Sensor occupied", "Датчик: занято"),
  enu("desk_booking.status", ["free", "booked", "checked_in", "blocked", "offline"], "Desk status", "Статус места"),
  enu("desk_booking.policy", ["hot", "assigned", "neighborhood", "reserved"], "Booking policy", "Политика бронирования"),
]);

write("layer-b-meeting_room.json", [
  id("meeting_room.id", "Meeting room id", "ID переговорной"),
  id("meeting_room.booking.id", "Room booking id", "ID бронирования"),
  q("meeting_room.capacity", "-", "Room capacity", "Вместимость", { encodings: ["i16"] }),
  q("meeting_room.occupancy", "-", "Current occupants", "Текущих участников", { encodings: ["i16"] }),
  q("meeting_room.co2", "ppm", "Room CO2", "CO₂ в комнате"),
  logical("meeting_room.in_use", "Room in use", "Комната занята"),
  enu("meeting_room.av.state", ["ok", "fault", "offline", "unknown"], "AV state", "Состояние AV"),
  enu("meeting_room.status", ["free", "booked", "in_use", "blocked", "cleaning"], "Room status", "Статус комнаты"),
]);

write("layer-b-occupancy_sensor.json", [
  id("occupancy_sensor.id", "Occupancy sensor id", "ID датчика присутствия"),
  id("occupancy_sensor.zone.id", "Occupancy zone id", "ID зоны присутствия"),
  q("occupancy_sensor.count", "-", "People count", "Число людей", { encodings: ["i16"] }),
  q("occupancy_sensor.confidence", "%", "Detection confidence", "Уверенность детекции", { range: { min: 0, max: 100 } }),
  logical("occupancy_sensor.occupied", "Zone occupied", "Зона занята"),
  logical("occupancy_sensor.motion", "Motion detected", "Обнаружено движение"),
  enu("occupancy_sensor.tech", ["pir", "mmwave", "camera", "co2", "badge", "other"], "Sensor technology", "Технология датчика"),
  enu("occupancy_sensor.state", ["ok", "fault", "offline", "calibrating"], "Sensor state", "Состояние датчика"),
]);

write("layer-b-lighting_control.json", [
  id("lighting_control.zone.id", "Lighting zone id", "ID зоны освещения"),
  id("lighting_control.fixture.id", "Controllable fixture id", "ID управляемого светильника"),
  q("lighting_control.level", "%", "Light level", "Уровень света", { range: { min: 0, max: 100 } }),
  q("lighting_control.lux", "lx", "Measured lux", "Измеренная освещённость"),
  q("lighting_control.power", "W", "Zone lighting power", "Мощность освещения зоны"),
  logical("lighting_control.daylight", "Daylight harvesting", "Использование дневного света"),
  enu("lighting_control.mode", ["manual", "schedule", "occupancy", "daylight", "scene"], "Control mode", "Режим управления"),
  enu("lighting_control.state", ["on", "off", "dimmed", "fault"], "Zone state", "Состояние зоны"),
]);

write("layer-b-shade_control.json", [
  id("shade_control.zone.id", "Shade zone id", "ID зоны штор"),
  id("shade_control.motor.id", "Shade motor id", "ID привода штор"),
  q("shade_control.position", "%", "Shade position", "Положение штор", { range: { min: 0, max: 100 } }),
  q("shade_control.solar.gain", "W/m2", "Solar gain", "Солнечная нагрузка"),
  logical("shade_control.auto", "Auto mode", "Авторежим"),
  logical("shade_control.glare", "Glare detected", "Блик обнаружен"),
  enu("shade_control.type", ["roller", "venetian", "louver", "curtain", "other"], "Shade type", "Тип штор"),
  enu("shade_control.state", ["open", "closed", "moving", "fault"], "Shade state", "Состояние штор"),
]);

write("layer-b-digital_signage.json", [
  id("digital_signage.player.id", "Signage player id", "ID плеера вывески"),
  id("digital_signage.screen.id", "Screen id", "ID экрана"),
  q("digital_signage.uptime", "%", "Player uptime", "Аптайм плеера", { range: { min: 0, max: 100 } }),
  q("digital_signage.content.age_h", "h", "Content age hours", "Возраст контента (ч)"),
  logical("digital_signage.online", "Player online", "Плеер online"),
  logical("digital_signage.proof", "Proof of play", "Подтверждение показа"),
  media("digital_signage.playlist.ref", "Playlist ref", "Референс плейлиста"),
  enu("digital_signage.state", ["playing", "idle", "updating", "offline", "fault"], "Player state", "Состояние плеера"),
]);

write("layer-b-wayfinding.json", [
  id("wayfinding.kiosk.id", "Wayfinding kiosk id", "ID киоска навигации"),
  id("wayfinding.route.id", "Route id", "ID маршрута"),
  q("wayfinding.queries.hour", "/h", "Queries per hour", "Запросов в час"),
  q("wayfinding.route.length_m", "m", "Route length", "Длина маршрута"),
  q("wayfinding.eta.min", "min", "Walking ETA", "ETA пешком"),
  logical("wayfinding.accessible", "Accessible route", "Доступный маршрут"),
  enu("wayfinding.mode", ["indoor", "outdoor", "parking", "transit"], "Wayfinding mode", "Режим навигации"),
  enu("wayfinding.state", ["idle", "guiding", "arrived", "offline"], "Kiosk state", "Состояние киоска"),
]);

write("layer-b-restroom_ops.json", [
  id("restroom_ops.room.id", "Restroom id", "ID санузла"),
  q("restroom_ops.visits.hour", "/h", "Visits per hour", "Визитов в час"),
  q("restroom_ops.soap.level", "%", "Soap level", "Уровень мыла", { range: { min: 0, max: 100 } }),
  q("restroom_ops.paper.level", "%", "Paper level", "Уровень бумаги", { range: { min: 0, max: 100 } }),
  q("restroom_ops.odor.index", "-", "Odor index", "Индекс запаха", { range: { min: 0, max: 100 } }),
  logical("restroom_ops.clean.due", "Cleaning due", "Требуется уборка"),
  enu("restroom_ops.occupancy", ["vacant", "occupied", "full", "closed"], "Occupancy", "Занятость"),
  enu("restroom_ops.state", ["ok", "needs_service", "closed", "flood"], "Restroom state", "Состояние санузла"),
]);

write("layer-b-loading_dock.json", [
  id("loading_dock.door.id", "Dock door id", "ID док-ворот"),
  id("loading_dock.appointment.id", "Dock appointment id", "ID слота дока"),
  q("loading_dock.queue", "-", "Trucks in queue", "Грузовиков в очереди", { encodings: ["i16"] }),
  q("loading_dock.dwell.min", "min", "Truck dwell", "Простой грузовика"),
  q("loading_dock.utilization", "%", "Door utilization", "Загрузка ворот", { range: { min: 0, max: 100 } }),
  logical("loading_dock.leveler.engaged", "Leveler engaged", "Уравнитель задействован"),
  enu("loading_dock.door.state", ["free", "occupied", "loading", "unloading", "blocked", "maintenance"], "Door state", "Состояние ворот"),
  enu("loading_dock.appointment.state", ["booked", "arrived", "docked", "complete", "no_show", "cancelled"], "Appointment state", "Состояние слота"),
]);

write("layer-b-yms.json", [
  id("yms.yard.id", "Yard id", "ID двора"),
  id("yms.trailer.id", "Trailer id", "ID прицепа"),
  q("yms.spots.free", "-", "Free yard spots", "Свободных мест", { encodings: ["i32"] }),
  q("yms.dwell.h", "h", "Average trailer dwell", "Средний простой прицепа"),
  q("yms.moves.hour", "/h", "Yard moves per hour", "Перестановок в час"),
  logical("yms.trailer.reefer", "Reefer trailer", "Рефрижераторный прицеп"),
  enu("yms.trailer.state", ["inbound", "staged", "at_door", "outbound", "empty", "bad_order"], "Trailer state", "Состояние прицепа"),
  enu("yms.task", ["spot", "pull", "shuttle", "inspect", "idle"], "Yard task", "Задача двора"),
]);

write("layer-b-wms.json", [
  id("wms.warehouse.id", "WMS warehouse id", "ID склада WMS"),
  id("wms.order.id", "WMS order id", "ID заказа WMS"),
  q("wms.lines.hour", "/h", "Lines per hour", "Строк в час"),
  q("wms.accuracy", "%", "Inventory accuracy", "Точность запасов", { range: { min: 0, max: 100 } }),
  q("wms.backorders", "-", "Backorder lines", "Строк бэкордера", { encodings: ["i32"] }),
  q("wms.wave.size", "-", "Wave size", "Размер волны", { encodings: ["i32"] }),
  enu("wms.order.state", ["released", "allocated", "picked", "packed", "shipped", "cancelled"], "Order state", "Состояние заказа"),
  enu("wms.task.type", ["pick", "putaway", "replenish", "count", "move"], "Task type", "Тип задачи"),
]);

write("layer-b-tms.json", [
  id("tms.shipment.id", "TMS shipment id", "ID отправления TMS"),
  id("tms.carrier.id", "Carrier id", "ID перевозчика"),
  q("tms.cost", "-", "Shipment cost minor units", "Стоимость перевозки", { encodings: ["i32"] }),
  q("tms.eta.min", "min", "ETA minutes", "ETA минуты"),
  q("tms.on_time.pct", "%", "On-time percentage", "Доля вовремя", { range: { min: 0, max: 100 } }),
  q("tms.distance.km", "km", "Planned distance", "Плановая дистанция"),
  enu("tms.mode", ["tl", "ltl", "parcel", "rail", "ocean", "air", "intermodal"], "Transport mode", "Вид перевозки"),
  enu("tms.shipment.state", ["planned", "tendered", "in_transit", "delivered", "exception", "cancelled"], "Shipment state", "Состояние отправления"),
]);

write("layer-b-cross_dock.json", [
  id("cross_dock.facility.id", "Cross-dock facility id", "ID кросс-дока"),
  id("cross_dock.flow.id", "Cross-dock flow id", "ID потока кросс-дока"),
  q("cross_dock.throughput", "/h", "Units per hour", "Единиц в час"),
  q("cross_dock.dwell.min", "min", "Average dwell", "Средний простой"),
  q("cross_dock.missort.rate", "%", "Missort rate", "Доля ошибок сортировки", { range: { min: 0, max: 100 } }),
  q("cross_dock.doors.active", "-", "Active doors", "Активных ворот", { encodings: ["i16"] }),
  enu("cross_dock.flow.type", ["flow_through", "merge", "break_bulk", "transload"], "Flow type", "Тип потока"),
  enu("cross_dock.state", ["receiving", "sorting", "staging", "shipping", "idle"], "Facility state", "Состояние объекта"),
]);

write("layer-b-cycle_count.json", [
  id("cycle_count.task.id", "Cycle count task id", "ID задания пересчёта"),
  id("cycle_count.location.id", "Count location id", "ID ячейки пересчёта"),
  q("cycle_count.variance", "%", "Count variance", "Расхождение", { range: { min: 0, max: 100 } }),
  q("cycle_count.accuracy", "%", "Count accuracy", "Точность пересчёта", { range: { min: 0, max: 100 } }),
  q("cycle_count.sku.count", "-", "SKUs counted", "Посчитанных SKU", { encodings: ["i32"] }),
  logical("cycle_count.blind", "Blind count", "Слепой пересчёт"),
  enu("cycle_count.method", ["abc", "random", "opportunity", "full", "other"], "Count method", "Метод пересчёта"),
  enu("cycle_count.status", ["scheduled", "in_progress", "review", "posted", "cancelled"], "Count status", "Статус пересчёта"),
]);

write("layer-b-mes.json", [
  id("mes.order.id", "MES production order id", "ID производственного заказа MES"),
  id("mes.operation.id", "MES operation id", "ID операции MES"),
  q("mes.oee", "%", "OEE", "OEE", { range: { min: 0, max: 100 } }),
  q("mes.availability", "%", "Availability", "Доступность", { range: { min: 0, max: 100 } }),
  q("mes.performance", "%", "Performance", "Производительность", { range: { min: 0, max: 100 } }),
  q("mes.quality", "%", "Quality", "Качество", { range: { min: 0, max: 100 } }),
  enu("mes.order.state", ["released", "running", "held", "complete", "scrap"], "Order state", "Состояние заказа"),
  enu("mes.operation.state", ["ready", "setup", "run", "down", "complete"], "Operation state", "Состояние операции"),
]);

write("layer-b-andon.json", [
  id("andon.station.id", "Andon station id", "ID станции андон"),
  id("andon.line.id", "Production line id", "ID производственной линии"),
  logical("andon.active", "Andon active", "Андон активен"),
  q("andon.response.s", "s", "Response time", "Время реакции"),
  q("andon.stops.hour", "/h", "Stops per hour", "Остановок в час"),
  q("andon.downtime.min", "min", "Downtime minutes", "Минуты простоя"),
  enu("andon.reason", ["quality", "parts", "equipment", "safety", "help", "other"], "Andon reason", "Причина андона"),
  enu("andon.state", ["green", "yellow", "red", "cleared"], "Andon state", "Состояние андона"),
]);

write("layer-b-oee.json", [
  id("oee.asset.id", "OEE asset id", "ID актива OEE"),
  q("oee.value", "%", "OEE", "OEE", { range: { min: 0, max: 100 } }),
  q("oee.factor.availability", "%", "Availability", "Доступность", { range: { min: 0, max: 100 } }),
  q("oee.factor.performance", "%", "Performance", "Производительность", { range: { min: 0, max: 100 } }),
  q("oee.factor.quality", "%", "Quality", "Качество", { range: { min: 0, max: 100 } }),
  q("oee.mtbf.h", "h", "MTBF", "MTBF"),
  q("oee.mttr.h", "h", "MTTR", "MTTR"),
  enu("oee.period", ["shift", "day", "week", "month"], "Reporting period", "Период отчёта"),
]);

write("layer-b-scrap_tracking.json", [
  id("scrap_tracking.lot.id", "Scrap lot id", "ID партии брака"),
  id("scrap_tracking.reason.id", "Scrap reason id", "ID причины брака"),
  q("scrap_tracking.qty", "-", "Scrap quantity", "Количество брака", { encodings: ["i32"] }),
  q("scrap_tracking.rate", "%", "Scrap rate", "Доля брака", { range: { min: 0, max: 100 } }),
  q("scrap_tracking.cost", "-", "Scrap cost minor units", "Стоимость брака", { encodings: ["i32"] }),
  logical("scrap_tracking.reworkable", "Reworkable", "Подлежит переработке"),
  enu("scrap_tracking.disposition", ["scrap", "rework", "use_as_is", "return", "other"], "Disposition", "Распоряжение"),
  enu("scrap_tracking.status", ["logged", "reviewed", "closed", "void"], "Scrap status", "Статус брака"),
]);

write("layer-b-genealogy.json", [
  id("genealogy.batch.id", "Batch / lot id", "ID партии"),
  id("genealogy.component.id", "Component lot id", "ID партии компонента"),
  q("genealogy.depth", "-", "Trace depth", "Глубина трассировки", { encodings: ["i16"] }),
  q("genealogy.nodes", "-", "Graph nodes", "Узлов графа", { encodings: ["i32"] }),
  logical("genealogy.complete", "Trace complete", "Трассировка полная"),
  media("genealogy.graph.ref", "Genealogy graph ref", "Референс графа происхождения"),
  enu("genealogy.direction", ["forward", "backward", "both"], "Trace direction", "Направление трассировки"),
  enu("genealogy.status", ["ok", "partial", "broken", "quarantine"], "Trace status", "Статус трассировки"),
]);

write("layer-b-serialization.json", [
  id("serialization.serial.id", "Serial number id", "ID серийного номера"),
  id("serialization.sku.id", "Serialized SKU id", "ID сериализуемого SKU"),
  q("serialization.commissioned", "-", "Commissioned today", "Введено сегодня", { encodings: ["i32"] }),
  q("serialization.verified.pct", "%", "Verified percentage", "Доля верифицированных", { range: { min: 0, max: 100 } }),
  logical("serialization.aggregated", "Aggregated", "Агрегирован"),
  logical("serialization.quarantine", "In quarantine", "На карантине"),
  enu("serialization.level", ["unit", "bundle", "case", "pallet", "shipment"], "Pack level", "Уровень упаковки"),
  enu("serialization.status", ["commissioned", "packed", "shipped", "decommissioned", "destroyed"], "Serial status", "Статус серийника"),
]);

write("layer-b-ebr.json", [
  id("ebr.batch.id", "EBR batch id", "ID серии EBR"),
  id("ebr.step.id", "EBR step id", "ID шага EBR"),
  q("ebr.steps.complete", "%", "Steps complete", "Выполненных шагов", { range: { min: 0, max: 100 } }),
  q("ebr.deviations", "-", "Open deviations", "Открытых отклонений", { encodings: ["i16"] }),
  logical("ebr.signed", "Batch record signed", "Запись подписана"),
  logical("ebr.hold", "Batch on hold", "Серия на удержании"),
  enu("ebr.step.state", ["pending", "in_progress", "complete", "exception", "skipped"], "Step state", "Состояние шага"),
  enu("ebr.status", ["open", "review", "approved", "rejected", "archived"], "EBR status", "Статус EBR"),
]);

write("layer-b-recipe_mgmt.json", [
  id("recipe_mgmt.recipe.id", "Recipe id", "ID рецепта"),
  id("recipe_mgmt.version.id", "Recipe version id", "ID версии рецепта"),
  q("recipe_mgmt.params", "-", "Parameter count", "Число параметров", { encodings: ["i16"] }),
  q("recipe_mgmt.runs", "-", "Production runs", "Производственных прогонов", { encodings: ["i32"] }),
  logical("recipe_mgmt.approved", "Recipe approved", "Рецепт утверждён"),
  logical("recipe_mgmt.locked", "Recipe locked", "Рецепт заблокирован"),
  enu("recipe_mgmt.type", ["batch", "continuous", "discrete", "hybrid"], "Recipe type", "Тип рецепта"),
  enu("recipe_mgmt.status", ["draft", "review", "approved", "obsolete", "archived"], "Recipe status", "Статус рецепта"),
]);

write("layer-b-changeover.json", [
  id("changeover.line.id", "Changeover line id", "ID линии переналадки"),
  id("changeover.event.id", "Changeover event id", "ID события переналадки"),
  q("changeover.duration.min", "min", "Changeover duration", "Длительность переналадки"),
  q("changeover.target.min", "min", "Target duration", "Целевая длительность"),
  q("changeover.external.min", "min", "External time", "Внешнее время"),
  q("changeover.internal.min", "min", "Internal time", "Внутреннее время"),
  enu("changeover.type", ["sku", "format", "color", "tool", "clean", "other"], "Changeover type", "Тип переналадки"),
  enu("changeover.state", ["planned", "prep", "execute", "verify", "complete", "aborted"], "Changeover state", "Состояние переналадки"),
]);

write("layer-b-kanban.json", [
  id("kanban.card.id", "Kanban card id", "ID карточки канбан"),
  id("kanban.bin.id", "Kanban bin id", "ID ячейки канбан"),
  q("kanban.qty", "-", "Card quantity", "Количество на карточке", { encodings: ["i32"] }),
  q("kanban.wip", "-", "WIP cards", "Карточек в работе", { encodings: ["i32"] }),
  q("kanban.lead.time_h", "h", "Lead time hours", "Время цикла (ч)"),
  logical("kanban.empty", "Bin empty", "Ячейка пуста"),
  enu("kanban.type", ["production", "withdrawal", "signal", "supplier"], "Kanban type", "Тип канбан"),
  enu("kanban.status", ["full", "in_transit", "empty", "blocked"], "Card status", "Статус карточки"),
]);

write("layer-b-supermarket.json", [
  id("supermarket.zone.id", "Supermarket zone id", "ID зоны супермаркета"),
  id("supermarket.sku.id", "Supermarket SKU id", "ID SKU супермаркета"),
  q("supermarket.min", "-", "Min quantity", "Мин. количество", { encodings: ["i32"] }),
  q("supermarket.max", "-", "Max quantity", "Макс. количество", { encodings: ["i32"] }),
  q("supermarket.on_hand", "-", "On-hand quantity", "Остаток", { encodings: ["i32"] }),
  logical("supermarket.replenish.due", "Replenish due", "Требуется пополнение"),
  enu("supermarket.type", ["parts", "wip", "fg", "consumable"], "Supermarket type", "Тип супермаркета"),
  enu("supermarket.status", ["ok", "low", "empty", "overstock"], "Zone status", "Статус зоны"),
]);

write("layer-b-tugger.json", [
  id("tugger.train.id", "Tugger train id", "ID тягача с тележками"),
  id("tugger.route.id", "Milk-run route id", "ID маршрута молоковозки"),
  q("tugger.stops", "-", "Stops on route", "Остановок на маршруте", { encodings: ["i16"] }),
  q("tugger.cycle.min", "min", "Route cycle time", "Время цикла маршрута"),
  q("tugger.utilization", "%", "Capacity utilization", "Загрузка", { range: { min: 0, max: 100 } }),
  q("tugger.carts", "-", "Carts attached", "Прицепленных тележек", { encodings: ["i16"] }),
  enu("tugger.state", ["depot", "run", "load", "unload", "delay", "fault"], "Train state", "Состояние тягача"),
  enu("tugger.mode", ["fixed", "demand", "hybrid"], "Dispatch mode", "Режим диспетчеризации"),
]);

write("layer-b-quality_gate.json", [
  id("quality_gate.id", "Quality gate id", "ID контрольной точки"),
  id("quality_gate.lot.id", "Inspected lot id", "ID проверяемой партии"),
  q("quality_gate.sample.size", "-", "Sample size", "Объём выборки", { encodings: ["i32"] }),
  q("quality_gate.defect.rate", "%", "Defect rate", "Доля дефектов", { range: { min: 0, max: 100 } }),
  q("quality_gate.aql", "-", "AQL", "AQL"),
  logical("quality_gate.pass", "Gate passed", "Ворота пройдены"),
  enu("quality_gate.type", ["incoming", "in_process", "final", "skip_lot", "audit"], "Gate type", "Тип ворот"),
  enu("quality_gate.result", ["pass", "fail", "conditional", "hold"], "Gate result", "Результат ворот"),
]);

write("layer-b-spc.json", [
  id("spc.chart.id", "SPC chart id", "ID карты СПК"),
  id("spc.characteristic.id", "Characteristic id", "ID характеристики"),
  q("spc.xbar", "-", "X-bar", "X-среднее"),
  q("spc.r", "-", "Range R", "Размах R"),
  q("spc.cpk", "-", "Cpk", "Cpk"),
  q("spc.ppk", "-", "Ppk", "Ppk"),
  logical("spc.control.oos", "Out of control", "Вне управления"),
  enu("spc.rule", ["none", "western_electric", "nelson", "custom"], "Rule set", "Набор правил"),
]);

write("layer-b-capa.json", [
  id("capa.id", "CAPA id", "ID CAPA"),
  id("capa.source.id", "CAPA source id", "ID источника CAPA"),
  q("capa.age.d", "d", "CAPA age days", "Возраст CAPA (дни)"),
  q("capa.actions.open", "-", "Open actions", "Открытых действий", { encodings: ["i16"] }),
  logical("capa.effectiveness", "Effectiveness verified", "Эффективность подтверждена"),
  enu("capa.type", ["corrective", "preventive", "both"], "CAPA type", "Тип CAPA"),
  enu("capa.source", ["ncr", "complaint", "audit", "deviation", "other"], "Source type", "Тип источника"),
  enu("capa.status", ["open", "investigation", "action", "verify", "closed", "cancelled"], "CAPA status", "Статус CAPA"),
]);

write("layer-b-ncr.json", [
  id("ncr.id", "NCR id", "ID несоответствия"),
  id("ncr.lot.id", "Affected lot id", "ID затронутой партии"),
  q("ncr.qty", "-", "Affected quantity", "Затронутое количество", { encodings: ["i32"] }),
  q("ncr.age.d", "d", "NCR age days", "Возраст NCR (дни)"),
  logical("ncr.containment", "Containment done", "Сдерживание выполнено"),
  enu("ncr.severity", ["minor", "major", "critical"], "Severity", "Серьёзность"),
  enu("ncr.disposition", ["use_as_is", "rework", "scrap", "return", "sort"], "Disposition", "Распоряжение"),
  enu("ncr.status", ["open", "review", "disposition", "closed", "void"], "NCR status", "Статус NCR"),
]);

write("layer-b-audit_ops.json", [
  id("audit_ops.audit.id", "Audit id", "ID аудита"),
  id("audit_ops.findings.id", "Finding id", "ID находки"),
  q("audit_ops.findings.open", "-", "Open findings", "Открытых находок", { encodings: ["i16"] }),
  q("audit_ops.score", "%", "Audit score", "Оценка аудита", { range: { min: 0, max: 100 } }),
  q("audit_ops.duration.h", "h", "Audit duration", "Длительность аудита"),
  logical("audit_ops.critical", "Critical finding", "Критическая находка"),
  enu("audit_ops.type", ["internal", "supplier", "regulatory", "certification", "customer"], "Audit type", "Тип аудита"),
  enu("audit_ops.status", ["planned", "in_progress", "report", "follow_up", "closed"], "Audit status", "Статус аудита"),
]);

write("layer-b-training_ops.json", [
  id("training_ops.course.id", "Training course id", "ID курса обучения"),
  id("training_ops.learner.id", "Learner id", "ID обучаемого", { sensitivity: "internal" }),
  q("training_ops.completion", "%", "Completion", "Завершение", { range: { min: 0, max: 100 } }),
  q("training_ops.score", "%", "Assessment score", "Оценка теста", { range: { min: 0, max: 100 } }),
  q("training_ops.due.d", "d", "Days until due", "Дней до срока"),
  logical("training_ops.certified", "Certified", "Сертифицирован"),
  enu("training_ops.method", ["classroom", "elearning", "ojt", "simulation", "other"], "Training method", "Метод обучения"),
  enu("training_ops.status", ["assigned", "in_progress", "complete", "expired", "waived"], "Training status", "Статус обучения"),
]);

write("layer-b-ehs_incident.json", [
  id("ehs_incident.id", "EHS incident id", "ID происшествия ОТ и ПБ"),
  id("ehs_incident.site.id", "Incident site id", "ID площадки происшествия"),
  q("ehs_incident.severity", "-", "Severity score", "Оценка тяжести", { encodings: ["i16"] }),
  q("ehs_incident.days.away", "d", "Days away", "Дней нетрудоспособности"),
  logical("ehs_incident.recordable", "Recordable incident", "Учётное происшествие"),
  logical("ehs_incident.near_miss", "Near miss", "Почти происшествие"),
  enu("ehs_incident.type", ["injury", "illness", "env", "property", "near_miss", "other"], "Incident type", "Тип происшествия"),
  enu("ehs_incident.status", ["reported", "investigate", "corrective", "closed", "void"], "Incident status", "Статус происшествия"),
]);

write("layer-b-permit_to_work.json", [
  id("permit_to_work.id", "Permit to work id", "ID наряда-допуска"),
  id("permit_to_work.area.id", "Work area id", "ID зоны работ"),
  q("permit_to_work.workers", "-", "Workers under permit", "Работников по наряду", { encodings: ["i16"] }),
  q("permit_to_work.valid.h", "h", "Validity hours", "Срок действия (ч)"),
  logical("permit_to_work.active", "Permit active", "Наряд действует"),
  logical("permit_to_work.gas.test", "Gas test required", "Требуется газоанализ"),
  enu("permit_to_work.type", ["hot", "cold", "confined", "electrical", "excavation", "height", "other"], "Permit type", "Тип наряда"),
  enu("permit_to_work.status", ["requested", "issued", "active", "suspended", "closed", "cancelled"], "Permit status", "Статус наряда"),
]);

write("layer-b-lone_worker.json", [
  id("lone_worker.worker.id", "Lone worker id", "ID одиночного работника", { sensitivity: "internal" }),
  id("lone_worker.device.id", "Safety device id", "ID устройства безопасности"),
  q("lone_worker.checkin.age_min", "min", "Minutes since check-in", "Минут с чек-ина"),
  q("lone_worker.battery.pct", "%", "Device battery", "Батарея устройства", { range: { min: 0, max: 100 } }),
  logical("lone_worker.man_down", "Man-down alarm", "Тревога «человек упал»"),
  logical("lone_worker.duress", "Duress alarm", "Тревога принуждения"),
  enu("lone_worker.status", ["ok", "overdue", "alarm", "offline", "safe"], "Worker status", "Статус работника"),
  enu("lone_worker.mode", ["timed", "motion", "manual", "hybrid"], "Monitoring mode", "Режим мониторинга"),
]);

write("layer-b-mustering.json", [
  id("mustering.zone.id", "Muster zone id", "ID пункта сбора"),
  id("mustering.event.id", "Muster event id", "ID сбора"),
  q("mustering.expected", "-", "Expected headcount", "Ожидаемая численность", { encodings: ["i32"] }),
  q("mustering.accounted", "-", "Accounted headcount", "Учтённых", { encodings: ["i32"] }),
  q("mustering.missing", "-", "Missing headcount", "Недостающих", { encodings: ["i32"] }),
  logical("mustering.complete", "Muster complete", "Сбор завершён"),
  enu("mustering.trigger", ["drill", "fire", "gas", "security", "other"], "Muster trigger", "Причина сбора"),
  enu("mustering.status", ["activated", "in_progress", "complete", "all_clear", "cancelled"], "Muster status", "Статус сбора"),
]);

console.log("Layer B12 seeds written");
