#!/usr/bin/env node
/**
 * Layer B27 — cement, glass, ceramics, nonferrous, foundry, metal AM.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B27", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-cement_kiln.json", [
  id("cement_kiln.id", "Cement kiln id", "ID цементной печи"),
  q("cement_kiln.temp", "Cel", "Burning zone temperature", "Температура зоны спекания"),
  q("cement_kiln.speed", "rpm", "Kiln speed", "Обороты печи"),
  q("cement_kiln.feed", "t/h", "Raw meal feed", "Подача сырьевой муки"),
  q("cement_kiln.fuel", "t/h", "Fuel rate", "Расход топлива"),
  q("cement_kiln.nox", "mg/Nm3", "NOx", "NOx"),
  logical("cement_kiln.coating", "Coating ring", "Кольцо обмазки"),
  enu("cement_kiln.state", ["run", "heat", "idle", "fault"], "Kiln state", "Состояние печи"),
]);

write("layer-b-cement_mill.json", [
  id("cement_mill.id", "Cement finish mill id", "ID цементной мельницы"),
  q("cement_mill.power", "kW", "Mill power", "Мощность мельницы"),
  q("cement_mill.output", "t/h", "Cement output", "Выпуск цемента"),
  q("cement_mill.blaine", "/cm2", "Blaine fineness", "Тонкость Блейна"),
  q("cement_mill.resid", "%", "Residue 45 µm", "Остаток 45 мкм", { range: { min: 0, max: 100 } }),
  q("cement_mill.temp", "Cel", "Mill temperature", "Температура мельницы"),
  logical("cement_mill.separator", "Separator online", "Сепаратор онлайн"),
  enu("cement_mill.type", ["ball", "vertical", "roller", "other"], "Type", "Тип"),
]);

write("layer-b-clinker_cooler.json", [
  id("clinker_cooler.id", "Clinker cooler id", "ID холодильника клинкера"),
  q("clinker_cooler.exit.temp", "Cel", "Clinker exit temperature", "Температура клинкера на выходе"),
  q("clinker_cooler.air", "m3/h", "Cooling air", "Охлаждающий воздух"),
  q("clinker_cooler.grate", "m/min", "Grate speed", "Скорость колосниковой решётки"),
  q("clinker_cooler.recovery", "%", "Heat recovery", "Рекуперация тепла", { range: { min: 0, max: 100 } }),
  q("clinker_cooler.throughput", "t/h", "Clinker throughput", "Пропуск клинкера"),
  logical("clinker_cooler.snowman", "Snowman risk", "Риск «снеговика»"),
  enu("clinker_cooler.state", ["cool", "idle", "maintain", "fault"], "Cooler state", "Состояние холодильника"),
]);

write("layer-b-raw_mill.json", [
  id("raw_mill.id", "Raw mill id", "ID сырьевой мельницы"),
  q("raw_mill.feed", "t/h", "Feed rate", "Подача"),
  q("raw_mill.fineness", "%", "Residue", "Остаток", { range: { min: 0, max: 100 } }),
  q("raw_mill.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("raw_mill.power", "kW", "Mill power", "Мощность мельницы"),
  q("raw_mill.lsf", "-", "Lime saturation factor", "Коэффициент насыщения известью"),
  logical("raw_mill.chem.ok", "Chemistry OK", "Химия OK"),
  enu("raw_mill.state", ["grind", "idle", "maintain", "fault"], "Mill state", "Состояние мельницы"),
]);

write("layer-b-preheater_cyc.json", [
  id("preheater_cyc.id", "Preheater cyclone string id", "ID циклонной системы подогревателя"),
  q("preheater_cyc.temp.top", "Cel", "Top cyclone temperature", "Температура верхнего циклона"),
  q("preheater_cyc.temp.bottom", "Cel", "Bottom cyclone temperature", "Температура нижнего циклона"),
  q("preheater_cyc.dp", "Pa", "String DP", "Перепад по системе"),
  q("preheater_cyc.o2", "%", "Exit O2", "O2 на выходе", { range: { min: 0, max: 100 } }),
  q("preheater_cyc.co", "ppm", "CO", "CO"),
  logical("preheater_cyc.buildup", "Build-up alarm", "Тревога налипания"),
  enu("preheater_cyc.state", ["run", "purge", "idle", "fault"], "String state", "Состояние системы"),
]);

write("layer-b-baghouse_cem.json", [
  id("baghouse_cem.id", "Cement plant baghouse id", "ID рукавного фильтра цементного завода"),
  q("baghouse_cem.dp", "Pa", "Baghouse DP", "Перепад на фильтре"),
  q("baghouse_cem.dust", "mg/Nm3", "Outlet dust", "Пыль на выходе"),
  q("baghouse_cem.temp", "Cel", "Gas temperature", "Температура газа"),
  q("baghouse_cem.pulse", "-", "Pulse cycles today", "Импульсов за сутки", { encodings: ["i32"] }),
  q("baghouse_cem.flow", "m3/h", "Gas flow", "Расход газа"),
  logical("baghouse_cem.bag.fail", "Bag failure", "Отказ рукава"),
  enu("baghouse_cem.state", ["filter", "pulse", "offline", "fault"], "Baghouse state", "Состояние фильтра"),
]);

write("layer-b-quarry_crusher.json", [
  id("quarry_crusher.id", "Quarry crusher id", "ID дробилки карьера"),
  q("quarry_crusher.throughput", "t/h", "Throughput", "Производительность"),
  q("quarry_crusher.power", "kW", "Crusher power", "Мощность дробилки"),
  q("quarry_crusher.size", "mm", "Product size", "Размер продукта"),
  q("quarry_crusher.vib", "mm/s", "Vibration", "Вибрация"),
  q("quarry_crusher.liners", "%", "Liner life left", "Остаток ресурса футеровки", { range: { min: 0, max: 100 } }),
  logical("quarry_crusher.jam", "Crusher jam", "Засор дробилки"),
  enu("quarry_crusher.type", ["jaw", "gyratory", "impact", "other"], "Type", "Тип"),
]);

write("layer-b-stacker_reclaim.json", [
  id("stacker_reclaim.id", "Stacker-reclaimer id", "ID стакер-реклаймера"),
  q("stacker_reclaim.rate", "t/h", "Stack / reclaim rate", "Скорость штабелирования/забора"),
  q("stacker_reclaim.boom", "deg", "Boom angle", "Угол стрелы"),
  q("stacker_reclaim.travel", "m", "Travel position", "Позиция перемещения"),
  q("stacker_reclaim.stock", "t", "Stockpile mass", "Масса штабеля"),
  q("stacker_reclaim.power", "kW", "Machine power", "Мощность машины"),
  logical("stacker_reclaim.auto", "Automatic mode", "Автоматический режим"),
  enu("stacker_reclaim.mode", ["stack", "reclaim", "idle", "fault"], "Mode", "Режим"),
]);

write("layer-b-pack_cement.json", [
  id("pack_cement.line.id", "Cement packing line id", "ID линии фасовки цемента"),
  q("pack_cement.bags", "/h", "Bags per hour", "Мешков в час"),
  q("pack_cement.weight", "kg", "Bag weight", "Масса мешка"),
  q("pack_cement.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("pack_cement.spillage", "kg/h", "Spillage", "Просыпь"),
  q("pack_cement.uptime", "%", "Uptime", "Готовность", { range: { min: 0, max: 100 } }),
  logical("pack_cement.jam", "Bag jam", "Замятие мешка"),
  enu("pack_cement.state", ["pack", "idle", "clean", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-bulk_load_cem.json", [
  id("bulk_load_cem.silo.id", "Cement bulk loading silo id", "ID силоса отгрузки цемента"),
  q("bulk_load_cem.rate", "t/h", "Loading rate", "Скорость погрузки"),
  q("bulk_load_cem.level", "%", "Silo level", "Уровень силоса", { range: { min: 0, max: 100 } }),
  q("bulk_load_cem.trucks", "-", "Trucks today", "Машин за сутки", { encodings: ["i32"] }),
  q("bulk_load_cem.dust", "mg/m3", "Loading dust", "Пыль при погрузке"),
  q("bulk_load_cem.weight", "t", "Last load weight", "Масса последней отгрузки"),
  logical("bulk_load_cem.active", "Loading active", "Погрузка идёт"),
  enu("bulk_load_cem.state", ["load", "idle", "maintain", "fault"], "Silo state", "Состояние силоса"),
]);

write("layer-b-glass_furnace.json", [
  id("glass_furnace.id", "Glass melting furnace id", "ID стекловаренной печи"),
  q("glass_furnace.temp", "Cel", "Glass temperature", "Температура стекла"),
  q("glass_furnace.pull", "t/d", "Pull rate", "Съём"),
  q("glass_furnace.fuel", "m3/h", "Fuel rate", "Расход топлива"),
  q("glass_furnace.crown", "Cel", "Crown temperature", "Температура свода"),
  q("glass_furnace.level", "mm", "Glass level", "Уровень стекла"),
  logical("glass_furnace.seed", "Seeds high", "Высокая пузыристость"),
  enu("glass_furnace.type", ["float", "container", "fiber", "other"], "Type", "Тип"),
]);

write("layer-b-float_bath.json", [
  id("float_bath.id", "Float glass tin bath id", "ID ванны расплава float"),
  q("float_bath.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("float_bath.thick", "mm", "Glass thickness", "Толщина стекла"),
  q("float_bath.width", "mm", "Ribbon width", "Ширина ленты"),
  q("float_bath.speed", "m/min", "Ribbon speed", "Скорость ленты"),
  q("float_bath.n2", "m3/h", "Protective atmosphere", "Защитная атмосфера"),
  logical("float_bath.dross", "Dross high", "Высокий дросс"),
  enu("float_bath.state", ["form", "idle", "maintain", "fault"], "Bath state", "Состояние ванны"),
]);

write("layer-b-lehr_anneal.json", [
  id("lehr_anneal.id", "Annealing lehr id", "ID печи отжига стекла"),
  q("lehr_anneal.temp.in", "Cel", "Entry temperature", "Температура на входе"),
  q("lehr_anneal.temp.out", "Cel", "Exit temperature", "Температура на выходе"),
  q("lehr_anneal.speed", "m/min", "Belt speed", "Скорость ленты"),
  q("lehr_anneal.stress", "nm/cm", "Residual stress proxy", "Остаточные напряжения"),
  q("lehr_anneal.power", "kW", "Lehr power", "Мощность печи"),
  logical("lehr_anneal.break", "Ribbon break", "Обрыв ленты"),
  enu("lehr_anneal.state", ["anneal", "idle", "cool", "fault"], "Lehr state", "Состояние печи"),
]);

write("layer-b-glass_cut.json", [
  id("glass_cut.line.id", "Glass cutting line id", "ID линии резки стекла"),
  q("glass_cut.speed", "m/min", "Cut speed", "Скорость резки"),
  q("glass_cut.yield", "%", "Cut yield", "Выход резки", { range: { min: 0, max: 100 } }),
  q("glass_cut.breakage", "%", "Breakage", "Бой", { range: { min: 0, max: 100 } }),
  q("glass_cut.sheets", "/h", "Sheets per hour", "Листов в час"),
  q("glass_cut.score", "N", "Score force", "Усилие надреза"),
  logical("glass_cut.jam", "Line jam", "Затор"),
  enu("glass_cut.state", ["cut", "snap", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-bottle_is.json", [
  id("bottle_is.machine.id", "IS bottle machine id", "ID машины ИС для бутылок"),
  q("bottle_is.gobs", "/min", "Gobs per minute", "Капель в минуту"),
  q("bottle_is.pack", "%", "Pack-to-melt", "Выход годного", { range: { min: 0, max: 100 } }),
  q("bottle_is.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("bottle_is.temp", "Cel", "Mold temperature", "Температура формы"),
  q("bottle_is.sections", "-", "Sections running", "Секций в работе", { encodings: ["i32"] }),
  logical("bottle_is.stuck", "Stuck ware", "Застревание изделий"),
  enu("bottle_is.process", ["blow_blow", "press_blow", "nnpb", "other"], "Process", "Процесс"),
]);

write("layer-b-forehearth.json", [
  id("forehearth.id", "Glass forehearth id", "ID питателя/фронтальной печи"),
  q("forehearth.temp", "Cel", "Gob temperature", "Температура капли"),
  q("forehearth.flow", "t/d", "Glass flow", "Расход стекла"),
  q("forehearth.level", "mm", "Glass level", "Уровень стекла"),
  q("forehearth.zones", "-", "Zones in control", "Зон под управлением", { encodings: ["i32"] }),
  q("forehearth.gas", "m3/h", "Fuel gas", "Топливный газ"),
  logical("forehearth.stable", "Temperature stable", "Температура стабильна"),
  enu("forehearth.state", ["feed", "idle", "drain", "fault"], "Forehearth state", "Состояние питателя"),
]);

write("layer-b-tin_bath.json", [
  id("tin_bath.id", "Tin bath (float) id", "ID оловянной ванны"),
  q("tin_bath.temp", "Cel", "Tin temperature", "Температура олова"),
  q("tin_bath.level", "mm", "Tin level", "Уровень олова"),
  q("tin_bath.o2", "ppm", "Atmosphere O2", "O2 в атмосфере"),
  q("tin_bath.dross", "kg/d", "Dross removed", "Дросса удалено"),
  q("tin_bath.h2", "%", "H2 in atmosphere", "H2 в атмосфере", { range: { min: 0, max: 100 } }),
  logical("tin_bath.leak", "Atmosphere leak", "Подсос атмосферы"),
  enu("tin_bath.state", ["form", "idle", "maintain", "fault"], "Bath state", "Состояние ванны"),
]);

write("layer-b-coating_glass.json", [
  id("coating_glass.line.id", "Glass coating line id", "ID линии нанесения покрытий на стекло"),
  q("coating_glass.thick", "nm", "Coating thickness", "Толщина покрытия"),
  q("coating_glass.speed", "m/min", "Line speed", "Скорость линии"),
  q("coating_glass.uniform", "%", "Uniformity", "Равномерность", { range: { min: 0, max: 100 } }),
  q("coating_glass.defect", "-", "Defects per m2", "Дефектов на м²", { encodings: ["i32"] }),
  q("coating_glass.vacuum", "Pa", "Chamber vacuum", "Вакуум камеры"),
  logical("coating_glass.in_spec", "Coat in spec", "Покрытие в норме"),
  enu("coating_glass.process", ["sputter", "cvd", "spray", "other"], "Process", "Процесс"),
]);

write("layer-b-ceramic_kiln.json", [
  id("ceramic_kiln.id", "Ceramic kiln id", "ID керамической печи"),
  q("ceramic_kiln.temp", "Cel", "Firing temperature", "Температура обжига"),
  q("ceramic_kiln.cycle.h", "h", "Firing cycle", "Цикл обжига"),
  q("ceramic_kiln.o2", "%", "Atmosphere O2", "O2 атмосферы", { range: { min: 0, max: 100 } }),
  q("ceramic_kiln.shrink", "%", "Shrinkage", "Усадка", { range: { min: 0, max: 100 } }),
  q("ceramic_kiln.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("ceramic_kiln.crack", "Crack risk", "Риск трещин"),
  enu("ceramic_kiln.type", ["tunnel", "roller", "shuttle", "other"], "Type", "Тип"),
]);

write("layer-b-spray_dryer_cer.json", [
  id("spray_dryer_cer.id", "Ceramic spray dryer id", "ID распылительной сушилки керамики"),
  q("spray_dryer_cer.inlet", "Cel", "Inlet temperature", "Температура на входе"),
  q("spray_dryer_cer.outlet", "Cel", "Outlet temperature", "Температура на выходе"),
  q("spray_dryer_cer.moisture", "%", "Powder moisture", "Влажность порошка", { range: { min: 0, max: 100 } }),
  q("spray_dryer_cer.throughput", "t/h", "Powder output", "Выпуск порошка"),
  q("spray_dryer_cer.atom", "rpm", "Atomizer speed", "Обороты распылителя"),
  logical("spray_dryer_cer.stick", "Chamber sticking", "Налипание в камере"),
  enu("spray_dryer_cer.state", ["dry", "clean", "idle", "fault"], "Dryer state", "Состояние сушилки"),
]);

write("layer-b-press_tile.json", [
  id("press_tile.id", "Tile press id", "ID пресса плитки"),
  q("press_tile.force", "kN", "Press force", "Усилие пресса"),
  q("press_tile.cycle.s", "s", "Cycle time", "Время цикла"),
  q("press_tile.density", "g/cm3", "Green density", "Плотность сырца"),
  q("press_tile.thickness", "mm", "Tile thickness", "Толщина плитки"),
  q("press_tile.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("press_tile.crack", "Green crack", "Трещина сырца"),
  enu("press_tile.state", ["press", "idle", "tool", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-glaze_line.json", [
  id("glaze_line.id", "Glaze application line id", "ID линии глазурования"),
  q("glaze_line.weight", "g/m2", "Glaze weight", "Масса глазури"),
  q("glaze_line.viscosity", "mPa.s", "Glaze viscosity", "Вязкость глазури"),
  q("glaze_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("glaze_line.coverage", "%", "Coverage", "Покрытие", { range: { min: 0, max: 100 } }),
  q("glaze_line.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("glaze_line.drip", "Drip defect", "Дефект потёка"),
  enu("glaze_line.process", ["spray", "disk", "waterfall", "other"], "Process", "Процесс"),
]);

write("layer-b-brick_tunnel.json", [
  id("brick_tunnel.id", "Brick tunnel kiln id", "ID туннельной печи кирпича"),
  q("brick_tunnel.temp", "Cel", "Firing temperature", "Температура обжига"),
  q("brick_tunnel.cars", "-", "Cars in kiln", "Вагонеток в печи", { encodings: ["i32"] }),
  q("brick_tunnel.push.h", "h", "Push interval", "Интервал толкания"),
  q("brick_tunnel.fuel", "m3/h", "Fuel rate", "Расход топлива"),
  q("brick_tunnel.strength", "MPa", "Fired strength", "Прочность после обжига"),
  logical("brick_tunnel.stuck", "Car stuck", "Вагонетка застряла"),
  enu("brick_tunnel.state", ["fire", "idle", "maintain", "fault"], "Kiln state", "Состояние печи"),
]);

write("layer-b-refract_press.json", [
  id("refract_press.id", "Refractory press id", "ID пресса огнеупоров"),
  id("refract_press.sku.id", "Product SKU id", "ID SKU изделия"),
  q("refract_press.force", "kN", "Press force", "Усилие пресса"),
  q("refract_press.density", "g/cm3", "Bulk density", "Кажущаяся плотность"),
  q("refract_press.moisture", "%", "Mix moisture", "Влажность смеси", { range: { min: 0, max: 100 } }),
  q("refract_press.cycle.s", "s", "Cycle time", "Время цикла"),
  logical("refract_press.crack", "Green crack", "Трещина сырца"),
  enu("refract_press.state", ["press", "idle", "tool", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-alumina_calc.json", [
  id("alumina_calc.id", "Alumina calciner id", "ID кальцинатора глинозёма"),
  q("alumina_calc.temp", "Cel", "Calcination temperature", "Температура кальцинации"),
  q("alumina_calc.output", "t/h", "Alumina output", "Выпуск глинозёма"),
  q("alumina_calc.loi", "%", "LOI", "ППП", { range: { min: 0, max: 100 } }),
  q("alumina_calc.fuel", "m3/h", "Fuel rate", "Расход топлива"),
  q("alumina_calc.alpha", "%", "Alpha alumina", "Альфа-глинозём", { range: { min: 0, max: 100 } }),
  logical("alumina_calc.spec.ok", "Spec OK", "Спецификация OK"),
  enu("alumina_calc.state", ["calcine", "idle", "maintain", "fault"], "Calciner state", "Состояние кальцинатора"),
]);

write("layer-b-anode_bake.json", [
  id("anode_bake.id", "Anode baking furnace id", "ID печи обжига анодов"),
  q("anode_bake.temp", "Cel", "Peak temperature", "Пиковая температура"),
  q("anode_bake.cycle.d", "d", "Fire cycle", "Цикл обжига"),
  q("anode_bake.anodes", "-", "Anodes in fire", "Анодов в обжиге", { encodings: ["i32"] }),
  q("anode_bake.fuel", "m3/h", "Fuel rate", "Расход топлива"),
  q("anode_bake.resist", "uOhm.m", "Baked resistivity", "Удельное сопротивление"),
  logical("anode_bake.crack", "Crack risk", "Риск трещин"),
  enu("anode_bake.state", ["fire", "cool", "idle", "fault"], "Furnace state", "Состояние печи"),
]);

write("layer-b-potline_al.json", [
  id("potline_al.id", "Aluminum potline id", "ID серии электролизёров"),
  q("potline_al.current", "kA", "Line current", "Сила тока серии"),
  q("potline_al.voltage", "V", "Average pot voltage", "Среднее напряжение ванны"),
  q("potline_al.ce", "%", "Current efficiency", "Выход по току", { range: { min: 0, max: 100 } }),
  q("potline_al.pots", "-", "Pots online", "Ванн онлайн", { encodings: ["i32"] }),
  q("potline_al.af", "-", "Anode effects today", "Анодных эффектов за сутки", { encodings: ["i32"] }),
  logical("potline_al.ae", "Anode effect active", "Анодный эффект активен"),
  enu("potline_al.state", ["produce", "tap", "idle", "fault"], "Potline state", "Состояние серии"),
]);

write("layer-b-cast_house_al.json", [
  id("cast_house_al.id", "Aluminum casthouse id", "ID литейного отделения алюминия"),
  id("cast_house_al.heat.id", "Heat id", "ID плавки"),
  q("cast_house_al.temp", "Cel", "Metal temperature", "Температура металла"),
  q("cast_house_al.cast", "t/h", "Casting rate", "Скорость разливки"),
  q("cast_house_al.h", "ppm", "Hydrogen", "Водород"),
  q("cast_house_al.scrap", "%", "Scrap in charge", "Лом в шихте", { range: { min: 0, max: 100 } }),
  logical("cast_house_al.ready", "Ready to cast", "Готово к разливке"),
  enu("cast_house_al.product", ["ingot", "billet", "slab", "sow", "other"], "Product", "Продукт"),
]);

write("layer-b-hot_mill_al.json", [
  id("hot_mill_al.id", "Aluminum hot mill id", "ID стана горячей прокатки алюминия"),
  id("hot_mill_al.coil.id", "Coil id", "ID рулона"),
  q("hot_mill_al.exit.thick", "mm", "Exit thickness", "Толщина на выходе"),
  q("hot_mill_al.temp", "Cel", "Exit temperature", "Температура на выходе"),
  q("hot_mill_al.speed", "m/min", "Mill speed", "Скорость стана"),
  q("hot_mill_al.force", "MN", "Rolling force", "Усилие прокатки"),
  logical("hot_mill_al.cobble", "Cobble", "Авария полосы"),
  enu("hot_mill_al.state", ["roll", "idle", "change", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-cold_mill_al.json", [
  id("cold_mill_al.id", "Aluminum cold mill id", "ID стана холодной прокатки алюминия"),
  id("cold_mill_al.coil.id", "Coil id", "ID рулона"),
  q("cold_mill_al.exit.thick", "mm", "Exit thickness", "Толщина на выходе"),
  q("cold_mill_al.reduction", "%", "Reduction", "Обжатие", { range: { min: 0, max: 100 } }),
  q("cold_mill_al.speed", "m/min", "Mill speed", "Скорость стана"),
  q("cold_mill_al.tension", "kN", "Strip tension", "Натяжение полосы"),
  logical("cold_mill_al.break", "Strip break", "Обрыв полосы"),
  enu("cold_mill_al.state", ["roll", "idle", "change", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-foil_roll_al.json", [
  id("foil_roll_al.id", "Aluminum foil mill id", "ID фольгопрокатного стана"),
  id("foil_roll_al.coil.id", "Coil id", "ID рулона"),
  q("foil_roll_al.thick", "um", "Foil thickness", "Толщина фольги"),
  q("foil_roll_al.speed", "m/min", "Mill speed", "Скорость стана"),
  q("foil_roll_al.pinholes", "/m2", "Pinholes", "Точечных отверстий"),
  q("foil_roll_al.oil", "g/m2", "Rolling oil", "Прокатное масло"),
  logical("foil_roll_al.break", "Foil break", "Обрыв фольги"),
  enu("foil_roll_al.state", ["roll", "idle", "change", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-extrusion_al.json", [
  id("extrusion_al.press.id", "Aluminum extrusion press id", "ID пресса экструзии алюминия"),
  id("extrusion_al.die.id", "Die id", "ID матрицы"),
  q("extrusion_al.force", "MN", "Ram force", "Усилие плунжера"),
  q("extrusion_al.speed", "m/min", "Exit speed", "Скорость на выходе"),
  q("extrusion_al.billet.temp", "Cel", "Billet temperature", "Температура слитка"),
  q("extrusion_al.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("extrusion_al.die.wear", "Die wear high", "Высокий износ матрицы"),
  enu("extrusion_al.state", ["extrude", "die_change", "idle", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-anodize_line.json", [
  id("anodize_line.id", "Anodizing line id", "ID линии анодирования"),
  id("anodize_line.lot.id", "Lot id", "ID партии"),
  q("anodize_line.thick", "um", "Anodic thickness", "Толщина анодного слоя"),
  q("anodize_line.current", "A", "Bath current", "Ток ванны"),
  q("anodize_line.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("anodize_line.seal", "%", "Seal quality", "Качество уплотнения", { range: { min: 0, max: 100 } }),
  logical("anodize_line.in_spec", "In spec", "В норме"),
  enu("anodize_line.type", ["sulfuric", "hard", "chromic", "other"], "Type", "Тип"),
]);

write("layer-b-paint_line_al.json", [
  id("paint_line_al.id", "Aluminum coil coating line id", "ID линии окраски алюминиевой полосы"),
  id("paint_line_al.coil.id", "Coil id", "ID рулона"),
  q("paint_line_al.dft", "um", "Dry film thickness", "Толщина сухой плёнки"),
  q("paint_line_al.speed", "m/min", "Line speed", "Скорость линии"),
  q("paint_line_al.cure", "Cel", "Cure temperature", "Температура отверждения"),
  q("paint_line_al.color", "-", "Delta E", "Дельта E"),
  logical("paint_line_al.pass", "Coat pass", "Покрытие принято"),
  enu("paint_line_al.state", ["coat", "cure", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-scrap_melt_al.json", [
  id("scrap_melt_al.furnace.id", "Aluminum scrap furnace id", "ID печи плавки алюминиевого лома"),
  q("scrap_melt_al.temp", "Cel", "Metal temperature", "Температура металла"),
  q("scrap_melt_al.charge", "t/h", "Charge rate", "Скорость загрузки"),
  q("scrap_melt_al.recovery", "%", "Metal recovery", "Извлечение металла", { range: { min: 0, max: 100 } }),
  q("scrap_melt_al.dross", "t/h", "Dross rate", "Выход дросса"),
  q("scrap_melt_al.fuel", "m3/h", "Fuel rate", "Расход топлива"),
  logical("scrap_melt_al.ready", "Tap ready", "Готово к выпуску"),
  enu("scrap_melt_al.state", ["charge", "melt", "tap", "idle", "fault"], "Furnace state", "Состояние печи"),
]);

write("layer-b-cu_smelter.json", [
  id("cu_smelter.id", "Copper smelter id", "ID медеплавильного завода"),
  q("cu_smelter.matte", "t/h", "Matte production", "Выпуск штейна"),
  q("cu_smelter.cu", "%", "Matte Cu grade", "Содержание Cu в штейне", { range: { min: 0, max: 100 } }),
  q("cu_smelter.temp", "Cel", "Furnace temperature", "Температура печи"),
  q("cu_smelter.so2", "ppm", "SO2 in off-gas", "SO2 в отходящих"),
  q("cu_smelter.feed", "t/h", "Concentrate feed", "Подача концентрата"),
  logical("cu_smelter.ace", "Acid plant OK", "Кислотный цех OK"),
  enu("cu_smelter.type", ["flash", "bath", "blast", "other"], "Type", "Тип"),
]);

write("layer-b-cu_convert.json", [
  id("cu_convert.id", "Copper converter id", "ID медного конвертера"),
  q("cu_convert.blow", "Nm3/min", "Air / O2 blow", "Продувка"),
  q("cu_convert.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("cu_convert.cu", "%", "Blister Cu", "Черновая медь Cu", { range: { min: 0, max: 100 } }),
  q("cu_convert.cycle.min", "min", "Cycle time", "Время цикла"),
  q("cu_convert.so2", "%", "SO2 in gas", "SO2 в газе", { range: { min: 0, max: 100 } }),
  logical("cu_convert.ready", "Ready to pour", "Готово к сливу"),
  enu("cu_convert.state", ["charge", "blow", "skim", "pour", "fault"], "Converter state", "Состояние конвертера"),
]);

write("layer-b-cu_electro.json", [
  id("cu_electro.tankhouse.id", "Copper tankhouse id", "ID электролизного цеха меди"),
  q("cu_electro.current", "kA", "Cell current", "Ток ванны"),
  q("cu_electro.ce", "%", "Current efficiency", "Выход по току", { range: { min: 0, max: 100 } }),
  q("cu_electro.cathodes", "t/d", "Cathode production", "Выпуск катодов"),
  q("cu_electro.acid", "g/L", "Electrolyte acid", "Кислота электролита"),
  q("cu_electro.cu", "g/L", "Cu in electrolyte", "Cu в электролите"),
  logical("cu_electro.short", "Cell short", "Короткое замыкание ванны"),
  enu("cu_electro.state", ["plate", "strip", "idle", "fault"], "Tankhouse state", "Состояние цеха"),
]);

write("layer-b-wire_draw_cu.json", [
  id("wire_draw_cu.id", "Copper wire drawing line id", "ID линии волочения меди"),
  q("wire_draw_cu.diameter", "mm", "Exit diameter", "Диаметр на выходе"),
  q("wire_draw_cu.speed", "m/s", "Drawing speed", "Скорость волочения"),
  q("wire_draw_cu.breaks", "-", "Breaks today", "Обрывов за сутки", { encodings: ["i32"] }),
  q("wire_draw_cu.dies", "-", "Dies in train", "Волоков в линии", { encodings: ["i32"] }),
  q("wire_draw_cu.lube.temp", "Cel", "Lubricant temperature", "Температура смазки"),
  logical("wire_draw_cu.break", "Wire break", "Обрыв проволоки"),
  enu("wire_draw_cu.state", ["draw", "anneal", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-rod_mill_cu.json", [
  id("rod_mill_cu.id", "Copper rod mill id", "ID стана медной катанки"),
  q("rod_mill_cu.diameter", "mm", "Rod diameter", "Диаметр катанки"),
  q("rod_mill_cu.speed", "m/s", "Rolling speed", "Скорость прокатки"),
  q("rod_mill_cu.output", "t/h", "Output", "Производительность"),
  q("rod_mill_cu.temp", "Cel", "Finishing temperature", "Температура чистовой"),
  q("rod_mill_cu.oxy", "ppm", "Oxygen in rod", "Кислород в катанке"),
  logical("rod_mill_cu.cobble", "Cobble", "Авария"),
  enu("rod_mill_cu.state", ["roll", "idle", "change", "fault"], "Mill state", "Состояние стана"),
]);

write("layer-b-zn_roaster.json", [
  id("zn_roaster.id", "Zinc roaster id", "ID цинкового обжигового аппарата"),
  q("zn_roaster.temp", "Cel", "Bed temperature", "Температура слоя"),
  q("zn_roaster.feed", "t/h", "Concentrate feed", "Подача концентрата"),
  q("zn_roaster.s", "%", "Sulfur in calcine", "Сера в огарке", { range: { min: 0, max: 100 } }),
  q("zn_roaster.so2", "%", "SO2 in gas", "SO2 в газе", { range: { min: 0, max: 100 } }),
  q("zn_roaster.air", "Nm3/h", "Roasting air", "Воздух обжига"),
  logical("zn_roaster.hotspot", "Hotspot", "Горячая точка"),
  enu("zn_roaster.state", ["roast", "idle", "maintain", "fault"], "Roaster state", "Состояние обжига"),
]);

write("layer-b-zn_leach.json", [
  id("zn_leach.id", "Zinc leach circuit id", "ID контура выщелачивания цинка"),
  q("zn_leach.zn", "g/L", "Zn in solution", "Zn в растворе"),
  q("zn_leach.acid", "g/L", "Free acid", "Свободная кислота"),
  q("zn_leach.temp", "Cel", "Leach temperature", "Температура выщелачивания"),
  q("zn_leach.recovery", "%", "Zn recovery", "Извлечение Zn", { range: { min: 0, max: 100 } }),
  q("zn_leach.fe", "g/L", "Iron in solution", "Железо в растворе"),
  logical("zn_leach.filter.ok", "Filter OK", "Фильтр OK"),
  enu("zn_leach.stage", ["neutral", "acid", "hot_acid", "other"], "Stage", "Стадия"),
]);

write("layer-b-zn_electrowin.json", [
  id("zn_electrowin.id", "Zinc electrowinning cellhouse id", "ID цеха электроэкстракции цинка"),
  q("zn_electrowin.current", "kA", "Cell current", "Ток ванны"),
  q("zn_electrowin.ce", "%", "Current efficiency", "Выход по току", { range: { min: 0, max: 100 } }),
  q("zn_electrowin.cathodes", "t/d", "Cathode production", "Выпуск катодов"),
  q("zn_electrowin.acid", "g/L", "Cell acid", "Кислота в ванне"),
  q("zn_electrowin.temp", "Cel", "Electrolyte temperature", "Температура электролита"),
  logical("zn_electrowin.short", "Cell short", "Короткое замыкание"),
  enu("zn_electrowin.state", ["plate", "strip", "idle", "fault"], "Cellhouse state", "Состояние цеха"),
]);

write("layer-b-pb_blast.json", [
  id("pb_blast.id", "Lead blast furnace id", "ID шахтной печи свинца"),
  q("pb_blast.temp", "Cel", "Tuyere / hearth temperature", "Температура фурмы/горна"),
  q("pb_blast.bullion", "t/d", "Bullion production", "Выпуск чернового свинца"),
  q("pb_blast.coke", "t/d", "Coke rate", "Расход кокса"),
  q("pb_blast.slag.pb", "%", "Pb in slag", "Pb в шлаке", { range: { min: 0, max: 100 } }),
  q("pb_blast.so2", "ppm", "SO2 in gas", "SO2 в газе"),
  logical("pb_blast.freeze", "Hearth freeze risk", "Риск замораживания горна"),
  enu("pb_blast.state", ["blow", "tap", "idle", "fault"], "Furnace state", "Состояние печи"),
]);

write("layer-b-ni_flash.json", [
  id("ni_flash.id", "Nickel flash furnace id", "ID флэш-печи никеля"),
  q("ni_flash.temp", "Cel", "Furnace temperature", "Температура печи"),
  q("ni_flash.matte", "t/h", "Matte production", "Выпуск штейна"),
  q("ni_flash.ni", "%", "Matte Ni grade", "Содержание Ni в штейне", { range: { min: 0, max: 100 } }),
  q("ni_flash.feed", "t/h", "Concentrate feed", "Подача концентрата"),
  q("ni_flash.o2", "Nm3/h", "Oxygen enrichment", "Обогащение кислородом"),
  logical("ni_flash.accrete", "Accretion risk", "Риск наростов"),
  enu("ni_flash.state", ["smelt", "idle", "maintain", "fault"], "Furnace state", "Состояние печи"),
]);

write("layer-b-precious_ref.json", [
  id("precious_ref.id", "Precious metals refinery id", "ID аффинажа драгметаллов"),
  id("precious_ref.lot.id", "Lot id", "ID партии"),
  q("precious_ref.au", "%", "Gold purity", "Чистота золота", { range: { min: 0, max: 100 } }),
  q("precious_ref.ag", "%", "Silver purity", "Чистота серебра", { range: { min: 0, max: 100 } }),
  q("precious_ref.recovery", "%", "Recovery", "Извлечение", { range: { min: 0, max: 100 } }),
  q("precious_ref.cycle.h", "h", "Refine cycle", "Цикл аффинажа"),
  logical("precious_ref.assay.ok", "Assay OK", "Проба OK"),
  enu("precious_ref.process", ["electro", "miller", "wohlwill", "other"], "Process", "Процесс"),
]);

write("layer-b-foundry_cupola.json", [
  id("foundry_cupola.id", "Cupola furnace id", "ID вагранки"),
  q("foundry_cupola.temp", "Cel", "Iron temperature", "Температура чугуна"),
  q("foundry_cupola.melt", "t/h", "Melt rate", "Скорость плавки"),
  q("foundry_cupola.coke", "kg/t", "Coke rate", "Расход кокса"),
  q("foundry_cupola.blast", "m3/h", "Blast air", "Дутьё"),
  q("foundry_cupola.ce", "-", "Carbon equivalent", "Углеродный эквивалент"),
  logical("foundry_cupola.bridge", "Bridging", "Зависание шихты"),
  enu("foundry_cupola.state", ["melt", "tap", "idle", "fault"], "Cupola state", "Состояние вагранки"),
]);

write("layer-b-invest_cast.json", [
  id("invest_cast.line.id", "Investment casting line id", "ID линии точного литья"),
  id("invest_cast.tree.id", "Tree / mold id", "ID ёлки/формы"),
  q("invest_cast.shell.layers", "-", "Shell layers", "Слоёв оболочки", { encodings: ["i32"] }),
  q("invest_cast.pour.temp", "Cel", "Pour temperature", "Температура заливки"),
  q("invest_cast.yield", "%", "Casting yield", "Выход годного", { range: { min: 0, max: 100 } }),
  q("invest_cast.scrap", "%", "Scrap rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("invest_cast.shell.crack", "Shell crack", "Трещина оболочки"),
  enu("invest_cast.state", ["shell", "dewax", "pour", "knockout", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-die_cast_al.json", [
  id("die_cast_al.machine.id", "Aluminum die-cast machine id", "ID машины литья алюминия под давлением"),
  id("die_cast_al.die.id", "Die id", "ID пресс-формы"),
  q("die_cast_al.shot", "-", "Shots today", "Впрысков за сутки", { encodings: ["i32"] }),
  q("die_cast_al.cycle.s", "s", "Cycle time", "Время цикла"),
  q("die_cast_al.temp", "Cel", "Die temperature", "Температура формы"),
  q("die_cast_al.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("die_cast_al.flash", "Flash / short shot", "Облой / недолив"),
  enu("die_cast_al.state", ["cast", "spray", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-sand_mold.json", [
  id("sand_mold.line.id", "Sand molding line id", "ID линии песчаных форм"),
  q("sand_mold.molds", "/h", "Molds per hour", "Форм в час"),
  q("sand_mold.compact", "%", "Mold compactness", "Уплотнение формы", { range: { min: 0, max: 100 } }),
  q("sand_mold.moisture", "%", "Sand moisture", "Влажность песка", { range: { min: 0, max: 100 } }),
  q("sand_mold.strength", "kPa", "Green strength", "Сырая прочность"),
  q("sand_mold.reject", "%", "Mold reject", "Брак форм", { range: { min: 0, max: 100 } }),
  logical("sand_mold.ram.ok", "Ram OK", "Набивка OK"),
  enu("sand_mold.process", ["green", "no_bake", "shell", "other"], "Process", "Процесс"),
]);

write("layer-b-core_shoot.json", [
  id("core_shoot.machine.id", "Core shooter id", "ID пескострельной машины"),
  id("core_shoot.box.id", "Core box id", "ID стержневого ящика"),
  q("core_shoot.cycles", "-", "Shots today", "Выстрелов за сутки", { encodings: ["i32"] }),
  q("core_shoot.cycle.s", "s", "Cycle time", "Время цикла"),
  q("core_shoot.reject", "%", "Core reject", "Брак стержней", { range: { min: 0, max: 100 } }),
  q("core_shoot.gas", "L", "Amine / gas use", "Расход амина/газа"),
  logical("core_shoot.blow", "Incomplete blow", "Неполный выстрел"),
  enu("core_shoot.process", ["cold_box", "hot_box", "shell", "other"], "Process", "Процесс"),
]);

write("layer-b-shakeout.json", [
  id("shakeout.id", "Shakeout machine id", "ID выбивной машины"),
  q("shakeout.rate", "t/h", "Throughput", "Производительность"),
  q("shakeout.vib", "mm/s", "Vibration", "Вибрация"),
  q("shakeout.sand.temp", "Cel", "Sand temperature", "Температура песка"),
  q("shakeout.dust", "mg/m3", "Dust level", "Пыль"),
  q("shakeout.castings", "/h", "Castings per hour", "Отливок в час"),
  logical("shakeout.jam", "Jam", "Затор"),
  enu("shakeout.state", ["shake", "idle", "maintain", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-shot_blast.json", [
  id("shot_blast.id", "Shot blast machine id", "ID дробемётной машины"),
  q("shot_blast.throughput", "t/h", "Throughput", "Производительность"),
  q("shot_blast.wheel", "rpm", "Wheel speed", "Обороты турбины"),
  q("shot_blast.media", "%", "Media level", "Уровень дроби", { range: { min: 0, max: 100 } }),
  q("shot_blast.coverage", "%", "Coverage", "Покрытие", { range: { min: 0, max: 100 } }),
  q("shot_blast.dust", "mg/m3", "Dust", "Пыль"),
  logical("shot_blast.media.low", "Media low", "Мало дроби"),
  enu("shot_blast.state", ["blast", "idle", "maintain", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-heat_treat_met.json", [
  id("heat_treat_met.furnace.id", "Metal heat-treat furnace id", "ID печи термообработки металла"),
  id("heat_treat_met.lot.id", "Lot id", "ID партии"),
  q("heat_treat_met.temp", "Cel", "Furnace temperature", "Температура печи"),
  q("heat_treat_met.soak.min", "min", "Soak time", "Время выдержки"),
  q("heat_treat_met.atmosphere", "%", "Atmosphere control", "Контроль атмосферы", { range: { min: 0, max: 100 } }),
  q("heat_treat_met.hardness", "HV", "Hardness result", "Твёрдость"),
  logical("heat_treat_met.recipe.ok", "Recipe complete", "Режим завершён"),
  enu("heat_treat_met.process", ["harden", "temper", "anneal", "normalize", "other"], "Process", "Процесс"),
]);

write("layer-b-quench_tank.json", [
  id("quench_tank.id", "Quench tank id", "ID закалочного бака"),
  q("quench_tank.temp", "Cel", "Quenchant temperature", "Температура закалочной среды"),
  q("quench_tank.agitation", "%", "Agitation", "Перемешивание", { range: { min: 0, max: 100 } }),
  q("quench_tank.level", "%", "Tank level", "Уровень бака", { range: { min: 0, max: 100 } }),
  q("quench_tank.cooling", "kW", "Cooling power", "Мощность охлаждения"),
  q("quench_tank.cycles", "-", "Quench cycles today", "Закалок за сутки", { encodings: ["i32"] }),
  logical("quench_tank.hot", "Quenchant too hot", "Среда перегрета"),
  enu("quench_tank.media", ["oil", "polymer", "water", "salt", "other"], "Media", "Среда"),
]);

write("layer-b-induction_melt.json", [
  id("induction_melt.id", "Induction melting furnace id", "ID индукционной плавильной печи"),
  id("induction_melt.heat.id", "Heat id", "ID плавки"),
  q("induction_melt.power", "kW", "Coil power", "Мощность индуктора"),
  q("induction_melt.temp", "Cel", "Metal temperature", "Температура металла"),
  q("induction_melt.charge", "t", "Charge weight", "Масса шихты"),
  q("induction_melt.freq", "Hz", "Frequency", "Частота"),
  logical("induction_melt.ready", "Tap ready", "Готово к выпуску"),
  enu("induction_melt.state", ["charge", "melt", "tap", "idle", "fault"], "Furnace state", "Состояние печи"),
]);

write("layer-b-vacuum_melt.json", [
  id("vacuum_melt.id", "Vacuum induction melt id", "ID вакуумно-индукционной плавки"),
  id("vacuum_melt.heat.id", "Heat id", "ID плавки"),
  q("vacuum_melt.vacuum", "Pa", "Chamber vacuum", "Вакуум камеры"),
  q("vacuum_melt.temp", "Cel", "Metal temperature", "Температура металла"),
  q("vacuum_melt.power", "kW", "Power", "Мощность"),
  q("vacuum_melt.o", "ppm", "Oxygen", "Кислород"),
  logical("vacuum_melt.leak", "Vacuum leak", "Натекание"),
  enu("vacuum_melt.state", ["evacuate", "melt", "cast", "idle", "fault"], "Furnace state", "Состояние печи"),
]);

write("layer-b-powder_atom.json", [
  id("powder_atom.id", "Metal powder atomizer id", "ID атомизатора металлического порошка"),
  q("powder_atom.gas", "Nm3/h", "Atomizing gas", "Газ атомизации"),
  q("powder_atom.d50", "um", "Median particle size", "Медианный размер частиц"),
  q("powder_atom.yield", "%", "Yield in size band", "Выход в фракции", { range: { min: 0, max: 100 } }),
  q("powder_atom.o", "ppm", "Oxygen in powder", "Кислород в порошке"),
  q("powder_atom.rate", "kg/h", "Powder rate", "Скорость получения порошка"),
  logical("powder_atom.nozzle.ok", "Nozzle OK", "Сопло OK"),
  enu("powder_atom.gas_type", ["ar", "n2", "air", "water", "other"], "Atomizing medium", "Среда атомизации"),
]);

write("layer-b-hip_press.json", [
  id("hip_press.id", "HIP press id", "ID установки ГИП"),
  id("hip_press.batch.id", "Batch id", "ID партии"),
  q("hip_press.pressure", "MPa", "HIP pressure", "Давление ГИП"),
  q("hip_press.temp", "Cel", "HIP temperature", "Температура ГИП"),
  q("hip_press.hold.h", "h", "Hold time", "Время выдержки"),
  q("hip_press.density", "%", "Relative density", "Относительная плотность", { range: { min: 0, max: 100 } }),
  logical("hip_press.cycle.done", "Cycle complete", "Цикл завершён"),
  enu("hip_press.state", ["heat", "press", "cool", "idle", "fault"], "Press state", "Состояние установки"),
]);

write("layer-b-am_metal_print.json", [
  id("am_metal_print.id", "Metal AM printer id", "ID металлического 3D-принтера"),
  id("am_metal_print.job.id", "Build job id", "ID задания построения"),
  q("am_metal_print.layer", "um", "Layer thickness", "Толщина слоя"),
  q("am_metal_print.power", "W", "Laser / beam power", "Мощность лазера/пучка"),
  q("am_metal_print.progress", "%", "Build progress", "Прогресс построения", { range: { min: 0, max: 100 } }),
  q("am_metal_print.o2", "ppm", "Chamber O2", "O2 в камере"),
  logical("am_metal_print.recoater", "Recoater fault", "Отказ рекоутера"),
  enu("am_metal_print.process", ["lpbf", "ebmelt", "ded", "binder", "other"], "Process", "Процесс"),
]);

console.log("Layer B27 seeds written");
