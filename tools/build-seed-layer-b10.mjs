#!/usr/bin/env node
/**
 * Layer B10 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B10", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-oil_refinery.json", [
  id("oil_refinery.unit.id", "Refinery process unit id", "ID установки НПЗ"),
  id("oil_refinery.plant.id", "Refinery plant id", "ID НПЗ"),
  q("oil_refinery.crude.throughput", "t/d", "Crude throughput", "Переработка нефти"),
  q("oil_refinery.fcc.temp", "Cel", "FCC reactor temperature", "Температура FCC"),
  q("oil_refinery.distillate.yield", "%", "Distillate yield", "Выход дистиллятов", { range: { min: 0, max: 100 } }),
  q("oil_refinery.flare.flow", "kg/h", "Flare gas flow", "Расход на факел"),
  q("oil_refinery.hydrogen.purity", "%", "H2 purity", "Чистота водорода", { range: { min: 0, max: 100 } }),
  enu("oil_refinery.unit.type", ["cdu", "fcc", "hydrocracker", "reformer", "alkylation", "other"], "Process unit type", "Тип установки"),
]);

write("layer-b-petrochem.json", [
  id("petrochem.plant.id", "Petrochemical plant id", "ID нефтехимзавода"),
  id("petrochem.cracker.id", "Steam cracker id", "ID пиролизной печи"),
  q("petrochem.cracker.temp", "Cel", "Cracker furnace temperature", "Температура пиролиза"),
  q("petrochem.ethylene.purity", "%", "Ethylene purity", "Чистота этилена", { range: { min: 0, max: 100 } }),
  q("petrochem.propylene.rate", "t/h", "Propylene rate", "Выработка пропилена"),
  q("petrochem.flare.hc", "kg/h", "Hydrocarbon flare rate", "Сброс УВ на факел"),
  q("petrochem.compressor.power", "W", "Process compressor power", "Мощность компрессора"),
  enu("petrochem.product", ["ethylene", "propylene", "benzene", "pe", "pp", "other"], "Petrochem product", "Продукт нефтехимии"),
]);

write("layer-b-lng_terminal.json", [
  id("lng_terminal.id", "LNG terminal id", "ID СПГ-терминала"),
  id("lng_terminal.tank.id", "LNG storage tank id", "ID резервуара СПГ"),
  q("lng_terminal.tank.level", "%", "LNG tank level", "Уровень СПГ", { range: { min: 0, max: 100 } }),
  q("lng_terminal.tank.pressure", "Pa", "Tank pressure", "Давление резервуара"),
  q("lng_terminal.boiloff.rate", "kg/h", "Boil-off rate", "Скорость испарения"),
  q("lng_terminal.sendout.flow", "t/h", "Send-out flow", "Отпуск газа"),
  q("lng_terminal.jetty.berths", "-", "Occupied berths", "Занятые причалы", { encodings: ["i16"] }),
  enu("lng_terminal.mode", ["import", "export", "bunker", "idle", "maintenance"], "Terminal mode", "Режим терминала"),
]);

write("layer-b-pipeline_pump.json", [
  id("pipeline_pump.station.id", "Pipeline pump station id", "ID НПС"),
  id("pipeline_pump.unit.id", "Pipeline pump unit id", "ID насосного агрегата"),
  q("pipeline_pump.suction.pressure", "Pa", "Suction pressure", "Давление всасывания"),
  q("pipeline_pump.discharge.pressure", "Pa", "Discharge pressure", "Давление нагнетания"),
  q("pipeline_pump.flow", "m3/h", "Pump flow", "Расход насоса"),
  q("pipeline_pump.vibration", "mm/s", "Pump vibration", "Вибрация насоса"),
  q("pipeline_pump.power", "W", "Pump power", "Мощность насоса"),
  enu("pipeline_pump.state", ["off", "start", "run", "recycle", "fault"], "Pump state", "Состояние насоса"),
]);

write("layer-b-subsea.json", [
  id("subsea.tree.id", "Subsea tree id", "ID подводной фонтанной арматуры"),
  id("subsea.manifold.id", "Subsea manifold id", "ID подводного манифольда"),
  q("subsea.wellhead.pressure", "Pa", "Wellhead pressure", "Давление на устье"),
  q("subsea.wellhead.temp", "Cel", "Wellhead temperature", "Температура на устье"),
  q("subsea.choke.opening", "%", "Choke opening", "Открытие штуцера", { range: { min: 0, max: 100 } }),
  q("subsea.hydrate.inhibitor", "L/h", "Inhibitor rate", "Подача ингибитора"),
  logical("subsea.leak.suspect", "Subsea leak suspect", "Подозрение на утечку"),
  enu("subsea.state", ["producing", "shut_in", "injecting", "testing", "fault"], "Subsea state", "Состояние подводной системы"),
]);

write("layer-b-drill_rig.json", [
  id("drill_rig.id", "Drill rig id", "ID буровой установки"),
  id("drill_rig.well.id", "Well being drilled", "ID бурящейся скважины"),
  q("drill_rig.hook.load", "kN", "Hook load", "Нагрузка на крюке"),
  q("drill_rig.rop", "m/h", "Rate of penetration", "Механическая скорость"),
  q("drill_rig.mud.weight", "kg/m3", "Mud density", "Плотность раствора"),
  q("drill_rig.mud.flow", "L/min", "Mud flow", "Расход раствора"),
  q("drill_rig.torque", "N.m", "Top drive torque", "Момент верхнего привода"),
  enu("drill_rig.activity", ["drill", "trip", "cement", "log", "idle", "npt"], "Rig activity", "Операция буровой"),
]);

write("layer-b-water_treatment_plant.json", [
  id("water_treatment_plant.id", "WTP id", "ID водоочистной станции"),
  id("water_treatment_plant.train.id", "Treatment train id", "ID линии очистки"),
  q("water_treatment_plant.flow", "m3/h", "Plant flow", "Расход станции"),
  q("water_treatment_plant.turbidity.out", "NTU", "Outlet turbidity", "Мутность на выходе"),
  q("water_treatment_plant.chlorine.residual", "mg/L", "Residual chlorine", "Остаточный хлор"),
  q("water_treatment_plant.filter.headloss", "Pa", "Filter headloss", "Потери на фильтре"),
  q("water_treatment_plant.energy", "kWh/m3", "Specific energy", "Удельное энергопотребление"),
  enu("water_treatment_plant.process", ["conventional", "membrane", "uv", "ozone", "hybrid"], "Process type", "Тип процесса"),
]);

write("layer-b-wwtp.json", [
  id("wwtp.id", "WWTP id", "ID очистных сооружений"),
  id("wwtp.basin.id", "Aeration basin id", "ID аэротенка"),
  q("wwtp.influent.flow", "m3/h", "Influent flow", "Приток"),
  q("wwtp.bod.in", "mg/L", "Influent BOD", "БПК на входе"),
  q("wwtp.do", "mg/L", "Dissolved oxygen", "Растворённый кислород"),
  q("wwtp.mlss", "mg/L", "MLSS", "Ил (MLSS)"),
  q("wwtp.effluent.nh4", "mg/L", "Effluent ammonium", "Аммоний на выходе"),
  q("wwtp.biogas.flow", "m3/h", "Digester biogas flow", "Расход биогаза"),
  enu("wwtp.process", ["asp", "mbr", "sbr", "trickling", "other"], "WWTP process", "Процесс ОС"),
]);

write("layer-b-membrane_plant.json", [
  id("membrane_plant.id", "Membrane plant id", "ID мембранной установки"),
  id("membrane_plant.skid.id", "Membrane skid id", "ID мембранного блока"),
  q("membrane_plant.flux", "L/m2/h", "Permeate flux", "Удельный поток"),
  q("membrane_plant.tmp", "Pa", "Transmembrane pressure", "Трансмембранное давление"),
  q("membrane_plant.recovery", "%", "Recovery", "Выход пермеата", { range: { min: 0, max: 100 } }),
  q("membrane_plant.cip.count", "-", "CIP cycles", "Циклы CIP", { encodings: ["i32"] }),
  q("membrane_plant.salt.rejection", "%", "Salt rejection", "Задержание солей", { range: { min: 0, max: 100 } }),
  enu("membrane_plant.type", ["ro", "nf", "uf", "mf", "edi"], "Membrane type", "Тип мембраны"),
]);

write("layer-b-chlorination.json", [
  id("chlorination.system.id", "Chlorination system id", "ID системы хлорирования"),
  q("chlorination.dose", "mg/L", "Chlorine dose", "Доза хлора"),
  q("chlorination.residual.free", "mg/L", "Free residual", "Свободный остаточный хлор"),
  q("chlorination.residual.total", "mg/L", "Total residual", "Общий остаточный хлор"),
  q("chlorination.cylinder.weight", "kg", "Cylinder weight", "Масса баллона"),
  logical("chlorination.leak", "Chlorine leak", "Утечка хлора"),
  enu("chlorination.chemical", ["gas_cl2", "hypo", "clo2", "chloramine", "other"], "Disinfectant", "Дезинфектант"),
  enu("chlorination.state", ["dosing", "standby", "empty", "fault"], "Chlorination state", "Состояние хлорирования"),
]);

write("layer-b-ozone_plant.json", [
  id("ozone_plant.generator.id", "Ozone generator id", "ID генератора озона"),
  q("ozone_plant.concentration", "g/Nm3", "Ozone concentration", "Концентрация озона"),
  q("ozone_plant.dose", "mg/L", "Applied ozone dose", "Доза озона"),
  q("ozone_plant.power", "W", "Generator power", "Мощность генератора"),
  q("ozone_plant.residual", "mg/L", "Residual ozone", "Остаточный озон"),
  logical("ozone_plant.destruct.ok", "Off-gas destruct OK", "Деструктор OK"),
  enu("ozone_plant.feed", ["air", "oxygen", "vpsa"], "Feed gas", "Газ питания"),
  enu("ozone_plant.state", ["off", "ramp", "produce", "purge", "fault"], "Ozone plant state", "Состояние озонатора"),
]);

write("layer-b-uv_disinfect.json", [
  id("uv_disinfect.reactor.id", "UV reactor id", "ID УФ-реактора"),
  q("uv_disinfect.dose", "mJ/cm2", "UV dose", "Доза УФ"),
  q("uv_disinfect.intensity", "W/m2", "UV intensity", "Интенсивность УФ"),
  q("uv_disinfect.transmittance", "%", "UV transmittance", "Пропускание УФ", { range: { min: 0, max: 100 } }),
  q("uv_disinfect.lamp.hours", "h", "Lamp hours", "Часы ламп"),
  logical("uv_disinfect.lamp.fail", "Lamp failure", "Отказ лампы"),
  enu("uv_disinfect.type", ["lp", "mp", "led", "other"], "UV lamp type", "Тип УФ-ламп"),
  enu("uv_disinfect.state", ["on", "standby", "cleaning", "fault"], "UV state", "Состояние УФ"),
]);

write("layer-b-boiler_plant.json", [
  id("boiler_plant.id", "Boiler plant id", "ID котельной"),
  id("boiler_plant.boiler.id", "Boiler id", "ID котла"),
  q("boiler_plant.steam.pressure", "Pa", "Steam pressure", "Давление пара"),
  q("boiler_plant.steam.temp", "Cel", "Steam temperature", "Температура пара"),
  q("boiler_plant.steam.flow", "t/h", "Steam flow", "Расход пара"),
  q("boiler_plant.efficiency", "%", "Boiler efficiency", "КПД котла", { range: { min: 0, max: 100 } }),
  q("boiler_plant.stack.o2", "%", "Stack O2", "O₂ в дымовых газах", { range: { min: 0, max: 100 } }),
  enu("boiler_plant.fuel", ["gas", "oil", "coal", "biomass", "electric", "other"], "Boiler fuel", "Топливо котла"),
]);

write("layer-b-steam_trap.json", [
  id("steam_trap.id", "Steam trap id", "ID конденсатоотводчика"),
  id("steam_trap.line.id", "Steam line id", "ID паропровода"),
  q("steam_trap.temp", "Cel", "Trap temperature", "Температура отводчика"),
  q("steam_trap.ultrasound", "-", "Ultrasound level", "Уровень ультразвука"),
  logical("steam_trap.blowing", "Blowing through", "Продувка паром"),
  logical("steam_trap.cold", "Cold / flooded", "Холодный / затоплен"),
  enu("steam_trap.type", ["thermostatic", "mechanical", "thermodynamic", "other"], "Trap type", "Тип отводчика"),
  enu("steam_trap.condition", ["ok", "blow", "blocked", "leaking", "unknown"], "Trap condition", "Состояние отводчика"),
]);

write("layer-b-valve_actuator.json", [
  id("valve_actuator.id", "Valve actuator id", "ID привода арматуры"),
  id("valve_actuator.tag", "Valve tag", "Тег арматуры"),
  q("valve_actuator.position", "%", "Valve position", "Положение арматуры", { range: { min: 0, max: 100 } }),
  q("valve_actuator.torque", "N.m", "Actuator torque", "Момент привода"),
  q("valve_actuator.travel.time_s", "s", "Stroke time", "Время хода"),
  logical("valve_actuator.open", "Fully open", "Полностью открыт"),
  logical("valve_actuator.closed", "Fully closed", "Полностью закрыт"),
  enu("valve_actuator.fail", ["fail_open", "fail_closed", "fail_last", "none"], "Fail position", "Положение при отказе"),
]);

write("layer-b-vibration_monitor.json", [
  id("vibration_monitor.asset.id", "Monitored asset id", "ID контролируемого актива"),
  id("vibration_monitor.sensor.id", "Vibration sensor id", "ID датчика вибрации"),
  q("vibration_monitor.velocity", "mm/s", "Vibration velocity RMS", "Скорость вибрации RMS"),
  q("vibration_monitor.acceleration", "m/s2", "Vibration acceleration", "Ускорение вибрации"),
  q("vibration_monitor.envelope", "m/s2", "Envelope amplitude", "Амплитуда огибающей"),
  q("vibration_monitor.temp", "Cel", "Bearing temperature", "Температура подшипника"),
  logical("vibration_monitor.alarm", "Vibration alarm", "Тревога по вибрации"),
  enu("vibration_monitor.severity", ["good", "satisfactory", "unsatisfactory", "unacceptable"], "ISO severity", "Тяжесть по ISO"),
]);

write("layer-b-lubrication.json", [
  id("lubrication.system.id", "Lubrication system id", "ID системы смазки"),
  id("lubrication.point.id", "Lube point id", "ID точки смазки"),
  q("lubrication.oil.pressure", "Pa", "Oil pressure", "Давление масла"),
  q("lubrication.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  q("lubrication.oil.level", "%", "Oil level", "Уровень масла", { range: { min: 0, max: 100 } }),
  q("lubrication.particle.count", "-", "Particle count ISO", "Число частиц ISO", { encodings: ["i32"] }),
  q("lubrication.water.ppm", "ppm", "Water in oil", "Вода в масле"),
  enu("lubrication.state", ["ok", "low", "contaminated", "overdue", "fault"], "Lube state", "Состояние смазки"),
]);

write("layer-b-cmms.json", [
  id("cmms.workorder.id", "CMMS work order id", "ID наряда CMMS"),
  id("cmms.asset.id", "CMMS asset id", "ID актива CMMS"),
  q("cmms.priority", "-", "Work order priority", "Приоритет наряда", { encodings: ["i16"] }),
  q("cmms.mttr.h", "h", "MTTR hours", "MTTR часы"),
  q("cmms.backlog.h", "h", "Backlog hours", "Бэклог часов"),
  logical("cmms.wo.open", "Work order open", "Наряд открыт"),
  enu("cmms.wo.type", ["corrective", "preventive", "predictive", "project", "emergency"], "WO type", "Тип наряда"),
  enu("cmms.wo.status", ["new", "planned", "in_progress", "held", "done", "cancelled"], "WO status", "Статус наряда"),
]);

write("layer-b-calibration_lab.json", [
  id("calibration_lab.device.id", "DUT device id", "ID поверяемого СИ"),
  id("calibration_lab.cert.id", "Calibration certificate id", "ID свидетельства поверки"),
  q("calibration_lab.error", "%", "Calibration error", "Погрешность поверки"),
  q("calibration_lab.uncertainty", "%", "Expanded uncertainty", "Расширенная неопределённость"),
  q("calibration_lab.due.d", "d", "Days until due", "Дней до срока"),
  logical("calibration_lab.pass", "Calibration pass", "Поверка пройдена"),
  enu("calibration_lab.result", ["pass", "adjust", "fail", "limited"], "Calibration result", "Результат поверки"),
  enu("calibration_lab.domain", ["pressure", "temp", "flow", "electrical", "dimensional", "other"], "Calibration domain", "Область поверки"),
]);

write("layer-b-ndt.json", [
  id("ndt.job.id", "NDT job id", "ID задания НК"),
  id("ndt.asset.id", "Inspected asset id", "ID контролируемого объекта"),
  q("ndt.defect.length", "mm", "Defect length", "Длина дефекта"),
  q("ndt.defect.depth", "mm", "Defect depth", "Глубина дефекта"),
  q("ndt.coverage", "%", "Inspection coverage", "Покрытие контролем", { range: { min: 0, max: 100 } }),
  logical("ndt.accept", "Accepted", "Принято"),
  media("ndt.report.ref", "NDT report ref", "Референс отчёта НК"),
  enu("ndt.method", ["ut", "rt", "mt", "pt", "et", "pa", "tofd", "other"], "NDT method", "Метод НК"),
]);

write("layer-b-rope_access.json", [
  id("rope_access.team.id", "Rope access team id", "ID бригады промышленного альпинизма"),
  id("rope_access.job.id", "Rope access job id", "ID работы на высоте"),
  q("rope_access.height.m", "m", "Work height", "Высота работ"),
  q("rope_access.wind", "m/s", "Wind at height", "Ветер на высоте"),
  logical("rope_access.rescue.ready", "Rescue plan ready", "План спасения готов"),
  logical("rope_access.weather.hold", "Weather hold", "Остановка по погоде"),
  enu("rope_access.task", ["inspect", "paint", "clean", "repair", "install", "other"], "Task type", "Тип задачи"),
  enu("rope_access.status", ["brief", "ascent", "work", "descent", "complete", "abort"], "Job status", "Статус работы"),
]);

write("layer-b-scaffold.json", [
  id("scaffold.id", "Scaffold id", "ID лесов"),
  id("scaffold.site.id", "Scaffold site id", "ID площадки лесов"),
  q("scaffold.load.rating", "kg/m2", "Load rating", "Допустимая нагрузка"),
  q("scaffold.height", "m", "Scaffold height", "Высота лесов"),
  q("scaffold.inspect.age_d", "d", "Days since inspection", "Дней с осмотра"),
  logical("scaffold.tagged.safe", "Safe-to-use tag", "Бирка «безопасно»"),
  logical("scaffold.modified", "Unauthorized modification", "Несанкционированное изменение"),
  enu("scaffold.status", ["erecting", "in_use", "altering", "dismantling", "condemned"], "Scaffold status", "Статус лесов"),
]);

write("layer-b-crane_ops.json", [
  id("crane_ops.crane.id", "Crane id", "ID крана"),
  id("crane_ops.lift.id", "Lift plan id", "ID плана подъёма"),
  q("crane_ops.load", "t", "Hook load", "Нагрузка на крюке"),
  q("crane_ops.radius", "m", "Working radius", "Вылет"),
  q("crane_ops.wind", "m/s", "Wind speed", "Скорость ветра"),
  q("crane_ops.utilization", "%", "Capacity utilization", "Использование грузоподъёмности", { range: { min: 0, max: 100 } }),
  logical("crane_ops.overload", "Overload cutout", "Отсечка по перегрузу"),
  enu("crane_ops.state", ["idle", "lift", "travel", "outofservice", "fault"], "Crane state", "Состояние крана"),
]);

write("layer-b-forklift.json", [
  id("forklift.id", "Forklift id", "ID погрузчика"),
  id("forklift.warehouse.id", "Warehouse id", "ID склада погрузчика"),
  q("forklift.battery.soc", "%", "Battery / fuel level", "Заряд / топливо", { range: { min: 0, max: 100 } }),
  q("forklift.hours", "h", "Operating hours", "Моточасы"),
  q("forklift.load", "kg", "Current load", "Текущий груз"),
  q("forklift.impacts", "-", "Impact events", "Удары", { encodings: ["i32"] }),
  logical("forklift.seatbelt", "Seatbelt fastened", "Ремень застёгнут"),
  enu("forklift.state", ["idle", "travel", "lift", "charge", "maintenance"], "Forklift state", "Состояние погрузчика"),
]);

write("layer-b-agv.json", [
  id("agv.id", "AGV id", "ID AGV"),
  id("agv.mission.id", "AGV mission id", "ID миссии AGV"),
  q("agv.battery.soc", "%", "AGV battery SoC", "SoC батареи AGV", { range: { min: 0, max: 100 } }),
  q("agv.speed", "m/s", "AGV speed", "Скорость AGV"),
  q("agv.mission.progress", "%", "Mission progress", "Прогресс миссии", { range: { min: 0, max: 100 } }),
  logical("agv.blocked", "Path blocked", "Путь заблокирован"),
  logical("agv.estop", "E-stop active", "Аварийный стоп"),
  enu("agv.state", ["idle", "navigate", "load", "unload", "charge", "fault"], "AGV state", "Состояние AGV"),
]);

write("layer-b-amr.json", [
  id("amr.id", "AMR id", "ID AMR"),
  id("amr.fleet.id", "AMR fleet id", "ID флота AMR"),
  q("amr.battery.soc", "%", "AMR battery SoC", "SoC батареи AMR", { range: { min: 0, max: 100 } }),
  q("amr.localization.score", "%", "Localization confidence", "Уверенность локализации", { range: { min: 0, max: 100 } }),
  q("amr.payload.kg", "kg", "Payload mass", "Масса полезной нагрузки"),
  q("amr.obstacle.distance", "m", "Nearest obstacle", "Ближайшее препятствие"),
  logical("amr.manual", "Manual override", "Ручное управление"),
  enu("amr.state", ["idle", "navigate", "wait", "charge", "error"], "AMR state", "Состояние AMR"),
]);

write("layer-b-pick_to_light.json", [
  id("pick_to_light.bay.id", "PTL bay id", "ID зоны PTL"),
  id("pick_to_light.order.id", "Pick order id", "ID заказа комплектации"),
  q("pick_to_light.lights.active", "-", "Active lights", "Активных индикаторов", { encodings: ["i16"] }),
  q("pick_to_light.picks.hour", "/h", "Picks per hour", "Отборов в час"),
  q("pick_to_light.error.rate", "%", "Pick error rate", "Доля ошибок", { range: { min: 0, max: 100 } }),
  logical("pick_to_light.confirm", "Pick confirmed", "Отбор подтверждён"),
  enu("pick_to_light.mode", ["pick", "put", "count", "idle"], "PTL mode", "Режим PTL"),
  enu("pick_to_light.order.state", ["queued", "active", "complete", "short", "cancelled"], "Order state", "Состояние заказа"),
]);

write("layer-b-sortation.json", [
  id("sortation.system.id", "Sortation system id", "ID сортировщика"),
  id("sortation.chute.id", "Sort chute id", "ID накопителя"),
  q("sortation.rate", "/h", "Items per hour", "Единиц в час"),
  q("sortation.divert.accuracy", "%", "Divert accuracy", "Точность направления", { range: { min: 0, max: 100 } }),
  q("sortation.recycle.rate", "%", "Recirculation rate", "Доля рециркуляции", { range: { min: 0, max: 100 } }),
  q("sortation.jam.count", "-", "Jam count", "Число заторов", { encodings: ["i32"] }),
  logical("sortation.chute.full", "Chute full", "Накопитель полон"),
  enu("sortation.type", ["crossbelt", "tilttray", "shoe", "bombay", "other"], "Sorter type", "Тип сортировщика"),
]);

write("layer-b-conveyor.json", [
  id("conveyor.line.id", "Conveyor line id", "ID конвейера"),
  id("conveyor.zone.id", "Conveyor zone id", "ID зоны конвейера"),
  q("conveyor.belt.speed", "m/s", "Belt speed", "Скорость ленты"),
  q("conveyor.motor.current", "A", "Motor current", "Ток двигателя"),
  q("conveyor.utilization", "%", "Utilization", "Загрузка", { range: { min: 0, max: 100 } }),
  logical("conveyor.jam", "Jam detected", "Затор"),
  logical("conveyor.estop", "E-stop", "Аварийный стоп"),
  enu("conveyor.state", ["off", "run", "jog", "fault", "bypass"], "Conveyor state", "Состояние конвейера"),
]);

write("layer-b-palletizer.json", [
  id("palletizer.id", "Palletizer id", "ID паллетайзера"),
  id("palletizer.sku.id", "Palletized SKU id", "ID паллетируемого SKU"),
  q("palletizer.cycles.hour", "/h", "Cycles per hour", "Циклов в час"),
  q("palletizer.layer.count", "-", "Layers on pallet", "Слоёв на паллете", { encodings: ["i16"] }),
  q("palletizer.reject.rate", "%", "Reject rate", "Доля брака", { range: { min: 0, max: 100 } }),
  logical("palletizer.pallet.complete", "Pallet complete", "Паллета готова"),
  enu("palletizer.mode", ["auto", "semi", "manual", "changeover"], "Palletizer mode", "Режим паллетайзера"),
  enu("palletizer.state", ["idle", "build", "wrap", "discharge", "fault"], "Palletizer state", "Состояние паллетайзера"),
]);

write("layer-b-stretch_wrap.json", [
  id("stretch_wrap.machine.id", "Stretch wrapper id", "ID паллетообмотчика"),
  q("stretch_wrap.film.usage", "m", "Film used", "Расход плёнки"),
  q("stretch_wrap.pre_stretch", "%", "Pre-stretch", "Предрастяжение", { range: { min: 0, max: 400 } }),
  q("stretch_wrap.revolutions", "-", "Turntable revolutions", "Обороты стола", { encodings: ["i16"] }),
  q("stretch_wrap.cycle.s", "s", "Wrap cycle time", "Время цикла обмотки"),
  logical("stretch_wrap.film.break", "Film break", "Обрыв плёнки"),
  enu("stretch_wrap.pattern", ["spiral", "cross", "top_sheet", "custom"], "Wrap pattern", "Схема обмотки"),
  enu("stretch_wrap.state", ["idle", "wrap", "cut", "fault"], "Wrapper state", "Состояние обмотчика"),
]);

write("layer-b-labeler.json", [
  id("labeler.machine.id", "Labeler id", "ID этикетировщика"),
  id("labeler.sku.id", "Labeled SKU id", "ID маркируемого SKU"),
  q("labeler.apply.rate", "/min", "Labels per minute", "Этикеток в минуту"),
  q("labeler.reject.rate", "%", "Label reject rate", "Доля брака этикеток", { range: { min: 0, max: 100 } }),
  q("labeler.reel.remaining", "%", "Reel remaining", "Остаток рулона", { range: { min: 0, max: 100 } }),
  logical("labeler.vision.fail", "Vision inspection fail", "Брак по зрению"),
  enu("labeler.type", ["pressure", "sleeve", "print_apply", "laser", "other"], "Labeler type", "Тип этикетировщика"),
  enu("labeler.state", ["run", "changeover", "jam", "empty", "fault"], "Labeler state", "Состояние этикетировщика"),
]);

write("layer-b-checkweigher.json", [
  id("checkweigher.id", "Checkweigher id", "ID чеквейера"),
  id("checkweigher.sku.id", "Weighed SKU id", "ID взвешиваемого SKU"),
  q("checkweigher.weight", "g", "Measured weight", "Измеренная масса"),
  q("checkweigher.target", "g", "Target weight", "Целевая масса"),
  q("checkweigher.stddev", "g", "Weight stddev", "СКО массы"),
  q("checkweigher.reject.rate", "%", "Reject rate", "Доля отбраковки", { range: { min: 0, max: 100 } }),
  logical("checkweigher.under", "Underweight", "Недовес"),
  enu("checkweigher.result", ["pass", "under", "over", "metal", "fault"], "Check result", "Результат контроля"),
]);

write("layer-b-metal_detector_line.json", [
  id("metal_detector_line.id", "In-line metal detector id", "ID линейного металлодетектора"),
  id("metal_detector_line.line.id", "Production line id", "ID производственной линии"),
  q("metal_detector_line.sensitivity", "mm", "Test piece size", "Размер тест-образца"),
  q("metal_detector_line.reject.count", "-", "Reject count", "Число отбраковок", { encodings: ["i32"] }),
  q("metal_detector_line.test.age_min", "min", "Minutes since test", "Минут с теста"),
  logical("metal_detector_line.trip", "Metal detected", "Металл обнаружен"),
  logical("metal_detector_line.test.due", "Test due", "Требуется тест"),
  enu("metal_detector_line.state", ["run", "test", "bypass", "fault"], "Detector state", "Состояние детектора"),
]);

write("layer-b-xray_inspect.json", [
  id("xray_inspect.system.id", "X-ray inspection system id", "ID рентген-инспекции"),
  id("xray_inspect.sku.id", "Inspected SKU id", "ID проверяемого SKU"),
  q("xray_inspect.reject.rate", "%", "Reject rate", "Доля отбраковки", { range: { min: 0, max: 100 } }),
  q("xray_inspect.dose", "uGy", "Product dose", "Доза на продукт"),
  q("xray_inspect.throughput", "/min", "Units per minute", "Единиц в минуту"),
  logical("xray_inspect.contaminant", "Contaminant found", "Обнаружен загрязнитель"),
  media("xray_inspect.image.ref", "X-ray image ref", "Референс рентген-снимка"),
  enu("xray_inspect.result", ["pass", "reject", "suspect", "fault"], "Inspection result", "Результат инспекции"),
]);

write("layer-b-cip.json", [
  id("cip.circuit.id", "CIP circuit id", "ID контура CIP"),
  id("cip.recipe.id", "CIP recipe id", "ID рецепта CIP"),
  q("cip.temp", "Cel", "CIP temperature", "Температура CIP"),
  q("cip.solution.conductivity", "mS/cm", "CIP conductivity", "Электропроводность CIP"),
  q("cip.flow", "L/min", "CIP flow", "Расход CIP"),
  q("cip.cycle.min", "min", "CIP cycle time", "Время цикла CIP"),
  logical("cip.complete", "CIP complete", "CIP завершён"),
  enu("cip.step", ["pre_rinse", "caustic", "acid", "sanitize", "final_rinse", "idle"], "CIP step", "Шаг CIP"),
]);

write("layer-b-sip.json", [
  id("sip.circuit.id", "SIP circuit id", "ID контура SIP"),
  id("sip.recipe.id", "SIP recipe id", "ID рецепта SIP"),
  q("sip.temp", "Cel", "SIP temperature", "Температура SIP"),
  q("sip.pressure", "Pa", "SIP pressure", "Давление SIP"),
  q("sip.f0", "min", "F0 value", "Значение F0"),
  q("sip.hold.min", "min", "Hold time", "Время выдержки"),
  logical("sip.pass", "SIP accepted", "SIP принят"),
  enu("sip.state", ["heat", "hold", "cool", "complete", "abort", "fault"], "SIP state", "Состояние SIP"),
]);

write("layer-b-clean_in_place_tank.json", [
  id("clean_in_place_tank.id", "CIP tank id", "ID CIP-ёмкости"),
  q("clean_in_place_tank.level", "%", "Tank level", "Уровень ёмкости", { range: { min: 0, max: 100 } }),
  q("clean_in_place_tank.temp", "Cel", "Solution temperature", "Температура раствора"),
  q("clean_in_place_tank.concentration", "%", "Chemical concentration", "Концентрация химии", { range: { min: 0, max: 100 } }),
  q("clean_in_place_tank.conductivity", "mS/cm", "Solution conductivity", "Электропроводность раствора"),
  logical("clean_in_place_tank.low", "Low level", "Низкий уровень"),
  enu("clean_in_place_tank.chemical", ["caustic", "acid", "sanitize", "rinse", "other"], "Chemical type", "Тип химии"),
  enu("clean_in_place_tank.state", ["ready", "in_use", "make_up", "dump", "fault"], "Tank state", "Состояние ёмкости"),
]);

write("layer-b-hvac_vav.json", [
  id("hvac_vav.box.id", "VAV box id", "ID VAV-бокса"),
  id("hvac_vav.zone.id", "VAV zone id", "ID зоны VAV"),
  q("hvac_vav.damper", "%", "Damper position", "Положение заслонки", { range: { min: 0, max: 100 } }),
  q("hvac_vav.airflow", "m3/h", "Supply airflow", "Расход притока"),
  q("hvac_vav.temp.setpoint", "Cel", "Zone setpoint", "Уставка зоны"),
  q("hvac_vav.temp.zone", "Cel", "Zone temperature", "Температура зоны"),
  logical("hvac_vav.reheat", "Reheat active", "Догрев активен"),
  enu("hvac_vav.mode", ["heat", "cool", "deadband", "occupied", "unoccupied"], "VAV mode", "Режим VAV"),
]);

write("layer-b-bms.json", [
  id("bms.site.id", "BMS site id", "ID объекта BMS"),
  id("bms.controller.id", "BMS controller id", "ID контроллера BMS"),
  q("bms.points.online", "%", "Points online", "Точек online", { range: { min: 0, max: 100 } }),
  q("bms.alarms.active", "-", "Active alarms", "Активных тревог", { encodings: ["i32"] }),
  q("bms.energy.today", "Wh", "Energy today", "Энергия за сутки"),
  logical("bms.schedule.override", "Schedule override", "Переопределение расписания"),
  enu("bms.mode", ["auto", "manual", "emergency", "commissioning"], "BMS mode", "Режим BMS"),
  enu("bms.health", ["normal", "degraded", "offline", "cyber_alert"], "BMS health", "Состояние BMS"),
]);

write("layer-b-access_control.json", [
  id("access_control.door.id", "Access door id", "ID двери СКУД"),
  id("access_control.badge.id", "Badge id", "ID пропуска", { sensitivity: "internal" }),
  q("access_control.events.hour", "/h", "Access events per hour", "Событий доступа в час"),
  logical("access_control.door.open", "Door open", "Дверь открыта"),
  logical("access_control.forced", "Forced open", "Взлом"),
  logical("access_control.held", "Door held open", "Дверь удерживается"),
  enu("access_control.result", ["grant", "deny", "duress", "antipassback", "expired"], "Access result", "Результат доступа"),
  enu("access_control.door.state", ["locked", "unlocked", "open", "forced", "fault"], "Door state", "Состояние двери"),
]);

write("layer-b-video_analytics.json", [
  id("video_analytics.camera.id", "Analytics camera id", "ID камеры аналитики"),
  id("video_analytics.stream.id", "Analytics stream id", "ID потока аналитики"),
  q("video_analytics.people.count", "-", "People count", "Число людей", { encodings: ["i32"] }),
  q("video_analytics.vehicle.count", "-", "Vehicle count", "Число ТС", { encodings: ["i32"] }),
  q("video_analytics.fps", "/s", "Inference FPS", "FPS инференса"),
  logical("video_analytics.intrusion", "Intrusion event", "Вторжение"),
  logical("video_analytics.loitering", "Loitering event", "Околачивание"),
  enu("video_analytics.model", ["detect", "track", "classify", "anomalydetect", "other"], "Model type", "Тип модели"),
]);

write("layer-b-intrusion.json", [
  id("intrusion.zone.id", "Intrusion zone id", "ID зоны охраны"),
  id("intrusion.panel.id", "Intrusion panel id", "ID охранной панели"),
  logical("intrusion.armed", "Zone armed", "Зона на охране"),
  logical("intrusion.alarm.active", "Intrusion alarm", "Охранная тревога"),
  logical("intrusion.tamper", "Device tamper", "Вскрытие устройства"),
  q("intrusion.sensors.fault", "-", "Faulted sensors", "Неисправных датчиков", { encodings: ["i16"] }),
  enu("intrusion.mode", ["disarmed", "away", "stay", "night", "test"], "Arming mode", "Режим постановки"),
  enu("intrusion.state", ["normal", "alarm", "trouble", "bypass"], "Zone state", "Состояние зоны"),
]);

write("layer-b-perimeter.json", [
  id("perimeter.sector.id", "Perimeter sector id", "ID сектора периметра"),
  id("perimeter.sensor.id", "Perimeter sensor id", "ID датчика периметра"),
  q("perimeter.fence.tension", "N", "Fence tension", "Натяжение ограждения"),
  q("perimeter.cable.sensitivity", "-", "Cable sensitivity", "Чувствительность кабеля"),
  logical("perimeter.breach", "Perimeter breach", "Нарушение периметра"),
  logical("perimeter.cut", "Fence cut", "Перерезание ограждения"),
  enu("perimeter.tech", ["pir", "microwave", "fiber", "electric", "radar", "other"], "Perimeter tech", "Технология периметра"),
  enu("perimeter.state", ["secure", "alarm", "mask", "fault"], "Sector state", "Состояние сектора"),
]);

write("layer-b-fire_alarm_panel.json", [
  id("fire_alarm_panel.id", "FACP id", "ID ППКП"),
  id("fire_alarm_panel.loop.id", "FACP loop id", "ID шлейфа ППКП"),
  q("fire_alarm_panel.devices", "-", "Devices on loop", "Устройств на шлейфе", { encodings: ["i32"] }),
  q("fire_alarm_panel.alarms", "-", "Active fire alarms", "Активных пожарных тревог", { encodings: ["i16"] }),
  logical("fire_alarm_panel.silence", "Alarms silenced", "Тревоги отключены"),
  logical("fire_alarm_panel.trouble", "System trouble", "Неисправность системы"),
  enu("fire_alarm_panel.state", ["normal", "alarm", "supervisory", "trouble", "test"], "Panel state", "Состояние панели"),
  enu("fire_alarm_panel.protocol", ["conventional", "addressable", "wireless", "hybrid"], "Panel protocol", "Протокол панели"),
]);

write("layer-b-public_address.json", [
  id("public_address.zone.id", "PA zone id", "ID зоны оповещения"),
  id("public_address.amp.id", "PA amplifier id", "ID усилителя СОУЭ"),
  q("public_address.level", "dB", "Zone SPL", "Уровень в зоне"),
  q("public_address.impedance", "Ohm", "Line impedance", "Сопротивление линии"),
  logical("public_address.paging", "Paging active", "Оповещение активно"),
  logical("public_address.evac", "Evacuation message", "Эвакуационное сообщение"),
  enu("public_address.source", ["mic", "evac", "bgm", "message", "silent"], "Audio source", "Источник звука"),
  enu("public_address.state", ["idle", "page", "evac", "fault", "test"], "PA state", "Состояние СОУЭ"),
]);

write("layer-b-elevator_bank.json", [
  id("elevator_bank.group.id", "Elevator group id", "ID группы лифтов"),
  id("elevator_bank.car.id", "Elevator car id", "ID кабины"),
  q("elevator_bank.cars.running", "-", "Cars running", "Кабин в работе", { encodings: ["i16"] }),
  q("elevator_bank.wait.avg_s", "s", "Average wait", "Среднее ожидание"),
  q("elevator_bank.trips.hour", "/h", "Trips per hour", "Рейсов в час"),
  q("elevator_bank.load.avg", "%", "Average car load", "Средняя загрузка кабины", { range: { min: 0, max: 100 } }),
  logical("elevator_bank.lobby.peak", "Lobby peak mode", "Пиковый режим лобби"),
  enu("elevator_bank.mode", ["normal", "up_peak", "down_peak", "fire", "independent"], "Group mode", "Режим группы"),
]);

write("layer-b-escalator.json", [
  id("escalator.id", "Escalator id", "ID эскалатора"),
  q("escalator.speed", "m/s", "Escalator speed", "Скорость эскалатора"),
  q("escalator.motor.current", "A", "Motor current", "Ток двигателя"),
  q("escalator.passengers.hour", "/h", "Passengers per hour", "Пассажиров в час"),
  logical("escalator.handrail.ok", "Handrail OK", "Поручень OK"),
  logical("escalator.comb.fault", "Comb plate fault", "Неисправность гребенки"),
  enu("escalator.direction", ["up", "down", "stopped"], "Direction", "Направление"),
  enu("escalator.state", ["run", "stop", "fault", "maintenance"], "Escalator state", "Состояние эскалатора"),
]);

write("layer-b-moving_walk.json", [
  id("moving_walk.id", "Moving walkway id", "ID траволатора"),
  q("moving_walk.speed", "m/s", "Walkway speed", "Скорость траволатора"),
  q("moving_walk.motor.current", "A", "Motor current", "Ток двигателя"),
  q("moving_walk.passengers.hour", "/h", "Passengers per hour", "Пассажиров в час"),
  logical("moving_walk.emergency.stop", "Emergency stop", "Аварийный стоп"),
  logical("moving_walk.skirt.fault", "Skirt fault", "Неисправность юбки"),
  enu("moving_walk.direction", ["forward", "reverse", "stopped"], "Direction", "Направление"),
  enu("moving_walk.state", ["run", "stop", "fault", "maintenance"], "Walkway state", "Состояние траволатора"),
]);

write("layer-b-revolving_door.json", [
  id("revolving_door.id", "Revolving door id", "ID вращающейся двери"),
  q("revolving_door.speed", "rpm", "Rotation speed", "Скорость вращения"),
  q("revolving_door.throughput", "/h", "People per hour", "Человек в час"),
  logical("revolving_door.auto", "Automatic mode", "Автоматический режим"),
  logical("revolving_door.bookfold", "Bookfold open", "Распахнута книжкой"),
  logical("revolving_door.obstruction", "Obstruction detected", "Препятствие"),
  enu("revolving_door.mode", ["auto", "manual", "locked", "summer", "egress"], "Door mode", "Режим двери"),
  enu("revolving_door.state", ["run", "stop", "fault", "egress"], "Door state", "Состояние двери"),
]);

write("layer-b-automatic_door.json", [
  id("automatic_door.id", "Automatic door id", "ID автоматической двери"),
  q("automatic_door.cycles", "-", "Open/close cycles", "Циклы открытий", { encodings: ["i32"] }),
  q("automatic_door.open.time_s", "s", "Hold-open time", "Время удержания"),
  logical("automatic_door.open", "Door open", "Дверь открыта"),
  logical("automatic_door.sensor.active", "Presence sensor active", "Датчик присутствия"),
  logical("automatic_door.locked", "Electrically locked", "Электрозамок"),
  enu("automatic_door.type", ["sliding", "swing", "telescope", "folding", "other"], "Door type", "Тип двери"),
  enu("automatic_door.state", ["closed", "opening", "open", "closing", "fault"], "Door state", "Состояние двери"),
]);

write("layer-b-parking_barrier.json", [
  id("parking_barrier.id", "Parking barrier id", "ID шлагбаума"),
  id("parking_barrier.lane.id", "Barrier lane id", "ID полосы шлагбаума"),
  q("parking_barrier.cycles", "-", "Raise cycles", "Циклы подъёма", { encodings: ["i32"] }),
  logical("parking_barrier.raised", "Barrier raised", "Шлагбаум поднят"),
  logical("parking_barrier.loop.active", "Loop detector active", "Петля активна"),
  logical("parking_barrier.intercom", "Intercom call", "Вызов по домофону"),
  enu("parking_barrier.mode", ["auto", "manual", "open", "closed", "free_flow"], "Barrier mode", "Режим шлагбаума"),
  enu("parking_barrier.state", ["down", "up", "moving", "fault"], "Barrier state", "Состояние шлагбаума"),
]);

write("layer-b-ticket_gate.json", [
  id("ticket_gate.id", "Ticket gate id", "ID турникета"),
  id("ticket_gate.station.id", "Station id", "ID станции"),
  q("ticket_gate.throughput", "/min", "Passengers per minute", "Пассажиров в минуту"),
  q("ticket_gate.reject.rate", "%", "Reject rate", "Доля отказов", { range: { min: 0, max: 100 } }),
  logical("ticket_gate.open", "Aisle open", "Проход открыт"),
  logical("ticket_gate.tailgate", "Tailgating detected", "Проход следом"),
  enu("ticket_gate.direction", ["entry", "exit", "bidirectional"], "Gate direction", "Направление турникета"),
  enu("ticket_gate.state", ["service", "closed", "free", "fault", "emergency"], "Gate state", "Состояние турникета"),
]);

write("layer-b-fare_collection.json", [
  id("fare_collection.validator.id", "Fare validator id", "ID валидатора"),
  id("fare_collection.media.id", "Fare media id", "ID проездного", { sensitivity: "internal" }),
  q("fare_collection.txn.count", "-", "Transactions today", "Транзакций сегодня", { encodings: ["i32"] }),
  q("fare_collection.revenue", "-", "Revenue minor units", "Выручка", { encodings: ["i32"] }),
  logical("fare_collection.offline", "Offline mode", "Офлайн-режим"),
  logical("fare_collection.fraud", "Fraud flag", "Признак мошенничества"),
  enu("fare_collection.media.type", ["card", "phone", "paper", "bank", "other"], "Media type", "Тип носителя"),
  enu("fare_collection.result", ["ok", "declined", "insufficient", "expired", "error"], "Validation result", "Результат валидации"),
]);

write("layer-b-evacuation.json", [
  id("evacuation.zone.id", "Evacuation zone id", "ID зоны эвакуации"),
  id("evacuation.event.id", "Evacuation event id", "ID события эвакуации"),
  q("evacuation.occupants.remaining", "-", "Occupants remaining", "Оставшихся людей", { encodings: ["i32"] }),
  q("evacuation.exits.clear", "-", "Clear exits", "Свободных выходов", { encodings: ["i16"] }),
  q("evacuation.duration.min", "min", "Evacuation duration", "Длительность эвакуации"),
  logical("evacuation.active", "Evacuation active", "Эвакуация активна"),
  logical("evacuation.all_clear", "All clear", "Отбой"),
  enu("evacuation.phase", ["alarm", "egress", "assembly", "accountability", "reentry"], "Evacuation phase", "Фаза эвакуации"),
]);

write("layer-b-shelter.json", [
  id("shelter.site.id", "Shelter site id", "ID убежища / ПВР"),
  q("shelter.capacity", "-", "Shelter capacity", "Вместимость", { encodings: ["i32"] }),
  q("shelter.occupancy", "-", "Current occupancy", "Текущая заполненность", { encodings: ["i32"] }),
  q("shelter.supplies.days", "d", "Supply days remaining", "Запасов на дней"),
  q("shelter.power.runtime_h", "h", "Backup power hours", "Часы резервного питания"),
  logical("shelter.open", "Shelter open", "Убежище открыто"),
  enu("shelter.type", ["storm", "heat", "cold", "earthquake", "general"], "Shelter type", "Тип убежища"),
  enu("shelter.status", ["standby", "open", "full", "closing", "closed"], "Shelter status", "Статус убежища"),
]);

write("layer-b-disaster_relief.json", [
  id("disaster_relief.incident.id", "Disaster incident id", "ID ЧС"),
  id("disaster_relief.depot.id", "Relief depot id", "ID склада помощи"),
  q("disaster_relief.meals.day", "-", "Meals distributed/day", "Рационов в сутки", { encodings: ["i32"] }),
  q("disaster_relief.water.m3", "m3", "Water distributed", "Раздано воды"),
  q("disaster_relief.kits", "-", "Relief kits issued", "Выдано наборов", { encodings: ["i32"] }),
  q("disaster_relief.volunteers", "-", "Active volunteers", "Активных волонтёров", { encodings: ["i32"] }),
  enu("disaster_relief.phase", ["alert", "response", "relief", "recovery", "demobilize"], "Relief phase", "Фаза помощи"),
  enu("disaster_relief.hazard", ["flood", "quake", "storm", "wildfire", "conflict", "other"], "Hazard type", "Тип опасности"),
]);

console.log("Layer B10 seeds written");
