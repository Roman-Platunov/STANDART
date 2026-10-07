#!/usr/bin/env node
/**
 * Layer B15 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B15", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-zinc_smelter.json", [
  id("zinc_smelter.id", "Zinc smelter id", "ID цинкового завода"),
  q("zinc_smelter.roaster.temp", "Cel", "Roaster temperature", "Температура обжига"),
  q("zinc_smelter.leach.zn", "g/L", "Pregnant Zn", "Цинк в ПР"),
  q("zinc_smelter.cell.current", "A", "Cell current", "Ток электролизёра"),
  q("zinc_smelter.cathode.mass", "t/d", "Cathode zinc", "Выпуск катодного цинка"),
  q("zinc_smelter.so2", "ppm", "Roaster SO2", "SO2 обжига"),
  logical("zinc_smelter.short", "Cell short", "Короткое замыкание ванны"),
  enu("zinc_smelter.state", ["roast", "leach", "electrowin", "cast", "idle", "fault"], "Smelter state", "Состояние завода"),
]);

write("layer-b-ferroalloy.json", [
  id("ferroalloy.furnace.id", "Ferroalloy furnace id", "ID печи ферросплавов"),
  q("ferroalloy.power", "W", "Furnace power", "Мощность печи"),
  q("ferroalloy.tap.temp", "Cel", "Tap temperature", "Температура выпуска"),
  q("ferroalloy.si", "%", "Si in alloy", "Кремний в сплаве", { range: { min: 0, max: 100 } }),
  q("ferroalloy.coke.rate", "kg/t", "Reductant rate", "Расход восстановителя"),
  q("ferroalloy.production", "t/d", "Alloy production", "Выпуск сплава"),
  logical("ferroalloy.hang", "Burden hang", "Зависание шихты"),
  enu("ferroalloy.product", ["fesil", "femh", "fecr", "sica", "other"], "Product", "Продукт"),
]);

write("layer-b-silicon_metal.json", [
  id("silicon_metal.furnace.id", "Silicon furnace id", "ID печи кремния"),
  q("silicon_metal.power", "W", "Furnace power", "Мощность печи"),
  q("silicon_metal.si", "%", "Silicon grade", "Содержание кремния", { range: { min: 0, max: 100 } }),
  q("silicon_metal.quartz.feed", "t/h", "Quartz feed", "Подача кварца"),
  q("silicon_metal.electrode.pos", "mm", "Electrode position", "Положение электрода"),
  q("silicon_metal.offgas.co", "%", "Offgas CO", "CO отходящих газов", { range: { min: 0, max: 100 } }),
  logical("silicon_metal.tap.ready", "Tap ready", "Готовность к выпуску"),
  enu("silicon_metal.grade", ["mg", "cg", "eg", "other"], "Grade", "Марка"),
]);

write("layer-b-carbon_black.json", [
  id("carbon_black.reactor.id", "Carbon black reactor id", "ID реактора техуглерода"),
  q("carbon_black.oil.rate", "kg/h", "Feedstock oil", "Расход сырья"),
  q("carbon_black.air.rate", "m3/h", "Process air", "Расход воздуха"),
  q("carbon_black.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("carbon_black.iodine", "g/kg", "Iodine number", "Йодное число"),
  q("carbon_black.yield", "t/h", "Black production", "Выпуск техуглерода"),
  logical("carbon_black.filter.ok", "Bag filter OK", "Фильтр в норме"),
  enu("carbon_black.grade", ["n220", "n330", "n550", "n660", "other"], "Grade", "Марка"),
]);

write("layer-b-titanium_sponge.json", [
  id("titanium_sponge.retort.id", "Kroll retort id", "ID реторты Кролла"),
  q("titanium_sponge.mg.temp", "Cel", "Magnesium temperature", "Температура магния"),
  q("titanium_sponge.ticl4.feed", "kg/h", "TiCl4 feed", "Подача TiCl4"),
  q("titanium_sponge.vacuum", "Pa", "Retort vacuum", "Вакуум реторты"),
  q("titanium_sponge.cycle.h", "h", "Reduction cycle", "Цикл восстановления"),
  q("titanium_sponge.yield", "t", "Sponge mass", "Масса губки"),
  logical("titanium_sponge.leak", "Retort leak", "Натекание реторты"),
  enu("titanium_sponge.state", ["charge", "reduce", "distill", "cool", "dump", "fault"], "Retort state", "Состояние реторты"),
]);

write("layer-b-rare_earth.json", [
  id("rare_earth.circuit.id", "RE circuit id", "ID цепи РЗЭ"),
  q("rare_earth.feed.treo", "%", "Feed TREO", "TREO в питании", { range: { min: 0, max: 100 } }),
  q("rare_earth.sx.stages", "-", "SX stages online", "Ступеней экстракции", { encodings: ["i32"] }),
  q("rare_earth.nd", "mg/L", "Nd in raffinate", "Nd в рафинате"),
  q("rare_earth.ph", "-", "Circuit pH", "pH цепи"),
  q("rare_earth.recovery", "%", "RE recovery", "Извлечение РЗЭ", { range: { min: 0, max: 100 } }),
  logical("rare_earth.crud", "Crud layer", "Промежуточный слой"),
  enu("rare_earth.process", ["roast", "leach", "sx", "precip", "calcine", "other"], "Process", "Процесс"),
]);

write("layer-b-uranium_mill.json", [
  id("uranium_mill.id", "Uranium mill id", "ID уранового завода"),
  q("uranium_mill.feed.u", "ppm", "Feed U3O8 equivalent", "U в питании"),
  q("uranium_mill.recovery", "%", "U recovery", "Извлечение урана", { range: { min: 0, max: 100 } }),
  q("uranium_mill.leach.ph", "-", "Leach pH", "pH выщелачивания"),
  q("uranium_mill.yellowcake", "t/d", "Yellowcake production", "Выпуск закиси-окиси"),
  q("uranium_mill.radon", "Bq/m3", "Workplace radon", "Радон на рабочем месте"),
  logical("uranium_mill.containment", "Containment OK", "Герметичность OK"),
  enu("uranium_mill.process", ["acid", "alkaline", "isl", "ix", "sx", "other"], "Process", "Процесс"),
]);

write("layer-b-soda_ash.json", [
  id("soda_ash.plant.id", "Soda ash plant id", "ID содового завода"),
  q("soda_ash.ammonia", "%", "Ammoniation", "Аммонизация", { range: { min: 0, max: 100 } }),
  q("soda_ash.calciner.temp", "Cel", "Calciner temperature", "Температура кальцинатора"),
  q("soda_ash.nacl", "g/L", "Brine NaCl", "NaCl в рассоле"),
  q("soda_ash.production", "t/d", "Soda ash production", "Выпуск соды"),
  q("soda_ash.co2", "m3/h", "CO2 recycle", "Рециркуляция CO2"),
  logical("soda_ash.tower.ok", "Carbonating tower OK", "Колонна карбонизации OK"),
  enu("soda_ash.process", ["solvay", "trona", "hou", "other"], "Process", "Процесс"),
]);

write("layer-b-chlor_alkali.json", [
  id("chlor_alkali.cell.id", "Chlor-alkali cell id", "ID электролизёра хлора"),
  q("chlor_alkali.current", "A", "Cell current", "Ток ванны"),
  q("chlor_alkali.voltage", "V", "Cell voltage", "Напряжение ванны"),
  q("chlor_alkali.naoh", "%", "Caustic strength", "Концентрация щёлочи", { range: { min: 0, max: 100 } }),
  q("chlor_alkali.cl2", "t/d", "Chlorine production", "Выпуск хлора"),
  q("chlor_alkali.h2", "m3/h", "Hydrogen production", "Выпуск водорода"),
  logical("chlor_alkali.membrane.ok", "Membrane OK", "Мембрана OK"),
  enu("chlor_alkali.tech", ["membrane", "mercury", "diaphragm", "other"], "Technology", "Технология"),
]);

write("layer-b-sulfuric_acid.json", [
  id("sulfuric_acid.plant.id", "Sulfuric acid plant id", "ID сернокислотного завода"),
  q("sulfuric_acid.so2", "%", "Converter SO2", "SO2 на конвертере", { range: { min: 0, max: 100 } }),
  q("sulfuric_acid.bed.temp", "Cel", "Catalyst bed temperature", "Температура слоя катализатора"),
  q("sulfuric_acid.conversion", "%", "SO2 conversion", "Конверсия SO2", { range: { min: 0, max: 100 } }),
  q("sulfuric_acid.prod", "t/d", "Acid production", "Выпуск кислоты"),
  q("sulfuric_acid.strength", "%", "Acid strength", "Концентрация кислоты", { range: { min: 0, max: 100 } }),
  logical("sulfuric_acid.mist", "Acid mist high", "Туман кислоты"),
  enu("sulfuric_acid.contact", ["single", "dcda", "wet", "other"], "Contact process", "Контактный процесс"),
]);

write("layer-b-methanol_plant.json", [
  id("methanol_plant.id", "Methanol plant id", "ID метанольного завода"),
  q("methanol_plant.syngas.h2co", "-", "H2/CO ratio", "Соотношение H2/CO"),
  q("methanol_plant.reactor.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("methanol_plant.reactor.p", "kPa", "Reactor pressure", "Давление реактора"),
  q("methanol_plant.prod", "t/d", "Methanol production", "Выпуск метанола"),
  q("methanol_plant.purity", "%", "Product purity", "Чистота продукта", { range: { min: 0, max: 100 } }),
  logical("methanol_plant.trip", "Plant trip", "Аварийный останов"),
  enu("methanol_plant.state", ["start", "run", "turndown", "stop", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-urea_plant.json", [
  id("urea_plant.id", "Urea plant id", "ID карбамидного завода"),
  q("urea_plant.reactor.p", "kPa", "Reactor pressure", "Давление реактора"),
  q("urea_plant.reactor.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("urea_plant.nh3.co2", "-", "NH3/CO2 ratio", "Соотношение NH3/CO2"),
  q("urea_plant.prod", "t/d", "Urea production", "Выпуск карбамида"),
  q("urea_plant.biuret", "%", "Biuret", "Биурет", { range: { min: 0, max: 100 } }),
  logical("urea_plant.stripper.ok", "Stripper OK", "Стриппер OK"),
  enu("urea_plant.process", ["stamicarbon", "snam", "tec", "other"], "Process", "Процесс"),
]);

write("layer-b-pe_plant.json", [
  id("pe_plant.reactor.id", "PE reactor id", "ID реактора ПЭ"),
  id("pe_plant.grade.id", "PE grade id", "ID марки ПЭ"),
  q("pe_plant.reactor.p", "kPa", "Reactor pressure", "Давление реактора"),
  q("pe_plant.mi", "g/10min", "Melt index", "Показатель текучести"),
  q("pe_plant.density", "g/cm3", "Resin density", "Плотность смолы"),
  q("pe_plant.prod", "t/h", "PE production", "Выпуск ПЭ"),
  logical("pe_plant.fouling", "Reactor fouling", "Загрязнение реактора"),
  enu("pe_plant.process", ["ldpe", "hdpe_slurry", "hdpe_gas", "lldpe", "other"], "Process", "Процесс"),
]);

write("layer-b-pvc_plant.json", [
  id("pvc_plant.reactor.id", "PVC reactor id", "ID реактора ПВХ"),
  q("pvc_plant.vc.conv", "%", "VCM conversion", "Конверсия ВХ", { range: { min: 0, max: 100 } }),
  q("pvc_plant.reactor.temp", "Cel", "Polymerization temperature", "Температура полимеризации"),
  q("pvc_plant.kvalue", "-", "K-value", "Значение K"),
  q("pvc_plant.residual.vc", "ppm", "Residual VCM", "Остаточный ВХ"),
  q("pvc_plant.prod", "t/d", "PVC production", "Выпуск ПВХ"),
  logical("pvc_plant.inhibitor", "Inhibitor injected", "Ингибитор подан"),
  enu("pvc_plant.process", ["suspension", "emulsion", "bulk", "other"], "Process", "Процесс"),
]);

write("layer-b-carbon_fiber.json", [
  id("carbon_fiber.line.id", "Carbon fiber line id", "ID линии углеволокна"),
  q("carbon_fiber.tow", "-", "Tow count", "Число филаментов", { encodings: ["i32"] }),
  q("carbon_fiber.ox.temp", "Cel", "Oxidation temperature", "Температура окисления"),
  q("carbon_fiber.carbonize.temp", "Cel", "Carbonization temperature", "Температура карбонизации"),
  q("carbon_fiber.modulus", "GPa", "Tensile modulus", "Модуль упругости"),
  q("carbon_fiber.speed", "m/min", "Line speed", "Скорость линии"),
  logical("carbon_fiber.break", "Tow break", "Обрыв жгута"),
  enu("carbon_fiber.precursor", ["pan", "pitch", "rayon", "other"], "Precursor", "Прекурсор"),
]);

write("layer-b-optical_fiber.json", [
  id("optical_fiber.draw.id", "Fiber draw tower id", "ID вытяжной башни"),
  q("optical_fiber.preform.d", "mm", "Preform diameter", "Диаметр преформы"),
  q("optical_fiber.draw.speed", "m/min", "Draw speed", "Скорость вытяжки"),
  q("optical_fiber.diameter", "um", "Fiber diameter", "Диаметр волокна"),
  q("optical_fiber.tension", "N", "Draw tension", "Натяжение вытяжки"),
  q("optical_fiber.proof", "GPa", "Proof test", "Прочность на разрыв"),
  logical("optical_fiber.break", "Fiber break", "Обрыв волокна"),
  enu("optical_fiber.type", ["smf", "mmf", "pm", "other"], "Fiber type", "Тип волокна"),
]);

write("layer-b-polysilicon.json", [
  id("polysilicon.reactor.id", "Siemens reactor id", "ID реактора Сименса"),
  q("polysilicon.tcs.flow", "kg/h", "TCS flow", "Расход ТХС"),
  q("polysilicon.rod.temp", "Cel", "Rod temperature", "Температура стержня"),
  q("polysilicon.power", "W", "Reactor power", "Мощность реактора"),
  q("polysilicon.purity", "-", "Resistivity", "Удельное сопротивление"),
  q("polysilicon.prod", "t/d", "Poly production", "Выпуск поликремния"),
  logical("polysilicon.rod.contact", "Rod contact", "Замыкание стержней"),
  enu("polysilicon.process", ["siemens", "fbr", "umg", "other"], "Process", "Процесс"),
]);

write("layer-b-cz_ingot.json", [
  id("cz_ingot.puller.id", "CZ puller id", "ID установки Чохральского"),
  id("cz_ingot.ingot.id", "Ingot id", "ID слитка"),
  q("cz_ingot.melt.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("cz_ingot.pull.speed", "mm/min", "Pull speed", "Скорость вытягивания"),
  q("cz_ingot.rotation", "rpm", "Crystal rotation", "Вращение кристалла"),
  q("cz_ingot.diameter", "mm", "Crystal diameter", "Диаметр кристалла"),
  logical("cz_ingot.dislocation", "Dislocation", "Дислокация"),
  enu("cz_ingot.dopant", ["b", "p", "ga", "as", "none", "other"], "Dopant", "Легирование"),
]);

write("layer-b-solar_cell.json", [
  id("solar_cell.line.id", "Cell line id", "ID линии солнечных элементов"),
  q("solar_cell.eff", "%", "Cell efficiency", "КПД элемента", { range: { min: 0, max: 100 } }),
  q("solar_cell.voc", "V", "Open-circuit voltage", "Напряжение холостого хода"),
  q("solar_cell.isc", "A", "Short-circuit current", "Ток короткого замыкания"),
  q("solar_cell.ff", "%", "Fill factor", "Коэффициент заполнения", { range: { min: 0, max: 100 } }),
  q("solar_cell.bin", "-", "Power bin", "Бин мощности", { encodings: ["i32"] }),
  logical("solar_cell.el.ok", "EL pass", "EL пройден"),
  enu("solar_cell.arch", ["perc", "topcon", "hjt", "ibc", "other"], "Architecture", "Архитектура"),
]);

write("layer-b-pv_module.json", [
  id("pv_module.line.id", "Module line id", "ID линии модулей"),
  id("pv_module.sku.id", "Module SKU id", "ID SKU модуля"),
  q("pv_module.laminate.temp", "Cel", "Laminator temperature", "Температура ламинатора"),
  q("pv_module.power", "W", "Flash power", "Мощность вспышки"),
  q("pv_module.el.defects", "-", "EL defect count", "Дефектов EL", { encodings: ["i32"] }),
  q("pv_module.throughput", "/h", "Modules per hour", "Модулей в час"),
  logical("pv_module.hi_pot.ok", "Hi-pot pass", "Hi-pot пройден"),
  enu("pv_module.type", ["glass_back", "glass_glass", "flex", "other"], "Module type", "Тип модуля"),
]);

write("layer-b-wind_blade.json", [
  id("wind_blade.mold.id", "Blade mold id", "ID формы лопасти"),
  id("wind_blade.serial", "Blade serial", "Серийный номер лопасти"),
  q("wind_blade.infusion.p", "Pa", "Infusion vacuum", "Вакуум инфузии"),
  q("wind_blade.resin.temp", "Cel", "Resin temperature", "Температура смолы"),
  q("wind_blade.cure.temp", "Cel", "Cure temperature", "Температура отверждения"),
  q("wind_blade.length", "m", "Blade length", "Длина лопасти"),
  logical("wind_blade.dry.spot", "Dry spot", "Сухое пятно"),
  enu("wind_blade.state", ["layup", "infuse", "cure", "demold", "finish", "fault"], "Mold state", "Состояние формы"),
]);

write("layer-b-motor_mfg.json", [
  id("motor_mfg.line.id", "Motor line id", "ID линии электродвигателей"),
  id("motor_mfg.serial", "Motor serial", "Серийный номер двигателя"),
  q("motor_mfg.winding.r", "Ohm", "Winding resistance", "Сопротивление обмотки"),
  q("motor_mfg.imbalance", "g.mm", "Rotor imbalance", "Дисбаланс ротора"),
  q("motor_mfg.nvh", "dB", "NVH level", "Уровень NVH"),
  q("motor_mfg.hipot", "V", "Hi-pot voltage", "Напряжение hi-pot"),
  logical("motor_mfg.pass", "EOL pass", "EOL пройден"),
  enu("motor_mfg.type", ["im", "pmsm", "synrm", "dc", "other"], "Motor type", "Тип двигателя"),
]);

write("layer-b-transformer_mfg.json", [
  id("transformer_mfg.unit.serial", "Transformer serial", "Серийный номер трансформатора"),
  q("transformer_mfg.turns.ratio", "-", "Turns ratio", "Коэффициент трансформации"),
  q("transformer_mfg.no_load", "W", "No-load loss", "Холостой ход"),
  q("transformer_mfg.pd", "pC", "Partial discharge", "Частичные разряды"),
  q("transformer_mfg.oil.bdv", "kV", "Oil BDV", "Пробивное напряжение масла"),
  q("transformer_mfg.winding.temp", "Cel", "Winding temperature", "Температура обмотки"),
  logical("transformer_mfg.impulse.ok", "Impulse pass", "Импульс пройден"),
  enu("transformer_mfg.type", ["power", "distribution", "cast", "dry", "other"], "Type", "Тип"),
]);

write("layer-b-cable_mfg.json", [
  id("cable_mfg.line.id", "Cable line id", "ID кабельной линии"),
  id("cable_mfg.reel.id", "Reel id", "ID барабана"),
  q("cable_mfg.extrude.temp", "Cel", "Extruder temperature", "Температура экструдера"),
  q("cable_mfg.diameter", "mm", "Cable diameter", "Диаметр кабеля"),
  q("cable_mfg.spark", "kV", "Spark tester", "Искровой тестер"),
  q("cable_mfg.line.speed", "m/min", "Line speed", "Скорость линии"),
  logical("cable_mfg.spark.hit", "Spark hit", "Пробой на искре"),
  enu("cable_mfg.product", ["lv", "mv", "hv", "fo", "other"], "Product", "Продукция"),
]);

write("layer-b-reflow_oven.json", [
  id("reflow_oven.id", "Reflow oven id", "ID печи оплавления"),
  id("reflow_oven.recipe.id", "Reflow recipe id", "ID рецепта оплавления"),
  q("reflow_oven.peak.temp", "Cel", "Peak temperature", "Пиковая температура"),
  q("reflow_oven.tal", "s", "Time above liquidus", "Время выше ликвидуса"),
  q("reflow_oven.o2", "ppm", "Oven oxygen", "Кислород в печи"),
  q("reflow_oven.belt", "m/min", "Belt speed", "Скорость конвейера"),
  logical("reflow_oven.profile.ok", "Profile in spec", "Профиль в норме"),
  enu("reflow_oven.atm", ["air", "n2", "vacuum", "other"], "Atmosphere", "Атмосфера"),
]);

write("layer-b-aoi_inspect.json", [
  id("aoi_inspect.id", "AOI machine id", "ID машины АОИ"),
  id("aoi_inspect.board.id", "Board id", "ID платы"),
  q("aoi_inspect.defects", "-", "Defect count", "Число дефектов", { encodings: ["i32"] }),
  q("aoi_inspect.false.call", "%", "False call rate", "Ложные срабатывания", { range: { min: 0, max: 100 } }),
  q("aoi_inspect.cycle.s", "s", "Cycle time", "Время цикла"),
  q("aoi_inspect.coverage", "%", "Inspection coverage", "Покрытие контроля", { range: { min: 0, max: 100 } }),
  logical("aoi_inspect.fail", "Board fail", "Плата не прошла"),
  enu("aoi_inspect.stage", ["pre_reflow", "post_reflow", "spi", "axi", "other"], "Stage", "Этап"),
]);

write("layer-b-burn_in.json", [
  id("burn_in.chamber.id", "Burn-in chamber id", "ID камеры отжига"),
  id("burn_in.lot.id", "Burn-in lot id", "ID партии отжига"),
  q("burn_in.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("burn_in.bias", "V", "Bias voltage", "Напряжение смещения"),
  q("burn_in.duration.h", "h", "Burn-in duration", "Длительность отжига"),
  q("burn_in.fail", "%", "Fail rate", "Доля отказов", { range: { min: 0, max: 100 } }),
  logical("burn_in.dut.fail", "DUT failed", "Отказ ИС"),
  enu("burn_in.state", ["load", "soak", "test", "unload", "fault"], "Chamber state", "Состояние камеры"),
]);

write("layer-b-cell_formation.json", [
  id("cell_formation.channel.id", "Formation channel id", "ID канала формирования"),
  id("cell_formation.cell.id", "Cell id", "ID ячейки"),
  q("cell_formation.current", "A", "Formation current", "Ток формирования"),
  q("cell_formation.voltage", "V", "Cell voltage", "Напряжение ячейки"),
  q("cell_formation.capacity", "A.h", "Formed capacity", "Сформированная ёмкость"),
  q("cell_formation.temp", "Cel", "Cell temperature", "Температура ячейки"),
  logical("cell_formation.vent", "Vent event", "Срабатывание клапана"),
  enu("cell_formation.step", ["rest", "charge", "discharge", "age", "grade", "fault"], "Step", "Шаг"),
]);

write("layer-b-electrode_coat.json", [
  id("electrode_coat.line.id", "Coating line id", "ID линии намазки"),
  q("electrode_coat.gap", "um", "Coating gap", "Зазор намазки"),
  q("electrode_coat.speed", "m/min", "Web speed", "Скорость полотна"),
  q("electrode_coat.loading", "g/m2", "Areal loading", "Нагрузка на площадь"),
  q("electrode_coat.dryer.temp", "Cel", "Dryer temperature", "Температура сушилки"),
  q("electrode_coat.moisture", "ppm", "Residual moisture", "Остаточная влага"),
  logical("electrode_coat.streak", "Streak defect", "Полоса"),
  enu("electrode_coat.side", ["anode", "cathode", "other"], "Electrode", "Электрод"),
]);

write("layer-b-dry_room.json", [
  id("dry_room.id", "Dry room id", "ID сухого помещения"),
  q("dry_room.dp", "Cel", "Dewpoint", "Точка росы"),
  q("dry_room.temp", "Cel", "Room temperature", "Температура помещения"),
  q("dry_room.rh", "%", "Relative humidity", "Относительная влажность", { range: { min: 0, max: 100 } }),
  q("dry_room.ach", "/h", "Air changes", "Кратность воздухообмена"),
  q("dry_room.particles", "/L", "Particle count", "Счёт частиц"),
  logical("dry_room.in_spec", "Humidity in spec", "Влажность в норме"),
  enu("dry_room.state", ["ok", "excursion", "purge", "offline", "fault"], "Room state", "Состояние помещения"),
]);

write("layer-b-electrolyte_fill.json", [
  id("electrolyte_fill.station.id", "Fill station id", "ID станции заливки"),
  id("electrolyte_fill.cell.id", "Filled cell id", "ID заливаемой ячейки"),
  q("electrolyte_fill.mass", "g", "Fill mass", "Масса электролита"),
  q("electrolyte_fill.vacuum", "Pa", "Fill vacuum", "Вакуум заливки"),
  q("electrolyte_fill.soak.s", "s", "Soak time", "Время пропитки"),
  q("electrolyte_fill.moisture", "ppm", "Electrolyte moisture", "Влага электролита"),
  logical("electrolyte_fill.leak", "Fill leak", "Утечка при заливке"),
  enu("electrolyte_fill.state", ["evac", "fill", "soak", "seal", "idle", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-metro_ops.json", [
  id("metro_ops.train.id", "Metro train id", "ID состава метро"),
  id("metro_ops.line.id", "Metro line id", "ID линии метро"),
  q("metro_ops.speed", "m/s", "Train speed", "Скорость состава"),
  q("metro_ops.headway.s", "s", "Headway", "Интервал"),
  q("metro_ops.pax", "-", "Passengers onboard", "Пассажиров в составе", { encodings: ["i32"] }),
  q("metro_ops.aux.power", "W", "Auxiliary power", "Собственные нужды"),
  logical("metro_ops.ato", "ATO engaged", "АТО включён"),
  enu("metro_ops.mode", ["ato", "atp", "manual", "yard", "fault"], "Drive mode", "Режим ведения"),
]);

write("layer-b-trolleybus.json", [
  id("trolleybus.id", "Trolleybus id", "ID троллейбуса"),
  q("trolleybus.speed", "m/s", "Speed", "Скорость"),
  q("trolleybus.line.v", "V", "Overhead voltage", "Напряжение контактной сети"),
  q("trolleybus.aux.soc", "%", "Onboard battery SOC", "SOC бортовой батареи", { range: { min: 0, max: 100 } }),
  q("trolleybus.pax", "-", "Passengers", "Пассажиры", { encodings: ["i32"] }),
  q("trolleybus.power", "W", "Traction power", "Тяговая мощность"),
  logical("trolleybus.dewire", "Dewired", "Сход штанг"),
  enu("trolleybus.mode", ["wire", "battery", "depot", "fault"], "Power mode", "Режим питания"),
]);

write("layer-b-barge_ops.json", [
  id("barge_ops.id", "Barge id", "ID баржи"),
  id("barge_ops.tow.id", "Tow id", "ID состава барж"),
  q("barge_ops.draft", "m", "Draft", "Осадка"),
  q("barge_ops.cargo", "t", "Cargo mass", "Масса груза"),
  q("barge_ops.freeboard", "m", "Freeboard", "Надводный борт"),
  q("barge_ops.list", "deg", "List", "Крен"),
  logical("barge_ops.grounded", "Aground", "На мели"),
  enu("barge_ops.cargo_type", ["dry", "liquid", "container", "project", "empty"], "Cargo type", "Тип груза"),
]);

write("layer-b-tugboat.json", [
  id("tugboat.id", "Tugboat id", "ID буксира"),
  q("tugboat.bollard", "kN", "Bollard pull", "Тяга на гаке"),
  q("tugboat.engine.power", "W", "Engine power", "Мощность двигателя"),
  q("tugboat.winch.tension", "kN", "Winch tension", "Натяжение лебёдки"),
  q("tugboat.speed", "m/s", "Speed", "Скорость"),
  q("tugboat.heading", "deg", "Heading", "Курс"),
  logical("tugboat.assist", "Assist engaged", "Работает на сопровождении"),
  enu("tugboat.duty", ["escort", "harbor", "ocean", "ice", "idle"], "Duty", "Назначение"),
]);

write("layer-b-chairlift.json", [
  id("chairlift.id", "Chairlift id", "ID кресельной канатной дороги"),
  q("chairlift.speed", "m/s", "Rope speed", "Скорость каната"),
  q("chairlift.load", "%", "Load", "Загрузка", { range: { min: 0, max: 100 } }),
  q("chairlift.wind", "m/s", "Tower wind", "Ветер на опоре"),
  q("chairlift.tension", "kN", "Rope tension", "Натяжение каната"),
  q("chairlift.chairs", "-", "Chairs on line", "Кресел на линии", { encodings: ["i32"] }),
  logical("chairlift.evac", "Evacuation", "Эвакуация"),
  enu("chairlift.state", ["open", "hold", "evac", "night", "fault"], "Lift state", "Состояние дороги"),
]);

write("layer-b-flour_mill.json", [
  id("flour_mill.id", "Flour mill id", "ID мельницы"),
  q("flour_mill.wheat.moist", "%", "Wheat moisture", "Влажность зерна", { range: { min: 0, max: 100 } }),
  q("flour_mill.extraction", "%", "Extraction rate", "Выход муки", { range: { min: 0, max: 100 } }),
  q("flour_mill.ash", "%", "Flour ash", "Зольность муки", { range: { min: 0, max: 100 } }),
  q("flour_mill.throughput", "t/h", "Mill throughput", "Производительность"),
  q("flour_mill.sifter.rpm", "rpm", "Sifter speed", "Обороты рассева"),
  logical("flour_mill.choke", "Mill choke", "Завал мельницы"),
  enu("flour_mill.stream", ["patent", "clear", "whole", "semolina", "other"], "Stream", "Поток"),
]);

write("layer-b-rice_mill.json", [
  id("rice_mill.id", "Rice mill id", "ID рисозавода"),
  q("rice_mill.paddy.moist", "%", "Paddy moisture", "Влажность падди", { range: { min: 0, max: 100 } }),
  q("rice_mill.head.rice", "%", "Head rice yield", "Выход целого зерна", { range: { min: 0, max: 100 } }),
  q("rice_mill.broken", "%", "Broken fraction", "Дроблёнка", { range: { min: 0, max: 100 } }),
  q("rice_mill.whiteness", "-", "Whiteness", "Белизна"),
  q("rice_mill.throughput", "t/h", "Mill throughput", "Производительность"),
  logical("rice_mill.stone", "Stone detected", "Обнаружен камень"),
  enu("rice_mill.product", ["brown", "white", "parboiled", "broken", "other"], "Product", "Продукт"),
]);

write("layer-b-oilseed_crush.json", [
  id("oilseed_crush.plant.id", "Crush plant id", "ID маслоэкстракционного завода"),
  q("oilseed_crush.seed.moist", "%", "Seed moisture", "Влажность семян", { range: { min: 0, max: 100 } }),
  q("oilseed_crush.press.temp", "Cel", "Press temperature", "Температура пресса"),
  q("oilseed_crush.oil.yield", "%", "Oil yield", "Выход масла", { range: { min: 0, max: 100 } }),
  q("oilseed_crush.hexane", "ppm", "Residual hexane", "Остаточный гексан"),
  q("oilseed_crush.meal.prot", "%", "Meal protein", "Белок шрота", { range: { min: 0, max: 100 } }),
  logical("oilseed_crush.solvent.ok", "Solvent recovery OK", "Регенерация растворителя OK"),
  enu("oilseed_crush.seed", ["soy", "rapeseed", "sunflower", "palm", "other"], "Seed", "Сырьё"),
]);

write("layer-b-olive_mill.json", [
  id("olive_mill.id", "Olive mill id", "ID маслодельни"),
  q("olive_mill.paste.temp", "Cel", "Paste temperature", "Температура пасты"),
  q("olive_mill.malax.time", "min", "Malaxation time", "Время малоаксации"),
  q("olive_mill.oil.yield", "%", "Oil yield", "Выход масла", { range: { min: 0, max: 100 } }),
  q("olive_mill.acidity", "%", "Free acidity", "Кислотность", { range: { min: 0, max: 100 } }),
  q("olive_mill.throughput", "t/h", "Fruit throughput", "Переработка плодов"),
  logical("olive_mill.decant.ok", "Decanter OK", "Декантер OK"),
  enu("olive_mill.grade", ["evoo", "voo", "lampante", "pomace", "other"], "Grade", "Категория"),
]);

write("layer-b-tea_factory.json", [
  id("tea_factory.id", "Tea factory id", "ID чайной фабрики"),
  q("tea_factory.wither.moist", "%", "Wither moisture", "Влажность завяливания", { range: { min: 0, max: 100 } }),
  q("tea_factory.roll.temp", "Cel", "Rolling temperature", "Температура скрутки"),
  q("tea_factory.ferment.h", "h", "Fermentation time", "Время ферментации"),
  q("tea_factory.dryer.temp", "Cel", "Dryer temperature", "Температура сушилки"),
  q("tea_factory.made.tea", "kg/h", "Made tea rate", "Выпуск готового чая"),
  logical("tea_factory.fire.risk", "Dryer fire risk", "Риск возгорания сушилки"),
  enu("tea_factory.process", ["orthodox", "ctc", "green", "oolong", "other"], "Process", "Процесс"),
]);

write("layer-b-coffee_roast.json", [
  id("coffee_roast.roaster.id", "Coffee roaster id", "ID ростера"),
  id("coffee_roast.batch.id", "Roast batch id", "ID обжарки"),
  q("coffee_roast.bean.temp", "Cel", "Bean temperature", "Температура зерна"),
  q("coffee_roast.air.temp", "Cel", "Air temperature", "Температура воздуха"),
  q("coffee_roast.ror", "K/min", "Rate of rise", "Скорость роста температуры"),
  q("coffee_roast.development.s", "s", "Development time", "Время развития"),
  logical("coffee_roast.crack", "First crack", "Первый крэк"),
  enu("coffee_roast.profile", ["light", "medium", "dark", "omni", "other"], "Profile", "Профиль"),
]);

write("layer-b-ethanol_plant.json", [
  id("ethanol_plant.id", "Ethanol plant id", "ID этанольного завода"),
  q("ethanol_plant.ferment.brix", "-", "Fermenter Brix", "Brix ферментёра"),
  q("ethanol_plant.beer", "%", "Beer alcohol", "Спирт в бражке", { range: { min: 0, max: 100 } }),
  q("ethanol_plant.still.temp", "Cel", "Beer still temperature", "Температура бражной колонны"),
  q("ethanol_plant.prod", "L/h", "Ethanol production", "Выпуск этанола"),
  q("ethanol_plant.ddgs.moist", "%", "DDGS moisture", "Влажность DDGS", { range: { min: 0, max: 100 } }),
  logical("ethanol_plant.infection", "Ferment infection", "Инфекция ферментации"),
  enu("ethanol_plant.feedstock", ["corn", "wheat", "cane", "cellulosic", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-biodiesel.json", [
  id("biodiesel.reactor.id", "Biodiesel reactor id", "ID реактора биодизеля"),
  q("biodiesel.fffa", "%", "Feed FFA", "СЖК сырья", { range: { min: 0, max: 100 } }),
  q("biodiesel.methanol", "L/h", "Methanol feed", "Подача метанола"),
  q("biodiesel.reactor.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("biodiesel.conv", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  q("biodiesel.glycerin", "t/d", "Glycerin make", "Выпуск глицерина"),
  logical("biodiesel.wash.ok", "Wash clear", "Промывка чистая"),
  enu("biodiesel.feedstock", ["soy", "rape", "uco", "tallow", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-thermal_shock.json", [
  id("thermal_shock.chamber.id", "Thermal shock chamber id", "ID камеры термошока"),
  id("thermal_shock.run.id", "Shock run id", "ID прогона термошока"),
  q("thermal_shock.hot", "Cel", "Hot zone", "Горячая зона"),
  q("thermal_shock.cold", "Cel", "Cold zone", "Холодная зона"),
  q("thermal_shock.dwell.s", "s", "Dwell time", "Выдержка"),
  q("thermal_shock.cycles", "-", "Cycle count", "Число циклов", { encodings: ["i32"] }),
  logical("thermal_shock.transfer", "In transfer", "Перенос"),
  enu("thermal_shock.mode", ["air", "liquid", "two_zone", "three_zone"], "Mode", "Режим"),
]);

write("layer-b-drop_test.json", [
  id("drop_test.rig.id", "Drop test rig id", "ID стенда сброса"),
  id("drop_test.sample.id", "Sample id", "ID образца"),
  q("drop_test.height", "m", "Drop height", "Высота сброса"),
  q("drop_test.mass", "kg", "Package mass", "Масса упаковки"),
  q("drop_test.accel", "m/s2", "Peak acceleration", "Пиковое ускорение"),
  q("drop_test.drops", "-", "Drop count", "Число сбросов", { encodings: ["i32"] }),
  logical("drop_test.fail", "Package failed", "Упаковка не прошла"),
  enu("drop_test.orient", ["face", "edge", "corner", "tumble"], "Orientation", "Ориентация"),
]);

write("layer-b-ip_ingress.json", [
  id("ip_ingress.chamber.id", "IP test chamber id", "ID камеры IP"),
  id("ip_ingress.dut.id", "DUT id", "ID испытуемого"),
  q("ip_ingress.dust.h", "h", "Dust duration", "Длительность пыли"),
  q("ip_ingress.water.p", "kPa", "Water pressure", "Давление воды"),
  q("ip_ingress.flow", "L/min", "Spray flow", "Расход струи"),
  q("ip_ingress.rating", "-", "Target IP code", "Целевой код IP", { encodings: ["i32"] }),
  logical("ip_ingress.ingress", "Ingress detected", "Обнаружено проникновение"),
  enu("ip_ingress.test", ["ip5x", "ip6x", "ipx4", "ipx5", "ipx7", "ipx8", "other"], "Test", "Испытание"),
]);

write("layer-b-battery_cycler.json", [
  id("battery_cycler.channel.id", "Cycler channel id", "ID канала циклера"),
  id("battery_cycler.cell.id", "Cycled cell id", "ID циклируемой ячейки"),
  q("battery_cycler.current", "A", "Channel current", "Ток канала"),
  q("battery_cycler.voltage", "V", "Cell voltage", "Напряжение ячейки"),
  q("battery_cycler.capacity", "A.h", "Cycle capacity", "Ёмкость цикла"),
  q("battery_cycler.cycle", "-", "Cycle index", "Номер цикла", { encodings: ["i32"] }),
  logical("battery_cycler.cutoff", "Cutoff reached", "Достигнут отсечки"),
  enu("battery_cycler.mode", ["cc", "cv", "cccv", "pulse", "rest", "fault"], "Mode", "Режим"),
]);

write("layer-b-vna_lab.json", [
  id("vna_lab.instrument.id", "VNA id", "ID векторного анализатора"),
  id("vna_lab.setup.id", "VNA setup id", "ID установки VNA"),
  q("vna_lab.freq", "Hz", "Stimulus frequency", "Частота стимула"),
  q("vna_lab.s11", "dB", "S11", "S11"),
  q("vna_lab.s21", "dB", "S21", "S21"),
  q("vna_lab.power", "dBm", "Stimulus power", "Мощность стимула"),
  logical("vna_lab.cal", "Calibrated", "Откалиброван"),
  enu("vna_lab.cal_type", ["solt", "trl", "unknown_thru", "none"], "Cal type", "Тип калибровки"),
]);

write("layer-b-spectrum_lab.json", [
  id("spectrum_lab.instrument.id", "Spectrum analyzer id", "ID анализатора спектра"),
  q("spectrum_lab.cf", "Hz", "Center frequency", "Центральная частота"),
  q("spectrum_lab.rbw", "Hz", "RBW", "Полоса разрешения"),
  q("spectrum_lab.peak", "dBm", "Peak amplitude", "Пиковая амплитуда"),
  q("spectrum_lab.span", "Hz", "Span", "Полоса обзора"),
  q("spectrum_lab.nf", "dB", "Noise floor", "Шумовой пол"),
  logical("spectrum_lab.overload", "Input overload", "Перегрузка входа"),
  enu("spectrum_lab.detector", ["peak", "rms", "sample", "quasi_peak", "other"], "Detector", "Детектор"),
]);

write("layer-b-cotton_gin.json", [
  id("cotton_gin.id", "Cotton gin id", "ID хлопкозавода"),
  q("cotton_gin.moisture", "%", "Seed cotton moisture", "Влажность хлопка-сырца", { range: { min: 0, max: 100 } }),
  q("cotton_gin.turnout", "%", "Lint turnout", "Выход волокна", { range: { min: 0, max: 100 } }),
  q("cotton_gin.trash", "%", "Trash content", "Сорность", { range: { min: 0, max: 100 } }),
  q("cotton_gin.throughput", "t/h", "Ginning rate", "Производительность джина"),
  q("cotton_gin.micronaire", "-", "Micronaire", "Микронейр"),
  logical("cotton_gin.choke", "Gin choke", "Завал джина"),
  enu("cotton_gin.state", ["gin", "press", "idle", "maintain", "fault"], "Gin state", "Состояние джина"),
]);

write("layer-b-wool_scour.json", [
  id("wool_scour.line.id", "Wool scour line id", "ID линии мойки шерсти"),
  q("wool_scour.bowl.temp", "Cel", "Bowl temperature", "Температура ванны"),
  q("wool_scour.ph", "-", "Scour pH", "pH мойки"),
  q("wool_scour.grease", "%", "Residual grease", "Остаточный жир", { range: { min: 0, max: 100 } }),
  q("wool_scour.yield", "%", "Clean yield", "Выход чистой шерсти", { range: { min: 0, max: 100 } }),
  q("wool_scour.throughput", "t/h", "Greasy throughput", "Переработка грязной шерсти"),
  logical("wool_scour.foam", "Excess foam", "Избыточная пена"),
  enu("wool_scour.state", ["scour", "rinse", "dry", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-starch_plant.json", [
  id("starch_plant.id", "Starch plant id", "ID крахмального завода"),
  q("starch_plant.steep.time", "h", "Steep time", "Время замачивания"),
  q("starch_plant.so2", "ppm", "Steep SO2", "SO2 замочки"),
  q("starch_plant.protein", "%", "Gluten protein", "Белок клейковины", { range: { min: 0, max: 100 } }),
  q("starch_plant.moisture", "%", "Starch moisture", "Влажность крахмала", { range: { min: 0, max: 100 } }),
  q("starch_plant.prod", "t/d", "Starch production", "Выпуск крахмала"),
  logical("starch_plant.mill.ok", "Mill OK", "Мельница OK"),
  enu("starch_plant.feedstock", ["corn", "wheat", "potato", "cassava", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-salt_works.json", [
  id("salt_works.pond.id", "Salt pond id", "ID садки соли"),
  q("salt_works.sg", "-", "Brine SG", "Плотность рассола"),
  q("salt_works.level", "mm", "Pond level", "Уровень садки"),
  q("salt_works.nacl", "%", "NaCl", "NaCl", { range: { min: 0, max: 100 } }),
  q("salt_works.harvest", "t/d", "Harvest rate", "Съём соли"),
  q("salt_works.evap", "mm/d", "Evaporation", "Испарение"),
  logical("salt_works.ready", "Harvest ready", "Готово к съёму"),
  enu("salt_works.stage", ["intake", "evap", "crystallize", "harvest", "idle"], "Stage", "Стадия"),
]);

write("layer-b-intermodal_yard.json", [
  id("intermodal_yard.id", "Intermodal yard id", "ID контейнерной площадки"),
  id("intermodal_yard.crane.id", "RMG/RTG id", "ID крана RMG/RTG"),
  q("intermodal_yard.moves", "/h", "Moves per hour", "Операций в час"),
  q("intermodal_yard.dwell.h", "h", "Average dwell", "Средний простой"),
  q("intermodal_yard.util", "%", "Ground slots used", "Занятость слотов", { range: { min: 0, max: 100 } }),
  q("intermodal_yard.queue", "-", "Gate queue", "Очередь на воротах", { encodings: ["i32"] }),
  logical("intermodal_yard.congested", "Yard congested", "Площадка перегружена"),
  enu("intermodal_yard.mode", ["rail", "truck", "mixed", "closed"], "Mode", "Режим"),
]);

write("layer-b-crematorium.json", [
  id("crematorium.id", "Cremator id", "ID крематора"),
  q("crematorium.primary.temp", "Cel", "Primary chamber temperature", "Температура основной камеры"),
  q("crematorium.secondary.temp", "Cel", "Secondary chamber temperature", "Температура дожига"),
  q("crematorium.cycle.min", "min", "Cycle time", "Длительность цикла"),
  q("crematorium.co", "ppm", "Stack CO", "CO в трубе"),
  q("crematorium.opacity", "%", "Stack opacity", "Дымность", { range: { min: 0, max: 100 } }),
  logical("crematorium.charge.lock", "Charge locked", "Загрузка заблокирована"),
  enu("crematorium.state", ["preheat", "charge", "burn", "cool", "idle", "fault"], "Cremator state", "Состояние крематора"),
]);

console.log("Layer B15 seeds written");
