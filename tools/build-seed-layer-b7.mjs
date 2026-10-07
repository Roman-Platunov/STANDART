#!/usr/bin/env node
/**
 * Layer B7 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B7", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-brewery.json", [
  id("brewery.batch.id", "Brew batch id", "ID партии пива"),
  id("brewery.tank.id", "Brew tank id", "ID танкового оборудования"),
  q("brewery.mash.temperature", "Cel", "Mash temperature", "Температура затирания"),
  q("brewery.wort.gravity", "-", "Wort specific gravity", "Плотность сусла"),
  q("brewery.ferment.temperature", "Cel", "Fermentation temperature", "Температура брожения"),
  q("brewery.ferment.pressure", "Pa", "Fermenter pressure", "Давление в ферментере"),
  q("brewery.yeast.viability", "%", "Yeast viability", "Жизнеспособность дрожжей", { range: { min: 0, max: 100 } }),
  q("brewery.co2.dissolved", "g/L", "Dissolved CO2", "Растворённый CO₂"),
  enu("brewery.stage", ["mash", "lauter", "boil", "ferment", "condition", "package"], "Brewery stage", "Стадия пивоварения"),
]);

write("layer-b-winery.json", [
  id("winery.lot.id", "Wine lot id", "ID партии вина"),
  id("winery.tank.id", "Wine tank id", "ID винной ёмкости"),
  q("winery.must.brix", "-", "Must Brix", "Брикс сусла"),
  q("winery.must.ph", "-", "Must pH", "pH сусла"),
  q("winery.barrel.temperature", "Cel", "Barrel temperature", "Температура бочки"),
  q("winery.barrel.humidity", "%", "Cellar humidity", "Влажность погреба", { range: { min: 0, max: 100 } }),
  q("winery.so2.free", "mg/L", "Free SO2", "Свободный SO₂"),
  q("winery.alcohol.abv", "%", "Alcohol by volume", "Крепость ABV", { range: { min: 0, max: 100 } }),
  enu("winery.stage", ["crush", "ferment", "press", "age", "blend", "bottle"], "Winery stage", "Стадия виноделия"),
]);

write("layer-b-distillery.json", [
  id("distillery.batch.id", "Spirit batch id", "ID партии дистиллята"),
  q("distillery.still.temperature", "Cel", "Still temperature", "Температура куба"),
  q("distillery.still.pressure", "Pa", "Still pressure", "Давление куба"),
  q("distillery.vapor.abv", "%", "Vapor ABV", "Крепость паров", { range: { min: 0, max: 100 } }),
  q("distillery.spirit.abv", "%", "Spirit ABV", "Крепость спирта", { range: { min: 0, max: 100 } }),
  q("distillery.cut.heads_pct", "%", "Heads cut fraction", "Доля голов", { range: { min: 0, max: 100 } }),
  logical("distillery.leak.detected", "Spirit vapor leak", "Утечка паров"),
  enu("distillery.state", ["idle", "heat", "run", "cut", "cool", "fault"], "Distillery state", "Состояние дистилляции"),
]);

write("layer-b-meat_proc.json", [
  id("meat_proc.lot.id", "Meat lot id", "ID партии мяса"),
  id("meat_proc.line.id", "Processing line id", "ID линии мясопереработки"),
  q("meat_proc.carcass.weight", "kg", "Carcass weight", "Масса туши"),
  q("meat_proc.chill.temperature", "Cel", "Chill room temperature", "Температура охлаждения"),
  q("meat_proc.metal.detect_count", "-", "Metal detector hits", "Срабатывания металлодетектора", { encodings: ["i32"] }),
  q("meat_proc.pack.vacuum", "Pa", "Vacuum pack pressure", "Вакуум упаковки"),
  logical("meat_proc.haccp.hold", "HACCP hold", "Удержание по HACCP"),
  enu("meat_proc.stage", ["receive", "slaughter", "cut", "grind", "pack", "ship"], "Meat process stage", "Стадия мясопереработки"),
]);

write("layer-b-cannery.json", [
  id("cannery.batch.id", "Cannery batch id", "ID партии консервов"),
  id("cannery.retort.id", "Retort id", "ID автоклава"),
  q("cannery.fill.weight", "g", "Fill weight", "Масса наполнения"),
  q("cannery.retort.temperature", "Cel", "Retort temperature", "Температура автоклава"),
  q("cannery.retort.pressure", "Pa", "Retort pressure", "Давление автоклава"),
  q("cannery.f0.value", "min", "F0 lethality", "Летальность F0"),
  q("cannery.seam.tightness", "-", "Seam tightness score", "Герметичность шва"),
  logical("cannery.can.defect", "Can defect detected", "Дефект банки"),
  enu("cannery.stage", ["prep", "fill", "seal", "retort", "cool", "label"], "Cannery stage", "Стадия консервирования"),
]);

write("layer-b-dairy_extend.json", [
  id("dairy_extend.silo.id", "Milk silo id", "ID молочного силоса"),
  q("dairy_extend.raw.somatic_cells", "/mL", "Somatic cell count", "Соматические клетки"),
  q("dairy_extend.pasteur.htst_temp", "Cel", "HTST pasteurization temp", "Температура пастеризации HTST"),
  q("dairy_extend.homogen.pressure", "Pa", "Homogenizer pressure", "Давление гомогенизатора"),
  q("dairy_extend.separator.speed", "rpm", "Separator speed", "Обороты сепаратора"),
  q("dairy_extend.cheese.moisture", "%", "Cheese moisture", "Влажность сыра", { range: { min: 0, max: 100 } }),
  q("dairy_extend.culture.activity", "-", "Starter culture activity", "Активность закваски"),
  enu("dairy_extend.product", ["milk", "yogurt", "cheese", "butter", "powder", "other"], "Dairy product type", "Тип молочного продукта"),
]);

write("layer-b-district_heating.json", [
  id("district_heating.loop.id", "District heating loop id", "ID контура теплосети"),
  id("district_heating.substation.id", "Heat substation id", "ID теплового пункта"),
  q("district_heating.supply.temperature", "Cel", "Supply temperature", "Температура подачи"),
  q("district_heating.return.temperature", "Cel", "Return temperature", "Температура обратки"),
  q("district_heating.flow", "m3/h", "Loop flow rate", "Расход теплоносителя"),
  q("district_heating.pressure.diff", "Pa", "Differential pressure", "Перепад давления"),
  q("district_heating.heat.power", "W", "Delivered heat power", "Отпускаемая тепловая мощность"),
  logical("district_heating.leak.suspect", "Network leak suspect", "Подозрение на утечку"),
  enu("district_heating.mode", ["heat", "idle", "bypass", "maintenance", "fault"], "District heating mode", "Режим теплосети"),
]);

write("layer-b-wte.json", [
  id("wte.plant.id", "Waste-to-energy plant id", "ID мусоросжигательного завода"),
  id("wte.boiler.id", "WTE boiler id", "ID котла WtE"),
  q("wte.furnace.temperature", "Cel", "Furnace temperature", "Температура топки"),
  q("wte.steam.pressure", "Pa", "Steam pressure", "Давление пара"),
  q("wte.steam.flow", "t/h", "Steam flow", "Расход пара"),
  q("wte.emissions.nox", "mg/m3", "NOx emissions", "Выбросы NOx"),
  q("wte.emissions.dioxin", "ng/m3", "Dioxin TEQ", "Диоксины TEQ"),
  q("wte.ash.bottom_mass", "t", "Bottom ash mass", "Масса шлака"),
  q("wte.power.export", "W", "Exported electric power", "Отпускаемая электроэнергия"),
  enu("wte.state", ["start", "run", "ramp_down", "outage", "fault"], "WTE plant state", "Состояние WtE"),
]);

write("layer-b-h2_refuel.json", [
  id("h2_refuel.station.id", "H2 refueling station id", "ID водородной заправки"),
  id("h2_refuel.dispenser.id", "H2 dispenser id", "ID водородного раздаточного"),
  q("h2_refuel.storage.pressure", "Pa", "Storage pressure", "Давление хранения H₂"),
  q("h2_refuel.dispenser.pressure", "Pa", "Dispenser nozzle pressure", "Давление на пистолете"),
  q("h2_refuel.dispenser.flow", "kg/min", "H2 flow rate", "Расход водорода"),
  q("h2_refuel.dispenser.temperature", "Cel", "Precooled H2 temperature", "Температура охлаждённого H₂"),
  q("h2_refuel.session.mass", "kg", "Session dispensed mass", "Масса за сессию"),
  logical("h2_refuel.leak.detected", "H2 leak detected", "Утечка водорода"),
  enu("h2_refuel.protocol", ["h70", "h35", "other"], "Refueling protocol", "Протокол заправки"),
]);

write("layer-b-vertiport.json", [
  id("vertiport.id", "Vertiport id", "ID вертипорта"),
  id("vertiport.pad.id", "Landing pad id", "ID посадочной площадки"),
  id("vertiport.flight.id", "eVTOL flight id", "ID рейса eVTOL"),
  q("vertiport.wind", "m/s", "Pad wind speed", "Ветер на площадке"),
  q("vertiport.pad.occupancy", "%", "Pad occupancy", "Занятость площадок", { range: { min: 0, max: 100 } }),
  q("vertiport.charger.power", "W", "eVTOL charger power", "Мощность зарядки eVTOL"),
  q("vertiport.noise", "dB", "Community noise level", "Уровень шума"),
  logical("vertiport.pad.clear", "Pad clear for landing", "Площадка свободна"),
  enu("vertiport.ops", ["open", "weather_hold", "closed", "emergency"], "Vertiport ops status", "Статус вертипорта"),
]);

write("layer-b-rail_signaling.json", [
  id("rail_signaling.block.id", "Signal block id", "ID блок-участка"),
  id("rail_signaling.signal.id", "Wayside signal id", "ID светофора"),
  id("rail_signaling.train.id", "Train consist id", "ID состава"),
  enu("rail_signaling.aspect", ["clear", "approach", "stop", "restricting", "dark"], "Signal aspect", "Показание сигнала"),
  logical("rail_signaling.track.occupied", "Track circuit occupied", "Рельсовая цепь занята"),
  logical("rail_signaling.interlock.locked", "Route interlocked", "Маршрут заблокирован"),
  q("rail_signaling.axle.count", "-", "Axle counter", "Счётчик осей", { encodings: ["i32"] }),
  q("rail_signaling.balise.passed", "-", "Balises passed", "Пройденные бализы", { encodings: ["i32"] }),
  enu("rail_signaling.system", ["etcs", "ptc", "cbtc", "relay", "other"], "Signaling system", "Система СЦБ"),
]);

write("layer-b-underground_mining.json", [
  id("underground_mining.level.id", "Mine level id", "ID горизонта шахты"),
  id("underground_mining.heading.id", "Heading id", "ID забоя"),
  q("underground_mining.gas.ch4", "%", "Methane concentration", "Концентрация метана", { range: { min: 0, max: 100 } }),
  q("underground_mining.gas.co", "ppm", "CO concentration", "Концентрация CO"),
  q("underground_mining.airflow", "m3/s", "Ventilation airflow", "Расход воздуха вентиляции"),
  q("underground_mining.roof.convergence", "mm", "Roof convergence", "Конвергенция кровли"),
  q("underground_mining.dust.pm", "ug/m3", "Dust PM concentration", "Пыль PM"),
  logical("underground_mining.refuge.ok", "Refuge chamber OK", "Камера убежища OK"),
  enu("underground_mining.status", ["active", "standby", "evacuated", "sealed"], "Mine status", "Статус шахты"),
]);

write("layer-b-quarry.json", [
  id("quarry.blast.id", "Blast pattern id", "ID взрывного блока"),
  id("quarry.face.id", "Quarry face id", "ID уступа карьера"),
  q("quarry.blast.vibration", "mm/s", "Blast vibration PPV", "Вибрация взрыва PPV"),
  q("quarry.haul.tonnage", "t", "Hauled tonnage", "Перевезённая масса"),
  q("quarry.crusher.throughput", "t/h", "Crusher throughput", "Производительность дробилки"),
  q("quarry.pit.slope_angle", "deg", "Pit slope angle", "Угол откоса"),
  q("quarry.water.level", "m", "Pit water level", "Уровень воды в карьере"),
  logical("quarry.blast.clearance", "Blast clearance given", "Разрешение на взрыв"),
  enu("quarry.stage", ["drill", "blast", "load", "haul", "crush", "stockpile"], "Quarry stage", "Стадия карьера"),
]);

write("layer-b-fab_metrology.json", [
  id("fab_metrology.tool.id", "Metrology tool id", "ID метрологического инструмента"),
  id("fab_metrology.wafer.id", "Wafer id", "ID пластины", { sensitivity: "internal" }),
  q("fab_metrology.overlay", "nm", "Overlay error", "Ошибка совмещения"),
  q("fab_metrology.cd", "nm", "Critical dimension", "Критический размер"),
  q("fab_metrology.film.thickness", "nm", "Film thickness", "Толщина плёнки"),
  q("fab_metrology.particle.count", "-", "Particle count", "Число частиц", { encodings: ["i32"] }),
  q("fab_metrology.defect.density", "/cm2", "Defect density", "Плотность дефектов"),
  logical("fab_metrology.spc.oos", "SPC out of spec", "SPC вне допуска"),
  enu("fab_metrology.method", ["cdsem", "overlay", "ellipsometry", "afm", "xray", "other"], "Metrology method", "Метод метрологии"),
]);

write("layer-b-fill_finish.json", [
  id("fill_finish.batch.id", "Fill-finish batch id", "ID серии розлива"),
  id("fill_finish.line.id", "Fill-finish line id", "ID линии розлива"),
  q("fill_finish.fill.volume", "uL", "Fill volume", "Объём наполнения"),
  q("fill_finish.fill.weight", "mg", "Fill weight", "Масса наполнения"),
  q("fill_finish.vial.reject_rate", "%", "Reject rate", "Доля брака", { range: { min: 0, max: 100 } }),
  q("fill_finish.isolator.pressure", "Pa", "Isolator pressure", "Давление изолятора"),
  q("fill_finish.particulate.airborne", "/m3", "Airborne particulates", "Частицы в воздухе"),
  logical("fill_finish.sterility.hold", "Sterility hold", "Удержание по стерильности"),
  enu("fill_finish.stage", ["prep", "fill", "stopper", "cap", "inspect", "pack"], "Fill-finish stage", "Стадия розлива"),
]);

write("layer-b-cleanroom.json", [
  id("cleanroom.id", "Cleanroom id", "ID чистой комнаты"),
  id("cleanroom.zone.id", "Cleanroom zone id", "ID зоны чистой комнаты"),
  q("cleanroom.particles.0_5", "/m3", "Particles ≥0.5 µm", "Частицы ≥0.5 мкм"),
  q("cleanroom.particles.5_0", "/m3", "Particles ≥5.0 µm", "Частицы ≥5.0 мкм"),
  q("cleanroom.pressure.diff", "Pa", "Room differential pressure", "Перепад давления"),
  q("cleanroom.air.ach", "/h", "Air changes per hour", "Кратность воздухообмена"),
  q("cleanroom.humidity", "%", "Cleanroom humidity", "Влажность чистой комнаты", { range: { min: 0, max: 100 } }),
  q("cleanroom.temperature", "Cel", "Cleanroom temperature", "Температура чистой комнаты"),
  enu("cleanroom.class.iso", ["iso3", "iso5", "iso7", "iso8", "other"], "ISO cleanroom class", "Класс ISO"),
]);

write("layer-b-telematics.json", [
  id("telematics.vehicle.id", "Telematics vehicle id", "ID ТС телематики"),
  id("telematics.policy.id", "Insurance policy id", "ID страхового полиса", { sensitivity: "internal" }),
  q("telematics.speed", "km/h", "Vehicle speed", "Скорость ТС"),
  q("telematics.accel.harsh", "-", "Harsh accel events", "Резкие ускорения", { encodings: ["i32"] }),
  q("telematics.brake.harsh", "-", "Harsh brake events", "Резкие торможения", { encodings: ["i32"] }),
  q("telematics.score.driving", "-", "Driving score", "Оценка вождения", { range: { min: 0, max: 100 } }),
  q("telematics.odometer", "km", "Odometer", "Одометр"),
  logical("telematics.crash.detected", "Crash detected", "ДТП зафиксировано"),
  enu("telematics.trip.state", ["idle", "trip", "parked", "tow"], "Trip state", "Состояние поездки"),
]);

write("layer-b-der_grid.json", [
  id("der_grid.asset.id", "DER asset id", "ID объекта ВИЭ/накопителя"),
  id("der_grid.feeder.id", "Distribution feeder id", "ID фидера"),
  q("der_grid.export.power", "W", "Export power", "Мощность выдачи"),
  q("der_grid.import.power", "W", "Import power", "Мощность потребления"),
  q("der_grid.pf", "-", "Power factor", "Коэффициент мощности"),
  q("der_grid.voltage", "V", "POC voltage", "Напряжение в точке присоединения"),
  q("der_grid.curtailment", "%", "Curtailment fraction", "Доля ограничения", { range: { min: 0, max: 100 } }),
  logical("der_grid.island.detected", "Island detected", "Островной режим"),
  enu("der_grid.mode", ["grid_follow", "grid_form", "idle", "fault"], "DER mode", "Режим DER"),
]);

write("layer-b-harbor_ops.json", [
  id("harbor_ops.berth.id", "Commercial berth id", "ID коммерческого причала"),
  id("harbor_ops.vessel.id", "Calling vessel id", "ID судна у причала"),
  q("harbor_ops.draft", "m", "Available draft", "Доступная осадка"),
  q("harbor_ops.tide.height", "m", "Tide height", "Уровень прилива"),
  q("harbor_ops.crane.moves", "-", "Crane moves per hour", "Операции крана в час", { encodings: ["i16"] }),
  q("harbor_ops.pilot.wait_min", "min", "Pilot wait time", "Ожидание лоцмана"),
  logical("harbor_ops.channel.clear", "Channel clear", "Фарватер свободен"),
  enu("harbor_ops.berth.state", ["free", "alongside", "working", "departing", "blocked"], "Berth state", "Состояние причала"),
]);

write("layer-b-dredging.json", [
  id("dredging.project.id", "Dredging project id", "ID проекта дноуглубления"),
  id("dredging.vessel.id", "Dredger vessel id", "ID земснаряда"),
  q("dredging.depth.target", "m", "Target dredge depth", "Целевая глубина"),
  q("dredging.depth.achieved", "m", "Achieved depth", "Достигнутая глубина"),
  q("dredging.volume.removed", "m3", "Volume removed", "Изъятый объём"),
  q("dredging.spoil.density", "kg/m3", "Spoil density", "Плотность грунта"),
  q("dredging.turbidity", "NTU", "Plume turbidity", "Мутность шлейфа"),
  enu("dredging.method", ["cutter", "trailing", "hopper", "backhoe", "other"], "Dredging method", "Метод дноуглубления"),
]);

write("layer-b-biogas.json", [
  id("biogas.digester.id", "Anaerobic digester id", "ID биореактора"),
  q("biogas.digester.temperature", "Cel", "Digester temperature", "Температура реактора"),
  q("biogas.digester.ph", "-", "Digester pH", "pH реактора"),
  q("biogas.gas.ch4_fraction", "%", "Methane fraction", "Доля метана", { range: { min: 0, max: 100 } }),
  q("biogas.gas.flow", "m3/h", "Biogas flow", "Расход биогаза"),
  q("biogas.h2s", "ppm", "H2S concentration", "Концентрация H₂S"),
  q("biogas.engine.power", "W", "CHP engine power", "Мощность когенерации"),
  logical("biogas.flare.active", "Flare active", "Факел активен"),
  enu("biogas.state", ["feed", "digest", "store", "generate", "fault"], "Biogas plant state", "Состояние биогаза"),
]);

write("layer-b-geothermal.json", [
  id("geothermal.well.id", "Geothermal well id", "ID геотермальной скважины"),
  id("geothermal.plant.id", "Geothermal plant id", "ID геотермальной станции"),
  q("geothermal.well.temperature", "Cel", "Wellhead temperature", "Температура устья"),
  q("geothermal.well.pressure", "Pa", "Wellhead pressure", "Давление устья"),
  q("geothermal.flow", "kg/s", "Brine mass flow", "Расход рассола"),
  q("geothermal.silica", "mg/L", "Silica concentration", "Концентрация кремнезёма"),
  q("geothermal.power.net", "W", "Net electric power", "Чистая электрическая мощность"),
  enu("geothermal.type", ["flash", "binary", "dry_steam", "enhanced"], "Geothermal type", "Тип геотермальной станции"),
]);

write("layer-b-tidal.json", [
  id("tidal.array.id", "Tidal array id", "ID приливного массива"),
  id("tidal.turbine.id", "Tidal turbine id", "ID приливной турбины"),
  q("tidal.current.speed", "m/s", "Tidal current speed", "Скорость приливного течения"),
  q("tidal.turbine.power", "W", "Turbine power", "Мощность турбины"),
  q("tidal.turbine.rpm", "rpm", "Turbine RPM", "Обороты турбины"),
  q("tidal.water.level", "m", "Tidal water level", "Уровень прилива"),
  logical("tidal.cable.fault", "Export cable fault", "Неисправность кабеля"),
  enu("tidal.state", ["idle", "generating", "feather", "fault", "maintenance"], "Tidal turbine state", "Состояние приливной турбины"),
]);

write("layer-b-pumped_storage.json", [
  id("pumped_storage.plant.id", "Pumped storage plant id", "ID ГАЭС"),
  id("pumped_storage.unit.id", "Pump-turbine unit id", "ID гидроагрегата ГАЭС"),
  q("pumped_storage.upper.level", "m", "Upper reservoir level", "Уровень верхнего бьефа"),
  q("pumped_storage.lower.level", "m", "Lower reservoir level", "Уровень нижнего бьефа"),
  q("pumped_storage.power", "W", "Unit power (+gen/-pump)", "Мощность агрегата"),
  q("pumped_storage.head", "m", "Net head", "Напор"),
  q("pumped_storage.efficiency", "%", "Round-trip efficiency", "КПД цикла", { range: { min: 0, max: 100 } }),
  enu("pumped_storage.mode", ["generate", "pump", "spin", "idle", "fault"], "Pumped storage mode", "Режим ГАЭС"),
]);

write("layer-b-fiber_plant.json", [
  id("fiber_plant.preform.id", "Optical preform id", "ID преформы"),
  id("fiber_plant.draw.id", "Draw tower id", "ID вытяжной башни"),
  q("fiber_plant.draw.speed", "m/min", "Draw speed", "Скорость вытяжки"),
  q("fiber_plant.fiber.diameter", "um", "Fiber diameter", "Диаметр волокна"),
  q("fiber_plant.coating.diameter", "um", "Coating diameter", "Диаметр покрытия"),
  q("fiber_plant.attenuation", "dB/km", "Attenuation", "Затухание"),
  q("fiber_plant.proof.tension", "N", "Proof test tension", "Натяжение proof-теста"),
  logical("fiber_plant.break.detected", "Fiber break detected", "Обрыв волокна"),
  enu("fiber_plant.stage", ["preform", "draw", "coat", "proof", "spool", "test"], "Fiber plant stage", "Стадия производства волокна"),
]);

write("layer-b-ran_5g.json", [
  id("ran_5g.site.id", "5G site id", "ID площадки 5G"),
  id("ran_5g.cell.id", "5G cell id", "ID соты 5G"),
  q("ran_5g.prb.utilization", "%", "PRB utilization", "Загрузка PRB", { range: { min: 0, max: 100 } }),
  q("ran_5g.ue.count", "-", "Connected UE count", "Число UE", { encodings: ["i32"] }),
  q("ran_5g.throughput.dl", "bit/s", "DL throughput", "Пропускная способность DL"),
  q("ran_5g.latency.p95", "ms", "P95 latency", "Задержка P95"),
  q("ran_5g.rsrp", "dBm", "RSRP", "RSRP"),
  q("ran_5g.sinr", "dB", "SINR", "SINR"),
  enu("ran_5g.band", ["n1", "n3", "n28", "n78", "n258", "other"], "5G band", "Диапазон 5G"),
]);

write("layer-b-liquid_cooling.json", [
  id("liquid_cooling.loop.id", "Liquid cooling loop id", "ID контура жидкостного охлаждения"),
  id("liquid_cooling.cdu.id", "CDU id", "ID CDU"),
  q("liquid_cooling.supply.temperature", "Cel", "Coolant supply temp", "Температура подачи хладагента"),
  q("liquid_cooling.return.temperature", "Cel", "Coolant return temp", "Температура обратки хладагента"),
  q("liquid_cooling.flow", "L/min", "Coolant flow", "Расход хладагента"),
  q("liquid_cooling.pressure", "Pa", "Loop pressure", "Давление контура"),
  q("liquid_cooling.pdu.heat_load", "W", "IT heat load", "Тепловыделение ИТ"),
  logical("liquid_cooling.leak.detected", "Coolant leak detected", "Утечка хладагента"),
  enu("liquid_cooling.topology", ["rdhx", "cold_plate", "immersion", "hybrid"], "Cooling topology", "Топология охлаждения"),
]);

write("layer-b-pulp.json", [
  id("pulp.batch.id", "Pulp batch id", "ID партии целлюлозы"),
  id("pulp.digester.id", "Pulp digester id", "ID варочного котла"),
  q("pulp.digester.temperature", "Cel", "Digester temperature", "Температура варки"),
  q("pulp.kappa", "-", "Kappa number", "Число Каппа"),
  q("pulp.stock.freeness", "mL", "CSF freeness", "Степень помола CSF"),
  q("pulp.bleach.cl2_eq", "kg/t", "Chlorine equivalent", "Хлор-эквивалент"),
  q("pulp.stock.consistency", "%", "Pulp consistency", "Концентрация массы", { range: { min: 0, max: 100 } }),
  enu("pulp.process", ["kraft", "sulfite", "mechanical", "recycle", "other"], "Pulp process", "Процесс целлюлозы"),
]);

write("layer-b-float_glass.json", [
  id("float_glass.line.id", "Float glass line id", "ID линии флоат-стекла"),
  q("float_glass.furnace.temperature", "Cel", "Melter temperature", "Температура печи"),
  q("float_glass.tin.bath_temp", "Cel", "Tin bath temperature", "Температура оловянной ванны"),
  q("float_glass.ribbon.thickness", "mm", "Ribbon thickness", "Толщина ленты"),
  q("float_glass.ribbon.width", "m", "Ribbon width", "Ширина ленты"),
  q("float_glass.anneal.lehr_temp", "Cel", "Lehr temperature", "Температура отжига"),
  q("float_glass.defect.count", "-", "Optical defects", "Оптические дефекты", { encodings: ["i32"] }),
  enu("float_glass.grade", ["clear", "tinted", "low_iron", "coated", "other"], "Glass grade", "Марка стекла"),
]);

write("layer-b-foundry.json", [
  id("foundry.heat.id", "Heat / melt id", "ID плавки"),
  id("foundry.mold.id", "Mold id", "ID формы"),
  q("foundry.melt.temperature", "Cel", "Melt temperature", "Температура расплава"),
  q("foundry.pour.temperature", "Cel", "Pour temperature", "Температура заливки"),
  q("foundry.mold.moisture", "%", "Mold sand moisture", "Влажность формы", { range: { min: 0, max: 100 } }),
  q("foundry.casting.weight", "kg", "Casting weight", "Масса отливки"),
  q("foundry.scrap.rate", "%", "Scrap rate", "Доля брака", { range: { min: 0, max: 100 } }),
  logical("foundry.chemistry.ok", "Chemistry in spec", "Химия в допуске"),
  enu("foundry.metal", ["iron", "steel", "aluminum", "bronze", "other"], "Foundry metal", "Металл литья"),
]);

write("layer-b-rolling_mill.json", [
  id("rolling_mill.stand.id", "Rolling stand id", "ID клети"),
  id("rolling_mill.coil.id", "Coil id", "ID рулона"),
  q("rolling_mill.entry.thickness", "mm", "Entry thickness", "Толщина на входе"),
  q("rolling_mill.exit.thickness", "mm", "Exit thickness", "Толщина на выходе"),
  q("rolling_mill.roll.force", "N", "Roll force", "Усилие прокатки"),
  q("rolling_mill.roll.speed", "m/s", "Strip speed", "Скорость полосы"),
  q("rolling_mill.tension", "N", "Strip tension", "Натяжение полосы"),
  q("rolling_mill.temp.strip", "Cel", "Strip temperature", "Температура полосы"),
  enu("rolling_mill.product", ["hot_strip", "cold_strip", "plate", "bar", "wire"], "Mill product", "Продукт прокатки"),
]);

write("layer-b-fertilizer.json", [
  id("fertilizer.plant.id", "Fertilizer plant id", "ID завода удобрений"),
  id("fertilizer.batch.id", "Fertilizer batch id", "ID партии удобрений"),
  q("fertilizer.reactor.temperature", "Cel", "Reactor temperature", "Температура реактора"),
  q("fertilizer.reactor.pressure", "Pa", "Reactor pressure", "Давление реактора"),
  q("fertilizer.nh3.feed", "t/h", "Ammonia feed rate", "Подача аммиака"),
  q("fertilizer.npk.n", "%", "Nitrogen content", "Содержание N", { range: { min: 0, max: 100 } }),
  q("fertilizer.granule.size", "mm", "Granule size", "Размер гранул"),
  q("fertilizer.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  enu("fertilizer.product", ["urea", "an", "npk", "dap", "map", "other"], "Fertilizer product", "Тип удобрения"),
]);

write("layer-b-ambulance.json", [
  id("ambulance.unit.id", "Ambulance unit id", "ID бригады СМП"),
  id("ambulance.incident.id", "Incident id", "ID вызова", { sensitivity: "internal" }),
  q("ambulance.eta.min", "min", "ETA to scene", "ETA на место"),
  q("ambulance.patient.spo2", "%", "Patient SpO2", "SpO₂ пациента", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  q("ambulance.patient.hr", "/min", "Patient heart rate", "ЧСС пациента", { sensitivity: "personal" }),
  q("ambulance.defib.joules", "J", "Defib energy", "Энергия дефибрилляции"),
  logical("ambulance.lights.active", "Emergency lights active", "Проблесковые маячки"),
  enu("ambulance.status", ["available", "dispatched", "on_scene", "transport", "hospital", "out_of_service"], "Ambulance status", "Статус СМП"),
]);

write("layer-b-organ_logistics.json", [
  id("organ_logistics.case.id", "Organ case id", "ID трансплантационного кейса", { sensitivity: "internal" }),
  id("organ_logistics.courier.id", "Courier id", "ID курьера органа"),
  q("organ_logistics.ischemia.min", "min", "Cold ischemia time", "Холодная ишемия"),
  q("organ_logistics.container.temperature", "Cel", "Container temperature", "Температура контейнера"),
  q("organ_logistics.eta.min", "min", "ETA to recipient hospital", "ETA в клинику"),
  logical("organ_logistics.temp.excursion", "Temperature excursion", "Нарушение температуры"),
  media("organ_logistics.chain.ref", "Chain-of-custody ref", "Референс цепочки хранения"),
  enu("organ_logistics.organ", ["kidney", "liver", "heart", "lung", "pancreas", "other"], "Organ type", "Тип органа"),
]);

write("layer-b-vaccine_coldchain.json", [
  id("vaccine_coldchain.shipment.id", "Vaccine shipment id", "ID партии вакцин"),
  id("vaccine_coldchain.logger.id", "Temp logger id", "ID логгера температуры"),
  q("vaccine_coldchain.temperature", "Cel", "Shipment temperature", "Температура перевозки"),
  q("vaccine_coldchain.excursion.min", "min", "Excursion duration", "Длительность экскурсии"),
  q("vaccine_coldchain.doses", "-", "Dose count", "Число доз", { encodings: ["i32"] }),
  logical("vaccine_coldchain.alarm", "Cold-chain alarm", "Авария холодовой цепи"),
  enu("vaccine_coldchain.range", ["frozen", "refrigerated", "ultra_cold", "controlled_room"], "Required temp range", "Требуемый диапазон"),
  enu("vaccine_coldchain.status", ["ok", "warning", "compromised", "quarantine"], "Cold-chain status", "Статус холодовой цепи"),
]);

write("layer-b-neonatal.json", [
  id("neonatal.patient.id", "Neonate patient id", "ID новорождённого", { sensitivity: "personal" }),
  id("neonatal.incubator.id", "Incubator id", "ID инкубатора"),
  q("neonatal.incubator.temperature", "Cel", "Incubator air temp", "Температура инкубатора"),
  q("neonatal.incubator.humidity", "%", "Incubator humidity", "Влажность инкубатора", { range: { min: 0, max: 100 } }),
  q("neonatal.spo2", "%", "Neonate SpO2", "SpO₂ новорождённого", { sensitivity: "personal", range: { min: 0, max: 100 } }),
  q("neonatal.weight", "g", "Neonate weight", "Масса новорождённого", { sensitivity: "personal" }),
  q("neonatal.bilirubin", "mg/dL", "Bilirubin", "Билирубин", { sensitivity: "personal" }),
  logical("neonatal.apnea.event", "Apnea event", "Эпизод апноэ", { sensitivity: "personal" }),
  enu("neonatal.support", ["room_air", "cpap", "ventilator", "ecmo"], "Respiratory support", "Респираторная поддержка"),
]);

write("layer-b-cathlab.json", [
  id("cathlab.case.id", "Cath lab case id", "ID процедуры катетеризации", { sensitivity: "internal" }),
  id("cathlab.room.id", "Cath lab room id", "ID рентгеноперационной"),
  q("cathlab.fluoro.time", "min", "Fluoro time", "Время флюороскопии"),
  q("cathlab.dose.ak", "mGy", "Air kerma", "Воздушная керма"),
  q("cathlab.contrast.volume", "mL", "Contrast volume", "Объём контраста"),
  q("cathlab.heparin.units", "-", "Heparin units", "Единицы гепарина", { encodings: ["i32"] }),
  logical("cathlab.emergency", "Emergency case", "Экстренный случай"),
  enu("cathlab.procedure", ["diag", "pci", "ep", "structural", "peripheral", "other"], "Cath procedure", "Тип процедуры"),
]);

write("layer-b-aed_network.json", [
  id("aed_network.device.id", "AED device id", "ID АВД"),
  id("aed_network.site.id", "AED site id", "ID места установки АВД"),
  logical("aed_network.ready", "AED ready", "АВД готов"),
  logical("aed_network.pads.expired", "Pads expired", "Электроды просрочены"),
  q("aed_network.battery.pct", "%", "AED battery", "Батарея АВД", { range: { min: 0, max: 100 } }),
  q("aed_network.self_test.age_h", "h", "Hours since self-test", "Часы с самотеста"),
  media("aed_network.location.ref", "AED map location ref", "Референс на карте"),
  enu("aed_network.status", ["ready", "needs_service", "in_use", "missing"], "AED status", "Статус АВД"),
]);

write("layer-b-fire_protection.json", [
  id("fire_protection.panel.id", "Fire panel id", "ID пожарной панели"),
  id("fire_protection.zone.id", "Fire zone id", "ID пожарной зоны"),
  logical("fire_protection.alarm.active", "Fire alarm active", "Пожарная тревога"),
  logical("fire_protection.sprinkler.flow", "Sprinkler flow switch", "Спринклерный расход"),
  q("fire_protection.hydrant.pressure", "Pa", "Hydrant pressure", "Давление гидранта"),
  q("fire_protection.pump.pressure", "Pa", "Fire pump pressure", "Давление пожарного насоса"),
  q("fire_protection.smoke.density", "%/m", "Smoke density", "Плотность дыма"),
  enu("fire_protection.state", ["normal", "alarm", "supervisory", "trouble", "test"], "Fire system state", "Состояние ОПС"),
]);

write("layer-b-wildfire.json", [
  id("wildfire.incident.id", "Wildfire incident id", "ID лесного пожара"),
  id("wildfire.sensor.id", "Wildfire sensor id", "ID датчика пожара"),
  q("wildfire.fwi", "-", "Fire weather index", "Индекс пожароопасности"),
  q("wildfire.spread.rate", "m/min", "Spread rate", "Скорость распространения"),
  q("wildfire.area.ha", "ha", "Burned area", "Площадь выгорания"),
  q("wildfire.smoke.pm25", "ug/m3", "Smoke PM2.5", "Дым PM2.5"),
  logical("wildfire.evacuation.order", "Evacuation order active", "Эвакуация объявлена"),
  media("wildfire.hotspot.ref", "Hotspot imagery ref", "Референс горячих точек"),
  enu("wildfire.phase", ["watch", "initial", "extended", "contained", "out"], "Wildfire phase", "Фаза лесного пожара"),
]);

write("layer-b-lightning.json", [
  id("lightning.sensor.id", "Lightning sensor id", "ID датчика молний"),
  q("lightning.strike.count", "-", "Strike count", "Число ударов", { encodings: ["i32"] }),
  q("lightning.distance", "km", "Nearest strike distance", "Дистанция до ближайшего удара"),
  q("lightning.rate", "/min", "Strike rate", "Частота ударов"),
  q("lightning.peak.current", "kA", "Peak current", "Пиковый ток"),
  logical("lightning.warning.active", "Lightning warning active", "Предупреждение о грозе"),
  enu("lightning.density", ["none", "sparse", "moderate", "intense"], "Lightning density", "Плотность молний"),
]);

write("layer-b-stadium.json", [
  id("stadium.id", "Stadium id", "ID стадиона"),
  id("stadium.event.id", "Stadium event id", "ID события"),
  q("stadium.attendance", "-", "Attendance", "Посещаемость", { encodings: ["i32"] }),
  q("stadium.turnstile.rate", "/min", "Turnstile rate", "Проход через турникеты"),
  q("stadium.crowd.density", "/m2", "Crowd density", "Плотность толпы"),
  q("stadium.noise", "dB", "Crowd noise", "Шум трибун"),
  q("stadium.pitch.moisture", "%", "Pitch moisture", "Влажность газона", { range: { min: 0, max: 100 } }),
  logical("stadium.ejection.gate_open", "Ejection gate open", "Эвакуационные ворота открыты"),
  enu("stadium.ops", ["closed", "ingress", "in_play", "halftime", "egress", "clear"], "Stadium ops phase", "Фаза работы стадиона"),
]);

write("layer-b-corrections.json", [
  id("corrections.facility.id", "Correctional facility id", "ID ИУ"),
  id("corrections.wing.id", "Housing wing id", "ID корпуса"),
  q("corrections.population", "-", "Facility population", "Численность", { encodings: ["i32"], sensitivity: "internal" }),
  q("corrections.lock.count", "-", "Active lock count", "Число активных замков", { encodings: ["i32"] }),
  logical("corrections.door.forced", "Forced door alarm", "Взлом двери"),
  logical("corrections.duress.active", "Duress alarm", "Тревога принуждения"),
  q("corrections.radio.channels", "-", "Active radio channels", "Активные радиоканалы", { encodings: ["i16"] }),
  enu("corrections.lockdown", ["normal", "partial", "full", "emergency"], "Lockdown level", "Уровень изоляции"),
]);

write("layer-b-archive_climate.json", [
  id("archive_climate.vault.id", "Archive vault id", "ID хранилища архива"),
  id("archive_climate.logger.id", "Climate logger id", "ID климатического логгера"),
  q("archive_climate.temperature", "Cel", "Vault temperature", "Температура хранилища"),
  q("archive_climate.humidity", "%", "Vault RH", "ОВх хранилища", { range: { min: 0, max: 100 } }),
  q("archive_climate.lux", "lx", "Light level", "Освещённость"),
  q("archive_climate.uv", "uW/cm2", "UV irradiance", "УФ-облучённость"),
  q("archive_climate.pollutant.voc", "ppb", "VOC level", "Уровень ЛОС"),
  logical("archive_climate.excursion", "Climate excursion", "Климатическая экскурсия"),
  enu("archive_climate.collection", ["paper", "film", "textile", "digital_media", "mixed"], "Collection type", "Тип коллекции"),
]);

write("layer-b-library_ops.json", [
  id("library_ops.branch.id", "Library branch id", "ID филиала библиотеки"),
  id("library_ops.item.id", "Catalog item id", "ID единицы хранения"),
  q("library_ops.checkouts", "-", "Active checkouts", "Активные выдачи", { encodings: ["i32"] }),
  q("library_ops.overdue", "-", "Overdue items", "Просроченные", { encodings: ["i32"] }),
  q("library_ops.occupancy", "-", "Public occupancy", "Посещаемость", { encodings: ["i32"] }),
  q("library_ops.rfid.reads", "-", "RFID reads/hour", "RFID-считывания/час", { encodings: ["i32"] }),
  logical("library_ops.security.gate_alarm", "Security gate alarm", "Тревога ворот безопасности"),
  enu("library_ops.item.status", ["available", "loaned", "hold", "repair", "lost", "weeded"], "Item status", "Статус единицы"),
]);

write("layer-b-soil_carbon.json", [
  id("soil_carbon.plot.id", "Soil carbon plot id", "ID участка углерода почвы"),
  id("soil_carbon.sample.id", "Soil sample id", "ID пробы почвы"),
  q("soil_carbon.soc", "%", "Soil organic carbon", "Органический углерод почвы", { range: { min: 0, max: 100 } }),
  q("soil_carbon.bulk.density", "g/cm3", "Bulk density", "Плотность сложения"),
  q("soil_carbon.stock", "t/ha", "Carbon stock", "Запас углерода"),
  q("soil_carbon.n2o.flux", "kg/ha/d", "N2O flux", "Поток N₂O"),
  q("soil_carbon.moisture", "%", "Soil moisture", "Влажность почвы", { range: { min: 0, max: 100 } }),
  media("soil_carbon.lab.ref", "Lab report ref", "Референс лабораторного отчёта"),
  enu("soil_carbon.method", ["dry_combustion", "lois", "mir", "nir", "other"], "SOC method", "Метод SOC"),
]);

write("layer-b-reforestation.json", [
  id("reforestation.project.id", "Reforestation project id", "ID проекта лесовосстановления"),
  id("reforestation.plot.id", "Planting plot id", "ID участка посадки"),
  q("reforestation.seedlings.planted", "-", "Seedlings planted", "Высажено саженцев", { encodings: ["i32"] }),
  q("reforestation.survival", "%", "Survival rate", "Приживаемость", { range: { min: 0, max: 100 } }),
  q("reforestation.canopy.cover", "%", "Canopy cover", "Сомкнутость крон", { range: { min: 0, max: 100 } }),
  q("reforestation.biomass", "t/ha", "Aboveground biomass", "Надземная биомасса"),
  q("reforestation.ndvi", "-", "Plot NDVI", "NDVI участка"),
  enu("reforestation.stage", ["site_prep", "plant", "tend", "monitor", "complete"], "Reforestation stage", "Стадия лесовосстановления"),
]);

write("layer-b-sugar_mill.json", [
  id("sugar_mill.mill.id", "Sugar mill id", "ID сахарного завода"),
  id("sugar_mill.batch.id", "Sugar batch id", "ID партии сахара"),
  q("sugar_mill.cane.pol", "%", "Cane pol", "Поляризация тростника", { range: { min: 0, max: 100 } }),
  q("sugar_mill.juice.brix", "-", "Juice Brix", "Брикс сока"),
  q("sugar_mill.evaporator.temperature", "Cel", "Evaporator temperature", "Температура выпарки"),
  q("sugar_mill.crystal.size", "mm", "Crystal size", "Размер кристаллов"),
  q("sugar_mill.bagasse.moisture", "%", "Bagasse moisture", "Влажность багассы", { range: { min: 0, max: 100 } }),
  enu("sugar_mill.product", ["raw", "refined", "molasses", "ethanol", "other"], "Sugar mill product", "Продукт сахарного завода"),
]);

write("layer-b-lighthouse.json", [
  id("lighthouse.id", "Lighthouse / beacon id", "ID маяка"),
  q("lighthouse.lamp.intensity", "cd", "Lamp intensity", "Сила света"),
  q("lighthouse.rotation.period", "s", "Rotation period", "Период вращения"),
  q("lighthouse.visibility", "NM", "Nominal range", "Дальность видимости"),
  q("lighthouse.battery.soc", "%", "Beacon battery SoC", "SoC батареи маяка", { range: { min: 0, max: 100 } }),
  logical("lighthouse.lamp.on", "Lamp on", "Лампа включена"),
  logical("lighthouse.fault", "Beacon fault", "Неисправность маяка"),
  enu("lighthouse.type", ["lighthouse", "buoy", "racon", "ais_aton", "other"], "AtoN type", "Тип СНО"),
]);

write("layer-b-buoy_net.json", [
  id("buoy_net.buoy.id", "Ocean buoy id", "ID океанографического буя"),
  q("buoy_net.wave.height", "m", "Significant wave height", "Значительная высота волны"),
  q("buoy_net.wave.period", "s", "Wave period", "Период волны"),
  q("buoy_net.sst", "Cel", "Sea surface temperature", "Температура поверхности моря"),
  q("buoy_net.salinity", "PSU", "Salinity", "Солёность"),
  q("buoy_net.current.speed", "m/s", "Surface current", "Поверхностное течение"),
  q("buoy_net.battery.voltage", "V", "Buoy battery voltage", "Напряжение батареи буя"),
  media("buoy_net.telemetry.ref", "Buoy telemetry ref", "Референс телеметрии буя"),
  enu("buoy_net.status", ["online", "delayed", "adrift", "recovered", "lost"], "Buoy status", "Статус буя"),
]);

write("layer-b-gas_detection.json", [
  id("gas_detection.detector.id", "Gas detector id", "ID газоанализатора"),
  id("gas_detection.zone.id", "Detection zone id", "ID зоны детекции"),
  q("gas_detection.lel", "%", "LEL percent", "Доля НКПР", { range: { min: 0, max: 100 } }),
  q("gas_detection.o2", "%", "Oxygen percent", "Доля кислорода", { range: { min: 0, max: 100 } }),
  q("gas_detection.h2s", "ppm", "H2S ppm", "H₂S ppm"),
  q("gas_detection.co", "ppm", "CO ppm", "CO ppm"),
  logical("gas_detection.alarm.high", "High gas alarm", "Высокая газовая тревога"),
  enu("gas_detection.gas", ["ch4", "h2s", "co", "o2", "nh3", "voc", "other"], "Target gas", "Целевой газ"),
]);

write("layer-b-confined_space.json", [
  id("confined_space.permit.id", "Confined space permit id", "ID наряда на замкнутое пространство"),
  id("confined_space.space.id", "Confined space id", "ID замкнутого пространства"),
  q("confined_space.o2", "%", "Entry O2", "O₂ при входе", { range: { min: 0, max: 100 } }),
  q("confined_space.lel", "%", "Entry LEL", "НКПР при входе", { range: { min: 0, max: 100 } }),
  q("confined_space.entrant.count", "-", "Entrants inside", "Число внутри", { encodings: ["i16"] }),
  logical("confined_space.attendant.present", "Attendant present", "Наблюдающий на месте"),
  logical("confined_space.rescue.ready", "Rescue team ready", "Спасательная готовность"),
  enu("confined_space.status", ["closed", "permitted", "occupied", "emergency", "cleared"], "Permit status", "Статус наряда"),
]);

write("layer-b-sterilizer.json", [
  id("sterilizer.device.id", "Sterilizer id", "ID стерилизатора"),
  id("sterilizer.cycle.id", "Sterilizer cycle id", "ID цикла стерилизации"),
  q("sterilizer.chamber.temperature", "Cel", "Chamber temperature", "Температура камеры"),
  q("sterilizer.chamber.pressure", "Pa", "Chamber pressure", "Давление камеры"),
  q("sterilizer.exposure.min", "min", "Exposure time", "Время экспозиции"),
  q("sterilizer.bi.pass", "-", "BI pass (1/0)", "БИ пройден", { encodings: ["u8"] }),
  logical("sterilizer.cycle.pass", "Cycle accepted", "Цикл принят"),
  enu("sterilizer.method", ["steam", "eto", "h2o2", "plasma", "dry_heat", "other"], "Sterilization method", "Метод стерилизации"),
]);

write("layer-b-infusion_pump.json", [
  id("infusion_pump.device.id", "Infusion pump id", "ID инфузомата"),
  id("infusion_pump.order.id", "Infusion order id", "ID назначения", { sensitivity: "internal" }),
  q("infusion_pump.rate", "mL/h", "Infusion rate", "Скорость инфузии", { sensitivity: "personal" }),
  q("infusion_pump.vtbi", "mL", "Volume to be infused", "Объём к введению", { sensitivity: "personal" }),
  q("infusion_pump.infused", "mL", "Volume infused", "Введённый объём", { sensitivity: "personal" }),
  logical("infusion_pump.occlusion", "Occlusion alarm", "Окклюзия"),
  logical("infusion_pump.air_in_line", "Air-in-line alarm", "Воздух в линии"),
  enu("infusion_pump.mode", ["continuous", "bolus", "pca", "taper", "standby"], "Infusion mode", "Режим инфузии"),
]);

write("layer-b-endoscope.json", [
  id("endoscope.device.id", "Endoscope id", "ID эндоскопа"),
  id("endoscope.reprocess.cycle_id", "Reprocessing cycle id", "ID цикла обработки"),
  q("endoscope.leak.test_pressure", "Pa", "Leak test pressure", "Давление теста на герметичность"),
  logical("endoscope.leak.pass", "Leak test pass", "Тест герметичности OK"),
  q("endoscope.wash.temperature", "Cel", "Wash temperature", "Температура мойки"),
  q("endoscope.storage.days", "d", "Days in storage", "Дни хранения"),
  media("endoscope.image.ref", "Procedure image ref", "Референс изображения процедуры"),
  enu("endoscope.status", ["clean", "in_use", "soiled", "reprocessing", "quarantine", "repair"], "Endoscope status", "Статус эндоскопа"),
]);

console.log("Layer B7 seeds written");
