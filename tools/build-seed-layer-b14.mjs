#!/usr/bin/env node
/**
 * Layer B14 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B14", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-aluminum_potline.json", [
  id("aluminum_potline.id", "Potline id", "ID серии электролизёров"),
  id("aluminum_potline.pot.id", "Pot id", "ID электролизёра"),
  q("aluminum_potline.current", "A", "Line current", "Сила тока серии"),
  q("aluminum_potline.voltage", "V", "Pot voltage", "Напряжение ванны"),
  q("aluminum_potline.bath.temp", "Cel", "Bath temperature", "Температура электролита"),
  q("aluminum_potline.ce", "%", "Current efficiency", "Выход по току", { range: { min: 0, max: 100 } }),
  logical("aluminum_potline.anode.effect", "Anode effect", "Анодный эффект"),
  enu("aluminum_potline.state", ["heat", "produce", "tap", "anode", "idle", "fault"], "Pot state", "Состояние ванны"),
]);

write("layer-b-copper_smelter.json", [
  id("copper_smelter.furnace.id", "Copper furnace id", "ID печи медного завода"),
  q("copper_smelter.matte.grade", "%", "Matte grade", "Содержание меди в штейне", { range: { min: 0, max: 100 } }),
  q("copper_smelter.slag.temp", "Cel", "Slag temperature", "Температура шлака"),
  q("copper_smelter.so2", "ppm", "SO2 in offgas", "SO2 в отходящих газах"),
  q("copper_smelter.blow.air", "m3/h", "Blow air flow", "Расход дутья"),
  q("copper_smelter.production", "t/d", "Anode copper production", "Выпуск анодной меди"),
  logical("copper_smelter.tap.ready", "Tap ready", "Готовность к выпуску"),
  enu("copper_smelter.process", ["flash", "bath", "convert", "anode", "other"], "Process stage", "Стадия процесса"),
]);

write("layer-b-wire_draw.json", [
  id("wire_draw.line.id", "Wire drawing line id", "ID линии волочения"),
  id("wire_draw.die.id", "Drawing die id", "ID фильеры"),
  q("wire_draw.speed", "m/min", "Drawing speed", "Скорость волочения"),
  q("wire_draw.reduction", "%", "Area reduction", "Обжатие", { range: { min: 0, max: 100 } }),
  q("wire_draw.diameter", "mm", "Wire diameter", "Диаметр проволоки"),
  q("wire_draw.tension", "N", "Capstan tension", "Натяжение"),
  logical("wire_draw.break", "Wire break", "Обрыв проволоки"),
  enu("wire_draw.metal", ["cu", "al", "steel", "ss", "other"], "Metal", "Металл"),
]);

write("layer-b-die_cast.json", [
  id("die_cast.machine.id", "Die-cast machine id", "ID машины литья под давлением"),
  id("die_cast.die.id", "Die-cast die id", "ID пресс-формы ЛПД"),
  q("die_cast.shot.force", "kN", "Locking force", "Усилие запирания"),
  q("die_cast.metal.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("die_cast.cycle.s", "s", "Cycle time", "Время цикла"),
  q("die_cast.shot.velocity", "m/s", "Shot velocity", "Скорость запрессовки"),
  logical("die_cast.flash", "Flash detected", "Облой"),
  enu("die_cast.alloy", ["alz", "mg", "zn", "cu", "other"], "Alloy family", "Семейство сплава"),
]);

write("layer-b-powder_metal.json", [
  id("powder_metal.press.id", "PM press id", "ID пресса порошковой металлургии"),
  id("powder_metal.batch.id", "PM batch id", "ID партии порошка"),
  q("powder_metal.compact.density", "g/cm3", "Green density", "Плотность прессовки"),
  q("powder_metal.sinter.temp", "Cel", "Sinter temperature", "Температура спекания"),
  q("powder_metal.sinter.time", "min", "Sinter hold time", "Выдержка спекания"),
  q("powder_metal.shrink", "%", "Sinter shrink", "Усадка", { range: { min: 0, max: 100 } }),
  logical("powder_metal.crack", "Green crack", "Трещина прессовки"),
  enu("powder_metal.process", ["press", "sinter", "size", "impregnate", "other"], "PM process", "Процесс ПМ"),
]);

write("layer-b-lime_kiln.json", [
  id("lime_kiln.id", "Lime kiln id", "ID известковой печи"),
  q("lime_kiln.temp", "Cel", "Burning zone temperature", "Температура зоны обжига"),
  q("lime_kiln.feed", "t/h", "Stone feed", "Подача камня"),
  q("lime_kiln.cao", "%", "Available CaO", "Активный CaO", { range: { min: 0, max: 100 } }),
  q("lime_kiln.fuel", "m3/h", "Fuel gas flow", "Расход топлива"),
  q("lime_kiln.co2", "%", "Kiln CO2", "CO2 печи", { range: { min: 0, max: 100 } }),
  logical("lime_kiln.ring", "Ringing", "Кольцеобразование"),
  enu("lime_kiln.type", ["rotary", "shaft", "pfr", "other"], "Kiln type", "Тип печи"),
]);

write("layer-b-brick_kiln.json", [
  id("brick_kiln.id", "Brick kiln id", "ID кирпичной печи"),
  q("brick_kiln.fire.temp", "Cel", "Firing temperature", "Температура обжига"),
  q("brick_kiln.car.speed", "m/h", "Kiln car speed", "Скорость вагонеток"),
  q("brick_kiln.moisture", "%", "Green moisture", "Влажность сырца", { range: { min: 0, max: 100 } }),
  q("brick_kiln.cycle.h", "h", "Firing cycle", "Цикл обжига"),
  q("brick_kiln.rejects", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("brick_kiln.overfire", "Overfire", "Пережог"),
  enu("brick_kiln.state", ["dry", "preheat", "fire", "cool", "idle", "fault"], "Kiln state", "Состояние печи"),
]);

write("layer-b-gypsum_board.json", [
  id("gypsum_board.line.id", "Gypsum board line id", "ID линии ГКЛ"),
  id("gypsum_board.sku.id", "Board SKU id", "ID сортамента ГКЛ"),
  q("gypsum_board.speed", "m/min", "Line speed", "Скорость линии ГКЛ"),
  q("gypsum_board.thickness", "mm", "Board thickness", "Толщина листа"),
  q("gypsum_board.stucco.rate", "t/h", "Stucco feed", "Подача строительного гипса"),
  q("gypsum_board.dryer.temp", "Cel", "Dryer temperature", "Температура сушилки"),
  logical("gypsum_board.break", "Board break", "Обрыв полотна"),
  enu("gypsum_board.product", ["regular", "mr", "fire", "acoustic", "other"], "Product type", "Тип плиты"),
]);

write("layer-b-paint_mfg.json", [
  id("paint_mfg.reactor.id", "Paint reactor id", "ID реактора ЛКМ"),
  id("paint_mfg.batch.id", "Paint batch id", "ID партии краски"),
  q("paint_mfg.viscosity", "mPa.s", "Viscosity", "Вязкость"),
  q("paint_mfg.grind", "um", "Grind fineness", "Тонкость перетира"),
  q("paint_mfg.pigment", "%", "Pigment volume", "Объём пигмента", { range: { min: 0, max: 100 } }),
  q("paint_mfg.mix.power", "W", "Mixer power", "Мощность мешалки"),
  logical("paint_mfg.in_spec", "In specification", "В спецификации"),
  enu("paint_mfg.base", ["solvent", "water", "powder", "uv", "other"], "Base type", "Тип основы"),
]);

write("layer-b-adhesive_mfg.json", [
  id("adhesive_mfg.kettle.id", "Adhesive kettle id", "ID котла клея"),
  id("adhesive_mfg.batch.id", "Adhesive batch id", "ID партии клея"),
  q("adhesive_mfg.solids", "%", "Solids content", "Сухой остаток", { range: { min: 0, max: 100 } }),
  q("adhesive_mfg.kettle.temp", "Cel", "Kettle temperature", "Температура котла"),
  q("adhesive_mfg.viscosity", "mPa.s", "Adhesive viscosity", "Вязкость клея"),
  q("adhesive_mfg.pot.life", "min", "Pot life", "Жизнеспособность"),
  logical("adhesive_mfg.gelled", "Gelled", "Зажелатинился"),
  enu("adhesive_mfg.chem", ["pva", "pu", "epoxy", "hotmelt", "silicone", "other"], "Chemistry", "Химия"),
]);

write("layer-b-lithium_brine.json", [
  id("lithium_brine.pond.id", "Brine pond id", "ID пруда рассола"),
  id("lithium_brine.well.id", "Brine well id", "ID скважины рассола"),
  q("lithium_brine.li", "mg/L", "Lithium concentration", "Концентрация лития"),
  q("lithium_brine.evap.rate", "mm/d", "Evaporation rate", "Скорость испарения"),
  q("lithium_brine.level", "m", "Pond level", "Уровень пруда"),
  q("lithium_brine.sg", "-", "Specific gravity", "Удельный вес"),
  logical("lithium_brine.harvest", "Harvest ready", "Готов к съёму"),
  enu("lithium_brine.stage", ["pump", "evap", "harvest", "plant", "idle"], "Stage", "Стадия"),
]);

write("layer-b-gold_mill.json", [
  id("gold_mill.circuit.id", "Gold mill circuit id", "ID цепи золотоизвлечения"),
  q("gold_mill.feed.grade", "g/t", "Feed grade", "Содержание в питании"),
  q("gold_mill.recovery", "%", "Recovery", "Извлечение", { range: { min: 0, max: 100 } }),
  q("gold_mill.cn", "mg/L", "Free cyanide", "Свободный цианид"),
  q("gold_mill.ph", "-", "Leach pH", "pH выщелачивания"),
  q("gold_mill.throughput", "t/h", "Mill throughput", "Производительность мельницы"),
  logical("gold_mill.carbon.loaded", "Carbon loaded", "Уголь загружен"),
  enu("gold_mill.process", ["cil", "cip", "heap", "flotation", "gravity", "other"], "Process", "Процесс"),
]);

write("layer-b-coal_prep.json", [
  id("coal_prep.plant.id", "Coal prep plant id", "ID углеобогатительной фабрики"),
  q("coal_prep.ash", "%", "Product ash", "Зольность продукта", { range: { min: 0, max: 100 } }),
  q("coal_prep.moisture", "%", "Product moisture", "Влага продукта", { range: { min: 0, max: 100 } }),
  q("coal_prep.yield", "%", "Mass yield", "Выход", { range: { min: 0, max: 100 } }),
  q("coal_prep.media.sg", "-", "Dense-media SG", "Плотность суспензии"),
  q("coal_prep.feed", "t/h", "Raw feed", "Сырое питание"),
  logical("coal_prep.media.ok", "Media in spec", "Суспензия в норме"),
  enu("coal_prep.state", ["run", "wash", "idle", "maintain", "fault"], "Plant state", "Состояние фабрики"),
]);

write("layer-b-potash_mill.json", [
  id("potash_mill.id", "Potash mill id", "ID калийного комбината"),
  q("potash_mill.k2o", "%", "K2O grade", "Содержание K2O", { range: { min: 0, max: 100 } }),
  q("potash_mill.flotation.recovery", "%", "Flotation recovery", "Извлечение флотацией", { range: { min: 0, max: 100 } }),
  q("potash_mill.dryer.temp", "Cel", "Product dryer temperature", "Температура сушилки"),
  q("potash_mill.compaction", "t/h", "Compaction rate", "Производительность компактирования"),
  q("potash_mill.dust", "ug/m3", "Mill dust", "Пыль комбината"),
  logical("potash_mill.cake.wet", "Filter cake wet", "Кека влажная"),
  enu("potash_mill.process", ["float", "crystal", "compact", "pack", "other"], "Process", "Процесс"),
]);

write("layer-b-spaceport.json", [
  id("spaceport.id", "Spaceport id", "ID космодрома"),
  id("spaceport.pad.id", "Launch pad id", "ID стартовой площадки"),
  q("spaceport.wind", "m/s", "Pad wind", "Ветер на площадке"),
  q("spaceport.lightning.distance", "km", "Lightning distance", "Дальность молнии"),
  q("spaceport.hold.s", "s", "Hold remaining", "Остаток холда"),
  logical("spaceport.go", "Range go", "Разрешение полигона"),
  logical("spaceport.scram", "Scrub", "Отмена пуска"),
  enu("spaceport.phase", ["idle", "stack", "fuel", "count", "hold", "launch", "secure"], "Ops phase", "Фаза операций"),
]);

write("layer-b-rocket_stand.json", [
  id("rocket_stand.id", "Rocket test stand id", "ID огневого стенда"),
  id("rocket_stand.run.id", "Hotfire run id", "ID огневого испытания"),
  q("rocket_stand.thrust", "N", "Measured thrust", "Измеренная тяга"),
  q("rocket_stand.chamber.p", "Pa", "Chamber pressure", "Давление в камере"),
  q("rocket_stand.mix.ratio", "-", "Mixture ratio", "Соотношение компонентов"),
  q("rocket_stand.duration.s", "s", "Burn duration", "Длительность горения"),
  logical("rocket_stand.abort", "Abort", "Аварийный останов"),
  enu("rocket_stand.state", ["safe", "chill", "ignite", "steady", "cutoff", "fault"], "Stand state", "Состояние стенда"),
]);

write("layer-b-subsea_cable.json", [
  id("subsea_cable.system.id", "Cable system id", "ID кабельной системы"),
  id("subsea_cable.span.id", "Cable span id", "ID участка кабеля"),
  q("subsea_cable.otdr.loss", "dB", "OTDR span loss", "Потери OTDR"),
  q("subsea_cable.current", "A", "Power feed current", "Ток питания"),
  q("subsea_cable.depth", "m", "Lay depth", "Глубина укладки"),
  q("subsea_cable.tension", "kN", "Lay tension", "Натяжение при укладке"),
  logical("subsea_cable.fault", "Cable fault", "Повреждение кабеля"),
  enu("subsea_cable.state", ["lay", "in_service", "repair", "idle", "fault"], "Cable state", "Состояние кабеля"),
]);

write("layer-b-tide_gauge.json", [
  id("tide_gauge.id", "Tide gauge id", "ID мареографа"),
  q("tide_gauge.level", "m", "Sea level", "Уровень моря"),
  q("tide_gauge.predicted", "m", "Predicted tide", "Прогноз прилива"),
  q("tide_gauge.residual", "m", "Residual", "Остаток"),
  q("tide_gauge.atm", "hPa", "Atmospheric pressure", "Атмосферное давление"),
  q("tide_gauge.temp", "Cel", "Water temperature", "Температура воды"),
  logical("tide_gauge.flood.warn", "Flood warning", "Предупреждение о нагоне"),
  enu("tide_gauge.quality", ["good", "suspect", "gap", "offline"], "Data quality", "Качество данных"),
]);

write("layer-b-river_gauge.json", [
  id("river_gauge.id", "River gauge id", "ID гидропоста"),
  q("river_gauge.stage", "m", "River stage", "Уровень реки"),
  q("river_gauge.discharge", "m3/s", "Discharge", "Расход"),
  q("river_gauge.velocity", "m/s", "Mean velocity", "Средняя скорость"),
  q("river_gauge.turbidity", "NTU", "Turbidity", "Мутность"),
  q("river_gauge.temp", "Cel", "Water temperature", "Температура воды"),
  logical("river_gauge.flood", "Flood stage", "Паводковый уровень"),
  enu("river_gauge.ice", ["open", "frazil", "cover", "breakup", "unknown"], "Ice condition", "Ледовая обстановка"),
]);

write("layer-b-snow_pillow.json", [
  id("snow_pillow.id", "Snow pillow id", "ID снеговой подушки"),
  q("snow_pillow.swe", "mmwe", "Snow water equivalent", "Запас воды в снеге"),
  q("snow_pillow.depth", "mm", "Snow depth", "Высота снега"),
  q("snow_pillow.density", "g/cm3", "Snow density", "Плотность снега"),
  q("snow_pillow.temp", "Cel", "Pillow temperature", "Температура подушки"),
  q("snow_pillow.precip", "mm", "Incremental precip", "Прирост осадков"),
  logical("snow_pillow.melt", "Melt underway", "Таяние"),
  enu("snow_pillow.state", ["accumulate", "ripe", "melt", "bare", "fault"], "Snowpack state", "Состояние снега"),
]);

write("layer-b-funicular.json", [
  id("funicular.id", "Funicular id", "ID фуникулёра"),
  id("funicular.car.id", "Funicular car id", "ID вагона фуникулёра"),
  q("funicular.speed", "m/s", "Car speed", "Скорость вагона"),
  q("funicular.load", "%", "Load", "Загрузка", { range: { min: 0, max: 100 } }),
  q("funicular.rope.tension", "kN", "Rope tension", "Натяжение каната"),
  q("funicular.track.grade", "%", "Track grade", "Уклон пути", { range: { min: 0, max: 100 } }),
  logical("funicular.evac", "Evacuation mode", "Режим эвакуации"),
  enu("funicular.state", ["up", "down", "hold", "evac", "offline", "fault"], "Funicular state", "Состояние фуникулёра"),
]);

write("layer-b-tram_ops.json", [
  id("tram_ops.vehicle.id", "Tram vehicle id", "ID трамвая"),
  id("tram_ops.line.id", "Tram line id", "ID трамвайной линии"),
  q("tram_ops.speed", "m/s", "Tram speed", "Скорость трамвая"),
  q("tram_ops.pax", "-", "Passengers onboard", "Пассажиров в салоне", { encodings: ["i32"] }),
  q("tram_ops.pantograph.force", "N", "Pantograph force", "Нажатие токоприёмника"),
  q("tram_ops.energy", "Wh", "Traction energy", "Тяговая энергия"),
  logical("tram_ops.derail.risk", "Derailment risk", "Риск схода"),
  enu("tram_ops.mode", ["service", "not_in_service", "depot", "fault"], "Service mode", "Режим работы"),
]);

write("layer-b-airport_fuel.json", [
  id("airport_fuel.hydrant.id", "Fuel hydrant id", "ID гидранта авиатоплива"),
  id("airport_fuel.pit.id", "Fuel pit id", "ID пит-клапана"),
  q("airport_fuel.flow", "L/min", "Fuel flow", "Расход топлива"),
  q("airport_fuel.pressure", "kPa", "Hydrant pressure", "Давление гидранта"),
  q("airport_fuel.temp", "Cel", "Fuel temperature", "Температура топлива"),
  q("airport_fuel.fsii", "ppm", "FSII concentration", "Концентрация ПВКЖ"),
  logical("airport_fuel.water", "Free water detected", "Обнаружена свободная вода"),
  enu("airport_fuel.grade", ["jet_a", "jet_a1", "ts1", "avgas", "saf_blend", "other"], "Fuel grade", "Марка топлива"),
]);

write("layer-b-dry_dock.json", [
  id("dry_dock.id", "Dry dock id", "ID сухого дока"),
  id("dry_dock.ship.id", "Docked ship id", "ID судна в доке"),
  q("dry_dock.keel.blocks", "-", "Keel block count", "Число кильблоков", { encodings: ["i32"] }),
  q("dry_dock.flood.level", "m", "Flood level", "Уровень затопления"),
  q("dry_dock.pump.rate", "m3/h", "Dewatering rate", "Производительность откачки"),
  q("dry_dock.gate.seal", "kPa", "Gate seal pressure", "Давление уплотнения ворот"),
  logical("dry_dock.dry", "Dock dry", "Док осушен"),
  enu("dry_dock.state", ["flood", "dock", "work", "undock", "idle", "fault"], "Dock state", "Состояние дока"),
]);

write("layer-b-research_vessel.json", [
  id("research_vessel.id", "Research vessel id", "ID НИС"),
  id("research_vessel.cruise.id", "Cruise id", "ID рейса"),
  q("research_vessel.winch.tension", "kN", "Winch tension", "Натяжение лебёдки"),
  q("research_vessel.wire.out", "m", "Wire out", "Вытравлено троса"),
  q("research_vessel.lab.temp", "Cel", "Lab temperature", "Температура лаборатории"),
  q("research_vessel.station.depth", "m", "Station depth", "Глубина станции"),
  logical("research_vessel.dp", "DP engaged", "ДП включён"),
  enu("research_vessel.activity", ["transit", "station", "tow", "coring", "idle", "port"], "Activity", "Деятельность"),
]);

write("layer-b-icebreaker.json", [
  id("icebreaker.id", "Icebreaker id", "ID ледокола"),
  q("icebreaker.ice.thickness", "m", "Ice thickness", "Толщина льда"),
  q("icebreaker.power", "W", "Propulsion power", "Мощность движения"),
  q("icebreaker.speed", "m/s", "Speed through ice", "Скорость во льду"),
  q("icebreaker.heel", "deg", "Heel", "Крен"),
  q("icebreaker.trim", "deg", "Trim", "Дифферент"),
  logical("icebreaker.stuck", "Beset in ice", "Зажат льдами"),
  enu("icebreaker.mode", ["open", "channel", "convoy", "ram", "port", "fault"], "Ops mode", "Режим работы"),
]);

write("layer-b-broadcast_truck.json", [
  id("broadcast_truck.id", "OB van id", "ID ПТС"),
  id("broadcast_truck.event.id", "Event id", "ID трансляции"),
  q("broadcast_truck.uplink.snr", "dB", "Uplink SNR", "ОСШ аплинка"),
  q("broadcast_truck.power", "W", "TX power", "Мощность передатчика"),
  q("broadcast_truck.gen.fuel", "%", "Generator fuel", "Топливо генератора", { range: { min: 0, max: 100 } }),
  q("broadcast_truck.sat.az", "deg", "Antenna azimuth", "Азимут антенны"),
  logical("broadcast_truck.onair", "On air", "В эфире"),
  enu("broadcast_truck.link", ["sat", "bonded", "fiber", "microwave", "other"], "Link type", "Тип канала"),
]);

write("layer-b-fiber_splice.json", [
  id("fiber_splice.job.id", "Splice job id", "ID работы по сварке"),
  id("fiber_splice.cable.id", "Fiber cable id", "ID оптического кабеля"),
  q("fiber_splice.loss", "dB", "Splice loss", "Потери сварки"),
  q("fiber_splice.arc", "s", "Arc time", "Время дуги"),
  q("fiber_splice.cleave.angle", "deg", "Cleave angle", "Угол скола"),
  q("fiber_splice.count", "-", "Splice count", "Число сварок", { encodings: ["i32"] }),
  logical("fiber_splice.pass", "Splice pass", "Сварка принята"),
  enu("fiber_splice.method", ["fusion", "mech", "connector", "other"], "Method", "Метод"),
]);

write("layer-b-vineyard_cellar.json", [
  id("vineyard_cellar.id", "Cellar id", "ID винотеки"),
  id("vineyard_cellar.barrel.id", "Barrel id", "ID бочки"),
  q("vineyard_cellar.temp", "Cel", "Cellar temperature", "Температура погреба"),
  q("vineyard_cellar.humidity", "%", "Cellar humidity", "Влажность погреба", { range: { min: 0, max: 100 } }),
  q("vineyard_cellar.ullage", "mm", "Ullage", "Усушка"),
  q("vineyard_cellar.so2", "mg/L", "Free SO2", "Свободный SO2"),
  logical("vineyard_cellar.ready", "Ready to bottle", "Готово к розливу"),
  enu("vineyard_cellar.vessel", ["barrel", "tank", "amphora", "bottle", "other"], "Vessel", "Ёмкость"),
]);

write("layer-b-cheese_cave.json", [
  id("cheese_cave.id", "Cheese cave id", "ID сырного погреба"),
  id("cheese_cave.lot.id", "Cheese lot id", "ID партии сыра"),
  q("cheese_cave.temp", "Cel", "Cave temperature", "Температура погреба"),
  q("cheese_cave.humidity", "%", "Cave humidity", "Влажность погреба", { range: { min: 0, max: 100 } }),
  q("cheese_cave.age.d", "d", "Age days", "Срок выдержки"),
  q("cheese_cave.ammonia", "ppm", "Ammonia", "Аммиак"),
  logical("cheese_cave.turn.due", "Turn due", "Пора переворачивать"),
  enu("cheese_cave.rind", ["natural", "washed", "bloomy", "wax", "other"], "Rind type", "Тип корки"),
]);

write("layer-b-chocolate_line.json", [
  id("chocolate_line.id", "Chocolate line id", "ID линии шоколада"),
  id("chocolate_line.sku.id", "Chocolate SKU id", "ID SKU шоколада"),
  q("chocolate_line.conche.temp", "Cel", "Conche temperature", "Температура конширования"),
  q("chocolate_line.viscosity", "mPa.s", "Chocolate viscosity", "Вязкость шоколада"),
  q("chocolate_line.temper", "Cel", "Temper temperature", "Температура темперирования"),
  q("chocolate_line.throughput", "kg/h", "Throughput", "Производительность"),
  logical("chocolate_line.bloom", "Bloom risk", "Риск поседения"),
  enu("chocolate_line.state", ["conche", "temper", "mold", "cool", "wrap", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-snack_fryer.json", [
  id("snack_fryer.id", "Snack fryer id", "ID фритюра снеков"),
  id("snack_fryer.sku.id", "Snack SKU id", "ID SKU снеков"),
  q("snack_fryer.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  q("snack_fryer.dwell.s", "s", "Dwell time", "Время обжарки"),
  q("snack_fryer.ffa", "%", "Free fatty acids", "Свободные жирные кислоты", { range: { min: 0, max: 100 } }),
  q("snack_fryer.moisture", "%", "Product moisture", "Влага продукта", { range: { min: 0, max: 100 } }),
  logical("snack_fryer.oil.change", "Oil change due", "Пора менять масло"),
  enu("snack_fryer.state", ["heat", "fry", "idle", "filter", "cip", "fault"], "Fryer state", "Состояние фритюра"),
]);

write("layer-b-ice_cream_line.json", [
  id("ice_cream_line.id", "Ice cream line id", "ID линии мороженого"),
  id("ice_cream_line.sku.id", "Ice cream SKU id", "ID SKU мороженого"),
  q("ice_cream_line.draw.temp", "Cel", "Draw temperature", "Температура выгрузки"),
  q("ice_cream_line.overrun", "%", "Overrun", "Взбитость", { range: { min: 0, max: 200 } }),
  q("ice_cream_line.harden.temp", "Cel", "Hardening temperature", "Температура закаливания"),
  q("ice_cream_line.mix.solids", "%", "Mix solids", "Сухие вещества смеси", { range: { min: 0, max: 100 } }),
  logical("ice_cream_line.freezer.ok", "Freezer OK", "Фризер в норме"),
  enu("ice_cream_line.state", ["mix", "age", "freeze", "fill", "harden", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-mushroom_farm.json", [
  id("mushroom_farm.room.id", "Grow room id", "ID камеры выращивания"),
  id("mushroom_farm.batch.id", "Mushroom batch id", "ID партии грибов"),
  q("mushroom_farm.co2", "ppm", "Room CO2", "CO2 камеры"),
  q("mushroom_farm.humidity", "%", "Room humidity", "Влажность камеры", { range: { min: 0, max: 100 } }),
  q("mushroom_farm.temp", "Cel", "Room temperature", "Температура камеры"),
  q("mushroom_farm.yield", "kg", "Flush yield", "Урожай волны"),
  logical("mushroom_farm.pinning", "Pinning", "Завязь"),
  enu("mushroom_farm.stage", ["spawn", "case", "pin", "flush", "empty", "cookout"], "Stage", "Стадия"),
]);

write("layer-b-insect_farm.json", [
  id("insect_farm.crate.id", "Insect crate id", "ID лотка насекомых"),
  id("insect_farm.batch.id", "Insect batch id", "ID партии насекомых"),
  q("insect_farm.temp", "Cel", "Crate temperature", "Температура лотка"),
  q("insect_farm.humidity", "%", "Crate humidity", "Влажность лотка", { range: { min: 0, max: 100 } }),
  q("insect_farm.feed.rate", "kg/d", "Feed rate", "Норма корма"),
  q("insect_farm.biomass", "kg", "Live biomass", "Живая биомасса"),
  logical("insect_farm.harvest.ready", "Harvest ready", "Готово к съёму"),
  enu("insect_farm.species", ["bsf", "mealworm", "cricket", "other"], "Species", "Вид"),
]);

write("layer-b-algae_pond.json", [
  id("algae_pond.id", "Algae pond id", "ID водорослевого пруда"),
  q("algae_pond.od", "-", "Optical density", "Оптическая плотность"),
  q("algae_pond.do", "mg/L", "Dissolved oxygen", "Растворённый кислород"),
  q("algae_pond.ph", "-", "Pond pH", "pH пруда"),
  q("algae_pond.temp", "Cel", "Pond temperature", "Температура пруда"),
  q("algae_pond.harvest", "kg/d", "Harvest rate", "Съём биомассы"),
  logical("algae_pond.crash", "Culture crash", "Крах культуры"),
  enu("algae_pond.mode", ["inoculate", "grow", "harvest", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-silviculture.json", [
  id("silviculture.stand.id", "Forest stand id", "ID лесосеки"),
  q("silviculture.dbh", "mm", "Mean DBH", "Средний ДГК"),
  q("silviculture.basal", "m2/ha", "Basal area", "Сумма площадей сечений"),
  q("silviculture.stocking", "/ha", "Stems per hectare", "Деревьев на гектар"),
  q("silviculture.moisture", "%", "Soil moisture", "Влажность почвы", { range: { min: 0, max: 100 } }),
  q("silviculture.age.y", "y", "Stand age", "Возраст насаждения"),
  logical("silviculture.thin.due", "Thinning due", "Пора прореживать"),
  enu("silviculture.treatment", ["plant", "release", "thin", "harvest", "leave"], "Treatment", "Мероприятие"),
]);

write("layer-b-linac_med.json", [
  id("linac_med.id", "Medical linac id", "ID медлинейного ускорителя"),
  id("linac_med.plan.id", "Treatment plan id", "ID плана облучения", { sensitivity: "restricted" }),
  q("linac_med.dose.gy", "Gy", "Delivered dose", "Подведённая доза"),
  q("linac_med.mu", "-", "Monitor units", "Мониторные единицы"),
  q("linac_med.gantry", "deg", "Gantry angle", "Угол гантри"),
  q("linac_med.energy", "MV", "Beam energy", "Энергия пучка"),
  logical("linac_med.beam.on", "Beam on", "Пучок включён"),
  enu("linac_med.state", ["idle", "setup", "treat", "qa", "fault"], "Linac state", "Состояние ускорителя"),
]);

write("layer-b-hyperbaric.json", [
  id("hyperbaric.chamber.id", "Hyperbaric chamber id", "ID барокамеры"),
  id("hyperbaric.session.id", "HBOT session id", "ID сеанса ГБО", { sensitivity: "restricted" }),
  q("hyperbaric.pressure", "kPa", "Chamber pressure", "Давление камеры"),
  q("hyperbaric.o2", "%", "Oxygen fraction", "Доля кислорода", { range: { min: 0, max: 100 } }),
  q("hyperbaric.depth.msw", "m", "Equivalent depth", "Эквивалентная глубина"),
  q("hyperbaric.time.min", "min", "Bottom time", "Время экспозиции"),
  logical("hyperbaric.fire.risk", "Fire watch", "Пожарная готовность"),
  enu("hyperbaric.state", ["lock", "compress", "treat", "decompress", "idle", "fault"], "Chamber state", "Состояние камеры"),
]);

write("layer-b-pharmacy_robot.json", [
  id("pharmacy_robot.id", "Pharmacy robot id", "ID аптечного робота"),
  id("pharmacy_robot.order.id", "Dispense order id", "ID заказа на отпуск", { sensitivity: "restricted" }),
  q("pharmacy_robot.picks", "-", "Picks completed", "Выполнено отборов", { encodings: ["i32"] }),
  q("pharmacy_robot.queue", "-", "Queue length", "Длина очереди", { encodings: ["i32"] }),
  q("pharmacy_robot.error.rate", "%", "Error rate", "Доля ошибок", { range: { min: 0, max: 100 } }),
  q("pharmacy_robot.temp", "Cel", "Cabinet temperature", "Температура шкафа"),
  logical("pharmacy_robot.jam", "Jam", "Замятие"),
  enu("pharmacy_robot.state", ["idle", "pick", "pack", "restock", "fault"], "Robot state", "Состояние робота"),
]);

write("layer-b-morgue_ops.json", [
  id("morgue_ops.unit.id", "Morgue unit id", "ID морга"),
  id("morgue_ops.case.id", "Case id", "ID случая", { sensitivity: "restricted" }),
  q("morgue_ops.cooler.temp", "Cel", "Cooler temperature", "Температура холодильника"),
  q("morgue_ops.occupancy", "-", "Occupied trays", "Занятых лотков", { encodings: ["i32"] }),
  q("morgue_ops.capacity", "-", "Tray capacity", "Ёмкость лотков", { encodings: ["i32"] }),
  q("morgue_ops.door.open_s", "s", "Door open time", "Время открытой двери"),
  logical("morgue_ops.alarm", "Temperature alarm", "Авария температуры"),
  enu("morgue_ops.state", ["ok", "full", "alarm", "offline"], "Morgue state", "Состояние морга"),
]);

write("layer-b-particle_therapy.json", [
  id("particle_therapy.gantry.id", "Therapy gantry id", "ID гантри терапии"),
  id("particle_therapy.plan.id", "Particle plan id", "ID плана частиц", { sensitivity: "restricted" }),
  q("particle_therapy.energy", "MeV", "Beam energy", "Энергия пучка"),
  q("particle_therapy.dose.gy", "Gy", "Delivered dose", "Подведённая доза"),
  q("particle_therapy.range", "mm", "Beam range", "Пробег пучка"),
  q("particle_therapy.spots", "-", "Spots delivered", "Доставленных спотов", { encodings: ["i32"] }),
  logical("particle_therapy.beam.on", "Beam on", "Пучок включён"),
  enu("particle_therapy.particle", ["proton", "carbon", "helium", "other"], "Particle", "Частица"),
]);

write("layer-b-halt_chamber.json", [
  id("halt_chamber.id", "HALT chamber id", "ID камеры HALT"),
  id("halt_chamber.run.id", "HALT run id", "ID прогона HALT"),
  q("halt_chamber.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("halt_chamber.ramp", "K/min", "Temp ramp", "Скорость изменения температуры"),
  q("halt_chamber.vibe.grms", "-", "Vibration Grms", "Вибрация Grms"),
  q("halt_chamber.step", "-", "Profile step", "Шаг профиля", { encodings: ["i32"] }),
  logical("halt_chamber.dut.fail", "DUT failed", "Отказ испытуемого"),
  enu("halt_chamber.state", ["setup", "cold", "hot", "vibe", "combo", "idle", "fault"], "Chamber state", "Состояние камеры"),
]);

write("layer-b-salt_spray.json", [
  id("salt_spray.chamber.id", "Salt spray chamber id", "ID камеры соляного тумана"),
  id("salt_spray.run.id", "Salt spray run id", "ID испытания соляным туманом"),
  q("salt_spray.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("salt_spray.ph", "-", "Fog pH", "pH тумана"),
  q("salt_spray.collect", "mL/h", "Collection rate", "Сбор конденсата"),
  q("salt_spray.nacl", "%", "NaCl concentration", "Концентрация NaCl", { range: { min: 0, max: 100 } }),
  logical("salt_spray.nozzle.ok", "Nozzle OK", "Форсунка в норме"),
  enu("salt_spray.method", ["nss", "ass", "cass", "cyclic", "other"], "Method", "Метод"),
]);

write("layer-b-shaker_vib.json", [
  id("shaker_vib.id", "Vibration shaker id", "ID вибростенда"),
  id("shaker_vib.run.id", "Shaker run id", "ID прогона вибростенда"),
  q("shaker_vib.force", "N", "Shaker force", "Усилие вибростенда"),
  q("shaker_vib.accel", "m/s2", "Control acceleration", "Управляемое ускорение"),
  q("shaker_vib.freq", "Hz", "Drive frequency", "Частота возбуждения"),
  q("shaker_vib.stroke", "mm", "Displacement", "Перемещение"),
  logical("shaker_vib.abort", "Abort", "Аварийный останов"),
  enu("shaker_vib.profile", ["sine", "random", "shock", "sor", "other"], "Profile", "Профиль"),
]);

write("layer-b-tensile_test.json", [
  id("tensile_test.frame.id", "Tensile frame id", "ID разрывной машины"),
  id("tensile_test.specimen.id", "Specimen id", "ID образца"),
  q("tensile_test.force", "N", "Force", "Сила"),
  q("tensile_test.strain", "-", "Strain", "Деформация"),
  q("tensile_test.uts", "MPa", "UTS", "Предел прочности"),
  q("tensile_test.elongation", "%", "Elongation", "Удлинение", { range: { min: 0, max: 100 } }),
  logical("tensile_test.break", "Specimen broken", "Образец разрушен"),
  enu("tensile_test.mode", ["tensile", "compress", "flex", "peel", "other"], "Test mode", "Режим испытания"),
]);

write("layer-b-edm_machine.json", [
  id("edm_machine.id", "EDM machine id", "ID электроэрозионного станка"),
  id("edm_machine.job.id", "EDM job id", "ID задания ЭЭО"),
  q("edm_machine.gap.v", "V", "Gap voltage", "Напряжение межэлектродного зазора"),
  q("edm_machine.on.time", "us", "Pulse on-time", "Длительность импульса"),
  q("edm_machine.flush", "L/min", "Dielectric flush", "Прокачка диэлектрика"),
  q("edm_machine.wear", "%", "Electrode wear", "Износ электрода", { range: { min: 0, max: 100 } }),
  logical("edm_machine.short", "Gap short", "Короткое замыкание зазора"),
  enu("edm_machine.type", ["sinker", "wire", "hole", "other"], "EDM type", "Тип ЭЭО"),
]);

write("layer-b-waterjet_cut.json", [
  id("waterjet_cut.id", "Waterjet id", "ID гидроабразива"),
  id("waterjet_cut.job.id", "Waterjet job id", "ID задания гидроабразива"),
  q("waterjet_cut.pressure", "MPa", "Pump pressure", "Давление насоса"),
  q("waterjet_cut.abrasive", "kg/min", "Abrasive rate", "Подача абразива"),
  q("waterjet_cut.speed", "mm/min", "Cut speed", "Скорость резки"),
  q("waterjet_cut.stand.off", "mm", "Standoff", "Зазор сопла"),
  logical("waterjet_cut.garnet.low", "Garnet low", "Мало граната"),
  enu("waterjet_cut.state", ["cut", "pierce", "idle", "maintain", "fault"], "Jet state", "Состояние резки"),
]);

write("layer-b-plasma_cutter.json", [
  id("plasma_cutter.id", "Plasma cutter id", "ID плазменной резки"),
  id("plasma_cutter.job.id", "Plasma job id", "ID задания плазмы"),
  q("plasma_cutter.current", "A", "Cut current", "Ток резки"),
  q("plasma_cutter.voltage", "V", "Arc voltage", "Напряжение дуги"),
  q("plasma_cutter.speed", "mm/min", "Cut speed", "Скорость резки"),
  q("plasma_cutter.gas.flow", "L/min", "Plasma gas flow", "Расход плазмообразующего газа"),
  logical("plasma_cutter.pierce.ok", "Pierce OK", "Прожиг OK"),
  enu("plasma_cutter.process", ["air", "o2", "n2", "h35", "other"], "Process gas", "Плазмообразующий газ"),
]);

write("layer-b-friction_stir.json", [
  id("friction_stir.machine.id", "FSW machine id", "ID машины СТП"),
  id("friction_stir.weld.id", "FSW weld id", "ID шва СТП"),
  q("friction_stir.rpm", "rpm", "Tool RPM", "Обороты инструмента"),
  q("friction_stir.force", "kN", "Axial force", "Осевое усилие"),
  q("friction_stir.travel", "mm/min", "Travel speed", "Скорость перемещения"),
  q("friction_stir.temp", "Cel", "Tool temperature", "Температура инструмента"),
  logical("friction_stir.void", "Void detected", "Обнаружена полость"),
  enu("friction_stir.state", ["plunge", "dwell", "weld", "extract", "idle", "fault"], "FSW state", "Состояние СТП"),
]);

write("layer-b-brazing_oven.json", [
  id("brazing_oven.id", "Brazing oven id", "ID печи пайки"),
  id("brazing_oven.batch.id", "Braze batch id", "ID садки пайки"),
  q("brazing_oven.temp", "Cel", "Zone temperature", "Температура зоны"),
  q("brazing_oven.vacuum", "Pa", "Vacuum level", "Вакуум"),
  q("brazing_oven.hold.min", "min", "Hold time", "Выдержка"),
  q("brazing_oven.dewpoint", "Cel", "Atmosphere dewpoint", "Точка росы атмосферы"),
  logical("brazing_oven.leak", "Vacuum leak", "Натекание"),
  enu("brazing_oven.atm", ["vacuum", "h2", "n2", "air", "other"], "Atmosphere", "Атмосфера"),
]);

write("layer-b-hip_vessel.json", [
  id("hip_vessel.id", "HIP vessel id", "ID установки ГИП"),
  id("hip_vessel.cycle.id", "HIP cycle id", "ID цикла ГИП"),
  q("hip_vessel.pressure", "MPa", "HIP pressure", "Давление ГИП"),
  q("hip_vessel.temp", "Cel", "HIP temperature", "Температура ГИП"),
  q("hip_vessel.hold.h", "h", "Hold time", "Выдержка"),
  q("hip_vessel.gas.use", "m3", "Argon used", "Расход аргона"),
  logical("hip_vessel.seal.ok", "Seal OK", "Уплотнение OK"),
  enu("hip_vessel.state", ["load", "press", "heat", "hold", "cool", "fault"], "HIP state", "Состояние ГИП"),
]);

write("layer-b-osat_pack.json", [
  id("osat_pack.line.id", "OSAT line id", "ID линии корпусирования"),
  id("osat_pack.lot.id", "Assembly lot id", "ID партии сборки"),
  q("osat_pack.yield", "%", "Assembly yield", "Выход годных", { range: { min: 0, max: 100 } }),
  q("osat_pack.bond.force", "N", "Bond force", "Усилие разварки"),
  q("osat_pack.mold.temp", "Cel", "Mold temperature", "Температура пресс-формы"),
  q("osat_pack.units", "-", "Units processed", "Обработано единиц", { encodings: ["i32"] }),
  logical("osat_pack.void", "Mold void", "Раковина в компаунде"),
  enu("osat_pack.process", ["dicing", "die_attach", "wirebond", "mold", "test", "other"], "Process", "Процесс"),
]);

write("layer-b-wave_solder.json", [
  id("wave_solder.id", "Wave solder id", "ID машины волновой пайки"),
  id("wave_solder.job.id", "Wave solder job id", "ID задания волновой пайки"),
  q("wave_solder.pot.temp", "Cel", "Solder pot temperature", "Температура ванны"),
  q("wave_solder.preheat", "Cel", "Preheat temperature", "Температура преднагрева"),
  q("wave_solder.speed", "m/min", "Conveyor speed", "Скорость конвейера"),
  q("wave_solder.flux.sg", "-", "Flux specific gravity", "Плотность флюса"),
  logical("wave_solder.dross.high", "Dross high", "Много дросса"),
  enu("wave_solder.alloy", ["sn63", "sac305", "snip", "other"], "Alloy", "Сплав"),
]);

write("layer-b-conformal_coat.json", [
  id("conformal_coat.line.id", "Conformal coat line id", "ID линии влагозащиты"),
  id("conformal_coat.job.id", "Coat job id", "ID задания покрытия"),
  q("conformal_coat.thickness", "um", "Coat thickness", "Толщина покрытия"),
  q("conformal_coat.viscosity", "mPa.s", "Coat viscosity", "Вязкость покрытия"),
  q("conformal_coat.cure.temp", "Cel", "Cure temperature", "Температура отверждения"),
  q("conformal_coat.uv", "W/m2", "UV intensity", "Интенсивность УФ"),
  logical("conformal_coat.skip", "Keep-out skip", "Пропуск зон"),
  enu("conformal_coat.chem", ["acrylic", "urethane", "silicone", "parylene", "other"], "Chemistry", "Химия"),
]);

write("layer-b-cmp_tool.json", [
  id("cmp_tool.id", "CMP tool id", "ID установки CMP"),
  id("cmp_tool.wafer.id", "Wafer id", "ID пластины"),
  q("cmp_tool.downforce", "kPa", "Downforce", "Прижим"),
  q("cmp_tool.platen.rpm", "rpm", "Platen RPM", "Обороты планшайбы"),
  q("cmp_tool.slurry.flow", "mL/min", "Slurry flow", "Расход суспензии"),
  q("cmp_tool.rate", "nm/min", "Removal rate", "Скорость съёма"),
  logical("cmp_tool.endpoint", "Endpoint reached", "Достигнута конечная точка"),
  enu("cmp_tool.film", ["oxide", "cu", "w", "sti", "other"], "Film", "Плёнка"),
]);

console.log("Layer B14 seeds written");
