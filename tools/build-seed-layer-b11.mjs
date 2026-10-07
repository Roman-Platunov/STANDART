#!/usr/bin/env node
/**
 * Layer B11 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B11", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-wind_farm.json", [
  id("wind_farm.id", "Wind farm id", "ID ветропарка"),
  id("wind_farm.turbine.id", "Wind turbine id", "ID ветротурбины"),
  q("wind_farm.power", "W", "Farm power", "Мощность ветропарка"),
  q("wind_farm.turbine.power", "W", "Turbine power", "Мощность турбины"),
  q("wind_farm.wind.speed", "m/s", "Hub wind speed", "Скорость ветра на ступице"),
  q("wind_farm.availability", "%", "Turbine availability", "Доступность турбины", { range: { min: 0, max: 100 } }),
  q("wind_farm.curtailment", "%", "Curtailment", "Ограничение выдачи", { range: { min: 0, max: 100 } }),
  enu("wind_farm.turbine.state", ["producing", "idle", "curtailed", "fault", "maintenance"], "Turbine state", "Состояние турбины"),
]);

write("layer-b-solar_farm.json", [
  id("solar_farm.id", "Solar farm id", "ID солнечной станции"),
  id("solar_farm.inverter.id", "Farm inverter id", "ID инвертора СЭС"),
  q("solar_farm.power.ac", "W", "AC power", "Мощность AC"),
  q("solar_farm.irradiance", "W/m2", "POA irradiance", "Облучённость POA"),
  q("solar_farm.pr", "%", "Performance ratio", "Performance ratio", { range: { min: 0, max: 100 } }),
  q("solar_farm.soiling", "%", "Soiling loss", "Потери от загрязнения", { range: { min: 0, max: 100 } }),
  q("solar_farm.tracker.angle", "deg", "Tracker angle", "Угол трекера"),
  enu("solar_farm.state", ["producing", "curtailed", "night", "fault", "cleaning"], "Solar farm state", "Состояние СЭС"),
]);

write("layer-b-hydro_gen.json", [
  id("hydro_gen.unit.id", "Hydro generator id", "ID гидрогенератора"),
  q("hydro_gen.power", "W", "Generator power", "Мощность генератора"),
  q("hydro_gen.voltage", "V", "Terminal voltage", "Напряжение на выводах"),
  q("hydro_gen.frequency", "Hz", "Frequency", "Частота"),
  q("hydro_gen.stator.temp", "Cel", "Stator temperature", "Температура статора"),
  q("hydro_gen.bearing.temp", "Cel", "Bearing temperature", "Температура подшипника"),
  q("hydro_gen.excitation.current", "A", "Excitation current", "Ток возбуждения"),
  enu("hydro_gen.state", ["offline", "sync", "generate", "condense", "fault"], "Generator state", "Состояние генератора"),
]);

write("layer-b-grid_ops.json", [
  id("grid_ops.control.id", "Grid control area id", "ID зоны управления"),
  id("grid_ops.tie.id", "Tie-line id", "ID межсистемной связи"),
  q("grid_ops.frequency", "Hz", "System frequency", "Частота системы"),
  q("grid_ops.ace", "W", "Area control error", "Ошибка регулирования зоны"),
  q("grid_ops.reserve.spinning", "W", "Spinning reserve", "Вращающийся резерв"),
  q("grid_ops.load", "W", "System load", "Нагрузка системы"),
  logical("grid_ops.underfreq", "Under-frequency event", "Снижение частоты"),
  enu("grid_ops.mode", ["normal", "alert", "emergency", "restorative"], "Grid ops mode", "Режим энергосистемы"),
]);

write("layer-b-transmission.json", [
  id("transmission.line.id", "Transmission line id", "ID ЛЭП"),
  id("transmission.tower.id", "Tower id", "ID опоры"),
  q("transmission.line.mw", "W", "Line active power", "Активная мощность линии"),
  q("transmission.line.mvar", "var", "Line reactive power", "Реактивная мощность линии"),
  q("transmission.line.loading", "%", "Line loading", "Загрузка линии", { range: { min: 0, max: 150 } }),
  q("transmission.sag", "m", "Conductor sag", "Провес провода"),
  logical("transmission.fault", "Line fault", "Повреждение линии"),
  enu("transmission.voltage.class", ["110", "220", "330", "500", "750", "other"], "Voltage class kV", "Класс напряжения"),
]);

write("layer-b-distribution_feeder.json", [
  id("distribution_feeder.id", "Distribution feeder id", "ID распределительного фидера"),
  id("distribution_feeder.recloser.id", "Recloser id", "ID реклоузера"),
  q("distribution_feeder.current", "A", "Feeder current", "Ток фидера"),
  q("distribution_feeder.voltage", "V", "Feeder voltage", "Напряжение фидера"),
  q("distribution_feeder.customers.out", "-", "Customers out", "Потребителей без питания", { encodings: ["i32"] }),
  q("distribution_feeder.saidi.min", "min", "SAIDI minutes", "SAIDI минуты"),
  logical("distribution_feeder.lockout", "Recloser lockout", "Блокировка реклоузера"),
  enu("distribution_feeder.state", ["energized", "faulted", "sectionalized", "outage", "maintenance"], "Feeder state", "Состояние фидера"),
]);

write("layer-b-capacitor_bank.json", [
  id("capacitor_bank.id", "Capacitor bank id", "ID батареи конденсаторов"),
  q("capacitor_bank.kvar", "var", "Reactive output", "Реактивная мощность"),
  q("capacitor_bank.voltage", "V", "Bank voltage", "Напряжение батареи"),
  q("capacitor_bank.steps", "-", "Steps online", "Включённых ступеней", { encodings: ["i16"] }),
  q("capacitor_bank.temp", "Cel", "Bank temperature", "Температура батареи"),
  logical("capacitor_bank.online", "Bank online", "Батарея включена"),
  enu("capacitor_bank.control", ["fixed", "voltage", "var", "time", "remote"], "Control mode", "Режим управления"),
  enu("capacitor_bank.state", ["off", "partial", "full", "fault", "locked"], "Bank state", "Состояние батареи"),
]);

write("layer-b-reactor_shunt.json", [
  id("reactor_shunt.id", "Shunt reactor id", "ID шунтирующего реактора"),
  q("reactor_shunt.mvar", "var", "Absorbed reactive power", "Потребляемая реактивная мощность"),
  q("reactor_shunt.current", "A", "Reactor current", "Ток реактора"),
  q("reactor_shunt.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  q("reactor_shunt.winding.temp", "Cel", "Winding temperature", "Температура обмотки"),
  logical("reactor_shunt.online", "Reactor online", "Реактор включён"),
  enu("reactor_shunt.cooling", ["on", "off", "auto"], "Cooling state", "Охлаждение"),
  enu("reactor_shunt.state", ["offline", "online", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-synchrophasor.json", [
  id("synchrophasor.pmu.id", "PMU id", "ID УСВИ"),
  id("synchrophasor.pdc.id", "PDC id", "ID PDC"),
  q("synchrophasor.voltage.mag", "V", "Voltage magnitude", "Модуль напряжения"),
  q("synchrophasor.voltage.angle", "deg", "Voltage angle", "Угол напряжения"),
  q("synchrophasor.frequency", "Hz", "Frequency", "Частота"),
  q("synchrophasor.rocof", "Hz/s", "Rate of change of frequency", "Скорость изменения частоты"),
  logical("synchrophasor.stream.ok", "PMU stream healthy", "Поток УСВИ OK"),
  enu("synchrophasor.quality", ["good", "suspect", "bad", "offline"], "Data quality", "Качество данных"),
]);

write("layer-b-meter_data.json", [
  id("meter_data.meter.id", "Interval meter id", "ID интервального счётчика"),
  id("meter_data.channel.id", "Meter channel id", "ID канала учёта"),
  q("meter_data.kwh", "Wh", "Interval energy", "Энергия интервала"),
  q("meter_data.kw", "W", "Interval demand", "Мощность интервала"),
  q("meter_data.interval.min", "min", "Interval length", "Длина интервала"),
  logical("meter_data.estimated", "Estimated read", "Оценочное показание"),
  enu("meter_data.status", ["actual", "estimated", "missing", "edited"], "Read status", "Статус показания"),
  enu("meter_data.tou", ["peak", "offpeak", "shoulder", "critical", "flat"], "TOU period", "Период ТОУ"),
]);

write("layer-b-demand_response.json", [
  id("demand_response.event.id", "DR event id", "ID события УС"),
  id("demand_response.resource.id", "DR resource id", "ID ресурса УС"),
  q("demand_response.curtail.kw", "W", "Curtailed demand", "Сниженная нагрузка"),
  q("demand_response.baseline.kw", "W", "Baseline demand", "Базовая нагрузка"),
  q("demand_response.duration.min", "min", "Event duration", "Длительность события"),
  logical("demand_response.opt_out", "Customer opt-out", "Отказ клиента"),
  enu("demand_response.program", ["capacity", "energy", "ancillary", "emergency", "other"], "DR program", "Программа УС"),
  enu("demand_response.state", ["scheduled", "active", "complete", "cancelled", "failed"], "Event state", "Состояние события"),
]);

write("layer-b-vpp.json", [
  id("vpp.id", "Virtual power plant id", "ID виртуальной электростанции"),
  id("vpp.asset.id", "VPP asset id", "ID актива ВЭС"),
  q("vpp.capacity.available", "W", "Available capacity", "Доступная мощность"),
  q("vpp.dispatch.kw", "W", "Dispatched power", "Диспетчеризуемая мощность"),
  q("vpp.assets.online", "-", "Assets online", "Активов online", { encodings: ["i32"] }),
  q("vpp.forecast.error", "%", "Forecast error", "Ошибка прогноза", { range: { min: 0, max: 100 } }),
  logical("vpp.market.cleared", "Market cleared", "Рынок закрыт"),
  enu("vpp.mode", ["aggregate", "dispatch", "standby", "fault"], "VPP mode", "Режим ВЭС"),
]);

write("layer-b-ev_depot.json", [
  id("ev_depot.id", "EV depot id", "ID депо ЭС"),
  id("ev_depot.charger.id", "Depot charger id", "ID зарядки депо"),
  q("ev_depot.fleet.soc_avg", "%", "Fleet average SoC", "Средний SoC флота", { range: { min: 0, max: 100 } }),
  q("ev_depot.power.total", "W", "Total depot charging power", "Суммарная мощность зарядки"),
  q("ev_depot.vehicles.charging", "-", "Vehicles charging", "ТС на зарядке", { encodings: ["i16"] }),
  q("ev_depot.schedule.deficit", "Wh", "Energy schedule deficit", "Дефицит энергии расписания"),
  logical("ev_depot.grid.limit", "Grid limit active", "Лимит сети активен"),
  enu("ev_depot.mode", ["overnight", "opportunity", "v2g", "idle", "peak_avoid"], "Depot charge mode", "Режим зарядки депо"),
]);

write("layer-b-hydrogen_plant.json", [
  id("hydrogen_plant.id", "Hydrogen plant id", "ID водородного завода"),
  id("hydrogen_plant.stack.id", "Electrolyzer stack id", "ID стека электролизёра"),
  q("hydrogen_plant.power", "W", "Electrolyzer power", "Мощность электролизёра"),
  q("hydrogen_plant.h2.rate", "kg/h", "H2 production rate", "Производительность H₂"),
  q("hydrogen_plant.efficiency", "%", "System efficiency", "КПД системы", { range: { min: 0, max: 100 } }),
  q("hydrogen_plant.o2.purity", "%", "O2 purity", "Чистота O₂", { range: { min: 0, max: 100 } }),
  q("hydrogen_plant.stack.temp", "Cel", "Stack temperature", "Температура стека"),
  enu("hydrogen_plant.type", ["alkaline", "pem", "soec", "aem", "other"], "Electrolyzer type", "Тип электролизёра"),
]);

write("layer-b-co2_capture.json", [
  id("co2_capture.unit.id", "Capture unit id", "ID установки улавливания"),
  id("co2_capture.plant.id", "Host plant id", "ID площадки улавливания"),
  q("co2_capture.rate", "t/h", "CO2 capture rate", "Скорость улавливания CO₂"),
  q("co2_capture.capture.pct", "%", "Capture percentage", "Доля улавливания", { range: { min: 0, max: 100 } }),
  q("co2_capture.solvent.lean", "-", "Lean solvent loading", "Нагрузка бедного растворителя"),
  q("co2_capture.energy.penalty", "kWh/t", "Energy penalty", "Энергозатраты на тонну"),
  q("co2_capture.purity", "%", "CO2 product purity", "Чистота CO₂", { range: { min: 0, max: 100 } }),
  enu("co2_capture.tech", ["amine", "oxyfuel", "membrane", "calcium", "other"], "Capture technology", "Технология улавливания"),
]);

write("layer-b-co2_transport.json", [
  id("co2_transport.pipeline.id", "CO2 pipeline id", "ID CO₂-трубопровода"),
  id("co2_transport.compressor.id", "CO2 compressor id", "ID компрессора CO₂"),
  q("co2_transport.flow", "t/h", "CO2 mass flow", "Массовый расход CO₂"),
  q("co2_transport.pressure", "Pa", "Pipeline pressure", "Давление трубопровода"),
  q("co2_transport.temp", "Cel", "Pipeline temperature", "Температура трубопровода"),
  q("co2_transport.phase", "-", "Phase indicator 0=gas 1=dense", "Фаза 0=газ 1=плотная", { encodings: ["u8"] }),
  logical("co2_transport.leak.suspect", "Leak suspect", "Подозрение на утечку"),
  enu("co2_transport.state", ["idle", "flowing", "vent", "maintenance", "fault"], "Transport state", "Состояние транспорта"),
]);

write("layer-b-co2_storage.json", [
  id("co2_storage.site.id", "CO2 storage site id", "ID хранилища CO₂"),
  id("co2_storage.well.id", "Injection well id", "ID нагнетательной скважины"),
  q("co2_storage.injection.rate", "t/d", "Injection rate", "Скорость закачки"),
  q("co2_storage.reservoir.pressure", "Pa", "Reservoir pressure", "Пластовое давление"),
  q("co2_storage.plume.area_km2", "km2", "Plume area", "Площадь шлейфа"),
  q("co2_storage.seismic.rate", "/d", "Induced seismicity rate", "Частота наведённой сейсмичности"),
  logical("co2_storage.mmv.alert", "MMV alert", "Тревога МКиВ"),
  enu("co2_storage.state", ["inject", "monitor", "suspend", "close", "post_closure"], "Storage state", "Состояние хранения"),
]);

write("layer-b-methane_monitor.json", [
  id("methane_monitor.site.id", "Methane site id", "ID площадки метана"),
  id("methane_monitor.sensor.id", "Methane sensor id", "ID датчика метана"),
  q("methane_monitor.ch4", "ppm", "Methane concentration", "Концентрация метана"),
  q("methane_monitor.flux", "kg/h", "Emission flux", "Поток выбросов"),
  q("methane_monitor.wind", "m/s", "Local wind", "Локальный ветер"),
  logical("methane_monitor.leak", "Leak detected", "Утечка обнаружена"),
  media("methane_monitor.plume.ref", "Plume map ref", "Референс карты шлейфа"),
  enu("methane_monitor.source", ["oilgas", "landfill", "agri", "coal", "other"], "Source sector", "Сектор источника"),
]);

write("layer-b-flaring.json", [
  id("flaring.stack.id", "Flare stack id", "ID факельной трубы"),
  q("flaring.flow", "kg/h", "Flare gas flow", "Расход на факел"),
  q("flaring.pilot.flame", "-", "Pilot flame on 1/0", "Дежурный факел", { encodings: ["u8"] }),
  q("flaring.temp", "Cel", "Flare tip temperature", "Температура оголовка"),
  q("flaring.smoke.index", "-", "Smoke index", "Индекс дымности"),
  q("flaring.efficiency", "%", "Destruction efficiency", "Эффективность сжигания", { range: { min: 0, max: 100 } }),
  logical("flaring.unlit", "Unlit flare", "Незаженный факел"),
  enu("flaring.state", ["pilot", "flaring", "steam_assist", "off", "fault"], "Flare state", "Состояние факела"),
]);

write("layer-b-venting.json", [
  id("venting.source.id", "Vent source id", "ID источника сброса"),
  q("venting.flow", "kg/h", "Vent flow", "Расход сброса"),
  q("venting.duration.min", "min", "Vent duration", "Длительность сброса"),
  q("venting.gas.ch4_frac", "%", "Methane fraction", "Доля метана", { range: { min: 0, max: 100 } }),
  logical("venting.authorized", "Authorized vent", "Разрешённый сброс"),
  logical("venting.emergency", "Emergency vent", "Аварийный сброс"),
  enu("venting.reason", ["maintenance", "upset", "startup", "blowdown", "other"], "Vent reason", "Причина сброса"),
  enu("venting.state", ["idle", "venting", "complete", "fault"], "Vent state", "Состояние сброса"),
]);

write("layer-b-leak_detection.json", [
  id("leak_detection.segment.id", "Pipeline segment id", "ID участка трубопровода"),
  id("leak_detection.system.id", "LDS system id", "ID системы обнаружения утечек"),
  q("leak_detection.pressure.drop", "Pa", "Pressure drop anomaly", "Аномалия падения давления"),
  q("leak_detection.flow.imbalance", "%", "Flow imbalance", "Дисбаланс расхода", { range: { min: 0, max: 100 } }),
  q("leak_detection.location.km", "km", "Estimated leak location", "Оценка места утечки"),
  q("leak_detection.rate.estimate", "kg/h", "Estimated leak rate", "Оценка расхода утечки"),
  logical("leak_detection.alarm", "Leak alarm", "Тревога утечки"),
  enu("leak_detection.method", ["cpm", "rttm", "acoustic", "fiber", "mass_balance", "other"], "LDS method", "Метод СОУ"),
]);

write("layer-b-pigging.json", [
  id("pigging.run.id", "Pig run id", "ID прогона снаряда"),
  id("pigging.tool.id", "Pig tool id", "ID внутритрубного снаряда"),
  q("pigging.odometer", "km", "Pig odometer", "Одометр снаряда"),
  q("pigging.speed", "m/s", "Pig speed", "Скорость снаряда"),
  q("pigging.pressure.diff", "Pa", "Differential pressure", "Перепад давления"),
  logical("pigging.stuck", "Pig stuck", "Снаряд застрял"),
  enu("pigging.tool.type", ["cleaning", "gauging", "mfl", "ut", "geo", "other"], "Pig type", "Тип снаряда"),
  enu("pigging.state", ["launch", "run", "receive", "stuck", "abort"], "Pig run state", "Состояние прогона"),
]);

write("layer-b-cathodic_protection.json", [
  id("cathodic_protection.rectifier.id", "CP rectifier id", "ID станции катодной защиты"),
  id("cathodic_protection.testpoint.id", "CP test point id", "ID контрольно-измерительного пункта"),
  q("cathodic_protection.voltage", "V", "Rectifier voltage", "Напряжение выпрямителя"),
  q("cathodic_protection.current", "A", "Rectifier current", "Ток выпрямителя"),
  q("cathodic_protection.pipe.potential", "mV", "Pipe-to-soil potential", "Потенциал труба–земля"),
  q("cathodic_protection.on.pct", "%", "On potential compliance", "Соответствие критерию", { range: { min: 0, max: 100 } }),
  logical("cathodic_protection.alarm", "CP alarm", "Тревога КЗ"),
  enu("cathodic_protection.state", ["on", "off", "interrupted", "fault"], "CP state", "Состояние КЗ"),
]);

write("layer-b-right_of_way.json", [
  id("right_of_way.segment.id", "ROW segment id", "ID участка трассы"),
  id("right_of_way.patrol.id", "Patrol id", "ID обхода"),
  q("right_of_way.vegetation.height", "m", "Vegetation height", "Высота растительности"),
  q("right_of_way.clearance", "m", "Ground clearance", "Клиренс"),
  q("right_of_way.encroachment.count", "-", "Encroachments", "Нарушений охранной зоны", { encodings: ["i32"] }),
  logical("right_of_way.access.blocked", "Access blocked", "Доступ перекрыт"),
  media("right_of_way.drone.ref", "ROW drone survey ref", "Референс облёта трассы"),
  enu("right_of_way.condition", ["clear", "overgrown", "encroached", "washout", "unknown"], "ROW condition", "Состояние трассы"),
]);

write("layer-b-scada_historian.json", [
  id("scada_historian.server.id", "Historian server id", "ID сервера историка"),
  id("scada_historian.tag.id", "Historian tag id", "ID тега историка"),
  q("scada_historian.write.rate", "/s", "Write rate", "Скорость записи"),
  q("scada_historian.lag.s", "s", "Ingest lag", "Отставание записи"),
  q("scada_historian.storage.pct", "%", "Storage used", "Использование хранилища", { range: { min: 0, max: 100 } }),
  logical("scada_historian.archive.ok", "Archive healthy", "Архив здоров"),
  enu("scada_historian.quality", ["good", "uncertain", "bad", "not_connected"], "Tag quality", "Качество тега"),
  enu("scada_historian.state", ["online", "degraded", "offline", "maintenance"], "Historian state", "Состояние историка"),
]);

write("layer-b-oms.json", [
  id("oms.outage.id", "Outage id", "ID отключения"),
  id("oms.feeder.id", "Affected feeder id", "ID затронутого фидера"),
  q("oms.customers.affected", "-", "Customers affected", "Затронутых потребителей", { encodings: ["i32"] }),
  q("oms.etr.min", "min", "Estimated time to restore", "Оценка времени восстановления"),
  q("oms.crews.assigned", "-", "Crews assigned", "Назначенных бригад", { encodings: ["i16"] }),
  logical("oms.confirmed", "Outage confirmed", "Отключение подтверждено"),
  enu("oms.cause", ["equipment", "vegetation", "weather", "animal", "public", "unknown"], "Outage cause", "Причина отключения"),
  enu("oms.state", ["reported", "confirmed", "crew_enroute", "restoring", "restored", "cancelled"], "Outage state", "Состояние отключения"),
]);

write("layer-b-dms.json", [
  id("dms.network.id", "DMS network model id", "ID модели сети DMS"),
  id("dms.switch.id", "Switching device id", "ID коммутационного аппарата"),
  q("dms.voltage.violation", "-", "Voltage violations", "Нарушений напряжения", { encodings: ["i32"] }),
  q("dms.loss.pct", "%", "Technical losses", "Технические потери", { range: { min: 0, max: 100 } }),
  q("dms.flisr.ops", "-", "FLISR operations today", "Операций FLISR сегодня", { encodings: ["i16"] }),
  logical("dms.study.mode", "Study mode active", "Режим расчёта"),
  enu("dms.switch.state", ["open", "closed", "racked_out", "unknown"], "Switch state", "Состояние выключателя"),
  enu("dms.mode", ["monitor", "advisory", "closed_loop", "manual"], "DMS mode", "Режим DMS"),
]);

write("layer-b-ems.json", [
  id("ems.area.id", "EMS control area id", "ID зоны EMS"),
  id("ems.unit.id", "Generating unit id", "ID генерирующего блока"),
  q("ems.generation", "W", "Area generation", "Генерация зоны"),
  q("ems.load", "W", "Area load", "Нагрузка зоны"),
  q("ems.interchange", "W", "Net interchange", "Сальдо перетоков"),
  q("ems.agc.units", "-", "Units on AGC", "Блоков на АРЧМ", { encodings: ["i16"] }),
  logical("ems.contingency.alarm", "Contingency alarm", "Тревога по N-1"),
  enu("ems.state", ["normal", "alert", "emergency", "restorative"], "EMS state", "Состояние EMS"),
]);

write("layer-b-weather_ops.json", [
  id("weather_ops.station.id", "Ops weather station id", "ID оперативной метеостанции"),
  q("weather_ops.temp", "Cel", "Air temperature", "Температура воздуха"),
  q("weather_ops.wind.gust", "m/s", "Wind gust", "Порыв ветра"),
  q("weather_ops.precip", "mm/h", "Precipitation rate", "Интенсивность осадков"),
  q("weather_ops.visibility", "m", "Visibility", "Видимость"),
  q("weather_ops.lightning.rate", "/min", "Lightning rate", "Частота молний"),
  logical("weather_ops.warning", "Weather warning active", "Метеопредупреждение"),
  enu("weather_ops.hazard", ["none", "wind", "ice", "flood", "heat", "storm"], "Dominant hazard", "Доминирующая опасность"),
]);

write("layer-b-icing.json", [
  id("icing.site.id", "Icing site id", "ID площадки обледенения"),
  q("icing.accretion", "mm", "Ice accretion", "Нарост льда"),
  q("icing.rate", "mm/h", "Icing rate", "Скорость обледенения"),
  q("icing.temp", "Cel", "Surface temperature", "Температура поверхности"),
  q("icing.load", "kg/m", "Ice load on conductor", "Гололёдная нагрузка"),
  logical("icing.alert", "Icing alert", "Тревога обледенения"),
  enu("icing.type", ["rime", "glaze", "wet_snow", "frost", "none"], "Ice type", "Тип обледенения"),
  enu("icing.severity", ["none", "light", "moderate", "severe"], "Icing severity", "Тяжесть обледенения"),
]);

write("layer-b-vegetation_mgmt.json", [
  id("vegetation_mgmt.span.id", "Line span id", "ID пролёта"),
  id("vegetation_mgmt.work.id", "Vegetation work order id", "ID работ по растительности"),
  q("vegetation_mgmt.clearance", "m", "Vegetation clearance", "Клиренс до растительности"),
  q("vegetation_mgmt.growth.rate", "m/y", "Growth rate", "Скорость роста"),
  q("vegetation_mgmt.risk.score", "-", "Risk score", "Оценка риска", { range: { min: 0, max: 100 } }),
  logical("vegetation_mgmt.trim.due", "Trim due", "Требуется обрезка"),
  media("vegetation_mgmt.lidar.ref", "LiDAR survey ref", "Референс LiDAR"),
  enu("vegetation_mgmt.priority", ["routine", "priority", "urgent", "emergency"], "Work priority", "Приоритет работ"),
]);

write("layer-b-asset_health.json", [
  id("asset_health.asset.id", "Asset id", "ID актива"),
  q("asset_health.index", "-", "Health index", "Индекс состояния", { range: { min: 0, max: 100 } }),
  q("asset_health.risk", "-", "Risk score", "Оценка риска", { range: { min: 0, max: 100 } }),
  q("asset_health.age.y", "y", "Asset age years", "Возраст актива"),
  q("asset_health.rul.y", "y", "Remaining useful life", "Остаточный ресурс"),
  logical("asset_health.replace.due", "Replacement due", "Требуется замена"),
  enu("asset_health.condition", ["good", "fair", "poor", "critical", "unknown"], "Condition grade", "Оценка состояния"),
  enu("asset_health.strategy", ["run_to_fail", "time_based", "condition", "risk_based"], "Maintenance strategy", "Стратегия ТО"),
]);

write("layer-b-work_management.json", [
  id("work_management.order.id", "Work management order id", "ID наряда управления работами"),
  id("work_management.crew.id", "Crew id", "ID бригады"),
  q("work_management.priority", "-", "Priority", "Приоритет", { encodings: ["i16"] }),
  q("work_management.eta.min", "min", "ETA to site", "ETA на объект"),
  q("work_management.duration.min", "min", "Planned duration", "Плановая длительность"),
  logical("work_management.switching.required", "Switching required", "Требуются переключения"),
  enu("work_management.type", ["construction", "maintenance", "emergency", "inspection", "other"], "Work type", "Тип работ"),
  enu("work_management.status", ["planned", "scheduled", "dispatched", "on_site", "complete", "cancelled"], "Work status", "Статус работ"),
]);

write("layer-b-switching_order.json", [
  id("switching_order.id", "Switching order id", "ID бланка переключений"),
  id("switching_order.step.id", "Switching step id", "ID шага переключений"),
  q("switching_order.steps.total", "-", "Total steps", "Всего шагов", { encodings: ["i16"] }),
  q("switching_order.steps.done", "-", "Completed steps", "Выполненных шагов", { encodings: ["i16"] }),
  logical("switching_order.hold", "Hold tag applied", "Вывешен запрет"),
  logical("switching_order.verified", "Step verified", "Шаг проверен"),
  enu("switching_order.step.action", ["open", "close", "check", "tag", "ground", "unground"], "Step action", "Действие шага"),
  enu("switching_order.status", ["draft", "approved", "in_progress", "complete", "aborted"], "Order status", "Статус бланка"),
]);

write("layer-b-clearance.json", [
  id("clearance.id", "Clearance / LOTO id", "ID допуска / LOTO"),
  id("clearance.asset.id", "Cleared asset id", "ID выведенного актива"),
  q("clearance.workers", "-", "Workers under clearance", "Работников под допуском", { encodings: ["i16"] }),
  q("clearance.locks", "-", "Locks applied", "Навешенных замков", { encodings: ["i16"] }),
  logical("clearance.active", "Clearance active", "Допуск действует"),
  logical("clearance.tested.deenergized", "Tested de-energized", "Проверено отсутствие напряжения"),
  enu("clearance.type", ["working", "switching", "hotline", "confined", "other"], "Clearance type", "Тип допуска"),
  enu("clearance.status", ["requested", "issued", "active", "released", "cancelled"], "Clearance status", "Статус допуска"),
]);

write("layer-b-mobile_workforce.json", [
  id("mobile_workforce.tech.id", "Field technician id", "ID полевого техника"),
  id("mobile_workforce.job.id", "Field job id", "ID полевого задания"),
  q("mobile_workforce.jobs.day", "-", "Jobs today", "Заданий сегодня", { encodings: ["i16"] }),
  q("mobile_workforce.travel.min", "min", "Travel minutes", "Минуты в пути"),
  q("mobile_workforce.gps.accuracy", "m", "GPS accuracy", "Точность GPS"),
  logical("mobile_workforce.on_site", "On site", "На объекте"),
  enu("mobile_workforce.status", ["available", "enroute", "on_site", "break", "offline"], "Tech status", "Статус техника"),
  enu("mobile_workforce.skill", ["electric", "gas", "water", "telecom", "general"], "Primary skill", "Основная специальность"),
]);

write("layer-b-call_center_utility.json", [
  id("call_center_utility.queue.id", "Utility call queue id", "ID очереди контакт-центра"),
  id("call_center_utility.case.id", "Customer case id", "ID обращения", { sensitivity: "internal" }),
  q("call_center_utility.wait.s", "s", "Average wait", "Среднее ожидание"),
  q("call_center_utility.asa.s", "s", "ASA", "ASA"),
  q("call_center_utility.outage.calls", "-", "Outage-related calls", "Звонков по отключениям", { encodings: ["i32"] }),
  q("call_center_utility.agents", "-", "Agents available", "Доступных операторов", { encodings: ["i16"] }),
  enu("call_center_utility.reason", ["outage", "billing", "move", "gas_smell", "other"], "Call reason", "Причина звонка"),
  enu("call_center_utility.state", ["queued", "active", "hold", "closed", "escalated"], "Case state", "Состояние обращения"),
]);

write("layer-b-customer_meter.json", [
  id("customer_meter.account.id", "Customer account id", "ID лицевого счёта", { sensitivity: "internal" }),
  id("customer_meter.service.id", "Service point id", "ID точки поставки"),
  q("customer_meter.usage.kwh", "Wh", "Billing period usage", "Потребление за период"),
  q("customer_meter.bill.amount", "-", "Bill amount minor units", "Сумма счёта", { encodings: ["i32"], sensitivity: "internal" }),
  q("customer_meter.arrears.d", "d", "Days in arrears", "Дней просрочки", { sensitivity: "internal" }),
  logical("customer_meter.disconnect.eligible", "Disconnect eligible", "Доступно отключение", { sensitivity: "internal" }),
  enu("customer_meter.status", ["active", "vacant", "disconnected", "finaled"], "Service status", "Статус услуги"),
  enu("customer_meter.rate", ["residential", "commercial", "industrial", "lighting", "other"], "Rate class", "Тарифный класс"),
]);

write("layer-b-prepaid_meter.json", [
  id("prepaid_meter.id", "Prepaid meter id", "ID предоплатного счётчика"),
  id("prepaid_meter.customer.id", "Prepaid customer id", "ID клиента предоплаты", { sensitivity: "internal" }),
  q("prepaid_meter.credit", "-", "Credit remaining minor units", "Остаток кредита", { encodings: ["i32"] }),
  q("prepaid_meter.days.left", "d", "Days of credit left", "Дней кредита"),
  q("prepaid_meter.power.limit", "W", "Power limit", "Лимит мощности"),
  logical("prepaid_meter.low.credit", "Low credit warning", "Предупреждение о низком кредите"),
  logical("prepaid_meter.disconnected", "Disconnected for credit", "Отключён по кредиту"),
  enu("prepaid_meter.state", ["ok", "low", "emergency", "disconnected", "fault"], "Prepaid state", "Состояние предоплаты"),
]);

write("layer-b-street_furniture.json", [
  id("street_furniture.asset.id", "Street furniture asset id", "ID элемента уличной инфраструктуры"),
  id("street_furniture.zone.id", "City zone id", "ID городской зоны"),
  q("street_furniture.condition", "-", "Condition score", "Оценка состояния", { range: { min: 0, max: 100 } }),
  q("street_furniture.inspect.age_d", "d", "Days since inspection", "Дней с осмотра"),
  logical("street_furniture.damage", "Damage reported", "Повреждение сообщено"),
  media("street_furniture.photo.ref", "Asset photo ref", "Референс фото"),
  enu("street_furniture.type", ["bench", "bin", "bollard", "sign", "kiosk", "other"], "Furniture type", "Тип элемента"),
  enu("street_furniture.status", ["ok", "needs_repair", "removed", "planned"], "Asset status", "Статус актива"),
]);

write("layer-b-digital_twin.json", [
  id("digital_twin.model.id", "Digital twin model id", "ID цифровой модели"),
  id("digital_twin.asset.id", "Twinned asset id", "ID сдвоенного актива"),
  q("digital_twin.fidelity", "%", "Model fidelity", "Точность модели", { range: { min: 0, max: 100 } }),
  q("digital_twin.sync.lag_s", "s", "Sync lag", "Отставание синхронизации"),
  q("digital_twin.sim.runs", "-", "Simulation runs today", "Прогонов симуляции сегодня", { encodings: ["i32"] }),
  logical("digital_twin.drift", "Model drift detected", "Обнаружен дрейф модели"),
  enu("digital_twin.domain", ["energy", "building", "factory", "city", "vehicle", "other"], "Twin domain", "Домен двойника"),
  enu("digital_twin.state", ["synced", "stale", "simulating", "training", "offline"], "Twin state", "Состояние двойника"),
]);

write("layer-b-iot_gateway.json", [
  id("iot_gateway.id", "IoT gateway id", "ID IoT-шлюза"),
  id("iot_gateway.site.id", "Gateway site id", "ID площадки шлюза"),
  q("iot_gateway.devices", "-", "Connected devices", "Подключённых устройств", { encodings: ["i32"] }),
  q("iot_gateway.cpu", "%", "CPU load", "Загрузка CPU", { range: { min: 0, max: 100 } }),
  q("iot_gateway.uptime", "%", "Uptime", "Аптайм", { range: { min: 0, max: 100 } }),
  q("iot_gateway.msg.rate", "/s", "Message rate", "Скорость сообщений"),
  logical("iot_gateway.backhaul.up", "Backhaul up", "Канал связи OK"),
  enu("iot_gateway.state", ["online", "degraded", "offline", "updating"], "Gateway state", "Состояние шлюза"),
]);

write("layer-b-lora_network.json", [
  id("lora_network.gateway.id", "LoRa gateway id", "ID LoRa-шлюза"),
  id("lora_network.device.id", "LoRa end device id", "ID конечного устройства LoRa"),
  q("lora_network.rssi", "dBm", "RSSI", "RSSI"),
  q("lora_network.snr", "dB", "SNR", "SNR"),
  q("lora_network.sf", "-", "Spreading factor", "Фактор расширения", { encodings: ["i16"] }),
  q("lora_network.duty.cycle", "%", "Duty cycle", "Скважность", { range: { min: 0, max: 100 } }),
  logical("lora_network.join.ok", "Join accepted", "Join принят"),
  enu("lora_network.class", ["a", "b", "c"], "Device class", "Класс устройства"),
]);

write("layer-b-nb_iot.json", [
  id("nb_iot.device.id", "NB-IoT device id", "ID устройства NB-IoT"),
  id("nb_iot.cell.id", "NB-IoT cell id", "ID соты NB-IoT"),
  q("nb_iot.rsrp", "dBm", "RSRP", "RSRP"),
  q("nb_iot.ecl", "-", "Coverage enhancement level", "Уровень усиления покрытия", { encodings: ["i16"] }),
  q("nb_iot.tx.power", "dBm", "TX power", "Мощность передачи"),
  q("nb_iot.msg.day", "-", "Messages per day", "Сообщений в сутки", { encodings: ["i32"] }),
  logical("nb_iot.attached", "Network attached", "Зарегистрировано в сети"),
  enu("nb_iot.state", ["idle", "connected", "psm", "edrx", "offline"], "Device state", "Состояние устройства"),
]);

write("layer-b-mqtt_broker.json", [
  id("mqtt_broker.id", "MQTT broker id", "ID MQTT-брокера"),
  id("mqtt_broker.client.id", "MQTT client id", "ID MQTT-клиента"),
  q("mqtt_broker.clients", "-", "Connected clients", "Подключённых клиентов", { encodings: ["i32"] }),
  q("mqtt_broker.msg.rate", "/s", "Message rate", "Скорость сообщений"),
  q("mqtt_broker.retained", "-", "Retained messages", "Retained-сообщений", { encodings: ["i32"] }),
  q("mqtt_broker.cpu", "%", "Broker CPU", "CPU брокера", { range: { min: 0, max: 100 } }),
  logical("mqtt_broker.ha.healthy", "HA healthy", "HA здоров"),
  enu("mqtt_broker.state", ["online", "degraded", "failover", "offline"], "Broker state", "Состояние брокера"),
]);

write("layer-b-opcua.json", [
  id("opcua.server.id", "OPC UA server id", "ID OPC UA сервера"),
  id("opcua.node.id", "OPC UA node id", "ID узла OPC UA"),
  q("opcua.subscriptions", "-", "Active subscriptions", "Активных подписок", { encodings: ["i32"] }),
  q("opcua.sessions", "-", "Active sessions", "Активных сессий", { encodings: ["i16"] }),
  q("opcua.latency.ms", "ms", "Read latency", "Задержка чтения"),
  logical("opcua.secure", "Secure channel active", "Безопасный канал активен"),
  enu("opcua.security", ["none", "sign", "sign_encrypt"], "Security mode", "Режим безопасности"),
  enu("opcua.state", ["running", "failed", "suspended", "shutdown"], "Server state", "Состояние сервера"),
]);

write("layer-b-modbus_gw.json", [
  id("modbus_gw.id", "Modbus gateway id", "ID Modbus-шлюза"),
  id("modbus_gw.device.id", "Modbus device id", "ID устройства Modbus"),
  q("modbus_gw.poll.rate", "/s", "Poll rate", "Скорость опроса"),
  q("modbus_gw.error.rate", "%", "Error rate", "Доля ошибок", { range: { min: 0, max: 100 } }),
  q("modbus_gw.latency.ms", "ms", "Poll latency", "Задержка опроса"),
  logical("modbus_gw.device.online", "Device online", "Устройство online"),
  enu("modbus_gw.protocol", ["rtu", "tcp", "ascii", "udp"], "Modbus protocol", "Протокол Modbus"),
  enu("modbus_gw.state", ["ok", "timeout", "exception", "offline"], "Gateway state", "Состояние шлюза"),
]);

write("layer-b-bacnet.json", [
  id("bacnet.device.id", "BACnet device id", "ID устройства BACnet"),
  id("bacnet.object.id", "BACnet object id", "ID объекта BACnet"),
  q("bacnet.objects", "-", "Object count", "Число объектов", { encodings: ["i32"] }),
  q("bacnet.cov.rate", "/s", "COV rate", "Скорость COV"),
  q("bacnet.apdu.timeout_ms", "ms", "APDU timeout", "Таймаут APDU"),
  logical("bacnet.bbmd", "BBMD enabled", "BBMD включён"),
  enu("bacnet.network", ["ip", "mstp", "sc", "other"], "Network type", "Тип сети"),
  enu("bacnet.state", ["online", "offline", "fault", "download"], "Device state", "Состояние устройства"),
]);

write("layer-b-knx.json", [
  id("knx.device.id", "KNX device id", "ID устройства KNX"),
  id("knx.line.id", "KNX line id", "ID линии KNX"),
  q("knx.group.writes", "/s", "Group write rate", "Скорость group write"),
  q("knx.bus.load", "%", "Bus load", "Загрузка шины", { range: { min: 0, max: 100 } }),
  q("knx.devices.online", "-", "Devices online", "Устройств online", { encodings: ["i32"] }),
  logical("knx.programming", "Programming mode", "Режим программирования"),
  enu("knx.medium", ["tp", "ip", "rf", "pl"], "KNX medium", "Среда KNX"),
  enu("knx.state", ["normal", "busy", "fault", "offline"], "Line state", "Состояние линии"),
]);

write("layer-b-zigbee.json", [
  id("zigbee.coordinator.id", "Zigbee coordinator id", "ID координатора Zigbee"),
  id("zigbee.device.id", "Zigbee device id", "ID устройства Zigbee"),
  q("zigbee.lqi", "-", "Link quality indicator", "LQI", { encodings: ["i16"] }),
  q("zigbee.rssi", "dBm", "RSSI", "RSSI"),
  q("zigbee.children", "-", "Child devices", "Дочерних устройств", { encodings: ["i16"] }),
  q("zigbee.msg.fail", "%", "Message failure rate", "Доля потерь", { range: { min: 0, max: 100 } }),
  logical("zigbee.permit.join", "Permit join open", "Разрешено присоединение"),
  enu("zigbee.role", ["coordinator", "router", "end_device"], "Device role", "Роль устройства"),
]);

write("layer-b-zwave.json", [
  id("zwave.controller.id", "Z-Wave controller id", "ID контроллера Z-Wave"),
  id("zwave.node.id", "Z-Wave node id", "ID узла Z-Wave"),
  q("zwave.rssi", "dBm", "RSSI", "RSSI"),
  q("zwave.hop.count", "-", "Hop count", "Число хопов", { encodings: ["i16"] }),
  q("zwave.battery.pct", "%", "Node battery", "Батарея узла", { range: { min: 0, max: 100 } }),
  q("zwave.nodes", "-", "Network nodes", "Узлов в сети", { encodings: ["i16"] }),
  logical("zwave.inclusion", "Inclusion mode", "Режим включения"),
  enu("zwave.security", ["none", "s0", "s2"], "Security level", "Уровень безопасности"),
]);

write("layer-b-matter_fabric.json", [
  id("matter_fabric.id", "Matter fabric id", "ID фабрики Matter"),
  id("matter_fabric.node.id", "Matter node id", "ID узла Matter"),
  q("matter_fabric.nodes", "-", "Fabric nodes", "Узлов в фабрике", { encodings: ["i32"] }),
  q("matter_fabric.controllers", "-", "Fabric controllers", "Контроллеров", { encodings: ["i16"] }),
  q("matter_fabric.fail.rate", "%", "Command fail rate", "Доля ошибок команд", { range: { min: 0, max: 100 } }),
  logical("matter_fabric.commissioning", "Commissioning active", "Комиссия активна"),
  enu("matter_fabric.transport", ["thread", "wifi", "ethernet", "other"], "Transport", "Транспорт"),
  enu("matter_fabric.state", ["active", "partial", "orphaned", "offline"], "Fabric state", "Состояние фабрики"),
]);

write("layer-b-thread_network.json", [
  id("thread_network.id", "Thread network id", "ID сети Thread"),
  id("thread_network.router.id", "Thread router id", "ID роутера Thread"),
  q("thread_network.nodes", "-", "Network nodes", "Узлов сети", { encodings: ["i32"] }),
  q("thread_network.routers", "-", "Active routers", "Активных роутеров", { encodings: ["i16"] }),
  q("thread_network.partition.id", "-", "Partition id", "ID партиции", { encodings: ["i32"] }),
  q("thread_network.channel", "-", "Channel", "Канал", { encodings: ["i16"] }),
  logical("thread_network.leader.ok", "Leader present", "Лидер присутствует"),
  enu("thread_network.role", ["leader", "router", "reed", "end_device", "detached"], "Node role", "Роль узла"),
]);

write("layer-b-ble_beacon.json", [
  id("ble_beacon.id", "BLE beacon id", "ID BLE-маяка"),
  id("ble_beacon.site.id", "Beacon site id", "ID площадки маяка"),
  q("ble_beacon.rssi", "dBm", "RSSI", "RSSI"),
  q("ble_beacon.tx.power", "dBm", "TX power", "Мощность передачи"),
  q("ble_beacon.battery.pct", "%", "Battery", "Батарея", { range: { min: 0, max: 100 } }),
  q("ble_beacon.interval.ms", "ms", "Advertising interval", "Интервал рекламы"),
  logical("ble_beacon.online", "Beacon advertising", "Маяк вещает"),
  enu("ble_beacon.protocol", ["ibeacon", "eddystone", "altbeacon", "other"], "Beacon protocol", "Протокол маяка"),
]);

write("layer-b-uwb_anchor.json", [
  id("uwb_anchor.id", "UWB anchor id", "ID якоря UWB"),
  id("uwb_anchor.tag.id", "UWB tag id", "ID метки UWB"),
  q("uwb_anchor.range", "m", "Measured range", "Измеренная дальность"),
  q("uwb_anchor.x", "m", "Tag X", "Координата X метки"),
  q("uwb_anchor.y", "m", "Tag Y", "Координата Y метки"),
  q("uwb_anchor.z", "m", "Tag Z", "Координата Z метки"),
  q("uwb_anchor.quality", "%", "Fix quality", "Качество фиксации", { range: { min: 0, max: 100 } }),
  enu("uwb_anchor.mode", ["tdoa", "twr", "pdoa", "hybrid"], "Ranging mode", "Режим дальнометрии"),
]);

write("layer-b-rtls.json", [
  id("rtls.system.id", "RTLS system id", "ID системы RTLS"),
  id("rtls.asset.id", "Tracked asset id", "ID отслеживаемого актива"),
  q("rtls.x", "m", "Asset X", "Координата X"),
  q("rtls.y", "m", "Asset Y", "Координата Y"),
  q("rtls.accuracy", "m", "Position accuracy", "Точность позиции"),
  q("rtls.update.hz", "Hz", "Update rate", "Частота обновления"),
  logical("rtls.geofence.breach", "Geofence breach", "Нарушение геозоны"),
  enu("rtls.tech", ["uwb", "ble", "wifi", "vision", "hybrid"], "RTLS technology", "Технология RTLS"),
]);

write("layer-b-asset_tracking.json", [
  id("asset_tracking.tag.id", "Asset tracking tag id", "ID метки актива"),
  id("asset_tracking.asset.id", "Tracked asset id", "ID актива"),
  q("asset_tracking.battery.pct", "%", "Tag battery", "Батарея метки", { range: { min: 0, max: 100 } }),
  q("asset_tracking.last.seen_min", "min", "Minutes since last seen", "Минут с последнего сигнала"),
  q("asset_tracking.moves.day", "-", "Moves today", "Перемещений сегодня", { encodings: ["i32"] }),
  logical("asset_tracking.missing", "Asset missing", "Актив пропал"),
  enu("asset_tracking.zone", ["warehouse", "yard", "vehicle", "unknown", "other"], "Last zone", "Последняя зона"),
  enu("asset_tracking.state", ["ok", "stale", "low_battery", "missing", "retired"], "Tracking state", "Состояние трекинга"),
]);

write("layer-b-cold_chain_logger.json", [
  id("cold_chain_logger.id", "Cold chain logger id", "ID логгера холодовой цепи"),
  id("cold_chain_logger.shipment.id", "Shipment id", "ID отправления"),
  q("cold_chain_logger.temp", "Cel", "Logger temperature", "Температура логгера"),
  q("cold_chain_logger.humidity", "%", "Logger humidity", "Влажность логгера", { range: { min: 0, max: 100 } }),
  q("cold_chain_logger.excursion.min", "min", "Excursion minutes", "Минуты экскурсии"),
  q("cold_chain_logger.battery.pct", "%", "Logger battery", "Батарея логгера", { range: { min: 0, max: 100 } }),
  logical("cold_chain_logger.alarm", "Temperature alarm", "Температурная тревога"),
  enu("cold_chain_logger.status", ["ok", "warning", "alarm", "offline", "complete"], "Logger status", "Статус логгера"),
]);

write("layer-b-shock_logger.json", [
  id("shock_logger.id", "Shock logger id", "ID логгера ударов"),
  id("shock_logger.shipment.id", "Shipment id", "ID отправления"),
  q("shock_logger.peak.g", "-", "Peak g", "Пиковое ускорение g"),
  q("shock_logger.events", "-", "Shock events", "Событий удара", { encodings: ["i32"] }),
  q("shock_logger.tilt.deg", "deg", "Max tilt", "Макс. наклон"),
  logical("shock_logger.threshold", "Threshold exceeded", "Порог превышен"),
  media("shock_logger.profile.ref", "Shock profile ref", "Референс профиля ударов"),
  enu("shock_logger.status", ["ok", "event", "alarm", "offline"], "Logger status", "Статус логгера"),
]);

write("layer-b-tamper_seal.json", [
  id("tamper_seal.id", "Electronic seal id", "ID электронной пломбы"),
  id("tamper_seal.container.id", "Sealed container id", "ID опломбированного контейнера"),
  logical("tamper_seal.intact", "Seal intact", "Пломба цела"),
  logical("tamper_seal.tamper", "Tamper detected", "Вскрытие"),
  q("tamper_seal.battery.pct", "%", "Seal battery", "Батарея пломбы", { range: { min: 0, max: 100 } }),
  q("tamper_seal.open.count", "-", "Open events", "Событий открытия", { encodings: ["i16"] }),
  enu("tamper_seal.type", ["bolt", "cable", "rfid", "ble", "other"], "Seal type", "Тип пломбы"),
  enu("tamper_seal.state", ["armed", "intact", "tampered", "disarmed", "fault"], "Seal state", "Состояние пломбы"),
]);

write("layer-b-container_track.json", [
  id("container_track.box.id", "Container id", "ID контейнера"),
  id("container_track.trip.id", "Container trip id", "ID рейса контейнера"),
  q("container_track.lat", "deg", "Latitude", "Широта"),
  q("container_track.lon", "deg", "Longitude", "Долгота"),
  q("container_track.dwell.h", "h", "Dwell time", "Время простоя"),
  q("container_track.temp", "Cel", "Internal temperature", "Внутренняя температура"),
  logical("container_track.door.open", "Door open", "Дверь открыта"),
  enu("container_track.status", ["gate_in", "vessel", "rail", "truck", "depot", "delivered"], "Container status", "Статус контейнера"),
]);

console.log("Layer B11 seeds written");
