#!/usr/bin/env node
/**
 * Layer B5 — continue world-domain coverage (manufacturing, infra, med-device, mobility, science).
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
const cmd = (pathStr, values, titleEn, titleRu) => ({
  path: pathStr, kind: "command", unit: "-", titleEn, titleRu,
  encodings: ["enum", "utf8"], enumValues: values, sensitivity: "public",
});
const media = (pathStr, titleEn, titleRu) => ({
  path: pathStr, kind: "media", unit: "-", titleEn, titleRu,
  encodings: ["utf8"], sensitivity: "internal",
});

function write(name, types) {
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B5", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-fleet.json", [
  id("fleet.vehicle.id", "Fleet vehicle id", "ID ТС автопарка"),
  id("fleet.driver.id", "Fleet driver id", "ID водителя", { sensitivity: "restricted" }),
  q("fleet.vehicle.speed", "km/h", "Fleet vehicle speed", "Скорость ТС автопарка"),
  q("fleet.fuel.level", "%", "Fleet fuel level", "Уровень топлива автопарка", { range: { min: 0, max: 100 } }),
  q("fleet.fuel.consumed", "L", "Fleet fuel consumed", "Расход топлива автопарка"),
  q("fleet.idle.time", "s", "Idle time", "Время простоя"),
  q("fleet.harsh.brake_count", "-", "Harsh brake events", "Резкие торможения", { encodings: ["i32"] }),
  q("fleet.harsh.accel_count", "-", "Harsh accel events", "Резкие ускорения", { encodings: ["i32"] }),
  q("fleet.score.eco", "-", "Eco driving score", "Экоскор вождения", { range: { min: 0, max: 100 } }),
  logical("fleet.seatbelt.fastened", "Seatbelt fastened fleet", "Ремень пристёгнут"),
  logical("fleet.camera.event", "Dashcam event", "Событие видеорегистратора"),
  enu("fleet.ignition.state", ["off", "on", "accessory"], "Fleet ignition state", "Зажигание (парк)"),
  media("fleet.dashcam.ref", "Dashcam clip ref", "Клип регистратора"),
]);

write("layer-b-heavy_equipment.json", [
  id("heavy.machine.id", "Heavy machine id", "ID тяжёлой техники"),
  enu("heavy.machine.type", ["excavator", "loader", "bulldozer", "crane", "grader", "forklift", "other"], "Heavy machine type", "Тип техники"),
  q("heavy.engine.hours", "h", "Engine hours", "Моточасы"),
  q("heavy.engine.load", "%", "Engine load heavy", "Нагрузка двигателя техники", { range: { min: 0, max: 100 } }),
  q("heavy.hydraulic.pressure", "kPa", "Hydraulic pressure", "Давление гидравлики"),
  q("heavy.hydraulic.temperature", "Cel", "Hydraulic temperature", "Температура гидравлики"),
  q("heavy.bucket.load", "kg", "Bucket/load weight", "Масса ковша/груза"),
  q("heavy.fuel.rate", "L/h", "Heavy fuel rate", "Расход топлива техники"),
  logical("heavy.safety.seat_switch", "Operator seat occupied", "Оператор на сиденье"),
  logical("heavy.safety.backup_alarm", "Backup alarm active", "Звуковой сигнал заднего хода"),
  enu("heavy.machine.state", ["off", "idle", "working", "transport", "fault"], "Heavy machine state", "Состояние техники"),
]);

write("layer-b-structural.json", [
  id("structural.asset.id", "Structural asset id", "ID конструкции"),
  enu("structural.asset.type", ["bridge", "tunnel", "dam", "building", "tower", "pipeline", "other"], "Structural asset type", "Тип конструкции"),
  q("structural.strain", "-", "Structural strain", "Деформация конструкции"),
  q("structural.displacement", "mm", "Structural displacement", "Смещение конструкции"),
  q("structural.tilt", "deg", "Structural tilt", "Крен конструкции"),
  q("structural.vibration.rms", "m/s2", "Structural vibration RMS", "Вибрация конструкции RMS"),
  q("structural.crack.width", "mm", "Crack width", "Ширина трещины"),
  q("structural.cable.tension", "N", "Cable tension", "Натяжение троса"),
  q("structural.concrete.humidity", "%", "Concrete humidity", "Влажность бетона", { range: { min: 0, max: 100 } }),
  q("structural.scour.depth", "m", "Scour depth", "Глубина размыва"),
  logical("structural.alert.active", "Structural alert", "Конструктивная тревога"),
]);

write("layer-b-road.json", [
  id("road.segment.id", "Road segment id", "ID участка дороги"),
  q("road.surface.temperature", "Cel", "Road surface temperature", "Температура покрытия"),
  q("road.surface.friction", "-", "Road friction", "Сцепление покрытия"),
  q("road.ice.probability", "%", "Ice probability", "Вероятность гололёда", { range: { min: 0, max: 100 } }),
  q("road.water.film", "mm", "Water film thickness", "Толщина водяной плёнки"),
  q("road.salt.concentration", "g/L", "De-icing salt concentration", "Концентрация реагента"),
  q("road.wim.axle_weight", "kg", "Weigh-in-motion axle weight", "Вес оси (WIM)"),
  q("road.wim.gross_weight", "kg", "Weigh-in-motion GVW", "Полная масса (WIM)"),
  q("road.toll.transactions", "-", "Toll transactions", "Транзакции проезда", { encodings: ["i32"] }),
  logical("road.anpr.read_ok", "ANPR read OK", "Распознавание номера OK"),
  id("road.camera.id", "Road camera id", "ID дорожной камеры"),
  enu("road.condition", ["dry", "wet", "snow", "ice", "slush", "unknown"], "Road condition", "Состояние дороги"),
]);

write("layer-b-transit.json", [
  id("transit.vehicle.id", "Transit vehicle id", "ID ОТ"),
  id("transit.line.id", "Transit line id", "ID маршрута ОТ"),
  id("transit.stop.id", "Transit stop id", "ID остановки"),
  q("transit.passenger.count", "-", "Passenger count transit", "Пассажиры ОТ", { encodings: ["i16"] }),
  q("transit.passenger.door_cycle", "-", "Door cycles", "Циклы дверей", { encodings: ["i32"] }),
  q("transit.delay", "s", "Schedule delay", "Опоздание"),
  q("transit.occupancy", "%", "Transit occupancy", "Заполненность салона", { range: { min: 0, max: 100 } }),
  logical("transit.door.open", "Transit door open", "Двери ОТ открыты"),
  logical("transit.wheelchair.ramp", "Wheelchair ramp deployed", "Пандус выдвинут"),
  enu("transit.mode", ["bus", "tram", "metro", "trolley", "brt", "ferry", "other"], "Transit mode", "Вид ОТ"),
  enu("transit.vehicle.state", ["in_service", "out_of_service", "depot", "fault"], "Transit vehicle state", "Состояние ОТ"),
]);

write("layer-b-ski.json", [
  id("ski.lift.id", "Ski lift id", "ID подъёмника"),
  q("ski.lift.speed", "m/s", "Lift speed", "Скорость подъёмника"),
  q("ski.lift.wind", "m/s", "Lift wind speed", "Ветер на подъёмнике"),
  q("ski.lift.load", "%", "Lift load", "Загрузка подъёмника", { range: { min: 0, max: 100 } }),
  q("ski.snow.depth", "cm", "Ski snow depth", "Высота снега (курорт)"),
  q("ski.snowmaking.pressure", "kPa", "Snowmaking pressure", "Давление снегогенератора"),
  q("ski.snowmaking.flow", "L/min", "Snowmaking water flow", "Расход воды снегогена"),
  q("ski.slope.temperature", "Cel", "Slope temperature", "Температура склона"),
  logical("ski.lift.e_stop", "Lift e-stop", "Аварийный стоп подъёмника"),
  enu("ski.lift.state", ["closed", "open", "wind_hold", "maintenance", "fault"], "Lift state", "Состояние подъёмника"),
]);

write("layer-b-underwater.json", [
  id("underwater.vehicle.id", "ROV/AUV id", "ID подводного аппарата"),
  q("underwater.depth", "m", "Underwater depth", "Глубина погружения"),
  q("underwater.pressure", "Pa", "Ambient water pressure", "Давление воды"),
  q("underwater.temperature", "Cel", "Water temperature underwater", "Температура воды"),
  q("underwater.thruster.rpm", "/min", "Thruster RPM", "Обороты движителя"),
  q("underwater.battery.soc", "%", "Underwater vehicle SoC", "Заряд подводного аппарата", { range: { min: 0, max: 100 } }),
  q("underwater.sonar.range", "m", "Sonar range", "Дальность сонара"),
  q("underwater.cable.tension", "N", "Tether tension", "Натяжение кабеля"),
  logical("underwater.leak.detected", "Hull leak detected", "Протечка корпуса"),
  enu("underwater.mode", ["surface", "dive", "cruise", "hover", "emergency"], "Underwater mode", "Режим подводного аппарата"),
  media("underwater.camera.ref", "Underwater camera ref", "Подводная камера"),
]);

write("layer-b-survey.json", [
  id("survey.instrument.id", "Survey instrument id", "ID геодезического прибора"),
  id("survey.point.id", "Survey point id", "ID точки съёмки"),
  q("survey.total_station.hz", "deg", "Horizontal angle", "Горизонтальный угол"),
  q("survey.total_station.v", "deg", "Vertical angle", "Вертикальный угол"),
  q("survey.total_station.slope_distance", "m", "Slope distance", "Наклонное расстояние"),
  q("survey.gnss.accuracy_h", "m", "GNSS horizontal accuracy", "Горизонтальная точность GNSS"),
  q("survey.gnss.accuracy_v", "m", "GNSS vertical accuracy", "Вертикальная точность GNSS"),
  q("survey.lidar.points", "-", "Point cloud size", "Число точек облака", { encodings: ["i32", "f64"] }),
  q("survey.scanner.range", "m", "Laser scanner range", "Дальность сканера"),
  enu("survey.gnss.fix", ["autonomous", "dgps", "rtk_float", "rtk_fixed", "ppp"], "Survey GNSS fix", "Режим GNSS съёмки"),
  media("survey.pointcloud.ref", "Point cloud ref", "Ссылка на облако точек"),
]);

write("layer-b-groundstation.json", [
  id("groundstation.antenna.id", "Ground antenna id", "ID антенны ЗС"),
  id("groundstation.pass.id", "Satellite pass id", "ID сеанса связи"),
  q("groundstation.antenna.azimuth", "deg", "Antenna azimuth", "Азимут антенны"),
  q("groundstation.antenna.elevation", "deg", "Antenna elevation", "Угол места антенны"),
  q("groundstation.link.ebn0", "dB", "Eb/N0", "Eb/N0"),
  q("groundstation.link.esno", "dB", "Es/N0", "Es/N0"),
  q("groundstation.link.ber", "-", "Ground link BER", "BER наземной линии"),
  q("groundstation.rf.power", "W", "Uplink RF power", "Мощность аплинка"),
  q("groundstation.rain.attenuation", "dB", "Rain attenuation", "Дождевое затухание"),
  enu("groundstation.pass.state", ["scheduled", "tracking", "lost_lock", "complete", "failed"], "Pass state", "Состояние сеанса"),
]);

write("layer-b-meddevice.json", [
  id("meddevice.device.id", "Medical device id", "ID медоборудования"),
  id("meddevice.patient.id", "Med device patient id", "ID пациента (устройство)", { sensitivity: "restricted" }),
  q("meddevice.infusion.rate", "mL/h", "Infusion rate", "Скорость инфузии", { sensitivity: "personal" }),
  q("meddevice.infusion.vtbi", "mL", "Volume to be infused", "Объём к введению", { sensitivity: "personal" }),
  q("meddevice.ventilator.fio2", "%", "Ventilator FiO2", "FiO2 ИВЛ", { sensitivity: "personal", range: { min: 21, max: 100 } }),
  q("meddevice.ventilator.peep", "cm[H2O]", "Ventilator PEEP", "ПДКВ", { sensitivity: "personal" }),
  q("meddevice.ventilator.tidal_volume", "mL", "Tidal volume", "Дыхательный объём", { sensitivity: "personal" }),
  q("meddevice.monitor.hr", "/min", "Patient monitor HR", "ЧСС монитора", { sensitivity: "personal" }),
  q("meddevice.monitor.spo2", "%", "Patient monitor SpO2", "SpO2 монитора", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  q("meddevice.defib.energy", "J", "Defibrillator energy", "Энергия дефибриллятора"),
  logical("meddevice.alarm.active", "Medical device alarm", "Тревога медоборудования"),
  enu("meddevice.ventilator.mode", ["vc", "pc", "ps", "simv", "cpap", "other"], "Ventilator mode", "Режим ИВЛ"),
]);

write("layer-b-biotech.json", [
  id("biotech.bioreactor.id", "Bioreactor id", "ID биореактора"),
  id("biotech.batch.id", "Biotech batch id", "ID биотех-партии"),
  q("biotech.bioreactor.temperature", "Cel", "Bioreactor temperature", "Температура биореактора"),
  q("biotech.bioreactor.do", "%", "Bioreactor DO", "РК биореактора", { range: { min: 0, max: 100 } }),
  q("biotech.bioreactor.ph", "-", "Bioreactor pH", "pH биореактора", { range: { min: 0, max: 14 } }),
  q("biotech.bioreactor.agitation", "/min", "Bioreactor agitation", "Перемешивание биореактора"),
  q("biotech.bioreactor.od", "-", "Optical density", "Оптическая плотность"),
  q("biotech.bioreactor.viable_cells", "/mL", "Viable cell density", "Концентрация живых клеток"),
  q("biotech.sequencer.cycles", "-", "Sequencer cycles", "Циклы секвенатора", { encodings: ["i32"] }),
  q("biotech.pcr.temperature", "Cel", "PCR block temperature", "Температура блока ПЦР"),
  enu("biotech.run.state", ["setup", "inoculation", "growth", "harvest", "cip", "fault"], "Biotech run state", "Состояние биотех-процесса"),
]);

write("layer-b-pharma_mfg.json", [
  id("pharma_mfg.batch.id", "Pharma manufacturing batch", "ID фармпартии"),
  id("pharma_mfg.equipment.id", "Pharma equipment id", "ID фармоборудования"),
  q("pharma_mfg.granulator.speed", "/min", "Granulator speed", "Скорость гранулятора"),
  q("pharma_mfg.tablet.press_force", "kN", "Tablet press force", "Усилие таблетпресса"),
  q("pharma_mfg.tablet.hardness", "N", "Tablet hardness", "Твёрдость таблетки"),
  q("pharma_mfg.tablet.weight", "mg", "Tablet weight", "Масса таблетки"),
  q("pharma_mfg.coating.drum_temp", "Cel", "Coating drum temperature", "Температура дражировочного барабана"),
  q("pharma_mfg.lyophilizer.shelf_temp", "Cel", "Lyophilizer shelf temp", "Температура полки лиофилизатора"),
  q("pharma_mfg.lyophilizer.chamber_pressure", "Pa", "Lyophilizer pressure", "Давление лиофилизатора"),
  q("pharma_mfg.isolator.pressure", "Pa", "Isolator pressure", "Давление изолятора"),
  logical("pharma_mfg.cleanroom.door_interlock", "Cleanroom door interlock", "Блокировка двери чистой зоны"),
  enu("pharma_mfg.batch.state", ["dispensing", "granulation", "compression", "coating", "packaging", "released", "rejected"], "Pharma batch state", "Состояние фармпартии"),
]);

write("layer-b-pcb.json", [
  id("pcb.line.id", "SMT line id", "ID линии SMT"),
  id("pcb.board.id", "PCB board id", "ID платы"),
  q("pcb.reflow.zone1_temp", "Cel", "Reflow zone 1 temp", "Температура зоны 1 пайки"),
  q("pcb.reflow.zone2_temp", "Cel", "Reflow zone 2 temp", "Температура зоны 2 пайки"),
  q("pcb.reflow.zone3_temp", "Cel", "Reflow zone 3 temp", "Температура зоны 3 пайки"),
  q("pcb.placer.ppm", "-", "Placement PPM", "PPM установки компонентов"),
  q("pcb.aoi.defect_count", "-", "AOI defect count", "Дефекты АОИ", { encodings: ["i32"] }),
  q("pcb.spi.volume", "%", "Solder paste volume", "Объём пасты", { range: { min: 0, max: 200 } }),
  q("pcb.ict.yield", "%", "ICT yield", "Выход годных ICT", { range: { min: 0, max: 100 } }),
  enu("pcb.board.state", ["bare", "smt", "reflow", "aoi", "ict", "pass", "fail"], "PCB board state", "Состояние платы"),
]);

write("layer-b-plastics.json", [
  id("plastics.machine.id", "Injection molding machine id", "ID ТПА"),
  q("plastics.barrel.temperature", "Cel", "Barrel temperature", "Температура цилиндра"),
  q("plastics.mold.temperature", "Cel", "Mold temperature", "Температура формы"),
  q("plastics.injection.pressure", "Pa", "Injection pressure", "Давление впрыска"),
  q("plastics.injection.speed", "mm/s", "Injection speed", "Скорость впрыска"),
  q("plastics.cycle.time", "s", "Cycle time plastics", "Время цикла ТПА"),
  q("plastics.clamp.force", "kN", "Clamp force", "Усилие смыкания"),
  q("plastics.shot.weight", "g", "Shot weight", "Масса впрыска"),
  enu("plastics.machine.state", ["idle", "heating", "cycling", "alarm", "maintenance"], "IMM state", "Состояние ТПА"),
]);

write("layer-b-glass.json", [
  q("glass.furnace.temperature", "Cel", "Glass furnace temperature", "Температура стекловаренной печи"),
  q("glass.forehearth.temperature", "Cel", "Forehearth temperature", "Температура питателя"),
  q("glass.lehr.temperature", "Cel", "Lehr temperature", "Температура отжига"),
  q("glass.forming.speed", "/min", "Forming speed", "Скорость формования"),
  q("glass.bottle.weight", "g", "Bottle weight", "Масса бутылки"),
  q("glass.defect.count", "-", "Glass defect count", "Дефекты стекла", { encodings: ["i32"] }),
  q("glass.tin.bath_temp", "Cel", "Float tin bath temperature", "Температура оловянной ванны"),
  id("glass.line.id", "Glass line id", "ID линии стекла"),
  enu("glass.line.state", ["stop", "heatup", "production", "drain", "maintenance"], "Glass line state", "Состояние линии стекла"),
]);

write("layer-b-paper.json", [
  q("paper.machine.speed", "m/min", "Paper machine speed", "Скорость БДМ"),
  q("paper.basis.weight", "g/m2", "Basis weight", "Масса 1 м²"),
  q("paper.moisture", "%", "Paper moisture", "Влажность бумаги", { range: { min: 0, max: 100 } }),
  q("paper.calender.pressure", "kN/m", "Calender pressure", "Давление каландра"),
  q("paper.pulp.consistency", "%", "Pulp consistency", "Концентрация массы", { range: { min: 0, max: 20 } }),
  q("paper.pulp.freeness", "mL", "Pulp freeness CSF", "Степень помола"),
  q("paper.steam.pressure", "kPa", "Dryer steam pressure", "Давление пара сушки"),
  id("paper.reel.id", "Paper reel id", "ID тамбура"),
  enu("paper.machine.state", ["stop", "thread", "run", "broke", "maintenance"], "Paper machine state", "Состояние БДМ"),
]);

write("layer-b-desalination.json", [
  q("desalination.feed.salinity", "ppt", "Feed salinity", "Солёность исходной воды"),
  q("desalination.permeate.flow", "m3/h", "Permeate flow", "Расход пермеата"),
  q("desalination.permeate.salinity", "ppt", "Permeate salinity", "Солёность пермеата"),
  q("desalination.ro.pressure", "kPa", "RO pressure", "Давление ОО"),
  q("desalination.ro.recovery", "%", "RO recovery", "Выход пермеата", { range: { min: 0, max: 100 } }),
  q("desalination.energy.sec", "kWh/m3", "Specific energy consumption", "Удельное энергопотребление"),
  q("desalination.antiscalant.dose", "mg/L", "Antiscalant dose", "Доза антискаланта"),
  id("desalination.plant.id", "Desalination plant id", "ID опреснителя"),
  enu("desalination.plant.state", ["stop", "start", "produce", "cip", "fault"], "Desalination state", "Состояние опреснения"),
]);

write("layer-b-ccs.json", [
  q("ccs.capture.rate", "t/d", "CO2 capture rate", "Скорость улавливания CO2"),
  q("ccs.capture.efficiency", "%", "Capture efficiency", "Эффективность улавливания", { range: { min: 0, max: 100 } }),
  q("ccs.absorber.temperature", "Cel", "Absorber temperature", "Температура абсорбера"),
  q("ccs.stripper.temperature", "Cel", "Stripper temperature", "Температура десорбера"),
  q("ccs.pipeline.pressure", "Pa", "CO2 pipeline pressure", "Давление CO2-трубопровода"),
  q("ccs.pipeline.flow", "t/d", "CO2 pipeline flow", "Расход CO2-трубопровода"),
  q("ccs.storage.pressure", "Pa", "Storage reservoir pressure", "Давление пласта хранения"),
  q("ccs.monitoring.seepage", "t/d", "Seepage rate", "Утечка/просэчивание"),
  id("ccs.site.id", "CCS site id", "ID площадки CCS"),
  logical("ccs.leak.alarm", "CCS leak alarm", "Тревога утечки CCS"),
]);

write("layer-b-substation.json", [
  id("substation.id", "Substation id", "ID подстанции"),
  id("substation.bay.id", "Bay id", "ID ячейки"),
  q("substation.voltage.hv", "V", "HV bus voltage", "Напряжение ВН"),
  q("substation.voltage.mv", "V", "MV bus voltage", "Напряжение СН"),
  q("substation.current.feeder", "A", "Feeder current", "Ток фидера"),
  q("substation.transformer.oil_temp", "Cel", "Transformer oil temperature", "Температура масла трансформатора"),
  q("substation.transformer.load", "%", "Transformer load", "Нагрузка трансформатора", { range: { min: 0, max: 150 } }),
  q("substation.sf6.pressure", "kPa", "SF6 pressure", "Давление SF6"),
  q("substation.power.mw", "W", "Bay active power", "Активная мощность ячейки"),
  logical("substation.breaker.closed", "Breaker closed", "Выключатель включён"),
  logical("substation.trip", "Protection trip", "Срабатывание защиты"),
  enu("substation.breaker.state", ["open", "closed", "intermediate", "fault"], "Breaker state", "Состояние выключателя"),
]);

write("layer-b-microgrid.json", [
  id("microgrid.id", "Microgrid id", "ID микросети"),
  q("microgrid.load.power", "W", "Microgrid load", "Нагрузка микросети"),
  q("microgrid.generation.power", "W", "Microgrid generation", "Генерация микросети"),
  q("microgrid.storage.soc", "%", "Microgrid storage SoC", "Заряд накопителя микросети", { range: { min: 0, max: 100 } }),
  q("microgrid.storage.power", "W", "Microgrid storage power", "Мощность накопителя микросети"),
  q("microgrid.frequency", "Hz", "Microgrid frequency", "Частота микросети"),
  q("microgrid.voltage", "V", "Microgrid voltage", "Напряжение микросети"),
  logical("microgrid.islanded", "Islanded mode", "Островной режим"),
  enu("microgrid.mode", ["grid_tied", "island", "black_start", "fault"], "Microgrid mode", "Режим микросети"),
  cmd("microgrid.command", ["connect", "island", "shed_load", "charge", "discharge"], "Microgrid command", "Команда микросети"),
]);

write("layer-b-lng.json", [
  q("lng.tank.level", "%", "LNG tank level", "Уровень СПГ", { range: { min: 0, max: 100 } }),
  q("lng.tank.pressure", "Pa", "LNG tank pressure", "Давление СПГ-резервуара"),
  q("lng.tank.temperature", "Cel", "LNG tank temperature", "Температура СПГ"),
  q("lng.boiloff.rate", "kg/h", "Boil-off rate", "Скорость испарения"),
  q("lng.loading.rate", "m3/h", "LNG loading rate", "Скорость налива СПГ"),
  q("lng.regas.outlet_temp", "Cel", "Regas outlet temperature", "Температура на выходе регазификации"),
  q("lng.regas.flow", "m3/h", "Regas flow", "Расход регазификации"),
  logical("lng.gas_detect.alarm", "LNG gas detection alarm", "Газоанализатор СПГ"),
  id("lng.terminal.id", "LNG terminal id", "ID СПГ-терминала"),
  enu("lng.operation", ["idle", "loading", "unloading", "regas", "hold"], "LNG operation", "Операция СПГ"),
]);

write("layer-b-dairy.json", [
  id("dairy.cow.id", "Cow id", "ID коровы"),
  id("dairy.parlor.id", "Milking parlor id", "ID доильного зала"),
  q("dairy.milk.yield", "L", "Milk yield", "Надой"),
  q("dairy.milk.fat", "%", "Milk fat", "Жирность молока", { range: { min: 0, max: 10 } }),
  q("dairy.milk.protein", "%", "Milk protein", "Белок молока", { range: { min: 0, max: 10 } }),
  q("dairy.milk.temperature", "Cel", "Milk temperature", "Температура молока"),
  q("dairy.milk.scc", "/mL", "Somatic cell count", "Соматические клетки"),
  q("dairy.cow.activity", "-", "Cow activity", "Активность коровы"),
  q("dairy.cow.rumination", "min", "Rumination time", "Время жвачки"),
  logical("dairy.cow.in_heat", "Cow in heat", "Охота"),
  enu("dairy.milking.state", ["idle", "prep", "milking", "detach", "wash"], "Milking state", "Состояние доения"),
]);

write("layer-b-poultry.json", [
  id("poultry.house.id", "Poultry house id", "ID птичника"),
  q("poultry.house.temperature", "Cel", "Poultry house temperature", "Температура птичника"),
  q("poultry.house.humidity", "%", "Poultry house humidity", "Влажность птичника", { range: { min: 0, max: 100 } }),
  q("poultry.house.nh3", "ppm", "Poultry ammonia", "Аммиак в птичнике"),
  q("poultry.house.co2", "ppm", "Poultry CO2", "CO2 в птичнике"),
  q("poultry.feed.consumed", "kg", "Feed consumed poultry", "Расход корма"),
  q("poultry.water.consumed", "L", "Water consumed poultry", "Расход воды птицы"),
  q("poultry.bird.weight", "kg", "Bird weight", "Масса птицы"),
  q("poultry.mortality.count", "-", "Poultry mortality", "Падёж", { encodings: ["i32"] }),
  enu("poultry.ventilation.mode", ["min", "tunnel", "natural", "mixed"], "Ventilation mode poultry", "Режим вентиляции птичника"),
]);

write("layer-b-beekeeping.json", [
  id("beekeeping.hive.id", "Hive id", "ID улья"),
  q("beekeeping.hive.weight", "kg", "Hive weight", "Масса улья"),
  q("beekeeping.hive.temperature", "Cel", "Hive temperature", "Температура улья"),
  q("beekeeping.hive.humidity", "%", "Hive humidity", "Влажность улья", { range: { min: 0, max: 100 } }),
  q("beekeeping.hive.sound", "dB", "Hive acoustic level", "Акустика улья"),
  q("beekeeping.foraging.activity", "-", "Foraging activity", "Лётная активность"),
  logical("beekeeping.swarm.risk", "Swarm risk", "Риск роения"),
  logical("beekeeping.theft.alarm", "Hive theft alarm", "Тревога кражи улья"),
]);

write("layer-b-vertical_farm.json", [
  id("vertical_farm.rack.id", "Grow rack id", "ID стеллажа"),
  q("vertical_farm.light.ppfd", "umol/m2/s", "PPFD", "ППФП"),
  q("vertical_farm.light.photoperiod", "h", "Photoperiod", "Фотопериод"),
  q("vertical_farm.air.temperature", "Cel", "Vertical farm air temp", "Температура воздуха ВФ"),
  q("vertical_farm.air.humidity", "%", "Vertical farm humidity", "Влажность ВФ", { range: { min: 0, max: 100 } }),
  q("vertical_farm.air.co2", "ppm", "Vertical farm CO2", "CO2 ВФ"),
  q("vertical_farm.nutrient.ec", "uS/cm", "Nutrient EC", "ЭС раствора"),
  q("vertical_farm.nutrient.ph", "-", "Nutrient pH", "pH раствора", { range: { min: 0, max: 14 } }),
  q("vertical_farm.water.do", "mg/L", "Nutrient DO", "РК раствора"),
  q("vertical_farm.biomass.estimate", "kg", "Biomass estimate", "Оценка биомассы"),
  enu("vertical_farm.recipe.state", ["germination", "vegetative", "flowering", "harvest"], "Grow recipe stage", "Стадия рецепта выращивания"),
]);

write("layer-b-cryogenics.json", [
  q("cryogenics.cryostat.temperature", "K", "Cryostat temperature", "Температура криостата"),
  q("cryogenics.ln2.level", "%", "LN2 level", "Уровень жидкого азота", { range: { min: 0, max: 100 } }),
  q("cryogenics.lhe.level", "%", "LHe level", "Уровень жидкого гелия", { range: { min: 0, max: 100 } }),
  q("cryogenics.vacuum.pressure", "Pa", "Cryostat vacuum", "Вакуум криостата"),
  q("cryogenics.pulse_tube.power", "W", "Pulse tube power", "Мощность криокулера"),
  q("cryogenics.magnet.current", "A", "Magnet current", "Ток магнита"),
  q("cryogenics.magnet.field", "T", "Magnet field", "Поле магнита"),
  logical("cryogenics.quench.detect", "Magnet quench detected", "Квенч магнита"),
  id("cryogenics.system.id", "Cryogenic system id", "ID криосистемы"),
]);

write("layer-b-quantum.json", [
  id("quantum.device.id", "Quantum device id", "ID квантового устройства"),
  q("quantum.qubit.count", "-", "Qubit count", "Число кубитов", { encodings: ["i32"] }),
  q("quantum.qubit.t1", "s", "T1 coherence", "Время T1"),
  q("quantum.qubit.t2", "s", "T2 coherence", "Время T2"),
  q("quantum.fidelity.gate", "%", "Gate fidelity", "Верность гейта", { range: { min: 0, max: 100 } }),
  q("quantum.fidelity.readout", "%", "Readout fidelity", "Верность считывания", { range: { min: 0, max: 100 } }),
  q("quantum.cryo.temperature", "K", "Quantum fridge temperature", "Температура квантового холодильника"),
  q("quantum.job.queue_depth", "-", "Job queue depth", "Глубина очереди задач", { encodings: ["i32"] }),
  enu("quantum.job.state", ["queued", "calibrating", "running", "done", "failed"], "Quantum job state", "Состояние квантовой задачи"),
]);

write("layer-b-timebase.json", [
  id("timebase.source.id", "Time source id", "ID источника времени"),
  q("timebase.offset", "ns", "Time offset", "Смещение времени"),
  q("timebase.jitter", "ns", "Time jitter", "Джиттер времени"),
  q("timebase.allan_dev", "-", "Allan deviation", "Дисперсия Аллана"),
  q("timebase.gps.satellites", "-", "Timing GPS satellites", "Спутники для синхронизации", { encodings: ["u8"] }),
  logical("timebase.lock.ptp", "PTP locked", "PTP в захвате"),
  logical("timebase.lock.gnss", "GNSS time locked", "GNSS-время в захвате"),
  enu("timebase.source.type", ["gnss", "atomic", "ptp_gm", "ntp", "holdover"], "Time source type", "Тип источника времени"),
]);

write("layer-b-rf_test.json", [
  q("rf_test.frequency", "Hz", "RF test frequency", "Частота RF-теста"),
  q("rf_test.power", "dBm", "RF test power", "Мощность RF-теста"),
  q("rf_test.span", "Hz", "Spectrum span", "Полоса обзора"),
  q("rf_test.noise_floor", "dBm", "Noise floor", "Уровень шумов"),
  q("rf_test.vswr", "-", "Test VSWR", "КСВ (тест)"),
  q("rf_test.aclr", "dB", "ACLR", "ACLR"),
  q("rf_test.evm", "%", "EVM", "EVM", { range: { min: 0, max: 100 } }),
  id("rf_test.instrument.id", "RF instrument id", "ID RF-прибора"),
  enu("rf_test.result", ["pass", "fail", "marginal"], "RF test result", "Результат RF-теста"),
]);

write("layer-b-vision_inspect.json", [
  id("vision.camera.id", "Inspection camera id", "ID камеры контроля"),
  id("vision.recipe.id", "Vision recipe id", "ID рецепта зрения"),
  q("vision.defect.count", "-", "Vision defect count", "Дефекты зрения", { encodings: ["i32"] }),
  q("vision.cycle.time", "ms", "Vision cycle time", "Время цикла зрения"),
  q("vision.score.confidence", "%", "Detection confidence", "Уверенность детекции", { range: { min: 0, max: 100 } }),
  q("vision.exposure", "ms", "Camera exposure", "Экспозиция камеры"),
  logical("vision.trigger.active", "Vision trigger", "Триггер камеры"),
  enu("vision.result", ["pass", "fail", "rework", "no_read"], "Vision result", "Результат визуального контроля"),
  media("vision.image.ref", "Inspection image ref", "Снимок контроля"),
]);

write("layer-b-asrs.json", [
  id("asrs.crane.id", "ASRS crane id", "ID крана АСКС"),
  id("asrs.location.id", "ASRS location id", "ID ячейки АСКС"),
  q("asrs.crane.x", "m", "ASRS crane X", "Координата X крана"),
  q("asrs.crane.y", "m", "ASRS crane Y", "Координата Y крана"),
  q("asrs.crane.z", "m", "ASRS crane Z", "Координата Z крана"),
  q("asrs.throughput", "/h", "ASRS throughput", "Производительность АСКС"),
  q("asrs.utilization", "%", "ASRS utilization", "Загрузка АСКС", { range: { min: 0, max: 100 } }),
  enu("asrs.crane.state", ["idle", "moving", "picking", "placing", "fault"], "ASRS crane state", "Состояние крана АСКС"),
  cmd("asrs.command", ["store", "retrieve", "home", "stop"], "ASRS command", "Команда АСКС"),
]);

write("layer-b-fuel_station.json", [
  id("fuel_station.id", "Fuel station id", "ID АЗС"),
  id("fuel_station.pump.id", "Fuel pump id", "ID колонки"),
  q("fuel_station.dispensed.volume", "L", "Dispensed fuel volume", "Отпущено топлива"),
  q("fuel_station.tank.level", "%", "Station tank level", "Уровень резервуара АЗС", { range: { min: 0, max: 100 } }),
  q("fuel_station.tank.water", "mm", "Tank water bottom", "Вода на дне резервуара"),
  q("fuel_station.vapor.pressure", "Pa", "Vapor recovery pressure", "Давление УЛФ"),
  logical("fuel_station.leak.alarm", "UST leak alarm", "Тревога утечки УРТ"),
  enu("fuel_station.product", ["gasoline95", "gasoline98", "diesel", "lpg", "cng", "adblue", "other"], "Fuel product", "Вид топлива"),
  enu("fuel_station.pump.state", ["idle", "authorized", "fueling", "hanging", "fault", "locked"], "Pump state", "Состояние колонки"),
]);

write("layer-b-carwash.json", [
  id("carwash.bay.id", "Car wash bay id", "ID мойки"),
  q("carwash.water.flow", "L/min", "Wash water flow", "Расход воды мойки"),
  q("carwash.water.recycled", "%", "Recycled water share", "Доля оборотной воды", { range: { min: 0, max: 100 } }),
  q("carwash.chemical.dose", "mL", "Chemical dose", "Доза химии"),
  q("carwash.cycle.time", "s", "Wash cycle time", "Время цикла мойки"),
  q("carwash.brush.pressure", "N", "Brush pressure", "Прижим щёток"),
  enu("carwash.cycle.type", ["touchless", "brush", "premium", "express"], "Wash cycle type", "Тип мойки"),
  enu("carwash.state", ["idle", "occupied", "running", "rinse", "fault"], "Car wash state", "Состояние мойки"),
]);

write("layer-b-office.json", [
  id("office.room.id", "Office room id", "ID кабинета"),
  id("office.desk.id", "Desk id", "ID стола"),
  q("office.room.occupancy", "-", "Office occupancy", "Заполненность офиса", { encodings: ["i16"] }),
  q("office.desk.height", "mm", "Sit-stand desk height", "Высота стола"),
  q("office.co2", "ppm", "Office CO2", "CO2 офиса"),
  q("office.noise", "dB", "Office noise", "Шум офиса"),
  logical("office.meeting.in_progress", "Meeting in progress", "Совещание идёт"),
  logical("office.av.muted", "AV muted", "Звук AV выключен"),
  enu("office.room.type", ["open", "focus", "meeting", "phone", "lounge"], "Office room type", "Тип помещения"),
]);

write("layer-b-library.json", [
  id("library.item.id", "Library item id", "ID единицы хранения"),
  id("library.patron.id", "Patron id", "ID читателя", { sensitivity: "restricted" }),
  q("library.archive.temperature", "Cel", "Archive temperature", "Температура архива"),
  q("library.archive.humidity", "%", "Archive humidity", "Влажность архива", { range: { min: 0, max: 100 } }),
  logical("library.item.checked_out", "Item checked out", "Выдано"),
  logical("library.security.gate_alarm", "Library gate alarm", "Тревога ворот библиотеки"),
  q("library.visits.count", "-", "Library visits", "Посещения библиотеки", { encodings: ["i32"] }),
  enu("library.item.status", ["available", "loaned", "reserved", "repair", "lost"], "Library item status", "Статус единицы"),
]);

write("layer-b-studio.json", [
  id("studio.room.id", "Studio room id", "ID студии"),
  q("studio.audio.spl", "dB", "Studio SPL", "Уровень звука студии"),
  q("studio.mic.level", "dB", "Mic input level", "Уровень микрофона"),
  q("studio.headphones.impedance", "Ohm", "Headphone impedance", "Сопротивление наушников"),
  logical("studio.talkback.active", "Talkback active", "Служебная связь"),
  logical("studio.recording", "Recording active", "Идёт запись"),
  logical("studio.red_light", "Recording red light", "Красная лампа"),
  q("studio.session.timecode", "s", "Session timecode", "Таймкод сессии"),
  media("studio.take.ref", "Take media ref", "Ссылка на дубль"),
  enu("studio.session.state", ["idle", "rehearse", "record", "mix", "review"], "Studio session state", "Состояние студии"),
]);

write("layer-b-cinema.json", [
  id("cinema.screen.id", "Cinema screen id", "ID зала кинотеатра"),
  id("cinema.show.id", "Cinema show id", "ID сеанса"),
  q("cinema.projector.lamp_hours", "h", "Projector lamp hours", "Моточасы лампы проектора"),
  q("cinema.projector.light_output", "lm", "Projector light output", "Световой поток проектора"),
  q("cinema.audio.spl", "dB", "Cinema SPL", "Уровень звука кинозала"),
  q("cinema.occupancy", "%", "Cinema occupancy", "Заполненность зала", { range: { min: 0, max: 100 } }),
  logical("cinema.door.closed", "Auditorium door closed", "Двери зала закрыты"),
  enu("cinema.show.state", ["scheduled", "ads", "feature", "credits", "ended"], "Cinema show state", "Состояние сеанса"),
]);

write("layer-b-exoskeleton.json", [
  id("exoskeleton.device.id", "Exoskeleton id", "ID экзоскелета"),
  id("exoskeleton.user.id", "Exoskeleton user id", "ID пользователя экзоскелета", { sensitivity: "personal" }),
  q("exoskeleton.joint.torque", "N.m", "Assist torque", "Момент помощи"),
  q("exoskeleton.joint.angle", "deg", "Joint angle exo", "Угол сустава экзоскелета"),
  q("exoskeleton.battery.soc", "%", "Exoskeleton battery", "Заряд экзоскелета", { range: { min: 0, max: 100 } }),
  q("exoskeleton.steps", "-", "Exo step count", "Шаги экзоскелета", { encodings: ["i32"] }),
  logical("exoskeleton.assist.active", "Assist active", "Помощь активна"),
  enu("exoskeleton.mode", ["off", "walk", "lift", "sit", "fault"], "Exoskeleton mode", "Режим экзоскелета"),
]);

write("layer-b-hearing.json", [
  id("hearing.device.id", "Hearing aid id", "ID слухового аппарата"),
  id("hearing.user.id", "Hearing aid user id", "ID пользователя СА", { sensitivity: "personal" }),
  q("hearing.battery.soc", "%", "Hearing aid battery", "Заряд СА", { range: { min: 0, max: 100 } }),
  q("hearing.gain", "dB", "Hearing aid gain", "Усиление СА", { sensitivity: "personal" }),
  q("hearing.environment.spl", "dB", "Environment SPL hearing", "Уровень окружения (слух)"),
  enu("hearing.program", ["quiet", "speech", "noise", "music", "streaming"], "Hearing program", "Программа СА"),
  logical("hearing.streaming.active", "Audio streaming active", "Стриминг активен"),
]);

write("layer-b-wearable.json", [
  id("wearable.device.id", "Wearable device id", "ID носимого устройства"),
  q("wearable.battery.soc", "%", "Wearable battery", "Заряд носимого", { range: { min: 0, max: 100 } }),
  q("wearable.skin.temperature", "Cel", "Skin temperature", "Температура кожи", { sensitivity: "personal" }),
  q("wearable.eda", "uS", "Electrodermal activity", "КГР", { sensitivity: "personal" }),
  q("wearable.spo2", "%", "Wearable SpO2", "SpO2 носимого", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  q("wearable.steps", "-", "Wearable steps", "Шаги носимого", { encodings: ["i32"], sensitivity: "personal" }),
  logical("wearable.on_wrist", "On-wrist detected", "На запястье"),
  enu("wearable.type", ["watch", "ring", "band", "scarf", "patch", "glasses", "earbuds", "other"], "Wearable type", "Тип носимого"),
]);

console.log("Layer B5 seeds written");
