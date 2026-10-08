#!/usr/bin/env node
/**
 * Layer B30 — oil & gas upstream/midstream/downstream, petrochemicals.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B30", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-crude_dist.json", [
  id("crude_dist.unit.id", "Crude distillation unit id", "ID установки первичной перегонки"),
  q("crude_dist.feed", "t/h", "Crude feed rate", "Расход нефти"),
  q("crude_dist.furnace", "Cel", "Furnace outlet temperature", "Температура на выходе печи"),
  q("crude_dist.overhead", "Cel", "Overhead temperature", "Температура верха"),
  q("crude_dist.pressure", "kPa", "Tower pressure", "Давление колонны"),
  q("crude_dist.energy", "MJ/t", "Specific energy", "Удельная энергия"),
  logical("crude_dist.flood", "Flooding risk", "Риск захлёбывания"),
  enu("crude_dist.state", ["run", "startup", "shutdown", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-fcc_unit.json", [
  id("fcc_unit.id", "FCC unit id", "ID установки ККФ"),
  q("fcc_unit.feed", "t/h", "Fresh feed", "Свежее сырьё"),
  q("fcc_unit.regen.t", "Cel", "Regenerator temperature", "Температура регенератора"),
  q("fcc_unit.riser.t", "Cel", "Riser outlet temperature", "Температура райзера"),
  q("fcc_unit.conv", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  q("fcc_unit.catalyst", "t", "Catalyst inventory", "Запас катализатора"),
  logical("fcc_unit.slide", "Slide valve limit", "Ограничение шибера"),
  enu("fcc_unit.state", ["run", "regen", "idle", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-hydrocracker.json", [
  id("hydrocracker.id", "Hydrocracker id", "ID гидрокрекинга"),
  q("hydrocracker.feed", "t/h", "Feed rate", "Расход сырья"),
  q("hydrocracker.pressure", "kPa", "Reactor pressure", "Давление реактора"),
  q("hydrocracker.temp", "Cel", "WABT", "Средневзвешенная температура"),
  q("hydrocracker.h2", "Nm3/h", "H2 make-up", "Подпитка H2"),
  q("hydrocracker.conv", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  logical("hydrocracker.quench", "Quench active", "Закалка активна"),
  enu("hydrocracker.state", ["run", "catalyst", "idle", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-reformer_cat.json", [
  id("reformer_cat.id", "Catalytic reformer id", "ID каталитического риформинга"),
  q("reformer_cat.feed", "t/h", "Naphtha feed", "Подача нафты"),
  q("reformer_cat.octane", "-", "RON", "ОЧ по исследовательскому методу"),
  q("reformer_cat.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("reformer_cat.pressure", "kPa", "Reactor pressure", "Давление реактора"),
  q("reformer_cat.h2", "Nm3/h", "H2 production", "Выработка H2"),
  logical("reformer_cat.coke", "Coke high", "Высокий кокс"),
  enu("reformer_cat.type", ["ccr", "semi_regen", "cyclic", "other"], "Type", "Тип"),
]);

write("layer-b-alkylation.json", [
  id("alkylation.id", "Alkylation unit id", "ID установки алкилирования"),
  q("alkylation.feed", "t/h", "Olefin feed", "Подача олефинов"),
  q("alkylation.acid", "%", "Acid strength", "Концентрация кислоты", { range: { min: 0, max: 100 } }),
  q("alkylation.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("alkylation.ron", "-", "Alkylate RON", "ОЧ алкилата"),
  q("alkylation.ratio", "-", "Isobutane / olefin ratio", "Соотношение изобутан/олефин"),
  logical("alkylation.acid.alarm", "Acid strength alarm", "Тревога по кислоте"),
  enu("alkylation.catalyst", ["hf", "h2so4", "solid", "other"], "Catalyst", "Катализатор"),
]);

write("layer-b-coker_unit.json", [
  id("coker_unit.id", "Delayed coker id", "ID установки замедленного коксования"),
  q("coker_unit.feed", "t/h", "Residue feed", "Подача остатка"),
  q("coker_unit.drum.t", "Cel", "Drum temperature", "Температура камеры"),
  q("coker_unit.cycle.h", "h", "Drum cycle time", "Цикл камеры"),
  q("coker_unit.coke", "t", "Coke produced", "Выработано кокса"),
  q("coker_unit.gasoil", "t/h", "Coker gasoil", "Газойль коксования"),
  logical("coker_unit.switch", "Drum switch in progress", "Переключение камер"),
  enu("coker_unit.state", ["fill", "steam", "cool", "drill", "fault"], "Drum state", "Состояние камеры"),
]);

write("layer-b-hydrotreater.json", [
  id("hydrotreater.id", "Hydrotreater id", "ID гидроочистки"),
  q("hydrotreater.feed", "t/h", "Feed rate", "Расход сырья"),
  q("hydrotreater.sulfur.in", "ppm", "Feed sulfur", "Сера в сырье"),
  q("hydrotreater.sulfur.out", "ppm", "Product sulfur", "Сера в продукте"),
  q("hydrotreater.temp", "Cel", "WABT", "Средневзвешенная температура"),
  q("hydrotreater.h2", "Nm3/h", "H2 consumption", "Расход H2"),
  logical("hydrotreater.spec.ok", "Sulfur spec OK", "Норма по сере OK"),
  enu("hydrotreater.service", ["naphtha", "diesel", "kero", "gasoil", "other"], "Service", "Служба"),
]);

write("layer-b-visbreaker.json", [
  id("visbreaker.id", "Visbreaker id", "ID висбрекинга"),
  q("visbreaker.feed", "t/h", "Feed rate", "Расход сырья"),
  q("visbreaker.temp", "Cel", "Soaker / coil temperature", "Температура сокера/змеевика"),
  q("visbreaker.conv", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  q("visbreaker.viscosity", "mPa.s", "Product viscosity", "Вязкость продукта"),
  q("visbreaker.pressure", "kPa", "Coil pressure", "Давление змеевика"),
  logical("visbreaker.fouling", "Fouling high", "Высокое загрязнение"),
  enu("visbreaker.type", ["soaker", "coil", "other"], "Type", "Тип"),
]);

write("layer-b-asphalt_blend.json", [
  id("asphalt_blend.id", "Asphalt blending unit id", "ID установки компаундирования битума"),
  q("asphalt_blend.output", "t/h", "Blend output", "Выработка"),
  q("asphalt_blend.pen", "dmm", "Penetration", "Пенетрация"),
  q("asphalt_blend.soft", "Cel", "Softening point", "Температура размягчения"),
  q("asphalt_blend.temp", "Cel", "Blend temperature", "Температура смешения"),
  q("asphalt_blend.viscosity", "Pa.s", "Viscosity", "Вязкость"),
  logical("asphalt_blend.spec.ok", "Spec OK", "Спецификация OK"),
  enu("asphalt_blend.grade", ["paving", "roofing", "emulsion", "other"], "Grade", "Марка"),
]);

write("layer-b-lube_plant.json", [
  id("lube_plant.id", "Lube oil plant id", "ID завода масел"),
  q("lube_plant.feed", "t/h", "Base stock feed", "Подача базового масла"),
  q("lube_plant.viscosity", "mm2/s", "Kinematic viscosity", "Кинематическая вязкость"),
  q("lube_plant.vi", "-", "Viscosity index", "Индекс вязкости"),
  q("lube_plant.output", "t/h", "Finished lube output", "Выпуск готовых масел"),
  q("lube_plant.additive", "%", "Additive treat", "Доля присадок", { range: { min: 0, max: 100 } }),
  logical("lube_plant.spec.ok", "Spec OK", "Спецификация OK"),
  enu("lube_plant.state", ["blend", "fill", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-aromatics.json", [
  id("aromatics.id", "Aromatics complex id", "ID ароматического комплекса"),
  q("aromatics.feed", "t/h", "Reformate / pygas feed", "Подача риформата/пирогаза"),
  q("aromatics.benzene", "t/h", "Benzene production", "Выработка бензола"),
  q("aromatics.px", "t/h", "Paraxylene production", "Выработка параксилола"),
  q("aromatics.purity", "%", "Product purity", "Чистота продукта", { range: { min: 0, max: 100 } }),
  q("aromatics.energy", "MJ/t", "Specific energy", "Удельная энергия"),
  logical("aromatics.spec.ok", "Spec OK", "Спецификация OK"),
  enu("aromatics.state", ["extract", "separate", "idle", "fault"], "Complex state", "Состояние комплекса"),
]);

write("layer-b-steam_cracker.json", [
  id("steam_cracker.id", "Steam cracker id", "ID парового крекинга"),
  q("steam_cracker.feed", "t/h", "Hydrocarbon feed", "Подача углеводородов"),
  q("steam_cracker.cot", "Cel", "Coil outlet temperature", "Температура на выходе змеевика"),
  q("steam_cracker.ethylene", "t/h", "Ethylene production", "Выработка этилена"),
  q("steam_cracker.propylene", "t/h", "Propylene production", "Выработка пропилена"),
  q("steam_cracker.severity", "-", "Steam / HC ratio", "Соотношение пар/УВ"),
  logical("steam_cracker.decoke", "Decoke in progress", "Выжиг кокса"),
  enu("steam_cracker.feed.type", ["ethane", "naphtha", "lpg", "gasoil", "other"], "Feed type", "Тип сырья"),
]);

write("layer-b-polyolefin.json", [
  id("polyolefin.id", "Polyolefin plant id", "ID завода полиолефинов"),
  q("polyolefin.feed", "t/h", "Monomer feed", "Подача мономера"),
  q("polyolefin.output", "t/h", "Polymer output", "Выпуск полимера"),
  q("polyolefin.mi", "g/10min", "Melt index", "Показатель текучести расплава"),
  q("polyolefin.density", "g/cm3", "Density", "Плотность"),
  q("polyolefin.catalyst", "ppm", "Catalyst residual", "Остаток катализатора"),
  logical("polyolefin.spec.ok", "Resin spec OK", "Спецификация смолы OK"),
  enu("polyolefin.type", ["hdpe", "ldpe", "lldpe", "pp", "other"], "Type", "Тип"),
]);

write("layer-b-butadiene.json", [
  id("butadiene.id", "Butadiene extraction id", "ID экстракции бутадиена"),
  q("butadiene.feed", "t/h", "C4 feed", "Подача C4"),
  q("butadiene.output", "t/h", "BD production", "Выработка БД"),
  q("butadiene.purity", "%", "BD purity", "Чистота БД", { range: { min: 0, max: 100 } }),
  q("butadiene.solvent", "t/h", "Solvent circulation", "Циркуляция растворителя"),
  q("butadiene.energy", "MJ/t", "Specific energy", "Удельная энергия"),
  logical("butadiene.spec.ok", "Spec OK", "Спецификация OK"),
  enu("butadiene.state", ["extract", "strip", "idle", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-styrene_pl.json", [
  id("styrene_pl.id", "Styrene plant id", "ID завода стирола"),
  q("styrene_pl.feed", "t/h", "EB / feed rate", "Подача ЭБ/сырья"),
  q("styrene_pl.output", "t/h", "Styrene output", "Выпуск стирола"),
  q("styrene_pl.conv", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  q("styrene_pl.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("styrene_pl.purity", "%", "Product purity", "Чистота продукта", { range: { min: 0, max: 100 } }),
  logical("styrene_pl.spec.ok", "Spec OK", "Спецификация OK"),
  enu("styrene_pl.state", ["dehy", "distill", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-pvc_react.json", [
  id("pvc_react.id", "PVC reactor id", "ID реактора ПВХ"),
  id("pvc_react.batch.id", "Batch id", "ID партии"),
  q("pvc_react.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("pvc_react.pressure", "kPa", "Reactor pressure", "Давление реактора"),
  q("pvc_react.conv", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  q("pvc_react.kvalue", "-", "K-value", "Значение K"),
  logical("pvc_react.vcm", "VCM residual high", "Высокий остаток ВХМ"),
  enu("pvc_react.process", ["suspension", "emulsion", "bulk", "other"], "Process", "Процесс"),
]);

write("layer-b-pet_plant.json", [
  id("pet_plant.id", "PET plant id", "ID завода ПЭТ"),
  q("pet_plant.feed", "t/h", "PTA / MEG feed", "Подача ТФК/МЭГ"),
  q("pet_plant.output", "t/h", "PET chip output", "Выпуск чипсов ПЭТ"),
  q("pet_plant.iv", "dL/g", "Intrinsic viscosity", "Характеристическая вязкость"),
  q("pet_plant.aa", "ppm", "Acetaldehyde", "Ацетальдегид"),
  q("pet_plant.temp", "Cel", "SSP / polycond temperature", "Температура поликонденсации"),
  logical("pet_plant.spec.ok", "Chip spec OK", "Спецификация чипсов OK"),
  enu("pet_plant.state", ["esterify", "polycond", "ssp", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-pu_plant.json", [
  id("pu_plant.id", "Polyurethane plant id", "ID завода полиуретанов"),
  q("pu_plant.iso", "t/h", "Isocyanate feed", "Подача изоцианата"),
  q("pu_plant.polyol", "t/h", "Polyol feed", "Подача полиола"),
  q("pu_plant.output", "t/h", "PU output", "Выпуск ПУ"),
  q("pu_plant.nco", "%", "NCO content", "Содержание NCO", { range: { min: 0, max: 100 } }),
  q("pu_plant.temp", "Cel", "Reactor temperature", "Температура реактора"),
  logical("pu_plant.spec.ok", "Spec OK", "Спецификация OK"),
  enu("pu_plant.product", ["mdi", "tdi", "polyol", "system", "other"], "Product", "Продукт"),
]);

write("layer-b-epoxy_plant.json", [
  id("epoxy_plant.id", "Epoxy resin plant id", "ID завода эпоксидных смол"),
  q("epoxy_plant.feed", "t/h", "Feed rate", "Расход сырья"),
  q("epoxy_plant.output", "t/h", "Resin output", "Выпуск смолы"),
  q("epoxy_plant.eeew", "g/eq", "Epoxy equivalent weight", "Эпоксидный эквивалент"),
  q("epoxy_plant.viscosity", "mPa.s", "Resin viscosity", "Вязкость смолы"),
  q("epoxy_plant.temp", "Cel", "Reactor temperature", "Температура реактора"),
  logical("epoxy_plant.spec.ok", "Spec OK", "Спецификация OK"),
  enu("epoxy_plant.state", ["react", "strip", "blend", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-silicone_pl.json", [
  id("silicone_pl.id", "Silicone plant id", "ID завода силиконов"),
  q("silicone_pl.feed", "t/h", "Monomer feed", "Подача мономера"),
  q("silicone_pl.output", "t/h", "Silicone output", "Выпуск силикона"),
  q("silicone_pl.viscosity", "mPa.s", "Product viscosity", "Вязкость продукта"),
  q("silicone_pl.volatiles", "%", "Volatiles", "Летучие", { range: { min: 0, max: 100 } }),
  q("silicone_pl.temp", "Cel", "Reactor temperature", "Температура реактора"),
  logical("silicone_pl.spec.ok", "Spec OK", "Спецификация OK"),
  enu("silicone_pl.product", ["fluid", "elastomer", "resin", "other"], "Product", "Продукт"),
]);

write("layer-b-chloralkali.json", [
  id("chloralkali.id", "Chlor-alkali plant id", "ID завода хлора и щёлочи"),
  q("chloralkali.current", "kA", "Cell current", "Ток электролизёра"),
  q("chloralkali.cl2", "t/d", "Chlorine production", "Выработка хлора"),
  q("chloralkali.naoh", "t/d", "Caustic production", "Выработка щёлочи"),
  q("chloralkali.voltage", "V", "Cell voltage", "Напряжение ячейки"),
  q("chloralkali.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("chloralkali.membrane", "Membrane health OK", "Мембрана OK"),
  enu("chloralkali.type", ["membrane", "diaphragm", "mercury", "other"], "Type", "Тип"),
]);

write("layer-b-air_sep_as.json", [
  id("air_sep_as.id", "Air separation unit id", "ID воздухоразделительной установки"),
  q("air_sep_as.o2", "Nm3/h", "Oxygen production", "Выработка кислорода"),
  q("air_sep_as.n2", "Nm3/h", "Nitrogen production", "Выработка азота"),
  q("air_sep_as.ar", "Nm3/h", "Argon production", "Выработка аргона"),
  q("air_sep_as.purity.o2", "%", "O2 purity", "Чистота O2", { range: { min: 0, max: 100 } }),
  q("air_sep_as.power", "MW", "ASU power", "Мощность ВРУ"),
  logical("air_sep_as.trip", "Plant trip", "Останов установки"),
  enu("air_sep_as.state", ["produce", "idle", "maintain", "fault"], "ASU state", "Состояние ВРУ"),
]);

write("layer-b-ccs_amine.json", [
  id("ccs_amine.id", "Amine CCS unit id", "ID аминовой CCS-установки"),
  q("ccs_amine.flue", "Nm3/h", "Flue gas flow", "Расход дымовых газов"),
  q("ccs_amine.co2", "t/h", "CO2 captured", "Уловлено CO2"),
  q("ccs_amine.capture", "%", "Capture rate", "Степень улавливания", { range: { min: 0, max: 100 } }),
  q("ccs_amine.lean", "%", "Lean amine loading", "Нагрузка бедного амина", { range: { min: 0, max: 100 } }),
  q("ccs_amine.steam", "t/h", "Reboiler steam", "Пар рибойлера"),
  logical("ccs_amine.spec.ok", "CO2 purity OK", "Чистота CO2 OK"),
  enu("ccs_amine.state", ["capture", "regen", "idle", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-urea_gran.json", [
  id("urea_gran.id", "Urea granulation plant id", "ID грануляции карбамида"),
  q("urea_gran.feed", "t/h", "Urea melt feed", "Подача плава карбамида"),
  q("urea_gran.output", "t/h", "Granule output", "Выпуск гранул"),
  q("urea_gran.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("urea_gran.size", "mm", "Mean granule size", "Средний размер гранул"),
  q("urea_gran.biuret", "%", "Biuret", "Биурет", { range: { min: 0, max: 100 } }),
  logical("urea_gran.spec.ok", "Spec OK", "Спецификация OK"),
  enu("urea_gran.state", ["granulate", "screen", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-ammonia_syn.json", [
  id("ammonia_syn.id", "Ammonia synthesis loop id", "ID синтеза аммиака"),
  q("ammonia_syn.feed", "Nm3/h", "Syngas feed", "Подача синтез-газа"),
  q("ammonia_syn.output", "t/d", "Ammonia production", "Выработка аммиака"),
  q("ammonia_syn.temp", "Cel", "Converter temperature", "Температура конвертера"),
  q("ammonia_syn.pressure", "kPa", "Loop pressure", "Давление контура"),
  q("ammonia_syn.conv", "%", "Conversion per pass", "Конверсия за проход", { range: { min: 0, max: 100 } }),
  logical("ammonia_syn.purge", "Purge high", "Высокий продув"),
  enu("ammonia_syn.state", ["synthesize", "startup", "idle", "fault"], "Loop state", "Состояние контура"),
]);

write("layer-b-sulfuric_ac.json", [
  id("sulfuric_ac.id", "Sulfuric acid plant id", "ID завода серной кислоты"),
  q("sulfuric_ac.feed", "t/h", "S / SO2 feed", "Подача S/SO2"),
  q("sulfuric_ac.output", "t/d", "H2SO4 production", "Выработка H2SO4"),
  q("sulfuric_ac.conv", "%", "SO2 conversion", "Конверсия SO2", { range: { min: 0, max: 100 } }),
  q("sulfuric_ac.strength", "%", "Acid strength", "Концентрация кислоты", { range: { min: 0, max: 100 } }),
  q("sulfuric_ac.temp", "Cel", "Converter temperature", "Температура конвертера"),
  logical("sulfuric_ac.mist", "Mist eliminator OK", "Туманный фильтр OK"),
  enu("sulfuric_ac.state", ["produce", "idle", "maintain", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-nitric_acid.json", [
  id("nitric_acid.id", "Nitric acid plant id", "ID завода азотной кислоты"),
  q("nitric_acid.nh3", "t/h", "Ammonia feed", "Подача аммиака"),
  q("nitric_acid.output", "t/d", "HNO3 production", "Выработка HNO3"),
  q("nitric_acid.strength", "%", "Acid strength", "Концентрация", { range: { min: 0, max: 100 } }),
  q("nitric_acid.temp", "Cel", "Burner temperature", "Температура горелки"),
  q("nitric_acid.nox", "ppm", "Stack NOx", "NOx в дыме"),
  logical("nitric_acid.pt", "Pt gauze change due", "Замена Pt-сетки"),
  enu("nitric_acid.state", ["produce", "idle", "maintain", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-amine_unit.json", [
  id("amine_unit.id", "Amine gas treating unit id", "ID аминовой очистки газа"),
  q("amine_unit.gas", "Nm3/h", "Acid gas inlet", "Вход кислого газа"),
  q("amine_unit.h2s.out", "ppm", "Treated H2S", "H2S после очистки"),
  q("amine_unit.co2.out", "%", "Treated CO2", "CO2 после очистки", { range: { min: 0, max: 100 } }),
  q("amine_unit.rich", "%", "Rich loading", "Нагрузка богатого амина", { range: { min: 0, max: 100 } }),
  q("amine_unit.steam", "t/h", "Reboiler steam", "Пар рибойлера"),
  logical("amine_unit.foaming", "Foaming", "Вспенивание"),
  enu("amine_unit.amine", ["mea", "dea", "mdea", "dga", "other"], "Amine", "Амин"),
]);

write("layer-b-sulfur_rec.json", [
  id("sulfur_rec.id", "Claus sulfur recovery id", "ID установки Клауса"),
  q("sulfur_rec.feed", "Nm3/h", "Acid gas feed", "Подача кислого газа"),
  q("sulfur_rec.sulfur", "t/d", "Sulfur production", "Выработка серы"),
  q("sulfur_rec.recovery", "%", "Sulfur recovery", "Извлечение серы", { range: { min: 0, max: 100 } }),
  q("sulfur_rec.temp", "Cel", "Reaction furnace temperature", "Температура печи"),
  q("sulfur_rec.h2s.tail", "ppm", "Tail gas H2S", "H2S в хвостовом газе"),
  logical("sulfur_rec.ratio", "Air / gas ratio OK", "Соотношение воздух/газ OK"),
  enu("sulfur_rec.state", ["recover", "hot_standby", "idle", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-flare_sys.json", [
  id("flare_sys.id", "Flare system id", "ID факельной системы"),
  q("flare_sys.flow", "Nm3/h", "Flare gas flow", "Расход факельного газа"),
  q("flare_sys.pilot", "-", "Pilots lit", "Горящих запальников", { encodings: ["i32"] }),
  q("flare_sys.tip.t", "Cel", "Tip temperature", "Температура оголовка"),
  q("flare_sys.smokeless", "%", "Smokeless steam / assist", "Бесдымный пар/воздух", { range: { min: 0, max: 100 } }),
  q("flare_sys.events", "-", "Relief events today", "Сбросов за сутки", { encodings: ["i32"] }),
  logical("flare_sys.flame", "Flame present", "Пламя есть"),
  enu("flare_sys.state", ["standby", "flaring", "purge", "fault"], "Flare state", "Состояние факела"),
]);

write("layer-b-tankfarm_og.json", [
  id("tankfarm_og.id", "Oil & gas tank farm id", "ID резервуарного парка НПЗ/НХК"),
  q("tankfarm_og.inventory", "m3", "Total inventory", "Общий запас"),
  q("tankfarm_og.tanks", "-", "Tanks in service", "Резервуаров в работе", { encodings: ["i32"] }),
  q("tankfarm_og.transfers", "-", "Transfers today", "Перекачек за сутки", { encodings: ["i32"] }),
  q("tankfarm_og.vapor", "ppm", "VOC / vapor alarm max", "Макс. пары/ЛОС"),
  q("tankfarm_og.water", "%", "BS&W average", "Средняя вода/механические", { range: { min: 0, max: 100 } }),
  logical("tankfarm_og.overfill", "Overfill protection trip", "Срабатывание защиты от переполнения"),
  enu("tankfarm_og.state", ["normal", "transfer", "maintain", "alarm"], "Farm state", "Состояние парка"),
]);

write("layer-b-pipeline_cp.json", [
  id("pipeline_cp.id", "Pipeline compressor station id", "ID компрессорной станции"),
  q("pipeline_cp.flow", "Nm3/h", "Throughput", "Производительность"),
  q("pipeline_cp.suction", "kPa", "Suction pressure", "Давление всасывания"),
  q("pipeline_cp.discharge", "kPa", "Discharge pressure", "Давление нагнетания"),
  q("pipeline_cp.power", "MW", "Station power", "Мощность станции"),
  q("pipeline_cp.temp", "Cel", "Discharge temperature", "Температура нагнетания"),
  logical("pipeline_cp.surge", "Surge control active", "Антипомпаж активен"),
  enu("pipeline_cp.state", ["run", "standby", "maintain", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-pig_launch.json", [
  id("pig_launch.id", "Pig launcher / receiver id", "ID камеры пуска/приёма СОД"),
  id("pig_launch.run.id", "Pig run id", "ID прогона СОД"),
  q("pig_launch.pressure", "kPa", "Trap pressure", "Давление камеры"),
  q("pig_launch.speed", "m/s", "Estimated pig speed", "Оценка скорости СОД"),
  q("pig_launch.progress", "%", "Run progress", "Прогресс прогона", { range: { min: 0, max: 100 } }),
  q("pig_launch.delta.p", "kPa", "Differential pressure", "Перепад давления"),
  logical("pig_launch.received", "Pig received", "СОД принят"),
  enu("pig_launch.type", ["cleaning", "smart", "batching", "other"], "Pig type", "Тип СОД"),
]);

write("layer-b-meter_stn.json", [
  id("meter_stn.id", "Custody meter station id", "ID узла учёта"),
  q("meter_stn.flow", "Nm3/h", "Measured flow", "Измеренный расход"),
  q("meter_stn.pressure", "kPa", "Line pressure", "Давление линии"),
  q("meter_stn.temp", "Cel", "Line temperature", "Температура линии"),
  q("meter_stn.energy", "MJ/h", "Energy flow", "Энергетический расход"),
  q("meter_stn.uncertainty", "%", "Measurement uncertainty", "Погрешность", { range: { min: 0, max: 100 } }),
  logical("meter_stn.prove", "Prover in progress", "Поверка идёт"),
  enu("meter_stn.type", ["orifice", "ultrasonic", "turbine", "coriolis", "other"], "Type", "Тип"),
]);

write("layer-b-lng_train.json", [
  id("lng_train.id", "LNG liquefaction train id", "ID линии сжижения СПГ"),
  q("lng_train.feed", "Nm3/h", "Feed gas", "Подача газа"),
  q("lng_train.lng", "t/h", "LNG production", "Выработка СПГ"),
  q("lng_train.temp", "Cel", "LNG temperature", "Температура СПГ"),
  q("lng_train.power", "MW", "Train power", "Мощность линии"),
  q("lng_train.availability", "%", "Availability", "Готовность", { range: { min: 0, max: 100 } }),
  logical("lng_train.trip", "Train trip", "Останов линии"),
  enu("lng_train.state", ["liquefy", "idle", "maintain", "fault"], "Train state", "Состояние линии"),
]);

write("layer-b-lng_tank.json", [
  id("lng_tank.id", "LNG storage tank id", "ID резервуара СПГ"),
  q("lng_tank.level", "%", "Liquid level", "Уровень жидкости", { range: { min: 0, max: 100 } }),
  q("lng_tank.temp", "Cel", "Liquid temperature", "Температура жидкости"),
  q("lng_tank.pressure", "kPa", "Tank pressure", "Давление резервуара"),
  q("lng_tank.boiloff", "Nm3/h", "Boil-off gas", "Испарённый газ"),
  q("lng_tank.inventory", "t", "LNG inventory", "Запас СПГ"),
  logical("lng_tank.rollover", "Rollover risk", "Риск расслоения"),
  enu("lng_tank.state", ["store", "fill", "sendout", "fault"], "Tank state", "Состояние резервуара"),
]);

write("layer-b-regas_term.json", [
  id("regas_term.id", "LNG regas terminal id", "ID терминала регазификации"),
  q("regas_term.sendout", "Nm3/h", "Sendout rate", "Выдача газа"),
  q("regas_term.vaporizers", "-", "Vaporizers online", "Испарителей онлайн", { encodings: ["i32"] }),
  q("regas_term.temp", "Cel", "Sendout temperature", "Температура выдачи"),
  q("regas_term.pressure", "kPa", "Sendout pressure", "Давление выдачи"),
  q("regas_term.seawater", "m3/h", "Seawater / heat medium", "Морская вода / теплоноситель"),
  logical("regas_term.odor", "Odorization OK", "Одоризация OK"),
  enu("regas_term.state", ["regas", "idle", "maintain", "fault"], "Terminal state", "Состояние терминала"),
]);

write("layer-b-pipeline_sc.json", [
  id("pipeline_sc.id", "Pipeline SCADA segment id", "ID сегмента SCADA трубопровода"),
  q("pipeline_sc.flow", "Nm3/h", "Segment flow", "Расход сегмента"),
  q("pipeline_sc.inlet.p", "kPa", "Inlet pressure", "Давление на входе"),
  q("pipeline_sc.outlet.p", "kPa", "Outlet pressure", "Давление на выходе"),
  q("pipeline_sc.pack", "Nm3", "Line pack", "Запас в трубе"),
  q("pipeline_sc.alarms", "-", "Active alarms", "Активных тревог", { encodings: ["i32"] }),
  logical("pipeline_sc.leak", "Leak detection alarm", "Тревога утечки"),
  enu("pipeline_sc.state", ["flowing", "packed", "isolated", "fault"], "Segment state", "Состояние сегмента"),
]);

write("layer-b-block_valve.json", [
  id("block_valve.id", "Pipeline block valve id", "ID линейного крана"),
  q("block_valve.position", "%", "Valve position", "Положение крана", { range: { min: 0, max: 100 } }),
  q("block_valve.upstream", "kPa", "Upstream pressure", "Давление до крана"),
  q("block_valve.downstream", "kPa", "Downstream pressure", "Давление после крана"),
  q("block_valve.travel.s", "s", "Stroke time", "Время хода"),
  q("block_valve.torque", "%", "Actuator torque", "Момент привода", { range: { min: 0, max: 100 } }),
  logical("block_valve.esd", "ESD closed", "Аварийно закрыт"),
  enu("block_valve.state", ["open", "closed", "moving", "fault"], "Valve state", "Состояние крана"),
]);

write("layer-b-cathodic_pp.json", [
  id("cathodic_pp.id", "Pipeline CP rectifier id", "ID станции катодной защиты"),
  q("cathodic_pp.current", "A", "Output current", "Выходной ток"),
  q("cathodic_pp.voltage", "V", "Output voltage", "Выходное напряжение"),
  q("cathodic_pp.potential", "mV", "Pipe-to-soil potential", "Потенциал труба-земля"),
  q("cathodic_pp.on", "%", "On potential compliance", "Соответствие потенциала", { range: { min: 0, max: 100 } }),
  q("cathodic_pp.power", "kW", "Rectifier power", "Мощность выпрямителя"),
  logical("cathodic_pp.alarm", "CP alarm", "Тревога КЗ"),
  enu("cathodic_pp.state", ["protect", "interrupt", "offline", "fault"], "Rectifier state", "Состояние выпрямителя"),
]);

write("layer-b-leak_detect.json", [
  id("leak_detect.id", "Pipeline leak detection system id", "ID системы обнаружения утечек"),
  q("leak_detect.sensitivity", "kg/h", "Minimum detectable leak", "Мин. обнаруживаемая утечка"),
  q("leak_detect.alarms", "-", "Leak alarms today", "Тревог утечки за сутки", { encodings: ["i32"] }),
  q("leak_detect.balance", "%", "Mass balance residual", "Невязка баланса", { range: { min: 0, max: 100 } }),
  q("leak_detect.rtt.s", "s", "Detection latency", "Задержка обнаружения"),
  q("leak_detect.coverage", "%", "Segment coverage", "Покрытие сегментов", { range: { min: 0, max: 100 } }),
  logical("leak_detect.active", "Leak confirmed", "Утечка подтверждена"),
  enu("leak_detect.method", ["rpm", "mass_balance", "acoustic", "fiber", "other"], "Method", "Метод"),
]);

write("layer-b-odorizer_g.json", [
  id("odorizer_g.id", "Gas odorizer id", "ID одоризатора газа"),
  q("odorizer_g.dose", "mg/m3", "Odorant concentration", "Концентрация одоранта"),
  q("odorizer_g.inject", "mL/h", "Injection rate", "Расход впрыска"),
  q("odorizer_g.tank", "%", "Odorant tank level", "Уровень бака одоранта", { range: { min: 0, max: 100 } }),
  q("odorizer_g.flow", "Nm3/h", "Gas flow", "Расход газа"),
  q("odorizer_g.pump", "-", "Pump strokes today", "Ходов насоса за сутки", { encodings: ["i32"] }),
  logical("odorizer_g.spec.ok", "Dose in spec", "Доза в норме"),
  enu("odorizer_g.state", ["dose", "idle", "refill", "fault"], "Odorizer state", "Состояние одоризатора"),
]);

write("layer-b-city_gate.json", [
  id("city_gate.id", "City gate station id", "ID ГРС / city gate"),
  q("city_gate.inlet", "kPa", "Inlet pressure", "Давление на входе"),
  q("city_gate.outlet", "kPa", "Outlet pressure", "Давление на выходе"),
  q("city_gate.flow", "Nm3/h", "Sendout flow", "Расход выдачи"),
  q("city_gate.temp", "Cel", "Outlet temperature", "Температура на выходе"),
  q("city_gate.heat", "kW", "Preheater duty", "Мощность подогрева"),
  logical("city_gate.slam", "Slam-shut tripped", "Сработал отсекатель"),
  enu("city_gate.state", ["regulate", "bypass", "maintain", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-district_rg.json", [
  id("district_rg.id", "District regulator station id", "ID районного регуляторного пункта"),
  q("district_rg.inlet", "kPa", "Inlet pressure", "Давление на входе"),
  q("district_rg.outlet", "kPa", "Outlet pressure", "Давление на выходе"),
  q("district_rg.flow", "Nm3/h", "Flow", "Расход"),
  q("district_rg.customers", "-", "Customers served", "Потребителей", { encodings: ["i32"] }),
  q("district_rg.filter.dp", "kPa", "Filter DP", "Перепад на фильтре"),
  logical("district_rg.monitor", "Monitor run active", "Рабочий монитор"),
  enu("district_rg.state", ["regulate", "monitor", "maintain", "fault"], "Station state", "Состояние пункта"),
]);

write("layer-b-cng_fuel.json", [
  id("cng_fuel.station.id", "CNG fueling station id", "ID АГНКС"),
  q("cng_fuel.dispensers", "-", "Dispensers online", "Колонок онлайн", { encodings: ["i32"] }),
  q("cng_fuel.pressure", "kPa", "Cascade pressure", "Давление каскада"),
  q("cng_fuel.flow", "kg/min", "Fill rate", "Скорость заправки"),
  q("cng_fuel.sales", "kg", "Sales today", "Продажи за сутки"),
  q("cng_fuel.compressors", "-", "Compressors running", "Компрессоров в работе", { encodings: ["i32"] }),
  logical("cng_fuel.alarm", "Station alarm", "Тревога станции"),
  enu("cng_fuel.state", ["fuel", "idle", "maintain", "fault"], "Station state", "Состояние станции"),
]);

write("layer-b-separator_o.json", [
  id("separator_o.id", "Production separator id", "ID сепаратора добычи"),
  q("separator_o.oil", "m3/d", "Oil rate", "Дебит нефти"),
  q("separator_o.gas", "Nm3/d", "Gas rate", "Дебит газа"),
  q("separator_o.water", "m3/d", "Water rate", "Дебит воды"),
  q("separator_o.pressure", "kPa", "Vessel pressure", "Давление аппарата"),
  q("separator_o.level", "%", "Interface level", "Уровень раздела", { range: { min: 0, max: 100 } }),
  logical("separator_o.carry", "Liquid carryover", "Унос жидкости"),
  enu("separator_o.type", ["2phase", "3phase", "test", "other"], "Type", "Тип"),
]);

write("layer-b-heater_trt.json", [
  id("heater_trt.id", "Heater-treater id", "ID нагревателя-деэмульсатора"),
  q("heater_trt.temp", "Cel", "Treating temperature", "Температура обработки"),
  q("heater_trt.oil", "m3/d", "Oil throughput", "Пропуск нефти"),
  q("heater_trt.bsaw", "%", "Outlet BS&W", "Вода/механические на выходе", { range: { min: 0, max: 100 } }),
  q("heater_trt.fuel", "Nm3/h", "Fuel gas", "Топливный газ"),
  q("heater_trt.pressure", "kPa", "Vessel pressure", "Давление аппарата"),
  logical("heater_trt.fire", "Firetube OK", "Жаровая труба OK"),
  enu("heater_trt.state", ["treat", "idle", "maintain", "fault"], "Unit state", "Состояние аппарата"),
]);

write("layer-b-esp_pump.json", [
  id("esp_pump.well.id", "ESP well id", "ID скважины с УЭЦН"),
  q("esp_pump.freq", "Hz", "VSD frequency", "Частота ЧРП"),
  q("esp_pump.current", "A", "Motor current", "Ток двигателя"),
  q("esp_pump.intake.p", "kPa", "Intake pressure", "Давление на приёме"),
  q("esp_pump.rate", "m3/d", "Liquid rate", "Дебит жидкости"),
  q("esp_pump.temp", "Cel", "Motor temperature", "Температура двигателя"),
  logical("esp_pump.gas.lock", "Gas lock risk", "Риск газовой пробки"),
  enu("esp_pump.state", ["run", "idle", "optimize", "fault"], "ESP state", "Состояние УЭЦН"),
]);

write("layer-b-srp_pump.json", [
  id("srp_pump.well.id", "Sucker-rod pump well id", "ID скважины ШГН"),
  q("srp_pump.spm", "/min", "Strokes per minute", "Качаний в минуту"),
  q("srp_pump.load", "kN", "Peak polished rod load", "Макс. нагрузка на шток"),
  q("srp_pump.rate", "m3/d", "Liquid rate", "Дебит жидкости"),
  q("srp_pump.fill", "%", "Pump fillage", "Наполнение насоса", { range: { min: 0, max: 100 } }),
  q("srp_pump.runtime", "%", "Runtime today", "Время работы за сутки", { range: { min: 0, max: 100 } }),
  logical("srp_pump.pounding", "Fluid pound", "Удары жидкости"),
  enu("srp_pump.state", ["pump", "idle", "poc", "fault"], "SRP state", "Состояние ШГН"),
]);

write("layer-b-gas_lift.json", [
  id("gas_lift.well.id", "Gas-lift well id", "ID скважины газлифта"),
  q("gas_lift.inject", "Nm3/d", "Injection gas rate", "Расход газлифтного газа"),
  q("gas_lift.rate", "m3/d", "Liquid production", "Дебит жидкости"),
  q("gas_lift.whp", "kPa", "Wellhead pressure", "Давление на устье"),
  q("gas_lift.casing", "kPa", "Casing pressure", "Затрубное давление"),
  q("gas_lift.glr", "Nm3/m3", "Produced GLR", "Газовый фактор"),
  logical("gas_lift.valve", "Operating valve OK", "Рабочий клапан OK"),
  enu("gas_lift.state", ["lift", "idle", "optimize", "fault"], "Gas-lift state", "Состояние газлифта"),
]);

write("layer-b-dehy_unit.json", [
  id("dehy_unit.id", "Gas dehydration unit id", "ID установки осушки газа"),
  q("dehy_unit.gas", "Nm3/h", "Gas flow", "Расход газа"),
  q("dehy_unit.dew", "Cel", "Outlet water dew point", "Точка росы по воде"),
  q("dehy_unit.glycol", "m3/h", "Glycol circulation", "Циркуляция гликоля"),
  q("dehy_unit.reb.t", "Cel", "Reboiler temperature", "Температура рибойлера"),
  q("dehy_unit.water", "kg/h", "Water removed", "Удалено воды"),
  logical("dehy_unit.spec.ok", "Dew point OK", "Точка росы OK"),
  enu("dehy_unit.type", ["teg", "mol_sieve", "silica", "other"], "Type", "Тип"),
]);

write("layer-b-ngl_plant.json", [
  id("ngl_plant.id", "NGL recovery plant id", "ID завода ШФЛУ"),
  q("ngl_plant.gas", "Nm3/h", "Inlet gas", "Входной газ"),
  q("ngl_plant.ngl", "m3/d", "NGL production", "Выработка ШФЛУ"),
  q("ngl_plant.c2", "%", "Ethane recovery", "Извлечение этана", { range: { min: 0, max: 100 } }),
  q("ngl_plant.c3", "%", "Propane recovery", "Извлечение пропана", { range: { min: 0, max: 100 } }),
  q("ngl_plant.temp", "Cel", "Demethanizer temperature", "Температура деметанизатора"),
  logical("ngl_plant.spec.ok", "Product spec OK", "Спецификация продукта OK"),
  enu("ngl_plant.process", ["cryo", "absorption", "jt", "other"], "Process", "Процесс"),
]);

write("layer-b-frack_pump.json", [
  id("frack_pump.fleet.id", "Frac fleet id", "ID флота ГРП"),
  q("frack_pump.pressure", "kPa", "Treating pressure", "Давление закачки"),
  q("frack_pump.rate", "m3/min", "Slurry rate", "Расход смеси"),
  q("frack_pump.proppant", "t", "Proppant pumped", "Закачано пропанта"),
  q("frack_pump.stages", "-", "Stages completed", "Завершено стадий", { encodings: ["i32"] }),
  q("frack_pump.hp", "MW", "Hydraulic power", "Гидравлическая мощность"),
  logical("frack_pump.screenout", "Screen-out risk", "Риск стоп-песка"),
  enu("frack_pump.state", ["pump", "wireline", "idle", "fault"], "Fleet state", "Состояние флота"),
]);

write("layer-b-mud_system.json", [
  id("mud_system.rig.id", "Drilling mud system id", "ID системы бурового раствора"),
  q("mud_system.density", "g/cm3", "Mud weight", "Плотность раствора"),
  q("mud_system.viscosity", "s", "Funnel viscosity", "Условная вязкость"),
  q("mud_system.flow", "L/min", "Circulation rate", "Расход циркуляции"),
  q("mud_system.pit", "m3", "Active pit volume", "Объём активной ёмкости"),
  q("mud_system.solids", "%", "Solids content", "Содержание твёрдой фазы", { range: { min: 0, max: 100 } }),
  logical("mud_system.kick", "Kick / gain detected", "Обнаружен приток"),
  enu("mud_system.type", ["wbm", "obm", "sbm", "other"], "Mud type", "Тип раствора"),
]);

write("layer-b-bop_stack.json", [
  id("bop_stack.id", "BOP stack id", "ID противовыбросового оборудования"),
  q("bop_stack.pressure", "kPa", "Accumulator pressure", "Давление аккумулятора"),
  q("bop_stack.rams", "-", "Rams closed count", "Закрытых плашек", { encodings: ["i32"] }),
  q("bop_stack.test.p", "kPa", "Last test pressure", "Давление последнего теста"),
  q("bop_stack.functions", "-", "Function tests OK", "Функциональных тестов OK", { encodings: ["i32"] }),
  q("bop_stack.shear", "kN", "Shear capability", "Способность перерезать"),
  logical("bop_stack.ready", "BOP ready", "ПВО готов"),
  enu("bop_stack.state", ["open", "tested", "closed", "fault"], "BOP state", "Состояние ПВО"),
]);

write("layer-b-wireline.json", [
  id("wireline.unit.id", "Wireline unit id", "ID геофизической станции"),
  id("wireline.job.id", "Job id", "ID работы"),
  q("wireline.depth", "m", "Measured depth", "Глубина по стволу"),
  q("wireline.tension", "kN", "Cable tension", "Натяжение кабеля"),
  q("wireline.speed", "m/min", "Logging speed", "Скорость каротажа"),
  q("wireline.voltage", "V", "Tool voltage", "Напряжение прибора"),
  logical("wireline.stuck", "Tool stuck risk", "Риск прихвата"),
  enu("wireline.state", ["log", "perforate", "idle", "fault"], "Unit state", "Состояние станции"),
]);

write("layer-b-coiled_tub.json", [
  id("coiled_tub.unit.id", "Coiled tubing unit id", "ID установки ГНКТ"),
  id("coiled_tub.job.id", "Job id", "ID работы"),
  q("coiled_tub.depth", "m", "Measured depth", "Глубина по стволу"),
  q("coiled_tub.weight", "kN", "Weight on bit / string", "Нагрузка на колонну"),
  q("coiled_tub.pressure", "kPa", "Circulating pressure", "Давление циркуляции"),
  q("coiled_tub.fatigue", "%", "Pipe fatigue life used", "Израсходованный ресурс трубы", { range: { min: 0, max: 100 } }),
  logical("coiled_tub.pooh", "POOH in progress", "Подъём идёт"),
  enu("coiled_tub.state", ["rih", "circulate", "pooh", "fault"], "Unit state", "Состояние установки"),
]);

write("layer-b-cement_oil.json", [
  id("cement_oil.job.id", "Well cementing job id", "ID цементирования скважины"),
  q("cement_oil.volume", "m3", "Slurry volume", "Объём тампонажного раствора"),
  q("cement_oil.density", "g/cm3", "Slurry density", "Плотность раствора"),
  q("cement_oil.pressure", "kPa", "Pump pressure", "Давление закачки"),
  q("cement_oil.rate", "m3/min", "Pump rate", "Расход закачки"),
  q("cement_oil.returns", "m3", "Returns volume", "Объём выхода"),
  logical("cement_oil.bump", "Plug bumped", "Пробка села"),
  enu("cement_oil.type", ["primary", "remedial", "plug", "other"], "Job type", "Тип работы"),
]);

write("layer-b-swd_well.json", [
  id("swd_well.id", "Saltwater disposal well id", "ID нагнетательной скважины ППД/утилизации"),
  q("swd_well.rate", "m3/d", "Injection rate", "Расход закачки"),
  q("swd_well.pressure", "kPa", "Wellhead injection pressure", "Устьевое давление закачки"),
  q("swd_well.tubing", "kPa", "Tubing pressure", "Давление НКТ"),
  q("swd_well.annulus", "kPa", "Annulus pressure", "Затрубное давление"),
  q("swd_well.cum", "m3", "Cumulative injected", "Накоплено закачки"),
  logical("swd_well.mia", "MIA / integrity alarm", "Тревога целостности"),
  enu("swd_well.state", ["inject", "idle", "test", "fault"], "Well state", "Состояние скважины"),
]);

write("layer-b-lact_unit.json", [
  id("lact_unit.id", "LACT unit id", "ID УУН / LACT"),
  q("lact_unit.flow", "m3/h", "Oil flow", "Расход нефти"),
  q("lact_unit.bsaw", "%", "BS&W", "Вода и механические", { range: { min: 0, max: 100 } }),
  q("lact_unit.temp", "Cel", "Oil temperature", "Температура нефти"),
  q("lact_unit.pressure", "kPa", "Line pressure", "Давление линии"),
  q("lact_unit.ticket", "m3", "Ticket volume today", "Объём по актам за сутки"),
  logical("lact_unit.prove", "Meter prove due", "Поверка счётчика"),
  enu("lact_unit.state", ["run", "prove", "idle", "fault"], "LACT state", "Состояние УУН"),
]);

console.log("Layer B30 seeds written");
