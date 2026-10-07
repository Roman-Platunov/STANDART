#!/usr/bin/env node
/**
 * Layer B22 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B22", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-chp_cogen.json", [
  id("chp_cogen.id", "CHP plant id", "ID ТЭЦ/когенерации"),
  q("chp_cogen.power", "W", "Electrical power", "Электрическая мощность"),
  q("chp_cogen.heat", "W", "Thermal power", "Тепловая мощность"),
  q("chp_cogen.fuel", "t/h", "Fuel rate", "Расход топлива"),
  q("chp_cogen.efficiency", "%", "Overall efficiency", "Общий КПД", { range: { min: 0, max: 100 } }),
  q("chp_cogen.steam.p", "kPa", "Steam pressure", "Давление пара"),
  logical("chp_cogen.island", "Island mode", "Островной режим"),
  enu("chp_cogen.fuel_type", ["gas", "coal", "biomass", "waste", "other"], "Fuel type", "Тип топлива"),
]);

write("layer-b-orc_plant.json", [
  id("orc_plant.id", "ORC plant id", "ID ORC-установки"),
  q("orc_plant.power", "W", "Net power", "Полезная мощность"),
  q("orc_plant.evap.temp", "Cel", "Evaporator temperature", "Температура испарителя"),
  q("orc_plant.cond.temp", "Cel", "Condenser temperature", "Температура конденсатора"),
  q("orc_plant.flow", "kg/h", "Working fluid flow", "Расход рабочего тела"),
  q("orc_plant.efficiency", "%", "Cycle efficiency", "КПД цикла", { range: { min: 0, max: 100 } }),
  logical("orc_plant.leak", "Fluid leak", "Утечка рабочего тела"),
  enu("orc_plant.source", ["geothermal", "waste_heat", "biomass", "solar", "other"], "Heat source", "Источник тепла"),
]);

write("layer-b-ice_bank.json", [
  id("ice_bank.id", "Ice storage bank id", "ID льдоаккумулятора"),
  q("ice_bank.charge", "%", "Ice inventory", "Запас льда", { range: { min: 0, max: 100 } }),
  q("ice_bank.chw.temp", "Cel", "CHW supply temperature", "Температура ХВ"),
  q("ice_bank.power", "W", "Charge/discharge power", "Мощность зарядки/разряда"),
  q("ice_bank.glycol", "%", "Glycol concentration", "Концентрация гликоля", { range: { min: 0, max: 100 } }),
  q("ice_bank.flow", "m3/h", "Loop flow", "Расход контура"),
  logical("ice_bank.melt", "Melt mode", "Режим таяния"),
  enu("ice_bank.mode", ["charge", "discharge", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-aquifer_thermal.json", [
  id("aquifer_thermal.well.id", "ATES well id", "ID скважины АТЭС"),
  q("aquifer_thermal.temp", "Cel", "Aquifer temperature", "Температура водоносного горизонта"),
  q("aquifer_thermal.flow", "m3/h", "Well flow", "Расход скважины"),
  q("aquifer_thermal.pressure", "kPa", "Wellhead pressure", "Давление на устье"),
  q("aquifer_thermal.delta.t", "K", "Delta-T", "Дельта-T"),
  q("aquifer_thermal.energy", "Wh", "Seasonal energy", "Сезонная энергия"),
  logical("aquifer_thermal.clog", "Clogging risk", "Риск кольматации"),
  enu("aquifer_thermal.mode", ["heat", "cool", "idle", "maintain", "fault"], "Mode", "Режим"),
]);

write("layer-b-mrf_optical.json", [
  id("mrf_optical.line.id", "Optical MRF line id", "ID оптической линии MRF"),
  q("mrf_optical.throughput", "t/h", "Throughput", "Производительность"),
  q("mrf_optical.purity", "%", "Product purity", "Чистота продукта", { range: { min: 0, max: 100 } }),
  q("mrf_optical.recovery", "%", "Recovery", "Извлечение", { range: { min: 0, max: 100 } }),
  q("mrf_optical.reject", "%", "Reject rate", "Отсев", { range: { min: 0, max: 100 } }),
  q("mrf_optical.air", "kPa", "Ejector air pressure", "Давление воздуха эжектора"),
  logical("mrf_optical.jam", "Line jam", "Засор"),
  enu("mrf_optical.material", ["pet", "hdpe", "paper", "mixed", "other"], "Target material", "Целевой материал"),
]);

write("layer-b-biogas_upgrade.json", [
  id("biogas_upgrade.id", "Biogas upgrading unit id", "ID установки обогащения биогаза"),
  q("biogas_upgrade.in", "m3/h", "Raw biogas inlet", "Вход сырого биогаза"),
  q("biogas_upgrade.ch4", "%", "Product methane", "Метан в продукте", { range: { min: 0, max: 100 } }),
  q("biogas_upgrade.co2", "%", "Product CO2", "CO2 в продукте", { range: { min: 0, max: 100 } }),
  q("biogas_upgrade.power", "W", "Upgrade power", "Мощность установки"),
  q("biogas_upgrade.recovery", "%", "CH4 recovery", "Извлечение CH4", { range: { min: 0, max: 100 } }),
  logical("biogas_upgrade.grid", "Grid injection ready", "Готово к подаче в сеть"),
  enu("biogas_upgrade.process", ["membrane", "psa", "amine", "water_scrub", "other"], "Process", "Процесс"),
]);

write("layer-b-digestate_dry.json", [
  id("digestate_dry.id", "Digestate dryer id", "ID сушилки дигестата"),
  q("digestate_dry.in.moist", "%", "Inlet moisture", "Влажность на входе", { range: { min: 0, max: 100 } }),
  q("digestate_dry.out.moist", "%", "Outlet moisture", "Влажность на выходе", { range: { min: 0, max: 100 } }),
  q("digestate_dry.temp", "Cel", "Dryer temperature", "Температура сушилки"),
  q("digestate_dry.throughput", "t/h", "Throughput", "Производительность"),
  q("digestate_dry.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("digestate_dry.odor", "Odor alarm", "Тревога запаха"),
  enu("digestate_dry.state", ["dry", "idle", "clean", "fault"], "Dryer state", "Состояние сушилки"),
]);

write("layer-b-rdf_plant.json", [
  id("rdf_plant.id", "RDF plant id", "ID завода RDF"),
  q("rdf_plant.throughput", "t/h", "RDF output", "Выпуск RDF"),
  q("rdf_plant.cv", "MJ/kg", "Calorific value", "Теплотворная способность"),
  q("rdf_plant.moisture", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  q("rdf_plant.chlorine", "%", "Chlorine content", "Содержание хлора", { range: { min: 0, max: 100 } }),
  q("rdf_plant.metal", "%", "Metal residual", "Остаток металла", { range: { min: 0, max: 100 } }),
  logical("rdf_plant.spec.ok", "Spec OK", "Спецификация OK"),
  enu("rdf_plant.grade", ["rdf", "srf", "fluff", "other"], "Grade", "Сорт"),
]);

write("layer-b-syngas_scrub.json", [
  id("syngas_scrub.id", "Syngas scrubber id", "ID скруббера синтез-газа"),
  q("syngas_scrub.in.temp", "Cel", "Inlet temperature", "Температура на входе"),
  q("syngas_scrub.out.temp", "Cel", "Outlet temperature", "Температура на выходе"),
  q("syngas_scrub.tar", "mg/m3", "Tar residual", "Остаток смол"),
  q("syngas_scrub.h2s", "ppm", "H2S residual", "Остаток H2S"),
  q("syngas_scrub.dp", "Pa", "Pressure drop", "Перепад давления"),
  logical("syngas_scrub.flood", "Flooding", "Захлёбывание"),
  enu("syngas_scrub.type", ["wet", "dry", "electrostatic", "other"], "Type", "Тип"),
]);

write("layer-b-blackmass_plant.json", [
  id("blackmass_plant.id", "Black mass plant id", "ID завода чёрной массы"),
  q("blackmass_plant.feed", "t/h", "Battery feed", "Подача АКБ"),
  q("blackmass_plant.output", "t/h", "Black mass output", "Выпуск чёрной массы"),
  q("blackmass_plant.li", "%", "Lithium grade", "Содержание лития", { range: { min: 0, max: 100 } }),
  q("blackmass_plant.ni", "%", "Nickel grade", "Содержание никеля", { range: { min: 0, max: 100 } }),
  q("blackmass_plant.moisture", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  logical("blackmass_plant.thermal", "Thermal event", "Тепловое событие"),
  enu("blackmass_plant.state", ["shred", "separate", "dry", "pack", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-pcb_shred.json", [
  id("pcb_shred.line.id", "PCB shred line id", "ID линии измельчения плат"),
  q("pcb_shred.throughput", "t/h", "Throughput", "Производительность"),
  q("pcb_shred.cu", "%", "Copper recovery", "Извлечение меди", { range: { min: 0, max: 100 } }),
  q("pcb_shred.au", "ppm", "Gold grade", "Содержание золота"),
  q("pcb_shred.dust", "mg/m3", "Dust level", "Пыль"),
  q("pcb_shred.power", "W", "Shredder power", "Мощность шредера"),
  logical("pcb_shred.halogen", "Halogen alert", "Тревога галогенов"),
  enu("pcb_shred.state", ["shred", "sort", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-catalyst_regen.json", [
  id("catalyst_regen.unit.id", "Catalyst regenerator id", "ID регенератора катализатора"),
  q("catalyst_regen.temp", "Cel", "Regen temperature", "Температура регенерации"),
  q("catalyst_regen.carbon", "%", "Carbon on catalyst", "Углерод на катализаторе", { range: { min: 0, max: 100 } }),
  q("catalyst_regen.o2", "%", "Regen O2", "O2 регенерации", { range: { min: 0, max: 100 } }),
  q("catalyst_regen.air", "m3/h", "Air flow", "Расход воздуха"),
  q("catalyst_regen.activity", "%", "Relative activity", "Относительная активность", { range: { min: 0, max: 100 } }),
  logical("catalyst_regen.hotspot", "Hotspot", "Горячая точка"),
  enu("catalyst_regen.state", ["burn", "cool", "idle", "fault"], "Regen state", "Состояние регенерации"),
]);

write("layer-b-plastic_oil.json", [
  id("plastic_oil.reactor.id", "Plastic-to-oil reactor id", "ID реактора пластик→масло"),
  q("plastic_oil.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("plastic_oil.oil", "t/h", "Oil yield", "Выход масла"),
  q("plastic_oil.feed", "t/h", "Plastic feed", "Подача пластика"),
  q("plastic_oil.gas", "m3/h", "Off-gas", "Отходящий газ"),
  q("plastic_oil.char", "t/h", "Char output", "Выход угля"),
  logical("plastic_oil.clog", "Condenser clog", "Засор конденсатора"),
  enu("plastic_oil.state", ["heat", "run", "cool", "idle", "fault"], "Reactor state", "Состояние реактора"),
]);

write("layer-b-chem_depoly.json", [
  id("chem_depoly.plant.id", "Chemical depolymerization plant id", "ID завода деполимеризации"),
  q("chem_depoly.conv", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  q("chem_depoly.monomer", "t/h", "Monomer output", "Выпуск мономера"),
  q("chem_depoly.purity", "%", "Purity", "Чистота", { range: { min: 0, max: 100 } }),
  q("chem_depoly.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("chem_depoly.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("chem_depoly.catalyst.ok", "Catalyst OK", "Катализатор OK"),
  enu("chem_depoly.feedstock", ["pet", "pa", "pu", "mixed", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-cullet_sort.json", [
  id("cullet_sort.plant.id", "Cullet sort plant id", "ID сортировки боя стекла"),
  q("cullet_sort.throughput", "t/h", "Throughput", "Производительность"),
  q("cullet_sort.ceramic", "ppm", "Ceramic contaminants", "Керамика"),
  q("cullet_sort.metal", "ppm", "Metal contaminants", "Металл"),
  q("cullet_sort.size", "mm", "Mean size", "Средний размер"),
  q("cullet_sort.yield", "%", "Color-sort yield", "Выход цветоделения", { range: { min: 0, max: 100 } }),
  logical("cullet_sort.optics.ok", "Optics OK", "Оптика OK"),
  enu("cullet_sort.color", ["flint", "amber", "green", "mixed", "other"], "Color", "Цвет"),
]);

write("layer-b-occ_pulper.json", [
  id("occ_pulper.id", "OCC pulper id", "ID гидроразбивателя OCC"),
  q("occ_pulper.consistency", "%", "Pulp consistency", "Концентрация массы", { range: { min: 0, max: 100 } }),
  q("occ_pulper.power", "W", "Pulper power", "Мощность разбивателя"),
  q("occ_pulper.reject", "%", "Reject", "Отходы", { range: { min: 0, max: 100 } }),
  q("occ_pulper.throughput", "t/h", "Throughput", "Производительность"),
  q("occ_pulper.temp", "Cel", "Stock temperature", "Температура массы"),
  logical("occ_pulper.rope", "Ragger rope pull", "Вытягивание каната"),
  enu("occ_pulper.state", ["pulp", "dump", "idle", "fault"], "Pulper state", "Состояние разбивателя"),
]);

write("layer-b-auto_shredder.json", [
  id("auto_shredder.id", "Auto shredder id", "ID автомобильного шредера"),
  q("auto_shredder.power", "W", "Shredder power", "Мощность шредера"),
  q("auto_shredder.throughput", "t/h", "Throughput", "Производительность"),
  q("auto_shredder.fe", "%", "Ferrous yield", "Выход чёрного", { range: { min: 0, max: 100 } }),
  q("auto_shredder.nf", "%", "Non-ferrous yield", "Выход цветного", { range: { min: 0, max: 100 } }),
  q("auto_shredder.vib", "mm/s", "Vibration", "Вибрация"),
  logical("auto_shredder.explosion", "Explosion risk", "Риск взрыва"),
  enu("auto_shredder.state", ["run", "idle", "maintain", "fault"], "Shredder state", "Состояние шредера"),
]);

write("layer-b-elv_depollute.json", [
  id("elv_depollute.bay.id", "ELV depollution bay id", "ID поста обезвреживания ELV"),
  id("elv_depollute.vin", "Vehicle VIN", "VIN"),
  q("elv_depollute.fluids", "L", "Fluids drained", "Слито жидкостей"),
  q("elv_depollute.parts", "-", "Parts recovered", "Деталей извлечено", { encodings: ["i32"] }),
  q("elv_depollute.cycle.min", "min", "Bay cycle", "Цикл поста"),
  q("elv_depollute.progress", "%", "Depollution progress", "Прогресс обезвреживания", { range: { min: 0, max: 100 } }),
  logical("elv_depollute.airbag.safe", "Airbags safe", "Подушки безопасны"),
  enu("elv_depollute.state", ["intake", "drain", "strip", "done", "fault"], "Bay state", "Состояние поста"),
]);

write("layer-b-ship_break.json", [
  id("ship_break.yard.id", "Ship breaking yard id", "ID верфи разделки"),
  id("ship_break.vessel.id", "Vessel id", "ID судна"),
  q("ship_break.steel", "t/d", "Steel recovery", "Извлечение стали"),
  q("ship_break.hazmat", "t", "Hazmat remaining", "Остаток опасных веществ"),
  q("ship_break.progress", "%", "Cutting progress", "Прогресс резки", { range: { min: 0, max: 100 } }),
  q("ship_break.workers", "-", "Workers onboard", "Работников на борту", { encodings: ["i32"] }),
  logical("ship_break.asbestos", "Asbestos zone", "Зона асбеста"),
  enu("ship_break.state", ["beached", "cut", "clean", "done", "fault"], "Yard state", "Состояние верфи"),
]);

write("layer-b-wheel_lathe.json", [
  id("wheel_lathe.id", "Wheel lathe id", "ID колёсотокарного станка"),
  id("wheel_lathe.axle.id", "Axle id", "ID оси"),
  q("wheel_lathe.diameter", "mm", "Wheel diameter", "Диаметр колеса"),
  q("wheel_lathe.flange", "mm", "Flange height", "Высота гребня"),
  q("wheel_lathe.cut", "mm", "Metal removed", "Снято металла"),
  q("wheel_lathe.ovality", "mm", "Ovality", "Овальность"),
  logical("wheel_lathe.condemn", "Wheel condemned", "Колесо забраковано"),
  enu("wheel_lathe.state", ["measure", "turn", "inspect", "idle", "fault"], "Lathe state", "Состояние станка"),
]);

write("layer-b-rail_hotbox.json", [
  id("rail_hotbox.id", "Wayside hotbox detector id", "ID буксового детектора"),
  id("rail_hotbox.train.id", "Train id", "ID поезда"),
  q("rail_hotbox.bearing.temp", "Cel", "Bearing temperature", "Температура буксы"),
  q("rail_hotbox.wheel.temp", "Cel", "Wheel temperature", "Температура колеса"),
  q("rail_hotbox.axles", "-", "Axles scanned", "Осей просканировано", { encodings: ["i32"] }),
  q("rail_hotbox.alarms", "-", "Alarms", "Тревог", { encodings: ["i32"] }),
  logical("rail_hotbox.alarm", "Hotbox alarm", "Тревога буксы"),
  enu("rail_hotbox.state", ["scan", "alarm", "calibrate", "offline"], "Detector state", "Состояние детектора"),
]);

write("layer-b-pantograph_mon.json", [
  id("pantograph_mon.id", "Pantograph monitor id", "ID монитора пантографа"),
  id("pantograph_mon.vehicle.id", "Vehicle id", "ID ТС"),
  q("pantograph_mon.force", "N", "Contact force", "Прижимное усилие"),
  q("pantograph_mon.height", "mm", "Collector height", "Высота токосъёмника"),
  q("pantograph_mon.arc", "-", "Arcing events", "Дуговых событий", { encodings: ["i32"] }),
  q("pantograph_mon.wear", "mm", "Strip wear", "Износ накладки"),
  logical("pantograph_mon.up", "Raised", "Поднят"),
  enu("pantograph_mon.state", ["up", "down", "fault", "inspect"], "State", "Состояние"),
]);

write("layer-b-thirdrail_heat.json", [
  id("thirdrail_heat.section.id", "Third-rail heater section id", "ID обогрева контактного рельса"),
  q("thirdrail_heat.power", "W", "Heater power", "Мощность обогрева"),
  q("thirdrail_heat.temp", "Cel", "Rail temperature", "Температура рельса"),
  q("thirdrail_heat.ice", "mm", "Ice thickness", "Толщина льда"),
  q("thirdrail_heat.voltage", "V", "Rail voltage", "Напряжение рельса"),
  q("thirdrail_heat.duty", "%", "Duty cycle", "Скважность", { range: { min: 0, max: 100 } }),
  logical("thirdrail_heat.on", "Heater on", "Обогрев включён"),
  enu("thirdrail_heat.state", ["off", "heat", "fault", "isolated"], "Section state", "Состояние участка"),
]);

write("layer-b-ocs_drone.json", [
  id("ocs_drone.id", "OCS inspection drone id", "ID дрона инспекции КС"),
  q("ocs_drone.height", "mm", "Contact wire height", "Высота контактного провода"),
  q("ocs_drone.stagger", "mm", "Stagger", "Зигзаг"),
  q("ocs_drone.wear", "mm2", "Wear area loss", "Износ сечения"),
  q("ocs_drone.km", "km", "Inspected distance", "Обследовано"),
  q("ocs_drone.battery", "%", "Drone battery", "Батарея дрона", { range: { min: 0, max: 100 } }),
  logical("ocs_drone.defect", "Defect found", "Обнаружен дефект"),
  enu("ocs_drone.state", ["fly", "inspect", "land", "fault"], "Drone state", "Состояние дрона"),
]);

write("layer-b-rail_flaw.json", [
  id("rail_flaw.car.id", "Ultrasonic rail flaw car id", "ID дефектоскопного вагона"),
  q("rail_flaw.defects", "-", "Defects found", "Дефектов найдено", { encodings: ["i32"] }),
  q("rail_flaw.speed", "km/h", "Test speed", "Скорость контроля"),
  q("rail_flaw.coverage", "%", "Coverage", "Покрытие", { range: { min: 0, max: 100 } }),
  q("rail_flaw.urgent", "-", "Urgent defects", "Срочных дефектов", { encodings: ["i32"] }),
  q("rail_flaw.km", "km", "Tested km", "Проверено км"),
  logical("rail_flaw.stop", "Stop order issued", "Выдан приказ остановки"),
  enu("rail_flaw.state", ["test", "analyze", "idle", "fault"], "Car state", "Состояние вагона"),
]);

write("layer-b-track_geom_car.json", [
  id("track_geom_car.id", "Track geometry car id", "ID путеизмерительного вагона"),
  q("track_geom_car.gauge", "mm", "Track gauge", "Ширина колеи"),
  q("track_geom_car.cant", "mm", "Cant", "Возвышение"),
  q("track_geom_car.twist", "mm", "Twist", "Перекос"),
  q("track_geom_car.align", "mm", "Alignment error", "Отклонение в плане"),
  q("track_geom_car.level", "mm", "Longitudinal level", "Просадка"),
  logical("track_geom_car.urgent", "Urgent defect", "Срочный дефект"),
  enu("track_geom_car.state", ["measure", "process", "idle", "fault"], "Car state", "Состояние вагона"),
]);

write("layer-b-ballast_tamp.json", [
  id("ballast_tamp.id", "Ballast tamping machine id", "ID выправочно-подбивочной машины"),
  q("ballast_tamp.sleeper", "/h", "Sleepers per hour", "Шпал в час"),
  q("ballast_tamp.lift", "mm", "Lift", "Подъём"),
  q("ballast_tamp.shift", "mm", "Lateral shift", "Сдвиг"),
  q("ballast_tamp.quality", "%", "Compaction quality", "Качество уплотнения", { range: { min: 0, max: 100 } }),
  q("ballast_tamp.speed", "m/h", "Work speed", "Рабочая скорость"),
  logical("ballast_tamp.geo.ok", "Geometry OK", "Геометрия OK"),
  enu("ballast_tamp.state", ["tamp", "measure", "travel", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-rail_grind.json", [
  id("rail_grind.id", "Rail grinding train id", "ID рельсошлифовального поезда"),
  q("rail_grind.pass", "-", "Passes completed", "Проходов", { encodings: ["i32"] }),
  q("rail_grind.metal", "mm3/m", "Metal removed", "Снято металла"),
  q("rail_grind.profile", "%", "Profile match", "Соответствие профиля", { range: { min: 0, max: 100 } }),
  q("rail_grind.speed", "km/h", "Grind speed", "Скорость шлифовки"),
  q("rail_grind.sparks", "-", "Spark intensity", "Интенсивность искр", { encodings: ["i32"] }),
  logical("rail_grind.fire", "Fire watch", "Пожарный пост"),
  enu("rail_grind.state", ["grind", "measure", "travel", "fault"], "Train state", "Состояние поезда"),
]);

write("layer-b-point_heat.json", [
  id("point_heat.id", "Point heater id", "ID обогрева стрелки"),
  id("point_heat.point.id", "Point id", "ID стрелки"),
  q("point_heat.power", "W", "Heater power", "Мощность"),
  q("point_heat.temp", "Cel", "Rail temperature", "Температура рельса"),
  q("point_heat.snow", "mm", "Snow depth", "Глубина снега"),
  q("point_heat.duty", "%", "Duty cycle", "Скважность", { range: { min: 0, max: 100 } }),
  logical("point_heat.on", "Heater on", "Обогрев включён"),
  enu("point_heat.type", ["electric", "gas", "hot_air", "other"], "Type", "Тип"),
]);

write("layer-b-axle_count.json", [
  id("axle_count.head.id", "Axle counter head id", "ID головки счётчика осей"),
  q("axle_count.count", "-", "Axle count", "Число осей", { encodings: ["i32"] }),
  q("axle_count.occupied", "-", "Occupied sections", "Занятых участков", { encodings: ["i32"] }),
  q("axle_count.reset", "-", "Resets today", "Сбросов за сутки", { encodings: ["i32"] }),
  q("axle_count.health", "%", "Head health", "Здоровье головки", { range: { min: 0, max: 100 } }),
  q("axle_count.temp", "Cel", "Head temperature", "Температура головки"),
  logical("axle_count.disturb", "Disturbance", "Помеха"),
  enu("axle_count.state", ["clear", "occupied", "disturbed", "fault"], "Section state", "Состояние участка"),
]);

write("layer-b-signal_cabin.json", [
  id("signal_cabin.id", "Interlocking cabin id", "ID поста ЭЦ"),
  q("signal_cabin.routes", "-", "Routes set", "Установлено маршрутов", { encodings: ["i32"] }),
  q("signal_cabin.points", "-", "Points moved today", "Переводов за сутки", { encodings: ["i32"] }),
  q("signal_cabin.alarms", "-", "Active alarms", "Активных аварий", { encodings: ["i32"] }),
  q("signal_cabin.latency.ms", "ms", "Command latency", "Задержка команды"),
  q("signal_cabin.uptime", "%", "Uptime", "Доступность", { range: { min: 0, max: 100 } }),
  logical("signal_cabin.block", "Block occupied", "Блок занят"),
  enu("signal_cabin.type", ["relay", "electronic", "cbts", "other"], "Type", "Тип"),
]);

write("layer-b-wim_track.json", [
  id("wim_track.id", "Track WIM id", "ID ЖД-весов в движении"),
  id("wim_track.train.id", "Train id", "ID поезда"),
  q("wim_track.axle.load", "t", "Axle load", "Нагрузка на ось"),
  q("wim_track.speed", "km/h", "Speed", "Скорость"),
  q("wim_track.imbalance", "%", "Load imbalance", "Дисбаланс", { range: { min: 0, max: 100 } }),
  q("wim_track.wagons", "-", "Wagons counted", "Вагонов", { encodings: ["i32"] }),
  logical("wim_track.overload", "Overload", "Перегруз"),
  enu("wim_track.state", ["ok", "overload", "calibrate", "fault"], "WIM state", "Состояние весов"),
]);

write("layer-b-level_xing.json", [
  id("level_xing.id", "Level crossing id", "ID переезда"),
  q("level_xing.activations", "-", "Activations today", "Срабатываний за сутки", { encodings: ["i32"] }),
  q("level_xing.barrier.s", "s", "Barrier close time", "Время закрытия"),
  q("level_xing.obstacle", "-", "Obstacle detections", "Обнаружений препятствий", { encodings: ["i32"] }),
  q("level_xing.power", "V", "Supply voltage", "Напряжение питания"),
  q("level_xing.uptime", "%", "Uptime", "Доступность", { range: { min: 0, max: 100 } }),
  logical("level_xing.closed", "Barriers closed", "Шлагбаумы закрыты"),
  enu("level_xing.state", ["open", "warning", "closed", "fault"], "Crossing state", "Состояние переезда"),
]);

write("layer-b-psd_gate.json", [
  id("psd_gate.id", "Platform screen door id", "ID платформенных дверей"),
  id("psd_gate.station.id", "Station id", "ID станции"),
  q("psd_gate.cycles", "-", "Open cycles today", "Циклов за сутки", { encodings: ["i32"] }),
  q("psd_gate.open.s", "s", "Open duration", "Длительность открытия"),
  q("psd_gate.align", "mm", "Train alignment error", "Ошибка выравнивания"),
  q("psd_gate.faults", "-", "Faults today", "Отказов за сутки", { encodings: ["i32"] }),
  logical("psd_gate.locked", "Doors locked", "Двери заблокированы"),
  enu("psd_gate.state", ["closed", "open", "inhibited", "fault"], "Door state", "Состояние дверей"),
]);

write("layer-b-esc_bank.json", [
  id("esc_bank.id", "Escalator bank id", "ID группы эскалаторов"),
  q("esc_bank.speed", "m/s", "Belt speed", "Скорость ленты"),
  q("esc_bank.passengers", "/h", "Passengers per hour", "Пассажиров в час"),
  q("esc_bank.motor.temp", "Cel", "Motor temperature", "Температура двигателя"),
  q("esc_bank.brake.wear", "%", "Brake wear", "Износ тормоза", { range: { min: 0, max: 100 } }),
  q("esc_bank.energy", "Wh", "Energy today", "Энергия за сутки"),
  logical("esc_bank.emergency", "Emergency stop", "Аварийный стоп"),
  enu("esc_bank.state", ["up", "down", "stop", "maintain", "fault"], "Bank state", "Состояние группы"),
]);

write("layer-b-people_apm.json", [
  id("people_apm.id", "APM vehicle id", "ID APM"),
  q("people_apm.speed", "km/h", "Speed", "Скорость"),
  q("people_apm.headway.s", "s", "Headway", "Интервал"),
  q("people_apm.riders", "-", "Riders onboard", "Пассажиров на борту", { encodings: ["i32"] }),
  q("people_apm.soc", "%", "Battery SOC", "SOC", { range: { min: 0, max: 100 } }),
  q("people_apm.dwell.s", "s", "Dwell time", "Стоянка"),
  logical("people_apm.auto", "Automatic mode", "Авторежим"),
  enu("people_apm.state", ["run", "dwell", "hold", "fault", "offline"], "Vehicle state", "Состояние ТС"),
]);

write("layer-b-bhs_divert.json", [
  id("bhs_divert.id", "BHS diverter id", "ID стрелки BHS"),
  q("bhs_divert.rate", "/h", "Bags per hour", "Мест в час"),
  q("bhs_divert.misread", "%", "Tag misread", "Ошибки считывания", { range: { min: 0, max: 100 } }),
  q("bhs_divert.jam", "-", "Jams today", "Заторов за сутки", { encodings: ["i32"] }),
  q("bhs_divert.early", "-", "Early bags", "Раннего багажа", { encodings: ["i32"] }),
  q("bhs_divert.late", "-", "Late bags", "Позднего багажа", { encodings: ["i32"] }),
  logical("bhs_divert.alarm", "Divert alarm", "Тревога стрелки"),
  enu("bhs_divert.state", ["run", "peak", "maintain", "fault"], "Diverter state", "Состояние стрелки"),
]);

write("layer-b-uld_build.json", [
  id("uld_build.id", "ULD build station id", "ID станции сборки ULD"),
  id("uld_build.uld.id", "ULD id", "ID ULD"),
  q("uld_build.weight", "kg", "ULD weight", "Масса ULD"),
  q("uld_build.volume", "m3", "Volume used", "Занятый объём"),
  q("uld_build.temp", "Cel", "Cargo temperature", "Температура груза"),
  q("uld_build.build.min", "min", "Build time", "Время сборки"),
  logical("uld_build.dg", "Dangerous goods", "Опасный груз"),
  enu("uld_build.type", ["ake", "pmc", "pla", "other"], "ULD type", "Тип ULD"),
]);

write("layer-b-gpu_400hz.json", [
  id("gpu_400hz.id", "400 Hz GPU id", "ID GPU 400 Гц"),
  id("gpu_400hz.stand.id", "Stand id", "ID стоянки"),
  q("gpu_400hz.power", "W", "Output power", "Выходная мощность"),
  q("gpu_400hz.voltage", "V", "Output voltage", "Выходное напряжение"),
  q("gpu_400hz.freq", "Hz", "Frequency", "Частота"),
  q("gpu_400hz.fuel", "L/h", "Fuel rate", "Расход топлива"),
  logical("gpu_400hz.connected", "Connected", "Подключено"),
  enu("gpu_400hz.state", ["idle", "supply", "fault", "offline"], "GPU state", "Состояние GPU"),
]);

write("layer-b-precond_air.json", [
  id("precond_air.id", "PCA unit id", "ID PCA"),
  id("precond_air.stand.id", "Stand id", "ID стоянки"),
  q("precond_air.supply.temp", "Cel", "Supply air temperature", "Температура притока"),
  q("precond_air.flow", "m3/h", "Airflow", "Расход воздуха"),
  q("precond_air.power", "W", "Electrical power", "Электрическая мощность"),
  q("precond_air.hose.temp", "Cel", "Hose temperature", "Температура рукава"),
  logical("precond_air.connected", "Connected", "Подключено"),
  enu("precond_air.state", ["idle", "cool", "heat", "fault"], "PCA state", "Состояние PCA"),
]);

write("layer-b-jetway_bridge.json", [
  id("jetway_bridge.id", "Passenger boarding bridge id", "ID телетрапа"),
  id("jetway_bridge.stand.id", "Stand id", "ID стоянки"),
  q("jetway_bridge.extension", "m", "Extension", "Выдвижение"),
  q("jetway_bridge.height", "m", "Cabin height", "Высота кабины"),
  q("jetway_bridge.angle", "deg", "Rotation angle", "Угол поворота"),
  q("jetway_bridge.cycles", "-", "Dock cycles today", "Стыковок за сутки", { encodings: ["i32"] }),
  logical("jetway_bridge.docked", "Docked", "Состыкован"),
  enu("jetway_bridge.state", ["stowed", "approach", "docked", "fault"], "Bridge state", "Состояние телетрапа"),
]);

write("layer-b-deice_boom.json", [
  id("deice_boom.id", "De-icing boom id", "ID стрелы антиобледенения"),
  id("deice_boom.flight.id", "Flight id", "ID рейса"),
  q("deice_boom.fluid", "L", "Fluid used", "Израсходовано жидкости"),
  q("deice_boom.duration.min", "min", "Duration", "Длительность"),
  q("deice_boom.temp", "Cel", "OAT", "Температура наружного воздуха"),
  q("deice_boom.holdover.min", "min", "Holdover time", "Время удержания"),
  logical("deice_boom.active", "Treatment active", "Обработка идёт"),
  enu("deice_boom.fluid_type", ["type_i", "type_ii", "type_iv", "other"], "Fluid type", "Тип жидкости"),
]);

write("layer-b-fbo_fuel.json", [
  id("fbo_fuel.id", "FBO fuel desk id", "ID топливного стола FBO"),
  q("fbo_fuel.dispensed", "L", "Fuel dispensed today", "Авиатоплива за сутки"),
  q("fbo_fuel.movements", "-", "Aircraft movements", "Движений ВС", { encodings: ["i32"] }),
  q("fbo_fuel.hangar.occ", "%", "Hangar occupancy", "Занятость ангара", { range: { min: 0, max: 100 } }),
  q("fbo_fuel.wait.min", "min", "Avg service wait", "Среднее ожидание"),
  q("fbo_fuel.trucks", "-", "Fuel trucks active", "Активных топливозаправщиков", { encodings: ["i32"] }),
  logical("fbo_fuel.night", "Night ops", "Ночные операции"),
  enu("fbo_fuel.state", ["open", "busy", "closed", "weather"], "Desk state", "Состояние стола"),
]);

write("layer-b-hangar_bay.json", [
  id("hangar_bay.door.id", "Hangar bay door id", "ID ворот ангара"),
  q("hangar_bay.open", "%", "Open percent", "Процент открытия", { range: { min: 0, max: 100 } }),
  q("hangar_bay.wind", "m/s", "Wind at door", "Ветер у ворот"),
  q("hangar_bay.motor.current", "A", "Motor current", "Ток двигателя"),
  q("hangar_bay.cycles", "-", "Cycles today", "Циклов за сутки", { encodings: ["i32"] }),
  q("hangar_bay.temp", "Cel", "Hangar temperature", "Температура ангара"),
  logical("hangar_bay.interlock", "Interlock OK", "Блокировка OK"),
  enu("hangar_bay.state", ["closed", "opening", "open", "closing", "fault"], "Door state", "Состояние ворот"),
]);

write("layer-b-runway_mu.json", [
  id("runway_mu.id", "Runway friction survey id", "ID замера сцепления ВПП"),
  id("runway_mu.runway.id", "Runway id", "ID ВПП"),
  q("runway_mu.mu", "-", "Friction coefficient", "Коэффициент сцепления"),
  q("runway_mu.depth", "mm", "Contaminant depth", "Глубина загрязнения"),
  q("runway_mu.temp", "Cel", "Surface temperature", "Температура покрытия"),
  q("runway_mu.speed", "km/h", "Survey speed", "Скорость замера"),
  logical("runway_mu.poor", "Poor friction", "Плохое сцепление"),
  enu("runway_mu.contaminant", ["dry", "wet", "snow", "ice", "slush", "other"], "Contaminant", "Загрязнение"),
]);

write("layer-b-asrs_freeze.json", [
  id("asrs_freeze.aisle.id", "Frozen ASRS aisle id", "ID прохода морозильного АСК"),
  q("asrs_freeze.temp", "Cel", "Aisle temperature", "Температура прохода"),
  q("asrs_freeze.moves", "/h", "Moves per hour", "Перемещений в час"),
  q("asrs_freeze.occupancy", "%", "Occupancy", "Занятость", { range: { min: 0, max: 100 } }),
  q("asrs_freeze.defrost", "%", "Defrost progress", "Прогресс оттайки", { range: { min: 0, max: 100 } }),
  q("asrs_freeze.door.open.s", "s", "Door open time", "Время открытия двери"),
  logical("asrs_freeze.frost", "Frost buildup", "Накопление инея"),
  enu("asrs_freeze.state", ["store", "retrieve", "defrost", "idle", "fault"], "Aisle state", "Состояние прохода"),
]);

write("layer-b-spiral_freeze.json", [
  id("spiral_freeze.id", "Spiral freezer id", "ID спирального морозильника"),
  id("spiral_freeze.batch.id", "Batch id", "ID партии"),
  q("spiral_freeze.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("spiral_freeze.core.temp", "Cel", "Product core temperature", "Температура в центре"),
  q("spiral_freeze.time.min", "min", "Residence time", "Время пребывания"),
  q("spiral_freeze.air", "m/s", "Air velocity", "Скорость воздуха"),
  logical("spiral_freeze.done", "Cycle complete", "Цикл завершён"),
  enu("spiral_freeze.state", ["load", "freeze", "hold", "unload", "fault"], "Freezer state", "Состояние морозильника"),
]);

write("layer-b-iqf_belt.json", [
  id("iqf_belt.id", "IQF belt freezer id", "ID ленточного IQF"),
  q("iqf_belt.temp", "Cel", "Tunnel temperature", "Температура тоннеля"),
  q("iqf_belt.belt", "m/min", "Belt speed", "Скорость ленты"),
  q("iqf_belt.throughput", "t/h", "Throughput", "Производительность"),
  q("iqf_belt.core.temp", "Cel", "Exit core temperature", "Температура в центре на выходе"),
  q("iqf_belt.fan", "%", "Fan speed", "Скорость вентиляторов", { range: { min: 0, max: 100 } }),
  logical("iqf_belt.frost", "Belt frost", "Иней на ленте"),
  enu("iqf_belt.state", ["run", "defrost", "clean", "idle", "fault"], "Belt state", "Состояние ленты"),
]);

write("layer-b-smoke_cook.json", [
  id("smoke_cook.id", "Smoke cook chamber id", "ID коптильно-варочной камеры"),
  id("smoke_cook.batch.id", "Batch id", "ID партии"),
  q("smoke_cook.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("smoke_cook.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("smoke_cook.smoke", "%", "Smoke density", "Плотность дыма", { range: { min: 0, max: 100 } }),
  q("smoke_cook.core.temp", "Cel", "Product core temperature", "Температура в центре"),
  logical("smoke_cook.done", "Cook complete", "Варка завершена"),
  enu("smoke_cook.phase", ["dry", "smoke", "cook", "cool", "fault"], "Phase", "Фаза"),
]);

write("layer-b-retort_batch.json", [
  id("retort_batch.id", "Batch retort id", "ID периодического автоклава"),
  id("retort_batch.batch.id", "Batch id", "ID партии"),
  q("retort_batch.temp", "Cel", "Retort temperature", "Температура автоклава"),
  q("retort_batch.pressure", "kPa", "Retort pressure", "Давление"),
  q("retort_batch.f0", "min", "F0 value", "Значение F0"),
  q("retort_batch.come.up.min", "min", "Come-up time", "Время выхода на режим"),
  logical("retort_batch.lethality.ok", "Lethality met", "Летальность достигнута"),
  enu("retort_batch.state", ["come_up", "hold", "cool", "idle", "fault"], "Retort state", "Состояние автоклава"),
]);

write("layer-b-uht_sterile.json", [
  id("uht_sterile.id", "UHT sterilizer id", "ID стерилизатора UHT"),
  q("uht_sterile.temp", "Cel", "Sterilization temperature", "Температура стерилизации"),
  q("uht_sterile.hold.s", "s", "Hold time", "Время выдержки"),
  q("uht_sterile.flow", "L/h", "Product flow", "Расход продукта"),
  q("uht_sterile.homogen", "kPa", "Homogenizer pressure", "Давление гомогенизатора"),
  q("uht_sterile.aseptic", "%", "Aseptic integrity", "Асептическая целостность", { range: { min: 0, max: 100 } }),
  logical("uht_sterile.sterile", "Sterile barrier OK", "Стерильный барьер OK"),
  enu("uht_sterile.state", ["sterilize", "product", "cip", "idle", "fault"], "Sterilizer state", "Состояние стерилизатора"),
]);

write("layer-b-aseptic_pack.json", [
  id("aseptic_pack.line.id", "Aseptic pack line id", "ID асептической линии"),
  q("aseptic_pack.speed", "/h", "Packages per hour", "Упаковок в час"),
  q("aseptic_pack.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("aseptic_pack.h2o2", "ppm", "H2O2 residual", "Остаток H2O2"),
  q("aseptic_pack.temp", "Cel", "Product temperature", "Температура продукта"),
  q("aseptic_pack.volume", "mL", "Fill volume", "Объём наполнения"),
  logical("aseptic_pack.breach", "Sterility breach", "Нарушение стерильности"),
  enu("aseptic_pack.state", ["sterile", "fill", "cip", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-map_seal.json", [
  id("map_seal.line.id", "MAP seal line id", "ID линии МАП"),
  q("map_seal.o2", "%", "Headspace O2", "O2 в газовой среде", { range: { min: 0, max: 100 } }),
  q("map_seal.co2", "%", "Headspace CO2", "CO2 в газовой среде", { range: { min: 0, max: 100 } }),
  q("map_seal.seal", "%", "Seal integrity", "Целостность шва", { range: { min: 0, max: 100 } }),
  q("map_seal.speed", "/h", "Packs per hour", "Упаковок в час"),
  q("map_seal.gas", "L/h", "Gas mix use", "Расход газовой смеси"),
  logical("map_seal.leak", "Leak detected", "Обнаружена утечка"),
  enu("map_seal.state", ["form", "fill", "seal", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-vacuum_seal.json", [
  id("vacuum_seal.machine.id", "Vacuum sealer id", "ID вакуумного запайщика"),
  q("vacuum_seal.vacuum", "Pa", "Chamber vacuum", "Вакуум камеры"),
  q("vacuum_seal.seal.temp", "Cel", "Seal temperature", "Температура сварки"),
  q("vacuum_seal.cycle.s", "s", "Cycle time", "Время цикла"),
  q("vacuum_seal.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("vacuum_seal.throughput", "/h", "Packs per hour", "Упаковок в час"),
  logical("vacuum_seal.seal.ok", "Seal OK", "Шов OK"),
  enu("vacuum_seal.state", ["load", "vacuum", "seal", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-shrink_oven.json", [
  id("shrink_oven.id", "Shrink oven id", "ID термоусадочной печи"),
  q("shrink_oven.temp", "Cel", "Oven temperature", "Температура печи"),
  q("shrink_oven.belt", "m/min", "Belt speed", "Скорость ленты"),
  q("shrink_oven.throughput", "/h", "Units per hour", "Единиц в час"),
  q("shrink_oven.energy", "Wh", "Energy per unit", "Энергия на единицу"),
  q("shrink_oven.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("shrink_oven.jam", "Film jam", "Замятие плёнки"),
  enu("shrink_oven.state", ["run", "idle", "clean", "fault"], "Oven state", "Состояние печи"),
]);

write("layer-b-case_erect.json", [
  id("case_erect.id", "Case erector id", "ID формирователя коробов"),
  q("case_erect.speed", "/h", "Cases per hour", "Коробов в час"),
  q("case_erect.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("case_erect.glue", "kg/h", "Glue use", "Расход клея"),
  q("case_erect.pattern", "-", "Pack pattern id", "ID схемы", { encodings: ["i32"] }),
  q("case_erect.uptime", "%", "Uptime", "Готовность", { range: { min: 0, max: 100 } }),
  logical("case_erect.jam", "Jam", "Затор"),
  enu("case_erect.state", ["erect", "load", "seal", "idle", "fault"], "Erector state", "Состояние формирователя"),
]);

write("layer-b-robot_pallet.json", [
  id("robot_pallet.id", "Robotic palletizer id", "ID роботизированного паллетайзера"),
  q("robot_pallet.layers", "/h", "Layers per hour", "Слоёв в час"),
  q("robot_pallet.pallets", "/h", "Pallets per hour", "Паллет в час"),
  q("robot_pallet.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("robot_pallet.pattern", "-", "Layer pattern", "Схема слоя", { encodings: ["i32"] }),
  q("robot_pallet.uptime", "%", "Uptime", "Готовность", { range: { min: 0, max: 100 } }),
  logical("robot_pallet.full", "Pallet complete", "Паллета готова"),
  enu("robot_pallet.type", ["articulated", "gantry", "hybrid", "other"], "Type", "Тип"),
]);

write("layer-b-pallet_wrap.json", [
  id("pallet_wrap.id", "Pallet wrapper id", "ID обмотчика паллет"),
  q("pallet_wrap.turns", "-", "Wrap turns", "Витков", { encodings: ["i32"] }),
  q("pallet_wrap.film", "m", "Film used", "Израсходовано плёнки"),
  q("pallet_wrap.force", "%", "Pre-stretch", "Предрастяжение", { range: { min: 0, max: 100 } }),
  q("pallet_wrap.cycle.s", "s", "Cycle time", "Время цикла"),
  q("pallet_wrap.throughput", "/h", "Pallets per hour", "Паллет в час"),
  logical("pallet_wrap.film.break", "Film break", "Обрыв плёнки"),
  enu("pallet_wrap.state", ["wrap", "cut", "idle", "fault"], "Wrapper state", "Состояние обмотчика"),
]);

write("layer-b-catenary_car.json", [
  id("catenary_car.id", "Catenary inspection car id", "ID вагона диагностики КС"),
  q("catenary_car.height", "mm", "Contact height", "Высота контакта"),
  q("catenary_car.stagger", "mm", "Stagger", "Зигзаг"),
  q("catenary_car.wear", "mm2", "Wear", "Износ"),
  q("catenary_car.force", "N", "Contact force", "Прижимное усилие"),
  q("catenary_car.km", "km", "Inspected km", "Обследовано км"),
  logical("catenary_car.defect", "Defect found", "Обнаружен дефект"),
  enu("catenary_car.state", ["run", "analyze", "idle", "fault"], "Car state", "Состояние вагона"),
]);

write("layer-b-tamping_unit.json", [
  id("tamping_unit.id", "Tamping unit id", "ID подбивочного блока"),
  q("tamping_unit.sleeper", "/h", "Sleepers per hour", "Шпал в час"),
  q("tamping_unit.lift", "mm", "Lift", "Подъём"),
  q("tamping_unit.shift", "mm", "Lateral shift", "Сдвиг"),
  q("tamping_unit.quality", "%", "Quality", "Качество", { range: { min: 0, max: 100 } }),
  q("tamping_unit.speed", "m/h", "Work speed", "Рабочая скорость"),
  logical("tamping_unit.geo.ok", "Geometry OK", "Геометрия OK"),
  enu("tamping_unit.state", ["tamp", "measure", "travel", "fault"], "Unit state", "Состояние блока"),
]);

console.log("Layer B22 seeds written");
