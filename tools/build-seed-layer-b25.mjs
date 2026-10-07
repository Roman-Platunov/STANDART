#!/usr/bin/env node
/**
 * Layer B25 — water treatment, desalination, wastewater, distribution.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B25", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-desal_ro.json", [
  id("desal_ro.train.id", "RO desalination train id", "ID линии RO-опреснения"),
  q("desal_ro.feed", "m3/h", "Feed flow", "Расход питания"),
  q("desal_ro.permeate", "m3/h", "Permeate flow", "Расход пермеата"),
  q("desal_ro.recovery", "%", "Recovery", "Выход", { range: { min: 0, max: 100 } }),
  q("desal_ro.pressure", "kPa", "Feed pressure", "Давление питания"),
  q("desal_ro.conductivity", "uS/cm", "Permeate conductivity", "Проводимость пермеата"),
  logical("desal_ro.cip", "CIP running", "CIP идёт"),
  enu("desal_ro.state", ["produce", "flush", "cip", "idle", "fault"], "Train state", "Состояние линии"),
]);

write("layer-b-desal_msf.json", [
  id("desal_msf.unit.id", "MSF desalination unit id", "ID установки MSF"),
  q("desal_msf.distillate", "m3/h", "Distillate production", "Выпуск дистиллята"),
  q("desal_msf.brine.temp", "Cel", "Top brine temperature", "Температура верхней рассольной"),
  q("desal_msf.steam", "t/h", "Heating steam", "Греющий пар"),
  q("desal_msf.stages", "-", "Stages in service", "Ступеней в работе", { encodings: ["i32"] }),
  q("desal_msf.gained", "-", "Gained output ratio", "Коэффициент выработки"),
  logical("desal_msf.scale", "Scaling risk", "Риск накипи"),
  enu("desal_msf.state", ["run", "startup", "idle", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-wwtp_aer.json", [
  id("wwtp_aer.basin.id", "Aeration basin id", "ID аэротенка"),
  q("wwtp_aer.do", "mg/L", "Dissolved oxygen", "Растворённый кислород"),
  q("wwtp_aer.air", "m3/h", "Airflow", "Расход воздуха"),
  q("wwtp_aer.mlss", "mg/L", "MLSS", "Иловая смесь"),
  q("wwtp_aer.nh4", "mg/L", "Ammonia", "Аммоний"),
  q("wwtp_aer.temp", "Cel", "Basin temperature", "Температура бассейна"),
  logical("wwtp_aer.blowers", "Blowers running", "Воздуходувки работают"),
  enu("wwtp_aer.mode", ["oxic", "anoxic", "swing", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-wwtp_digester.json", [
  id("wwtp_digester.id", "Sludge digester id", "ID метантенка"),
  q("wwtp_digester.temp", "Cel", "Digester temperature", "Температура метантенка"),
  q("wwtp_digester.biogas", "m3/h", "Biogas production", "Выработка биогаза"),
  q("wwtp_digester.ch4", "%", "Methane content", "Содержание метана", { range: { min: 0, max: 100 } }),
  q("wwtp_digester.level", "%", "Sludge level", "Уровень ила", { range: { min: 0, max: 100 } }),
  q("wwtp_digester.vs.red", "%", "VS reduction", "Снижение ЛВ", { range: { min: 0, max: 100 } }),
  logical("wwtp_digester.foam", "Foaming", "Пенообразование"),
  enu("wwtp_digester.type", ["meso", "thermo", "two_stage", "other"], "Type", "Тип"),
]);

write("layer-b-sludge_dryer.json", [
  id("sludge_dryer.id", "Sludge dryer id", "ID сушилки ила"),
  q("sludge_dryer.in.moist", "%", "Inlet moisture", "Влажность на входе", { range: { min: 0, max: 100 } }),
  q("sludge_dryer.out.moist", "%", "Outlet moisture", "Влажность на выходе", { range: { min: 0, max: 100 } }),
  q("sludge_dryer.temp", "Cel", "Dryer temperature", "Температура сушилки"),
  q("sludge_dryer.throughput", "t/h", "Throughput", "Производительность"),
  q("sludge_dryer.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("sludge_dryer.odor", "Odor alarm", "Тревога запаха"),
  enu("sludge_dryer.state", ["dry", "idle", "clean", "fault"], "Dryer state", "Состояние сушилки"),
]);

write("layer-b-uv_disinfect_w.json", [
  id("uv_disinfect_w.bank.id", "UV disinfection bank id", "ID блока УФ-обеззараживания"),
  q("uv_disinfect_w.dose", "mJ/cm2", "UV dose", "Доза УФ"),
  q("uv_disinfect_w.trans", "%", "UV transmittance", "Пропускание УФ", { range: { min: 0, max: 100 } }),
  q("uv_disinfect_w.flow", "m3/h", "Flow", "Расход"),
  q("uv_disinfect_w.lamps", "-", "Lamps online", "Ламп онлайн", { encodings: ["i32"] }),
  q("uv_disinfect_w.power", "W", "Bank power", "Мощность блока"),
  logical("uv_disinfect_w.low.dose", "Low dose", "Низкая доза"),
  enu("uv_disinfect_w.state", ["disinfect", "clean", "idle", "fault"], "Bank state", "Состояние блока"),
]);

write("layer-b-ozone_contactor.json", [
  id("ozone_contactor.id", "Ozone contactor id", "ID озонатора-контактора"),
  q("ozone_contactor.dose", "mg/L", "Ozone dose", "Доза озона"),
  q("ozone_contactor.residual", "mg/L", "Ozone residual", "Остаточный озон"),
  q("ozone_contactor.flow", "m3/h", "Water flow", "Расход воды"),
  q("ozone_contactor.orifice", "kPa", "Gas pressure", "Давление газа"),
  q("ozone_contactor.power", "W", "Generator power", "Мощность генератора"),
  logical("ozone_contactor.leak", "Ozone leak", "Утечка озона"),
  enu("ozone_contactor.state", ["produce", "purge", "idle", "fault"], "Contactor state", "Состояние контактора"),
]);

write("layer-b-chlorine_doser.json", [
  id("chlorine_doser.id", "Chlorine dosing skid id", "ID станции дозирования хлора"),
  q("chlorine_doser.rate", "kg/h", "Dose rate", "Расход дозы"),
  q("chlorine_doser.residual", "mg/L", "Free chlorine residual", "Остаточный свободный хлор"),
  q("chlorine_doser.flow", "m3/h", "Water flow", "Расход воды"),
  q("chlorine_doser.tank", "%", "Chemical tank level", "Уровень бака реагента", { range: { min: 0, max: 100 } }),
  q("chlorine_doser.orp", "mV", "ORP", "ОВП"),
  logical("chlorine_doser.low", "Low residual", "Низкий остаток"),
  enu("chlorine_doser.chemical", ["gas", "hypo", "on_site", "other"], "Chemical", "Реагент"),
]);

write("layer-b-membrane_bio.json", [
  id("membrane_bio.train.id", "MBR train id", "ID линии МБР"),
  q("membrane_bio.flux", "L/m2/h", "Membrane flux", "Поток через мембрану"),
  q("membrane_bio.tmp", "kPa", "Transmembrane pressure", "Трансмембранное давление"),
  q("membrane_bio.mlss", "mg/L", "MLSS", "Иловая смесь"),
  q("membrane_bio.permeate", "m3/h", "Permeate flow", "Расход пермеата"),
  q("membrane_bio.turbidity", "NTU", "Permeate turbidity", "Мутность пермеата"),
  logical("membrane_bio.fouling", "Fouling high", "Высокое загрязнение"),
  enu("membrane_bio.state", ["filter", "relax", "backwash", "cip", "fault"], "Train state", "Состояние линии"),
]);

write("layer-b-grit_chamber.json", [
  id("grit_chamber.id", "Grit chamber id", "ID песколовки"),
  q("grit_chamber.flow", "m3/h", "Influent flow", "Расход на входе"),
  q("grit_chamber.velocity", "m/s", "Channel velocity", "Скорость в канале"),
  q("grit_chamber.removed", "t/d", "Grit removed", "Песка удалено"),
  q("grit_chamber.organics", "%", "Organic content in grit", "Органика в песке", { range: { min: 0, max: 100 } }),
  q("grit_chamber.level", "%", "Hopper level", "Уровень бункера", { range: { min: 0, max: 100 } }),
  logical("grit_chamber.air.ok", "Air scour OK", "Продувка OK"),
  enu("grit_chamber.type", ["aerated", "vortex", "horizontal", "other"], "Type", "Тип"),
]);

write("layer-b-primary_clarif.json", [
  id("primary_clarif.id", "Primary clarifier id", "ID первичного отстойника"),
  q("primary_clarif.flow", "m3/h", "Influent flow", "Расход на входе"),
  q("primary_clarif.tss.in", "mg/L", "Influent TSS", "ВЗВ на входе"),
  q("primary_clarif.tss.out", "mg/L", "Effluent TSS", "ВЗВ на выходе"),
  q("primary_clarif.sludge", "m3/h", "Sludge withdrawal", "Отвод ила"),
  q("primary_clarif.blanket", "m", "Sludge blanket", "Уровень илового слоя"),
  logical("primary_clarif.scum", "Scum high", "Высокий уровень накипи"),
  enu("primary_clarif.state", ["settle", "desludge", "idle", "fault"], "Clarifier state", "Состояние отстойника"),
]);

write("layer-b-secondary_clarif.json", [
  id("secondary_clarif.id", "Secondary clarifier id", "ID вторичного отстойника"),
  q("secondary_clarif.flow", "m3/h", "Influent flow", "Расход на входе"),
  q("secondary_clarif.svi", "mL/g", "SVI", "Иловый индекс"),
  q("secondary_clarif.ras", "m3/h", "RAS flow", "Расход возвратного ила"),
  q("secondary_clarif.was", "m3/h", "WAS flow", "Расход избыточного ила"),
  q("secondary_clarif.blanket", "m", "Sludge blanket", "Уровень илового слоя"),
  logical("secondary_clarif.bulking", "Bulking", "Вспухание ила"),
  enu("secondary_clarif.state", ["settle", "ras", "idle", "fault"], "Clarifier state", "Состояние отстойника"),
]);

write("layer-b-thickener_belt.json", [
  id("thickener_belt.id", "Belt thickener id", "ID ленточного сгустителя"),
  q("thickener_belt.feed", "m3/h", "Feed flow", "Расход питания"),
  q("thickener_belt.cake", "%", "Cake solids", "Сухое вещество кека", { range: { min: 0, max: 100 } }),
  q("thickener_belt.polymer", "kg/h", "Polymer dose", "Доза полимера"),
  q("thickener_belt.speed", "m/min", "Belt speed", "Скорость ленты"),
  q("thickener_belt.filtrate", "NTU", "Filtrate turbidity", "Мутность фильтрата"),
  logical("thickener_belt.wash", "Belt wash on", "Промывка ленты"),
  enu("thickener_belt.state", ["thicken", "wash", "idle", "fault"], "Thickener state", "Состояние сгустителя"),
]);

write("layer-b-centrifuge_sludge.json", [
  id("centrifuge_sludge.id", "Sludge centrifuge id", "ID центрифуги ила"),
  q("centrifuge_sludge.feed", "m3/h", "Feed flow", "Расход питания"),
  q("centrifuge_sludge.cake", "%", "Cake solids", "Сухое вещество кека", { range: { min: 0, max: 100 } }),
  q("centrifuge_sludge.rpm", "rpm", "Bowl speed", "Обороты барабана"),
  q("centrifuge_sludge.torque", "N.m", "Scroll torque", "Момент шнека"),
  q("centrifuge_sludge.polymer", "kg/h", "Polymer dose", "Доза полимера"),
  logical("centrifuge_sludge.vib", "High vibration", "Высокая вибрация"),
  enu("centrifuge_sludge.state", ["dewater", "flush", "idle", "fault"], "Centrifuge state", "Состояние центрифуги"),
]);

write("layer-b-anaerobic_filter.json", [
  id("anaerobic_filter.id", "Anaerobic filter id", "ID анаэробного фильтра"),
  q("anaerobic_filter.cod.in", "mg/L", "Influent COD", "ХПК на входе"),
  q("anaerobic_filter.cod.out", "mg/L", "Effluent COD", "ХПК на выходе"),
  q("anaerobic_filter.biogas", "m3/h", "Biogas", "Биогаз"),
  q("anaerobic_filter.hrt.h", "h", "HRT", "Гидравлическое время"),
  q("anaerobic_filter.temp", "Cel", "Temperature", "Температура"),
  logical("anaerobic_filter.clog", "Media clog", "Засор загрузки"),
  enu("anaerobic_filter.state", ["treat", "flush", "idle", "fault"], "Filter state", "Состояние фильтра"),
]);

write("layer-b-storm_pump.json", [
  id("storm_pump.station.id", "Stormwater pump station id", "ID ливневой насосной"),
  q("storm_pump.level", "m", "Wet-well level", "Уровень приёмника"),
  q("storm_pump.flow", "m3/h", "Pumped flow", "Подача"),
  q("storm_pump.pumps", "-", "Pumps running", "Насосов в работе", { encodings: ["i32"] }),
  q("storm_pump.rainfall", "mm/h", "Rainfall rate", "Интенсивность дождя"),
  q("storm_pump.power", "W", "Station power", "Мощность станции"),
  logical("storm_pump.overflow", "Overflow risk", "Риск перелива"),
  enu("storm_pump.state", ["idle", "pump", "flood", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-lift_station.json", [
  id("lift_station.id", "Sewage lift station id", "ID КНС"),
  q("lift_station.level", "m", "Wet-well level", "Уровень приёмника"),
  q("lift_station.flow", "m3/h", "Discharge flow", "Расход нагнетания"),
  q("lift_station.starts", "-", "Pump starts today", "Пусков за сутки", { encodings: ["i32"] }),
  q("lift_station.h2s", "ppm", "H2S", "H2S"),
  q("lift_station.power", "W", "Station power", "Мощность станции"),
  logical("lift_station.high", "High level alarm", "Тревога высокого уровня"),
  enu("lift_station.state", ["idle", "lead", "lag", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-force_main.json", [
  id("force_main.id", "Force main id", "ID напорного коллектора"),
  q("force_main.pressure", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("force_main.flow", "m3/h", "Flow", "Расход"),
  q("force_main.velocity", "m/s", "Velocity", "Скорость"),
  q("force_main.air", "-", "Air release cycles", "Циклов воздухоотводчиков", { encodings: ["i32"] }),
  q("force_main.temp", "Cel", "Fluid temperature", "Температура среды"),
  logical("force_main.surge", "Surge event", "Гидравлический удар"),
  enu("force_main.state", ["flow", "idle", "flush", "fault"], "Main state", "Состояние коллектора"),
]);

write("layer-b-reservoir_cover.json", [
  id("reservoir_cover.id", "Covered reservoir id", "ID закрытого резервуара"),
  q("reservoir_cover.level", "%", "Water level", "Уровень воды", { range: { min: 0, max: 100 } }),
  q("reservoir_cover.chlorine", "mg/L", "Residual chlorine", "Остаточный хлор"),
  q("reservoir_cover.turbidity", "NTU", "Turbidity", "Мутность"),
  q("reservoir_cover.temp", "Cel", "Water temperature", "Температура воды"),
  q("reservoir_cover.inflow", "m3/h", "Inflow", "Приток"),
  logical("reservoir_cover.intrusion", "Intrusion alarm", "Тревога проникновения"),
  enu("reservoir_cover.state", ["fill", "draw", "idle", "alarm"], "Reservoir state", "Состояние резервуара"),
]);

write("layer-b-intake_screen.json", [
  id("intake_screen.id", "Intake screen id", "ID решётки водозабора"),
  q("intake_screen.dp", "kPa", "Differential pressure", "Перепад давления"),
  q("intake_screen.debris", "t/d", "Debris removed", "Мусора удалено"),
  q("intake_screen.flow", "m3/h", "Through flow", "Пропускной расход"),
  q("intake_screen.cycles", "-", "Clean cycles today", "Циклов очистки за сутки", { encodings: ["i32"] }),
  q("intake_screen.level", "m", "Upstream level", "Уровень выше по течению"),
  logical("intake_screen.blind", "Blinded", "Забита"),
  enu("intake_screen.type", ["bar", "band", "drum", "other"], "Type", "Тип"),
]);

write("layer-b-coag_flash_mix.json", [
  id("coag_flash_mix.id", "Coagulation flash mixer id", "ID камеры быстрого смешения"),
  q("coag_flash_mix.dose", "mg/L", "Coagulant dose", "Доза коагулянта"),
  q("coag_flash_mix.gt", "-", "G × t value", "Значение G×t"),
  q("coag_flash_mix.flow", "m3/h", "Flow", "Расход"),
  q("coag_flash_mix.ph", "-", "pH", "pH"),
  q("coag_flash_mix.speed", "rpm", "Mixer speed", "Обороты мешалки"),
  logical("coag_flash_mix.chemical.low", "Chemical low", "Мало реагента"),
  enu("coag_flash_mix.chemical", ["alum", "ferric", "pac", "other"], "Coagulant", "Коагулянт"),
]);

write("layer-b-flocculator.json", [
  id("flocculator.id", "Flocculator id", "ID флокулятора"),
  q("flocculator.g", "/s", "Velocity gradient G", "Градиент скорости G"),
  q("flocculator.time.min", "min", "Detention time", "Время пребывания"),
  q("flocculator.flow", "m3/h", "Flow", "Расход"),
  q("flocculator.turbidity", "NTU", "Outlet turbidity", "Мутность на выходе"),
  q("flocculator.speed", "rpm", "Paddle speed", "Обороты мешалки"),
  logical("flocculator.polymer", "Polymer dosing", "Дозирование полимера"),
  enu("flocculator.state", ["floc", "idle", "clean", "fault"], "Flocculator state", "Состояние флокулятора"),
]);

write("layer-b-sand_filter.json", [
  id("sand_filter.id", "Sand filter id", "ID песчаного фильтра"),
  q("sand_filter.headloss", "kPa", "Headloss", "Потери напора"),
  q("sand_filter.flow", "m3/h", "Filter flow", "Расход фильтра"),
  q("sand_filter.turbidity", "NTU", "Filtered turbidity", "Мутность фильтрата"),
  q("sand_filter.runtime.h", "h", "Filter run time", "Время фильтрации"),
  q("sand_filter.backwash", "m3", "Backwash volume last", "Объём последней промывки"),
  logical("sand_filter.backwash.due", "Backwash due", "Пора промывать"),
  enu("sand_filter.state", ["filter", "backwash", "ripen", "idle", "fault"], "Filter state", "Состояние фильтра"),
]);

write("layer-b-gac_filter.json", [
  id("gac_filter.id", "GAC filter id", "ID фильтра ГАУ"),
  q("gac_filter.ebct.min", "min", "EBCT", "Время контакта"),
  q("gac_filter.toc", "mg/L", "Outlet TOC", "ТОС на выходе"),
  q("gac_filter.headloss", "kPa", "Headloss", "Потери напора"),
  q("gac_filter.flow", "m3/h", "Flow", "Расход"),
  q("gac_filter.bed.life.d", "d", "Estimated bed life left", "Остаточный ресурс слоя"),
  logical("gac_filter.replace", "Media replace due", "Пора менять загрузку"),
  enu("gac_filter.state", ["adsorb", "backwash", "idle", "fault"], "Filter state", "Состояние фильтра"),
]);

write("layer-b-ion_exchange.json", [
  id("ion_exchange.vessel.id", "Ion exchange vessel id", "ID ионообменного аппарата"),
  q("ion_exchange.hardness", "mg/L", "Outlet hardness", "Жёсткость на выходе"),
  q("ion_exchange.conductivity", "uS/cm", "Outlet conductivity", "Проводимость на выходе"),
  q("ion_exchange.flow", "m3/h", "Flow", "Расход"),
  q("ion_exchange.capacity", "%", "Resin capacity left", "Остаточная ёмкость смолы", { range: { min: 0, max: 100 } }),
  q("ion_exchange.regen", "-", "Regenerations this month", "Регенераций за месяц", { encodings: ["i32"] }),
  logical("ion_exchange.exhaust", "Resin exhausted", "Смола истощена"),
  enu("ion_exchange.mode", ["service", "regen", "rinse", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-softener_plant.json", [
  id("softener_plant.id", "Water softener plant id", "ID станции умягчения"),
  q("softener_plant.hardness.in", "mg/L", "Inlet hardness", "Жёсткость на входе"),
  q("softener_plant.hardness.out", "mg/L", "Outlet hardness", "Жёсткость на выходе"),
  q("softener_plant.salt", "kg/d", "Salt use", "Расход соли"),
  q("softener_plant.flow", "m3/h", "Flow", "Расход"),
  q("softener_plant.brine", "%", "Brine tank level", "Уровень бака рассола", { range: { min: 0, max: 100 } }),
  logical("softener_plant.regen", "Regenerating", "Регенерация"),
  enu("softener_plant.state", ["soften", "regen", "idle", "fault"], "Plant state", "Состояние станции"),
]);

write("layer-b-brine_concentr.json", [
  id("brine_concentr.id", "Brine concentrator id", "ID концентратора рассола"),
  q("brine_concentr.feed", "m3/h", "Feed flow", "Расход питания"),
  q("brine_concentr.conc", "%", "Concentrate TDS proxy", "Концентрация рассола", { range: { min: 0, max: 100 } }),
  q("brine_concentr.steam", "t/h", "Steam use", "Расход пара"),
  q("brine_concentr.recovery", "%", "Water recovery", "Выход воды", { range: { min: 0, max: 100 } }),
  q("brine_concentr.temp", "Cel", "Boiling temperature", "Температура кипения"),
  logical("brine_concentr.scale", "Scaling", "Накипь"),
  enu("brine_concentr.state", ["concentrate", "clean", "idle", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-zld_evap.json", [
  id("zld_evap.id", "ZLD evaporator id", "ID выпарного аппарата ZLD"),
  q("zld_evap.feed", "m3/h", "Feed flow", "Расход питания"),
  q("zld_evap.distillate", "m3/h", "Distillate", "Дистиллят"),
  q("zld_evap.solids", "t/h", "Solids discharge", "Выпуск твёрдых"),
  q("zld_evap.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  q("zld_evap.temp", "Cel", "Evaporator temperature", "Температура выпарки"),
  logical("zld_evap.vacuum.ok", "Vacuum OK", "Вакуум OK"),
  enu("zld_evap.state", ["evap", "clean", "idle", "fault"], "Evaporator state", "Состояние выпарки"),
]);

write("layer-b-cooling_water_tow.json", [
  id("cooling_water_tow.id", "Cooling-water tower id", "ID градирни оборотной воды"),
  q("cooling_water_tow.approach", "K", "Approach", "Приближение"),
  q("cooling_water_tow.range", "K", "Range", "Диапазон охлаждения"),
  q("cooling_water_tow.flow", "m3/h", "Circulating flow", "Циркуляционный расход"),
  q("cooling_water_tow.cycles", "-", "Cycles of concentration", "Кратность концентрирования"),
  q("cooling_water_tow.blowdown", "m3/h", "Blowdown", "Продувка"),
  logical("cooling_water_tow.legionella", "Legionella risk high", "Высокий риск легионеллы"),
  enu("cooling_water_tow.state", ["cool", "fan_off", "idle", "fault"], "Tower state", "Состояние градирни"),
]);

write("layer-b-boiler_feed_w.json", [
  id("boiler_feed_w.plant.id", "Boiler feedwater plant id", "ID ХВО котловой воды"),
  q("boiler_feed_w.conductivity", "uS/cm", "Feed conductivity", "Проводимость питательной"),
  q("boiler_feed_w.silica", "ug/L", "Silica", "Кремнезём"),
  q("boiler_feed_w.o2", "ppb", "Dissolved oxygen", "Растворённый кислород"),
  q("boiler_feed_w.ph", "-", "pH", "pH"),
  q("boiler_feed_w.flow", "m3/h", "Feed flow", "Расход питания"),
  logical("boiler_feed_w.spec.ok", "Spec OK", "Спецификация OK"),
  enu("boiler_feed_w.state", ["produce", "polish", "idle", "fault"], "Plant state", "Состояние станции"),
]);

write("layer-b-demin_plant.json", [
  id("demin_plant.id", "Demineralization plant id", "ID деминерализационной станции"),
  q("demin_plant.conductivity", "uS/cm", "Product conductivity", "Проводимость продукта"),
  q("demin_plant.silica", "ug/L", "Product silica", "Кремнезём продукта"),
  q("demin_plant.flow", "m3/h", "Product flow", "Расход продукта"),
  q("demin_plant.recovery", "%", "Recovery", "Выход", { range: { min: 0, max: 100 } }),
  q("demin_plant.regen", "-", "Regens this week", "Регенераций за неделю", { encodings: ["i32"] }),
  logical("demin_plant.offline", "Train offline", "Линия остановлена"),
  enu("demin_plant.process", ["ix", "ro_edi", "mixed_bed", "other"], "Process", "Процесс"),
]);

write("layer-b-condensate_pol.json", [
  id("condensate_pol.id", "Condensate polisher id", "ID конденсатоочистки"),
  q("condensate_pol.conductivity", "uS/cm", "Outlet conductivity", "Проводимость на выходе"),
  q("condensate_pol.sodium", "ug/L", "Sodium", "Натрий"),
  q("condensate_pol.flow", "m3/h", "Flow", "Расход"),
  q("condensate_pol.dp", "kPa", "Vessel DP", "Перепад на аппарате"),
  q("condensate_pol.temp", "Cel", "Condensate temperature", "Температура конденсата"),
  logical("condensate_pol.bypass", "Bypassed", "В байпасе"),
  enu("condensate_pol.state", ["polish", "regen", "bypass", "fault"], "Polisher state", "Состояние очистки"),
]);

write("layer-b-raw_water_pump.json", [
  id("raw_water_pump.station.id", "Raw water pump station id", "ID насосной сырой воды"),
  q("raw_water_pump.flow", "m3/h", "Pumped flow", "Подача"),
  q("raw_water_pump.pressure", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("raw_water_pump.level", "m", "Source level", "Уровень источника"),
  q("raw_water_pump.power", "W", "Station power", "Мощность станции"),
  q("raw_water_pump.turbidity", "NTU", "Raw turbidity", "Мутность сырой воды"),
  logical("raw_water_pump.low.source", "Low source level", "Низкий уровень источника"),
  enu("raw_water_pump.state", ["run", "idle", "maintain", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-clearwell.json", [
  id("clearwell.id", "Clearwell id", "ID резервуара чистой воды"),
  q("clearwell.level", "%", "Level", "Уровень", { range: { min: 0, max: 100 } }),
  q("clearwell.chlorine", "mg/L", "Residual chlorine", "Остаточный хлор"),
  q("clearwell.ct", "mg.min/L", "CT value", "Значение CT"),
  q("clearwell.outflow", "m3/h", "Outflow", "Отток"),
  q("clearwell.temp", "Cel", "Water temperature", "Температура воды"),
  logical("clearwell.low", "Low level", "Низкий уровень"),
  enu("clearwell.state", ["fill", "draw", "idle", "alarm"], "Clearwell state", "Состояние резервуара"),
]);

write("layer-b-distribution_pump.json", [
  id("distribution_pump.station.id", "Distribution pump station id", "ID повысительной насосной"),
  q("distribution_pump.pressure", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("distribution_pump.flow", "m3/h", "Flow", "Расход"),
  q("distribution_pump.pumps", "-", "Pumps running", "Насосов в работе", { encodings: ["i32"] }),
  q("distribution_pump.power", "W", "Station power", "Мощность станции"),
  q("distribution_pump.setpoint", "kPa", "Pressure setpoint", "Уставка давления"),
  logical("distribution_pump.low.p", "Low pressure", "Низкое давление"),
  enu("distribution_pump.state", ["auto", "manual", "idle", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-pressure_zone.json", [
  id("pressure_zone.id", "Pressure zone id", "ID зоны давления"),
  q("pressure_zone.pressure", "kPa", "Zone pressure", "Давление зоны"),
  q("pressure_zone.flow", "m3/h", "Zone inflow", "Приток в зону"),
  q("pressure_zone.min.p", "kPa", "Minimum pressure today", "Мин. давление за сутки"),
  q("pressure_zone.max.p", "kPa", "Maximum pressure today", "Макс. давление за сутки"),
  q("pressure_zone.customers", "-", "Customers served", "Абонентов", { encodings: ["i32"] }),
  logical("pressure_zone.breach", "Pressure breach", "Выход за пределы давления"),
  enu("pressure_zone.state", ["ok", "high", "low", "offline"], "Zone state", "Состояние зоны"),
]);

write("layer-b-dma_meter.json", [
  id("dma_meter.id", "DMA meter id", "ID счётчика DMA"),
  q("dma_meter.flow", "m3/h", "Instant flow", "Мгновенный расход"),
  q("dma_meter.night", "m3/h", "Minimum night flow", "Минимальный ночной расход"),
  q("dma_meter.volume", "m3", "Daily volume", "Суточный объём"),
  q("dma_meter.pressure", "kPa", "DMA pressure", "Давление DMA"),
  q("dma_meter.nrw", "%", "NRW estimate", "Оценка НРВ", { range: { min: 0, max: 100 } }),
  logical("dma_meter.leak", "Leak suspected", "Подозрение на утечку"),
  enu("dma_meter.state", ["ok", "leak", "offline", "fault"], "Meter state", "Состояние счётчика"),
]);

write("layer-b-leak_noise.json", [
  id("leak_noise.logger.id", "Acoustic leak logger id", "ID акустического логгера утечек"),
  q("leak_noise.level", "dB", "Noise level", "Уровень шума"),
  q("leak_noise.score", "%", "Leak score", "Оценка утечки", { range: { min: 0, max: 100 } }),
  q("leak_noise.pressure", "kPa", "Pipe pressure", "Давление в трубе"),
  q("leak_noise.battery", "%", "Logger battery", "Батарея логгера", { range: { min: 0, max: 100 } }),
  q("leak_noise.corr", "-", "Correlation quality", "Качество корреляции"),
  logical("leak_noise.alarm", "Leak alarm", "Тревога утечки"),
  enu("leak_noise.state", ["listen", "alarm", "offline", "maintain"], "Logger state", "Состояние логгера"),
]);

write("layer-b-pipe_burst.json", [
  id("pipe_burst.event.id", "Pipe burst event id", "ID события разрыва трубы"),
  id("pipe_burst.dma.id", "DMA id", "ID DMA"),
  q("pipe_burst.flow.spike", "m3/h", "Flow spike", "Скачок расхода"),
  q("pipe_burst.pressure.drop", "kPa", "Pressure drop", "Падение давления"),
  q("pipe_burst.volume", "m3", "Estimated loss", "Оценка потерь"),
  q("pipe_burst.crew.eta.min", "min", "Crew ETA", "ETA бригады"),
  logical("pipe_burst.active", "Burst active", "Разрыв активен"),
  enu("pipe_burst.state", ["detect", "confirm", "isolate", "repair", "closed"], "Event state", "Состояние события"),
]);

write("layer-b-valve_chamber.json", [
  id("valve_chamber.id", "Valve chamber id", "ID камеры задвижки"),
  q("valve_chamber.position", "%", "Valve position", "Положение задвижки", { range: { min: 0, max: 100 } }),
  q("valve_chamber.torque", "N.m", "Actuator torque", "Момент привода"),
  q("valve_chamber.flood", "%", "Chamber flood level", "Затопление камеры", { range: { min: 0, max: 100 } }),
  q("valve_chamber.ops", "-", "Operations today", "Операций за сутки", { encodings: ["i32"] }),
  q("valve_chamber.battery", "%", "Actuator battery / UPS", "Батарея/ИБП привода", { range: { min: 0, max: 100 } }),
  logical("valve_chamber.fail", "Fail to operate", "Отказ срабатывания"),
  enu("valve_chamber.state", ["open", "closed", "moving", "fault"], "Valve state", "Состояние задвижки"),
]);

write("layer-b-hydrants_net.json", [
  id("hydrants_net.id", "Fire hydrant id", "ID пожарного гидранта"),
  q("hydrants_net.pressure", "kPa", "Static pressure", "Статическое давление"),
  q("hydrants_net.flow", "L/min", "Available flow", "Доступный расход"),
  q("hydrants_net.last.test.d", "d", "Days since flow test", "Дней с испытания"),
  q("hydrants_net.ops", "-", "Openings this year", "Открытий за год", { encodings: ["i32"] }),
  q("hydrants_net.temp", "Cel", "Barrel temperature", "Температура ствола"),
  logical("hydrants_net.frozen", "Freeze risk", "Риск замерзания"),
  enu("hydrants_net.state", ["ok", "out_of_service", "low_p", "offline"], "Hydrant state", "Состояние гидранта"),
]);

write("layer-b-backflow_prevent.json", [
  id("backflow_prevent.id", "Backflow preventer id", "ID обратного клапана / превентера"),
  id("backflow_prevent.site.id", "Site id", "ID объекта"),
  q("backflow_prevent.dp", "kPa", "Differential pressure", "Перепад давления"),
  q("backflow_prevent.test.d", "d", "Days since test", "Дней с испытания"),
  q("backflow_prevent.relief", "-", "Relief valve trips", "Срабатываний сброса", { encodings: ["i32"] }),
  q("backflow_prevent.flow", "m3/h", "Forward flow", "Прямой расход"),
  logical("backflow_prevent.fail", "Test fail", "Испытание не пройдено"),
  enu("backflow_prevent.type", ["rpz", "dcva", "pvb", "other"], "Type", "Тип"),
]);

write("layer-b-scada_water.json", [
  id("scada_water.system.id", "Water SCADA system id", "ID SCADA водоснабжения"),
  q("scada_water.rtus", "-", "RTUs online", "RTU онлайн", { encodings: ["i32"] }),
  q("scada_water.alarms", "-", "Active alarms", "Активных аварий", { encodings: ["i32"] }),
  q("scada_water.latency.ms", "ms", "Poll latency", "Задержка опроса"),
  q("scada_water.uptime", "%", "System uptime", "Доступность", { range: { min: 0, max: 100 } }),
  q("scada_water.tags", "-", "Tags updating", "Обновляемых тегов", { encodings: ["i32"] }),
  logical("scada_water.degraded", "Degraded mode", "Деградация"),
  enu("scada_water.state", ["ok", "degraded", "failover", "offline"], "SCADA state", "Состояние SCADA"),
]);

write("layer-b-amr_collector.json", [
  id("amr_collector.id", "AMR / AMI collector id", "ID коллектора AMR/AMI"),
  q("amr_collector.meters", "-", "Meters heard today", "Счётчиков услышано за сутки", { encodings: ["i32"] }),
  q("amr_collector.success", "%", "Read success", "Успешность считывания", { range: { min: 0, max: 100 } }),
  q("amr_collector.rssi", "dBm", "Average RSSI", "Средний RSSI"),
  q("amr_collector.battery", "%", "Collector battery", "Батарея коллектора", { range: { min: 0, max: 100 } }),
  q("amr_collector.retries", "-", "Retries today", "Повторов за сутки", { encodings: ["i32"] }),
  logical("amr_collector.jam", "RF jam / noise", "Помехи RF"),
  enu("amr_collector.state", ["ok", "degraded", "offline", "fault"], "Collector state", "Состояние коллектора"),
]);

write("layer-b-tank_mixer.json", [
  id("tank_mixer.id", "Storage tank mixer id", "ID смесителя резервуара"),
  q("tank_mixer.speed", "rpm", "Mixer speed", "Обороты смесителя"),
  q("tank_mixer.power", "W", "Mixer power", "Мощность смесителя"),
  q("tank_mixer.strat", "K", "Temperature stratification", "Стратификация по температуре"),
  q("tank_mixer.chlorine.var", "%", "Chlorine variance", "Разброс хлора", { range: { min: 0, max: 100 } }),
  q("tank_mixer.runtime.h", "h", "Runtime today", "Наработка за сутки"),
  logical("tank_mixer.on", "Mixer on", "Смеситель включён"),
  enu("tank_mixer.state", ["run", "idle", "fault"], "Mixer state", "Состояние смесителя"),
]);

write("layer-b-algae_monitor.json", [
  id("algae_monitor.id", "Algae / cyanobacteria monitor id", "ID монитора водорослей"),
  q("algae_monitor.chla", "ug/L", "Chlorophyll-a", "Хлорофилл-а"),
  q("algae_monitor.pc", "ug/L", "Phycocyanin", "Фикоцианин"),
  q("algae_monitor.turbidity", "NTU", "Turbidity", "Мутность"),
  q("algae_monitor.temp", "Cel", "Water temperature", "Температура воды"),
  q("algae_monitor.bloom", "%", "Bloom risk score", "Оценка риска цветения", { range: { min: 0, max: 100 } }),
  logical("algae_monitor.alert", "Bloom alert", "Тревога цветения"),
  enu("algae_monitor.state", ["ok", "watch", "bloom", "offline"], "Monitor state", "Состояние монитора"),
]);

write("layer-b-taste_odor.json", [
  id("taste_odor.id", "Taste and odor monitor id", "ID монитора привкуса и запаха"),
  q("taste_odor.mib", "ng/L", "MIB", "MIB"),
  q("taste_odor.geosmin", "ng/L", "Geosmin", "Геосмин"),
  q("taste_odor.toc", "mg/L", "TOC", "ТОС"),
  q("taste_odor.complaints", "-", "Customer complaints today", "Жалоб за сутки", { encodings: ["i32"] }),
  q("taste_odor.pac", "kg/h", "PAC dose", "Доза ПАУ"),
  logical("taste_odor.event", "T&O event", "Событие привкуса/запаха"),
  enu("taste_odor.state", ["ok", "watch", "event", "offline"], "Monitor state", "Состояние монитора"),
]);

write("layer-b-fluoride_doser.json", [
  id("fluoride_doser.id", "Fluoride dosing skid id", "ID станции дозирования фтора"),
  q("fluoride_doser.dose", "mg/L", "Fluoride residual", "Остаточный фтор"),
  q("fluoride_doser.rate", "kg/h", "Dose rate", "Расход дозы"),
  q("fluoride_doser.flow", "m3/h", "Water flow", "Расход воды"),
  q("fluoride_doser.tank", "%", "Chemical tank level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("fluoride_doser.setpoint", "mg/L", "Setpoint", "Уставка"),
  logical("fluoride_doser.high", "High fluoride", "Высокий фтор"),
  enu("fluoride_doser.state", ["dose", "idle", "calibrate", "fault"], "Doser state", "Состояние дозатора"),
]);

write("layer-b-ph_adjust.json", [
  id("ph_adjust.id", "pH adjustment skid id", "ID станции корректировки pH"),
  q("ph_adjust.ph", "-", "Outlet pH", "pH на выходе"),
  q("ph_adjust.acid", "L/h", "Acid dose", "Доза кислоты"),
  q("ph_adjust.base", "L/h", "Base dose", "Доза щёлочи"),
  q("ph_adjust.flow", "m3/h", "Water flow", "Расход воды"),
  q("ph_adjust.setpoint", "-", "pH setpoint", "Уставка pH"),
  logical("ph_adjust.out.of.band", "Out of band", "Вне диапазона"),
  enu("ph_adjust.state", ["control", "idle", "calibrate", "fault"], "Skid state", "Состояние станции"),
]);

write("layer-b-co2_stripper.json", [
  id("co2_stripper.id", "CO2 stripper / degasifier id", "ID дегазатора CO2"),
  q("co2_stripper.in", "mg/L", "Inlet CO2", "CO2 на входе"),
  q("co2_stripper.out", "mg/L", "Outlet CO2", "CO2 на выходе"),
  q("co2_stripper.air", "m3/h", "Stripping air", "Воздух дегазации"),
  q("co2_stripper.flow", "m3/h", "Water flow", "Расход воды"),
  q("co2_stripper.ph", "-", "Outlet pH", "pH на выходе"),
  logical("co2_stripper.fan.ok", "Fan OK", "Вентилятор OK"),
  enu("co2_stripper.state", ["strip", "idle", "clean", "fault"], "Stripper state", "Состояние дегазатора"),
]);

write("layer-b-membrane_cip.json", [
  id("membrane_cip.skid.id", "Membrane CIP skid id", "ID станции CIP мембран"),
  id("membrane_cip.train.id", "Membrane train id", "ID линии мембран"),
  q("membrane_cip.temp", "Cel", "CIP temperature", "Температура CIP"),
  q("membrane_cip.ph", "-", "CIP pH", "pH CIP"),
  q("membrane_cip.time.min", "min", "CIP duration", "Длительность CIP"),
  q("membrane_cip.recovery", "%", "Flux recovery", "Восстановление потока", { range: { min: 0, max: 100 } }),
  logical("membrane_cip.active", "CIP active", "CIP активен"),
  enu("membrane_cip.chem", ["acid", "alkaline", "oxidant", "enzyme", "other"], "Chemistry", "Химия"),
]);

write("layer-b-cartridge_filter.json", [
  id("cartridge_filter.id", "Cartridge filter id", "ID картриджного фильтра"),
  q("cartridge_filter.dp", "kPa", "Differential pressure", "Перепад давления"),
  q("cartridge_filter.flow", "m3/h", "Flow", "Расход"),
  q("cartridge_filter.turbidity", "NTU", "Outlet turbidity", "Мутность на выходе"),
  q("cartridge_filter.runtime.h", "h", "Runtime since change", "Наработка с замены"),
  q("cartridge_filter.micron", "um", "Rating", "Рейтинг"),
  logical("cartridge_filter.change", "Change due", "Пора менять"),
  enu("cartridge_filter.state", ["filter", "change", "idle", "fault"], "Filter state", "Состояние фильтра"),
]);

write("layer-b-multimedia_filter.json", [
  id("multimedia_filter.id", "Multimedia filter id", "ID мультимедийного фильтра"),
  q("multimedia_filter.headloss", "kPa", "Headloss", "Потери напора"),
  q("multimedia_filter.flow", "m3/h", "Flow", "Расход"),
  q("multimedia_filter.turbidity", "NTU", "Filtered turbidity", "Мутность фильтрата"),
  q("multimedia_filter.runtime.h", "h", "Filter run time", "Время фильтрации"),
  q("multimedia_filter.backwash", "m3", "Last backwash volume", "Объём последней промывки"),
  logical("multimedia_filter.backwash.due", "Backwash due", "Пора промывать"),
  enu("multimedia_filter.state", ["filter", "backwash", "idle", "fault"], "Filter state", "Состояние фильтра"),
]);

write("layer-b-dissolved_air.json", [
  id("dissolved_air.id", "DAF unit id", "ID установки флотации DAF"),
  q("dissolved_air.recycle", "%", "Recycle ratio", "Доля рецикла", { range: { min: 0, max: 100 } }),
  q("dissolved_air.pressure", "kPa", "Saturator pressure", "Давление сатуратора"),
  q("dissolved_air.tss.out", "mg/L", "Effluent TSS", "ВЗВ на выходе"),
  q("dissolved_air.flow", "m3/h", "Throughput", "Производительность"),
  q("dissolved_air.scum", "m3/h", "Float removal", "Отвод флота"),
  logical("dissolved_air.air.ok", "Air system OK", "Воздушная система OK"),
  enu("dissolved_air.state", ["float", "idle", "clean", "fault"], "DAF state", "Состояние DAF"),
]);

write("layer-b-ballasted_floc.json", [
  id("ballasted_floc.id", "Ballasted flocculation id", "ID балластной флокуляции"),
  q("ballasted_floc.microsand", "kg/h", "Microsand dose", "Доза микропеска"),
  q("ballasted_floc.turbidity", "NTU", "Outlet turbidity", "Мутность на выходе"),
  q("ballasted_floc.flow", "m3/h", "Flow", "Расход"),
  q("ballasted_floc.polymer", "kg/h", "Polymer dose", "Доза полимера"),
  q("ballasted_floc.recycle", "%", "Sand recycle", "Рецикл песка", { range: { min: 0, max: 100 } }),
  logical("ballasted_floc.sand.low", "Microsand low", "Мало микропеска"),
  enu("ballasted_floc.state", ["treat", "idle", "clean", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-actuated_gate.json", [
  id("actuated_gate.id", "Actuated canal / channel gate id", "ID приводного затвора"),
  q("actuated_gate.position", "%", "Gate position", "Положение затвора", { range: { min: 0, max: 100 } }),
  q("actuated_gate.level.up", "m", "Upstream level", "Уровень выше"),
  q("actuated_gate.level.down", "m", "Downstream level", "Уровень ниже"),
  q("actuated_gate.flow", "m3/h", "Estimated flow", "Оценка расхода"),
  q("actuated_gate.torque", "N.m", "Actuator torque", "Момент привода"),
  logical("actuated_gate.jam", "Gate jam", "Заклинивание"),
  enu("actuated_gate.state", ["auto", "manual", "fault", "locked"], "Gate state", "Состояние затвора"),
]);

write("layer-b-canal_level.json", [
  id("canal_level.reach.id", "Irrigation canal reach id", "ID бьефа ирригационного канала"),
  q("canal_level.level", "m", "Water level", "Уровень воды"),
  q("canal_level.flow", "m3/h", "Flow", "Расход"),
  q("canal_level.setpoint", "m", "Level setpoint", "Уставка уровня"),
  q("canal_level.seepage", "m3/h", "Estimated seepage", "Оценка фильтрации"),
  q("canal_level.temp", "Cel", "Water temperature", "Температура воды"),
  logical("canal_level.high", "High level", "Высокий уровень"),
  enu("canal_level.state", ["ok", "high", "low", "offline"], "Reach state", "Состояние бьефа"),
]);

write("layer-b-irrigation_pump.json", [
  id("irrigation_pump.id", "Irrigation pump id", "ID ирригационного насоса"),
  q("irrigation_pump.flow", "m3/h", "Flow", "Расход"),
  q("irrigation_pump.pressure", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("irrigation_pump.power", "W", "Pump power", "Мощность насоса"),
  q("irrigation_pump.energy", "kWh/m3", "Specific energy", "Удельная энергия"),
  q("irrigation_pump.runtime.h", "h", "Runtime today", "Наработка за сутки"),
  logical("irrigation_pump.dry", "Dry run risk", "Риск сухого хода"),
  enu("irrigation_pump.state", ["run", "idle", "schedule", "fault"], "Pump state", "Состояние насоса"),
]);

write("layer-b-aquifer_recharge.json", [
  id("aquifer_recharge.well.id", "Managed aquifer recharge well id", "ID скважины искусственного пополнения"),
  q("aquifer_recharge.flow", "m3/h", "Recharge rate", "Скорость пополнения"),
  q("aquifer_recharge.level", "m", "Water table / head", "Уровень / напор"),
  q("aquifer_recharge.turbidity", "NTU", "Injected turbidity", "Мутность закачки"),
  q("aquifer_recharge.clog", "%", "Clogging index", "Индекс кольматации", { range: { min: 0, max: 100 } }),
  q("aquifer_recharge.volume", "m3", "Volume today", "Объём за сутки"),
  logical("aquifer_recharge.clog.high", "Clogging high", "Высокая кольматация"),
  enu("aquifer_recharge.state", ["inject", "rest", "redevelop", "fault"], "Well state", "Состояние скважины"),
]);

write("layer-b-brackish_ro.json", [
  id("brackish_ro.train.id", "Brackish RO train id", "ID линии солоноватого RO"),
  q("brackish_ro.feed", "m3/h", "Feed flow", "Расход питания"),
  q("brackish_ro.permeate", "m3/h", "Permeate flow", "Расход пермеата"),
  q("brackish_ro.recovery", "%", "Recovery", "Выход", { range: { min: 0, max: 100 } }),
  q("brackish_ro.pressure", "kPa", "Feed pressure", "Давление питания"),
  q("brackish_ro.tds", "mg/L", "Permeate TDS", "TDS пермеата"),
  logical("brackish_ro.scaling", "Scaling risk", "Риск накипи"),
  enu("brackish_ro.state", ["produce", "flush", "cip", "idle", "fault"], "Train state", "Состояние линии"),
]);

console.log("Layer B25 seeds written");
