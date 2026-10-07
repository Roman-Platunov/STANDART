#!/usr/bin/env node
/**
 * Layer B9 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B9", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-hydro_plant.json", [
  id("hydro_plant.id", "Hydro plant id", "ID ГЭС"),
  id("hydro_plant.unit.id", "Turbine unit id", "ID гидроагрегата"),
  q("hydro_plant.head", "m", "Net head", "Напор"),
  q("hydro_plant.flow", "m3/s", "Turbine flow", "Расход через турбину"),
  q("hydro_plant.power", "W", "Unit power", "Мощность агрегата"),
  q("hydro_plant.reservoir.level", "m", "Reservoir level", "Уровень водохранилища"),
  q("hydro_plant.spill.flow", "m3/s", "Spillway flow", "Расход водосброса"),
  enu("hydro_plant.mode", ["generate", "condense", "idle", "gate_test", "fault"], "Hydro unit mode", "Режим гидроагрегата"),
]);

write("layer-b-gas_turbine.json", [
  id("gas_turbine.unit.id", "Gas turbine unit id", "ID газовой турбины"),
  id("gas_turbine.plant.id", "GT plant id", "ID ГТУ-станции"),
  q("gas_turbine.power", "W", "GT power", "Мощность ГТУ"),
  q("gas_turbine.exhaust.temp", "Cel", "Exhaust temperature", "Температура выхлопа"),
  q("gas_turbine.n1", "%", "N1 speed", "Обороты N1", { range: { min: 0, max: 110 } }),
  q("gas_turbine.fuel.flow", "kg/s", "Fuel flow", "Расход топлива"),
  q("gas_turbine.vibration", "mm/s", "Vibration", "Вибрация"),
  logical("gas_turbine.trip", "Unit trip", "Отключение агрегата"),
  enu("gas_turbine.state", ["off", "start", "load", "peak", "cooldown", "fault"], "GT state", "Состояние ГТУ"),
]);

write("layer-b-coal_plant.json", [
  id("coal_plant.unit.id", "Coal unit id", "ID угольного блока"),
  q("coal_plant.boiler.steam_temp", "Cel", "Main steam temperature", "Температура острого пара"),
  q("coal_plant.boiler.steam_pressure", "Pa", "Main steam pressure", "Давление острого пара"),
  q("coal_plant.mill.throughput", "t/h", "Coal mill throughput", "Производительность мельницы"),
  q("coal_plant.emissions.sox", "mg/m3", "SOx emissions", "Выбросы SOx"),
  q("coal_plant.emissions.nox", "mg/m3", "NOx emissions", "Выбросы NOx"),
  q("coal_plant.ash.fly_level", "%", "Fly ash silo level", "Уровень золы", { range: { min: 0, max: 100 } }),
  q("coal_plant.power", "W", "Unit power", "Мощность блока"),
  enu("coal_plant.state", ["start", "load", "low_load", "outage", "fault"], "Coal unit state", "Состояние угольного блока"),
]);

write("layer-b-biomass_plant.json", [
  id("biomass_plant.id", "Biomass plant id", "ID биотопливной станции"),
  id("biomass_plant.boiler.id", "Biomass boiler id", "ID котла на биомассе"),
  q("biomass_plant.fuel.moisture", "%", "Fuel moisture", "Влажность топлива", { range: { min: 0, max: 100 } }),
  q("biomass_plant.furnace.temp", "Cel", "Furnace temperature", "Температура топки"),
  q("biomass_plant.steam.flow", "t/h", "Steam flow", "Расход пара"),
  q("biomass_plant.power", "W", "Electric power", "Электрическая мощность"),
  q("biomass_plant.emissions.co", "mg/m3", "CO emissions", "Выбросы CO"),
  enu("biomass_plant.fuel", ["woodchip", "pellet", "agri", "rdf", "other"], "Biomass fuel", "Вид биотоплива"),
]);

write("layer-b-district_cooling.json", [
  id("district_cooling.loop.id", "District cooling loop id", "ID контура холодоснабжения"),
  id("district_cooling.plant.id", "District cooling plant id", "ID станции холода"),
  q("district_cooling.supply.temp", "Cel", "Chilled supply temp", "Температура подачи холода"),
  q("district_cooling.return.temp", "Cel", "Chilled return temp", "Температура обратки холода"),
  q("district_cooling.flow", "m3/h", "Loop flow", "Расход контура"),
  q("district_cooling.power.cooling", "W", "Cooling power", "Холодопроизводительность"),
  q("district_cooling.delta_t", "K", "Supply-return delta T", "Перепад температур"),
  enu("district_cooling.mode", ["run", "ice_store", "idle", "fault"], "District cooling mode", "Режим холодосети"),
]);

write("layer-b-smart_meter.json", [
  id("smart_meter.id", "Smart meter id", "ID умного счётчика"),
  id("smart_meter.premise.id", "Premise id", "ID объекта учёта"),
  q("smart_meter.energy.import", "Wh", "Import energy", "Энергия потребления"),
  q("smart_meter.energy.export", "Wh", "Export energy", "Энергия выдачи"),
  q("smart_meter.power", "W", "Instant power", "Мгновенная мощность"),
  q("smart_meter.voltage", "V", "Voltage", "Напряжение"),
  logical("smart_meter.tamper", "Tamper detected", "Вскрытие"),
  enu("smart_meter.commodity", ["electric", "gas", "water", "heat", "cooling"], "Meter commodity", "Вид учёта"),
]);

write("layer-b-ami_network.json", [
  id("ami_network.concentrator.id", "AMI concentrator id", "ID концентратора AMI"),
  id("ami_network.meter.id", "AMI meter id", "ID счётчика AMI"),
  q("ami_network.read.success", "%", "Read success rate", "Успешность опросов", { range: { min: 0, max: 100 } }),
  q("ami_network.latency.s", "s", "Read latency", "Задержка опроса"),
  q("ami_network.meters.online", "-", "Online meters", "Счётчиков online", { encodings: ["i32"] }),
  logical("ami_network.outage.detected", "Last-gasp outage", "Фиксация отключения"),
  enu("ami_network.tech", ["rf_mesh", "plc", "cellular", "hybrid"], "AMI technology", "Технология AMI"),
]);

write("layer-b-streetlight.json", [
  id("streetlight.fixture.id", "Streetlight fixture id", "ID светильника"),
  id("streetlight.cabinet.id", "Lighting cabinet id", "ID шкафа освещения"),
  q("streetlight.power", "W", "Fixture power", "Мощность светильника"),
  q("streetlight.dim", "%", "Dimming level", "Уровень диммирования", { range: { min: 0, max: 100 } }),
  q("streetlight.lux", "lx", "Illuminance", "Освещённость"),
  logical("streetlight.on", "Light on", "Свет включён"),
  logical("streetlight.fault", "Fixture fault", "Неисправность светильника"),
  enu("streetlight.mode", ["photocell", "schedule", "adaptive", "manual", "off"], "Streetlight mode", "Режим освещения"),
]);

write("layer-b-stormwater.json", [
  id("stormwater.basin.id", "Stormwater basin id", "ID ливневого бассейна"),
  id("stormwater.outfall.id", "Outfall id", "ID выпуска"),
  q("stormwater.level", "m", "Basin water level", "Уровень в бассейне"),
  q("stormwater.flow", "m3/s", "Outfall flow", "Расход выпуска"),
  q("stormwater.rainfall", "mm/h", "Local rainfall", "Локальные осадки"),
  q("stormwater.turbidity", "NTU", "Discharge turbidity", "Мутность сброса"),
  logical("stormwater.overflow", "CSO/SSO overflow", "Переполнение"),
  enu("stormwater.state", ["dry", "filling", "discharging", "overflow", "maintenance"], "Stormwater state", "Состояние ливнёвки"),
]);

write("layer-b-sewer_pump.json", [
  id("sewer_pump.station.id", "Lift station id", "ID КНС"),
  id("sewer_pump.pump.id", "Sewage pump id", "ID насоса КНС"),
  q("sewer_pump.wetwell.level", "m", "Wet well level", "Уровень в приёмнике"),
  q("sewer_pump.flow", "m3/h", "Pump flow", "Расход насоса"),
  q("sewer_pump.runtime.h", "h", "Pump runtime", "Наработка насоса"),
  q("sewer_pump.starts", "-", "Start count", "Число пусков", { encodings: ["i32"] }),
  logical("sewer_pump.high.alarm", "High level alarm", "Авария высокого уровня"),
  enu("sewer_pump.state", ["off", "lead", "lag", "fault", "bypass"], "Pump state", "Состояние насоса КНС"),
]);

write("layer-b-irrigation_district.json", [
  id("irrigation_district.canal.id", "Irrigation canal id", "ID оросительного канала"),
  id("irrigation_district.gate.id", "Canal gate id", "ID затвора"),
  q("irrigation_district.flow", "m3/s", "Canal flow", "Расход канала"),
  q("irrigation_district.level", "m", "Canal level", "Уровень в канале"),
  q("irrigation_district.gate.opening", "%", "Gate opening", "Открытие затвора", { range: { min: 0, max: 100 } }),
  q("irrigation_district.delivery.volume", "m3", "Delivered volume", "Поданный объём"),
  logical("irrigation_district.shortage", "Water shortage", "Дефицит воды"),
  enu("irrigation_district.season", ["off", "startup", "peak", "shoulder", "shutdown"], "Irrigation season", "Сезон орошения"),
]);

write("layer-b-grain_elevator.json", [
  id("grain_elevator.id", "Grain elevator id", "ID элеватора"),
  id("grain_elevator.bin.id", "Grain bin id", "ID силоса зерна"),
  q("grain_elevator.bin.level", "%", "Bin fill level", "Заполнение силоса", { range: { min: 0, max: 100 } }),
  q("grain_elevator.moisture", "%", "Grain moisture", "Влажность зерна", { range: { min: 0, max: 100 } }),
  q("grain_elevator.temperature", "Cel", "Grain temperature", "Температура зерна"),
  q("grain_elevator.dust", "mg/m3", "Dust concentration", "Концентрация пыли"),
  logical("grain_elevator.hotspot", "Hotspot detected", "Очаг самосогревания"),
  enu("grain_elevator.commodity", ["wheat", "corn", "soy", "barley", "rice", "other"], "Grain commodity", "Культура"),
]);

write("layer-b-feed_mill.json", [
  id("feed_mill.id", "Feed mill id", "ID комбикормового завода"),
  id("feed_mill.batch.id", "Feed batch id", "ID партии корма"),
  q("feed_mill.mixer.time", "s", "Mix time", "Время смешивания"),
  q("feed_mill.pellet.temp", "Cel", "Pellet die temperature", "Температура гранулирования"),
  q("feed_mill.pellet.durability", "%", "Pellet durability", "Прочность гранул", { range: { min: 0, max: 100 } }),
  q("feed_mill.throughput", "t/h", "Mill throughput", "Производительность"),
  q("feed_mill.protein", "%", "Crude protein", "Сырой протеин", { range: { min: 0, max: 100 } }),
  enu("feed_mill.product", ["poultry", "swine", "cattle", "aqua", "pet", "other"], "Feed product", "Тип корма"),
]);

write("layer-b-hatchery.json", [
  id("hatchery.id", "Hatchery id", "ID инкубатория"),
  id("hatchery.setter.id", "Setter id", "ID инкубатора"),
  q("hatchery.setter.temp", "Cel", "Setter temperature", "Температура инкубации"),
  q("hatchery.setter.humidity", "%", "Setter humidity", "Влажность инкубации", { range: { min: 0, max: 100 } }),
  q("hatchery.hatch.rate", "%", "Hatch rate", "Выводимость", { range: { min: 0, max: 100 } }),
  q("hatchery.eggs.set", "-", "Eggs set", "Заложено яиц", { encodings: ["i32"] }),
  q("hatchery.chicks.pulled", "-", "Chicks pulled", "Выведено цыплят", { encodings: ["i32"] }),
  enu("hatchery.stage", ["set", "transfer", "hatch", "pull", "clean"], "Hatchery stage", "Стадия инкубации"),
]);

write("layer-b-orchard.json", [
  id("orchard.block.id", "Orchard block id", "ID квартала сада"),
  id("orchard.tree.row_id", "Tree row id", "ID ряда деревьев"),
  q("orchard.soil.moisture", "%", "Soil moisture", "Влажность почвы", { range: { min: 0, max: 100 } }),
  q("orchard.canopy.temp", "Cel", "Canopy temperature", "Температура кроны"),
  q("orchard.frost.risk", "-", "Frost risk index", "Индекс риска заморозков", { range: { min: 0, max: 100 } }),
  q("orchard.yield.estimate", "t/ha", "Yield estimate", "Оценка урожайности"),
  q("orchard.ndvi", "-", "Block NDVI", "NDVI квартала"),
  enu("orchard.crop", ["apple", "citrus", "grape", "stone", "nut", "other"], "Orchard crop", "Культура сада"),
]);

write("layer-b-greenhouse_ops.json", [
  id("greenhouse_ops.house.id", "Greenhouse id", "ID теплицы"),
  id("greenhouse_ops.zone.id", "Greenhouse zone id", "ID зоны теплицы"),
  q("greenhouse_ops.temp.air", "Cel", "Air temperature", "Температура воздуха"),
  q("greenhouse_ops.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("greenhouse_ops.co2", "ppm", "CO2 enrichment", "Обогащение CO₂"),
  q("greenhouse_ops.par", "umol/m2/s", "PAR", "ФАР"),
  q("greenhouse_ops.vent.opening", "%", "Vent opening", "Открытие форточек", { range: { min: 0, max: 100 } }),
  enu("greenhouse_ops.mode", ["heat", "cool", "vent", "enrich", "night"], "Greenhouse mode", "Режим теплицы"),
]);

write("layer-b-cold_chain_truck.json", [
  id("cold_chain_truck.vehicle.id", "Reefer truck id", "ID рефрижератора"),
  id("cold_chain_truck.trip.id", "Cold chain trip id", "ID рейса холодовой цепи"),
  q("cold_chain_truck.cargo.temp", "Cel", "Cargo temperature", "Температура груза"),
  q("cold_chain_truck.setpoint", "Cel", "Setpoint temperature", "Уставка температуры"),
  q("cold_chain_truck.door.open_s", "s", "Door open time", "Время открытой двери"),
  q("cold_chain_truck.fuel.reefer", "L", "Reefer fuel used", "Топливо рефа"),
  logical("cold_chain_truck.excursion", "Temperature excursion", "Температурная экскурсия"),
  enu("cold_chain_truck.mode", ["continuous", "cycle", "start_stop", "off", "defrost"], "Reefer mode", "Режим рефа"),
]);

write("layer-b-air_cargo.json", [
  id("air_cargo.shipment.id", "Air cargo shipment id", "ID авиагруза"),
  id("air_cargo.uld.id", "ULD id", "ID авиаконтейнера"),
  q("air_cargo.weight", "kg", "Shipment weight", "Масса груза"),
  q("air_cargo.volume", "m3", "Shipment volume", "Объём груза"),
  q("air_cargo.temp", "Cel", "ULD temperature", "Температура ULD"),
  q("air_cargo.dwell.h", "h", "Airport dwell", "Простой в аэропорту"),
  logical("air_cargo.dangerous", "Dangerous goods flag", "Опасный груз"),
  enu("air_cargo.status", ["accept", "build", "depart", "arrive", "deliver", "hold"], "Air cargo status", "Статус авиагруза"),
]);

write("layer-b-baggage_system.json", [
  id("baggage_system.airport.id", "Airport baggage system id", "ID системы багажа"),
  id("baggage_system.bag.id", "Bag tag id", "ID багажной бирки"),
  q("baggage_system.throughput", "/h", "Bags per hour", "Мест багажа в час"),
  q("baggage_system.missort.rate", "%", "Missort rate", "Доля ошибок сортировки", { range: { min: 0, max: 100 } }),
  q("baggage_system.carousel.wait_min", "min", "Carousel wait", "Ожидание на ленте"),
  q("baggage_system.eds.queue", "-", "EDS queue length", "Очередь EDS", { encodings: ["i16"] }),
  logical("baggage_system.jam", "Conveyor jam", "Затор конвейера"),
  enu("baggage_system.bag.state", ["checkin", "screen", "sort", "load", "reclaim", "lost"], "Bag state", "Состояние багажа"),
]);

write("layer-b-deicing.json", [
  id("deicing.pad.id", "Deicing pad id", "ID площадки антиобледенения"),
  id("deicing.aircraft.id", "Aircraft being deiced", "ID обрабатываемого ВС"),
  q("deicing.fluid.used", "L", "Fluid used", "Расход жидкости"),
  q("deicing.holdover.min", "min", "Holdover time", "Время защиты"),
  q("deicing.oat", "Cel", "Outside air temperature", "Температура наружного воздуха"),
  q("deicing.duration.min", "min", "Deice duration", "Длительность обработки"),
  logical("deicing.active", "Deicing in progress", "Обработка идёт"),
  enu("deicing.fluid", ["type1", "type2", "type3", "type4", "none"], "Deicing fluid type", "Тип противообледенительной жидкости"),
]);

write("layer-b-runway_ops.json", [
  id("runway_ops.runway.id", "Runway id", "ID ВПП"),
  q("runway_ops.cfr", "-", "Contaminant/friction report", "Отчёт о сцеплении"),
  q("runway_ops.mu", "-", "Friction mu", "Коэффициент сцепления"),
  q("runway_ops.wind.cross", "kn", "Crosswind component", "Боковой ветер"),
  q("runway_ops.rvr", "m", "Runway visual range", "Дальность видимости на ВПП"),
  q("runway_ops.ops.hour", "-", "Movements per hour", "Движений в час", { encodings: ["i16"] }),
  logical("runway_ops.closed", "Runway closed", "ВПП закрыта"),
  enu("runway_ops.condition", ["dry", "wet", "snow", "ice", "slush", "closed"], "Runway condition", "Состояние ВПП"),
]);

write("layer-b-gse_fleet.json", [
  id("gse_fleet.asset.id", "GSE asset id", "ID наземной техники"),
  id("gse_fleet.airport.id", "GSE airport id", "ID аэропорта GSE"),
  q("gse_fleet.battery.soc", "%", "GSE battery SoC", "SoC АКБ GSE", { range: { min: 0, max: 100 } }),
  q("gse_fleet.runtime.h", "h", "Runtime hours", "Моточасы"),
  q("gse_fleet.utilization", "%", "Utilization", "Утилизация", { range: { min: 0, max: 100 } }),
  logical("gse_fleet.assigned", "Assigned to flight", "Назначен на рейс"),
  enu("gse_fleet.type", ["pushback", "belt", "loader", "gpu", "asute", "other"], "GSE type", "Тип GSE"),
  enu("gse_fleet.state", ["available", "in_use", "charging", "maintenance", "down"], "GSE state", "Состояние GSE"),
]);

write("layer-b-hotel_ops.json", [
  id("hotel_ops.property.id", "Hotel property id", "ID гостиницы"),
  id("hotel_ops.room.id", "Hotel room id", "ID номера"),
  q("hotel_ops.occupancy", "%", "Occupancy", "Загрузка", { range: { min: 0, max: 100 } }),
  q("hotel_ops.adr", "-", "Average daily rate", "Средняя цена номера"),
  q("hotel_ops.energy.room", "W", "Room energy draw", "Энергопотребление номера"),
  q("hotel_ops.hk.minutes", "min", "Housekeeping minutes", "Минуты уборки"),
  logical("hotel_ops.room.dnd", "Do not disturb", "Не беспокоить"),
  enu("hotel_ops.room.state", ["vacant", "occupied", "dirty", "clean", "ooo", "oos"], "Room state", "Состояние номера"),
]);

write("layer-b-kitchen_hood.json", [
  id("kitchen_hood.id", "Kitchen hood id", "ID кухонного зонта"),
  id("kitchen_hood.site.id", "Kitchen site id", "ID кухни"),
  q("kitchen_hood.exhaust.flow", "m3/h", "Exhaust airflow", "Расход вытяжки"),
  q("kitchen_hood.filter.dp", "Pa", "Filter differential pressure", "Перепад на фильтре"),
  q("kitchen_hood.temp", "Cel", "Hood temperature", "Температура зонта"),
  logical("kitchen_hood.fire.suppression", "Suppression discharged", "Пожаротушение сработало"),
  logical("kitchen_hood.fan.on", "Exhaust fan on", "Вытяжной вентилятор вкл"),
  enu("kitchen_hood.state", ["off", "idle", "cook", "wash", "fault"], "Hood state", "Состояние зонта"),
]);

write("layer-b-waste_bin.json", [
  id("waste_bin.id", "Smart waste bin id", "ID умного контейнера"),
  id("waste_bin.route.id", "Collection route id", "ID маршрута сбора"),
  q("waste_bin.fill", "%", "Fill level", "Уровень заполнения", { range: { min: 0, max: 100 } }),
  q("waste_bin.temp", "Cel", "Bin temperature", "Температура контейнера"),
  q("waste_bin.weight", "kg", "Contents weight", "Масса содержимого"),
  logical("waste_bin.full", "Bin full", "Контейнер полон"),
  logical("waste_bin.fire.risk", "Fire risk", "Риск возгорания"),
  enu("waste_bin.stream", ["mixed", "recycle", "organic", "glass", "other"], "Waste stream", "Поток отходов"),
]);

write("layer-b-snow_plow.json", [
  id("snow_plow.vehicle.id", "Snow plow id", "ID снегоуборщика"),
  id("snow_plow.route.id", "Plow route id", "ID маршрута уборки"),
  q("snow_plow.blade.down", "-", "Blade down 1/0", "Отвал опущен", { encodings: ["u8"] }),
  q("snow_plow.salt.rate", "g/m2", "Salt application rate", "Норма соли"),
  q("snow_plow.speed", "km/h", "Plow speed", "Скорость уборки"),
  q("snow_plow.coverage.km", "km", "Route covered", "Пройдено по маршруту"),
  logical("snow_plow.spreader.on", "Spreader on", "Разбрасыватель вкл"),
  enu("snow_plow.state", ["depot", "patrol", "plow", "salt", "done"], "Plow state", "Состояние снегоуборки"),
]);

write("layer-b-pavement_sensor.json", [
  id("pavement_sensor.id", "Pavement sensor id", "ID датчика покрытия"),
  id("pavement_sensor.segment.id", "Road segment id", "ID участка дороги"),
  q("pavement_sensor.surface.temp", "Cel", "Surface temperature", "Температура покрытия"),
  q("pavement_sensor.subsurface.temp", "Cel", "Subsurface temperature", "Температура основания"),
  q("pavement_sensor.freeze.point", "Cel", "Freeze point", "Точка замерзания"),
  q("pavement_sensor.salinity", "-", "Surface salinity index", "Индекс солёности"),
  logical("pavement_sensor.ice", "Ice present", "Лёд на покрытии"),
  enu("pavement_sensor.condition", ["dry", "moist", "wet", "frost", "ice", "snow"], "Pavement condition", "Состояние покрытия"),
]);

write("layer-b-noise_monitor.json", [
  id("noise_monitor.station.id", "Noise monitor station id", "ID станции шума"),
  q("noise_monitor.laeq", "dB", "LAeq", "LAeq"),
  q("noise_monitor.lmax", "dB", "LAmax", "LAmax"),
  q("noise_monitor.lnight", "dB", "Night level", "Ночной уровень"),
  q("noise_monitor.exceedance.min", "min", "Exceedance minutes", "Минуты превышения"),
  logical("noise_monitor.alarm", "Noise alarm", "Тревога по шуму"),
  media("noise_monitor.spectrum.ref", "Spectrum ref", "Референс спектра"),
  enu("noise_monitor.source", ["road", "rail", "aircraft", "industry", "construction", "other"], "Dominant source", "Доминирующий источник"),
]);

write("layer-b-volcano.json", [
  id("volcano.id", "Volcano id", "ID вулкана"),
  id("volcano.station.id", "Volcano monitoring station id", "ID станции мониторинга вулкана"),
  q("volcano.emission.so2", "t/d", "SO2 emission rate", "Выброс SO₂"),
  q("volcano.seismic.tremor", "-", "Seismic tremor amplitude", "Амплитуда тремора"),
  q("volcano.deformation", "mm", "Ground deformation", "Деформация грунта"),
  q("volcano.plume.height", "m", "Ash plume height", "Высота пеплового столба"),
  logical("volcano.eruption", "Eruption ongoing", "Извержение идёт"),
  enu("volcano.alert", ["green", "yellow", "orange", "red"], "Volcano alert level", "Уровень тревоги вулкана"),
]);

write("layer-b-tsunami.json", [
  id("tsunami.buoy.id", "Tsunami buoy id", "ID цунами-буя"),
  id("tsunami.warning.id", "Tsunami warning id", "ID предупреждения о цунами"),
  q("tsunami.wave.height", "m", "Tsunami wave height", "Высота волны цунами"),
  q("tsunami.eta.min", "min", "ETA to coast", "ETA к берегу"),
  q("tsunami.sea.level_anomaly", "m", "Sea level anomaly", "Аномалия уровня моря"),
  logical("tsunami.warning.active", "Warning active", "Предупреждение активно"),
  logical("tsunami.evacuation", "Evacuation ordered", "Эвакуация объявлена"),
  enu("tsunami.level", ["watch", "advisory", "warning", "cancel"], "Tsunami alert level", "Уровень тревоги цунами"),
]);

write("layer-b-earthquake_early.json", [
  id("earthquake_early.event.id", "Earthquake event id", "ID землетрясения"),
  id("earthquake_early.station.id", "EEW station id", "ID станции СЭЗ"),
  q("earthquake_early.mag", "-", "Magnitude estimate", "Оценка магнитуды"),
  q("earthquake_early.pga", "m/s2", "Peak ground acceleration", "Пиковое ускорение"),
  q("earthquake_early.warning.s", "s", "Warning lead time", "Время предупреждения"),
  q("earthquake_early.depth", "km", "Hypocenter depth", "Глубина очага"),
  logical("earthquake_early.alert", "EEW alert issued", "СЭЗ выдано"),
  enu("earthquake_early.intensity", ["weak", "light", "moderate", "strong", "severe"], "Shaking intensity", "Интенсивность тряски"),
]);

write("layer-b-glacier.json", [
  id("glacier.id", "Glacier id", "ID ледника"),
  id("glacier.stake.id", "Mass-balance stake id", "ID рейки баланса"),
  q("glacier.mass.balance", "mmwe", "Mass balance", "Массовый баланс"),
  q("glacier.velocity", "m/d", "Surface velocity", "Скорость поверхности"),
  q("glacier.terminus.advance", "m", "Terminus position change", "Смещение языка"),
  q("glacier.albedo", "-", "Surface albedo", "Альбедо поверхности"),
  media("glacier.imagery.ref", "Glacier imagery ref", "Референс снимков ледника"),
  enu("glacier.state", ["stable", "retreating", "advancing", "surging", "disintegrating"], "Glacier state", "Состояние ледника"),
]);

write("layer-b-permafrost.json", [
  id("permafrost.borehole.id", "Permafrost borehole id", "ID скважины мерзлоты"),
  q("permafrost.temp.ground", "Cel", "Ground temperature", "Температура грунта"),
  q("permafrost.active.layer_m", "m", "Active layer thickness", "Мощность деятельного слоя"),
  q("permafrost.subsidence", "mm", "Subsidence", "Просадка"),
  q("permafrost.ice.content", "%", "Ground ice content", "Содержание льда", { range: { min: 0, max: 100 } }),
  logical("permafrost.thaw.alert", "Thaw alert", "Тревога оттаивания"),
  enu("permafrost.zone", ["continuous", "discontinuous", "sporadic", "isolated"], "Permafrost zone", "Зона мерзлоты"),
]);

write("layer-b-wetland.json", [
  id("wetland.site.id", "Wetland site id", "ID водно-болотного угодья"),
  q("wetland.water.level", "m", "Water level", "Уровень воды"),
  q("wetland.salinity", "PSU", "Salinity", "Солёность"),
  q("wetland.vegetation.cover", "%", "Vegetation cover", "Покрытие растительностью", { range: { min: 0, max: 100 } }),
  q("wetland.methane.flux", "mg/m2/h", "Methane flux", "Поток метана"),
  q("wetland.bird.count", "-", "Bird count", "Учёт птиц", { encodings: ["i32"] }),
  enu("wetland.type", ["marsh", "swamp", "bog", "fen", "mangrove", "other"], "Wetland type", "Тип угодья"),
]);

write("layer-b-fish_ladder.json", [
  id("fish_ladder.id", "Fish ladder id", "ID рыбохода"),
  id("fish_ladder.dam.id", "Associated dam id", "ID связанной плотины"),
  q("fish_ladder.flow", "m3/s", "Attraction flow", "Привлекающий расход"),
  q("fish_ladder.count.upstream", "-", "Upstream fish count", "Рыб вверх", { encodings: ["i32"] }),
  q("fish_ladder.count.downstream", "-", "Downstream fish count", "Рыб вниз", { encodings: ["i32"] }),
  q("fish_ladder.water.temp", "Cel", "Ladder water temperature", "Температура воды в рыбоходе"),
  logical("fish_ladder.open", "Ladder open", "Рыбоход открыт"),
  enu("fish_ladder.type", ["pool", "denil", "vertical_slot", "nature_like", "elevator"], "Fishway type", "Тип рыбохода"),
]);

write("layer-b-lock_canal.json", [
  id("lock_canal.lock.id", "Canal lock id", "ID шлюза"),
  id("lock_canal.vessel.id", "Vessel in lock", "ID судна в шлюзе"),
  q("lock_canal.chamber.level", "m", "Chamber water level", "Уровень в камере"),
  q("lock_canal.cycle.min", "min", "Lock cycle time", "Время цикла шлюзования"),
  q("lock_canal.queue", "-", "Vessels waiting", "Судов в ожидании", { encodings: ["i16"] }),
  logical("lock_canal.gate.open", "Gate open", "Ворота открыты"),
  logical("lock_canal.fault", "Lock fault", "Неисправность шлюза"),
  enu("lock_canal.state", ["idle", "fill", "empty", "transit", "maintenance"], "Lock state", "Состояние шлюза"),
]);

write("layer-b-vts.json", [
  id("vts.center.id", "VTS center id", "ID СУДС"),
  id("vts.vessel.id", "Tracked vessel id", "ID сопровождаемого судна"),
  q("vts.traffic.density", "-", "Traffic density index", "Индекс плотности движения"),
  q("vts.closest.point_m", "m", "Closest point of approach", "Кратчайшее сближение"),
  q("vts.incidents", "-", "Incidents today", "Инцидентов сегодня", { encodings: ["i16"] }),
  logical("vts.alert.collision", "Collision risk alert", "Риск столкновения"),
  logical("vts.alert.grounding", "Grounding risk alert", "Риск посадки на мель"),
  enu("vts.service", ["information", "traffic_org", "navigational"], "VTS service level", "Уровень службы СУДС"),
]);

write("layer-b-additive_mfg.json", [
  id("additive_mfg.job.id", "AM job id", "ID задания АП"),
  id("additive_mfg.printer.id", "AM printer id", "ID 3D-принтера"),
  q("additive_mfg.layer", "-", "Current layer", "Текущий слой", { encodings: ["i32"] }),
  q("additive_mfg.build.progress", "%", "Build progress", "Прогресс построения", { range: { min: 0, max: 100 } }),
  q("additive_mfg.chamber.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("additive_mfg.powder.level", "%", "Powder level", "Уровень порошка", { range: { min: 0, max: 100 } }),
  logical("additive_mfg.recoater.fault", "Recoater fault", "Сбой рекоутера"),
  enu("additive_mfg.process", ["sls", "slm", "fdm", "sla", "ebm", "other"], "AM process", "Процесс АП"),
]);

write("layer-b-injection_mold.json", [
  id("injection_mold.machine.id", "Injection molding machine id", "ID ТПА"),
  id("injection_mold.tool.id", "Mold tool id", "ID пресс-формы"),
  q("injection_mold.melt.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("injection_mold.mold.temp", "Cel", "Mold temperature", "Температура формы"),
  q("injection_mold.injection.pressure", "Pa", "Injection pressure", "Давление впрыска"),
  q("injection_mold.cycle.s", "s", "Cycle time", "Время цикла"),
  q("injection_mold.shot.weight", "g", "Shot weight", "Масса впрыска"),
  enu("injection_mold.state", ["idle", "inject", "pack", "cool", "eject", "fault"], "IMM state", "Состояние ТПА"),
]);

write("layer-b-heat_treat.json", [
  id("heat_treat.furnace.id", "Heat-treat furnace id", "ID печи термообработки"),
  id("heat_treat.batch.id", "Heat-treat batch id", "ID садки"),
  q("heat_treat.temp", "Cel", "Furnace temperature", "Температура печи"),
  q("heat_treat.soak.min", "min", "Soak time", "Время выдержки"),
  q("heat_treat.atmosphere.o2", "ppm", "Atmosphere O2", "O₂ атмосферы"),
  q("heat_treat.hardness", "HV", "Result hardness", "Твёрдость результата"),
  logical("heat_treat.recipe.pass", "Recipe conformance", "Соответствие рецепту"),
  enu("heat_treat.process", ["anneal", "quench", "temper", "carburize", "nitride", "other"], "Heat-treat process", "Процесс термообработки"),
]);

write("layer-b-plating.json", [
  id("plating.line.id", "Plating line id", "ID гальванической линии"),
  id("plating.bath.id", "Plating bath id", "ID ванны"),
  q("plating.bath.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("plating.bath.ph", "-", "Bath pH", "pH ванны"),
  q("plating.current.density", "A/dm2", "Current density", "Плотность тока"),
  q("plating.thickness", "um", "Deposit thickness", "Толщина покрытия"),
  q("plating.metal.conc", "g/L", "Metal concentration", "Концентрация металла"),
  enu("plating.process", ["nickel", "chrome", "zinc", "copper", "anodize", "other"], "Plating process", "Процесс покрытия"),
]);

write("layer-b-cmm.json", [
  id("cmm.device.id", "CMM id", "ID КИМ"),
  id("cmm.part.id", "Measured part id", "ID измеряемой детали"),
  q("cmm.deviation.max", "um", "Max deviation", "Макс. отклонение"),
  q("cmm.points", "-", "Measured points", "Число точек", { encodings: ["i32"] }),
  q("cmm.cycle.s", "s", "Measurement cycle", "Цикл измерения"),
  q("cmm.temp", "Cel", "CMM room temperature", "Температура комнаты КИМ"),
  logical("cmm.in_tolerance", "In tolerance", "В допуске"),
  enu("cmm.result", ["pass", "fail", "rework", "incomplete"], "CMM result", "Результат КИМ"),
]);

write("layer-b-laser_cut.json", [
  id("laser_cut.machine.id", "Laser cutter id", "ID лазерного станка"),
  id("laser_cut.job.id", "Laser cut job id", "ID задания резки"),
  q("laser_cut.power", "W", "Laser power", "Мощность лазера"),
  q("laser_cut.speed", "mm/min", "Cut speed", "Скорость резки"),
  q("laser_cut.gas.pressure", "Pa", "Assist gas pressure", "Давление газа"),
  q("laser_cut.pierce.time_s", "s", "Pierce time", "Время прокола"),
  q("laser_cut.nest.utilization", "%", "Nest utilization", "Использование листа", { range: { min: 0, max: 100 } }),
  enu("laser_cut.state", ["idle", "pierce", "cut", "mark", "fault"], "Laser cut state", "Состояние лазерной резки"),
]);

write("layer-b-paint_booth.json", [
  id("paint_booth.id", "Paint booth id", "ID окрасочной камеры"),
  id("paint_booth.job.id", "Paint job id", "ID задания окраски"),
  q("paint_booth.temp", "Cel", "Booth temperature", "Температура камеры"),
  q("paint_booth.humidity", "%", "Booth humidity", "Влажность камеры", { range: { min: 0, max: 100 } }),
  q("paint_booth.airflow", "m3/h", "Booth airflow", "Воздухообмен камеры"),
  q("paint_booth.voc", "mg/m3", "VOC concentration", "Концентрация ЛОС"),
  q("paint_booth.film.thickness", "um", "Dry film thickness", "Толщина сухой плёнки"),
  enu("paint_booth.stage", ["prep", "spray", "flash", "bake", "cool", "inspect"], "Paint stage", "Стадия окраски"),
]);

write("layer-b-composite_layup.json", [
  id("composite_layup.job.id", "Layup job id", "ID выкладки"),
  id("composite_layup.tool.id", "Layup tool id", "ID оснастки выкладки"),
  q("composite_layup.plies", "-", "Plies laid", "Уложено слоёв", { encodings: ["i16"] }),
  q("composite_layup.temp", "Cel", "Layup room temperature", "Температура комнаты выкладки"),
  q("composite_layup.humidity", "%", "Layup room humidity", "Влажность комнаты выкладки", { range: { min: 0, max: 100 } }),
  q("composite_layup.out_time.h", "h", "Prepreg out-time", "Время препрега вне холода"),
  logical("composite_layup.fod", "FOD detected", "Обнаружен FOD"),
  enu("composite_layup.stage", ["kit", "layup", "bag", "cure", "demold", "inspect"], "Layup stage", "Стадия выкладки"),
]);

write("layer-b-autoclave_composite.json", [
  id("autoclave_composite.id", "Composite autoclave id", "ID автоклава композитов"),
  id("autoclave_composite.run.id", "Autoclave run id", "ID цикла автоклава"),
  q("autoclave_composite.temp", "Cel", "Autoclave temperature", "Температура автоклава"),
  q("autoclave_composite.pressure", "Pa", "Autoclave pressure", "Давление автоклава"),
  q("autoclave_composite.vacuum", "Pa", "Bag vacuum", "Вакуум мешка"),
  q("autoclave_composite.ramp.K_min", "K/min", "Temp ramp rate", "Скорость нагрева"),
  logical("autoclave_composite.recipe.pass", "Cure recipe pass", "Рецепт отверждения OK"),
  enu("autoclave_composite.state", ["load", "ramp", "soak", "cool", "unload", "fault"], "Autoclave state", "Состояние автоклава"),
]);

write("layer-b-extrusion.json", [
  id("extrusion.line.id", "Extrusion line id", "ID линии экструзии"),
  id("extrusion.die.id", "Extrusion die id", "ID фильеры"),
  q("extrusion.melt.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("extrusion.screw.rpm", "rpm", "Screw RPM", "Обороты шнека"),
  q("extrusion.pressure", "Pa", "Die pressure", "Давление у фильеры"),
  q("extrusion.haul.off_m_min", "m/min", "Haul-off speed", "Скорость отвода"),
  q("extrusion.dimension", "mm", "Product dimension", "Размер профиля"),
  enu("extrusion.product", ["pipe", "profile", "sheet", "film", "cable", "other"], "Extrusion product", "Продукт экструзии"),
]);

write("layer-b-blow_mold.json", [
  id("blow_mold.machine.id", "Blow molding machine id", "ID машины выдува"),
  id("blow_mold.mold.id", "Blow mold id", "ID формы выдува"),
  q("blow_mold.parison.temp", "Cel", "Parison temperature", "Температура парисоны"),
  q("blow_mold.blow.pressure", "Pa", "Blow pressure", "Давление выдува"),
  q("blow_mold.cycle.s", "s", "Cycle time", "Время цикла"),
  q("blow_mold.wall.thickness", "mm", "Wall thickness", "Толщина стенки"),
  q("blow_mold.leak.rate", "%", "Leak reject rate", "Доля утечек", { range: { min: 0, max: 100 } }),
  enu("blow_mold.process", ["ebm", "isbm", "injection_blow", "other"], "Blow process", "Процесс выдува"),
]);

write("layer-b-balancing_machine.json", [
  id("balancing_machine.id", "Balancing machine id", "ID балансировочного станка"),
  id("balancing_machine.rotor.id", "Rotor id", "ID ротора"),
  q("balancing_machine.unbalance", "g.mm", "Residual unbalance", "Остаточный дисбаланс"),
  q("balancing_machine.speed", "rpm", "Balance speed", "Скорость балансировки"),
  q("balancing_machine.correction.mass", "g", "Correction mass", "Корректирующая масса"),
  q("balancing_machine.plane", "-", "Correction plane count", "Число плоскостей", { encodings: ["i16"] }),
  logical("balancing_machine.pass", "Balance pass", "Балансировка OK"),
  enu("balancing_machine.result", ["pass", "trim", "fail", "abort"], "Balance result", "Результат балансировки"),
]);

write("layer-b-hardness_test.json", [
  id("hardness_test.device.id", "Hardness tester id", "ID твердомера"),
  id("hardness_test.sample.id", "Hardness sample id", "ID образца твёрдости"),
  q("hardness_test.value", "HV", "Hardness value", "Значение твёрдости"),
  q("hardness_test.load", "N", "Test load", "Нагрузка испытания"),
  q("hardness_test.indent.depth", "um", "Indentation depth", "Глубина отпечатка"),
  logical("hardness_test.in_spec", "In specification", "В спецификации"),
  enu("hardness_test.scale", ["hv", "hb", "hrc", "hrb", "other"], "Hardness scale", "Шкала твёрдости"),
  enu("hardness_test.result", ["pass", "fail", "retest"], "Hardness result", "Результат твёрдости"),
]);

write("layer-b-invasive_species.json", [
  id("invasive_species.site.id", "Survey site id", "ID участка мониторинга"),
  id("invasive_species.taxon.id", "Taxon id", "ID таксона"),
  q("invasive_species.density", "/m2", "Population density", "Плотность популяции"),
  q("invasive_species.area.ha", "ha", "Infested area", "Площадь заражения"),
  q("invasive_species.trap.count", "-", "Trap captures", "Отлов в ловушках", { encodings: ["i32"] }),
  logical("invasive_species.alert", "Invasion alert", "Тревога инвазии"),
  media("invasive_species.photo.ref", "Detection photo ref", "Референс фото"),
  enu("invasive_species.status", ["absent", "detected", "established", "controlled", "eradicated"], "Invasion status", "Статус инвазии"),
]);

write("layer-b-wildlife_crossing.json", [
  id("wildlife_crossing.id", "Wildlife crossing id", "ID экодука"),
  id("wildlife_crossing.camera.id", "Crossing camera id", "ID камеры перехода"),
  q("wildlife_crossing.crossings.day", "-", "Crossings per day", "Переходов в сутки", { encodings: ["i32"] }),
  q("wildlife_crossing.species.richness", "-", "Species richness", "Видовое богатство", { encodings: ["i16"] }),
  q("wildlife_crossing.roadkill.nearby", "-", "Nearby roadkill count", "ДТП с животными рядом", { encodings: ["i32"] }),
  logical("wildlife_crossing.fence.breach", "Fence breach", "Разрыв ограждения"),
  media("wildlife_crossing.image.ref", "Crossing image ref", "Референс снимка перехода"),
  enu("wildlife_crossing.type", ["overpass", "underpass", "culvert", "canopy", "other"], "Crossing type", "Тип перехода"),
]);

write("layer-b-coral_reef.json", [
  id("coral_reef.site.id", "Reef site id", "ID рифа"),
  q("coral_reef.cover", "%", "Live coral cover", "Покрытие живыми кораллами", { range: { min: 0, max: 100 } }),
  q("coral_reef.bleaching", "%", "Bleaching extent", "Доля отбеливания", { range: { min: 0, max: 100 } }),
  q("coral_reef.sst", "Cel", "Sea surface temperature", "Температура поверхности"),
  q("coral_reef.dhw", "C.week", "Degree heating weeks", "Градусо-недели нагрева"),
  q("coral_reef.turbidity", "NTU", "Water turbidity", "Мутность воды"),
  media("coral_reef.photo.ref", "Reef photo ref", "Референс фото рифа"),
  enu("coral_reef.health", ["pristine", "good", "fair", "poor", "critical"], "Reef health", "Состояние рифа"),
]);

write("layer-b-biodiversity.json", [
  id("biodiversity.plot.id", "Biodiversity plot id", "ID площадки биоразнообразия"),
  q("biodiversity.shannon", "-", "Shannon index", "Индекс Шеннона"),
  q("biodiversity.species.count", "-", "Species count", "Число видов", { encodings: ["i32"] }),
  q("biodiversity.biomass", "t/ha", "Biomass", "Биомасса"),
  q("biodiversity.acoustic.index", "-", "Acoustic complexity index", "Акустический индекс"),
  media("biodiversity.checklist.ref", "Species checklist ref", "Референс чек-листа"),
  enu("biodiversity.method", ["transect", "camera_trap", "edna", "acoustic", "remote", "other"], "Survey method", "Метод учёта"),
  enu("biodiversity.trend", ["increasing", "stable", "declining", "unknown"], "Biodiversity trend", "Тренд биоразнообразия"),
]);

write("layer-b-smr.json", [
  id("smr.module.id", "SMR module id", "ID модуля ММР"),
  id("smr.plant.id", "SMR plant id", "ID станции ММР"),
  q("smr.power", "%", "Module power", "Мощность модуля", { range: { min: 0, max: 110 } }),
  q("smr.coolant.temp", "Cel", "Coolant temperature", "Температура теплоносителя"),
  q("smr.coolant.flow", "kg/s", "Coolant flow", "Расход теплоносителя"),
  q("smr.containment.pressure", "Pa", "Containment pressure", "Давление гермообъёма"),
  logical("smr.scram", "Module scram", "АЗ модуля"),
  enu("smr.state", ["startup", "power", "coast_down", "refuel", "fault"], "SMR state", "Состояние ММР"),
]);

write("layer-b-spent_fuel.json", [
  id("spent_fuel.cask.id", "Spent fuel cask id", "ID контейнера ОЯТ"),
  id("spent_fuel.pool.id", "Spent fuel pool id", "ID бассейна выдержки"),
  q("spent_fuel.pool.temp", "Cel", "Pool temperature", "Температура бассейна"),
  q("spent_fuel.pool.level", "m", "Pool water level", "Уровень воды бассейна"),
  q("spent_fuel.cask.temp", "Cel", "Cask surface temperature", "Температура контейнера"),
  q("spent_fuel.dose.rate", "uSv/h", "Area dose rate", "Мощность дозы"),
  logical("spent_fuel.cooling.ok", "Cooling OK", "Охлаждение OK"),
  enu("spent_fuel.storage", ["pool", "dry_cask", "transport", "reprocess"], "Storage mode", "Режим хранения"),
]);

console.log("Layer B9 seeds written");
