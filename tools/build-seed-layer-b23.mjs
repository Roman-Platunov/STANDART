#!/usr/bin/env node
/**
 * Layer B23 — T&D, HVDC, protection, overhead line assets.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B23", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-hvdc_conv.json", [
  id("hvdc_conv.id", "HVDC converter id", "ID преобразователя HVDC"),
  q("hvdc_conv.power", "W", "Converter power", "Мощность преобразователя"),
  q("hvdc_conv.dc.voltage", "kV", "DC voltage", "Напряжение DC"),
  q("hvdc_conv.dc.current", "A", "DC current", "Ток DC"),
  q("hvdc_conv.firing", "deg", "Firing / modulation angle", "Угол зажигания / модуляции"),
  q("hvdc_conv.temp", "Cel", "Valve temperature", "Температура вентиля"),
  logical("hvdc_conv.block", "Blocked", "Заблокирован"),
  enu("hvdc_conv.mode", ["rectifier", "inverter", "statcom", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-statcom_var.json", [
  id("statcom_var.id", "STATCOM id", "ID СТАТКОМ"),
  q("statcom_var.q", "var", "Reactive power", "Реактивная мощность"),
  q("statcom_var.voltage", "kV", "Bus voltage", "Напряжение шины"),
  q("statcom_var.current", "A", "Converter current", "Ток преобразователя"),
  q("statcom_var.temp", "Cel", "Module temperature", "Температура модуля"),
  q("statcom_var.util", "%", "Capability used", "Использование диапазона", { range: { min: 0, max: 100 } }),
  logical("statcom_var.trip", "Trip", "Отключение"),
  enu("statcom_var.state", ["run", "standby", "blocked", "fault"], "State", "Состояние"),
]);

write("layer-b-svc_thyristor.json", [
  id("svc_thyristor.id", "SVC id", "ID СТК"),
  q("svc_thyristor.q", "var", "Reactive power", "Реактивная мощность"),
  q("svc_thyristor.tcr.angle", "deg", "TCR firing angle", "Угол TCR"),
  q("svc_thyristor.tsc.steps", "-", "TSC steps in", "Ступеней TSC", { encodings: ["i32"] }),
  q("svc_thyristor.voltage", "kV", "Bus voltage", "Напряжение шины"),
  q("svc_thyristor.harmonics", "%", "THD", "КНИ", { range: { min: 0, max: 100 } }),
  logical("svc_thyristor.resonance", "Resonance risk", "Риск резонанса"),
  enu("svc_thyristor.state", ["run", "bypass", "idle", "fault"], "State", "Состояние"),
]);

write("layer-b-sync_condenser.json", [
  id("sync_condenser.id", "Synchronous condenser id", "ID синхронного компенсатора"),
  q("sync_condenser.q", "var", "Reactive power", "Реактивная мощность"),
  q("sync_condenser.speed", "rpm", "Rotor speed", "Обороты ротора"),
  q("sync_condenser.exc.v", "V", "Excitation voltage", "Напряжение возбуждения"),
  q("sync_condenser.temp", "Cel", "Winding temperature", "Температура обмотки"),
  q("sync_condenser.vib", "mm/s", "Vibration", "Вибрация"),
  logical("sync_condenser.clutch", "Clutch engaged", "Муфта включена"),
  enu("sync_condenser.state", ["run", "start", "coast", "fault"], "State", "Состояние"),
]);

write("layer-b-phase_shift_xfmr.json", [
  id("phase_shift_xfmr.id", "Phase-shifting transformer id", "ID фазосдвигающего трансформатора"),
  q("phase_shift_xfmr.angle", "deg", "Phase shift", "Сдвиг фазы"),
  q("phase_shift_xfmr.power", "W", "Through power", "Сквозная мощность"),
  q("phase_shift_xfmr.tap", "-", "Tap position", "Положение РПН", { encodings: ["i32"] }),
  q("phase_shift_xfmr.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  q("phase_shift_xfmr.loading", "%", "Loading", "Загрузка", { range: { min: 0, max: 100 } }),
  logical("phase_shift_xfmr.lock", "Tap lock", "Блокировка РПН"),
  enu("phase_shift_xfmr.state", ["regulate", "hold", "bypass", "fault"], "State", "Состояние"),
]);

write("layer-b-series_cap_bank.json", [
  id("series_cap_bank.id", "Series capacitor bank id", "ID батареи последовательных конденсаторов"),
  q("series_cap_bank.voltage", "kV", "Bank voltage", "Напряжение батареи"),
  q("series_cap_bank.current", "A", "Line current", "Ток линии"),
  q("series_cap_bank.var", "var", "Inserted vars", "Введённые вар"),
  q("series_cap_bank.bypass.s", "s", "Bypass duration", "Длительность шунтирования"),
  q("series_cap_bank.mov.energy", "kJ", "MOV energy", "Энергия ОПН"),
  logical("series_cap_bank.bypassed", "Bypassed", "Зашунтирована"),
  enu("series_cap_bank.state", ["insert", "bypass", "reinsert", "fault"], "State", "Состояние"),
]);

write("layer-b-shunt_react.json", [
  id("shunt_react.id", "Shunt reactor id", "ID шунтирующего реактора"),
  q("shunt_react.q", "var", "Absorbed vars", "Потребляемые вар"),
  q("shunt_react.current", "A", "Reactor current", "Ток реактора"),
  q("shunt_react.oil.temp", "Cel", "Oil temperature", "Температура масла"),
  q("shunt_react.vib", "mm/s", "Vibration", "Вибрация"),
  q("shunt_react.tap", "-", "Tertiary tap", "Отпайка", { encodings: ["i32"] }),
  logical("shunt_react.energized", "Energized", "Под напряжением"),
  enu("shunt_react.type", ["oil", "air_core", "vcsr", "other"], "Type", "Тип"),
]);

write("layer-b-oil_dga_mon.json", [
  id("oil_dga_mon.xfmr.id", "Monitored transformer id", "ID трансформатора"),
  q("oil_dga_mon.h2", "ppm", "Hydrogen", "Водород"),
  q("oil_dga_mon.c2h2", "ppm", "Acetylene", "Ацетилен"),
  q("oil_dga_mon.c2h4", "ppm", "Ethylene", "Этилен"),
  q("oil_dga_mon.co", "ppm", "Carbon monoxide", "Оксид углерода"),
  q("oil_dga_mon.moisture", "ppm", "Oil moisture", "Влага в масле"),
  logical("oil_dga_mon.alarm", "DGA alarm", "Тревога ХАРГ"),
  enu("oil_dga_mon.fault", ["none", "pd", "thermal", "arc", "unknown"], "Fault class", "Класс повреждения"),
]);

write("layer-b-bushing_tap.json", [
  id("bushing_tap.id", "Bushing monitor id", "ID монитора ввода"),
  id("bushing_tap.xfmr.id", "Transformer id", "ID трансформатора"),
  q("bushing_tap.cap", "pF", "Capacitance", "Ёмкость"),
  q("bushing_tap.pf", "%", "Power factor", "Тангенс дельта", { range: { min: 0, max: 100 } }),
  q("bushing_tap.leak", "mA", "Leakage current", "Ток утечки"),
  q("bushing_tap.temp", "Cel", "Bushing temperature", "Температура ввода"),
  logical("bushing_tap.alarm", "Bushing alarm", "Тревога ввода"),
  enu("bushing_tap.state", ["ok", "watch", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-cable_pd_mon.json", [
  id("cable_pd_mon.circuit.id", "Cable circuit id", "ID кабельной линии"),
  q("cable_pd_mon.pd", "pC", "PD magnitude", "Амплитуда ЧР"),
  q("cable_pd_mon.rate", "/s", "PD pulse rate", "Частота импульсов ЧР"),
  q("cable_pd_mon.tan.delta", "-", "Tan delta", "Тангенс дельта"),
  q("cable_pd_mon.temp", "Cel", "Sheath temperature", "Температура оболочки"),
  q("cable_pd_mon.load", "A", "Load current", "Ток нагрузки"),
  logical("cable_pd_mon.alarm", "PD alarm", "Тревога ЧР"),
  enu("cable_pd_mon.state", ["ok", "watch", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-dyn_line_rating.json", [
  id("dyn_line_rating.line.id", "Overhead line id", "ID ВЛ"),
  q("dyn_line_rating.ampacity", "A", "Dynamic ampacity", "Динамическая пропускная способность"),
  q("dyn_line_rating.sag", "m", "Conductor sag", "Провес провода"),
  q("dyn_line_rating.temp", "Cel", "Conductor temperature", "Температура провода"),
  q("dyn_line_rating.wind", "m/s", "Crosswind", "Боковой ветер"),
  q("dyn_line_rating.solar", "W/m2", "Solar irradiance", "Солнечная радиация"),
  logical("dyn_line_rating.limit", "Rating limited", "Ограничение рейтинга"),
  enu("dyn_line_rating.state", ["normal", "boost", "restrict", "offline"], "State", "Состояние"),
]);

write("layer-b-fault_loc_rel.json", [
  id("fault_loc_rel.id", "Fault locator id", "ID определителя места повреждения"),
  id("fault_loc_rel.line.id", "Line id", "ID линии"),
  q("fault_loc_rel.distance", "km", "Estimated distance", "Оценка расстояния"),
  q("fault_loc_rel.reactance", "Ohm", "Fault reactance", "Реактивность КЗ"),
  q("fault_loc_rel.current", "A", "Fault current", "Ток КЗ"),
  q("fault_loc_rel.confidence", "%", "Location confidence", "Достоверность", { range: { min: 0, max: 100 } }),
  logical("fault_loc_rel.trip", "Trip recorded", "Зафиксировано отключение"),
  enu("fault_loc_rel.type", ["ag", "bg", "cg", "ab", "bc", "ca", "abc", "unknown"], "Fault type", "Тип КЗ"),
]);

write("layer-b-feeder_reclose.json", [
  id("feeder_reclose.id", "Feeder recloser id", "ID реклоузера фидера"),
  q("feeder_reclose.shots", "-", "Reclose shots today", "АПВ за сутки", { encodings: ["i32"] }),
  q("feeder_reclose.current", "A", "Feeder current", "Ток фидера"),
  q("feeder_reclose.lockout", "-", "Lockouts today", "Блокировок за сутки", { encodings: ["i32"] }),
  q("feeder_reclose.ops", "-", "Operations today", "Операций за сутки", { encodings: ["i32"] }),
  q("feeder_reclose.battery", "%", "Control battery", "Батарея управления", { range: { min: 0, max: 100 } }),
  logical("feeder_reclose.lock", "Locked out", "Заблокирован"),
  enu("feeder_reclose.state", ["close", "open", "lockout", "fault"], "State", "Состояние"),
]);

write("layer-b-sec_switch.json", [
  id("sec_switch.id", "Sectionalizer id", "ID секционализатора"),
  q("sec_switch.counts", "-", "Count-to-open remaining", "Осталось счётов до отключения", { encodings: ["i32"] }),
  q("sec_switch.current", "A", "Line current", "Ток линии"),
  q("sec_switch.ops", "-", "Operations today", "Операций за сутки", { encodings: ["i32"] }),
  q("sec_switch.temp", "Cel", "Cabinet temperature", "Температура шкафа"),
  q("sec_switch.battery", "%", "Battery", "Батарея", { range: { min: 0, max: 100 } }),
  logical("sec_switch.open", "Open", "Отключён"),
  enu("sec_switch.state", ["closed", "open", "count", "fault"], "State", "Состояние"),
]);

write("layer-b-volt_reg_feeder.json", [
  id("volt_reg_feeder.id", "Feeder voltage regulator id", "ID регулятора напряжения фидера"),
  q("volt_reg_feeder.voltage", "V", "Regulated voltage", "Регулируемое напряжение"),
  q("volt_reg_feeder.tap", "-", "Tap position", "Положение анцапфы", { encodings: ["i32"] }),
  q("volt_reg_feeder.current", "A", "Load current", "Ток нагрузки"),
  q("volt_reg_feeder.ldc", "V", "LDC compensation", "Компенсация LDC"),
  q("volt_reg_feeder.ops", "-", "Tap operations today", "Переключений за сутки", { encodings: ["i32"] }),
  logical("volt_reg_feeder.lock", "Tap lock", "Блокировка"),
  enu("volt_reg_feeder.mode", ["auto", "manual", "band", "fault"], "Mode", "Режим"),
]);

write("layer-b-oltc_mon.json", [
  id("oltc_mon.xfmr.id", "OLTC transformer id", "ID трансформатора с РПН"),
  q("oltc_mon.tap", "-", "Tap position", "Положение РПН", { encodings: ["i32"] }),
  q("oltc_mon.ops", "-", "Operations today", "Операций за сутки", { encodings: ["i32"] }),
  q("oltc_mon.motor.current", "A", "Drive current", "Ток привода"),
  q("oltc_mon.oil.temp", "Cel", "Diverter oil temperature", "Температура масла контактора"),
  q("oltc_mon.contact.wear", "%", "Contact wear", "Износ контактов", { range: { min: 0, max: 100 } }),
  logical("oltc_mon.stuck", "Tap stuck", "РПН заклинило"),
  enu("oltc_mon.state", ["idle", "raise", "lower", "fault"], "State", "Состояние"),
]);

write("layer-b-earth_grid.json", [
  id("earth_grid.sub.id", "Substation earth grid id", "ID заземляющего контура ПС"),
  q("earth_grid.resistance", "Ohm", "Grid resistance", "Сопротивление контура"),
  q("earth_grid.step", "V", "Step voltage", "Шаговое напряжение"),
  q("earth_grid.touch", "V", "Touch voltage", "Напряжение прикосновения"),
  q("earth_grid.current", "A", "Fault current share", "Доля тока КЗ"),
  q("earth_grid.corrosion", "%", "Corrosion index", "Индекс коррозии", { range: { min: 0, max: 100 } }),
  logical("earth_grid.alarm", "GPR alarm", "Тревога потенциала"),
  enu("earth_grid.state", ["ok", "degrade", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-sub_dc_batt.json", [
  id("sub_dc_batt.bank.id", "Substation DC battery bank id", "ID аккумуляторной батареи ПС"),
  q("sub_dc_batt.voltage", "V", "Bank voltage", "Напряжение батареи"),
  q("sub_dc_batt.current", "A", "Charge/discharge current", "Ток заряда/разряда"),
  q("sub_dc_batt.soc", "%", "State of charge", "SOC", { range: { min: 0, max: 100 } }),
  q("sub_dc_batt.temp", "Cel", "Battery temperature", "Температура батареи"),
  q("sub_dc_batt.ripple", "mV", "Ripple voltage", "Пульсации"),
  logical("sub_dc_batt.ground", "DC ground fault", "Замыкание на землю DC"),
  enu("sub_dc_batt.state", ["float", "boost", "discharge", "fault"], "State", "Состояние"),
]);

write("layer-b-sf6_gas_mon.json", [
  id("sf6_gas_mon.compartment.id", "SF6 compartment id", "ID отсека SF6"),
  q("sf6_gas_mon.pressure", "kPa", "Gas pressure", "Давление газа"),
  q("sf6_gas_mon.density", "kg/m3", "Gas density", "Плотность газа"),
  q("sf6_gas_mon.dew", "Cel", "Dew point", "Точка росы"),
  q("sf6_gas_mon.leak", "%/d", "Leak rate", "Скорость утечки"),
  q("sf6_gas_mon.temp", "Cel", "Gas temperature", "Температура газа"),
  logical("sf6_gas_mon.low", "Low density", "Низкая плотность"),
  enu("sf6_gas_mon.state", ["ok", "refill", "alarm", "lockout"], "State", "Состояние"),
]);

write("layer-b-pq_meter.json", [
  id("pq_meter.id", "Power quality meter id", "ID анализатора качества электроэнергии"),
  id("pq_meter.feeder.id", "Feeder id", "ID фидера"),
  q("pq_meter.thd.v", "%", "Voltage THD", "КНИ напряжения", { range: { min: 0, max: 100 } }),
  q("pq_meter.thd.i", "%", "Current THD", "КНИ тока", { range: { min: 0, max: 100 } }),
  q("pq_meter.unbalance", "%", "Voltage unbalance", "Несимметрия напряжения", { range: { min: 0, max: 100 } }),
  q("pq_meter.sags", "-", "Sag events today", "Провалов за сутки", { encodings: ["i32"] }),
  logical("pq_meter.event", "PQ event", "Событие КЭ"),
  enu("pq_meter.class", ["a", "s", "b", "other"], "Meter class", "Класс прибора"),
]);

write("layer-b-harm_analyzer.json", [
  id("harm_analyzer.id", "Harmonic analyzer id", "ID анализатора гармоник"),
  q("harm_analyzer.h5", "%", "5th harmonic", "5-я гармоника", { range: { min: 0, max: 100 } }),
  q("harm_analyzer.h7", "%", "7th harmonic", "7-я гармоника", { range: { min: 0, max: 100 } }),
  q("harm_analyzer.h11", "%", "11th harmonic", "11-я гармоника", { range: { min: 0, max: 100 } }),
  q("harm_analyzer.k.factor", "-", "K-factor", "K-фактор"),
  q("harm_analyzer.ihd", "%", "Individual harmonic max", "Макс. индивидуальная гармоника", { range: { min: 0, max: 100 } }),
  logical("harm_analyzer.limit", "Limit exceeded", "Превышен лимит"),
  enu("harm_analyzer.state", ["ok", "watch", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-flicker_mon.json", [
  id("flicker_mon.id", "Flicker meter id", "ID фликерметра"),
  q("flicker_mon.pst", "-", "Short-term flicker Pst", "Кратковременный фликер Pst"),
  q("flicker_mon.plt", "-", "Long-term flicker Plt", "Длительный фликер Plt"),
  q("flicker_mon.voltage", "V", "RMS voltage", "Действующее напряжение"),
  q("flicker_mon.events", "-", "Exceedances today", "Превышений за сутки", { encodings: ["i32"] }),
  q("flicker_mon.freq", "Hz", "Frequency", "Частота"),
  logical("flicker_mon.alarm", "Flicker alarm", "Тревога фликера"),
  enu("flicker_mon.state", ["ok", "watch", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-inrush_cap.json", [
  id("inrush_cap.bank.id", "Capacitor inrush recorder id", "ID регистратора броска конденсаторов"),
  q("inrush_cap.peak", "A", "Peak inrush", "Пик броска"),
  q("inrush_cap.duration.ms", "ms", "Inrush duration", "Длительность броска"),
  q("inrush_cap.voltage", "kV", "Bus voltage at close", "Напряжение при включении"),
  q("inrush_cap.ops", "-", "Switching ops today", "Коммутаций за сутки", { encodings: ["i32"] }),
  q("inrush_cap.temp", "Cel", "Reactor temperature", "Температура реактора"),
  logical("inrush_cap.over", "Overcurrent", "Сверхток"),
  enu("inrush_cap.state", ["ready", "record", "idle", "fault"], "State", "Состояние"),
]);

write("layer-b-island_rel.json", [
  id("island_rel.id", "Island detection relay id", "ID реле обнаружения острова"),
  id("island_rel.feeder.id", "Feeder id", "ID фидера"),
  q("island_rel.rocof", "Hz/s", "Rate of change of frequency", "Скорость изменения частоты"),
  q("island_rel.freq", "Hz", "Frequency", "Частота"),
  q("island_rel.vs", "V", "Vector shift", "Векторный сдвиг"),
  q("island_rel.trips", "-", "Trips today", "Отключений за сутки", { encodings: ["i32"] }),
  logical("island_rel.island", "Island detected", "Остров обнаружен"),
  enu("island_rel.method", ["rocof", "vs", "passive", "active", "other"], "Method", "Метод"),
]);

write("layer-b-ufr_relay.json", [
  id("ufr_relay.id", "Underfrequency relay id", "ID реле снижения частоты"),
  q("ufr_relay.freq", "Hz", "System frequency", "Частота системы"),
  q("ufr_relay.setpoint", "Hz", "Trip setpoint", "Уставка отключения"),
  q("ufr_relay.stage", "-", "Shed stage", "Ступень отключения", { encodings: ["i32"] }),
  q("ufr_relay.mw", "W", "Armed MW", "Вооружённая мощность"),
  q("ufr_relay.trips", "-", "Operations today", "Срабатываний за сутки", { encodings: ["i32"] }),
  logical("ufr_relay.armed", "Armed", "Вооружено"),
  enu("ufr_relay.state", ["armed", "trip", "blocked", "fault"], "State", "Состояние"),
]);

write("layer-b-line_diff_prot.json", [
  id("line_diff_prot.id", "Line differential protection id", "ID ДЗЛ"),
  id("line_diff_prot.line.id", "Line id", "ID линии"),
  q("line_diff_prot.idiff", "A", "Differential current", "Дифференциальный ток"),
  q("line_diff_prot.ibias", "A", "Bias current", "Ток торможения"),
  q("line_diff_prot.channel.ms", "ms", "Channel delay", "Задержка канала"),
  q("line_diff_prot.trips", "-", "Trips today", "Отключений за сутки", { encodings: ["i32"] }),
  logical("line_diff_prot.comm.ok", "Channel OK", "Канал OK"),
  enu("line_diff_prot.state", ["ok", "pickup", "trip", "channel_fail"], "State", "Состояние"),
]);

write("layer-b-bus_diff_prot.json", [
  id("bus_diff_prot.id", "Busbar differential protection id", "ID ДЗШ"),
  id("bus_diff_prot.bus.id", "Bus id", "ID шины"),
  q("bus_diff_prot.idiff", "A", "Differential current", "Дифференциальный ток"),
  q("bus_diff_prot.ibias", "A", "Restraint current", "Ток торможения"),
  q("bus_diff_prot.ct.sat", "-", "Saturated CTs", "Насыщенных ТТ", { encodings: ["i32"] }),
  q("bus_diff_prot.trips", "-", "Trips today", "Отключений за сутки", { encodings: ["i32"] }),
  logical("bus_diff_prot.zone", "Zone fault", "КЗ в зоне"),
  enu("bus_diff_prot.state", ["ok", "pickup", "trip", "check"], "State", "Состояние"),
]);

write("layer-b-xfmr_diff_prot.json", [
  id("xfmr_diff_prot.id", "Transformer differential protection id", "ID ДЗТ"),
  id("xfmr_diff_prot.xfmr.id", "Transformer id", "ID трансформатора"),
  q("xfmr_diff_prot.idiff", "A", "Differential current", "Дифференциальный ток"),
  q("xfmr_diff_prot.ih2", "%", "2nd harmonic", "2-я гармоника", { range: { min: 0, max: 100 } }),
  q("xfmr_diff_prot.ih5", "%", "5th harmonic", "5-я гармоника", { range: { min: 0, max: 100 } }),
  q("xfmr_diff_prot.trips", "-", "Trips today", "Отключений за сутки", { encodings: ["i32"] }),
  logical("xfmr_diff_prot.inrush", "Inrush block", "Блокировка от броска"),
  enu("xfmr_diff_prot.state", ["ok", "pickup", "trip", "inrush"], "State", "Состояние"),
]);

write("layer-b-bfp_relay.json", [
  id("bfp_relay.id", "Breaker failure protection id", "ID УРОВ"),
  id("bfp_relay.cb.id", "Circuit breaker id", "ID выключателя"),
  q("bfp_relay.timer.ms", "ms", "BF timer", "Выдержка УРОВ"),
  q("bfp_relay.current", "A", "Breaker current", "Ток выключателя"),
  q("bfp_relay.ops", "-", "BF operations today", "Срабатываний УРОВ за сутки", { encodings: ["i32"] }),
  q("bfp_relay.pickup.ms", "ms", "Current pickup delay", "Задержка пуска по току"),
  logical("bfp_relay.fail", "Breaker failed", "Выключатель отказал"),
  enu("bfp_relay.state", ["idle", "timing", "trip", "fault"], "State", "Состояние"),
]);

write("layer-b-synch_scope.json", [
  id("synch_scope.id", "Synchroscope / check-sync id", "ID синхроскопа"),
  id("synch_scope.cb.id", "Breaker id", "ID выключателя"),
  q("synch_scope.d_freq", "Hz", "Slip frequency", "Скольжение частоты"),
  q("synch_scope.d_angle", "deg", "Phase angle difference", "Разность углов"),
  q("synch_scope.d_volt", "V", "Voltage difference", "Разность напряжений"),
  q("synch_scope.wait.s", "s", "Wait for window", "Ожидание окна"),
  logical("synch_scope.window", "Sync window open", "Окно синхронизации открыто"),
  enu("synch_scope.state", ["wait", "close_permit", "block", "fault"], "State", "Состояние"),
]);

write("layer-b-arc_flash_rel.json", [
  id("arc_flash_rel.id", "Arc-flash relay id", "ID реле дуговой защиты"),
  id("arc_flash_rel.cubicle.id", "Cubicle id", "ID ячейки"),
  q("arc_flash_rel.light", "lx", "Light intensity", "Освещённость"),
  q("arc_flash_rel.current", "A", "Overcurrent pickup", "Пуск по току"),
  q("arc_flash_rel.trips", "-", "Trips today", "Отключений за сутки", { encodings: ["i32"] }),
  q("arc_flash_rel.sensors", "-", "Sensors healthy", "Исправных датчиков", { encodings: ["i32"] }),
  logical("arc_flash_rel.arc", "Arc detected", "Дуга обнаружена"),
  enu("arc_flash_rel.state", ["ok", "trip", "sensor_fail", "blocked"], "State", "Состояние"),
]);

write("layer-b-cb_wear_mon.json", [
  id("cb_wear_mon.cb.id", "Circuit breaker id", "ID выключателя"),
  q("cb_wear_mon.i2t", "-", "I2t wear", "Износ I2t"),
  q("cb_wear_mon.ops", "-", "Operations", "Коммутаций", { encodings: ["i32"] }),
  q("cb_wear_mon.time.ms", "ms", "Opening time", "Время отключения"),
  q("cb_wear_mon.contact.wear", "%", "Contact wear", "Износ контактов", { range: { min: 0, max: 100 } }),
  q("cb_wear_mon.coil.current", "A", "Trip coil current", "Ток отключающей катушки"),
  logical("cb_wear_mon.overhaul", "Overhaul due", "Нужен ремонт"),
  enu("cb_wear_mon.state", ["ok", "watch", "overhaul", "fault"], "State", "Состояние"),
]);

write("layer-b-sf6_dens.json", [
  id("sf6_dens.cb.id", "SF6 breaker density id", "ID плотности SF6 выключателя"),
  q("sf6_dens.density", "kg/m3", "Gas density", "Плотность газа"),
  q("sf6_dens.pressure", "kPa", "Pressure", "Давление"),
  q("sf6_dens.temp", "Cel", "Temperature", "Температура"),
  q("sf6_dens.trend", "%/d", "Density trend", "Тренд плотности"),
  q("sf6_dens.refills", "-", "Refills this year", "Дозаправок за год", { encodings: ["i32"] }),
  logical("sf6_dens.lockout", "Density lockout", "Блокировка по плотности"),
  enu("sf6_dens.state", ["ok", "alarm", "lockout", "offline"], "State", "Состояние"),
]);

write("layer-b-gis_p_mon.json", [
  id("gis_p_mon.bay.id", "GIS bay pressure id", "ID давления отсека КРУЭ"),
  q("gis_p_mon.pressure", "kPa", "Compartment pressure", "Давление отсека"),
  q("gis_p_mon.temp", "Cel", "Compartment temperature", "Температура отсека"),
  q("gis_p_mon.pd", "pC", "PD level", "Уровень ЧР"),
  q("gis_p_mon.humidity", "%", "Moisture", "Влага", { range: { min: 0, max: 100 } }),
  q("gis_p_mon.alarms", "-", "Active alarms", "Активных аварий", { encodings: ["i32"] }),
  logical("gis_p_mon.low.p", "Low pressure", "Низкое давление"),
  enu("gis_p_mon.state", ["ok", "watch", "alarm", "lockout"], "State", "Состояние"),
]);

write("layer-b-wave_trap.json", [
  id("wave_trap.id", "Line wave trap id", "ID ВЧ-заградителя"),
  q("wave_trap.impedance", "Ohm", "Blocking impedance", "Заградительное сопротивление"),
  q("wave_trap.freq", "kHz", "Tuning frequency", "Частота настройки"),
  q("wave_trap.current", "A", "Line current", "Ток линии"),
  q("wave_trap.temp", "Cel", "Coil temperature", "Температура катушки"),
  q("wave_trap.pd", "pC", "PD", "ЧР"),
  logical("wave_trap.detune", "Detuned", "Расстроено"),
  enu("wave_trap.state", ["ok", "detune", "fault", "bypass"], "State", "Состояние"),
]);

write("layer-b-plc_carrier.json", [
  id("plc_carrier.link.id", "Power-line carrier link id", "ID ВЧ-связи"),
  q("plc_carrier.snr", "dB", "SNR", "ОСШ"),
  q("plc_carrier.level", "dBm", "Receive level", "Уровень приёма"),
  q("plc_carrier.freq", "kHz", "Carrier frequency", "Несущая"),
  q("plc_carrier.ber", "-", "Bit error rate", "ВЕО"),
  q("plc_carrier.noise", "dBm", "Noise floor", "Шумовой фон"),
  logical("plc_carrier.guard", "Guard signal lost", "Потерян охранный сигнал"),
  enu("plc_carrier.state", ["ok", "degrade", "fail", "test"], "State", "Состояние"),
]);

write("layer-b-opgw_fiber.json", [
  id("opgw_fiber.span.id", "OPGW span id", "ID пролёта ОКГТ"),
  q("opgw_fiber.loss", "dB", "Span loss", "Затухание пролёта"),
  q("opgw_fiber.temp", "Cel", "Cable temperature", "Температура кабеля"),
  q("opgw_fiber.strain", "ue", "Strain", "Деформация"),
  q("opgw_fiber.otdr", "dB", "OTDR event loss", "Потери события OTDR"),
  q("opgw_fiber.fibers.ok", "-", "Fibers healthy", "Исправных волокон", { encodings: ["i32"] }),
  logical("opgw_fiber.break", "Fiber break", "Обрыв волокна"),
  enu("opgw_fiber.state", ["ok", "watch", "break", "offline"], "State", "Состояние"),
]);

write("layer-b-tower_lean.json", [
  id("tower_lean.tower.id", "Transmission tower id", "ID опоры ВЛ"),
  q("tower_lean.tilt", "deg", "Tilt", "Наклон"),
  q("tower_lean.twist", "deg", "Twist", "Кручение"),
  q("tower_lean.vib", "mm/s", "Vibration", "Вибрация"),
  q("tower_lean.wind", "m/s", "Wind speed", "Скорость ветра"),
  q("tower_lean.ice", "mm", "Ice thickness", "Толщина гололёда"),
  logical("tower_lean.alarm", "Lean alarm", "Тревога наклона"),
  enu("tower_lean.state", ["ok", "watch", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-insulator_leak.json", [
  id("insulator_leak.string.id", "Insulator string id", "ID гирлянды изоляторов"),
  q("insulator_leak.current", "mA", "Leakage current", "Ток утечки"),
  q("insulator_leak.humidity", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("insulator_leak.esdd", "mg/m2", "ESDD", "ЭСЗП"),
  q("insulator_leak.flashovers", "-", "Flashovers", "Перекрытий", { encodings: ["i32"] }),
  q("insulator_leak.temp", "Cel", "Surface temperature", "Температура поверхности"),
  logical("insulator_leak.pollute", "Pollution high", "Высокое загрязнение"),
  enu("insulator_leak.state", ["ok", "wash_due", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-corona_cam.json", [
  id("corona_cam.id", "UV corona camera id", "ID УФ-камеры короны"),
  id("corona_cam.asset.id", "Inspected asset id", "ID объекта осмотра"),
  q("corona_cam.count", "-", "Corona photon count", "Счёт фотонов короны", { encodings: ["i32"] }),
  q("corona_cam.gain", "-", "Camera gain", "Усиление камеры"),
  q("corona_cam.distance", "m", "Standoff distance", "Дистанция"),
  q("corona_cam.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  logical("corona_cam.hotspot", "Corona hotspot", "Очаг короны"),
  enu("corona_cam.state", ["scan", "idle", "fault", "offline"], "State", "Состояние"),
]);

write("layer-b-rfi_mon.json", [
  id("rfi_mon.id", "RFI / corona RF monitor id", "ID РЧ-монитора помех"),
  q("rfi_mon.level", "dBm", "RFI level", "Уровень РЧ-помех"),
  q("rfi_mon.freq", "MHz", "Peak frequency", "Частота пика"),
  q("rfi_mon.pulses", "/s", "Pulse rate", "Частота импульсов"),
  q("rfi_mon.snr", "dB", "SNR", "ОСШ"),
  q("rfi_mon.temp", "Cel", "Sensor temperature", "Температура датчика"),
  logical("rfi_mon.alarm", "RFI alarm", "Тревога помех"),
  enu("rfi_mon.state", ["ok", "watch", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-ground_fault.json", [
  id("ground_fault.feeder.id", "Ground-fault detector id", "ID ОЗЗ фидера"),
  q("ground_fault.io", "A", "Residual current", "Ток нулевой последовательности"),
  q("ground_fault.vo", "V", "Residual voltage", "Напряжение нулевой последовательности"),
  q("ground_fault.angle", "deg", "I0/V0 angle", "Угол I0/V0"),
  q("ground_fault.duration.s", "s", "Fault duration", "Длительность замыкания"),
  q("ground_fault.events", "-", "Events today", "Событий за сутки", { encodings: ["i32"] }),
  logical("ground_fault.active", "Earth fault active", "ОЗЗ активно"),
  enu("ground_fault.state", ["healthy", "alarm", "trip", "intermittent"], "State", "Состояние"),
]);

write("layer-b-neutral_shift.json", [
  id("neutral_shift.bus.id", "Neutral displacement monitor id", "ID смещения нейтрали"),
  q("neutral_shift.vo", "V", "Neutral voltage", "Напряжение нейтрали"),
  q("neutral_shift.unbalance", "%", "Voltage unbalance", "Несимметрия", { range: { min: 0, max: 100 } }),
  q("neutral_shift.freq", "Hz", "Frequency", "Частота"),
  q("neutral_shift.duration.s", "s", "Shift duration", "Длительность смещения"),
  q("neutral_shift.events", "-", "Events today", "Событий за сутки", { encodings: ["i32"] }),
  logical("neutral_shift.alarm", "Neutral shift alarm", "Тревога смещения нейтрали"),
  enu("neutral_shift.state", ["ok", "watch", "alarm", "offline"], "State", "Состояние"),
]);

write("layer-b-feranti_rise.json", [
  id("feranti_rise.line.id", "Ferranti-effect monitor id", "ID монитора эффекта Ферранти"),
  q("feranti_rise.vs", "kV", "Sending-end voltage", "Напряжение начала"),
  q("feranti_rise.vr", "kV", "Receiving-end voltage", "Напряжение конца"),
  q("feranti_rise.rise", "%", "Voltage rise", "Подъём напряжения", { range: { min: 0, max: 100 } }),
  q("feranti_rise.mvar", "var", "Charging vars", "Зарядная мощность"),
  q("feranti_rise.load", "A", "Line current", "Ток линии"),
  logical("feranti_rise.overv", "Overvoltage", "Перенапряжение"),
  enu("feranti_rise.state", ["ok", "rise", "reactor_in", "fault"], "State", "Состояние"),
]);

write("layer-b-sssc_dev.json", [
  id("sssc_dev.id", "SSSC device id", "ID СССК"),
  q("sssc_dev.inject.v", "kV", "Injected voltage", "Инжектируемое напряжение"),
  q("sssc_dev.current", "A", "Line current", "Ток линии"),
  q("sssc_dev.angle", "deg", "Injection angle", "Угол инжекции"),
  q("sssc_dev.power", "W", "Controlled power", "Управляемая мощность"),
  q("sssc_dev.temp", "Cel", "Converter temperature", "Температура преобразователя"),
  logical("sssc_dev.bypass", "Bypassed", "Зашунтирован"),
  enu("sssc_dev.mode", ["inject", "bypass", "standby", "fault"], "Mode", "Режим"),
]);

write("layer-b-upfc_dev.json", [
  id("upfc_dev.id", "UPFC id", "ID УПКМ"),
  q("upfc_dev.p", "W", "Controlled P", "Управляемая P"),
  q("upfc_dev.q", "var", "Controlled Q", "Управляемая Q"),
  q("upfc_dev.series.v", "kV", "Series voltage", "Последовательное напряжение"),
  q("upfc_dev.shunt.i", "A", "Shunt current", "Ток шунта"),
  q("upfc_dev.dc.v", "kV", "DC link voltage", "Напряжение DC-звена"),
  logical("upfc_dev.limit", "Capability limit", "Предел диапазона"),
  enu("upfc_dev.mode", ["pq", "voltage", "standby", "fault"], "Mode", "Режим"),
]);

write("layer-b-tcsc_bay.json", [
  id("tcsc_bay.id", "TCSC bay id", "ID ТУПК"),
  q("tcsc_bay.x", "Ohm", "Apparent reactance", "Кажущееся сопротивление"),
  q("tcsc_bay.alpha", "deg", "Firing angle", "Угол зажигания"),
  q("tcsc_bay.current", "A", "Line current", "Ток линии"),
  q("tcsc_bay.boost", "%", "Compensation boost", "Усиление компенсации", { range: { min: 0, max: 100 } }),
  q("tcsc_bay.ssr", "-", "SSR damping index", "Индекс демпфирования ССР"),
  logical("tcsc_bay.bypass", "Bypassed", "Зашунтирован"),
  enu("tcsc_bay.mode", ["capacitive", "inductive", "bypass", "fault"], "Mode", "Режим"),
]);

write("layer-b-vsc_hvdc.json", [
  id("vsc_hvdc.pole.id", "VSC-HVDC pole id", "ID полюса VSC-HVDC"),
  q("vsc_hvdc.p", "W", "Active power", "Активная мощность"),
  q("vsc_hvdc.q", "var", "Reactive power", "Реактивная мощность"),
  q("vsc_hvdc.dc.v", "kV", "DC voltage", "Напряжение DC"),
  q("vsc_hvdc.mod", "%", "Modulation index", "Индекс модуляции", { range: { min: 0, max: 100 } }),
  q("vsc_hvdc.igbt.temp", "Cel", "IGBT temperature", "Температура IGBT"),
  logical("vsc_hvdc.blocked", "Blocked", "Заблокирован"),
  enu("vsc_hvdc.control", ["p_q", "vdc_q", "acv", "island", "fault"], "Control", "Управление"),
]);

write("layer-b-lcc_hvdc.json", [
  id("lcc_hvdc.pole.id", "LCC-HVDC pole id", "ID полюса LCC-HVDC"),
  q("lcc_hvdc.p", "W", "Transferred power", "Передаваемая мощность"),
  q("lcc_hvdc.alpha", "deg", "Firing angle alpha", "Угол alpha"),
  q("lcc_hvdc.gamma", "deg", "Extinction angle gamma", "Угол gamma"),
  q("lcc_hvdc.dc.i", "A", "DC current", "Ток DC"),
  q("lcc_hvdc.comm.fail", "-", "Commutation failures", "Срывов коммутации", { encodings: ["i32"] }),
  logical("lcc_hvdc.bypass", "Bypass pair", "Байпасная пара"),
  enu("lcc_hvdc.mode", ["rectifier", "inverter", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-filter_ac.json", [
  id("filter_ac.bank.id", "AC harmonic filter id", "ID фильтра гармоник AC"),
  q("filter_ac.current", "A", "Filter current", "Ток фильтра"),
  q("filter_ac.detune", "%", "Detuning", "Расстройка", { range: { min: 0, max: 100 } }),
  q("filter_ac.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("filter_ac.q", "var", "Filter vars", "Реактив фильтра"),
  q("filter_ac.unbalance", "%", "Branch unbalance", "Несимметрия ветвей", { range: { min: 0, max: 100 } }),
  logical("filter_ac.out", "Filter out of service", "Фильтр выведен"),
  enu("filter_ac.tune", ["hp11", "hp13", "hp24", "c", "other"], "Tuning", "Настройка"),
]);

write("layer-b-filter_dc.json", [
  id("filter_dc.bank.id", "DC filter bank id", "ID фильтра DC"),
  q("filter_dc.ripple", "%", "DC voltage ripple", "Пульсации DC", { range: { min: 0, max: 100 } }),
  q("filter_dc.current", "A", "Filter current", "Ток фильтра"),
  q("filter_dc.temp", "Cel", "Component temperature", "Температура элементов"),
  q("filter_dc.pd", "pC", "PD", "ЧР"),
  q("filter_dc.unbalance", "%", "Unbalance", "Несимметрия", { range: { min: 0, max: 100 } }),
  logical("filter_dc.trip", "Filter trip", "Отключение фильтра"),
  enu("filter_dc.state", ["in", "out", "fault", "test"], "State", "Состояние"),
]);

write("layer-b-smoothing_rx.json", [
  id("smoothing_rx.id", "HVDC smoothing reactor id", "ID сглаживающего реактора HVDC"),
  q("smoothing_rx.current", "A", "DC current", "Ток DC"),
  q("smoothing_rx.temp", "Cel", "Winding temperature", "Температура обмотки"),
  q("smoothing_rx.l", "H", "Inductance", "Индуктивность"),
  q("smoothing_rx.vib", "mm/s", "Vibration", "Вибрация"),
  q("smoothing_rx.pd", "pC", "PD", "ЧР"),
  logical("smoothing_rx.hot", "Overtemperature", "Перегрев"),
  enu("smoothing_rx.state", ["in", "bypass", "fault"], "State", "Состояние"),
]);

write("layer-b-valve_hall.json", [
  id("valve_hall.id", "HVDC valve hall id", "ID зала вентилей HVDC"),
  q("valve_hall.temp", "Cel", "Hall temperature", "Температура зала"),
  q("valve_hall.humidity", "%", "Humidity", "Влажность", { range: { min: 0, max: 100 } }),
  q("valve_hall.dust", "ug/m3", "Particulates", "Пыль"),
  q("valve_hall.sf6", "ppm", "SF6 / air quality", "SF6 / воздух"),
  q("valve_hall.access", "-", "People in hall", "Людей в зале", { encodings: ["i32"] }),
  logical("valve_hall.interlock", "Access interlock OK", "Блокировка доступа OK"),
  enu("valve_hall.state", ["energized", "isolated", "maintain", "fault"], "State", "Состояние"),
]);

write("layer-b-thyristor_valve.json", [
  id("thyristor_valve.id", "Thyristor valve id", "ID тиристорного вентиля"),
  q("thyristor_valve.temp", "Cel", "Junction temperature", "Температура перехода"),
  q("thyristor_valve.current", "A", "Valve current", "Ток вентиля"),
  q("thyristor_valve.failed", "-", "Failed levels", "Отказных уровней", { encodings: ["i32"] }),
  q("thyristor_valve.coolant", "Cel", "Coolant temperature", "Температура охлаждения"),
  q("thyristor_valve.snubber", "V", "Snubber voltage", "Напряжение снаббера"),
  logical("thyristor_valve.redundancy", "Redundancy exhausted", "Резерв исчерпан"),
  enu("thyristor_valve.state", ["conduct", "block", "bypass", "fault"], "State", "Состояние"),
]);

write("layer-b-igbt_valve.json", [
  id("igbt_valve.id", "MMC / IGBT valve id", "ID вентиля MMC/IGBT"),
  q("igbt_valve.sm.temp", "Cel", "Submodule temperature", "Температура субмодуля"),
  q("igbt_valve.sm.v", "V", "Submodule voltage", "Напряжение субмодуля"),
  q("igbt_valve.failed", "-", "Failed submodules", "Отказных субмодулей", { encodings: ["i32"] }),
  q("igbt_valve.switching", "Hz", "Switching frequency", "Частота коммутации"),
  q("igbt_valve.coolant", "Cel", "Coolant temperature", "Температура охлаждения"),
  logical("igbt_valve.bypass", "Submodule bypassed", "Субмодуль зашунтирован"),
  enu("igbt_valve.state", ["run", "blocked", "fault"], "State", "Состояние"),
]);

write("layer-b-cooling_hvdc.json", [
  id("cooling_hvdc.id", "HVDC cooling skid id", "ID охлаждения HVDC"),
  q("cooling_hvdc.flow", "m3/h", "Coolant flow", "Расход теплоносителя"),
  q("cooling_hvdc.in.temp", "Cel", "Inlet temperature", "Температура на входе"),
  q("cooling_hvdc.out.temp", "Cel", "Outlet temperature", "Температура на выходе"),
  q("cooling_hvdc.conductivity", "uS/cm", "Coolant conductivity", "Проводимость теплоносителя"),
  q("cooling_hvdc.pressure", "kPa", "Loop pressure", "Давление контура"),
  logical("cooling_hvdc.leak", "Leak", "Утечка"),
  enu("cooling_hvdc.state", ["run", "standby", "flush", "fault"], "State", "Состояние"),
]);

write("layer-b-fire_hvdc.json", [
  id("fire_hvdc.zone.id", "HVDC fire zone id", "ID зоны пожарной защиты HVDC"),
  q("fire_hvdc.smoke", "%", "Smoke density", "Плотность дыма", { range: { min: 0, max: 100 } }),
  q("fire_hvdc.temp", "Cel", "Zone temperature", "Температура зоны"),
  q("fire_hvdc.co", "ppm", "CO", "CO"),
  q("fire_hvdc.detectors", "-", "Detectors in alarm", "Датчиков в тревоге", { encodings: ["i32"] }),
  q("fire_hvdc.suppress", "%", "Suppression ready", "Готовность тушения", { range: { min: 0, max: 100 } }),
  logical("fire_hvdc.alarm", "Fire alarm", "Пожарная тревога"),
  enu("fire_hvdc.state", ["normal", "alert", "alarm", "release"], "State", "Состояние"),
]);

write("layer-b-electrode_line.json", [
  id("electrode_line.id", "HVDC electrode line id", "ID электродной линии HVDC"),
  q("electrode_line.current", "A", "Earth/sea electrode current", "Ток электрода"),
  q("electrode_line.voltage", "kV", "Electrode voltage", "Напряжение электрода"),
  q("electrode_line.corr", "mm/y", "Corrosion rate", "Скорость коррозии"),
  q("electrode_line.temp", "Cel", "Electrode temperature", "Температура электрода"),
  q("electrode_line.leak", "A", "Stray current", "Блуждающий ток"),
  logical("electrode_line.imbalance", "Pole imbalance", "Дисбаланс полюсов"),
  enu("electrode_line.type", ["land", "sea", "deepwell", "other"], "Type", "Тип"),
]);

console.log("Layer B23 seeds written");
