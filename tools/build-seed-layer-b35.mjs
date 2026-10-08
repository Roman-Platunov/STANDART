#!/usr/bin/env node
/**
 * Layer B35 — power generation island: nuclear NSSS/BOP, fossil/CCGT steam,
 * hydro units, fusion plant systems.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B35", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

// --- Nuclear NSSS / BOP ---
write("layer-b-rx_core_np.json", [
  id("rx_core_np.id", "Reactor core id", "ID активной зоны"),
  q("rx_core_np.thermal", "MW", "Thermal power", "Тепловая мощность"),
  q("rx_core_np.flux", "n/cm2.s", "Neutron flux", "Поток нейтронов"),
  q("rx_core_np.period", "s", "Reactor period", "Период реактора"),
  q("rx_core_np.reactivity", "pcm", "Reactivity", "Реактивность"),
  q("rx_core_np.burnup", "GWd/tU", "Average burnup", "Среднее выгорание"),
  logical("rx_core_np.scram", "Scram / trip", "АЗ / скрам"),
  enu("rx_core_np.state", ["power", "startup", "shutdown", "refuel"], "Core state", "Состояние зоны"),
]);

write("layer-b-pressuriz_np.json", [
  id("pressuriz_np.id", "Pressurizer id", "ID компенсатора давления"),
  q("pressuriz_np.pressure", "MPa", "Pressure", "Давление"),
  q("pressuriz_np.level", "%", "Level", "Уровень", { range: { min: 0, max: 100 } }),
  q("pressuriz_np.temp", "Cel", "Water temperature", "Температура воды"),
  q("pressuriz_np.heaters", "kW", "Heater power", "Мощность нагревателей"),
  q("pressuriz_np.spray", "kg/s", "Spray flow", "Расход спрея"),
  logical("pressuriz_np.relief", "Relief / PORV open", "Сброс / КСД открыт"),
  enu("pressuriz_np.state", ["normal", "heat", "spray", "fault"], "Pressurizer state", "Состояние КД"),
]);

write("layer-b-sg_np.json", [
  id("sg_np.id", "Nuclear steam generator id", "ID парогенератора АЭС"),
  q("sg_np.level", "%", "Narrow-range level", "Уровень (узкий)", { range: { min: 0, max: 100 } }),
  q("sg_np.steam", "kg/s", "Steam flow", "Расход пара"),
  q("sg_np.feed", "kg/s", "Feedwater flow", "Расход питательной воды"),
  q("sg_np.pressure", "MPa", "Steam pressure", "Давление пара"),
  q("sg_np.blowdown", "kg/s", "Blowdown flow", "Продувка"),
  logical("sg_np.tube", "Tube leak suspected", "Подозрение на течь трубки"),
  enu("sg_np.state", ["steam", "isolate", "drain", "fault"], "SG state", "Состояние ПГ"),
]);

write("layer-b-rcp_np.json", [
  id("rcp_np.id", "Reactor coolant pump id", "ID ГЦН"),
  q("rcp_np.speed", "rpm", "Pump speed", "Обороты"),
  q("rcp_np.power", "MW", "Motor power", "Мощность двигателя"),
  q("rcp_np.seal", "L/h", "Seal leak-off", "Утечка уплотнения"),
  q("rcp_np.vibration", "mm/s", "Vibration", "Вибрация"),
  q("rcp_np.temp", "Cel", "Bearing temperature", "Температура подшипника"),
  logical("rcp_np.trip", "Pump trip", "Отключение насоса"),
  enu("rcp_np.state", ["run", "coast", "standby", "fault"], "RCP state", "Состояние ГЦН"),
]);

write("layer-b-rwst_np.json", [
  id("rwst_np.id", "RWST / IRWST id", "ID бака аварийного запаса"),
  q("rwst_np.level", "%", "Tank level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("rwst_np.temp", "Cel", "Water temperature", "Температура воды"),
  q("rwst_np.volume", "m3", "Usable volume", "Полезный объём"),
  q("rwst_np.boron", "ppm", "Boron concentration", "Концентрация бора"),
  q("rwst_np.out", "kg/s", "Outlet flow", "Расход на выход"),
  logical("rwst_np.low", "Level low", "Низкий уровень"),
  enu("rwst_np.state", ["ready", "inject", "recirc", "fault"], "Tank state", "Состояние бака"),
]);

write("layer-b-sfp_np.json", [
  id("sfp_np.id", "Spent fuel pool id", "ID бассейна выдержки"),
  q("sfp_np.level", "m", "Pool level", "Уровень бассейна"),
  q("sfp_np.temp", "Cel", "Pool temperature", "Температура бассейна"),
  q("sfp_np.cooling", "MW", "Cooling power", "Мощность охлаждения"),
  q("sfp_np.activity", "Bq", "Water activity", "Активность воды"),
  q("sfp_np.assemblies", "-", "Assemblies stored", "ТВС на хранении", { encodings: ["i32"] }),
  logical("sfp_np.leak", "Pool leak alarm", "Сигнал течи"),
  enu("sfp_np.state", ["normal", "heatup", "refuel", "fault"], "SFP state", "Состояние БВ"),
]);

write("layer-b-contain_np.json", [
  id("contain_np.id", "Containment id", "ID гермооболочки"),
  q("contain_np.pressure", "kPa", "Containment pressure", "Давление ГО"),
  q("contain_np.temp", "Cel", "Atmosphere temperature", "Температура атмосферы"),
  q("contain_np.h2", "%", "Hydrogen concentration", "Концентрация H2", { range: { min: 0, max: 100 } }),
  q("contain_np.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("contain_np.dose", "uSv/h", "Dose rate", "Мощность дозы"),
  logical("contain_np.isolate", "Isolation complete", "Изоляция завершена"),
  enu("contain_np.state", ["normal", "isolate", "vent", "fault"], "Containment state", "Состояние ГО"),
]);

write("layer-b-esf_dg_np.json", [
  id("esf_dg_np.id", "ESF emergency diesel id", "ID дизель-генератора СБ"),
  q("esf_dg_np.power", "MW", "Electrical power", "Электрическая мощность"),
  q("esf_dg_np.freq", "Hz", "Frequency", "Частота"),
  q("esf_dg_np.voltage", "kV", "Voltage", "Напряжение"),
  q("esf_dg_np.fuel", "%", "Fuel level", "Уровень топлива", { range: { min: 0, max: 100 } }),
  q("esf_dg_np.runtime.h", "h", "Runtime this month", "Наработка за месяц"),
  logical("esf_dg_np.ready", "Auto-start ready", "Готов к автозапуску"),
  enu("esf_dg_np.state", ["standby", "run", "test", "fault"], "EDG state", "Состояние ДГ"),
]);

write("layer-b-afw_np.json", [
  id("afw_np.id", "Aux / emergency feedwater id", "ID вспомогательной питательной воды"),
  q("afw_np.flow", "kg/s", "Feedwater flow", "Расход ПВ"),
  q("afw_np.pressure", "MPa", "Discharge pressure", "Давление нагнетания"),
  q("afw_np.temp", "Cel", "Water temperature", "Температура воды"),
  q("afw_np.tank", "%", "CST / tank level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("afw_np.trains", "-", "Trains available", "Доступных каналов", { encodings: ["i32"] }),
  logical("afw_np.actuate", "System actuated", "Система запущена"),
  enu("afw_np.state", ["standby", "inject", "recirc", "fault"], "AFW state", "Состояние ВПВ"),
]);

write("layer-b-ccw_np.json", [
  id("ccw_np.id", "Component cooling water id", "ID промконтура"),
  q("ccw_np.flow", "m3/h", "Loop flow", "Расход контура"),
  q("ccw_np.temp", "Cel", "Supply temperature", "Температура подачи"),
  q("ccw_np.return", "Cel", "Return temperature", "Температура возврата"),
  q("ccw_np.pressure", "kPa", "Header pressure", "Давление коллектора"),
  q("ccw_np.surge", "%", "Surge tank level", "Уровень расширителя", { range: { min: 0, max: 100 } }),
  logical("ccw_np.leak", "Loop leak", "Течь контура"),
  enu("ccw_np.state", ["cool", "isolate", "idle", "fault"], "CCW state", "Состояние промконтура"),
]);

write("layer-b-rhr_np.json", [
  id("rhr_np.id", "RHR / shutdown cooling id", "ID системы расхолаживания"),
  q("rhr_np.flow", "kg/s", "RHR flow", "Расход САОЗ/РХ"),
  q("rhr_np.temp", "Cel", "HX outlet temperature", "Температура после ТО"),
  q("rhr_np.heat", "MW", "Heat removal", "Теплосъём"),
  q("rhr_np.pressure", "MPa", "RCS / suction pressure", "Давление всаса"),
  q("rhr_np.trains", "-", "Trains in service", "Каналов в работе", { encodings: ["i32"] }),
  logical("rhr_np.aligned", "Aligned for SDC", "Выровнена на РХ"),
  enu("rhr_np.state", ["standby", "sdc", "lpci", "fault"], "RHR state", "Состояние РХ"),
]);

write("layer-b-si_np.json", [
  id("si_np.id", "Safety injection / ECCS id", "ID САОЗ"),
  q("si_np.flow", "kg/s", "Injection flow", "Расход впрыска"),
  q("si_np.pressure", "MPa", "Discharge pressure", "Давление нагнетания"),
  q("si_np.boron", "ppm", "Injected boron", "Бор во впрыске"),
  q("si_np.accum", "MPa", "Accumulator pressure", "Давление гидроёмкости"),
  q("si_np.trains", "-", "Trains available", "Доступных каналов", { encodings: ["i32"] }),
  logical("si_np.actuate", "SI actuated", "САОЗ запущена"),
  enu("si_np.state", ["standby", "inject", "recirc", "fault"], "SI state", "Состояние САОЗ"),
]);

write("layer-b-css_np.json", [
  id("css_np.id", "Containment spray id", "ID спринклерной системы ГО"),
  q("css_np.flow", "kg/s", "Spray flow", "Расход спринклера"),
  q("css_np.pressure", "MPa", "Header pressure", "Давление коллектора"),
  q("css_np.ph", "-", "Spray pH", "pH раствора"),
  q("css_np.chem", "%", "Chemical additive tank", "Уровень химреагента", { range: { min: 0, max: 100 } }),
  q("css_np.trains", "-", "Trains available", "Доступных каналов", { encodings: ["i32"] }),
  logical("css_np.actuate", "Spray actuated", "Спринклер запущен"),
  enu("css_np.state", ["standby", "spray", "recirc", "fault"], "CSS state", "Состояние спринклера"),
]);

write("layer-b-msiv_np.json", [
  id("msiv_np.id", "Main steam isolation valve id", "ID ГЗЗ"),
  q("msiv_np.position", "%", "Valve position", "Положение арматуры", { range: { min: 0, max: 100 } }),
  q("msiv_np.steam", "kg/s", "Steam flow", "Расход пара"),
  q("msiv_np.pressure", "MPa", "Upstream pressure", "Давление до клапана"),
  q("msiv_np.temp", "Cel", "Steam temperature", "Температура пара"),
  q("msiv_np.stroke.s", "s", "Last stroke time", "Время последнего хода"),
  logical("msiv_np.closed", "Fully closed", "Полностью закрыт"),
  enu("msiv_np.state", ["open", "closed", "stroke", "fault"], "MSIV state", "Состояние ГЗЗ"),
]);

write("layer-b-boric_np.json", [
  id("boric_np.id", "Boric acid makeup id", "ID борного узла"),
  q("boric_np.conc", "ppm", "Boric acid concentration", "Концентрация борной кислоты"),
  q("boric_np.flow", "kg/s", "Makeup flow", "Расход подпитки"),
  q("boric_np.tank", "%", "BAT level", "Уровень бака БК", { range: { min: 0, max: 100 } }),
  q("boric_np.temp", "Cel", "Solution temperature", "Температура раствора"),
  q("boric_np.batch", "kg", "Batch added today", "Добавлено за сутки"),
  logical("boric_np.crystall", "Crystallization risk", "Риск кристаллизации"),
  enu("boric_np.state", ["ready", "batch", "recirc", "fault"], "Boric state", "Состояние борного узла"),
]);

write("layer-b-letdown_np.json", [
  id("letdown_np.id", "CVCS letdown id", "ID продувки / очистки"),
  q("letdown_np.flow", "kg/s", "Letdown flow", "Расход продувки"),
  q("letdown_np.pressure", "MPa", "Letdown pressure", "Давление продувки"),
  q("letdown_np.temp", "Cel", "After HX temperature", "Температура после ТО"),
  q("letdown_np.activity", "Bq", "Activity", "Активность"),
  q("letdown_np.filter", "kPa", "Filter dP", "Перепад на фильтре"),
  logical("letdown_np.isolate", "Letdown isolated", "Продувка изолирована"),
  enu("letdown_np.state", ["purify", "divert", "isolate", "fault"], "Letdown state", "Состояние продувки"),
]);

write("layer-b-radmon_np.json", [
  id("radmon_np.id", "Radiation monitor id", "ID радиационного монитора"),
  q("radmon_np.dose", "uSv/h", "Dose rate", "Мощность дозы"),
  q("radmon_np.count", "cps", "Count rate", "Скорость счёта"),
  q("radmon_np.activity", "Bq", "Activity / concentration", "Активность / концентрация"),
  q("radmon_np.alarm", "uSv/h", "Alarm setpoint", "Уставка тревоги"),
  q("radmon_np.accum", "mSv", "Accumulated dose", "Накопленная доза"),
  logical("radmon_np.high", "High radiation alarm", "Сигнал высокой радиации"),
  enu("radmon_np.type", ["area", "process", "effluent", "other"], "Monitor type", "Тип монитора"),
]);

write("layer-b-refuel_np.json", [
  id("refuel_np.id", "Refueling machine id", "ID перегрузочной машины"),
  q("refuel_np.mast", "m", "Mast / gripper depth", "Глубина мачты / захвата"),
  q("refuel_np.load", "kg", "Grapple load", "Нагрузка на захват"),
  q("refuel_np.moves", "-", "Moves today", "Перестановок за сутки", { encodings: ["i32"] }),
  q("refuel_np.position", "mm", "Bridge / trolley position error", "Ошибка позиции моста"),
  q("refuel_np.camera", "%", "Camera / view quality", "Качество обзора", { range: { min: 0, max: 100 } }),
  logical("refuel_np.interlock", "Interlock clear", "Блокировки сняты"),
  enu("refuel_np.state", ["park", "latch", "transfer", "fault"], "Refuel state", "Состояние ПМ"),
]);

write("layer-b-radwaste_np.json", [
  id("radwaste_np.id", "Radwaste system id", "ID системы РАО"),
  q("radwaste_np.liquid", "m3", "Liquid waste inventory", "Жидких РАО"),
  q("radwaste_np.solid", "m3", "Solid waste inventory", "Твёрдых РАО"),
  q("radwaste_np.activity", "Bq", "Processed activity today", "Активность переработки за сутки"),
  q("radwaste_np.resin", "%", "Resin bed remaining", "Остаток смолы", { range: { min: 0, max: 100 } }),
  q("radwaste_np.drums", "-", "Drums packaged", "Бочек упаковано", { encodings: ["i32"] }),
  logical("radwaste_np.release", "Discharge permit OK", "Разрешение на сброс OK"),
  enu("radwaste_np.state", ["collect", "treat", "store", "fault"], "Radwaste state", "Состояние РАО"),
]);

write("layer-b-drycask_np.json", [
  id("drycask_np.id", "Dry cask / canister id", "ID сухого контейнера ОЯТ"),
  q("drycask_np.temp", "Cel", "Peak cladding / surface temp", "Макс. температура"),
  q("drycask_np.pressure", "kPa", "Cavity pressure", "Давление полости"),
  q("drycask_np.dose", "uSv/h", "Surface dose rate", "Мощность дозы на поверхности"),
  q("drycask_np.helium", "kPa", "Helium fill pressure", "Давление гелия"),
  q("drycask_np.age.y", "y", "Years since load", "Лет с загрузки"),
  logical("drycask_np.seal", "Seal integrity OK", "Герметичность OK"),
  enu("drycask_np.state", ["store", "transfer", "monitor", "fault"], "Cask state", "Состояние контейнера"),
]);

// --- Fossil / CCGT steam island ---
write("layer-b-steam_tur_pg.json", [
  id("steam_tur_pg.id", "Steam turbine id", "ID паровой турбины"),
  q("steam_tur_pg.power", "MW", "Gross power", "Мощность брутто"),
  q("steam_tur_pg.speed", "rpm", "Rotor speed", "Обороты ротора"),
  q("steam_tur_pg.vibration", "mm/s", "Shaft vibration", "Вибрация вала"),
  q("steam_tur_pg.metal", "Cel", "Metal temperature", "Температура металла"),
  q("steam_tur_pg.throttle", "%", "Throttle / CV position", "Положение клапанов", { range: { min: 0, max: 100 } }),
  logical("steam_tur_pg.trip", "Turbine trip", "Стоп турбины"),
  enu("steam_tur_pg.state", ["load", "sync", "coast", "fault"], "Turbine state", "Состояние турбины"),
]);

write("layer-b-gen_pg.json", [
  id("gen_pg.id", "Main generator id", "ID турбогенератора"),
  q("gen_pg.power", "MW", "Active power", "Активная мощность"),
  q("gen_pg.reactive", "Mvar", "Reactive power", "Реактивная мощность"),
  q("gen_pg.voltage", "kV", "Terminal voltage", "Напряжение статора"),
  q("gen_pg.current", "A", "Stator current", "Ток статора"),
  q("gen_pg.freq", "Hz", "Frequency", "Частота"),
  logical("gen_pg.sync", "Synchronized", "Синхронизирован"),
  enu("gen_pg.state", ["generate", "excitate", "offline", "fault"], "Generator state", "Состояние генератора"),
]);

write("layer-b-condens_pg.json", [
  id("condens_pg.id", "Main condenser id", "ID конденсатора"),
  q("condens_pg.vacuum", "kPa", "Backpressure / vacuum", "Противодавление / вакуум"),
  q("condens_pg.cw.in", "Cel", "CW inlet temperature", "Температура ЦВ на входе"),
  q("condens_pg.cw.out", "Cel", "CW outlet temperature", "Температура ЦВ на выходе"),
  q("condens_pg.hotwell", "%", "Hotwell level", "Уровень горячего колодца", { range: { min: 0, max: 100 } }),
  q("condens_pg.air", "kg/h", "Air in-leakage", "Подсос воздуха"),
  logical("condens_pg.fouling", "Tube fouling high", "Высокое обрастание"),
  enu("condens_pg.state", ["vacuum", "flood", "isolate", "fault"], "Condenser state", "Состояние конденсатора"),
]);

write("layer-b-bfp_pg.json", [
  id("bfp_pg.id", "Boiler feed pump id", "ID ПЭН"),
  q("bfp_pg.flow", "kg/s", "Feedwater flow", "Расход питательной воды"),
  q("bfp_pg.pressure", "MPa", "Discharge pressure", "Давление нагнетания"),
  q("bfp_pg.speed", "rpm", "Pump / turbine speed", "Обороты"),
  q("bfp_pg.power", "MW", "Drive power", "Мощность привода"),
  q("bfp_pg.temp", "Cel", "Bearing temperature", "Температура подшипника"),
  logical("bfp_pg.recirc", "Minimum flow recirculation", "Рециркуляция мин. расхода"),
  enu("bfp_pg.state", ["run", "standby", "recirc", "fault"], "BFP state", "Состояние ПЭН"),
]);

write("layer-b-cep_pg.json", [
  id("cep_pg.id", "Condensate extraction pump id", "ID КЭН"),
  q("cep_pg.flow", "kg/s", "Condensate flow", "Расход конденсата"),
  q("cep_pg.pressure", "MPa", "Discharge pressure", "Давление нагнетания"),
  q("cep_pg.power", "kW", "Motor power", "Мощность двигателя"),
  q("cep_pg.npsh", "m", "NPSH margin", "Запас NPSH"),
  q("cep_pg.temp", "Cel", "Condensate temperature", "Температура конденсата"),
  logical("cep_pg.cavitation", "Cavitation alarm", "Кавитация"),
  enu("cep_pg.state", ["run", "standby", "idle", "fault"], "CEP state", "Состояние КЭН"),
]);

write("layer-b-hph_pg.json", [
  id("hph_pg.id", "HP feedwater heater id", "ID ПВД"),
  q("hph_pg.level", "%", "Heater level", "Уровень подогревателя", { range: { min: 0, max: 100 } }),
  q("hph_pg.tt.in", "Cel", "FW inlet temperature", "Температура ПВ на входе"),
  q("hph_pg.tt.out", "Cel", "FW outlet temperature", "Температура ПВ на выходе"),
  q("hph_pg.extract", "MPa", "Extraction pressure", "Давление отбора"),
  q("hph_pg.tdc", "Cel", "Terminal temperature difference", "Концевой перепад"),
  logical("hph_pg.bypass", "Heater bypassed", "Подогреватель в обводе"),
  enu("hph_pg.state", ["heat", "bypass", "drain", "fault"], "HPH state", "Состояние ПВД"),
]);

write("layer-b-lph_pg.json", [
  id("lph_pg.id", "LP feedwater heater id", "ID ПНД"),
  q("lph_pg.level", "%", "Heater level", "Уровень подогревателя", { range: { min: 0, max: 100 } }),
  q("lph_pg.tt.in", "Cel", "FW inlet temperature", "Температура ПВ на входе"),
  q("lph_pg.tt.out", "Cel", "FW outlet temperature", "Температура ПВ на выходе"),
  q("lph_pg.extract", "kPa", "Extraction pressure", "Давление отбора"),
  q("lph_pg.tdc", "Cel", "Terminal temperature difference", "Концевой перепад"),
  logical("lph_pg.bypass", "Heater bypassed", "Подогреватель в обводе"),
  enu("lph_pg.state", ["heat", "bypass", "drain", "fault"], "LPH state", "Состояние ПНД"),
]);

write("layer-b-deaer_pg.json", [
  id("deaer_pg.id", "Power-island deaerator id", "ID деаэратора энергоострова"),
  q("deaer_pg.level", "%", "Storage level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("deaer_pg.pressure", "kPa", "Deaerator pressure", "Давление деаэратора"),
  q("deaer_pg.temp", "Cel", "Water temperature", "Температура воды"),
  q("deaer_pg.o2", "ppb", "Dissolved oxygen", "Растворённый кислород"),
  q("deaer_pg.pegging", "kg/s", "Pegging steam", "Греющий пар"),
  logical("deaer_pg.vent", "Vent abnormal", "Аномальный вент"),
  enu("deaer_pg.state", ["deaerate", "fill", "isolate", "fault"], "Deaerator state", "Состояние деаэратора"),
]);

write("layer-b-circw_pg.json", [
  id("circw_pg.id", "Circulating water system id", "ID системы циркуляционной воды"),
  q("circw_pg.flow", "m3/s", "CW flow", "Расход ЦВ"),
  q("circw_pg.temp.in", "Cel", "Intake temperature", "Температура водозабора"),
  q("circw_pg.temp.out", "Cel", "Discharge temperature", "Температура сброса"),
  q("circw_pg.pump", "MW", "Pump power", "Мощность насосов"),
  q("circw_pg.delta", "Cel", "Condenser ΔT", "Перепад на конденсаторе"),
  logical("circw_pg.screen", "Screen / trash high", "Высокий уровень на решётках"),
  enu("circw_pg.state", ["circulate", "reduce", "idle", "fault"], "CW state", "Состояние ЦВ"),
]);

write("layer-b-cool_tw_pg.json", [
  id("cool_tw_pg.id", "Cooling tower cell id", "ID секции градирни"),
  q("cool_tw_pg.fan", "%", "Fan speed", "Скорость вентилятора", { range: { min: 0, max: 100 } }),
  q("cool_tw_pg.temp.in", "Cel", "Hot water temperature", "Температура горячей воды"),
  q("cool_tw_pg.temp.out", "Cel", "Cold water temperature", "Температура холодной воды"),
  q("cool_tw_pg.approach", "Cel", "Approach to wet bulb", "Приближение к температуре смоченного термометра"),
  q("cool_tw_pg.drift", "%", "Drift / blowdown", "Унос / продувка", { range: { min: 0, max: 100 } }),
  logical("cool_tw_pg.ice", "Icing risk", "Риск обледенения"),
  enu("cool_tw_pg.state", ["cool", "bypass", "idle", "fault"], "Tower state", "Состояние градирни"),
]);

write("layer-b-fd_fan_pg.json", [
  id("fd_fan_pg.id", "Forced-draft fan id", "ID дутьевого вентилятора"),
  q("fd_fan_pg.flow", "Nm3/h", "Air flow", "Расход воздуха"),
  q("fd_fan_pg.power", "kW", "Fan power", "Мощность вентилятора"),
  q("fd_fan_pg.speed", "%", "Speed / damper", "Скорость / направляющий аппарат", { range: { min: 0, max: 100 } }),
  q("fd_fan_pg.pressure", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("fd_fan_pg.vibration", "mm/s", "Vibration", "Вибрация"),
  logical("fd_fan_pg.stall", "Stall / surge", "Срыв потока"),
  enu("fd_fan_pg.state", ["run", "standby", "idle", "fault"], "FD fan state", "Состояние ДВ"),
]);

write("layer-b-id_fan_pg.json", [
  id("id_fan_pg.id", "Induced-draft fan id", "ID дымососа"),
  q("id_fan_pg.flow", "Nm3/h", "Flue gas flow", "Расход дымовых газов"),
  q("id_fan_pg.power", "kW", "Fan power", "Мощность дымососа"),
  q("id_fan_pg.speed", "%", "Speed / damper", "Скорость / направляющий аппарат", { range: { min: 0, max: 100 } }),
  q("id_fan_pg.draft", "kPa", "Furnace draft", "Разрежение в топке"),
  q("id_fan_pg.temp", "Cel", "Gas temperature", "Температура газов"),
  logical("id_fan_pg.stall", "Stall / surge", "Срыв потока"),
  enu("id_fan_pg.state", ["run", "standby", "idle", "fault"], "ID fan state", "Состояние дымососа"),
]);

write("layer-b-pulv_pg.json", [
  id("pulv_pg.id", "Coal pulverizer id", "ID углеразмольной мельницы"),
  q("pulv_pg.feed", "t/h", "Coal feed", "Подача угля"),
  q("pulv_pg.power", "kW", "Mill power", "Мощность мельницы"),
  q("pulv_pg.air", "Nm3/h", "Primary air", "Первичный воздух"),
  q("pulv_pg.temp", "Cel", "Classifier / outlet temp", "Температура классификатора"),
  q("pulv_pg.fineness", "%", "Fineness on sieve", "Тонкость помола", { range: { min: 0, max: 100 } }),
  logical("pulv_pg.fire", "Mill fire / CO high", "Пожар / высокий CO"),
  enu("pulv_pg.state", ["grind", "inert", "idle", "fault"], "Pulverizer state", "Состояние мельницы"),
]);

write("layer-b-esp_pg.json", [
  id("esp_pg.id", "Electrostatic precipitator id", "ID электрофильтра"),
  q("esp_pg.voltage", "kV", "Secondary voltage", "Вторичное напряжение"),
  q("esp_pg.current", "mA", "Secondary current", "Вторичный ток"),
  q("esp_pg.opacity", "%", "Opacity / dust", "Затемнение / пыль", { range: { min: 0, max: 100 } }),
  q("esp_pg.rapping", "-", "Rapping cycles/h", "Встряхиваний в час", { encodings: ["i32"] }),
  q("esp_pg.power", "kW", "T/R set power", "Мощность Т/Р"),
  logical("esp_pg.spark", "Spark rate high", "Высокая частота искр"),
  enu("esp_pg.state", ["collect", "rap", "bypass", "fault"], "ESP state", "Состояние ЭФ"),
]);

write("layer-b-fgd_pg.json", [
  id("fgd_pg.id", "FGD absorber id", "ID абсорбера ФГД"),
  q("fgd_pg.so2", "mg/Nm3", "Outlet SO2", "SO2 на выходе"),
  q("fgd_pg.ph", "-", "Slurry pH", "pH суспензии"),
  q("fgd_pg.limestone", "t/h", "Limestone feed", "Подача известняка"),
  q("fgd_pg.gypsum", "t/h", "Gypsum production", "Выход гипса"),
  q("fgd_pg.removal", "%", "SO2 removal", "Степень очистки", { range: { min: 0, max: 100 } }),
  logical("fgd_pg.foam", "Foaming / carryover", "Пенообразование"),
  enu("fgd_pg.state", ["absorb", "bypass", "wash", "fault"], "FGD state", "Состояние ФГД"),
]);

write("layer-b-scr_pg.json", [
  id("scr_pg.id", "SCR NOx system id", "ID системы СКВ"),
  q("scr_pg.nox", "mg/Nm3", "Outlet NOx", "NOx на выходе"),
  q("scr_pg.nh3", "ppm", "Ammonia slip", "Проскок аммиака"),
  q("scr_pg.reagent", "kg/h", "Reagent injection", "Подача реагента"),
  q("scr_pg.temp", "Cel", "Catalyst temperature", "Температура катализатора"),
  q("scr_pg.dp", "kPa", "Catalyst dP", "Перепад на катализаторе"),
  logical("scr_pg.bypass", "SCR bypassed", "СКВ в обводе"),
  enu("scr_pg.state", ["reduce", "bypass", "regenerate", "fault"], "SCR state", "Состояние СКВ"),
]);

write("layer-b-ash_pg.json", [
  id("ash_pg.id", "Ash handling system id", "ID системы золоудаления"),
  q("ash_pg.bottom", "t/h", "Bottom ash rate", "Шлак"),
  q("ash_pg.fly", "t/h", "Fly ash rate", "Унос"),
  q("ash_pg.silo", "%", "Silo level", "Уровень силоса", { range: { min: 0, max: 100 } }),
  q("ash_pg.haul", "-", "Hauls today", "Вывозов за сутки", { encodings: ["i32"] }),
  q("ash_pg.water", "m3/h", "Ash water flow", "Расход золошлаковой воды"),
  logical("ash_pg.plugged", "Line plugged", "Засор линии"),
  enu("ash_pg.state", ["convey", "store", "haul", "fault"], "Ash state", "Состояние золоудаления"),
]);

write("layer-b-hrsg_pg.json", [
  id("hrsg_pg.id", "HRSG id", "ID котла-утилизатора"),
  q("hrsg_pg.steam", "t/h", "HP steam flow", "Расход пара ВД"),
  q("hrsg_pg.pressure", "MPa", "HP steam pressure", "Давление пара ВД"),
  q("hrsg_pg.temp", "Cel", "HP steam temperature", "Температура пара ВД"),
  q("hrsg_pg.gas.in", "Cel", "Inlet gas temperature", "Температура газов на входе"),
  q("hrsg_pg.gas.out", "Cel", "Stack gas temperature", "Температура газов в трубе"),
  logical("hrsg_pg.dry", "Dry-run / no steam", "Сухой ход / нет пара"),
  enu("hrsg_pg.state", ["steam", "bypass", "purge", "fault"], "HRSG state", "Состояние КУ"),
]);

write("layer-b-gt_unit_pg.json", [
  id("gt_unit_pg.id", "Gas turbine unit id", "ID газотурбинной установки"),
  q("gt_unit_pg.power", "MW", "Electrical power", "Электрическая мощность"),
  q("gt_unit_pg.exhaust", "Cel", "Exhaust temperature", "Температура выхлопа"),
  q("gt_unit_pg.fuel", "kg/s", "Fuel flow", "Расход топлива"),
  q("gt_unit_pg.igv", "%", "IGV position", "Положение ВНА", { range: { min: 0, max: 100 } }),
  q("gt_unit_pg.vibration", "mm/s", "Rotor vibration", "Вибрация ротора"),
  logical("gt_unit_pg.trip", "GT trip", "Стоп ГТУ"),
  enu("gt_unit_pg.state", ["load", "start", "cooldown", "fault"], "GT state", "Состояние ГТУ"),
]);

write("layer-b-stack_cems.json", [
  id("stack_cems.id", "Stack CEMS id", "ID системы непрерывного контроля выбросов"),
  q("stack_cems.so2", "mg/Nm3", "SO2", "SO2"),
  q("stack_cems.nox", "mg/Nm3", "NOx", "NOx"),
  q("stack_cems.co", "mg/Nm3", "CO", "CO"),
  q("stack_cems.dust", "mg/Nm3", "Particulate", "Пыль"),
  q("stack_cems.flow", "Nm3/h", "Stack flow", "Расход в трубе"),
  logical("stack_cems.valid", "QA/QC valid", "Данные валидны"),
  enu("stack_cems.state", ["measure", "calibrate", "span", "fault"], "CEMS state", "Состояние CEMS"),
]);

write("layer-b-lube_pg.json", [
  id("lube_pg.id", "Turbine lube-oil system id", "ID системы смазки турбины"),
  q("lube_pg.pressure", "kPa", "Supply pressure", "Давление подачи"),
  q("lube_pg.temp", "Cel", "Oil temperature", "Температура масла"),
  q("lube_pg.level", "%", "Reservoir level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("lube_pg.flow", "L/min", "Supply flow", "Расход подачи"),
  q("lube_pg.water", "ppm", "Water in oil", "Вода в масле"),
  logical("lube_pg.trip", "Low oil pressure trip", "Стоп по низкому давлению масла"),
  enu("lube_pg.state", ["lube", "flush", "standby", "fault"], "Lube state", "Состояние смазки"),
]);

write("layer-b-h2cool_pg.json", [
  id("h2cool_pg.id", "Generator H2 cooling id", "ID водородного охлаждения генератора"),
  q("h2cool_pg.pressure", "kPa", "H2 pressure", "Давление H2"),
  q("h2cool_pg.purity", "%", "H2 purity", "Чистота H2", { range: { min: 0, max: 100 } }),
  q("h2cool_pg.dew", "Cel", "Dew point", "Точка росы"),
  q("h2cool_pg.temp", "Cel", "Cold gas temperature", "Температура холодного газа"),
  q("h2cool_pg.makeup", "Nm3/d", "H2 makeup", "Подпитка H2"),
  logical("h2cool_pg.leak", "H2 leak alarm", "Сигнал утечки H2"),
  enu("h2cool_pg.state", ["cool", "purge", "fill", "fault"], "H2 cool state", "Состояние H2-охлаждения"),
]);

// --- Hydro ---
write("layer-b-hydro_tur_hy.json", [
  id("hydro_tur_hy.id", "Hydro turbine-generator id", "ID гидроагрегата"),
  q("hydro_tur_hy.power", "MW", "Electrical power", "Электрическая мощность"),
  q("hydro_tur_hy.flow", "m3/s", "Turbine discharge", "Расход через турбину"),
  q("hydro_tur_hy.head", "m", "Net head", "Напор"),
  q("hydro_tur_hy.speed", "rpm", "Runner speed", "Обороты рабочего колеса"),
  q("hydro_tur_hy.guide", "%", "Guide vane opening", "Открытие направляющего аппарата", { range: { min: 0, max: 100 } }),
  logical("hydro_tur_hy.cavitation", "Cavitation alarm", "Кавитация"),
  enu("hydro_tur_hy.state", ["generate", "sync", "spin", "fault"], "Unit state", "Состояние агрегата"),
]);

write("layer-b-penstk_hy.json", [
  id("penstk_hy.id", "Penstock id", "ID напорного трубопровода"),
  q("penstk_hy.pressure", "MPa", "Penstock pressure", "Давление в водоводе"),
  q("penstk_hy.flow", "m3/s", "Flow", "Расход"),
  q("penstk_hy.level", "m", "Headpond level", "Уровень верхнего бьефа"),
  q("penstk_hy.surge", "m", "Surge tank level", "Уровень уравнительного резервуара"),
  q("penstk_hy.velocity", "m/s", "Flow velocity", "Скорость потока"),
  logical("penstk_hy.transient", "Water hammer / transient", "Гидравлический удар"),
  enu("penstk_hy.state", ["flow", "isolate", "fill", "fault"], "Penstock state", "Состояние водовода"),
]);

write("layer-b-draft_hy.json", [
  id("draft_hy.id", "Draft tube / tailrace id", "ID отсасывающей трубы / НБ"),
  q("draft_hy.level", "m", "Tailrace level", "Уровень нижнего бьефа"),
  q("draft_hy.pressure", "kPa", "Draft tube pressure", "Давление в отсасывающей трубе"),
  q("draft_hy.air", "%", "Air admission", "Подвод воздуха", { range: { min: 0, max: 100 } }),
  q("draft_hy.temp", "Cel", "Water temperature", "Температура воды"),
  q("draft_hy.dissolved", "mg/L", "Dissolved oxygen", "Растворённый кислород"),
  logical("draft_hy.vortex", "Vortex / swirl alarm", "Вихрь / закрутка"),
  enu("draft_hy.state", ["discharge", "air", "idle", "fault"], "Draft state", "Состояние отсасывающей трубы"),
]);

write("layer-b-spill_hy.json", [
  id("spill_hy.id", "Spillway gate id", "ID водосбросного затвора"),
  q("spill_hy.opening", "%", "Gate opening", "Открытие затвора", { range: { min: 0, max: 100 } }),
  q("spill_hy.flow", "m3/s", "Spill discharge", "Расход сброса"),
  q("spill_hy.level", "m", "Reservoir level", "Уровень водохранилища"),
  q("spill_hy.vibration", "mm/s", "Gate vibration", "Вибрация затвора"),
  q("spill_hy.limit", "m", "Flood limit level", "Предельный уровень паводка"),
  logical("spill_hy.auto", "Auto flood control active", "Автопаводковый режим"),
  enu("spill_hy.state", ["closed", "modulate", "full", "fault"], "Spillway state", "Состояние водосброса"),
]);

write("layer-b-gov_hy.json", [
  id("gov_hy.id", "Hydro speed governor id", "ID регулятора скорости ГА"),
  q("gov_hy.setpoint", "MW", "Power setpoint", "Уставка мощности"),
  q("gov_hy.speed", "rpm", "Measured speed", "Измеренные обороты"),
  q("gov_hy.gate", "%", "Wicket gate command", "Команда на НА", { range: { min: 0, max: 100 } }),
  q("gov_hy.droop", "%", "Droop setting", "Статизм", { range: { min: 0, max: 100 } }),
  q("gov_hy.oil", "kPa", "Governor oil pressure", "Давление масла регулятора"),
  logical("gov_hy.isl", "Island / isolated mode", "Островной режим"),
  enu("gov_hy.state", ["auto", "manual", "lock", "fault"], "Governor state", "Состояние регулятора"),
]);

write("layer-b-intake_hy.json", [
  id("intake_hy.id", "Intake gate / trash rack id", "ID водоприёмника / сороудерживающей решётки"),
  q("intake_hy.level", "m", "Forebay level", "Уровень аванкамеры"),
  q("intake_hy.dp", "kPa", "Trash rack dP", "Перепад на решётке"),
  q("intake_hy.gate", "%", "Intake gate opening", "Открытие затвора", { range: { min: 0, max: 100 } }),
  q("intake_hy.debris", "%", "Debris load estimate", "Оценка засорения", { range: { min: 0, max: 100 } }),
  q("intake_hy.rake", "-", "Rake cycles today", "Циклов очистки за сутки", { encodings: ["i32"] }),
  logical("intake_hy.block", "Intake blocked", "Водоприёмник забит"),
  enu("intake_hy.state", ["open", "rake", "closed", "fault"], "Intake state", "Состояние водоприёмника"),
]);

// --- Fusion ---
write("layer-b-tokamak_fu.json", [
  id("tokamak_fu.id", "Tokamak device id", "ID токамака"),
  q("tokamak_fu.ip", "MA", "Plasma current", "Ток плазмы"),
  q("tokamak_fu.power", "MW", "Fusion / heating power", "Мощность синтеза / нагрева"),
  q("tokamak_fu.temp", "keV", "Ion temperature", "Ионная температура"),
  q("tokamak_fu.density", "1/m3", "Electron density", "Электронная плотность"),
  q("tokamak_fu.pulse.s", "s", "Pulse length", "Длительность импульса"),
  logical("tokamak_fu.disrupt", "Disruption", "Срыв"),
  enu("tokamak_fu.state", ["pulse", "dwell", "bake", "fault"], "Tokamak state", "Состояние токамака"),
]);

write("layer-b-divert_fu.json", [
  id("divert_fu.id", "Divertor system id", "ID дивертора"),
  q("divert_fu.heat", "MW/m2", "Peak heat flux", "Пиковый тепловой поток"),
  q("divert_fu.temp", "Cel", "Target temperature", "Температура мишени"),
  q("divert_fu.particle", "/s", "Particle exhaust rate", "Скорость откачки частиц"),
  q("divert_fu.coolant", "kg/s", "Coolant flow", "Расход теплоносителя"),
  q("divert_fu.erosion", "um", "Erosion estimate", "Оценка эрозии"),
  logical("divert_fu.detach", "Detached plasma", "Отрыв плазмы"),
  enu("divert_fu.state", ["exhaust", "attach", "protect", "fault"], "Divertor state", "Состояние дивертора"),
]);

write("layer-b-cryo_fu.json", [
  id("cryo_fu.id", "Cryostat / cryoplant id", "ID криостата / криогенной установки"),
  q("cryo_fu.temp", "K", "Coldest temperature", "Минимальная температура"),
  q("cryo_fu.he", "g/s", "Helium mass flow", "Расход гелия"),
  q("cryo_fu.power", "kW", "Cryoplant power", "Мощность криоустановки"),
  q("cryo_fu.pressure", "kPa", "Cryostat pressure", "Давление криостата"),
  q("cryo_fu.inventory", "kg", "LHe inventory", "Запас ЖГе"),
  logical("cryo_fu.warm", "Warm-up / quench risk", "Разогрев / риск квенча"),
  enu("cryo_fu.state", ["cold", "cooldown", "warmup", "fault"], "Cryo state", "Состояние криогенки"),
]);

write("layer-b-nbi_fu.json", [
  id("nbi_fu.id", "Neutral beam injector id", "ID инжектора нейтралей"),
  q("nbi_fu.power", "MW", "Injected power", "Введённая мощность"),
  q("nbi_fu.voltage", "kV", "Beam voltage", "Напряжение пучка"),
  q("nbi_fu.current", "A", "Beam current", "Ток пучка"),
  q("nbi_fu.species", "-", "Species mix H/D/T index", "Индекс смеси H/D/T"),
  q("nbi_fu.pulse.s", "s", "Pulse length", "Длительность импульса"),
  logical("nbi_fu.interlock", "Interlock trip", "Срабатывание блокировки"),
  enu("nbi_fu.state", ["inject", "cond", "standby", "fault"], "NBI state", "Состояние ИНБ"),
]);

write("layer-b-ecrh_fu.json", [
  id("ecrh_fu.id", "ECRH / gyrotron id", "ID ЭЦРН / гиротрона"),
  q("ecrh_fu.power", "MW", "RF power", "СВЧ-мощность"),
  q("ecrh_fu.freq", "GHz", "Frequency", "Частота"),
  q("ecrh_fu.duty", "%", "Duty cycle", "Скважность", { range: { min: 0, max: 100 } }),
  q("ecrh_fu.temp", "Cel", "Window / load temperature", "Температура окна / нагрузки"),
  q("ecrh_fu.reflection", "%", "Reflected power", "Отражённая мощность", { range: { min: 0, max: 100 } }),
  logical("ecrh_fu.arc", "Arc detected", "Дуга"),
  enu("ecrh_fu.state", ["heat", "standby", "cond", "fault"], "ECRH state", "Состояние ЭЦРН"),
]);

write("layer-b-icrh_fu.json", [
  id("icrh_fu.id", "ICRH antenna id", "ID ИЦРН-антенны"),
  q("icrh_fu.power", "MW", "Coupled power", "Введённая мощность"),
  q("icrh_fu.freq", "MHz", "Frequency", "Частота"),
  q("icrh_fu.vswr", "-", "VSWR", "КСВ"),
  q("icrh_fu.voltage", "kV", "Antenna voltage", "Напряжение антенны"),
  q("icrh_fu.phase", "deg", "Strap phase", "Фаза полос"),
  logical("icrh_fu.arc", "Arc / breakdown", "Дуга / пробой"),
  enu("icrh_fu.state", ["heat", "match", "standby", "fault"], "ICRH state", "Состояние ИЦРН"),
]);

write("layer-b-tritium_fu.json", [
  id("tritium_fu.id", "Tritium plant id", "ID тритиевого комплекса"),
  q("tritium_fu.inventory", "g", "Tritium inventory", "Запас трития"),
  q("tritium_fu.throughput", "g/d", "Daily throughput", "Суточный оборот"),
  q("tritium_fu.permeation", "Bq", "Permeation / release monitor", "Монитор пермеации / выброса"),
  q("tritium_fu.isotope", "%", "T isotopic purity", "Изотопная чистота T", { range: { min: 0, max: 100 } }),
  q("tritium_fu.glove", "ppm", "Glovebox atmosphere T", "T в атмосфере перчаточного бокса"),
  logical("tritium_fu.alarm", "Tritium alarm", "Сигнал по тритию"),
  enu("tritium_fu.state", ["process", "store", "detritiate", "fault"], "Tritium state", "Состояние тритиевого комплекса"),
]);

write("layer-b-blanket_fu.json", [
  id("blanket_fu.id", "Breeding blanket id", "ID бланкета"),
  q("blanket_fu.temp", "Cel", "Blanket temperature", "Температура бланкета"),
  q("blanket_fu.tbr", "-", "Tritium breeding ratio", "Коэффициент воспроизводства трития"),
  q("blanket_fu.coolant", "kg/s", "Coolant flow", "Расход теплоносителя"),
  q("blanket_fu.power", "MW", "Nuclear heating", "Ядерный нагрев"),
  q("blanket_fu.li", "%", "Li-6 enrichment / inventory", "Обогащение / запас Li-6", { range: { min: 0, max: 100 } }),
  logical("blanket_fu.leak", "Coolant leak", "Течь теплоносителя"),
  enu("blanket_fu.state", ["breed", "bake", "drain", "fault"], "Blanket state", "Состояние бланкета"),
]);

write("layer-b-tfcoil_fu.json", [
  id("tfcoil_fu.id", "Toroidal-field coil id", "ID катушки ТП"),
  q("tfcoil_fu.current", "kA", "Coil current", "Ток катушки"),
  q("tfcoil_fu.field", "T", "Magnetic field", "Магнитное поле"),
  q("tfcoil_fu.temp", "K", "Conductor temperature", "Температура проводника"),
  q("tfcoil_fu.voltage", "V", "Terminal voltage", "Напряжение на выводах"),
  q("tfcoil_fu.energy", "GJ", "Stored energy", "Запасённая энергия"),
  logical("tfcoil_fu.quench", "Quench detected", "Квенч"),
  enu("tfcoil_fu.state", ["energized", "ramp", "dump", "fault"], "TF coil state", "Состояние катушки ТП"),
]);

write("layer-b-pfcoil_fu.json", [
  id("pfcoil_fu.id", "Poloidal-field coil id", "ID катушки ПП"),
  q("pfcoil_fu.current", "kA", "Coil current", "Ток катушки"),
  q("pfcoil_fu.voltage", "V", "Supply voltage", "Напряжение источника"),
  q("pfcoil_fu.temp", "K", "Conductor temperature", "Температура проводника"),
  q("pfcoil_fu.force", "MN", "Electromagnetic force", "Электромагнитная сила"),
  q("pfcoil_fu.power", "MW", "Supply power", "Мощность источника"),
  logical("pfcoil_fu.quench", "Quench detected", "Квенч"),
  enu("pfcoil_fu.state", ["control", "ramp", "dump", "fault"], "PF coil state", "Состояние катушки ПП"),
]);

write("layer-b-vacvv_fu.json", [
  id("vacvv_fu.id", "Vacuum vessel id", "ID вакуумной камеры"),
  q("vacvv_fu.pressure", "Pa", "Vessel pressure", "Давление в камере"),
  q("vacvv_fu.base", "Pa", "Base pressure", "Базовое давление"),
  q("vacvv_fu.leak", "Pa.m3/s", "Helium leak rate", "Течь по гелию"),
  q("vacvv_fu.temp", "Cel", "Wall temperature", "Температура стенки"),
  q("vacvv_fu.pumps", "-", "Pumps running", "Насосов в работе", { encodings: ["i32"] }),
  logical("vacvv_fu.vent", "Vessel vented", "Камера завоздушена"),
  enu("vacvv_fu.state", ["pump", "bake", "pulse", "fault"], "Vessel state", "Состояние камеры"),
]);

write("layer-b-pellet_fu.json", [
  id("pellet_fu.id", "Pellet fueling injector id", "ID пеллет-инжектора"),
  q("pellet_fu.rate", "Hz", "Injection rate", "Частота ввода"),
  q("pellet_fu.size", "mm", "Pellet size", "Размер пеллеты"),
  q("pellet_fu.speed", "m/s", "Injection speed", "Скорость ввода"),
  q("pellet_fu.inventory", "-", "Pellets remaining", "Пеллет в запасе", { encodings: ["i32"] }),
  q("pellet_fu.success", "%", "Injection success rate", "Успешность ввода", { range: { min: 0, max: 100 } }),
  logical("pellet_fu.jam", "Injector jam", "Заклинивание инжектора"),
  enu("pellet_fu.state", ["inject", "load", "idle", "fault"], "Pellet injector state", "Состояние пеллет-инжектора"),
]);

console.log("Layer B35 seeds written");
