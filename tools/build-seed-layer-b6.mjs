#!/usr/bin/env node
/**
 * Layer B6 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B6", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-shipbuilding.json", [
  id("shipbuilding.hull.id", "Hull block id", "ID секции корпуса"),
  id("shipbuilding.yard.id", "Shipyard id", "ID верфи"),
  q("shipbuilding.welding.meters", "m", "Weld length completed", "Длина сваренных швов"),
  q("shipbuilding.block.weight", "t", "Hull block weight", "Масса секции"),
  q("shipbuilding.crane.load", "t", "Shipyard crane load", "Нагрузка крана верфи"),
  q("shipbuilding.drydock.water_level", "m", "Dry dock water level", "Уровень воды в доке"),
  q("shipbuilding.coating.thickness", "um", "Coating thickness", "Толщина покрытия"),
  logical("shipbuilding.nd_test.pass", "NDT pass", "НК пройден"),
  enu("shipbuilding.stage", ["steel_cut", "block_build", "erection", "outfitting", "launch", "trials"], "Shipbuilding stage", "Стадия постройки"),
]);

write("layer-b-aerospace_mfg.json", [
  id("aerospace_mfg.part.id", "Aerospace part id", "ID авиадетали"),
  id("aerospace_mfg.workorder.id", "Aerospace work order", "Наряд авиапроизводства"),
  q("aerospace_mfg.composite.cure_temp", "Cel", "Composite cure temperature", "Температура отверждения композита"),
  q("aerospace_mfg.composite.cure_pressure", "Pa", "Composite cure pressure", "Давление отверждения"),
  q("aerospace_mfg.rivet.count", "-", "Rivet count", "Число заклёпок", { encodings: ["i32"] }),
  q("aerospace_mfg.torque.applied", "N.m", "Installation torque", "Момент затяжки"),
  q("aerospace_mfg.fai.dimension", "mm", "FAI measured dimension", "Размер FAI"),
  logical("aerospace_mfg.fai.pass", "FAI pass", "FAI принят"),
  enu("aerospace_mfg.part.status", ["raw", "in_process", "inspect", "accepted", "rejected", "quarantine"], "Aerospace part status", "Статус авиадетали"),
]);

write("layer-b-tire_mfg.json", [
  id("tire_mfg.mold.id", "Tire mold id", "ID пресс-формы шины"),
  id("tire_mfg.batch.id", "Tire batch id", "ID партии шин"),
  q("tire_mfg.curing.temperature", "Cel", "Tire curing temperature", "Температура вулканизации"),
  q("tire_mfg.curing.pressure", "Pa", "Tire curing pressure", "Давление вулканизации"),
  q("tire_mfg.curing.time", "s", "Curing time", "Время вулканизации"),
  q("tire_mfg.uniformity.rfv", "N", "Radial force variation", "Радиальная сила RFV"),
  q("tire_mfg.balance.static", "g", "Static imbalance", "Статический дисбаланс"),
  q("tire_mfg.tread.depth", "mm", "Tread depth new", "Глубина протектора"),
  enu("tire_mfg.result", ["pass", "rework", "scrap"], "Tire inspection result", "Результат контроля шины"),
]);

write("layer-b-textile_apparel.json", [
  id("apparel.sku.id", "Apparel SKU id", "SKU одежды"),
  id("apparel.cut.lot_id", "Cut lot id", "ID раскройной партии"),
  q("apparel.sewing.spm", "/min", "Sewing stitches per minute", "Стежков в минуту"),
  q("apparel.fabric.usage", "m", "Fabric usage", "Расход ткани"),
  q("apparel.defect.count", "-", "Apparel defect count", "Дефекты одежды", { encodings: ["i32"] }),
  q("apparel.iron.temperature", "Cel", "Ironing temperature", "Температура утюжки"),
  logical("apparel.needle.broken", "Needle broken", "Сломана игла"),
  enu("apparel.line.state", ["idle", "cutting", "sewing", "finishing", "packing", "fault"], "Apparel line state", "Состояние швейной линии"),
]);

write("layer-b-leather.json", [
  q("leather.tannery.drum_temp", "Cel", "Tannery drum temperature", "Температура барабана"),
  q("leather.tannery.ph", "-", "Tannery bath pH", "pH дубильной ванны", { range: { min: 0, max: 14 } }),
  q("leather.thickness", "mm", "Leather thickness", "Толщина кожи"),
  q("leather.moisture", "%", "Leather moisture", "Влажность кожи", { range: { min: 0, max: 100 } }),
  q("leather.shrinkage", "%", "Leather shrinkage", "Усадка кожи", { range: { min: 0, max: 50 } }),
  id("leather.lot.id", "Leather lot id", "ID партии кожи"),
  enu("leather.process", ["beamhouse", "tanning", "retanning", "drying", "finishing"], "Leather process", "Стадия обработки кожи"),
]);

write("layer-b-ceramics.json", [
  q("ceramics.kiln.temperature", "Cel", "Ceramics kiln temperature", "Температура керамической печи"),
  q("ceramics.kiln.ramp", "Cel/h", "Kiln ramp rate", "Скорость нагрева печи"),
  q("ceramics.glaze.viscosity", "Pa.s", "Glaze viscosity", "Вязкость глазури"),
  q("ceramics.green.moisture", "%", "Green body moisture", "Влажность сырца", { range: { min: 0, max: 100 } }),
  q("ceramics.shrinkage", "%", "Firing shrinkage", "Усадка при обжиге", { range: { min: 0, max: 30 } }),
  q("ceramics.strength", "Pa", "Ceramic flexural strength", "Прочность керамики"),
  id("ceramics.kiln.id", "Ceramics kiln id", "ID керамической печи"),
  enu("ceramics.firing.state", ["load", "ramp", "soak", "cool", "unload", "fault"], "Firing state", "Состояние обжига"),
]);

write("layer-b-asphalt.json", [
  q("asphalt.plant.temp", "Cel", "Asphalt mix temperature", "Температура асфальтобетона"),
  q("asphalt.aggregate.moisture", "%", "Aggregate moisture", "Влажность щебня", { range: { min: 0, max: 20 } }),
  q("asphalt.bitumen.content", "%", "Bitumen content", "Содержание битума", { range: { min: 0, max: 15 } }),
  q("asphalt.paver.speed", "m/min", "Paver speed", "Скорость укладчика"),
  q("asphalt.compactor.passes", "-", "Compactor passes", "Проходы катка", { encodings: ["i16"] }),
  q("asphalt.mat.density", "%", "Mat density", "Плотность покрытия", { range: { min: 0, max: 100 } }),
  id("asphalt.plant.id", "Asphalt plant id", "ID АБЗ"),
  enu("asphalt.job.state", ["idle", "mixing", "hauling", "paving", "compacting", "done"], "Asphalt job state", "Состояние укладки"),
]);

write("layer-b-prefab.json", [
  id("prefab.module.id", "Prefab module id", "ID модульной секции"),
  id("prefab.project.id", "Prefab project id", "ID модульного проекта"),
  q("prefab.concrete.strength", "Pa", "Prefab concrete strength", "Прочность бетона модуля"),
  q("prefab.module.weight", "t", "Module weight", "Масса модуля"),
  q("prefab.tolerance.deviation", "mm", "Dimensional deviation", "Отклонение размеров"),
  logical("prefab.qa.pass", "Prefab QA pass", "ОТК модуля пройден"),
  enu("prefab.module.status", ["cast", "cure", "finish", "ship", "install", "hold"], "Prefab module status", "Статус модуля"),
]);

write("layer-b-tunnel.json", [
  id("tunnel.id", "Tunnel id", "ID тоннеля"),
  id("tunnel.tbm.id", "TBM id", "ID ТПМК"),
  q("tunnel.tbm.advance", "mm", "TBM advance", "Продвижение ТПМК"),
  q("tunnel.tbm.thrust", "kN", "TBM thrust", "Усилие щита"),
  q("tunnel.tbm.face_pressure", "Pa", "Face pressure", "Давление призабойной зоны"),
  q("tunnel.gas.ch4", "ppm", "Tunnel methane", "Метан в тоннеле"),
  q("tunnel.gas.co", "ppm", "Tunnel CO", "CO в тоннеле"),
  q("tunnel.airflow", "m3/s", "Tunnel airflow", "Вентиляция тоннеля"),
  q("tunnel.convergence", "mm", "Tunnel convergence", "Конвергенция тоннеля"),
  logical("tunnel.fire.alarm", "Tunnel fire alarm", "Пожар в тоннеле"),
  enu("tunnel.tbm.state", ["idle", "boring", "ring_build", "maintenance", "fault"], "TBM state", "Состояние ТПМК"),
]);

write("layer-b-dam.json", [
  id("dam.id", "Dam id", "ID плотины"),
  q("dam.reservoir.level", "m", "Reservoir level dam", "Уровень водохранилища"),
  q("dam.reservoir.volume", "m3", "Reservoir volume dam", "Объём водохранилища"),
  q("dam.seepage.flow", "L/s", "Seepage flow", "Фильтрационный расход"),
  q("dam.piezometer.level", "m", "Piezometer level", "Уровень пьезометра"),
  q("dam.displacement", "mm", "Dam crest displacement", "Смещение гребня"),
  q("dam.spillway.gate_opening", "%", "Spillway gate opening", "Открытие водосброса", { range: { min: 0, max: 100 } }),
  q("dam.turbine.power", "W", "Dam turbine power", "Мощность турбины ГЭС"),
  logical("dam.alert.seepage", "Seepage alert", "Тревога фильтрации"),
  enu("dam.gate.state", ["closed", "partly_open", "open", "fault"], "Dam gate state", "Состояние затвора"),
]);

write("layer-b-flood.json", [
  id("flood.gauge.id", "Flood gauge id", "ID гидропоста"),
  q("flood.water.level", "m", "Flood water level", "Уровень паводка"),
  q("flood.water.rise_rate", "m/h", "Water rise rate", "Скорость подъёма воды"),
  q("flood.discharge", "m3/s", "River discharge", "Расход реки"),
  q("flood.rainfall.basin", "mm", "Basin rainfall", "Осадки по бассейну"),
  logical("flood.alert.active", "Flood alert active", "Паводковая тревога"),
  enu("flood.alert.level", ["normal", "watch", "warning", "severe"], "Flood alert level", "Уровень паводковой опасности"),
  media("flood.camera.ref", "Flood camera ref", "Камера паводка"),
]);

write("layer-b-landslide.json", [
  id("landslide.site.id", "Landslide site id", "ID оползневого участка"),
  q("landslide.displacement", "mm", "Landslide displacement", "Смещение оползня"),
  q("landslide.velocity", "mm/d", "Landslide velocity", "Скорость оползня"),
  q("landslide.soil.moisture", "%", "Slope soil moisture", "Влажность склона", { range: { min: 0, max: 100 } }),
  q("landslide.pore.pressure", "Pa", "Pore water pressure", "Поровое давление"),
  q("landslide.inclinometer.tilt", "deg", "Inclinometer tilt", "Наклон инклинометра"),
  logical("landslide.alert.active", "Landslide alert", "Оползневая тревога"),
  enu("landslide.risk", ["low", "moderate", "high", "critical"], "Landslide risk", "Риск оползня"),
]);

write("layer-b-avalanche.json", [
  id("avalanche.zone.id", "Avalanche zone id", "ID лавиноопасной зоны"),
  q("avalanche.snow.depth", "cm", "Avalanche snow depth", "Высота снега (лавины)"),
  q("avalanche.snow.temp", "Cel", "Snowpack temperature", "Температура снежного покрова"),
  q("avalanche.wind.loading", "m/s", "Wind loading", "Ветровая нагрузка на склон"),
  q("avalanche.stability.index", "-", "Snow stability index", "Индекс стабильности снега"),
  logical("avalanche.alert.active", "Avalanche alert", "Лавинная тревога"),
  enu("avalanche.danger", ["1", "2", "3", "4", "5"], "Avalanche danger level", "Уровень лавинной опасности"),
  cmd("avalanche.control", ["close_road", "open_road", "blast", "hold"], "Avalanche control command", "Команда лавинной службы"),
]);

write("layer-b-air_quality_net.json", [
  id("air_quality.station.id", "AQ station id", "ID станции воздуха"),
  q("air_quality.pm25", "ug/m3", "Network PM2.5", "PM2.5 сети"),
  q("air_quality.pm10", "ug/m3", "Network PM10", "PM10 сети"),
  q("air_quality.no2", "ug/m3", "Network NO2", "NO2 сети"),
  q("air_quality.o3", "ug/m3", "Network O3", "O3 сети"),
  q("air_quality.so2", "ug/m3", "Network SO2", "SO2 сети"),
  q("air_quality.co", "mg/m3", "Network CO", "CO сети"),
  q("air_quality.aqi", "-", "Network AQI", "AQI сети", { encodings: ["u8", "f32"] }),
  q("air_quality.pollen.index", "-", "Pollen index", "Индекс пыльцы"),
  enu("air_quality.category", ["good", "moderate", "unhealthy_sensitive", "unhealthy", "very_unhealthy", "hazardous"], "AQ category", "Категория качества воздуха"),
]);

write("layer-b-radar_meteo.json", [
  id("radar_meteo.id", "Weather radar id", "ID метеорадара"),
  q("radar_meteo.reflectivity", "dBZ", "Radar reflectivity", "Отражаемость радара"),
  q("radar_meteo.velocity", "m/s", "Doppler velocity", "Доплеровская скорость"),
  q("radar_meteo.echo.top", "km", "Echo top height", "Верхняя граница эха"),
  q("radar_meteo.precip.rate", "mm/h", "Radar precip rate", "Осадки по радару"),
  q("radar_meteo.scan.elevation", "deg", "Scan elevation", "Угол сканирования"),
  logical("radar_meteo.severe.detected", "Severe weather detected", "Опасные явления обнаружены"),
  media("radar_meteo.image.ref", "Radar image ref", "Карта радара"),
  enu("radar_meteo.product", ["z", "v", "width", "dual_pol", "composite"], "Radar product", "Продукт радара"),
]);

write("layer-b-atc.json", [
  id("atc.sector.id", "ATC sector id", "ID сектора УВД"),
  id("atc.flight.id", "ATC flight id", "ID рейса УВД"),
  q("atc.aircraft.count", "-", "Aircraft in sector", "ВС в секторе", { encodings: ["i16"] }),
  q("atc.separation.min", "m", "Minimum separation", "Минимальное эшелонирование"),
  q("atc.workload.index", "-", "Controller workload", "Нагрузка диспетчера"),
  logical("atc.alert.conflict", "Conflict alert", "Конфликт траекторий"),
  logical("atc.alert.msaW", "MSA warning", "Предупреждение MSAW"),
  enu("atc.flight.phase", ["depart", "climb", "cruise", "descent", "approach", "land"], "ATC flight phase", "Фаза полёта УВД"),
]);

write("layer-b-sonar_nav.json", [
  q("sonar.depth.below_keel", "m", "Depth below keel", "Глубина под килем"),
  q("sonar.active.range", "m", "Active sonar range", "Дальность активного сонара"),
  q("sonar.frequency", "Hz", "Sonar frequency", "Частота сонара"),
  q("sonar.noise.ambient", "dB", "Ambient noise level", "Уровень окружающего шума"),
  q("hydrophone.spl", "dB", "Hydrophone SPL", "Уровень на гидрофоне"),
  id("sonar.system.id", "Sonar system id", "ID сонарной системы"),
  enu("sonar.mode", ["passive", "active", "imaging", "obstacle"], "Sonar mode", "Режим сонара"),
]);

write("layer-b-satellite_eo.json", [
  id("satellite_eo.scene.id", "EO scene id", "ID сцены ДЗЗ"),
  id("satellite_eo.sensor.id", "EO sensor id", "ID сенсора ДЗЗ"),
  q("satellite_eo.cloud.cover", "%", "Scene cloud cover", "Облачность сцены", { range: { min: 0, max: 100 } }),
  q("satellite_eo.resolution", "m", "Ground sample distance", "Пространственное разрешение"),
  q("satellite_eo.ndvi.mean", "-", "Scene mean NDVI", "Средний NDVI сцены"),
  q("satellite_eo.off_nadir", "deg", "Off-nadir angle", "Угол от надира"),
  q("satellite_eo.sun.elevation", "deg", "Sun elevation", "Высота Солнца"),
  media("satellite_eo.product.ref", "EO product ref", "Продукт ДЗЗ"),
  enu("satellite_eo.product.type", ["optical", "sar", "thermal", "hyperspectral", "other"], "EO product type", "Тип продукта ДЗЗ"),
]);

write("layer-b-fusion.json", [
  id("fusion.device.id", "Fusion device id", "ID термоядерной установки"),
  q("fusion.plasma.current", "A", "Plasma current", "Ток плазмы"),
  q("fusion.plasma.density", "/m3", "Plasma density", "Плотность плазмы"),
  q("fusion.plasma.temperature", "keV", "Plasma temperature", "Температура плазмы"),
  q("fusion.magnetic.field", "T", "Toroidal field", "Тороидальное поле"),
  q("fusion.nbi.power", "W", "NBI power", "Мощность ИНБ"),
  q("fusion.ecrh.power", "W", "ECRH power", "Мощность ЭЦРН"),
  q("fusion.divertor.temperature", "Cel", "Divertor temperature", "Температура дивертора"),
  logical("fusion.disruption", "Disruption detected", "Срыв плазмы"),
  enu("fusion.shot.state", ["idle", "prep", "pulse", "rampdown", "fault"], "Fusion shot state", "Состояние импульса"),
]);

write("layer-b-accelerator.json", [
  id("accelerator.facility.id", "Accelerator facility id", "ID ускорителя"),
  q("accelerator.beam.energy", "MeV", "Beam energy", "Энергия пучка"),
  q("accelerator.beam.current", "A", "Beam current", "Ток пучка"),
  q("accelerator.beam.emittance", "m.rad", "Beam emittance", "Эмиттанс пучка"),
  q("accelerator.rf.power", "W", "Accelerating RF power", "РЧ мощность ускорения"),
  q("accelerator.vacuum.pressure", "Pa", "Beamline vacuum", "Вакуум канала"),
  q("accelerator.magnet.current", "A", "Magnet current accel", "Ток магнита ускорителя"),
  logical("accelerator.interlock.trip", "Accelerator interlock trip", "Блокировка ускорителя"),
  enu("accelerator.state", ["off", "warmup", "standby", "beam", "fault"], "Accelerator state", "Состояние ускорителя"),
]);

write("layer-b-dialysis.json", [
  id("dialysis.machine.id", "Dialysis machine id", "ID аппарата диализа"),
  id("dialysis.patient.id", "Dialysis patient id", "ID пациента диализа", { sensitivity: "restricted" }),
  q("dialysis.blood.flow", "mL/min", "Blood flow rate", "Скорость кровотока", { sensitivity: "personal" }),
  q("dialysis.dialysate.flow", "mL/min", "Dialysate flow", "Скорость диализата"),
  q("dialysis.uf.rate", "mL/h", "Ultrafiltration rate", "Скорость ультрафильтрации", { sensitivity: "personal" }),
  q("dialysis.uf.goal", "mL", "UF goal", "Цель ультрафильтрации", { sensitivity: "personal" }),
  q("dialysis.venous.pressure", "mm[Hg]", "Venous pressure", "Венозное давление", { sensitivity: "personal" }),
  q("dialysis.conductivity", "mS/cm", "Dialysate conductivity", "Проводимость диализата"),
  logical("dialysis.alarm.active", "Dialysis alarm", "Тревога диализа"),
  enu("dialysis.session.state", ["prep", "prime", "treatment", "rinseback", "done", "fault"], "Dialysis session state", "Состояние сеанса диализа"),
]);

write("layer-b-anesthesia.json", [
  id("anesthesia.machine.id", "Anesthesia machine id", "ID наркозного аппарата"),
  id("anesthesia.case.id", "Anesthesia case id", "ID анестезии", { sensitivity: "restricted" }),
  q("anesthesia.o2.fraction", "%", "Inspired O2 fraction", "Доля O2", { range: { min: 0, max: 100 } }),
  q("anesthesia.agent.et", "%", "End-tidal agent", "Конечно-экспираторная концентрация агента", { sensitivity: "personal" }),
  q("anesthesia.n2o.fraction", "%", "N2O fraction", "Доля N2O", { range: { min: 0, max: 80 } }),
  q("anesthesia.fresh_gas.flow", "L/min", "Fresh gas flow", "Поток свежего газа"),
  q("anesthesia.airway.pressure", "cm[H2O]", "Airway pressure", "Давление в дыхательных путях", { sensitivity: "personal" }),
  logical("anesthesia.alarm.apnea", "Apnea alarm", "Тревога апноэ"),
  enu("anesthesia.mode", ["manual", "volume", "pressure", "spontaneous"], "Anesthesia vent mode", "Режим вентиляции наркоза"),
]);

write("layer-b-bloodbank.json", [
  id("bloodbank.unit.id", "Blood unit id", "ID дозы крови", { sensitivity: "restricted" }),
  id("bloodbank.donor.id", "Donor id", "ID донора", { sensitivity: "restricted" }),
  enu("bloodbank.product", ["rbc", "plasma", "platelets", "whole", "cryo"], "Blood product", "Компонент крови"),
  enu("bloodbank.abo", ["a", "b", "ab", "o"], "ABO group", "Группа крови ABO", { sensitivity: "personal" }),
  enu("bloodbank.rh", ["pos", "neg"], "Rh factor", "Резус", { sensitivity: "personal" }),
  q("bloodbank.storage.temperature", "Cel", "Blood storage temperature", "Температура хранения крови"),
  logical("bloodbank.coldchain.ok", "Blood cold chain OK", "Холодовая цепь крови OK"),
  enu("bloodbank.unit.status", ["available", "reserved", "issued", "transfused", "discarded", "quarantine"], "Blood unit status", "Статус дозы"),
]);

write("layer-b-ophthalmology.json", [
  id("ophthalmology.device.id", "Ophthalmology device id", "ID офтальмологического аппарата"),
  id("ophthalmology.patient.id", "Ophtho patient id", "ID пациента офтальмологии", { sensitivity: "restricted" }),
  q("ophthalmology.iop", "mm[Hg]", "Intraocular pressure", "Внутриглазное давление", { sensitivity: "personal" }),
  q("ophthalmology.axial.length", "mm", "Axial length", "Осевая длина глаза", { sensitivity: "personal" }),
  q("ophthalmology.refraction.sphere", "D", "Sphere refraction", "Сфера рефракции", { sensitivity: "personal" }),
  q("ophthalmology.refraction.cylinder", "D", "Cylinder refraction", "Цилиндр рефракции", { sensitivity: "personal" }),
  q("ophthalmology.oct.thickness", "um", "Retinal thickness", "Толщина сетчатки", { sensitivity: "personal" }),
  media("ophthalmology.image.ref", "Ocular image ref", "Снимок глаза"),
  enu("ophthalmology.eye", ["od", "os", "ou"], "Eye laterality", "Глаз"),
]);

write("layer-b-audiology.json", [
  id("audiology.device.id", "Audiometer id", "ID аудиометра"),
  id("audiology.patient.id", "Audiology patient id", "ID пациента сурдологии", { sensitivity: "restricted" }),
  q("audiology.threshold.250", "dB", "Hearing threshold 250Hz", "Порог 250 Гц", { sensitivity: "personal" }),
  q("audiology.threshold.1000", "dB", "Hearing threshold 1kHz", "Порог 1 кГц", { sensitivity: "personal" }),
  q("audiology.threshold.4000", "dB", "Hearing threshold 4kHz", "Порог 4 кГц", { sensitivity: "personal" }),
  q("audiology.tympanometry.pressure", "daPa", "Tympanometric pressure", "Давление тимпанометрии", { sensitivity: "personal" }),
  enu("audiology.ear", ["left", "right", "both"], "Test ear", "Ухо тестирования"),
  media("audiology.audiogram.ref", "Audiogram ref", "Аудиограмма"),
]);

write("layer-b-sleep_lab.json", [
  id("sleep_lab.study.id", "Sleep study id", "ID исследования сна", { sensitivity: "restricted" }),
  id("sleep_lab.patient.id", "Sleep lab patient id", "ID пациента сомнологии", { sensitivity: "restricted" }),
  q("sleep_lab.ahi", "/h", "Apnea-hypopnea index", "Индекс апноэ-гипопноэ", { sensitivity: "personal" }),
  q("sleep_lab.spo2.min", "%", "Min SpO2 sleep", "Мин. SpO2 сна", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  q("sleep_lab.sleep.efficiency", "%", "Sleep efficiency", "Эффективность сна", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  q("sleep_lab.cpap.pressure", "cm[H2O]", "CPAP pressure", "Давление CPAP", { sensitivity: "personal" }),
  enu("sleep_lab.stage", ["wake", "n1", "n2", "n3", "rem"], "Scored sleep stage", "Стадия сна (скоринг)", { sensitivity: "personal" }),
  media("sleep_lab.psg.ref", "PSG recording ref", "Запись ПСГ"),
]);

write("layer-b-pathology.json", [
  id("pathology.case.id", "Pathology case id", "ID патологоанатомического случая", { sensitivity: "restricted" }),
  id("pathology.specimen.id", "Specimen id", "ID биоматериала", { sensitivity: "restricted" }),
  q("pathology.slide.count", "-", "Slide count", "Число стёкол", { encodings: ["i16"] }),
  q("pathology.stainer.temperature", "Cel", "Stainer temperature", "Температура стейнера"),
  logical("pathology.cassette.tracked", "Cassette tracked", "Кассета учтена"),
  enu("pathology.case.status", ["accession", "gross", "processing", "staining", "signout", "amended"], "Pathology case status", "Статус случая"),
  media("pathology.wsi.ref", "Whole slide image ref", "Цифровой слайд"),
]);

write("layer-b-genomics.json", [
  id("genomics.run.id", "Sequencing run id", "ID прогона секвенирования"),
  id("genomics.sample.id", "Genomics sample id", "ID геномного образца", { sensitivity: "restricted" }),
  q("genomics.cluster.density", "/mm2", "Cluster density", "Плотность кластеров"),
  q("genomics.q30", "%", "Percent Q30", "Доля Q30", { range: { min: 0, max: 100 } }),
  q("genomics.yield.gb", "Gigabase", "Yield gigabases", "Выход гигабаз"),
  q("genomics.error.rate", "%", "Error rate", "Частота ошибок", { range: { min: 0, max: 100 } }),
  enu("genomics.run.state", ["loading", "sequencing", "wash", "complete", "failed"], "Sequencing run state", "Состояние прогона"),
  media("genomics.fastq.ref", "FASTQ ref", "Ссылка FASTQ"),
]);

write("layer-b-biobank.json", [
  id("biobank.sample.id", "Biobank sample id", "ID образца биобанка", { sensitivity: "restricted" }),
  id("biobank.freezer.id", "Biobank freezer id", "ID морозильника биобанка"),
  q("biobank.storage.temperature", "Cel", "Biobank storage temperature", "Температура хранения биобанка"),
  q("biobank.freeze.thaw_count", "-", "Freeze-thaw cycles", "Циклы заморозки-оттаивания", { encodings: ["u8"] }),
  logical("biobank.consent.valid", "Consent valid", "Согласие действительно", { sensitivity: "restricted" }),
  enu("biobank.sample.type", ["blood", "plasma", "serum", "dna", "rna", "tissue", "other"], "Biobank sample type", "Тип образца биобанка"),
  enu("biobank.sample.status", ["available", "reserved", "issued", "depleted", "destroyed"], "Biobank sample status", "Статус образца биобанка"),
]);

write("layer-b-ridehail.json", [
  id("ridehail.trip.id", "Ridehail trip id", "ID поездки"),
  id("ridehail.driver.id", "Ridehail driver id", "ID водителя", { sensitivity: "restricted" }),
  id("ridehail.rider.id", "Rider id", "ID пассажира", { sensitivity: "restricted" }),
  q("ridehail.eta.pickup", "s", "Pickup ETA", "ETA подачи"),
  q("ridehail.fare.amount", "-", "Fare amount", "Стоимость поездки", { encodings: ["f64"] }),
  q("ridehail.trip.distance", "km", "Trip distance ridehail", "Дистанция поездки"),
  q("ridehail.rating", "-", "Trip rating", "Оценка поездки", { range: { min: 1, max: 5 } }),
  enu("ridehail.trip.status", ["requested", "accepted", "arriving", "in_trip", "completed", "cancelled"], "Ridehail trip status", "Статус поездки"),
  logical("ridehail.safety.share", "Trip share active", "Поделиться поездкой"),
]);

write("layer-b-delivery_robot.json", [
  id("delivery_robot.id", "Delivery robot id", "ID робота-доставщика"),
  id("delivery_robot.order.id", "Delivery order id", "ID заказа доставки"),
  q("delivery_robot.battery.soc", "%", "Delivery robot battery", "Заряд робота-доставщика", { range: { min: 0, max: 100 } }),
  q("delivery_robot.speed", "m/s", "Delivery robot speed", "Скорость робота-доставщика"),
  q("delivery_robot.cargo.weight", "kg", "Cargo weight robot", "Масса груза робота"),
  logical("delivery_robot.compartment.open", "Compartment open", "Отсек открыт"),
  logical("delivery_robot.obstacle", "Obstacle ahead robot", "Препятствие перед роботом"),
  enu("delivery_robot.state", ["idle", "to_pickup", "to_dropoff", "waiting", "returning", "fault"], "Delivery robot state", "Состояние робота-доставщика"),
  cmd("delivery_robot.command", ["start", "pause", "open", "return", "abort"], "Delivery robot command", "Команда робота-доставщика"),
]);

write("layer-b-ferry.json", [
  id("ferry.vessel.id", "Ferry vessel id", "ID парома"),
  id("ferry.route.id", "Ferry route id", "ID паромной линии"),
  q("ferry.passengers.count", "-", "Ferry passengers", "Пассажиры парома", { encodings: ["i16"] }),
  q("ferry.vehicles.count", "-", "Vehicles on ferry", "ТС на пароме", { encodings: ["i16"] }),
  q("ferry.speed", "kn", "Ferry speed", "Скорость парома"),
  q("ferry.gate.queue", "-", "Ferry gate queue", "Очередь на паром", { encodings: ["i16"] }),
  enu("ferry.status", ["docked", "boarding", "departed", "arriving", "cancelled"], "Ferry status", "Статус парома"),
  logical("ferry.ramp.down", "Ferry ramp down", "Аппарель опущена"),
]);

write("layer-b-cableway.json", [
  id("cableway.line.id", "Cableway line id", "ID канатной дороги"),
  q("cableway.cabin.speed", "m/s", "Cabin speed", "Скорость кабины"),
  q("cableway.cable.tension", "N", "Haul rope tension", "Натяжение каната"),
  q("cableway.wind", "m/s", "Cableway wind", "Ветер на канатке"),
  q("cableway.load", "%", "Cableway load", "Загрузка канатки", { range: { min: 0, max: 100 } }),
  logical("cableway.e_stop", "Cableway e-stop", "Аварийный стоп канатки"),
  enu("cableway.state", ["closed", "open", "wind_hold", "evacuation", "fault"], "Cableway state", "Состояние канатной дороги"),
]);

write("layer-b-marina.json", [
  id("marina.id", "Marina id", "ID марины"),
  id("marina.berth.id", "Marina berth id", "ID места марины"),
  q("marina.berth.occupancy", "%", "Marina occupancy", "Занятость марины", { range: { min: 0, max: 100 } }),
  q("marina.power.draw", "W", "Shore power draw", "Потребление берегового питания"),
  q("marina.water.flow", "L/min", "Dock water flow", "Расход воды на причале"),
  q("marina.fuel.dispensed", "L", "Marina fuel dispensed", "Отпущено топлива в марине"),
  logical("marina.gate.open", "Marina gate open", "Ворота марины открыты"),
  enu("marina.berth.status", ["free", "occupied", "reserved", "maintenance"], "Marina berth status", "Статус места марины"),
]);

write("layer-b-theme_park.json", [
  id("theme_park.ride.id", "Theme park ride id", "ID аттракциона"),
  q("theme_park.ride.wait_min", "min", "Ride wait time", "Ожидание аттракциона"),
  q("theme_park.ride.throughput", "/h", "Ride throughput", "Пропускная способность аттракциона"),
  q("theme_park.ride.gforce", "-", "Ride peak g-force", "Пиковая перегрузка"),
  logical("theme_park.ride.e_stop", "Ride e-stop theme", "Е-стоп аттракциона"),
  logical("theme_park.ride.restraints_ok", "Restraints locked", "Фиксаторы закрыты"),
  enu("theme_park.ride.state", ["closed", "open", "cycle", "evac", "fault"], "Theme ride state", "Состояние аттракциона"),
  q("theme_park.park.attendance", "-", "Park attendance", "Посещаемость парка", { encodings: ["i32"] }),
]);

write("layer-b-zoo.json", [
  id("zoo.enclosure.id", "Zoo enclosure id", "ID вольера"),
  id("zoo.animal.id", "Zoo animal id", "ID животного зоопарка"),
  q("zoo.enclosure.temperature", "Cel", "Enclosure temperature", "Температура вольера"),
  q("zoo.enclosure.humidity", "%", "Enclosure humidity", "Влажность вольера", { range: { min: 0, max: 100 } }),
  q("zoo.water.quality", "-", "Exhibit water quality index", "Индекс качества воды экспозиции"),
  q("zoo.visitor.count", "-", "Zoo visitors", "Посетители зоопарка", { encodings: ["i32"] }),
  logical("zoo.door.secure", "Enclosure secure", "Вольер закрыт"),
  media("zoo.camera.ref", "Enclosure camera", "Камера вольера"),
  enu("zoo.animal.welfare", ["normal", "observe", "veterinary", "critical"], "Animal welfare state", "Состояние благополучия"),
]);

write("layer-b-smart_clothing.json", [
  id("smart_clothing.garment.id", "Smart garment id", "ID умной одежды"),
  q("smart_clothing.battery.soc", "%", "Garment battery", "Заряд умной одежды", { range: { min: 0, max: 100 } }),
  q("smart_clothing.heating.power", "W", "Garment heating power", "Мощность подогрева одежды"),
  q("smart_clothing.stretch", "%", "Fabric stretch", "Растяжение ткани", { range: { min: 0, max: 100 } }),
  q("smart_clothing.impact.g", "-", "Impact g-force clothing", "Ударная перегрузка одежды"),
  logical("smart_clothing.wet", "Garment wet detected", "Одежда намокла"),
  enu("smart_clothing.mode", ["off", "heat", "sense", "sos"], "Smart clothing mode", "Режим умной одежды"),
  cmd("smart_clothing.command", ["heat_on", "heat_off", "sos", "locate"], "Smart clothing command", "Команда умной одежды"),
]);

write("layer-b-pest.json", [
  id("pest.trap.id", "Pest trap id", "ID ловушки"),
  id("pest.zone.id", "Pest zone id", "ID зоны мониторинга вредителей"),
  q("pest.trap.count", "-", "Trap capture count", "Отлов в ловушке", { encodings: ["i32"] }),
  q("pest.activity.index", "-", "Pest activity index", "Индекс активности вредителей"),
  logical("pest.alert.active", "Pest alert", "Тревога вредителей"),
  enu("pest.type", ["rodent", "cockroach", "mosquito", "fly", "moth", "other"], "Pest type", "Тип вредителя"),
  media("pest.trap.image_ref", "Trap image", "Снимок ловушки"),
]);

write("layer-b-mold.json", [
  id("mold.sensor.id", "Mold sensor id", "ID датчика плесени"),
  q("mold.risk.index", "-", "Mold risk index", "Индекс риска плесени", { range: { min: 0, max: 100 } }),
  q("mold.spore.count", "/m3", "Spore count", "Концентрация спор"),
  q("mold.surface.moisture", "%", "Surface moisture mold", "Влажность поверхности", { range: { min: 0, max: 100 } }),
  logical("mold.detected", "Mold detected", "Плесень обнаружена"),
  enu("mold.severity", ["low", "moderate", "high"], "Mold severity", "Степень поражения"),
]);

write("layer-b-conference.json", [
  id("conference.room.id", "Conference room id", "ID конференц-зала"),
  id("conference.meeting.id", "Meeting id", "ID встречи"),
  q("conference.participants", "-", "Participant count", "Число участников", { encodings: ["i16"] }),
  q("conference.audio.level", "dB", "Conference audio level", "Уровень звука конференции"),
  logical("conference.mic.muted", "Mic muted conference", "Микрофон выключен"),
  logical("conference.recording", "Conference recording", "Идёт запись конференции"),
  logical("conference.screen.sharing", "Screen sharing", "Демонстрация экрана"),
  enu("conference.state", ["scheduled", "lobby", "live", "ended"], "Conference state", "Состояние конференции"),
]);

write("layer-b-callcenter.json", [
  id("callcenter.agent.id", "Agent id", "ID оператора", { sensitivity: "restricted" }),
  id("callcenter.queue.id", "Call queue id", "ID очереди звонков"),
  q("callcenter.queue.wait", "s", "Queue wait time", "Ожидание в очереди"),
  q("callcenter.asa", "s", "Average speed of answer", "Среднее время ответа"),
  q("callcenter.aht", "s", "Average handle time", "Среднее время обработки"),
  q("callcenter.occupancy", "%", "Agent occupancy", "Загрузка операторов", { range: { min: 0, max: 100 } }),
  q("callcenter.sla", "%", "Service level", "Уровень сервиса", { range: { min: 0, max: 100 } }),
  enu("callcenter.agent.state", ["available", "on_call", "wrap", "break", "offline"], "Agent state", "Состояние оператора"),
]);

write("layer-b-kds.json", [
  id("kds.station.id", "Kitchen display station id", "ID станции KDS"),
  id("kds.ticket.id", "Kitchen ticket id", "ID заказа кухни"),
  q("kds.ticket.age", "s", "Ticket age", "Возраст заказа на кухне"),
  q("kds.tickets.open", "-", "Open tickets", "Открытые заказы кухни", { encodings: ["i16"] }),
  q("kds.bump.time", "s", "Average bump time", "Среднее время отдачи"),
  enu("kds.ticket.status", ["new", "in_prep", "ready", "bumped", "void"], "Kitchen ticket status", "Статус заказа кухни"),
  cmd("kds.command", ["bump", "recall", "rush", "void"], "KDS command", "Команда KDS"),
]);

write("layer-b-coffee.json", [
  id("coffee.machine.id", "Coffee machine id", "ID кофемашины"),
  q("coffee.boiler.temperature", "Cel", "Boiler temperature", "Температура бойлера"),
  q("coffee.brew.pressure", "Pa", "Brew pressure", "Давление пролива"),
  q("coffee.grind.size", "-", "Grind size setting", "Помол"),
  q("coffee.shot.time", "s", "Shot time", "Время эспрессо"),
  q("coffee.shot.weight", "g", "Shot weight", "Масса эспрессо"),
  q("coffee.milk.temperature", "Cel", "Milk temperature", "Температура молока"),
  q("coffee.bean.level", "%", "Bean hopper level", "Уровень зёрен", { range: { min: 0, max: 100 } }),
  enu("coffee.drink", ["espresso", "americano", "latte", "cappuccino", "other"], "Coffee drink type", "Тип напитка"),
  enu("coffee.machine.state", ["idle", "heating", "grinding", "brewing", "steaming", "cleaning", "fault"], "Coffee machine state", "Состояние кофемашины"),
]);

write("layer-b-bakery.json", [
  id("bakery.oven.id", "Bakery oven id", "ID печи пекарни"),
  q("bakery.oven.temperature", "Cel", "Bakery oven temperature", "Температура печи пекарни"),
  q("bakery.oven.humidity", "%", "Oven humidity bakery", "Влажность печи", { range: { min: 0, max: 100 } }),
  q("bakery.dough.temperature", "Cel", "Dough temperature", "Температура теста"),
  q("bakery.proof.humidity", "%", "Proofer humidity", "Влажность расстойки", { range: { min: 0, max: 100 } }),
  q("bakery.mixer.time", "s", "Mix time", "Время замеса"),
  q("bakery.loaf.weight", "g", "Loaf weight", "Масса изделия"),
  enu("bakery.stage", ["mix", "ferment", "proof", "bake", "cool", "pack"], "Bakery stage", "Стадия выпечки"),
]);

write("layer-b-cold_storage.json", [
  id("cold_storage.room.id", "Cold storage room id", "ID холодильной камеры"),
  q("cold_storage.temperature", "Cel", "Cold storage temperature", "Температура хладосклада"),
  q("cold_storage.humidity", "%", "Cold storage humidity", "Влажность хладосклада", { range: { min: 0, max: 100 } }),
  q("cold_storage.door.open_time", "s", "Door open duration", "Время открытой двери"),
  q("cold_storage.energy", "Wh", "Cold storage energy", "Энергия хладосклада"),
  logical("cold_storage.defrost.active", "Defrost active", "Оттайка активна"),
  logical("cold_storage.alarm.high_temp", "High temp alarm cold", "Тревога высокой температуры"),
  enu("cold_storage.zone", ["chilled", "frozen", "deep_freeze", "controlled_atmosphere"], "Cold storage zone type", "Тип зоны хладосклада"),
]);

write("layer-b-pipeline_integrity.json", [
  id("pipeline_integrity.segment.id", "Pipeline segment id", "ID участка трубопровода"),
  q("pipeline_integrity.pressure", "Pa", "Integrity pressure", "Давление (целостность)"),
  q("pipeline_integrity.flow", "m3/h", "Integrity flow", "Расход (целостность)"),
  q("pipeline_integrity.cp.potential", "mV", "Cathodic protection potential", "Потенциал ЭХЗ"),
  q("pipeline_integrity.wall.loss", "%", "Wall loss", "Потеря толщины стенки", { range: { min: 0, max: 100 } }),
  q("pipeline_integrity.pig.odometer", "km", "Pig odometer", "Одометр внутритрубного снаряда"),
  logical("pipeline_integrity.leak.suspect", "Leak suspect", "Подозрение на утечку"),
  enu("pipeline_integrity.pig.state", ["idle", "running", "stuck", "complete"], "Pig run state", "Состояние прогона снаряда"),
  media("pipeline_integrity.ili.ref", "ILI report ref", "Отчёт ВТД"),
]);

write("layer-b-transformer.json", [
  id("transformer.id", "Power transformer id", "ID силового трансформатора"),
  q("transformer.oil.temperature", "Cel", "Transformer oil temp", "Температура масла трансформатора"),
  q("transformer.winding.temperature", "Cel", "Winding temperature", "Температура обмотки"),
  q("transformer.load.pct", "%", "Transformer load pct", "Нагрузка трансформатора", { range: { min: 0, max: 150 } }),
  q("transformer.dga.h2", "ppm", "DGA hydrogen", "ВРГ водород"),
  q("transformer.dga.c2h2", "ppm", "DGA acetylene", "ВРГ ацетилен"),
  q("transformer.moisture", "ppm", "Oil moisture", "Влага в масле"),
  q("transformer.bushing.tan_delta", "-", "Bushing tan delta", "tgδ ввода"),
  logical("transformer.alarm.gas", "Buchholz / gas alarm", "Газовая защита"),
  enu("transformer.cooling", ["on", "off", "auto"], "Cooling state", "Состояние охлаждения"),
]);

write("layer-b-ev_battery_pack.json", [
  id("ev_battery_pack.id", "EV battery pack id", "ID тяговой батареи"),
  q("ev_battery_pack.soc", "%", "Pack SoC", "SoC пакета", { range: { min: 0, max: 100 } }),
  q("ev_battery_pack.soh", "%", "Pack SoH", "SoH пакета", { range: { min: 0, max: 100 } }),
  q("ev_battery_pack.voltage", "V", "Pack voltage", "Напряжение пакета"),
  q("ev_battery_pack.current", "A", "Pack current", "Ток пакета"),
  q("ev_battery_pack.temp.max", "Cel", "Max cell temperature", "Макс. температура ячеек"),
  q("ev_battery_pack.temp.min", "Cel", "Min cell temperature", "Мин. температура ячеек"),
  q("ev_battery_pack.cell_delta_v", "mV", "Cell voltage delta", "Разброс напряжения ячеек"),
  q("ev_battery_pack.isolation", "Ohm", "Isolation resistance", "Сопротивление изоляции"),
  logical("ev_battery_pack.contactor.closed", "Main contactor closed", "Контактор замкнут"),
  enu("ev_battery_pack.state", ["idle", "charge", "discharge", "balance", "fault", "thermal_event"], "Pack state", "Состояние пакета"),
]);

write("layer-b-ammonia_energy.json", [
  q("ammonia.tank.level", "%", "Ammonia tank level", "Уровень аммиака", { range: { min: 0, max: 100 } }),
  q("ammonia.tank.pressure", "Pa", "Ammonia tank pressure", "Давление аммиака"),
  q("ammonia.tank.temperature", "Cel", "Ammonia tank temperature", "Температура аммиака"),
  q("ammonia.cracker.temperature", "Cel", "Cracker temperature", "Температура крекера"),
  q("ammonia.engine.power", "W", "Ammonia engine power", "Мощность аммиачного двигателя"),
  logical("ammonia.leak.detected", "Ammonia leak detected", "Утечка аммиака"),
  id("ammonia.system.id", "Ammonia energy system id", "ID аммиачной энергосистемы"),
  enu("ammonia.system.state", ["idle", "store", "crack", "generate", "fault"], "Ammonia system state", "Состояние аммиачной системы"),
]);

write("layer-b-saf.json", [
  id("saf.batch.id", "SAF batch id", "ID партии SAF"),
  q("saf.blend.ratio", "%", "SAF blend ratio", "Доля SAF в смеси", { range: { min: 0, max: 100 } }),
  q("saf.density", "kg/m3", "SAF density", "Плотность SAF"),
  q("saf.freeze.point", "Cel", "Freeze point", "Температура замерзания"),
  q("saf.flash.point", "Cel", "Flash point", "Температура вспышки"),
  q("saf.aromatics", "%", "Aromatics content", "Содержание ароматики", { range: { min: 0, max: 100 } }),
  enu("saf.pathway", ["hefa", "ft", "atj", "pth", "other"], "SAF pathway", "Путь производства SAF"),
  logical("saf.spec.pass", "SAF spec pass", "Спецификация SAF OK"),
]);

console.log("Layer B6 seeds written");
