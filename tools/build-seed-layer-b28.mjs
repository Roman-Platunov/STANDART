#!/usr/bin/env node
/**
 * Layer B28 — pharma / biotech manufacturing, utilities, QC.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B28", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-pharma_react.json", [
  id("pharma_react.id", "Pharma reactor id", "ID фармацевтического реактора"),
  id("pharma_react.batch.id", "Batch id", "ID партии"),
  q("pharma_react.temp", "Cel", "Jacket / batch temperature", "Температура рубашки/партии"),
  q("pharma_react.pressure", "kPa", "Vessel pressure", "Давление аппарата"),
  q("pharma_react.agitation", "rpm", "Agitation speed", "Обороты мешалки"),
  q("pharma_react.ph", "-", "pH", "pH"),
  logical("pharma_react.cip", "CIP active", "CIP активен"),
  enu("pharma_react.state", ["charge", "react", "cool", "idle", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-bioreactor_cell.json", [
  id("bioreactor_cell.id", "Cell culture bioreactor id", "ID биореактора клеточной культуры"),
  id("bioreactor_cell.batch.id", "Batch id", "ID партии"),
  q("bioreactor_cell.temp", "Cel", "Culture temperature", "Температура культуры"),
  q("bioreactor_cell.do", "%", "Dissolved oxygen", "Растворённый кислород", { range: { min: 0, max: 100 } }),
  q("bioreactor_cell.ph", "-", "pH", "pH"),
  q("bioreactor_cell.viable", "/mL", "Viable cell density", "Плотность жизнеспособных клеток"),
  logical("bioreactor_cell.contamination", "Contamination flag", "Признак контаминации"),
  enu("bioreactor_cell.mode", ["batch", "fed_batch", "perfusion", "other"], "Mode", "Режим"),
]);

write("layer-b-chromat_skid.json", [
  id("chromat_skid.id", "Chromatography skid id", "ID хроматографической станции"),
  id("chromat_skid.run.id", "Run id", "ID прогона"),
  q("chromat_skid.flow", "L/h", "Flow rate", "Расход"),
  q("chromat_skid.pressure", "kPa", "Column pressure", "Давление колонки"),
  q("chromat_skid.uv", "mAU", "UV absorbance", "Поглощение УФ"),
  q("chromat_skid.conductivity", "mS/cm", "Conductivity", "Проводимость"),
  logical("chromat_skid.peak", "Peak collecting", "Сбор пика"),
  enu("chromat_skid.step", ["equilibrate", "load", "wash", "elute", "cip", "fault"], "Step", "Шаг"),
]);

write("layer-b-ultrafilt_skid.json", [
  id("ultrafilt_skid.id", "UF / DF skid id", "ID станции УФ/ДФ"),
  id("ultrafilt_skid.batch.id", "Batch id", "ID партии"),
  q("ultrafilt_skid.tmp", "kPa", "Transmembrane pressure", "Трансмембранное давление"),
  q("ultrafilt_skid.flux", "L/m2/h", "Permeate flux", "Поток пермеата"),
  q("ultrafilt_skid.conc", "-", "Concentration factor", "Коэффициент концентрирования"),
  q("ultrafilt_skid.volume", "L", "Retentate volume", "Объём ретентата"),
  logical("ultrafilt_skid.fouling", "Fouling high", "Высокое загрязнение"),
  enu("ultrafilt_skid.mode", ["concentrate", "diafilter", "recover", "cip", "fault"], "Mode", "Режим"),
]);

write("layer-b-lyophilizer.json", [
  id("lyophilizer.id", "Lyophilizer id", "ID лиофильной сушилки"),
  id("lyophilizer.batch.id", "Batch id", "ID партии"),
  q("lyophilizer.shelf.temp", "Cel", "Shelf temperature", "Температура полок"),
  q("lyophilizer.product.temp", "Cel", "Product temperature", "Температура продукта"),
  q("lyophilizer.vacuum", "Pa", "Chamber vacuum", "Вакуум камеры"),
  q("lyophilizer.condenser", "Cel", "Condenser temperature", "Температура конденсатора"),
  logical("lyophilizer.primary.done", "Primary drying done", "Первичная сушка завершена"),
  enu("lyophilizer.phase", ["freeze", "primary", "secondary", "stopper", "fault"], "Phase", "Фаза"),
]);

write("layer-b-vial_fill.json", [
  id("vial_fill.line.id", "Vial filling line id", "ID линии наполнения флаконов"),
  id("vial_fill.batch.id", "Batch id", "ID партии"),
  q("vial_fill.speed", "/h", "Vials per hour", "Флаконов в час"),
  q("vial_fill.volume", "mL", "Fill volume", "Объём наполнения"),
  q("vial_fill.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("vial_fill.weight", "g", "Check-weigh mean", "Средний контрольный вес"),
  logical("vial_fill.aseptic.ok", "Aseptic OK", "Асептика OK"),
  enu("vial_fill.state", ["setup", "fill", "stopper", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-syringe_fill.json", [
  id("syringe_fill.line.id", "Prefilled syringe line id", "ID линии предзаполненных шприцев"),
  id("syringe_fill.batch.id", "Batch id", "ID партии"),
  q("syringe_fill.speed", "/h", "Syringes per hour", "Шприцев в час"),
  q("syringe_fill.volume", "mL", "Fill volume", "Объём наполнения"),
  q("syringe_fill.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("syringe_fill.bubble", "%", "Bubble reject", "Брак по пузырькам", { range: { min: 0, max: 100 } }),
  logical("syringe_fill.needle.ok", "Needle assembly OK", "Сборка иглы OK"),
  enu("syringe_fill.state", ["fill", "assemble", "inspect", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-inspect_vial.json", [
  id("inspect_vial.machine.id", "Automatic vial inspection id", "ID автоинспекции флаконов"),
  id("inspect_vial.batch.id", "Batch id", "ID партии"),
  q("inspect_vial.speed", "/h", "Vials per hour", "Флаконов в час"),
  q("inspect_vial.reject", "%", "Total reject", "Общий брак", { range: { min: 0, max: 100 } }),
  q("inspect_vial.particle", "%", "Particle reject", "Брак по частицам", { range: { min: 0, max: 100 } }),
  q("inspect_vial.cosmetic", "%", "Cosmetic reject", "Косметический брак", { range: { min: 0, max: 100 } }),
  logical("inspect_vial.retest", "Retest mode", "Режим перепроверки"),
  enu("inspect_vial.state", ["inspect", "calibrate", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-autoclave_ph.json", [
  id("autoclave_ph.id", "Pharma autoclave id", "ID фармацевтического автоклава"),
  id("autoclave_ph.load.id", "Load id", "ID загрузки"),
  q("autoclave_ph.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("autoclave_ph.pressure", "kPa", "Chamber pressure", "Давление камеры"),
  q("autoclave_ph.f0", "min", "F0", "F0"),
  q("autoclave_ph.hold.min", "min", "Hold time", "Время выдержки"),
  logical("autoclave_ph.pass", "Cycle pass", "Цикл пройден"),
  enu("autoclave_ph.state", ["heat", "expose", "exhaust", "idle", "fault"], "Autoclave state", "Состояние автоклава"),
]);

write("layer-b-wfi_still.json", [
  id("wfi_still.id", "WFI still id", "ID дистиллятора ВДИ"),
  q("wfi_still.output", "L/h", "WFI production", "Выработка ВДИ"),
  q("wfi_still.conductivity", "uS/cm", "WFI conductivity", "Проводимость ВДИ"),
  q("wfi_still.toc", "ug/L", "TOC", "ТОС"),
  q("wfi_still.temp", "Cel", "WFI temperature", "Температура ВДИ"),
  q("wfi_still.steam", "kg/h", "Heating steam", "Греющий пар"),
  logical("wfi_still.spec.ok", "Spec OK", "Спецификация OK"),
  enu("wfi_still.state", ["produce", "sanitize", "idle", "fault"], "Still state", "Состояние дистиллятора"),
]);

write("layer-b-clean_steam_ph.json", [
  id("clean_steam_ph.gen.id", "Clean steam generator id", "ID генератора чистого пара"),
  q("clean_steam_ph.pressure", "kPa", "Steam pressure", "Давление пара"),
  q("clean_steam_ph.temp", "Cel", "Steam temperature", "Температура пара"),
  q("clean_steam_ph.ncg", "%", "Non-condensables", "Неконденсируемые", { range: { min: 0, max: 100 } }),
  q("clean_steam_ph.conductivity", "uS/cm", "Condensate conductivity", "Проводимость конденсата"),
  q("clean_steam_ph.output", "kg/h", "Steam output", "Выработка пара"),
  logical("clean_steam_ph.quality.ok", "Quality OK", "Качество OK"),
  enu("clean_steam_ph.state", ["produce", "idle", "maintain", "fault"], "Generator state", "Состояние генератора"),
]);

write("layer-b-isolator_fill.json", [
  id("isolator_fill.id", "Filling isolator id", "ID изолятора наполнения"),
  q("isolator_fill.pressure", "Pa", "Isolator pressure", "Давление изолятора"),
  q("isolator_fill.particles", "/m3", "Particle count", "Число частиц"),
  q("isolator_fill.h2o2", "ppm", "H2O2 residual", "Остаток H2O2"),
  q("isolator_fill.gloves", "-", "Glove integrity OK count", "Перчаток OK", { encodings: ["i32"] }),
  q("isolator_fill.temp", "Cel", "Isolator temperature", "Температура изолятора"),
  logical("isolator_fill.breach", "Containment breach", "Нарушение герметичности"),
  enu("isolator_fill.state", ["decon", "fill", "idle", "fault"], "Isolator state", "Состояние изолятора"),
]);

write("layer-b-hvac_cleanroom.json", [
  id("hvac_cleanroom.zone.id", "Cleanroom HVAC zone id", "ID зоны HVAC чистого помещения"),
  q("hvac_cleanroom.ach", "/h", "Air changes per hour", "Кратность воздухообмена"),
  q("hvac_cleanroom.pressure", "Pa", "Room differential", "Перепад давления"),
  q("hvac_cleanroom.temp", "Cel", "Room temperature", "Температура помещения"),
  q("hvac_cleanroom.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("hvac_cleanroom.hepa.dp", "Pa", "HEPA DP", "Перепад на HEPA"),
  logical("hvac_cleanroom.alarm", "Environmental alarm", "Тревога среды"),
  enu("hvac_cleanroom.grade", ["a", "b", "c", "d", "other"], "Grade", "Класс"),
]);

write("layer-b-particle_mon_cr.json", [
  id("particle_mon_cr.sensor.id", "Cleanroom particle sensor id", "ID датчика частиц чистого помещения"),
  q("particle_mon_cr.p05", "/m3", "≥0.5 µm count", "Частиц ≥0.5 мкм"),
  q("particle_mon_cr.p50", "/m3", "≥5.0 µm count", "Частиц ≥5.0 мкм"),
  q("particle_mon_cr.sample.s", "s", "Sample interval", "Интервал отбора"),
  q("particle_mon_cr.alarm", "-", "Alarms today", "Тревог за сутки", { encodings: ["i32"] }),
  q("particle_mon_cr.flow", "L/min", "Sample flow", "Расход пробоотбора"),
  logical("particle_mon_cr.excursion", "Excursion", "Превышение"),
  enu("particle_mon_cr.state", ["monitor", "alarm", "calibrate", "offline"], "Sensor state", "Состояние датчика"),
]);

write("layer-b-em_sample.json", [
  id("em_sample.id", "Environmental monitoring sample id", "ID пробы мониторинга среды"),
  id("em_sample.location.id", "Location id", "ID точки"),
  q("em_sample.cfu", "-", "CFU count", "КОЕ", { encodings: ["i32"] }),
  q("em_sample.incub.d", "d", "Incubation days", "Дней инкубации"),
  q("em_sample.temp", "Cel", "Incubator temperature", "Температура инкубатора"),
  q("em_sample.action", "-", "Action limit breaches", "Превышений action", { encodings: ["i32"] }),
  logical("em_sample.alert", "Alert / action", "Alert / action"),
  enu("em_sample.type", ["settle", "active_air", "surface", "glove", "other"], "Sample type", "Тип пробы"),
]);

write("layer-b-media_prep.json", [
  id("media_prep.skid.id", "Media preparation skid id", "ID станции приготовления сред"),
  id("media_prep.batch.id", "Batch id", "ID партии"),
  q("media_prep.volume", "L", "Batch volume", "Объём партии"),
  q("media_prep.temp", "Cel", "Mix temperature", "Температура смешения"),
  q("media_prep.conductivity", "mS/cm", "Conductivity", "Проводимость"),
  q("media_prep.ph", "-", "pH", "pH"),
  logical("media_prep.sterile", "Sterile filtered", "Стерильно отфильтровано"),
  enu("media_prep.state", ["weigh", "mix", "filter", "transfer", "fault"], "Skid state", "Состояние станции"),
]);

write("layer-b-cell_bank.json", [
  id("cell_bank.id", "Cell bank freezer id", "ID криохранилища клеточного банка"),
  id("cell_bank.vial.id", "Vial id", "ID флакона"),
  q("cell_bank.temp", "Cel", "Storage temperature", "Температура хранения"),
  q("cell_bank.ln2", "%", "LN2 level", "Уровень LN2", { range: { min: 0, max: 100 } }),
  q("cell_bank.access", "-", "Accesses today", "Доступов за сутки", { encodings: ["i32"] }),
  q("cell_bank.inventory", "-", "Vials in store", "Флаконов на хранении", { encodings: ["i32"] }),
  logical("cell_bank.alarm", "Temperature alarm", "Тревога температуры"),
  enu("cell_bank.type", ["mcb", "wcb", "pc", "other"], "Bank type", "Тип банка"),
]);

write("layer-b-viral_filter.json", [
  id("viral_filter.id", "Viral filtration skid id", "ID станции вирусной фильтрации"),
  id("viral_filter.batch.id", "Batch id", "ID партии"),
  q("viral_filter.pressure", "kPa", "Filter pressure", "Давление фильтра"),
  q("viral_filter.flux", "L/m2/h", "Flux", "Поток"),
  q("viral_filter.volume", "L", "Processed volume", "Обработанный объём"),
  q("viral_filter.integrity", "kPa", "Integrity test value", "Значение теста целостности"),
  logical("viral_filter.pass", "Integrity pass", "Целостность OK"),
  enu("viral_filter.state", ["filter", "flush", "test", "idle", "fault"], "Skid state", "Состояние станции"),
]);

write("layer-b-buffer_prep.json", [
  id("buffer_prep.skid.id", "Buffer preparation skid id", "ID станции приготовления буферов"),
  id("buffer_prep.batch.id", "Batch id", "ID партии"),
  q("buffer_prep.volume", "L", "Batch volume", "Объём партии"),
  q("buffer_prep.ph", "-", "pH", "pH"),
  q("buffer_prep.conductivity", "mS/cm", "Conductivity", "Проводимость"),
  q("buffer_prep.temp", "Cel", "Temperature", "Температура"),
  logical("buffer_prep.spec.ok", "Spec OK", "Спецификация OK"),
  enu("buffer_prep.state", ["weigh", "mix", "adjust", "transfer", "fault"], "Skid state", "Состояние станции"),
]);

write("layer-b-cip_skid_ph.json", [
  id("cip_skid_ph.id", "Pharma CIP skid id", "ID станции CIP фарма"),
  id("cip_skid_ph.circuit.id", "Circuit id", "ID контура"),
  q("cip_skid_ph.temp", "Cel", "CIP temperature", "Температура CIP"),
  q("cip_skid_ph.conductivity", "mS/cm", "Return conductivity", "Проводимость возврата"),
  q("cip_skid_ph.flow", "L/min", "CIP flow", "Расход CIP"),
  q("cip_skid_ph.time.min", "min", "Step time", "Время шага"),
  logical("cip_skid_ph.pass", "CIP pass", "CIP пройден"),
  enu("cip_skid_ph.step", ["pre_rinse", "caustic", "acid", "final_rinse", "fault"], "Step", "Шаг"),
]);

write("layer-b-sip_skid.json", [
  id("sip_skid.id", "SIP skid id", "ID станции SIP"),
  id("sip_skid.circuit.id", "Circuit id", "ID контура"),
  q("sip_skid.temp", "Cel", "SIP temperature", "Температура SIP"),
  q("sip_skid.pressure", "kPa", "Steam pressure", "Давление пара"),
  q("sip_skid.f0", "min", "F0", "F0"),
  q("sip_skid.hold.min", "min", "Hold time", "Время выдержки"),
  logical("sip_skid.pass", "SIP pass", "SIP пройден"),
  enu("sip_skid.state", ["heat", "hold", "cool", "idle", "fault"], "SIP state", "Состояние SIP"),
]);

write("layer-b-weigh_booth.json", [
  id("weigh_booth.id", "Weighing booth id", "ID кабины отвешивания"),
  id("weigh_booth.batch.id", "Batch id", "ID партии"),
  q("weigh_booth.weight", "g", "Dispensed weight", "Отвешенная масса"),
  q("weigh_booth.target", "g", "Target weight", "Целевая масса"),
  q("weigh_booth.airflow", "m/s", "Face velocity", "Скорость потока"),
  q("weigh_booth.pressure", "Pa", "Booth pressure", "Давление кабины"),
  logical("weigh_booth.verified", "Second person verified", "Проверено вторым лицом"),
  enu("weigh_booth.state", ["weigh", "idle", "clean", "fault"], "Booth state", "Состояние кабины"),
]);

write("layer-b-dispensary.json", [
  id("dispensary.id", "Dispensary area id", "ID зоны диспенсации"),
  q("dispensary.orders", "-", "Open orders", "Открытых заказов", { encodings: ["i32"] }),
  q("dispensary.accuracy", "%", "Weigh accuracy", "Точность отвешивания", { range: { min: 0, max: 100 } }),
  q("dispensary.temp", "Cel", "Area temperature", "Температура зоны"),
  q("dispensary.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("dispensary.completed", "-", "Orders completed today", "Заказов за сутки", { encodings: ["i32"] }),
  logical("dispensary.quarantine", "Material quarantine", "Карантин материала"),
  enu("dispensary.state", ["open", "busy", "clean", "closed"], "Area state", "Состояние зоны"),
]);

write("layer-b-granulation_ph.json", [
  id("granulation_ph.id", "Pharma granulator id", "ID фармацевтического гранулятора"),
  id("granulation_ph.batch.id", "Batch id", "ID партии"),
  q("granulation_ph.power", "kW", "Impeller power", "Мощность импеллера"),
  q("granulation_ph.temp", "Cel", "Product temperature", "Температура продукта"),
  q("granulation_ph.moisture", "%", "Granule moisture", "Влажность гранул", { range: { min: 0, max: 100 } }),
  q("granulation_ph.liquid", "kg", "Binder added", "Добавлено связующего"),
  logical("granulation_ph.endpoint", "Endpoint reached", "Достигнута конечная точка"),
  enu("granulation_ph.process", ["wet", "dry", "melt", "other"], "Process", "Процесс"),
]);

write("layer-b-tablet_coat_ph.json", [
  id("tablet_coat_ph.pan.id", "Tablet coating pan id", "ID дражировочного котла"),
  id("tablet_coat_ph.batch.id", "Batch id", "ID партии"),
  q("tablet_coat_ph.temp", "Cel", "Exhaust temperature", "Температура вытяжки"),
  q("tablet_coat_ph.spray", "g/min", "Spray rate", "Скорость распыла"),
  q("tablet_coat_ph.weight.gain", "%", "Weight gain", "Привес", { range: { min: 0, max: 100 } }),
  q("tablet_coat_ph.pan.rpm", "rpm", "Pan speed", "Обороты котла"),
  logical("tablet_coat_ph.done", "Coating complete", "Покрытие завершено"),
  enu("tablet_coat_ph.state", ["preheat", "spray", "dry", "idle", "fault"], "Pan state", "Состояние котла"),
]);

write("layer-b-blister_ph.json", [
  id("blister_ph.line.id", "Pharma blister line id", "ID блистерной линии"),
  id("blister_ph.batch.id", "Batch id", "ID партии"),
  q("blister_ph.speed", "/h", "Blisters per hour", "Блистеров в час"),
  q("blister_ph.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("blister_ph.seal", "Cel", "Seal temperature", "Температура сварки"),
  q("blister_ph.forming", "Cel", "Forming temperature", "Температура формования"),
  logical("blister_ph.leak", "Leak test fail", "Провал теста на герметичность"),
  enu("blister_ph.state", ["form", "fill", "seal", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-cartoner_ph.json", [
  id("cartoner_ph.id", "Pharma cartoner id", "ID картонажной машины"),
  id("cartoner_ph.batch.id", "Batch id", "ID партии"),
  q("cartoner_ph.speed", "/h", "Cartons per hour", "Пачек в час"),
  q("cartoner_ph.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("cartoner_ph.leaflet", "%", "Leaflet insert success", "Вложение инструкции", { range: { min: 0, max: 100 } }),
  q("cartoner_ph.uptime", "%", "Uptime", "Готовность", { range: { min: 0, max: 100 } }),
  logical("cartoner_ph.jam", "Jam", "Затор"),
  enu("cartoner_ph.state", ["erect", "load", "close", "idle", "fault"], "Cartoner state", "Состояние картонажной"),
]);

write("layer-b-serial_pack_ph.json", [
  id("serial_pack_ph.line.id", "Serialization packing line id", "ID линии сериализации"),
  id("serial_pack_ph.batch.id", "Batch id", "ID партии"),
  q("serial_pack_ph.coded", "/h", "Units coded per hour", "Единиц с кодом в час"),
  q("serial_pack_ph.verify", "%", "Verify success", "Успешность верификации", { range: { min: 0, max: 100 } }),
  q("serial_pack_ph.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("serial_pack_ph.agg", "-", "Aggregation events", "Событий агрегации", { encodings: ["i32"] }),
  logical("serial_pack_ph.online", "Track & trace online", "Прослеживаемость онлайн"),
  enu("serial_pack_ph.state", ["code", "verify", "aggregate", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-warehouse_gdp.json", [
  id("warehouse_gdp.id", "GDP warehouse id", "ID склада GDP"),
  q("warehouse_gdp.temp", "Cel", "Zone temperature", "Температура зоны"),
  q("warehouse_gdp.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("warehouse_gdp.occupancy", "%", "Location occupancy", "Занятость ячеек", { range: { min: 0, max: 100 } }),
  q("warehouse_gdp.excursions", "-", "Temp excursions today", "Выходов температуры за сутки", { encodings: ["i32"] }),
  q("warehouse_gdp.picks", "-", "Picks today", "Отборов за сутки", { encodings: ["i32"] }),
  logical("warehouse_gdp.quarantine", "Quarantine zone active", "Зона карантина активна"),
  enu("warehouse_gdp.state", ["ok", "excursion", "maintain", "offline"], "Warehouse state", "Состояние склада"),
]);

write("layer-b-cold_chain_ph.json", [
  id("cold_chain_ph.logger.id", "Cold-chain logger id", "ID логгера холодовой цепи"),
  id("cold_chain_ph.shipment.id", "Shipment id", "ID отгрузки"),
  q("cold_chain_ph.temp", "Cel", "Logged temperature", "Записанная температура"),
  q("cold_chain_ph.min", "Cel", "Min temperature", "Мин. температура"),
  q("cold_chain_ph.max", "Cel", "Max temperature", "Макс. температура"),
  q("cold_chain_ph.duration.h", "h", "Transit duration", "Длительность перевозки"),
  logical("cold_chain_ph.excursion", "Temperature excursion", "Выход температуры"),
  enu("cold_chain_ph.range", ["crt", "cold", "frozen", "ultra", "other"], "Range", "Диапазон"),
]);

write("layer-b-stability_ch.json", [
  id("stability_ch.id", "Stability chamber id", "ID климатической камеры стабильности"),
  id("stability_ch.study.id", "Study id", "ID исследования"),
  q("stability_ch.temp", "Cel", "Set temperature", "Уставка температуры"),
  q("stability_ch.humidity", "%", "Set humidity", "Уставка влажности", { range: { min: 0, max: 100 } }),
  q("stability_ch.dev.temp", "K", "Temperature deviation", "Отклонение температуры"),
  q("stability_ch.dev.rh", "%", "RH deviation", "Отклонение RH", { range: { min: 0, max: 100 } }),
  logical("stability_ch.alarm", "Chamber alarm", "Тревога камеры"),
  enu("stability_ch.condition", ["long", "accel", "intermed", "photo", "other"], "Condition", "Условие"),
]);

write("layer-b-dissolution_lab.json", [
  id("dissolution_lab.bath.id", "Dissolution bath id", "ID бани растворения"),
  id("dissolution_lab.sample.id", "Sample id", "ID образца"),
  q("dissolution_lab.temp", "Cel", "Medium temperature", "Температура среды"),
  q("dissolution_lab.rpm", "rpm", "Paddle / basket speed", "Обороты мешалки/корзинки"),
  q("dissolution_lab.release", "%", "Percent released", "Процент высвобождения", { range: { min: 0, max: 100 } }),
  q("dissolution_lab.time.min", "min", "Sample time", "Время отбора"),
  logical("dissolution_lab.pass", "Spec pass", "Спецификация пройдена"),
  enu("dissolution_lab.apparatus", ["paddle", "basket", "flow", "other"], "Apparatus", "Аппарат"),
]);

write("layer-b-hplc_lab.json", [
  id("hplc_lab.system.id", "HPLC system id", "ID системы ВЭЖХ"),
  id("hplc_lab.run.id", "Sequence / run id", "ID последовательности"),
  q("hplc_lab.pressure", "kPa", "System pressure", "Давление системы"),
  q("hplc_lab.flow", "mL/min", "Flow rate", "Расход"),
  q("hplc_lab.rt.min", "min", "Retention time", "Время удерживания"),
  q("hplc_lab.area", "-", "Peak area", "Площадь пика"),
  logical("hplc_lab.sst.ok", "SST OK", "SST OK"),
  enu("hplc_lab.state", ["run", "equilibrate", "idle", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-micro_lab_ph.json", [
  id("micro_lab_ph.id", "Pharma microbiology lab id", "ID микробиологической лаборатории"),
  q("micro_lab_ph.samples", "-", "Samples in process", "Проб в работе", { encodings: ["i32"] }),
  q("micro_lab_ph.positive", "-", "Positives today", "Положительных за сутки", { encodings: ["i32"] }),
  q("micro_lab_ph.incubators", "-", "Incubators OK", "Инкубаторов OK", { encodings: ["i32"] }),
  q("micro_lab_ph.tat.d", "d", "Average TAT", "Средний TAT"),
  q("micro_lab_ph.env", "-", "EM plates incubating", "Чашек мониторинга", { encodings: ["i32"] }),
  logical("micro_lab_ph.oos", "OOS active", "OOS активен"),
  enu("micro_lab_ph.state", ["open", "busy", "clean", "closed"], "Lab state", "Состояние лаборатории"),
]);

write("layer-b-endotoxin.json", [
  id("endotoxin.assay.id", "Endotoxin assay id", "ID анализа эндотоксинов"),
  id("endotoxin.sample.id", "Sample id", "ID образца"),
  q("endotoxin.result", "EU/mL", "Endotoxin result", "Результат эндотоксинов"),
  q("endotoxin.limit", "EU/mL", "Specification limit", "Предел спецификации"),
  q("endotoxin.recovery", "%", "Spike recovery", "Извлечение spike", { range: { min: 0, max: 100 } }),
  q("endotoxin.time.min", "min", "Assay time", "Время анализа"),
  logical("endotoxin.pass", "Pass", "Пройден"),
  enu("endotoxin.method", ["lalma", "lalkinetic", "recom", "other"], "Method", "Метод"),
]);

write("layer-b-particulate_lab.json", [
  id("particulate_lab.id", "Particulate matter lab id", "ID лаборатории механических включений"),
  id("particulate_lab.sample.id", "Sample id", "ID образца"),
  q("particulate_lab.p10", "-", "≥10 µm count", "Частиц ≥10 мкм", { encodings: ["i32"] }),
  q("particulate_lab.p25", "-", "≥25 µm count", "Частиц ≥25 мкм", { encodings: ["i32"] }),
  q("particulate_lab.volume", "mL", "Sample volume", "Объём пробы"),
  q("particulate_lab.time.min", "min", "Test time", "Время теста"),
  logical("particulate_lab.pass", "USP / PhEur pass", "USP / PhEur пройден"),
  enu("particulate_lab.method", ["light_obsc", "microscopic", "other"], "Method", "Метод"),
]);

write("layer-b-water_system_ph.json", [
  id("water_system_ph.id", "Pharma water system id", "ID системы фармацевтической воды"),
  q("water_system_ph.conductivity", "uS/cm", "Loop conductivity", "Проводимость контура"),
  q("water_system_ph.toc", "ug/L", "TOC", "ТОС"),
  q("water_system_ph.temp", "Cel", "Loop temperature", "Температура контура"),
  q("water_system_ph.flow", "L/h", "Loop flow", "Расход контура"),
  q("water_system_ph.ozone", "ppm", "Ozone residual", "Остаточный озон"),
  logical("water_system_ph.sanitize", "Sanitization running", "Санитизация идёт"),
  enu("water_system_ph.grade", ["pw", "wfi", "hpw", "other"], "Grade", "Класс"),
]);

write("layer-b-nitrogen_ph.json", [
  id("nitrogen_ph.system.id", "Pharma nitrogen system id", "ID системы азота фарма"),
  q("nitrogen_ph.pressure", "kPa", "Supply pressure", "Давление подачи"),
  q("nitrogen_ph.purity", "%", "Purity", "Чистота", { range: { min: 0, max: 100 } }),
  q("nitrogen_ph.dew", "Cel", "Dew point", "Точка росы"),
  q("nitrogen_ph.flow", "Nm3/h", "Flow", "Расход"),
  q("nitrogen_ph.o2", "ppm", "O2 impurity", "Примесь O2"),
  logical("nitrogen_ph.alarm", "Quality alarm", "Тревога качества"),
  enu("nitrogen_ph.state", ["supply", "idle", "maintain", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-vacuum_ph.json", [
  id("vacuum_ph.system.id", "Pharma vacuum system id", "ID вакуумной системы фарма"),
  q("vacuum_ph.level", "Pa", "System vacuum", "Вакуум системы"),
  q("vacuum_ph.pumps", "-", "Pumps running", "Насосов в работе", { encodings: ["i32"] }),
  q("vacuum_ph.power", "kW", "System power", "Мощность системы"),
  q("vacuum_ph.users", "-", "Users online", "Потребителей онлайн", { encodings: ["i32"] }),
  q("vacuum_ph.temp", "Cel", "Pump temperature", "Температура насоса"),
  logical("vacuum_ph.low", "Vacuum low", "Низкий вакуум"),
  enu("vacuum_ph.state", ["run", "standby", "maintain", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-compressed_air_ph.json", [
  id("compressed_air_ph.system.id", "Pharma compressed air id", "ID сжатого воздуха фарма"),
  q("compressed_air_ph.pressure", "kPa", "Supply pressure", "Давление подачи"),
  q("compressed_air_ph.dew", "Cel", "Dew point", "Точка росы"),
  q("compressed_air_ph.oil", "mg/m3", "Oil residual", "Остаток масла"),
  q("compressed_air_ph.particles", "/m3", "Particle count", "Число частиц"),
  q("compressed_air_ph.flow", "Nm3/h", "Flow", "Расход"),
  logical("compressed_air_ph.spec.ok", "Spec OK", "Спецификация OK"),
  enu("compressed_air_ph.class", ["iso1", "iso2", "iso3", "other"], "ISO class", "Класс ISO"),
]);

write("layer-b-waste_pharma.json", [
  id("waste_pharma.stream.id", "Pharma waste stream id", "ID потока фармотходов"),
  q("waste_pharma.volume", "L/d", "Daily volume", "Суточный объём"),
  q("waste_pharma.cod", "mg/L", "COD", "ХПК"),
  q("waste_pharma.ph", "-", "pH", "pH"),
  q("waste_pharma.solvent", "%", "Solvent fraction", "Доля растворителя", { range: { min: 0, max: 100 } }),
  q("waste_pharma.drums", "-", "Drums staged", "Бочек на площадке", { encodings: ["i32"] }),
  logical("waste_pharma.hazard", "Hazardous flag", "Опасный отход"),
  enu("waste_pharma.type", ["aqueous", "solvent", "solid", "bio", "other"], "Type", "Тип"),
]);

write("layer-b-solvent_rec_ph.json", [
  id("solvent_rec_ph.id", "Pharma solvent recovery id", "ID рекуперации растворителя фарма"),
  q("solvent_rec_ph.feed", "L/h", "Feed rate", "Подача"),
  q("solvent_rec_ph.recovery", "%", "Recovery", "Выход", { range: { min: 0, max: 100 } }),
  q("solvent_rec_ph.purity", "%", "Product purity", "Чистота продукта", { range: { min: 0, max: 100 } }),
  q("solvent_rec_ph.temp", "Cel", "Still temperature", "Температура куба"),
  q("solvent_rec_ph.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("solvent_rec_ph.spec.ok", "Spec OK", "Спецификация OK"),
  enu("solvent_rec_ph.state", ["distill", "idle", "clean", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-api_dryer.json", [
  id("api_dryer.id", "API dryer id", "ID сушилки АФИ"),
  id("api_dryer.batch.id", "Batch id", "ID партии"),
  q("api_dryer.temp", "Cel", "Product temperature", "Температура продукта"),
  q("api_dryer.moisture", "%", "LOD / moisture", "Влажность / ППП", { range: { min: 0, max: 100 } }),
  q("api_dryer.vacuum", "Pa", "Chamber vacuum", "Вакуум камеры"),
  q("api_dryer.time.h", "h", "Drying time", "Время сушки"),
  logical("api_dryer.endpoint", "Endpoint reached", "Достигнута конечная точка"),
  enu("api_dryer.type", ["tray", "agitated", "filter", "other"], "Type", "Тип"),
]);

write("layer-b-micronizer.json", [
  id("micronizer.id", "Micronizer / jet mill id", "ID микронизатора / струйной мельницы"),
  id("micronizer.batch.id", "Batch id", "ID партии"),
  q("micronizer.d90", "um", "D90 particle size", "D90 размера частиц"),
  q("micronizer.pressure", "kPa", "Grind pressure", "Давление измельчения"),
  q("micronizer.feed", "kg/h", "Feed rate", "Подача"),
  q("micronizer.yield", "%", "Yield", "Выход", { range: { min: 0, max: 100 } }),
  logical("micronizer.in_spec", "PSD in spec", "РЧР в норме"),
  enu("micronizer.state", ["grind", "idle", "clean", "fault"], "Mill state", "Состояние мельницы"),
]);

write("layer-b-milling_api.json", [
  id("milling_api.id", "API milling unit id", "ID установки измельчения АФИ"),
  id("milling_api.batch.id", "Batch id", "ID партии"),
  q("milling_api.speed", "rpm", "Mill speed", "Обороты мельницы"),
  q("milling_api.d50", "um", "D50", "D50"),
  q("milling_api.temp", "Cel", "Product temperature", "Температура продукта"),
  q("milling_api.throughput", "kg/h", "Throughput", "Производительность"),
  logical("milling_api.screen.ok", "Screen OK", "Сито OK"),
  enu("milling_api.type", ["hammer", "pin", "cone", "other"], "Type", "Тип"),
]);

write("layer-b-crystallizer_ph.json", [
  id("crystallizer_ph.id", "Pharma crystallizer id", "ID фармацевтического кристаллизатора"),
  id("crystallizer_ph.batch.id", "Batch id", "ID партии"),
  q("crystallizer_ph.temp", "Cel", "Batch temperature", "Температура партии"),
  q("crystallizer_ph.cool.rate", "K/min", "Cooling rate", "Скорость охлаждения"),
  q("crystallizer_ph.supersat", "-", "Supersaturation proxy", "Пересыщение"),
  q("crystallizer_ph.agitation", "rpm", "Agitation", "Перемешивание"),
  logical("crystallizer_ph.seeded", "Seeded", "Затравлено"),
  enu("crystallizer_ph.state", ["dissolve", "cool", "age", "filter", "fault"], "Crystallizer state", "Состояние кристаллизатора"),
]);

write("layer-b-filter_dryer.json", [
  id("filter_dryer.id", "Filter-dryer id", "ID фильтр-сушилки"),
  id("filter_dryer.batch.id", "Batch id", "ID партии"),
  q("filter_dryer.pressure", "kPa", "Filter pressure", "Давление фильтрации"),
  q("filter_dryer.cake", "%", "Cake solids", "Сухое вещество кека", { range: { min: 0, max: 100 } }),
  q("filter_dryer.temp", "Cel", "Jacket temperature", "Температура рубашки"),
  q("filter_dryer.vacuum", "Pa", "Drying vacuum", "Вакуум сушки"),
  logical("filter_dryer.dry.done", "Drying done", "Сушка завершена"),
  enu("filter_dryer.state", ["filter", "wash", "dry", "discharge", "fault"], "Unit state", "Состояние аппарата"),
]);

write("layer-b-nutsche.json", [
  id("nutsche.id", "Nutsche filter id", "ID фильтра Нучча"),
  id("nutsche.batch.id", "Batch id", "ID партии"),
  q("nutsche.pressure", "kPa", "Filter pressure", "Давление фильтрации"),
  q("nutsche.cake", "mm", "Cake height", "Высота кека"),
  q("nutsche.wash", "L", "Wash volume", "Объём промывки"),
  q("nutsche.temp", "Cel", "Jacket temperature", "Температура рубашки"),
  logical("nutsche.discharge", "Ready to discharge", "Готово к выгрузке"),
  enu("nutsche.state", ["filter", "wash", "dry", "idle", "fault"], "Filter state", "Состояние фильтра"),
]);

write("layer-b-centrifuge_ph.json", [
  id("centrifuge_ph.id", "Pharma centrifuge id", "ID фармацевтической центрифуги"),
  id("centrifuge_ph.batch.id", "Batch id", "ID партии"),
  q("centrifuge_ph.rpm", "rpm", "Bowl speed", "Обороты барабана"),
  q("centrifuge_ph.g", "-", "Relative centrifugal force", "Относительная центробежная сила"),
  q("centrifuge_ph.cake", "%", "Cake solids", "Сухое вещество кека", { range: { min: 0, max: 100 } }),
  q("centrifuge_ph.temp", "Cel", "Product temperature", "Температура продукта"),
  logical("centrifuge_ph.imbalance", "Imbalance", "Дисбаланс"),
  enu("centrifuge_ph.state", ["feed", "spin", "wash", "unload", "fault"], "Centrifuge state", "Состояние центрифуги"),
]);

write("layer-b-tray_dryer.json", [
  id("tray_dryer.id", "Tray dryer id", "ID полочной сушилки"),
  id("tray_dryer.batch.id", "Batch id", "ID партии"),
  q("tray_dryer.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("tray_dryer.humidity", "%", "Chamber humidity", "Влажность камеры", { range: { min: 0, max: 100 } }),
  q("tray_dryer.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("tray_dryer.time.h", "h", "Drying time", "Время сушки"),
  logical("tray_dryer.done", "Drying complete", "Сушка завершена"),
  enu("tray_dryer.state", ["load", "dry", "cool", "idle", "fault"], "Dryer state", "Состояние сушилки"),
]);

write("layer-b-fluid_bed_ph.json", [
  id("fluid_bed_ph.id", "Fluid-bed processor id", "ID аппарата псевдоожиженного слоя"),
  id("fluid_bed_ph.batch.id", "Batch id", "ID партии"),
  q("fluid_bed_ph.inlet", "Cel", "Inlet air temperature", "Температура воздуха на входе"),
  q("fluid_bed_ph.product", "Cel", "Product temperature", "Температура продукта"),
  q("fluid_bed_ph.air", "m3/h", "Process air", "Технологический воздух"),
  q("fluid_bed_ph.spray", "g/min", "Spray rate", "Скорость распыла"),
  logical("fluid_bed_ph.endpoint", "Endpoint reached", "Достигнута конечная точка"),
  enu("fluid_bed_ph.process", ["dry", "granulate", "coat", "other"], "Process", "Процесс"),
]);

write("layer-b-mixer_gran.json", [
  id("mixer_gran.id", "High-shear mixer granulator id", "ID высокоскоростного смесителя-гранулятора"),
  id("mixer_gran.batch.id", "Batch id", "ID партии"),
  q("mixer_gran.impeller", "rpm", "Impeller speed", "Обороты импеллера"),
  q("mixer_gran.chopper", "rpm", "Chopper speed", "Обороты чоппера"),
  q("mixer_gran.power", "kW", "Power draw", "Потребляемая мощность"),
  q("mixer_gran.temp", "Cel", "Product temperature", "Температура продукта"),
  logical("mixer_gran.endpoint", "Endpoint", "Конечная точка"),
  enu("mixer_gran.state", ["mix", "granulate", "discharge", "idle", "fault"], "Mixer state", "Состояние смесителя"),
]);

write("layer-b-roller_compact.json", [
  id("roller_compact.id", "Roller compactor id", "ID валкового уплотнения"),
  id("roller_compact.batch.id", "Batch id", "ID партии"),
  q("roller_compact.force", "kN", "Roll force", "Усилие валков"),
  q("roller_compact.gap", "mm", "Roll gap", "Зазор валков"),
  q("roller_compact.speed", "rpm", "Roll speed", "Обороты валков"),
  q("roller_compact.ribbon", "g/cm3", "Ribbon density", "Плотность ленты"),
  logical("roller_compact.in_spec", "Ribbon in spec", "Лента в норме"),
  enu("roller_compact.state", ["compact", "mill", "idle", "fault"], "Compactor state", "Состояние уплотнения"),
]);

write("layer-b-extruder_ph.json", [
  id("extruder_ph.id", "Pharma extruder id", "ID фармацевтического экструдера"),
  id("extruder_ph.batch.id", "Batch id", "ID партии"),
  q("extruder_ph.temp", "Cel", "Barrel temperature", "Температура цилиндра"),
  q("extruder_ph.screw", "rpm", "Screw speed", "Обороты шнека"),
  q("extruder_ph.torque", "%", "Torque", "Момент", { range: { min: 0, max: 100 } }),
  q("extruder_ph.feed", "kg/h", "Feed rate", "Подача"),
  logical("extruder_ph.melt.ok", "Melt OK", "Расплав OK"),
  enu("extruder_ph.process", ["hme", "wet", "melt", "other"], "Process", "Процесс"),
]);

write("layer-b-spheronizer.json", [
  id("spheronizer.id", "Spheronizer id", "ID сферонизатора"),
  id("spheronizer.batch.id", "Batch id", "ID партии"),
  q("spheronizer.speed", "rpm", "Plate speed", "Обороты диска"),
  q("spheronizer.time.min", "min", "Residence time", "Время пребывания"),
  q("spheronizer.yield", "%", "Spherical yield", "Выход сфер", { range: { min: 0, max: 100 } }),
  q("spheronizer.size", "mm", "Pellet size", "Размер пеллет"),
  logical("spheronizer.done", "Spheronization done", "Сферонизация завершена"),
  enu("spheronizer.state", ["load", "sphere", "discharge", "idle", "fault"], "Spheronizer state", "Состояние сферонизатора"),
]);

write("layer-b-capsule_fill.json", [
  id("capsule_fill.machine.id", "Capsule filling machine id", "ID машины наполнения капсул"),
  id("capsule_fill.batch.id", "Batch id", "ID партии"),
  q("capsule_fill.speed", "/h", "Capsules per hour", "Капсул в час"),
  q("capsule_fill.weight", "mg", "Fill weight", "Масса наполнения"),
  q("capsule_fill.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("capsule_fill.rsd", "%", "Weight RSD", "RSD массы", { range: { min: 0, max: 100 } }),
  logical("capsule_fill.in_spec", "Weight in spec", "Масса в норме"),
  enu("capsule_fill.state", ["fill", "close", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-softgel_line.json", [
  id("softgel_line.id", "Softgel encapsulation line id", "ID линии мягких желатиновых капсул"),
  id("softgel_line.batch.id", "Batch id", "ID партии"),
  q("softgel_line.speed", "/h", "Capsules per hour", "Капсул в час"),
  q("softgel_line.fill", "mg", "Fill weight", "Масса наполнения"),
  q("softgel_line.ribbon", "Cel", "Gelatin ribbon temperature", "Температура ленты желатина"),
  q("softgel_line.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("softgel_line.seal.ok", "Seal OK", "Шов OK"),
  enu("softgel_line.state", ["form", "fill", "dry", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-ointment_fill.json", [
  id("ointment_fill.line.id", "Ointment / cream fill line id", "ID линии наполнения мазей/кремов"),
  id("ointment_fill.batch.id", "Batch id", "ID партии"),
  q("ointment_fill.speed", "/h", "Tubes / jars per hour", "Туб/банок в час"),
  q("ointment_fill.weight", "g", "Fill weight", "Масса наполнения"),
  q("ointment_fill.viscosity", "mPa.s", "Product viscosity", "Вязкость продукта"),
  q("ointment_fill.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("ointment_fill.seal.ok", "Seal OK", "Запайка OK"),
  enu("ointment_fill.state", ["fill", "seal", "code", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-inhaler_fill.json", [
  id("inhaler_fill.line.id", "Inhaler filling line id", "ID линии наполнения ингаляторов"),
  id("inhaler_fill.batch.id", "Batch id", "ID партии"),
  q("inhaler_fill.speed", "/h", "Units per hour", "Единиц в час"),
  q("inhaler_fill.dose", "mg", "Dose weight", "Масса дозы"),
  q("inhaler_fill.propellant", "g", "Propellant fill", "Наполнение пропеллента"),
  q("inhaler_fill.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("inhaler_fill.leak.ok", "Leak test OK", "Тест на герметичность OK"),
  enu("inhaler_fill.type", ["mdi", "dpi", "soft_mist", "other"], "Type", "Тип"),
]);

write("layer-b-patch_coat.json", [
  id("patch_coat.line.id", "Transdermal patch coating line id", "ID линии покрытия трансдермальных пластырей"),
  id("patch_coat.batch.id", "Batch id", "ID партии"),
  q("patch_coat.coat", "g/m2", "Coat weight", "Масса покрытия"),
  q("patch_coat.speed", "m/min", "Web speed", "Скорость полотна"),
  q("patch_coat.oven", "Cel", "Oven temperature", "Температура печи"),
  q("patch_coat.uniform", "%", "Coat uniformity", "Равномерность покрытия", { range: { min: 0, max: 100 } }),
  logical("patch_coat.in_spec", "Coat in spec", "Покрытие в норме"),
  enu("patch_coat.state", ["coat", "dry", "laminate", "idle", "fault"], "Line state", "Состояние линии"),
]);

console.log("Layer B28 seeds written");
