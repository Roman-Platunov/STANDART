#!/usr/bin/env node
/**
 * Layer B13 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B13", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-blast_furnace.json", [
  id("blast_furnace.id", "Blast furnace id", "ID доменной печи"),
  q("blast_furnace.hot_blast.temp", "Cel", "Hot blast temperature", "Температура горячего дутья"),
  q("blast_furnace.hot_blast.pressure", "Pa", "Hot blast pressure", "Давление горячего дутья"),
  q("blast_furnace.top.pressure", "Pa", "Top gas pressure", "Давление колошникового газа"),
  q("blast_furnace.production", "t/d", "Hot metal production", "Выплавка чугуна"),
  q("blast_furnace.coke.rate", "kg/t", "Coke rate", "Расход кокса"),
  logical("blast_furnace.hanging", "Burden hanging", "Зависание шихты"),
  enu("blast_furnace.state", ["bank", "blow", "full", "tap", "stop", "fault"], "Furnace state", "Состояние доменной печи"),
]);

write("layer-b-eaf_steel.json", [
  id("eaf_steel.furnace.id", "EAF id", "ID ДСП"),
  id("eaf_steel.heat.id", "Heat id", "ID плавки ДСП"),
  q("eaf_steel.power", "W", "Arc power", "Мощность дуги"),
  q("eaf_steel.tap.temp", "Cel", "Tap temperature", "Температура выпуска"),
  q("eaf_steel.energy.kwh_t", "kWh/t", "Energy per tonne", "Энергоёмкость"),
  q("eaf_steel.scrap.charge", "t", "Scrap charge", "Завалка лома"),
  logical("eaf_steel.foaming", "Foamy slag", "Пенный шлак"),
  enu("eaf_steel.state", ["charge", "melt", "refine", "tap", "delay", "fault"], "EAF state", "Состояние ДСП"),
]);

write("layer-b-caster_steel.json", [
  id("caster_steel.strand.id", "Caster strand id", "ID ручья МНЛЗ"),
  id("caster_steel.heat.id", "Casting heat id", "ID разливаемой плавки"),
  q("caster_steel.cast.speed", "m/min", "Casting speed", "Скорость разливки"),
  q("caster_steel.mold.level", "%", "Mold level", "Уровень в кристаллизаторе", { range: { min: 0, max: 100 } }),
  q("caster_steel.superheat", "K", "Steel superheat", "Перегрев стали"),
  q("caster_steel.breakout.risk", "%", "Breakout risk", "Риск прорыва", { range: { min: 0, max: 100 } }),
  logical("caster_steel.breakout", "Breakout alarm", "Прорыв"),
  enu("caster_steel.state", ["prep", "start", "steady", "slow", "stop", "fault"], "Caster state", "Состояние МНЛЗ"),
]);

write("layer-b-coke_oven.json", [
  id("coke_oven.battery.id", "Coke battery id", "ID коксовой батареи"),
  id("coke_oven.oven.id", "Coke oven id", "ID коксовой печи"),
  q("coke_oven.flue.temp", "Cel", "Flue temperature", "Температура обогрева"),
  q("coke_oven.coking.h", "h", "Coking time", "Время коксования"),
  q("coke_oven.gas.flow", "m3/h", "Coke oven gas flow", "Расход коксового газа"),
  q("coke_oven.push.force", "kN", "Pushing force", "Усилие выдачи"),
  logical("coke_oven.door.leak", "Door leak", "Утечка из двери"),
  enu("coke_oven.state", ["charge", "coke", "ready", "push", "idle", "repair"], "Oven state", "Состояние печи"),
]);

write("layer-b-sinter_plant.json", [
  id("sinter_plant.machine.id", "Sinter machine id", "ID агломашины"),
  q("sinter_plant.strand.speed", "m/min", "Strand speed", "Скорость ленты"),
  q("sinter_plant.bed.height", "mm", "Bed height", "Высота слоя"),
  q("sinter_plant.ignition.temp", "Cel", "Ignition temperature", "Температура зажигания"),
  q("sinter_plant.bpt", "m", "Burn-through point", "Точка догорания"),
  q("sinter_plant.production", "t/h", "Sinter production", "Выпуск агломерата"),
  q("sinter_plant.return.fines", "%", "Return fines", "Возврат мелочи", { range: { min: 0, max: 100 } }),
  enu("sinter_plant.state", ["start", "run", "slow", "stop", "fault"], "Sinter state", "Состояние агломерации"),
]);

write("layer-b-galvanizing.json", [
  id("galvanizing.line.id", "Galvanizing line id", "ID линии цинкования"),
  id("galvanizing.coil.id", "Coil id", "ID рулона"),
  q("galvanizing.pot.temp", "Cel", "Zinc pot temperature", "Температура цинковой ванны"),
  q("galvanizing.coating.mass", "g/m2", "Coating mass", "Масса покрытия"),
  q("galvanizing.line.speed", "m/min", "Line speed", "Скорость линии"),
  q("galvanizing.spangle.size", "mm", "Spangle size", "Размер кристалла"),
  logical("galvanizing.uncoated", "Bare spot detected", "Непокрытие"),
  enu("galvanizing.product", ["gi", "ga", "gl", "znmg", "other"], "Product type", "Тип покрытия"),
]);

write("layer-b-forging.json", [
  id("forging.press.id", "Forge press id", "ID ковочного пресса"),
  id("forging.die.id", "Forge die id", "ID штампа"),
  q("forging.force", "kN", "Press force", "Усилие пресса"),
  q("forging.billet.temp", "Cel", "Billet temperature", "Температура заготовки"),
  q("forging.stroke", "-", "Stroke count", "Число ходов", { encodings: ["i32"] }),
  q("forging.energy", "J", "Blow energy", "Энергия удара"),
  logical("forging.die.crack", "Die crack", "Трещина штампа"),
  enu("forging.process", ["open", "closed", "upset", "roll", "other"], "Forge process", "Процесс ковки"),
]);

write("layer-b-stamping_press.json", [
  id("stamping_press.id", "Stamping press id", "ID штамповочного пресса"),
  id("stamping_press.die.id", "Stamping die id", "ID штампа"),
  q("stamping_press.spm", "/min", "Strokes per minute", "Ходов в минуту"),
  q("stamping_press.force", "kN", "Press force", "Усилие пресса"),
  q("stamping_press.tonnage.pct", "%", "Tonnage utilization", "Использование тоннажа", { range: { min: 0, max: 100 } }),
  q("stamping_press.scrap.rate", "%", "Scrap rate", "Доля брака", { range: { min: 0, max: 100 } }),
  logical("stamping_press.misfeed", "Misfeed", "Перекос подачи"),
  enu("stamping_press.state", ["idle", "single", "continuous", "jog", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-body_shop.json", [
  id("body_shop.cell.id", "Body shop cell id", "ID ячейки кузовного цеха"),
  id("body_shop.vin.id", "Body VIN / job id", "ID кузова"),
  q("body_shop.spot.welds", "-", "Spot welds completed", "Точечных сварных точек", { encodings: ["i32"] }),
  q("body_shop.cycle.s", "s", "Cell cycle time", "Цикл ячейки"),
  q("body_shop.ftt", "%", "First-time-through", "С первого раза", { range: { min: 0, max: 100 } }),
  q("body_shop.robots.online", "-", "Robots online", "Роботов online", { encodings: ["i16"] }),
  logical("body_shop.andons", "Andon in cell", "Андон в ячейке"),
  enu("body_shop.state", ["run", "starved", "blocked", "fault", "changeover"], "Cell state", "Состояние ячейки"),
]);

write("layer-b-paint_shop.json", [
  id("paint_shop.booth.id", "Paint shop booth id", "ID камеры окраски"),
  id("paint_shop.body.id", "Body id", "ID кузова в окраске"),
  q("paint_shop.booth.temp", "Cel", "Booth temperature", "Температура камеры"),
  q("paint_shop.booth.humidity", "%", "Booth humidity", "Влажность камеры", { range: { min: 0, max: 100 } }),
  q("paint_shop.film.build", "um", "Film build", "Толщина покрытия"),
  q("paint_shop.dirt.count", "-", "Dirt defects", "Дефекты грязи", { encodings: ["i32"] }),
  logical("paint_shop.oven.ok", "Oven in spec", "Сушка в допуске"),
  enu("paint_shop.stage", ["pretreat", "e_coat", "primer", "base", "clear", "inspect"], "Paint stage", "Стадия окраски"),
]);

write("layer-b-engine_dyno.json", [
  id("engine_dyno.stand.id", "Engine dyno stand id", "ID моторного стенда"),
  id("engine_dyno.uut.id", "Engine under test id", "ID испытываемого двигателя"),
  q("engine_dyno.torque", "N.m", "Measured torque", "Измеренный момент"),
  q("engine_dyno.speed", "rpm", "Engine speed", "Обороты двигателя"),
  q("engine_dyno.power", "W", "Measured power", "Измеренная мощность"),
  q("engine_dyno.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  logical("engine_dyno.interlock", "Safety interlock", "Блокировка безопасности"),
  enu("engine_dyno.mode", ["steady", "sweep", "map", "endurance", "abort"], "Dyno mode", "Режим стенда"),
]);

write("layer-b-wind_tunnel.json", [
  id("wind_tunnel.id", "Wind tunnel id", "ID аэродинамической трубы"),
  id("wind_tunnel.run.id", "Tunnel run id", "ID прогона"),
  q("wind_tunnel.airspeed", "m/s", "Airspeed", "Скорость потока"),
  q("wind_tunnel.q", "Pa", "Dynamic pressure", "Скоростной напор"),
  q("wind_tunnel.re", "-", "Reynolds number", "Число Рейнольдса"),
  q("wind_tunnel.aoa", "deg", "Angle of attack", "Угол атаки"),
  logical("wind_tunnel.model.secure", "Model secured", "Модель закреплена"),
  enu("wind_tunnel.type", ["subsonic", "transonic", "supersonic", "climatic", "other"], "Tunnel type", "Тип трубы"),
]);

write("layer-b-emc_chamber.json", [
  id("emc_chamber.id", "EMC chamber id", "ID ЭМС-камеры"),
  id("emc_chamber.test.id", "EMC test id", "ID испытания ЭМС"),
  q("emc_chamber.field", "V/m", "Field strength", "Напряжённость поля"),
  q("emc_chamber.freq", "Hz", "Test frequency", "Частота испытания"),
  q("emc_chamber.margin.db", "dB", "Margin", "Запас"),
  logical("emc_chamber.door.closed", "Chamber door closed", "Дверь камеры закрыта"),
  enu("emc_chamber.test.type", ["radiated_em", "radiated_im", "conducted", "esd", "surge", "other"], "Test type", "Тип испытания"),
  enu("emc_chamber.result", ["pass", "fail", "abort", "incomplete"], "Test result", "Результат испытания"),
]);

write("layer-b-climate_chamber.json", [
  id("climate_chamber.id", "Climate chamber id", "ID климатической камеры"),
  id("climate_chamber.profile.id", "Profile id", "ID профиля"),
  q("climate_chamber.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("climate_chamber.humidity", "%", "Chamber humidity", "Влажность камеры", { range: { min: 0, max: 100 } }),
  q("climate_chamber.ramp.K_min", "K/min", "Temp ramp", "Скорость изменения температуры"),
  q("climate_chamber.step", "-", "Profile step", "Шаг профиля", { encodings: ["i16"] }),
  logical("climate_chamber.in_spec", "In specification", "В спецификации"),
  enu("climate_chamber.state", ["idle", "ramp", "soak", "complete", "fault"], "Chamber state", "Состояние камеры"),
]);

write("layer-b-lims.json", [
  id("lims.sample.id", "LIMS sample id", "ID пробы LIMS"),
  id("lims.test.id", "LIMS test id", "ID испытания LIMS"),
  q("lims.tat.h", "h", "Turnaround time", "Время выполнения"),
  q("lims.backlog", "-", "Open tests", "Открытых испытаний", { encodings: ["i32"] }),
  logical("lims.qc.fail", "QC fail", "QC не пройден"),
  logical("lims.released", "Result released", "Результат выдан"),
  enu("lims.test.status", ["received", "prep", "run", "review", "released", "cancelled"], "Test status", "Статус испытания"),
  enu("lims.priority", ["routine", "urgent", "stat", "research"], "Priority", "Приоритет"),
]);

write("layer-b-eln.json", [
  id("eln.notebook.id", "ELN notebook id", "ID электронного журнала"),
  id("eln.experiment.id", "Experiment id", "ID эксперимента"),
  q("eln.entries", "-", "Entry count", "Число записей", { encodings: ["i32"] }),
  q("eln.attachments", "-", "Attachments", "Вложений", { encodings: ["i32"] }),
  logical("eln.signed", "Experiment signed", "Эксперимент подписан"),
  logical("eln.witnessed", "Witnessed", "Засвидетельствован"),
  media("eln.page.ref", "ELN page ref", "Референс страницы ELN"),
  enu("eln.status", ["draft", "in_progress", "review", "signed", "archived"], "Experiment status", "Статус эксперимента"),
]);

write("layer-b-freeze_dryer.json", [
  id("freeze_dryer.id", "Freeze dryer id", "ID лиофилизатора"),
  id("freeze_dryer.batch.id", "Lyophilization batch id", "ID партии сушки"),
  q("freeze_dryer.shelf.temp", "Cel", "Shelf temperature", "Температура полки"),
  q("freeze_dryer.product.temp", "Cel", "Product temperature", "Температура продукта"),
  q("freeze_dryer.chamber.pressure", "Pa", "Chamber pressure", "Давление камеры"),
  q("freeze_dryer.residual.moisture", "%", "Residual moisture", "Остаточная влажность", { range: { min: 0, max: 100 } }),
  logical("freeze_dryer.collapse", "Collapse detected", "Коллапс структуры"),
  enu("freeze_dryer.step", ["freeze", "primary", "secondary", "stopper", "unload", "fault"], "Cycle step", "Шаг цикла"),
]);

write("layer-b-centrifuge_lab.json", [
  id("centrifuge_lab.id", "Lab centrifuge id", "ID лабораторной центрифуги"),
  id("centrifuge_lab.run.id", "Centrifuge run id", "ID прогона"),
  q("centrifuge_lab.rpm", "rpm", "Rotor speed", "Обороты ротора"),
  q("centrifuge_lab.rcf", "-", "Relative centrifugal force", "Относительное ускорение"),
  q("centrifuge_lab.temp", "Cel", "Bowl temperature", "Температура камеры"),
  q("centrifuge_lab.time.s", "s", "Run time", "Время прогона"),
  logical("centrifuge_lab.imbalance", "Imbalance", "Дисбаланс"),
  enu("centrifuge_lab.state", ["idle", "accel", "run", "brake", "fault"], "Centrifuge state", "Состояние центрифуги"),
]);

write("layer-b-chromatography.json", [
  id("chromatography.system.id", "Chromatography system id", "ID хроматографа"),
  id("chromatography.run.id", "Chromatography run id", "ID прогона"),
  q("chromatography.flow", "mL/min", "Mobile phase flow", "Расход элюента"),
  q("chromatography.pressure", "Pa", "System pressure", "Давление системы"),
  q("chromatography.column.temp", "Cel", "Column temperature", "Температура колонки"),
  q("chromatography.rt.min", "min", "Retention time", "Время удерживания"),
  logical("chromatography.leak", "System leak", "Утечка системы"),
  enu("chromatography.mode", ["hplc", "uhplc", "gc", "ic", "prep", "other"], "Technique", "Метод"),
]);

write("layer-b-mass_spec.json", [
  id("mass_spec.instrument.id", "Mass spectrometer id", "ID масс-спектрометра"),
  id("mass_spec.run.id", "MS run id", "ID прогона МС"),
  q("mass_spec.vacuum", "Pa", "Analyzer vacuum", "Вакуум анализатора"),
  q("mass_spec.tune.score", "%", "Tune score", "Оценка настройки", { range: { min: 0, max: 100 } }),
  q("mass_spec.injection", "-", "Injections today", "Инжекций сегодня", { encodings: ["i32"] }),
  q("mass_spec.capillary.temp", "Cel", "Capillary temperature", "Температура капилляра"),
  logical("mass_spec.lockmass.ok", "Lock mass OK", "Lock mass OK"),
  enu("mass_spec.state", ["standby", "ready", "acquire", "tune", "fault"], "MS state", "Состояние МС"),
]);

write("layer-b-nmr_lab.json", [
  id("nmr_lab.magnet.id", "NMR magnet id", "ID магнита ЯМР"),
  id("nmr_lab.sample.id", "NMR sample id", "ID образца ЯМР"),
  q("nmr_lab.field.mhz", "MHz", "Proton frequency", "Протонная частота"),
  q("nmr_lab.shim.quality", "-", "Shim quality", "Качество шиммирования"),
  q("nmr_lab.spin.hz", "Hz", "Spin rate", "Скорость вращения"),
  q("nmr_lab.helium.level", "%", "Helium level", "Уровень гелия", { range: { min: 0, max: 100 } }),
  logical("nmr_lab.lock", "Field lock on", "Лок поля"),
  enu("nmr_lab.state", ["idle", "lock", "shim", "acquire", "cryo_fill", "fault"], "NMR state", "Состояние ЯМР"),
]);

write("layer-b-vivarium.json", [
  id("vivarium.room.id", "Vivarium room id", "ID комнаты вивария"),
  id("vivarium.rack.id", "Cage rack id", "ID стеллажа клеток"),
  q("vivarium.temp", "Cel", "Room temperature", "Температура комнаты"),
  q("vivarium.humidity", "%", "Room humidity", "Влажность комнаты", { range: { min: 0, max: 100 } }),
  q("vivarium.ach", "/h", "Air changes per hour", "Кратность воздухообмена"),
  q("vivarium.light.lux", "lx", "Light level", "Освещённость"),
  logical("vivarium.pressure.pos", "Positive pressure", "Положительное давление"),
  enu("vivarium.barrier", ["conventional", "spf", "isolator", "quarantine"], "Barrier level", "Уровень барьера"),
]);

write("layer-b-seed_bank.json", [
  id("seed_bank.accession.id", "Seed accession id", "ID образца семян"),
  id("seed_bank.vault.id", "Seed vault id", "ID хранилища семян"),
  q("seed_bank.temp", "Cel", "Storage temperature", "Температура хранения"),
  q("seed_bank.moisture", "%", "Seed moisture", "Влажность семян", { range: { min: 0, max: 100 } }),
  q("seed_bank.viability", "%", "Germination / viability", "Всхожесть", { range: { min: 0, max: 100 } }),
  q("seed_bank.packets", "-", "Packet count", "Число пакетов", { encodings: ["i32"] }),
  logical("seed_bank.regen.due", "Regeneration due", "Требуется регенерация"),
  enu("seed_bank.status", ["active", "base", "safety", "distributed", "lost"], "Accession status", "Статус образца"),
]);

write("layer-b-phenotyping.json", [
  id("phenotyping.plot.id", "Phenotyping plot id", "ID делянки фенотипирования"),
  id("phenotyping.platform.id", "Phenotyping platform id", "ID платформы фенотипирования"),
  q("phenotyping.height", "cm", "Plant height", "Высота растения"),
  q("phenotyping.ndvi", "-", "Plot NDVI", "NDVI делянки"),
  q("phenotyping.lai", "-", "Leaf area index", "Индекс листовой поверхности"),
  q("phenotyping.biomass.est", "t/ha", "Biomass estimate", "Оценка биомассы"),
  media("phenotyping.image.ref", "Plot image ref", "Референс снимка делянки"),
  enu("phenotyping.stage", ["veg", "flower", "grain", "mature", "senesced"], "Growth stage", "Фаза развития"),
]);

write("layer-b-planter.json", [
  id("planter.machine.id", "Planter id", "ID сеялки"),
  id("planter.field.id", "Field id", "ID поля"),
  q("planter.rate.seeds", "/ha", "Seeding rate", "Норма высева"),
  q("planter.depth", "mm", "Planting depth", "Глубина заделки"),
  q("planter.singulation", "%", "Singulation", "Сингуляция", { range: { min: 0, max: 100 } }),
  q("planter.skips", "%", "Skip rate", "Доля пропусков", { range: { min: 0, max: 100 } }),
  logical("planter.section.off", "Section control off", "Секция выключена"),
  enu("planter.state", ["transport", "plant", "turn", "fill", "fault"], "Planter state", "Состояние сеялки"),
]);

write("layer-b-combine.json", [
  id("combine.machine.id", "Combine harvester id", "ID комбайна"),
  id("combine.field.id", "Harvest field id", "ID убираемого поля"),
  q("combine.yield", "t/ha", "Instant yield", "Мгновенная урожайность"),
  q("combine.moisture", "%", "Grain moisture", "Влажность зерна", { range: { min: 0, max: 100 } }),
  q("combine.loss", "%", "Grain loss", "Потери зерна", { range: { min: 0, max: 100 } }),
  q("combine.throughput", "t/h", "Throughput", "Производительность"),
  logical("combine.header.down", "Header down", "Жатка опущена"),
  enu("combine.state", ["idle", "harvest", "unload", "transport", "fault"], "Combine state", "Состояние комбайна"),
]);

write("layer-b-center_pivot.json", [
  id("center_pivot.id", "Center pivot id", "ID круговой дождевальной машины"),
  id("center_pivot.field.id", "Irrigated field id", "ID орошаемого поля"),
  q("center_pivot.flow", "m3/h", "Pivot flow", "Расход машины"),
  q("center_pivot.pressure", "Pa", "System pressure", "Давление системы"),
  q("center_pivot.speed", "%", "Travel speed", "Скорость движения", { range: { min: 0, max: 100 } }),
  q("center_pivot.depth.mm", "mm", "Applied depth", "Поливная норма"),
  logical("center_pivot.end_gun", "End gun on", "Концевое орудие включено"),
  enu("center_pivot.state", ["off", "forward", "reverse", "dry", "fault"], "Pivot state", "Состояние машины"),
]);

write("layer-b-milking_robot.json", [
  id("milking_robot.id", "Milking robot id", "ID доильного робота"),
  id("milking_robot.cow.id", "Cow id", "ID коровы"),
  q("milking_robot.yield.kg", "kg", "Milk yield", "Надой"),
  q("milking_robot.flow", "kg/min", "Milk flow", "Скорость молокоотдачи"),
  q("milking_robot.conductivity", "mS/cm", "Milk conductivity", "Электропроводность молока"),
  q("milking_robot.visits.day", "-", "Visits today", "Визитов сегодня", { encodings: ["i16"] }),
  logical("milking_robot.kickoff", "Teat cup kick-off", "Сброс стакана"),
  enu("milking_robot.state", ["idle", "attach", "milk", "post", "wash", "fault"], "Robot state", "Состояние робота"),
]);

write("layer-b-manure_lagoon.json", [
  id("manure_lagoon.id", "Manure lagoon id", "ID навозохранилища"),
  q("manure_lagoon.level", "%", "Lagoon level", "Уровень лагуны", { range: { min: 0, max: 100 } }),
  q("manure_lagoon.crust", "-", "Crust index", "Индекс корки", { range: { min: 0, max: 100 } }),
  q("manure_lagoon.nh3", "ppm", "Ammonia", "Аммиак"),
  q("manure_lagoon.h2s", "ppm", "Hydrogen sulfide", "Сероводород"),
  q("manure_lagoon.temp", "Cel", "Lagoon temperature", "Температура лагуны"),
  logical("manure_lagoon.overflow.risk", "Overflow risk", "Риск переполнения"),
  enu("manure_lagoon.state", ["ok", "agitate", "pump", "full", "ice"], "Lagoon state", "Состояние лагуны"),
]);

write("layer-b-fishing_vessel.json", [
  id("fishing_vessel.id", "Fishing vessel id", "ID рыболовного судна"),
  id("fishing_vessel.trip.id", "Fishing trip id", "ID рейса"),
  q("fishing_vessel.catch.kg", "kg", "Catch mass", "Масса улова"),
  q("fishing_vessel.hold.temp", "Cel", "Hold temperature", "Температура трюма"),
  q("fishing_vessel.gear.depth", "m", "Gear depth", "Глубина орудия"),
  q("fishing_vessel.effort.h", "h", "Fishing effort hours", "Часы промысла"),
  logical("fishing_vessel.vms.on", "VMS reporting", "VMS передаёт"),
  enu("fishing_vessel.gear", ["trawl", "purse", "longline", "pot", "gillnet", "other"], "Gear type", "Тип орудия"),
]);

write("layer-b-ballast_water.json", [
  id("ballast_water.system.id", "BWTS id", "ID системы балластных вод"),
  id("ballast_water.tank.id", "Ballast tank id", "ID балластной цистерны"),
  q("ballast_water.flow", "m3/h", "Ballast flow", "Расход балласта"),
  q("ballast_water.tro", "mg/L", "Total residual oxidant", "Остаточный окислитель"),
  q("ballast_water.uv.dose", "mJ/cm2", "UV dose", "Доза УФ"),
  q("ballast_water.salinity", "PSU", "Salinity", "Солёность"),
  logical("ballast_water.compliant", "Discharge compliant", "Сброс соответствует"),
  enu("ballast_water.mode", ["uptake", "treat", "hold", "discharge", "bypass", "fault"], "BWTS mode", "Режим СОВБ"),
]);

write("layer-b-scrubber_marine.json", [
  id("scrubber_marine.id", "Marine scrubber id", "ID судового скруббера"),
  q("scrubber_marine.so2.co2", "-", "SO2/CO2 ratio", "Отношение SO₂/CO₂"),
  q("scrubber_marine.washwater.ph", "-", "Washwater pH", "pH промывной воды"),
  q("scrubber_marine.pah", "ug/L", "PAH in washwater", "ПАУ в промывной воде"),
  q("scrubber_marine.turbidity", "NTU", "Washwater turbidity", "Мутность промывной воды"),
  q("scrubber_marine.delta_p", "Pa", "Scrubber dP", "Перепад на скруббере"),
  logical("scrubber_marine.overboard", "Overboard discharge", "Сброс за борт"),
  enu("scrubber_marine.mode", ["open", "closed", "hybrid", "bypass", "fault"], "Scrubber mode", "Режим скруббера"),
]);

write("layer-b-cruise_ops.json", [
  id("cruise_ops.ship.id", "Cruise ship id", "ID круизного судна"),
  id("cruise_ops.voyage.id", "Voyage id", "ID рейса"),
  q("cruise_ops.pax.onboard", "-", "Passengers onboard", "Пассажиров на борту", { encodings: ["i32"] }),
  q("cruise_ops.crew.onboard", "-", "Crew onboard", "Экипажа на борту", { encodings: ["i32"] }),
  q("cruise_ops.occupancy", "%", "Cabin occupancy", "Заполненность кают", { range: { min: 0, max: 100 } }),
  q("cruise_ops.waste.m3", "m3", "Waste generated", "Образовано отходов"),
  logical("cruise_ops.tender.active", "Tender operations", "Работают тендеры"),
  enu("cruise_ops.phase", ["sea", "port", "embark", "debark", "drydock"], "Voyage phase", "Фаза рейса"),
]);

write("layer-b-fpso.json", [
  id("fpso.id", "FPSO id", "ID FPSO"),
  id("fpso.train.id", "Process train id", "ID технологической линии"),
  q("fpso.oil.rate", "t/d", "Oil production", "Добыча нефти"),
  q("fpso.gas.rate", "m3/h", "Gas production", "Добыча газа"),
  q("fpso.water.cut", "%", "Water cut", "Обводнённость", { range: { min: 0, max: 100 } }),
  q("fpso.turret.heading", "deg", "Turret / heading", "Курс / турель"),
  logical("fpso.offload.active", "Offloading", "Отгрузка"),
  enu("fpso.state", ["produce", "inject", "offload", "weather_hold", "shutdown", "fault"], "FPSO state", "Состояние FPSO"),
]);

write("layer-b-dac.json", [
  id("dac.unit.id", "Direct air capture unit id", "ID установки DAC"),
  id("dac.plant.id", "DAC plant id", "ID завода DAC"),
  q("dac.air.flow", "m3/h", "Process air flow", "Расход воздуха"),
  q("dac.co2.rate", "t/d", "CO2 capture rate", "Скорость улавливания CO₂"),
  q("dac.energy.kwh_t", "kWh/t", "Energy per tonne", "Энергоёмкость"),
  q("dac.sorbent.cycle", "-", "Sorbent cycle count", "Циклов сорбента", { encodings: ["i32"] }),
  q("dac.purity", "%", "Product purity", "Чистота продукта", { range: { min: 0, max: 100 } }),
  enu("dac.tech", ["solid", "liquid", "hybrid", "other"], "DAC technology", "Технология DAC"),
]);

write("layer-b-biochar.json", [
  id("biochar.kiln.id", "Biochar kiln id", "ID печи биоугля"),
  id("biochar.batch.id", "Biochar batch id", "ID партии биоугля"),
  q("biochar.temp", "Cel", "Pyrolysis temperature", "Температура пиролиза"),
  q("biochar.residence.min", "min", "Residence time", "Время пребывания"),
  q("biochar.yield", "%", "Char yield", "Выход угля", { range: { min: 0, max: 100 } }),
  q("biochar.h_c", "-", "H/C ratio", "Отношение H/C"),
  q("biochar.feed.moisture", "%", "Feed moisture", "Влажность сырья", { range: { min: 0, max: 100 } }),
  enu("biochar.process", ["slow", "fast", "gasification", "hydrothermal"], "Process type", "Тип процесса"),
]);

write("layer-b-composting.json", [
  id("composting.pile.id", "Compost pile id", "ID бурта компоста"),
  id("composting.site.id", "Compost site id", "ID площадки компостирования"),
  q("composting.temp.core", "Cel", "Core temperature", "Температура ядра"),
  q("composting.moisture", "%", "Pile moisture", "Влажность бурта", { range: { min: 0, max: 100 } }),
  q("composting.o2", "%", "Oxygen in pile", "Кислород в бурте", { range: { min: 0, max: 100 } }),
  q("composting.turn.count", "-", "Turn count", "Число ворошений", { encodings: ["i16"] }),
  logical("composting.mature", "Mature compost", "Компост созрел"),
  enu("composting.stage", ["mix", "thermophilic", "curing", "screen", "ready"], "Compost stage", "Стадия компоста"),
]);

write("layer-b-plastic_recycle.json", [
  id("plastic_recycle.line.id", "Plastic recycle line id", "ID линии переработки пластика"),
  id("plastic_recycle.bale.id", "Bale id", "ID кипы"),
  q("plastic_recycle.throughput", "t/h", "Throughput", "Производительность"),
  q("plastic_recycle.flake.moisture", "%", "Flake moisture", "Влажность флекса", { range: { min: 0, max: 100 } }),
  q("plastic_recycle.contamination", "%", "Contamination", "Засор", { range: { min: 0, max: 100 } }),
  q("plastic_recycle.iv", "-", "Intrinsic viscosity", "Характеристическая вязкость"),
  logical("plastic_recycle.food_grade", "Food-grade stream", "Пищевой поток"),
  enu("plastic_recycle.polymer", ["pet", "hdpe", "pp", "ldpe", "ps", "mixed"], "Polymer", "Полимер"),
]);

write("layer-b-paper_recycle.json", [
  id("paper_recycle.mill.id", "Paper recycle mill id", "ID картонно-бумажного завода"),
  id("paper_recycle.pulper.id", "Pulper id", "ID гидроразбивателя"),
  q("paper_recycle.consistency", "%", "Stock consistency", "Концентрация массы", { range: { min: 0, max: 100 } }),
  q("paper_recycle.ash", "%", "Ash content", "Зольность", { range: { min: 0, max: 100 } }),
  q("paper_recycle.stickies", "-", "Stickies index", "Индекс стики"),
  q("paper_recycle.yield", "%", "Fiber yield", "Выход волокна", { range: { min: 0, max: 100 } }),
  q("paper_recycle.brightness", "%", "Brightness", "Белизна", { range: { min: 0, max: 100 } }),
  enu("paper_recycle.grade", ["occ", "mixed", "onp", "sop", "other"], "Furnish grade", "Марка макулатуры"),
]);

write("layer-b-dma_water.json", [
  id("dma_water.id", "District metered area id", "ID зоны учёта воды"),
  id("dma_water.meter.id", "DMA meter id", "ID счётчика зоны"),
  q("dma_water.inflow", "m3/h", "DMA inflow", "Приток в зону"),
  q("dma_water.night.flow", "m3/h", "Minimum night flow", "Минимальный ночной расход"),
  q("dma_water.pressure", "Pa", "Average pressure", "Среднее давление"),
  q("dma_water.nrw", "%", "Non-revenue water", "Неучтенная вода", { range: { min: 0, max: 100 } }),
  logical("dma_water.burst", "Burst suspected", "Подозрение на порыв"),
  enu("dma_water.status", ["stable", "leak_watch", "burst", "isolation", "unknown"], "DMA status", "Статус зоны"),
]);

write("layer-b-hydrant_net.json", [
  id("hydrant_net.hydrant.id", "Fire hydrant id", "ID пожарного гидранта"),
  id("hydrant_net.zone.id", "Hydrant zone id", "ID зоны гидрантов"),
  q("hydrant_net.static.pressure", "Pa", "Static pressure", "Статическое давление"),
  q("hydrant_net.residual.pressure", "Pa", "Residual pressure", "Остаточное давление"),
  q("hydrant_net.flow", "L/s", "Available flow", "Доступный расход"),
  q("hydrant_net.inspect.age_d", "d", "Days since inspection", "Дней с осмотра"),
  logical("hydrant_net.out_of_service", "Out of service", "Выведен из эксплуатации"),
  enu("hydrant_net.status", ["in_service", "oos", "frozen", "damaged", "unknown"], "Hydrant status", "Статус гидранта"),
]);

write("layer-b-water_tower.json", [
  id("water_tower.id", "Water tower id", "ID водонапорной башни"),
  q("water_tower.level", "%", "Tank level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("water_tower.level.m", "m", "Water elevation", "Отметка воды"),
  q("water_tower.inflow", "m3/h", "Inflow", "Приток"),
  q("water_tower.outflow", "m3/h", "Outflow", "Отток"),
  q("water_tower.chlorine", "mg/L", "Residual chlorine", "Остаточный хлор"),
  logical("water_tower.overflow", "Overflow", "Перелив"),
  enu("water_tower.state", ["fill", "hold", "draw", "offline", "fault"], "Tower state", "Состояние башни"),
]);

write("layer-b-chp_plant.json", [
  id("chp_plant.id", "CHP plant id", "ID ТЭЦ / когенерации"),
  id("chp_plant.unit.id", "CHP unit id", "ID агрегата когенерации"),
  q("chp_plant.power.e", "W", "Electric power", "Электрическая мощность"),
  q("chp_plant.power.th", "W", "Thermal power", "Тепловая мощность"),
  q("chp_plant.efficiency", "%", "Overall efficiency", "Общий КПД", { range: { min: 0, max: 100 } }),
  q("chp_plant.heat.export", "W", "Exported heat", "Отпускаемое тепло"),
  logical("chp_plant.island", "Island mode", "Островной режим"),
  enu("chp_plant.mode", ["heat_led", "power_led", "follow", "island", "fault"], "CHP mode", "Режим когенерации"),
]);

write("layer-b-fuel_cell.json", [
  id("fuel_cell.stack.id", "Fuel cell stack id", "ID стека ТЭ"),
  id("fuel_cell.system.id", "Fuel cell system id", "ID системы ТЭ"),
  q("fuel_cell.power", "W", "Stack power", "Мощность стека"),
  q("fuel_cell.voltage", "V", "Stack voltage", "Напряжение стека"),
  q("fuel_cell.current", "A", "Stack current", "Ток стека"),
  q("fuel_cell.temp", "Cel", "Stack temperature", "Температура стека"),
  q("fuel_cell.h2.util", "%", "Hydrogen utilization", "Использование водорода", { range: { min: 0, max: 100 } }),
  enu("fuel_cell.type", ["pem", "sofc", "pafe", "mcfc", "other"], "Fuel cell type", "Тип ТЭ"),
]);

write("layer-b-asu_gas.json", [
  id("asu_gas.plant.id", "Air separation plant id", "ID ВРУ"),
  id("asu_gas.column.id", "ASU column id", "ID колонны ВРУ"),
  q("asu_gas.air.flow", "m3/h", "Feed air flow", "Расход воздуха"),
  q("asu_gas.o2.purity", "%", "Oxygen purity", "Чистота кислорода", { range: { min: 0, max: 100 } }),
  q("asu_gas.n2.purity", "%", "Nitrogen purity", "Чистота азота", { range: { min: 0, max: 100 } }),
  q("asu_gas.coldbox.temp", "Cel", "Cold box temperature", "Температура холодного блока"),
  q("asu_gas.power", "W", "Plant power", "Мощность установки"),
  enu("asu_gas.product", ["o2", "n2", "ar", "liquid", "mixed"], "Primary product", "Основной продукт"),
]);

write("layer-b-ln2_tank.json", [
  id("ln2_tank.id", "LN2 tank id", "ID ёмкости жидкого азота"),
  q("ln2_tank.level", "%", "LN2 level", "Уровень LN₂", { range: { min: 0, max: 100 } }),
  q("ln2_tank.pressure", "Pa", "Tank pressure", "Давление ёмкости"),
  q("ln2_tank.loss.rate", "%/d", "Boil-off rate", "Скорость испарения"),
  q("ln2_tank.temp", "Cel", "Inner vessel temperature", "Температура внутреннего сосуда"),
  logical("ln2_tank.low", "Low level alarm", "Низкий уровень"),
  logical("ln2_tank.relief", "Relief valve open", "ПК открыт"),
  enu("ln2_tank.state", ["ok", "fill", "low", "vent", "fault"], "Tank state", "Состояние ёмкости"),
]);

write("layer-b-corrugator.json", [
  id("corrugator.line.id", "Corrugator line id", "ID гофроагрегата"),
  id("corrugator.order.id", "Corrugator order id", "ID заказа гофры"),
  q("corrugator.speed", "m/min", "Web speed", "Скорость полотна"),
  q("corrugator.steam.pressure", "Pa", "Steam pressure", "Давление пара"),
  q("corrugator.glue.gap", "mm", "Glue gap", "Зазор клея"),
  q("corrugator.caliper", "mm", "Board caliper", "Толщина картона"),
  q("corrugator.waste", "%", "Trim waste", "Отходы обрезки", { range: { min: 0, max: 100 } }),
  enu("corrugator.flute", ["a", "b", "c", "e", "bc", "other"], "Flute type", "Тип гофра"),
]);

write("layer-b-bottling_line.json", [
  id("bottling_line.id", "Bottling line id", "ID линии розлива"),
  id("bottling_line.sku.id", "Bottled SKU id", "ID разливаемого SKU"),
  q("bottling_line.speed", "/h", "Bottles per hour", "Бутылок в час"),
  q("bottling_line.fill.volume", "mL", "Fill volume", "Объём наполнения"),
  q("bottling_line.reject.rate", "%", "Reject rate", "Доля брака", { range: { min: 0, max: 100 } }),
  q("bottling_line.cip.age_h", "h", "Hours since CIP", "Часов с CIP"),
  logical("bottling_line.capper.ok", "Capper OK", "Укупорка OK"),
  enu("bottling_line.state", ["run", "starved", "blocked", "changeover", "cip", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-ice_rink.json", [
  id("ice_rink.id", "Ice rink id", "ID ледовой арены"),
  q("ice_rink.slab.temp", "Cel", "Slab temperature", "Температура плиты"),
  q("ice_rink.ice.temp", "Cel", "Ice surface temperature", "Температура льда"),
  q("ice_rink.thickness", "mm", "Ice thickness", "Толщина льда"),
  q("ice_rink.rh", "%", "Arena humidity", "Влажность арены", { range: { min: 0, max: 100 } }),
  q("ice_rink.resurf.age_min", "min", "Minutes since resurface", "Минут с заливки"),
  logical("ice_rink.event", "Event in progress", "Идёт мероприятие"),
  enu("ice_rink.mode", ["hold", "event", "resurface", "melt", "paint"], "Rink mode", "Режим арены"),
]);

write("layer-b-golf_ops.json", [
  id("golf_ops.course.id", "Golf course id", "ID гольф-клуба"),
  id("golf_ops.hole.id", "Hole id", "ID лунки"),
  q("golf_ops.green.moisture", "%", "Green moisture", "Влажность грина", { range: { min: 0, max: 100 } }),
  q("golf_ops.green.stimp", "-", "Stimp speed", "Скорость грина"),
  q("golf_ops.rounds.day", "-", "Rounds today", "Раундов сегодня", { encodings: ["i16"] }),
  q("golf_ops.et", "mm", "Evapotranspiration", "Эвапотранспирация"),
  logical("golf_ops.frost.delay", "Frost delay", "Задержка из-за инея"),
  enu("golf_ops.status", ["open", "cart_path", "frost", "closed", "tournament"], "Course status", "Статус поля"),
]);

write("layer-b-deposit_return.json", [
  id("deposit_return.rvm.id", "Reverse vending machine id", "ID автомата приёма тары"),
  id("deposit_return.site.id", "RVM site id", "ID площадки RVM"),
  q("deposit_return.count", "-", "Containers today", "Тары сегодня", { encodings: ["i32"] }),
  q("deposit_return.bin.fill", "%", "Bin fill", "Заполнение бункера", { range: { min: 0, max: 100 } }),
  q("deposit_return.reject.rate", "%", "Reject rate", "Доля отказов", { range: { min: 0, max: 100 } }),
  logical("deposit_return.full", "Bin full", "Бункер полон"),
  enu("deposit_return.material", ["pet", "alu", "glass", "mixed"], "Material", "Материал"),
  enu("deposit_return.state", ["ready", "full", "jam", "offline", "service"], "RVM state", "Состояние автомата"),
]);

write("layer-b-septic.json", [
  id("septic.system.id", "Septic system id", "ID септика"),
  q("septic.tank.level", "%", "Tank level", "Уровень в септике", { range: { min: 0, max: 100 } }),
  q("septic.sludge.depth", "mm", "Sludge depth", "Толщина осадка"),
  q("septic.scum.depth", "mm", "Scum depth", "Толщина корки"),
  q("septic.effluent.nh4", "mg/L", "Effluent ammonium", "Аммоний на выходе"),
  logical("septic.alarm.high", "High level alarm", "Авария высокого уровня"),
  enu("septic.type", ["conventional", "aerobic", "mound", "constructed_wetland", "other"], "System type", "Тип системы"),
  enu("septic.state", ["ok", "pump", "alarm", "service_due"], "System state", "Состояние системы"),
]);

write("layer-b-manhole_inspect.json", [
  id("manhole_inspect.id", "Manhole id", "ID колодца"),
  id("manhole_inspect.survey.id", "CCTV survey id", "ID телеинспекции"),
  q("manhole_inspect.depth", "m", "Manhole depth", "Глубина колодца"),
  q("manhole_inspect.silt", "%", "Silt depth fraction", "Доля заиления", { range: { min: 0, max: 100 } }),
  q("manhole_inspect.h2s", "ppm", "H2S in manhole", "H₂S в колодце"),
  logical("manhole_inspect.cover.ok", "Cover secure", "Люк на месте"),
  media("manhole_inspect.cctv.ref", "CCTV survey ref", "Референс телеинспекции"),
  enu("manhole_inspect.condition", ["good", "fair", "poor", "collapse", "unknown"], "Condition", "Состояние"),
]);

write("layer-b-greywater.json", [
  id("greywater.system.id", "Greywater system id", "ID системы серой воды"),
  q("greywater.inflow", "L/h", "Inflow", "Приток"),
  q("greywater.turbidity", "NTU", "Treated turbidity", "Мутность после очистки"),
  q("greywater.reuse.flow", "L/h", "Reuse flow", "Расход на повтор"),
  q("greywater.storage.level", "%", "Storage level", "Уровень накопителя", { range: { min: 0, max: 100 } }),
  logical("greywater.divert.sewer", "Divert to sewer", "Сброс в канализацию"),
  enu("greywater.source", ["shower", "laundry", "mixed", "other"], "Source", "Источник"),
  enu("greywater.state", ["treat", "reuse", "divert", "offline", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-helium_cryo.json", [
  id("helium_cryo.liquefier.id", "Helium liquefier id", "ID гелиевого ожижителя"),
  id("helium_cryo.dewar.id", "Helium dewar id", "ID дьюара гелия"),
  q("helium_cryo.liquefaction", "L/h", "Liquefaction rate", "Скорость ожижения"),
  q("helium_cryo.dewar.level", "%", "Dewar level", "Уровень дьюара", { range: { min: 0, max: 100 } }),
  q("helium_cryo.purity", "%", "Helium purity", "Чистота гелия", { range: { min: 0, max: 100 } }),
  q("helium_cryo.compressor.power", "W", "Compressor power", "Мощность компрессора"),
  logical("helium_cryo.cold", "Cold box cold", "Холодный блок холодный"),
  enu("helium_cryo.state", ["warmup", "cooldown", "liquefy", "standby", "fault"], "Liquefier state", "Состояние ожижителя"),
]);

write("layer-b-print_press.json", [
  id("print_press.press.id", "Printing press id", "ID печатной машины"),
  id("print_press.job.id", "Print job id", "ID печатного заказа"),
  q("print_press.speed", "/h", "Impressions per hour", "Оттисков в час"),
  q("print_press.density", "-", "Ink density", "Плотность краски"),
  q("print_press.waste", "%", "Makeready waste", "Отходы приладки", { range: { min: 0, max: 100 } }),
  q("print_press.web.tension", "N", "Web tension", "Натяжение полотна"),
  logical("print_press.register.ok", "Register OK", "Приводка OK"),
  enu("print_press.process", ["offset", "flexo", "gravure", "digital", "screen", "other"], "Print process", "Способ печати"),
]);

console.log("Layer B13 seeds written");
