#!/usr/bin/env node
/**
 * Layer B4 — remaining major world domains (still not "infinite", but broad coverage).
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B4", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-meteorology.json", [
  q("meteorology.temperature.air", "Cel", "Met air temperature", "Температура воздуха (метео)"),
  q("meteorology.temperature.soil", "Cel", "Met soil temperature", "Температура почвы (метео)"),
  q("meteorology.humidity.relative", "%", "Met relative humidity", "Отн. влажность (метео)", { range: { min: 0, max: 100 } }),
  q("meteorology.pressure.msl", "hPa", "Mean sea level pressure", "Давление на уровне моря"),
  q("meteorology.pressure.station", "hPa", "Station pressure", "Давление на станции"),
  q("meteorology.wind.speed", "m/s", "Met wind speed", "Скорость ветра (метео)"),
  q("meteorology.wind.gust", "m/s", "Met wind gust", "Порыв ветра (метео)"),
  q("meteorology.wind.direction", "deg", "Met wind direction", "Направление ветра (метео)", { range: { min: 0, max: 360 } }),
  q("meteorology.precipitation.rate", "mm/h", "Precipitation rate met", "Интенсивность осадков (метео)"),
  q("meteorology.precipitation.total", "mm", "Precipitation total", "Сумма осадков"),
  q("meteorology.snow.depth", "cm", "Snow depth", "Высота снега"),
  q("meteorology.cloud.base", "m", "Cloud base", "Нижняя граница облаков"),
  q("meteorology.cloud.cover", "%", "Cloud cover met", "Облачность (метео)", { range: { min: 0, max: 100 } }),
  q("meteorology.visibility", "m", "Met visibility", "Видимость (метео)"),
  q("meteorology.solar.irradiance", "W/m2", "Met solar irradiance", "Инсоляция (метео)"),
  q("meteorology.uv.index", "-", "Met UV index", "УФ-индекс (метео)"),
  q("meteorology.lightning.strikes", "-", "Lightning strikes", "Удары молний", { encodings: ["i32"] }),
  id("meteorology.station.id", "Weather station id", "ID метеостанции"),
  enu("meteorology.precip.type", ["none", "rain", "snow", "sleet", "hail", "freezing_rain"], "Precipitation type", "Тип осадков"),
]);

write("layer-b-oceanography.json", [
  q("oceanography.wave.height", "m", "Significant wave height", "Значительная высота волны"),
  q("oceanography.wave.period", "s", "Wave period", "Период волны"),
  q("oceanography.wave.direction", "deg", "Wave direction", "Направление волны", { range: { min: 0, max: 360 } }),
  q("oceanography.current.speed", "m/s", "Ocean current speed", "Скорость течения"),
  q("oceanography.current.direction", "deg", "Ocean current direction", "Направление течения"),
  q("oceanography.sea.temperature", "Cel", "Sea surface temperature", "Температура поверхности моря"),
  q("oceanography.sea.salinity", "ppt", "Sea salinity", "Солёность моря"),
  q("oceanography.sea.level", "m", "Sea level", "Уровень моря"),
  q("oceanography.tide.height", "m", "Tide height", "Высота прилива"),
  q("oceanography.chlorophyll", "mg/m3", "Chlorophyll-a", "Хлорофилл-a"),
  q("oceanography.dissolved_oxygen", "mg/L", "Ocean dissolved oxygen", "Растворённый кислород (океан)"),
  id("oceanography.buoy.id", "Ocean buoy id", "ID буя"),
]);

write("layer-b-seismology.json", [
  q("seismology.ground.acceleration", "m/s2", "PGA", "Пиковое ускорение грунта"),
  q("seismology.ground.velocity", "m/s", "PGV", "Пиковая скорость грунта"),
  q("seismology.ground.displacement", "mm", "Ground displacement seismic", "Сейсмическое смещение"),
  q("seismology.magnitude", "-", "Earthquake magnitude", "Магнитуда"),
  q("seismology.depth", "km", "Hypocenter depth", "Глубина очага"),
  q("seismology.intensity", "-", "Macroseismic intensity", "Интенсивность", { encodings: ["f32", "u8"] }),
  q("seismology.volcano.tremor", "-", "Volcanic tremor amplitude", "Амплитуда вулканического дрожания"),
  q("seismology.volcano.so2", "t/d", "Volcanic SO2 flux", "Поток SO2 вулкана"),
  logical("seismology.alert.active", "Seismic alert active", "Сейсмическое оповещение"),
  id("seismology.station.id", "Seismic station id", "ID сейсмостанции"),
  id("seismology.event.id", "Seismic event id", "ID сейсмического события"),
]);

write("layer-b-astronomy.json", [
  q("astronomy.seeing.fwhm", "arcsec", "Seeing FWHM", "Смётие атмосферы FWHM"),
  q("astronomy.sky.background", "mag/arcsec2", "Sky background", "Фон неба"),
  q("astronomy.transparency", "%", "Atmospheric transparency", "Прозрачность атмосферы", { range: { min: 0, max: 100 } }),
  q("astronomy.dome.azimuth", "deg", "Dome azimuth", "Азимут купола"),
  q("astronomy.telescope.altitude", "deg", "Telescope altitude", "Высота телескопа"),
  q("astronomy.telescope.azimuth", "deg", "Telescope azimuth", "Азимут телескопа"),
  q("astronomy.ccd.temperature", "Cel", "CCD temperature", "Температура ПЗС"),
  q("astronomy.exposure.time", "s", "Exposure time", "Выдержка"),
  q("astronomy.humidity.dome", "%", "Dome humidity", "Влажность в куполе", { range: { min: 0, max: 100 } }),
  id("astronomy.observatory.id", "Observatory id", "ID обсерватории"),
  id("astronomy.target.id", "Target id", "ID объекта наблюдения"),
  enu("astronomy.dome.state", ["open", "closed", "moving", "fault"], "Dome state", "Состояние купола"),
]);

write("layer-b-veterinary.json", [
  id("veterinary.animal.id", "Animal id", "ID животного"),
  id("veterinary.owner.id", "Pet owner id", "ID владельца", { sensitivity: "restricted" }),
  q("veterinary.vitals.heart_rate", "/min", "Animal heart rate", "Пульс животного", { sensitivity: "personal" }),
  q("veterinary.vitals.temperature", "Cel", "Animal body temperature", "Температура животного", { sensitivity: "personal" }),
  q("veterinary.vitals.respiratory_rate", "/min", "Animal respiratory rate", "ЧД животного", { sensitivity: "personal" }),
  q("veterinary.weight", "kg", "Animal weight vet", "Масса животного (вет)"),
  q("veterinary.activity", "-", "Animal activity score", "Активность животного"),
  enu("veterinary.species", ["dog", "cat", "horse", "cow", "pig", "bird", "other"], "Species", "Вид животного"),
  enu("veterinary.visit.status", ["scheduled", "in_progress", "complete", "cancelled"], "Vet visit status", "Статус визита"),
  media("veterinary.image.ref", "Vet image ref", "Снимок ветклиники"),
]);

write("layer-b-dental.json", [
  id("dental.patient.id", "Dental patient id", "ID пациента стоматологии", { sensitivity: "restricted" }),
  id("dental.chair.id", "Dental chair id", "ID кресла"),
  q("dental.chair.water_pressure", "kPa", "Dental water pressure", "Давление воды (стомат)"),
  q("dental.compressor.pressure", "kPa", "Dental compressor pressure", "Давление компрессора"),
  q("dental.suction.vacuum", "kPa", "Dental suction vacuum", "Вакуум отсоса"),
  q("dental.xray.dose", "uSv", "Dental X-ray dose", "Доза дентального рентгена", { sensitivity: "personal" }),
  logical("dental.autoclave.ready", "Autoclave ready", "Автоклав готов"),
  q("dental.autoclave.temperature", "Cel", "Autoclave temperature", "Температура автоклава"),
  enu("dental.procedure.state", ["idle", "exam", "cleaning", "filling", "surgery", "imaging"], "Dental procedure state", "Состояние процедуры"),
]);

write("layer-b-foodproc.json", [
  q("foodproc.cook.temperature", "Cel", "Cooking temperature", "Температура приготовления"),
  q("foodproc.cook.humidity", "%", "Cooking humidity", "Влажность приготовления", { range: { min: 0, max: 100 } }),
  q("foodproc.pasteurization.temperature", "Cel", "Pasteurization temperature", "Температура пастеризации"),
  q("foodproc.pasteurization.hold_time", "s", "Pasteurization hold time", "Выдержка пастеризации"),
  q("foodproc.mixer.speed", "/min", "Mixer speed", "Скорость мешалки"),
  q("foodproc.filler.volume", "L", "Filler volume", "Объём дозатора"),
  q("foodproc.metal.detect_count", "-", "Metal detector trips", "Срабатывания металлодетектора", { encodings: ["i32"] }),
  q("foodproc.weight.checkweigher", "kg", "Checkweigher weight", "Вес чеквейера"),
  logical("foodproc.cip.active", "CIP active", "CIP активен"),
  q("foodproc.cip.conductivity", "uS/cm", "CIP conductivity", "Проводимость CIP"),
  id("foodproc.batch.id", "Food batch id", "ID пищевой партии"),
  id("foodproc.line.id", "Food line id", "ID линии"),
  enu("foodproc.line.state", ["idle", "running", "cip", "changeover", "fault"], "Food line state", "Состояние линии"),
]);

write("layer-b-beverage.json", [
  q("beverage.ferment.temperature", "Cel", "Fermentation temperature", "Температура брожения"),
  q("beverage.ferment.pressure", "kPa", "Fermentation pressure", "Давление брожения"),
  q("beverage.ferment.sg", "-", "Specific gravity", "Плотность сусла"),
  q("beverage.ferment.ph", "-", "Ferment pH", "pH брожения", { range: { min: 0, max: 14 } }),
  q("beverage.ferment.brix", "-", "Brix", "Брикс"),
  q("beverage.carbonation", "vol", "CO2 volumes", "Степень карбонизации"),
  q("beverage.bright.tank_level", "%", "Bright tank level", "Уровень, %", { range: { min: 0, max: 100 } }),
  q("beverage.filler.speed", "/min", "Bottle filler speed", "Скорость розлива"),
  q("beverage.wine.alcohol", "%", "Alcohol by volume", "Крепость", { range: { min: 0, max: 100 } }),
  id("beverage.batch.id", "Beverage batch id", "ID партии напитка"),
  enu("beverage.style", ["lager", "ale", "wine", "cider", "soda", "other"], "Beverage style", "Стиль напитка"),
]);

write("layer-b-textile.json", [
  q("textile.yarn.tension", "N", "Yarn tension", "Натяжение нити"),
  q("textile.loom.speed", "/min", "Loom speed", "Скорость ткацкого станка"),
  q("textile.dye.temperature", "Cel", "Dye bath temperature", "Температура красильной ванны"),
  q("textile.dye.ph", "-", "Dye bath pH", "pH красильной ванны", { range: { min: 0, max: 14 } }),
  q("textile.humidity.room", "%", "Textile room humidity", "Влажность цеха", { range: { min: 0, max: 100 } }),
  q("textile.fabric.moisture", "%", "Fabric moisture", "Влажность ткани", { range: { min: 0, max: 100 } }),
  q("textile.defect.count", "-", "Defect count", "Число дефектов", { encodings: ["i32"] }),
  id("textile.lot.id", "Textile lot id", "ID партии текстиля"),
  enu("textile.process.state", ["spinning", "weaving", "dyeing", "finishing", "idle", "fault"], "Textile process state", "Состояние процесса"),
]);

write("layer-b-metallurgy.json", [
  q("metallurgy.furnace.temperature", "Cel", "Furnace temperature", "Температура печи"),
  q("metallurgy.melt.temperature", "Cel", "Melt temperature", "Температура расплава"),
  q("metallurgy.rolling.force", "N", "Rolling force", "Усилие прокатки"),
  q("metallurgy.rolling.speed", "m/s", "Rolling speed", "Скорость прокатки"),
  q("metallurgy.casting.level", "%", "Caster mold level", "Уровень в кристаллизаторе", { range: { min: 0, max: 100 } }),
  q("metallurgy.slag.basicity", "-", "Slag basicity", "Основность шлака"),
  q("metallurgy.oxygen.lance", "m3/h", "Oxygen lance flow", "Расход кислорода фурмы"),
  q("metallurgy.coil.thickness", "mm", "Coil thickness", "Толщина рулона"),
  q("metallurgy.coil.width", "mm", "Coil width", "Ширина рулона"),
  id("metallurgy.heat.id", "Heat id", "ID плавки"),
  enu("metallurgy.furnace.state", ["idle", "charging", "melting", "refining", "tapping", "fault"], "Furnace state", "Состояние печи"),
]);

write("layer-b-cement.json", [
  q("cement.kiln.temperature", "Cel", "Kiln temperature", "Температура печи цемента"),
  q("cement.kiln.speed", "/min", "Kiln rotation speed", "Обороты печи"),
  q("cement.rawmill.power", "W", "Raw mill power", "Мощность сырьевой мельницы"),
  q("cement.finishmill.power", "W", "Finish mill power", "Мощность цементной мельницы"),
  q("cement.clinker.free_lime", "%", "Free lime", "Свободная известь", { range: { min: 0, max: 10 } }),
  q("cement.emission.nox", "mg/m3", "Cement NOx", "NOx цементного завода"),
  q("cement.emission.dust", "mg/m3", "Cement dust emission", "Пыль цементного завода"),
  q("cement.silo.level", "%", "Cement silo level", "Уровень силоса", { range: { min: 0, max: 100 } }),
  id("cement.kiln.id", "Kiln id", "ID печи"),
  enu("cement.plant.state", ["stop", "start", "run", "maintenance"], "Cement plant state", "Состояние завода"),
]);

write("layer-b-chemical.json", [
  q("chemical.reactor.temperature", "Cel", "Chemical reactor temperature", "Температура химреактора"),
  q("chemical.reactor.pressure", "Pa", "Chemical reactor pressure", "Давление химреактора"),
  q("chemical.reactor.level", "%", "Reactor level", "Уровень реактора", { range: { min: 0, max: 100 } }),
  q("chemical.reactor.agitation", "/min", "Agitator speed", "Скорость мешалки реактора"),
  q("chemical.column.top_temp", "Cel", "Column top temperature", "Температура верха колонны"),
  q("chemical.column.bottom_temp", "Cel", "Column bottom temperature", "Температура низа колонны"),
  q("chemical.column.reflux", "-", "Reflux ratio", "Флегмовое число"),
  q("chemical.concentration.product", "%", "Product concentration", "Концентрация продукта", { range: { min: 0, max: 100 } }),
  q("chemical.voc.emission", "ppm", "Plant VOC emission", "Выбросы ЛОС завода"),
  logical("chemical.interlock.trip", "Safety interlock trip", "Срабатывание блокировки"),
  id("chemical.batch.id", "Chemical batch id", "ID химпартии"),
  enu("chemical.reactor.state", ["idle", "charging", "reaction", "cooling", "discharge", "cip", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-semiconductor.json", [
  q("semiconductor.chamber.pressure", "Pa", "Process chamber pressure", "Давление камеры"),
  q("semiconductor.chamber.temperature", "Cel", "Process chamber temperature", "Температура камеры"),
  q("semiconductor.gas.flow", "sccm", "Process gas flow", "Расход процессного газа"),
  q("semiconductor.rf.power", "W", "RF power", "РЧ мощность"),
  q("semiconductor.wafer.temperature", "Cel", "Wafer temperature", "Температура пластины"),
  q("semiconductor.particle.count", "-", "Particle count", "Число частиц", { encodings: ["i32"] }),
  q("semiconductor.cleanroom.iso_class", "-", "ISO cleanroom class", "Класс чистоты ISO", { encodings: ["u8", "f32"] }),
  q("semiconductor.cleanroom.particles_03", "-", "Particles ≥0.3µm", "Частицы ≥0.3мкм", { encodings: ["i32"] }),
  q("semiconductor.tool.uptime", "%", "Tool uptime", "Аптайм инструмента", { range: { min: 0, max: 100 } }),
  id("semiconductor.lot.id", "Wafer lot id", "ID лота пластин"),
  id("semiconductor.tool.id", "Process tool id", "ID установки"),
  enu("semiconductor.tool.state", ["idle", "running", "pm", "alarm", "offline"], "Tool state", "Состояние установки"),
]);

write("layer-b-emergency.json", [
  id("emergency.incident.id", "Incident id", "ID происшествия"),
  id("emergency.unit.id", "Emergency unit id", "ID подразделения"),
  enu("emergency.incident.type", ["fire", "medical", "police", "rescue", "hazmat", "other"], "Incident type", "Тип происшествия"),
  enu("emergency.incident.status", ["dispatched", "enroute", "onscene", "resolved", "cancelled"], "Incident status", "Статус происшествия"),
  q("emergency.response.eta", "s", "Response ETA", "ETA реагирования", { encodings: ["i32", "f64"] }),
  q("emergency.ambulance.speed", "km/h", "Ambulance speed", "Скорость скорой"),
  logical("emergency.siren.active", "Siren active", "Сирена включена"),
  logical("emergency.lights.active", "Emergency lights active", "Проблесковые маячки"),
  q("emergency.firefighter.air_pressure", "kPa", "SCBA air pressure", "Давление в дыхательном аппарате"),
  q("emergency.firefighter.temperature", "Cel", "Turnout gear temperature", "Температура снаряжения"),
  media("emergency.bodycam.ref", "Bodycam media ref", "Ссылка на бодикамеру"),
]);

write("layer-b-airport.json", [
  id("airport.code", "Airport IATA/ICAO", "Код аэропорта"),
  id("airport.flight.id", "Airport flight id", "ID рейса (аэропорт)"),
  id("airport.gate.id", "Gate id", "ID выхода"),
  id("airport.stand.id", "Stand id", "ID стоянки"),
  enu("airport.flight.status", ["scheduled", "boarding", "departed", "arrived", "delayed", "cancelled"], "Airport flight status", "Статус рейса"),
  q("airport.runway.vis", "m", "Runway visibility", "Видимость на ВПП"),
  q("airport.runway.friction", "-", "Runway friction", "Сцепление ВПП"),
  q("airport.baggage.count", "-", "Baggage piece count", "Число багажа", { encodings: ["i32"] }),
  q("airport.passenger.queue", "-", "Passenger queue length", "Очередь пассажиров", { encodings: ["i16"] }),
  q("airport.fuel.dispensed", "L", "Fuel dispensed", "Заправлено топлива"),
  logical("airport.security.alarm", "Airport security alarm", "Тревога авиабезопасности"),
  cmd("airport.jetbridge", ["dock", "undock", "stop"], "Jet bridge command", "Команда телетрапа"),
]);

write("layer-b-port.json", [
  id("port.code", "Port code", "Код порта"),
  id("port.berth.id", "Berth id", "ID причала"),
  id("port.vessel.visit_id", "Vessel visit id", "ID судозахода"),
  q("port.crane.moves", "-", "Crane moves", "Движения крана", { encodings: ["i32"] }),
  q("port.crane.productivity", "/h", "Crane productivity", "Производительность крана"),
  q("port.yard.occupancy", "%", "Yard occupancy", "Занятость терминала", { range: { min: 0, max: 100 } }),
  q("port.gate.truck_queue", "-", "Gate truck queue", "Очередь грузовиков", { encodings: ["i16"] }),
  q("port.tide.level", "m", "Port tide level", "Уровень прилива в порту"),
  enu("port.berth.status", ["free", "occupied", "reserved", "maintenance"], "Berth status", "Статус причала"),
  logical("port.security.breach", "Port security breach", "Нарушение портовой охраны"),
]);

write("layer-b-warehouse.json", [
  id("warehouse.site.id", "Warehouse site id", "ID склада"),
  id("warehouse.location.id", "Storage location id", "ID ячейки"),
  id("warehouse.sku.id", "Warehouse SKU id", "SKU склада"),
  q("warehouse.inventory.qty", "-", "Inventory quantity", "Количество на складе", { encodings: ["i32", "f32"] }),
  q("warehouse.location.temperature", "Cel", "Location temperature", "Температура зоны хранения"),
  q("warehouse.location.humidity", "%", "Location humidity", "Влажность зоны", { range: { min: 0, max: 100 } }),
  q("warehouse.picker.productivity", "/h", "Picker productivity", "Производительность комплектовщика"),
  q("warehouse.agv.battery", "%", "Warehouse AGV battery", "Заряд AGV склада", { range: { min: 0, max: 100 } }),
  enu("warehouse.task.type", ["inbound", "putaway", "pick", "pack", "ship", "cycle_count"], "Warehouse task type", "Тип складской задачи"),
  enu("warehouse.task.status", ["queued", "assigned", "active", "done", "exception"], "Warehouse task status", "Статус складской задачи"),
  logical("warehouse.door.open", "Dock door open", "Дверь дока открыта"),
]);

write("layer-b-utilities_gas.json", [
  q("utilities.gas.pressure", "kPa", "Gas distribution pressure", "Давление газораспределения"),
  q("utilities.gas.flow", "m3/h", "Gas distribution flow", "Расход газа"),
  q("utilities.gas.calorific", "MJ/m3", "Calorific value", "Теплотворная способность"),
  q("utilities.gas.odorant", "mg/m3", "Odorant concentration", "Концентрация одоранта"),
  q("utilities.gas.leak_rate", "m3/h", "Gas leak rate", "Утечка газа"),
  logical("utilities.gas.leak_alarm", "Gas leak alarm utility", "Тревога утечки газа"),
  q("utilities.district.heat_supply_temp", "Cel", "District heat supply temp", "Т подачи теплосети"),
  q("utilities.district.heat_return_temp", "Cel", "District heat return temp", "Т обратки теплосети"),
  q("utilities.district.heat_flow", "m3/h", "District heat flow", "Расход теплосети"),
  id("utilities.station.id", "Utility station id", "ID станции сетей"),
]);

write("layer-b-renewables.json", [
  q("renewables.hydro.head", "m", "Hydro head", "Напор ГЭС"),
  q("renewables.hydro.flow", "m3/s", "Hydro flow", "Расход ГЭС"),
  q("renewables.hydro.power", "W", "Hydro power", "Мощность ГЭС"),
  q("renewables.geo.well_temp", "Cel", "Geothermal well temperature", "Температура геотермальной скважины"),
  q("renewables.geo.power", "W", "Geothermal power", "Мощность геотермии"),
  q("renewables.tidal.height", "m", "Tidal height renewables", "Высота прилива (ВИЭ)"),
  q("renewables.tidal.power", "W", "Tidal power", "Мощность прилива"),
  q("renewables.wave.power", "W", "Wave power", "Мощность волн"),
  q("renewables.biogas.ch4", "%", "Biogas methane fraction", "Доля метана в биогазе", { range: { min: 0, max: 100 } }),
  q("renewables.biogas.flow", "m3/h", "Biogas flow", "Расход биогаза"),
  id("renewables.plant.id", "Renewables plant id", "ID ВИЭ-станции"),
]);

write("layer-b-waste.json", [
  q("waste.landfill.gas_ch4", "%", "Landfill methane", "Метан полигона", { range: { min: 0, max: 100 } }),
  q("waste.landfill.temperature", "Cel", "Landfill temperature", "Температура полигона"),
  q("waste.landfill.leachate_level", "%", "Leachate level", "Уровень фильтрата", { range: { min: 0, max: 100 } }),
  q("waste.incinerator.temperature", "Cel", "Incinerator temperature", "Температура сжигания"),
  q("waste.incinerator.emissions_co", "mg/m3", "Incinerator CO", "CO мусоросжигания"),
  q("waste.recycling.sort_rate", "%", "Sort accuracy", "Точность сортировки", { range: { min: 0, max: 100 } }),
  q("waste.compost.temperature", "Cel", "Compost temperature", "Температура компоста"),
  q("waste.compost.moisture", "%", "Compost moisture", "Влажность компоста", { range: { min: 0, max: 100 } }),
  q("waste.truck.fill", "%", "Garbage truck fill", "Заполненность мусоровоза", { range: { min: 0, max: 100 } }),
  id("waste.facility.id", "Waste facility id", "ID объекта отходов"),
  enu("waste.stream.type", ["mixed", "organic", "plastic", "paper", "metal", "hazardous", "other"], "Waste stream type", "Тип потока отходов"),
]);

write("layer-b-aquaculture.json", [
  q("aquaculture.tank.temperature", "Cel", "Fish tank temperature", "Температура бассейна"),
  q("aquaculture.tank.do", "mg/L", "Tank dissolved oxygen", "Кислород в бассейне"),
  q("aquaculture.tank.ph", "-", "Tank pH", "pH бассейна", { range: { min: 0, max: 14 } }),
  q("aquaculture.tank.nh3", "mg/L", "Tank ammonia", "Аммиак в бассейне"),
  q("aquaculture.tank.salinity", "ppt", "Tank salinity", "Солёность бассейна"),
  q("aquaculture.feed.rate", "kg/h", "Feed rate", "Норма кормления"),
  q("aquaculture.biomass", "kg", "Biomass", "Биомасса"),
  q("aquaculture.mortality.count", "-", "Mortality count", "Отход", { encodings: ["i32"] }),
  id("aquaculture.cage.id", "Cage id", "ID садка"),
  id("aquaculture.batch.id", "Aqua batch id", "ID партии аквакультуры"),
]);

write("layer-b-wildlife.json", [
  id("wildlife.animal.id", "Wildlife animal id", "ID дикого животного"),
  id("wildlife.collar.id", "Tracking collar id", "ID ошейника"),
  q("wildlife.collar.battery", "%", "Collar battery", "Заряд ошейника", { range: { min: 0, max: 100 } }),
  q("wildlife.activity", "-", "Wildlife activity", "Активность животного"),
  q("wildlife.population.count", "-", "Population count", "Численность популяции", { encodings: ["i32"] }),
  logical("wildlife.poaching.alert", "Poaching alert", "Тревога браконьерства"),
  media("wildlife.camera.trap_ref", "Camera trap media", "Фотоловушка"),
  enu("wildlife.species.status", ["least_concern", "near_threatened", "vulnerable", "endangered", "critical"], "Conservation status", "Охранный статус"),
]);

write("layer-b-museum.json", [
  id("museum.object.id", "Museum object id", "ID экспоната"),
  id("museum.gallery.id", "Gallery id", "ID зала"),
  q("museum.showcase.temperature", "Cel", "Showcase temperature", "Температура витрины"),
  q("museum.showcase.humidity", "%", "Showcase humidity", "Влажность витрины", { range: { min: 0, max: 100 } }),
  q("museum.showcase.lux", "lx", "Showcase illuminance", "Освещённость витрины"),
  q("museum.visitor.count", "-", "Visitor count", "Число посетителей", { encodings: ["i32"] }),
  logical("museum.alarm.intrusion", "Museum intrusion alarm", "Тревога музея"),
  logical("museum.showcase.open", "Showcase open", "Витрина открыта"),
  media("museum.object.image_ref", "Object image", "Изображение экспоната"),
]);

write("layer-b-entertainment.json", [
  id("entertainment.venue.id", "Venue id", "ID площадки"),
  id("entertainment.show.id", "Show id", "ID шоу"),
  q("entertainment.audience.count", "-", "Audience count", "Число зрителей", { encodings: ["i32"] }),
  q("entertainment.stage.spl", "dB", "Stage SPL", "Уровень звука сцены"),
  q("entertainment.stage.temperature", "Cel", "Stage temperature", "Температура сцены"),
  q("entertainment.light.power", "W", "Stage lighting power", "Мощность сценического света"),
  q("entertainment.ride.speed", "m/s", "Amusement ride speed", "Скорость аттракциона"),
  q("entertainment.ride.gforce", "-", "Ride g-force", "Перегрузка аттракциона"),
  logical("entertainment.ride.e_stop", "Ride e-stop", "Аварийный стоп аттракциона"),
  enu("entertainment.show.state", ["rehearsal", "doors", "live", "intermission", "ended"], "Show state", "Состояние шоу"),
]);

write("layer-b-arvr.json", [
  q("arvr.headset.battery", "%", "Headset battery", "Заряд шлема", { range: { min: 0, max: 100 } }),
  q("arvr.headset.temperature", "Cel", "Headset temperature", "Температура шлема"),
  q("arvr.tracking.quality", "%", "Tracking quality", "Качество трекинга", { range: { min: 0, max: 100 } }),
  q("arvr.frame.rate", "/s", "XR frame rate", "Частота кадров XR"),
  q("arvr.latency", "ms", "Motion-to-photon latency", "Задержка XR"),
  q("arvr.controller.battery", "%", "Controller battery", "Заряд контроллера", { range: { min: 0, max: 100 } }),
  logical("arvr.passthrough.on", "Passthrough on", "Passthrough включён"),
  id("arvr.session.id", "XR session id", "ID XR-сессии"),
  id("arvr.device.id", "XR device id", "ID XR-устройства"),
  enu("arvr.mode", ["vr", "ar", "mr", "passthrough"], "XR mode", "Режим XR"),
]);

write("layer-b-workforce.json", [
  id("workforce.employee.id", "Employee id", "ID сотрудника", { sensitivity: "restricted" }),
  id("workforce.shift.id", "Shift id", "ID смены"),
  id("workforce.site.id", "Workforce site id", "ID площадки персонала"),
  q("workforce.hours.worked", "h", "Hours worked", "Отработанные часы", { sensitivity: "personal" }),
  q("workforce.overtime.hours", "h", "Overtime hours", "Сверхурочные", { sensitivity: "personal" }),
  logical("workforce.clocked_in", "Clocked in", "На смене", { sensitivity: "personal" }),
  q("workforce.fatigue.score", "-", "Fatigue score", "Индекс усталости", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  enu("workforce.attendance.status", ["present", "absent", "late", "leave", "remote"], "Attendance status", "Статус явки"),
  q("workforce.headcount", "-", "Headcount on site", "Численность на площадке", { encodings: ["i32"] }),
]);

write("layer-b-advertising.json", [
  id("advertising.screen.id", "DOOH screen id", "ID экрана DOOH"),
  id("advertising.campaign.id", "Campaign id", "ID кампании"),
  q("advertising.impressions", "-", "Impressions", "Показы", { encodings: ["i32", "f64"] }),
  q("advertising.playouts", "-", "Playouts", "Выходы ролика", { encodings: ["i32"] }),
  q("advertising.screen.brightness", "%", "Screen brightness ad", "Яркость экрана", { range: { min: 0, max: 100 } }),
  q("advertising.audience.dwell", "s", "Audience dwell time", "Время взгляда"),
  logical("advertising.screen.online", "Ad screen online", "Экран онлайн"),
  media("advertising.creative.ref", "Creative asset ref", "Креатив"),
  enu("advertising.campaign.status", ["draft", "scheduled", "live", "paused", "ended"], "Campaign status", "Статус кампании"),
]);

write("layer-b-vending.json", [
  id("vending.machine.id", "Vending machine id", "ID автомата"),
  id("vending.sku.id", "Vending SKU id", "SKU автомата"),
  q("vending.inventory.count", "-", "Vending inventory", "Остаток в автомате", { encodings: ["i16"] }),
  q("vending.cash.amount", "-", "Cash in machine", "Наличные в автомате", { encodings: ["f64"] }),
  q("vending.temperature", "Cel", "Vending temperature", "Температура автомата"),
  logical("vending.door.open", "Vending door open", "Дверь автомата открыта"),
  logical("vending.jam", "Vending jam", "Застревание"),
  enu("vending.state", ["ok", "empty", "fault", "offline", "maintenance"], "Vending state", "Состояние автомата"),
  cmd("vending.command", ["vend", "refund", "reboot", "lock"], "Vending command", "Команда автомата"),
]);

write("layer-b-banking_hw.json", [
  id("banking.atm.id", "ATM id", "ID банкомата"),
  id("banking.branch.id", "Branch id", "ID отделения"),
  q("banking.atm.cash_cassettes", "-", "Cash cassette fill", "Заполненность кассет", { encodings: ["f32"], range: { min: 0, max: 100 } }),
  q("banking.atm.transaction_count", "-", "ATM transactions", "Транзакции банкомата", { encodings: ["i32"] }),
  logical("banking.atm.card_retained", "Card retained", "Карта изъята"),
  logical("banking.atm.tamper", "ATM tamper", "Вскрытие банкомата"),
  logical("banking.vault.open", "Vault open", "Хранилище открыто", { sensitivity: "restricted" }),
  enu("banking.atm.state", ["in_service", "out_of_service", "maintenance", "offline"], "ATM state", "Состояние банкомата"),
  q("banking.queue.length", "-", "Branch queue length", "Очередь в отделении", { encodings: ["i16"] }),
]);

write("layer-b-customs.json", [
  id("customs.declaration.id", "Customs declaration id", "ID декларации"),
  id("customs.shipment.id", "Customs shipment id", "ID партии таможни"),
  enu("customs.inspection.status", ["pending", "cleared", "hold", "seize", "inspect"], "Inspection status", "Статус досмотра"),
  q("customs.xray.anomaly_score", "-", "X-ray anomaly score", "Скор аномалии рентгена", { range: { min: 0, max: 100 } }),
  q("customs.weight.declared", "kg", "Declared weight", "Заявленный вес"),
  q("customs.weight.measured", "kg", "Measured weight", "Измеренный вес"),
  logical("customs.seal.intact", "Seal intact", "Пломба цела"),
  media("customs.scan.ref", "Customs scan media", "Скан таможни"),
]);

write("layer-b-postal.json", [
  id("postal.office.id", "Post office id", "ID отделения связи"),
  id("postal.item.id", "Postal item id", "ID почтового отправления"),
  enu("postal.item.status", ["accepted", "in_transit", "out_for_delivery", "delivered", "returned", "lost"], "Postal item status", "Статус ПО"),
  q("postal.item.weight", "kg", "Postal item weight", "Масса ПО"),
  q("postal.sorting.throughput", "/h", "Sorting throughput", "Производительность сортировки"),
  q("postal.delivery.attempts", "-", "Delivery attempts", "Попытки вручения", { encodings: ["u8"] }),
  logical("postal.mailbox.full", "Mailbox full", "Ящик переполнен"),
]);

write("layer-b-care.json", [
  id("care.facility.id", "Care facility id", "ID учреждения ухода"),
  id("care.resident.id", "Resident id", "ID проживающего", { sensitivity: "restricted" }),
  q("care.room.temperature", "Cel", "Care room temperature", "Температура комнаты ухода"),
  logical("care.bed.occupied", "Bed occupied", "Кровать занята"),
  logical("care.bed.exit", "Bed exit alarm", "Выход из кровати"),
  logical("care.fall.detected", "Fall detected", "Падение обнаружено", { sensitivity: "personal" }),
  q("care.nurse.call.count", "-", "Nurse call count", "Вызовы медсестры", { encodings: ["i32"] }),
  enu("care.alert.priority", ["low", "medium", "high", "critical"], "Care alert priority", "Приоритет оповещения"),
  cmd("care.nurse_call", ["call", "ack", "cancel"], "Nurse call command", "Вызов медсестры"),
]);

write("layer-b-imaging.json", [
  id("imaging.study.id", "Imaging study id", "ID исследования", { sensitivity: "restricted" }),
  id("imaging.device.id", "Imaging device id", "ID аппарата"),
  enu("imaging.modality", ["xr", "ct", "mr", "us", "pet", "mg", "other"], "Imaging modality", "Модальность"),
  q("imaging.dose.ctdi", "mGy", "CTDIvol", "CTDIvol", { sensitivity: "personal" }),
  q("imaging.dose.dap", "Gy.cm2", "Dose area product", "Произведение доза-площадь", { sensitivity: "personal" }),
  q("imaging.mr.field", "T", "MR field strength", "Индукция МРТ"),
  q("imaging.us.frequency", "MHz", "Ultrasound frequency", "Частота УЗИ"),
  enu("imaging.study.status", ["scheduled", "in_progress", "complete", "cancelled"], "Study status", "Статус исследования"),
  media("imaging.dicom.ref", "DICOM reference", "Ссылка DICOM"),
]);

write("layer-b-cnc.json", [
  q("cnc.spindle.rpm", "/min", "Spindle RPM", "Обороты шпинделя"),
  q("cnc.spindle.load", "%", "Spindle load", "Нагрузка шпинделя", { range: { min: 0, max: 200 } }),
  q("cnc.feed.rate", "mm/min", "Feed rate", "Подача"),
  q("cnc.tool.wear", "%", "Tool wear", "Износ инструмента", { range: { min: 0, max: 100 } }),
  q("cnc.axis.x", "mm", "Axis X position", "Координата X"),
  q("cnc.axis.y", "mm", "Axis Y position", "Координата Y"),
  q("cnc.axis.z", "mm", "Axis Z position", "Координата Z"),
  q("cnc.coolant.flow", "L/min", "Coolant flow", "Расход СОЖ"),
  q("cnc.coolant.temperature", "Cel", "Coolant temperature", "Температура СОЖ"),
  logical("cnc.door.open", "CNC door open", "Дверь станка открыта"),
  enu("cnc.state", ["idle", "running", "feed_hold", "alarm", "setup"], "CNC state", "Состояние ЧПУ"),
  id("cnc.machine.id", "CNC machine id", "ID станка ЧПУ"),
  id("cnc.program.id", "CNC program id", "ID программы ЧПУ"),
]);

write("layer-b-welding.json", [
  q("welding.current", "A", "Welding current", "Сварочный ток"),
  q("welding.voltage", "V", "Welding voltage", "Сварочное напряжение"),
  q("welding.wire.speed", "m/min", "Wire feed speed", "Скорость подачи проволоки"),
  q("welding.gas.flow", "L/min", "Shielding gas flow", "Расход защитного газа"),
  q("welding.arc.time", "s", "Arc time", "Время горения дуги"),
  q("welding.heat.input", "kJ/mm", "Heat input", "Погонная энергия"),
  logical("welding.arc.on", "Arc on", "Дуга горит"),
  id("welding.wps.id", "WPS id", "ID WPS"),
  id("welding.joint.id", "Weld joint id", "ID сварного шва"),
  enu("welding.process", ["mig", "tig", "stick", "saw", "laser", "other"], "Welding process", "Способ сварки"),
]);

write("layer-b-compressed_air.json", [
  q("compressed_air.pressure", "kPa", "Compressed air pressure", "Давление сжатого воздуха"),
  q("compressed_air.flow", "m3/h", "Compressed air flow", "Расход сжатого воздуха"),
  q("compressed_air.dewpoint", "Cel", "Compressed air dew point", "Точка росы сжатого воздуха"),
  q("compressed_air.compressor.power", "W", "Compressor power", "Мощность компрессора"),
  q("compressed_air.compressor.temperature", "Cel", "Compressor temperature", "Температура компрессора"),
  q("compressed_air.leak.estimate", "m3/h", "Air leak estimate", "Оценка утечек воздуха"),
  logical("compressed_air.dryer.fault", "Dryer fault", "Неисправность осушителя"),
  id("compressed_air.system.id", "Compressed air system id", "ID системы сжатого воздуха"),
]);

write("layer-b-government.json", [
  id("government.agency.id", "Agency id", "ID ведомства"),
  id("government.service.id", "Public service id", "ID госуслуги"),
  id("government.case.id", "Case id", "ID дела", { sensitivity: "restricted" }),
  enu("government.case.status", ["submitted", "in_review", "approved", "rejected", "closed"], "Case status", "Статус обращения"),
  q("government.queue.wait", "min", "Service wait time", "Ожидание в МФЦ/службе"),
  q("government.kiosk.uptime", "%", "Kiosk uptime", "Аптайм киоска", { range: { min: 0, max: 100 } }),
  logical("government.kiosk.online", "Service kiosk online", "Киоск онлайн"),
]);

write("layer-b-legal.json", [
  id("legal.matter.id", "Legal matter id", "ID дела", { sensitivity: "restricted" }),
  id("legal.contract.id", "Contract id", "ID договора", { sensitivity: "restricted" }),
  id("legal.party.id", "Party id", "ID стороны", { sensitivity: "restricted" }),
  enu("legal.contract.status", ["draft", "review", "signed", "active", "terminated", "expired"], "Contract status", "Статус договора"),
  q("legal.deadline", "s", "Legal deadline unix", "Дедлайн (юр.)", { encodings: ["i32", "f64"] }),
  media("legal.document.ref", "Legal document ref", "Юридический документ"),
  logical("legal.hold.active", "Legal hold active", "Legal hold активен", { sensitivity: "restricted" }),
]);

write("layer-b-crypto_hw.json", [
  q("crypto.miner.hashrate", "/s", "Miner hashrate", "Хешрейт"),
  q("crypto.miner.power", "W", "Miner power", "Мощность майнера"),
  q("crypto.miner.temperature", "Cel", "Miner temperature", "Температура майнера"),
  q("crypto.miner.fan_rpm", "/min", "Miner fan RPM", "Обороты вентилятора майнера"),
  q("crypto.node.peers", "-", "Node peer count", "Число пиров", { encodings: ["i32"] }),
  q("crypto.node.block_height", "-", "Block height", "Высота блока", { encodings: ["i32", "f64"] }),
  id("crypto.miner.id", "Miner id", "ID майнера"),
  id("crypto.wallet.address", "Wallet address", "Адрес кошелька", { sensitivity: "restricted" }),
  enu("crypto.miner.state", ["mining", "idle", "fault", "offline"], "Miner state", "Состояние майнера"),
]);

write("layer-b-hvac_plant.json", [
  q("hvac.chiller.power", "W", "Chiller power", "Мощность чиллера"),
  q("hvac.chiller.cop", "-", "Chiller COP", "COP чиллера"),
  q("hvac.chiller.leaving_temp", "Cel", "Chilled water leaving temp", "Т уходящей охл. воды"),
  q("hvac.chiller.entering_temp", "Cel", "Chilled water entering temp", "Т входящей охл. воды"),
  q("hvac.boiler.power", "W", "Boiler power", "Мощность котла"),
  q("hvac.boiler.efficiency", "%", "Boiler efficiency", "КПД котла", { range: { min: 0, max: 100 } }),
  q("hvac.cooling_tower.approach", "Cel", "Cooling tower approach", "Аппроуч градирни"),
  q("hvac.cooling_tower.fan_speed", "%", "Cooling tower fan", "Вентилятор градирни", { range: { min: 0, max: 100 } }),
  q("hvac.ahu.static_pressure", "Pa", "AHU static pressure", "Статическое давление ПВУ"),
  id("hvac.plant.id", "HVAC plant id", "ID теплохладоцентра"),
  enu("hvac.chiller.state", ["off", "starting", "running", "unloading", "fault"], "Chiller state", "Состояние чиллера"),
]);

write("layer-b-battery_factory.json", [
  q("battery.cell.voltage", "V", "Cell voltage", "Напряжение ячейки"),
  q("battery.cell.capacity", "A.h", "Cell capacity", "Ёмкость ячейки"),
  q("battery.cell.impedance", "Ohm", "Cell impedance", "Сопротивление ячейки"),
  q("battery.formation.current", "A", "Formation current", "Ток формирования"),
  q("battery.formation.temperature", "Cel", "Formation temperature", "Температура формирования"),
  q("battery.module.soc", "%", "Module SoC factory", "SoC модуля (производство)", { range: { min: 0, max: 100 } }),
  q("battery.eol.capacity_retention", "%", "EOL capacity retention", "Остаточная ёмкость", { range: { min: 0, max: 100 } }),
  id("battery.cell.id", "Cell id", "ID ячейки"),
  id("battery.lot.id", "Battery lot id", "ID партии АКБ"),
  enu("battery.test.result", ["pass", "fail", "rework", "quarantine"], "Battery test result", "Результат теста АКБ"),
]);

console.log("Layer B4 seeds written");
