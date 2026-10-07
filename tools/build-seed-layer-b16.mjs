#!/usr/bin/env node
/**
 * Layer B16 — continue world-domain coverage.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B16", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-longwall.json", [
  id("longwall.face.id", "Longwall face id", "ID лавы"),
  q("longwall.shearer.pos", "m", "Shearer position", "Позиция комбайна"),
  q("longwall.advance", "m/d", "Face advance", "Подвигание забоя"),
  q("longwall.support.pressure", "MPa", "Support pressure", "Давление крепи"),
  q("longwall.methane", "ppm", "Face methane", "Метан на забое"),
  q("longwall.production", "t/h", "Coal production", "Добыча угля"),
  logical("longwall.gas.alarm", "Gas alarm", "Газовая тревога"),
  enu("longwall.state", ["cut", "flit", "support", "idle", "evacuate", "fault"], "Face state", "Состояние лавы"),
]);

write("layer-b-dragline.json", [
  id("dragline.id", "Dragline id", "ID драглайна"),
  q("dragline.bucket", "m3", "Bucket volume", "Объём ковша"),
  q("dragline.cycle.s", "s", "Cycle time", "Время цикла"),
  q("dragline.swing", "deg", "Swing angle", "Угол поворота"),
  q("dragline.power", "W", "Motor power", "Мощность привода"),
  q("dragline.output", "m3/h", "Material moved", "Перемещённый объём"),
  logical("dragline.rope.warn", "Rope wear warn", "Износ каната"),
  enu("dragline.state", ["dig", "swing", "dump", "idle", "maintain", "fault"], "Dragline state", "Состояние драглайна"),
]);

write("layer-b-bucketwheel.json", [
  id("bucketwheel.id", "Bucket-wheel excavator id", "ID роторного экскаватора"),
  q("bucketwheel.rpm", "rpm", "Wheel RPM", "Обороты ротора"),
  q("bucketwheel.cut.depth", "m", "Cut depth", "Глубина резания"),
  q("bucketwheel.output", "m3/h", "Digging rate", "Производительность"),
  q("bucketwheel.belt.speed", "m/s", "Discharge belt", "Скорость ленты"),
  q("bucketwheel.power", "W", "Drive power", "Мощность привода"),
  logical("bucketwheel.jam", "Wheel jam", "Заклинивание ротора"),
  enu("bucketwheel.state", ["dig", "reposition", "idle", "maintain", "fault"], "BWE state", "Состояние РЭ"),
]);

write("layer-b-stacker.json", [
  id("stacker.id", "Stacker id", "ID штабелеукладчика"),
  id("stacker.stockpile.id", "Stockpile id", "ID штабеля"),
  q("stacker.boom.angle", "deg", "Boom angle", "Угол стрелы"),
  q("stacker.luff", "deg", "Luff angle", "Угол подъёма"),
  q("stacker.rate", "t/h", "Stacking rate", "Скорость укладки"),
  q("stacker.travel", "m", "Travel position", "Позиция хода"),
  logical("stacker.collision", "Collision risk", "Риск столкновения"),
  enu("stacker.mode", ["stack", "reclaim_assist", "idle", "park", "fault"], "Mode", "Режим"),
]);

write("layer-b-reclaimer.json", [
  id("reclaimer.id", "Reclaimer id", "ID реклаймера"),
  id("reclaimer.stockpile.id", "Reclaim stockpile id", "ID штабеля забора"),
  q("reclaimer.rate", "t/h", "Reclaim rate", "Скорость забора"),
  q("reclaimer.boom.angle", "deg", "Boom angle", "Угол стрелы"),
  q("reclaimer.bucket.rpm", "rpm", "Bucket-wheel RPM", "Обороты ротора"),
  q("reclaimer.blend", "%", "Blend setpoint", "Уставка шихтовки", { range: { min: 0, max: 100 } }),
  logical("reclaimer.empty", "Stockpile empty", "Штабель пуст"),
  enu("reclaimer.type", ["bucketwheel", "scraper", "portal", "other"], "Type", "Тип"),
]);

write("layer-b-shiploader.json", [
  id("shiploader.id", "Shiploader id", "ID судопогрузочной машины"),
  id("shiploader.berth.id", "Berth id", "ID причала"),
  q("shiploader.rate", "t/h", "Loading rate", "Скорость погрузки"),
  q("shiploader.boom.outreach", "m", "Boom outreach", "Вылет стрелы"),
  q("shiploader.chute.height", "m", "Chute height", "Высота течки"),
  q("shiploader.dust", "ug/m3", "Dust level", "Пыль"),
  logical("shiploader.trim", "Trim required", "Нужна дифферентовка"),
  enu("shiploader.state", ["load", "shift", "idle", "weather", "fault"], "State", "Состояние"),
]);

write("layer-b-trainloader.json", [
  id("trainloader.id", "Train loader id", "ID вагонопогрузчика"),
  id("trainloader.consist.id", "Train consist id", "ID состава"),
  q("trainloader.rate", "t/h", "Load rate", "Скорость погрузки"),
  q("trainloader.car.mass", "t", "Car mass", "Масса вагона"),
  q("trainloader.cars", "-", "Cars loaded", "Загружено вагонов", { encodings: ["i32"] }),
  q("trainloader.silo.level", "%", "Silo level", "Уровень силоса", { range: { min: 0, max: 100 } }),
  logical("trainloader.overfill", "Overfill", "Перегруз"),
  enu("trainloader.state", ["spot", "load", "move", "idle", "fault"], "State", "Состояние"),
]);

write("layer-b-belt_scale.json", [
  id("belt_scale.id", "Belt scale id", "ID ленточных весов"),
  id("belt_scale.conveyor.id", "Conveyor id", "ID конвейера"),
  q("belt_scale.rate", "t/h", "Instant rate", "Мгновенный расход"),
  q("belt_scale.total", "t", "Totalized mass", "Накопленная масса"),
  q("belt_scale.speed", "m/s", "Belt speed", "Скорость ленты"),
  q("belt_scale.load", "kg/m", "Belt loading", "Нагрузка ленты"),
  logical("belt_scale.cal.due", "Calibration due", "Нужна поверка"),
  enu("belt_scale.quality", ["good", "suspect", "fault", "offline"], "Data quality", "Качество данных"),
]);

write("layer-b-tailings.json", [
  id("tailings.dam.id", "Tailings dam id", "ID хвостохранилища"),
  q("tailings.level", "m", "Pond level", "Уровень пруда"),
  q("tailings.freeboard", "m", "Freeboard", "Запас борта"),
  q("tailings.seepage", "L/min", "Seepage rate", "Фильтрация"),
  q("tailings.piezo", "kPa", "Piezometer", "Пьезометр"),
  q("tailings.turbidity", "NTU", "Discharge turbidity", "Мутность сброса"),
  logical("tailings.alarm", "Dam alarm", "Тревога дамбы"),
  enu("tailings.state", ["normal", "high", "critical", "offline"], "Dam state", "Состояние дамбы"),
]);

write("layer-b-heap_leach.json", [
  id("heap_leach.pad.id", "Heap leach pad id", "ID кучного выщелачивания"),
  q("heap_leach.irrigate", "L/m2/h", "Irrigation rate", "Орошение"),
  q("heap_leach.pls.grade", "g/L", "PLS grade", "Содержание в ПР"),
  q("heap_leach.ph", "-", "Solution pH", "pH раствора"),
  q("heap_leach.pond.level", "%", "Pond level", "Уровень пруда", { range: { min: 0, max: 100 } }),
  q("heap_leach.recovery", "%", "Estimated recovery", "Оценка извлечения", { range: { min: 0, max: 100 } }),
  logical("heap_leach.liner.leak", "Liner leak", "Утечка через мембрану"),
  enu("heap_leach.metal", ["au", "cu", "u", "ni", "other"], "Metal", "Металл"),
]);

write("layer-b-paste_fill.json", [
  id("paste_fill.plant.id", "Paste fill plant id", "ID завода закладочной пасты"),
  q("paste_fill.slump", "mm", "Paste slump", "Осадка конуса"),
  q("paste_fill.solids", "%", "Solids content", "Содержание твёрдого", { range: { min: 0, max: 100 } }),
  q("paste_fill.flow", "m3/h", "Pump rate", "Производительность насоса"),
  q("paste_fill.pressure", "kPa", "Line pressure", "Давление в линии"),
  q("paste_fill.binder", "%", "Binder dosage", "Доза вяжущего", { range: { min: 0, max: 100 } }),
  logical("paste_fill.plug", "Line plugged", "Засор линии"),
  enu("paste_fill.state", ["mix", "pump", "flush", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-pickling.json", [
  id("pickling.line.id", "Pickling line id", "ID линии травления"),
  id("pickling.coil.id", "Coil id", "ID рулона"),
  q("pickling.acid", "%", "Acid concentration", "Концентрация кислоты", { range: { min: 0, max: 100 } }),
  q("pickling.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("pickling.speed", "m/min", "Line speed", "Скорость линии"),
  q("pickling.iron", "g/L", "Dissolved iron", "Растворённое железо"),
  logical("pickling.overetch", "Over-etch", "Перетрав"),
  enu("pickling.acid_type", ["hcl", "h2so4", "mixed", "other"], "Acid", "Кислота"),
]);

write("layer-b-anneal_line.json", [
  id("anneal_line.id", "Annealing line id", "ID линии отжига"),
  id("anneal_line.coil.id", "Annealed coil id", "ID отожжённого рулона"),
  q("anneal_line.furnace.temp", "Cel", "Furnace temperature", "Температура печи"),
  q("anneal_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("anneal_line.h2", "%", "H2 in atmosphere", "H2 в атмосфере", { range: { min: 0, max: 100 } }),
  q("anneal_line.hardness", "HV", "Exit hardness", "Твёрдость на выходе"),
  logical("anneal_line.buckle", "Strip buckle", "Коробление полосы"),
  enu("anneal_line.process", ["cal", "batch", "galv_anneal", "other"], "Process", "Процесс"),
]);

write("layer-b-temper_mill.json", [
  id("temper_mill.id", "Temper mill id", "ID дрессировочного стана"),
  id("temper_mill.coil.id", "Tempered coil id", "ID дрессированного рулона"),
  q("temper_mill.elongation", "%", "Elongation", "Удлинение", { range: { min: 0, max: 100 } }),
  q("temper_mill.force", "kN", "Roll force", "Усилие валков"),
  q("temper_mill.speed", "m/min", "Mill speed", "Скорость стана"),
  q("temper_mill.roughness", "um", "Surface roughness", "Шероховатость"),
  logical("temper_mill.flatness.ok", "Flatness OK", "Плоскостность OK"),
  enu("temper_mill.mode", ["dry", "wet", "skinpass", "other"], "Mode", "Режим"),
]);

write("layer-b-tinplate.json", [
  id("tinplate.line.id", "Tinplate line id", "ID линии жести"),
  id("tinplate.coil.id", "Tinplate coil id", "ID рулона жести"),
  q("tinplate.coating", "g/m2", "Tin coating mass", "Масса оловянного покрытия"),
  q("tinplate.current", "A", "Plating current", "Ток покрытия"),
  q("tinplate.speed", "m/min", "Line speed", "Скорость линии"),
  q("tinplate.thickness", "mm", "Strip thickness", "Толщина полосы"),
  logical("tinplate.pinhole", "Pinhole detected", "Обнаружена пористость"),
  enu("tinplate.finish", ["bright", "matte", "stone", "other"], "Finish", "Отделка"),
]);

write("layer-b-color_coat.json", [
  id("color_coat.line.id", "Color coating line id", "ID линии цветного покрытия"),
  id("color_coat.coil.id", "Coated coil id", "ID окрашенного рулона"),
  q("color_coat.dft", "um", "Dry film thickness", "Толщина сухой плёнки"),
  q("color_coat.oven.temp", "Cel", "Curing oven temperature", "Температура печи сушки"),
  q("color_coat.speed", "m/min", "Line speed", "Скорость линии"),
  q("color_coat.gloss", "-", "Gloss units", "Блеск"),
  logical("color_coat.defect", "Coating defect", "Дефект покрытия"),
  enu("color_coat.system", ["pe", "pvdf", "pu", "epoxy", "other"], "Paint system", "Система покрытия"),
]);

write("layer-b-foil_mill.json", [
  id("foil_mill.id", "Foil mill id", "ID фольгопрокатного стана"),
  id("foil_mill.coil.id", "Foil coil id", "ID рулона фольги"),
  q("foil_mill.thickness", "um", "Foil thickness", "Толщина фольги"),
  q("foil_mill.speed", "m/min", "Mill speed", "Скорость стана"),
  q("foil_mill.tension", "N", "Strip tension", "Натяжение полосы"),
  q("foil_mill.oil", "mL/min", "Rolling oil", "Прокатное масло"),
  logical("foil_mill.break", "Strip break", "Обрыв полосы"),
  enu("foil_mill.pass", ["rough", "intermediate", "finish", "pack", "other"], "Pass", "Проход"),
]);

write("layer-b-tube_mill.json", [
  id("tube_mill.id", "Tube mill id", "ID трубосварочного стана"),
  id("tube_mill.heat.id", "Tube heat id", "ID партии труб"),
  q("tube_mill.od", "mm", "Outside diameter", "Наружный диаметр"),
  q("tube_mill.wt", "mm", "Wall thickness", "Толщина стенки"),
  q("tube_mill.speed", "m/min", "Mill speed", "Скорость стана"),
  q("tube_mill.weld.power", "W", "Weld power", "Мощность сварки"),
  logical("tube_mill.ndt.fail", "NDT fail", "НК не пройден"),
  enu("tube_mill.process", ["erw", "hf", "laser", "spiral", "other"], "Process", "Процесс"),
]);

write("layer-b-seamless_pipe.json", [
  id("seamless_pipe.mill.id", "Seamless mill id", "ID стана бесшовных труб"),
  id("seamless_pipe.billet.id", "Billet id", "ID гильзы"),
  q("seamless_pipe.pierce.temp", "Cel", "Piercing temperature", "Температура прошивки"),
  q("seamless_pipe.od", "mm", "Pipe OD", "Наружный диаметр"),
  q("seamless_pipe.wt", "mm", "Wall thickness", "Толщина стенки"),
  q("seamless_pipe.elongation", "%", "Elongation", "Удлинение", { range: { min: 0, max: 100 } }),
  logical("seamless_pipe.eccentric", "Eccentric wall", "Эксцентричность стенки"),
  enu("seamless_pipe.grade", ["linepipe", "octg", "boiler", "mech", "other"], "Grade family", "Семейство марок"),
]);

write("layer-b-rod_mill.json", [
  id("rod_mill.id", "Rod mill id", "ID проволочного стана"),
  id("rod_mill.billet.id", "Rod billet id", "ID заготовки"),
  q("rod_mill.exit.dia", "mm", "Exit diameter", "Диаметр на выходе"),
  q("rod_mill.speed", "m/s", "Finishing speed", "Скорость чистовой клети"),
  q("rod_mill.temp", "Cel", "Laying head temperature", "Температура виткообразователя"),
  q("rod_mill.coil.mass", "t", "Coil mass", "Масса бунта"),
  logical("rod_mill.cobble", "Cobble", "Авария проката"),
  enu("rod_mill.product", ["wire_rod", "rebar", "bar", "other"], "Product", "Продукция"),
]);

write("layer-b-anode_cast.json", [
  id("anode_cast.wheel.id", "Casting wheel id", "ID разливочного колеса"),
  id("anode_cast.heat.id", "Anode heat id", "ID плавки анодов"),
  q("anode_cast.temp", "Cel", "Casting temperature", "Температура разливки"),
  q("anode_cast.mass", "kg", "Anode mass", "Масса анода"),
  q("anode_cast.rate", "/h", "Anodes per hour", "Анодов в час"),
  q("anode_cast.cu", "%", "Copper grade", "Содержание меди", { range: { min: 0, max: 100 } }),
  logical("anode_cast.stick", "Mold stick", "Прилипание к изложнице"),
  enu("anode_cast.metal", ["cu", "ni", "pb", "other"], "Metal", "Металл"),
]);

write("layer-b-electrorefin.json", [
  id("electrorefin.tankhouse.id", "Tankhouse id", "ID электролизного цеха"),
  id("electrorefin.cell.id", "Refining cell id", "ID ванны рафинирования"),
  q("electrorefin.current", "A", "Cell current", "Ток ванны"),
  q("electrorefin.voltage", "V", "Cell voltage", "Напряжение ванны"),
  q("electrorefin.ce", "%", "Current efficiency", "Выход по току", { range: { min: 0, max: 100 } }),
  q("electrorefin.cathode", "t/d", "Cathode production", "Выпуск катодов"),
  logical("electrorefin.short", "Cell short", "Короткое замыкание"),
  enu("electrorefin.metal", ["cu", "ni", "zn", "other"], "Metal", "Металл"),
]);

write("layer-b-glass_bottle.json", [
  id("glass_bottle.line.id", "Bottle line id", "ID линии стеклотары"),
  id("glass_bottle.mold.id", "Mold id", "ID формы"),
  q("glass_bottle.gob.temp", "Cel", "Gob temperature", "Температура капли"),
  q("glass_bottle.machine.speed", "/min", "BPM", "Бутылок в минуту"),
  q("glass_bottle.anneal.temp", "Cel", "Lehr temperature", "Температура отжига"),
  q("glass_bottle.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("glass_bottle.check.fail", "Check detector fail", "Брак по контролю"),
  enu("glass_bottle.process", ["blow_blow", "press_blow", "nnpb", "other"], "Process", "Процесс"),
]);

write("layer-b-can_line.json", [
  id("can_line.id", "Can line id", "ID линии банок"),
  id("can_line.sku.id", "Can SKU id", "ID SKU банки"),
  q("can_line.speed", "/min", "Cans per minute", "Банок в минуту"),
  q("can_line.seamer.rpm", "rpm", "Seamer RPM", "Обороты закатки"),
  q("can_line.fill.mass", "g", "Fill mass", "Масса наполнения"),
  q("can_line.vacuum", "kPa", "Can vacuum", "Вакуум в банке"),
  logical("can_line.seam.fail", "Seam fail", "Брак закатки"),
  enu("can_line.type", ["two_piece", "three_piece", "aerosol", "other"], "Can type", "Тип банки"),
]);

write("layer-b-pet_preform.json", [
  id("pet_preform.machine.id", "Preform machine id", "ID машины преформ"),
  id("pet_preform.mold.id", "Preform mold id", "ID формы преформ"),
  q("pet_preform.cycle.s", "s", "Cycle time", "Время цикла"),
  q("pet_preform.iv", "-", "Intrinsic viscosity", "Характеристическая вязкость"),
  q("pet_preform.aa", "ppm", "Acetaldehyde", "Ацетальдегид"),
  q("pet_preform.weight", "g", "Preform weight", "Масса преформы"),
  logical("pet_preform.crystal", "Crystallinity high", "Высокая кристалличность"),
  enu("pet_preform.state", ["inject", "cool", "eject", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-carton_fill.json", [
  id("carton_fill.line.id", "Carton filler id", "ID линии картонной упаковки"),
  id("carton_fill.sku.id", "Carton SKU id", "ID SKU картона"),
  q("carton_fill.speed", "/h", "Packs per hour", "Упаковок в час"),
  q("carton_fill.fill.volume", "L", "Fill volume", "Объём наполнения"),
  q("carton_fill.seal.temp", "Cel", "Seal temperature", "Температура сварки"),
  q("carton_fill.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("carton_fill.aseptic.ok", "Aseptic OK", "Асептика OK"),
  enu("carton_fill.format", ["brick", "gable", "pouch", "other"], "Format", "Формат"),
]);

write("layer-b-aseptic_fill.json", [
  id("aseptic_fill.line.id", "Aseptic filler id", "ID асептического наполнителя"),
  id("aseptic_fill.sku.id", "Aseptic SKU id", "ID асептического SKU"),
  q("aseptic_fill.h2o2", "ppm", "H2O2 residual", "Остаток H2O2"),
  q("aseptic_fill.sterile.temp", "Cel", "Sterilization temperature", "Температура стерилизации"),
  q("aseptic_fill.speed", "/h", "Packs per hour", "Упаковок в час"),
  q("aseptic_fill.particle", "/L", "Particle count", "Счёт частиц"),
  logical("aseptic_fill.breach", "Sterility breach", "Нарушение стерильности"),
  enu("aseptic_fill.package", ["carton", "bottle", "bag", "cup", "other"], "Package", "Упаковка"),
]);

write("layer-b-retort_food.json", [
  id("retort_food.id", "Retort id", "ID автоклава пищевого"),
  id("retort_food.batch.id", "Retort batch id", "ID садки автоклава"),
  q("retort_food.temp", "Cel", "Retort temperature", "Температура автоклава"),
  q("retort_food.f0", "min", "F0 value", "Значение F0"),
  q("retort_food.pressure", "kPa", "Retort pressure", "Давление автоклава"),
  q("retort_food.comeup.min", "min", "Come-up time", "Время выхода на режим"),
  logical("retort_food.cold.spot", "Cold spot alarm", "Тревога холодной точки"),
  enu("retort_food.process", ["steam", "water_immersion", "water_spray", "other"], "Process", "Процесс"),
]);

write("layer-b-snack_extrude.json", [
  id("snack_extrude.id", "Snack extruder id", "ID экструдера снеков"),
  id("snack_extrude.sku.id", "Snack SKU id", "ID SKU снеков"),
  q("snack_extrude.barrel.temp", "Cel", "Barrel temperature", "Температура цилиндра"),
  q("snack_extrude.screw.rpm", "rpm", "Screw RPM", "Обороты шнека"),
  q("snack_extrude.moisture", "%", "Die moisture", "Влажность у фильеры", { range: { min: 0, max: 100 } }),
  q("snack_extrude.throughput", "kg/h", "Throughput", "Производительность"),
  logical("snack_extrude.surge", "Motor surge", "Перегруз привода"),
  enu("snack_extrude.die", ["direct", "pellet", "coex", "other"], "Die type", "Тип фильеры"),
]);

write("layer-b-noodle_line.json", [
  id("noodle_line.id", "Noodle line id", "ID линии лапши"),
  id("noodle_line.sku.id", "Noodle SKU id", "ID SKU лапши"),
  q("noodle_line.dough.moist", "%", "Dough moisture", "Влажность теста", { range: { min: 0, max: 100 } }),
  q("noodle_line.sheet.thick", "mm", "Sheet thickness", "Толщина пласта"),
  q("noodle_line.steam.temp", "Cel", "Steam temperature", "Температура пропарки"),
  q("noodle_line.fry.temp", "Cel", "Fryer temperature", "Температура фритюра"),
  logical("noodle_line.break", "Sheet break", "Обрыв пласта"),
  enu("noodle_line.type", ["instant", "fresh", "dried", "other"], "Type", "Тип"),
]);

write("layer-b-malt_house.json", [
  id("malt_house.id", "Malthouse id", "ID солодовни"),
  id("malt_house.batch.id", "Malt batch id", "ID партии солода"),
  q("malt_house.steep.moist", "%", "Steep moisture", "Влажность замачивания", { range: { min: 0, max: 100 } }),
  q("malt_house.germ.temp", "Cel", "Germination temperature", "Температура проращивания"),
  q("malt_house.kiln.temp", "Cel", "Kiln temperature", "Температура сушки"),
  q("malt_house.moisture", "%", "Malt moisture", "Влажность солода", { range: { min: 0, max: 100 } }),
  logical("malt_house.mold", "Mold risk", "Риск плесени"),
  enu("malt_house.stage", ["steep", "germinate", "kiln", "store", "fault"], "Stage", "Стадия"),
]);

write("layer-b-glass_recycle.json", [
  id("glass_recycle.plant.id", "Cullet plant id", "ID завода стеклобоя"),
  q("glass_recycle.throughput", "t/h", "Cullet throughput", "Переработка боя"),
  q("glass_recycle.contaminant", "%", "Contamination", "Загрязнение", { range: { min: 0, max: 100 } }),
  q("glass_recycle.ceramic", "ppm", "CSP content", "Содержание CSP"),
  q("glass_recycle.color.sort", "%", "Color sort accuracy", "Точность сортировки по цвету", { range: { min: 0, max: 100 } }),
  q("glass_recycle.moisture", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  logical("glass_recycle.magnet.ok", "Magnet OK", "Магнит OK"),
  enu("glass_recycle.color", ["flint", "amber", "green", "mixed", "other"], "Color stream", "Цветовой поток"),
]);

write("layer-b-tire_recycle.json", [
  id("tire_recycle.plant.id", "Tire recycle plant id", "ID завода переработки шин"),
  q("tire_recycle.feed", "t/h", "Tire feed", "Подача шин"),
  q("tire_recycle.crumb.size", "mm", "Crumb size", "Размер крошки"),
  q("tire_recycle.steel", "t/h", "Steel recovery", "Извлечение стали"),
  q("tire_recycle.fiber", "t/h", "Fiber recovery", "Извлечение корда"),
  q("tire_recycle.crumb.out", "t/h", "Crumb output", "Выпуск крошки"),
  logical("tire_recycle.fire", "Fire risk", "Риск возгорания"),
  enu("tire_recycle.process", ["shred", "grind", "devulcanize", "pyrolysis", "other"], "Process", "Процесс"),
]);

write("layer-b-textile_recycle.json", [
  id("textile_recycle.line.id", "Textile recycle line id", "ID линии текстильного рециклинга"),
  q("textile_recycle.feed", "t/h", "Feed rate", "Подача"),
  q("textile_recycle.sort.acc", "%", "Sort accuracy", "Точность сортировки", { range: { min: 0, max: 100 } }),
  q("textile_recycle.fiber.yield", "%", "Fiber yield", "Выход волокна", { range: { min: 0, max: 100 } }),
  q("textile_recycle.contaminant", "%", "Contamination", "Загрязнение", { range: { min: 0, max: 100 } }),
  q("textile_recycle.bale.mass", "kg", "Bale mass", "Масса кипы"),
  logical("textile_recycle.metal", "Metal detected", "Обнаружен металл"),
  enu("textile_recycle.stream", ["cotton", "polyester", "mixed", "wool", "other"], "Stream", "Поток"),
]);

write("layer-b-scrap_yard.json", [
  id("scrap_yard.id", "Scrap yard id", "ID металлолома"),
  id("scrap_yard.pile.id", "Scrap pile id", "ID штабеля лома"),
  q("scrap_yard.receipt", "t/d", "Receipts", "Приёмка"),
  q("scrap_yard.density", "kg/m3", "Pile density", "Плотность штабеля"),
  q("scrap_yard.radiation", "uSv/h", "Radiation", "Радиация"),
  q("scrap_yard.moisture", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  logical("scrap_yard.hot", "Hot scrap", "Горячий лом"),
  enu("scrap_yard.grade", ["hms", "busheling", "shred", "cast", "other"], "Grade", "Сорт"),
]);

write("layer-b-slag_plant.json", [
  id("slag_plant.id", "Slag plant id", "ID шлакопереработки"),
  q("slag_plant.feed", "t/h", "Slag feed", "Подача шлака"),
  q("slag_plant.metal.rec", "%", "Metal recovery", "Извлечение металла", { range: { min: 0, max: 100 } }),
  q("slag_plant.crush.size", "mm", "Product size", "Размер продукта"),
  q("slag_plant.temp", "Cel", "Slag temperature", "Температура шлака"),
  q("slag_plant.dust", "ug/m3", "Dust", "Пыль"),
  logical("slag_plant.explosion", "Steam explosion risk", "Риск воздушноводяного взрыва"),
  enu("slag_plant.source", ["bf", "bof", "eaf", "nonferrous", "other"], "Source", "Источник"),
]);

write("layer-b-fly_ash.json", [
  id("fly_ash.silo.id", "Fly ash silo id", "ID силоса золы-уноса"),
  q("fly_ash.level", "%", "Silo level", "Уровень силоса", { range: { min: 0, max: 100 } }),
  q("fly_ash.loi", "%", "Loss on ignition", "Потери при прокаливании", { range: { min: 0, max: 100 } }),
  q("fly_ash.fineness", "%", "Fineness retained", "Остаток на сите", { range: { min: 0, max: 100 } }),
  q("fly_ash.dispatch", "t/d", "Dispatch rate", "Отгрузка"),
  q("fly_ash.moisture", "%", "Moisture", "Влажность", { range: { min: 0, max: 100 } }),
  logical("fly_ash.bridged", "Silo bridged", "Свод в силосе"),
  enu("fly_ash.class", ["f", "c", "bottom", "other"], "Ash class", "Класс золы"),
]);

write("layer-b-biomass_pellet.json", [
  id("biomass_pellet.mill.id", "Pellet mill id", "ID пеллетного завода"),
  q("biomass_pellet.moisture", "%", "Feed moisture", "Влажность сырья", { range: { min: 0, max: 100 } }),
  q("biomass_pellet.die.temp", "Cel", "Die temperature", "Температура матрицы"),
  q("biomass_pellet.durability", "%", "Pellet durability", "Прочность пеллет", { range: { min: 0, max: 100 } }),
  q("biomass_pellet.throughput", "t/h", "Pellet rate", "Производительность"),
  q("biomass_pellet.fines", "%", "Fines", "Мелочь", { range: { min: 0, max: 100 } }),
  logical("biomass_pellet.fire", "Fire risk", "Риск возгорания"),
  enu("biomass_pellet.feedstock", ["wood", "agri", "torrefied", "mixed", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-wood_chip.json", [
  id("wood_chip.plant.id", "Chip plant id", "ID щеподробильного завода"),
  q("wood_chip.size", "mm", "Chip size", "Размер щепы"),
  q("wood_chip.moisture", "%", "Chip moisture", "Влажность щепы", { range: { min: 0, max: 100 } }),
  q("wood_chip.bark", "%", "Bark content", "Содержание коры", { range: { min: 0, max: 100 } }),
  q("wood_chip.throughput", "t/h", "Chip rate", "Производительность"),
  q("wood_chip.knife.wear", "%", "Knife wear", "Износ ножей", { range: { min: 0, max: 100 } }),
  logical("wood_chip.metal", "Metal in feed", "Металл в сырье"),
  enu("wood_chip.species", ["softwood", "hardwood", "mixed", "other"], "Species", "Порода"),
]);

write("layer-b-gasifier.json", [
  id("gasifier.id", "Gasifier id", "ID газификатора"),
  q("gasifier.temp", "Cel", "Bed temperature", "Температура слоя"),
  q("gasifier.pressure", "kPa", "Gasifier pressure", "Давление газификатора"),
  q("gasifier.syngas.co", "%", "Syngas CO", "CO в синтез-газе", { range: { min: 0, max: 100 } }),
  q("gasifier.syngas.h2", "%", "Syngas H2", "H2 в синтез-газе", { range: { min: 0, max: 100 } }),
  q("gasifier.feed", "t/h", "Feedstock rate", "Подача сырья"),
  logical("gasifier.slag.tap", "Slag tap ready", "Готовность шлакового выпуска"),
  enu("gasifier.type", ["fixed", "fluid", "entrained", "plasma", "other"], "Type", "Тип"),
]);

write("layer-b-pyrolysis.json", [
  id("pyrolysis.reactor.id", "Pyrolysis reactor id", "ID реактора пиролиза"),
  q("pyrolysis.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("pyrolysis.oil.yield", "%", "Oil yield", "Выход масла", { range: { min: 0, max: 100 } }),
  q("pyrolysis.char.yield", "%", "Char yield", "Выход угля", { range: { min: 0, max: 100 } }),
  q("pyrolysis.gas.flow", "m3/h", "Gas flow", "Расход газа"),
  q("pyrolysis.residence.s", "s", "Residence time", "Время пребывания"),
  logical("pyrolysis.condenser.ok", "Condenser OK", "Конденсатор OK"),
  enu("pyrolysis.feedstock", ["plastic", "tire", "biomass", "msw", "other"], "Feedstock", "Сырьё"),
]);

write("layer-b-torrefaction.json", [
  id("torrefaction.reactor.id", "Torrefaction reactor id", "ID реактора торрефикации"),
  q("torrefaction.temp", "Cel", "Reactor temperature", "Температура реактора"),
  q("torrefaction.residence.min", "min", "Residence time", "Время пребывания"),
  q("torrefaction.mass.yield", "%", "Mass yield", "Выход по массе", { range: { min: 0, max: 100 } }),
  q("torrefaction.energy.yield", "%", "Energy yield", "Выход по энергии", { range: { min: 0, max: 100 } }),
  q("torrefaction.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  logical("torrefaction.exotherm", "Exotherm", "Экзотермия"),
  enu("torrefaction.state", ["dry", "torrefy", "cool", "idle", "fault"], "State", "Состояние"),
]);

write("layer-b-landfill_leach.json", [
  id("landfill_leach.cell.id", "Landfill cell id", "ID карты полигона"),
  q("landfill_leach.level", "m", "Leachate level", "Уровень фильтрата"),
  q("landfill_leach.flow", "L/h", "Leachate flow", "Расход фильтрата"),
  q("landfill_leach.cod", "mg/L", "COD", "ХПК"),
  q("landfill_leach.nh3", "mg/L", "Ammonia", "Аммиак"),
  q("landfill_leach.ph", "-", "pH", "pH"),
  logical("landfill_leach.overflow", "Overflow risk", "Риск перелива"),
  enu("landfill_leach.state", ["collect", "treat", "recirc", "offline", "fault"], "System state", "Состояние системы"),
]);

write("layer-b-ash_pond.json", [
  id("ash_pond.id", "Ash pond id", "ID золоотвала"),
  q("ash_pond.level", "m", "Pond level", "Уровень пруда"),
  q("ash_pond.freeboard", "m", "Freeboard", "Запас борта"),
  q("ash_pond.ph", "-", "Pond pH", "pH пруда"),
  q("ash_pond.seepage", "L/min", "Seepage", "Фильтрация"),
  q("ash_pond.turbidity", "NTU", "Discharge turbidity", "Мутность сброса"),
  logical("ash_pond.alarm", "Dam alarm", "Тревога дамбы"),
  enu("ash_pond.state", ["normal", "high", "critical", "closed"], "Pond state", "Состояние пруда"),
]);

write("layer-b-assay_lab.json", [
  id("assay_lab.id", "Assay lab id", "ID пробирной лаборатории"),
  id("assay_lab.sample.id", "Sample id", "ID пробы"),
  q("assay_lab.turnaround.h", "h", "Turnaround time", "Срок анализа"),
  q("assay_lab.queue", "-", "Samples in queue", "Проб в очереди", { encodings: ["i32"] }),
  q("assay_lab.grade", "g/t", "Reported grade", "Заявленное содержание"),
  q("assay_lab.moisture", "%", "Sample moisture", "Влажность пробы", { range: { min: 0, max: 100 } }),
  logical("assay_lab.rush", "Rush sample", "Срочная проба"),
  enu("assay_lab.method", ["fire", "aas", "icp", "xrf", "other"], "Method", "Метод"),
]);

write("layer-b-sampler_plant.json", [
  id("sampler_plant.id", "Sampling plant id", "ID пробоотборной станции"),
  id("sampler_plant.lot.id", "Sampled lot id", "ID опробуемой партии"),
  q("sampler_plant.cut", "%", "Cut percentage", "Доля отсечения", { range: { min: 0, max: 100 } }),
  q("sampler_plant.increment", "-", "Increments taken", "Число порций", { encodings: ["i32"] }),
  q("sampler_plant.mass", "kg", "Sample mass", "Масса пробы"),
  q("sampler_plant.bias", "%", "Bias estimate", "Оценка смещения", { range: { min: 0, max: 100 } }),
  logical("sampler_plant.jam", "Cutter jam", "Застревание отсекателя"),
  enu("sampler_plant.type", ["cross_belt", "falling_stream", "auger", "manual", "other"], "Type", "Тип"),
]);

write("layer-b-acid_plant.json", [
  id("acid_plant.id", "Acid plant id", "ID кислотного цеха металлургии"),
  q("acid_plant.so2.in", "%", "Inlet SO2", "SO2 на входе", { range: { min: 0, max: 100 } }),
  q("acid_plant.conversion", "%", "Conversion", "Конверсия", { range: { min: 0, max: 100 } }),
  q("acid_plant.prod", "t/d", "Acid production", "Выпуск кислоты"),
  q("acid_plant.mist", "mg/m3", "Acid mist", "Туман кислоты"),
  q("acid_plant.catalyst.temp", "Cel", "Catalyst temperature", "Температура катализатора"),
  logical("acid_plant.bypass", "Gas bypass", "Байпас газа"),
  enu("acid_plant.source", ["smelter", "roaster", "sulfur", "other"], "Gas source", "Источник газа"),
]);

write("layer-b-smelter_gas.json", [
  id("smelter_gas.train.id", "Gas cleaning train id", "ID газоочистки"),
  q("smelter_gas.so2", "ppm", "Stack SO2", "SO2 в трубе"),
  q("smelter_gas.dust", "mg/m3", "Stack dust", "Пыль в трубе"),
  q("smelter_gas.temp", "Cel", "Gas temperature", "Температура газа"),
  q("smelter_gas.flow", "m3/h", "Gas flow", "Расход газа"),
  q("smelter_gas.fan.power", "W", "Fan power", "Мощность вентилятора"),
  logical("smelter_gas.opacity.high", "Opacity high", "Высокая дымность"),
  enu("smelter_gas.state", ["normal", "upset", "bypass", "offline", "fault"], "Train state", "Состояние линии"),
]);

write("layer-b-cooperage.json", [
  id("cooperage.id", "Cooperage id", "ID бондарни"),
  id("cooperage.barrel.id", "Barrel id", "ID бочки"),
  q("cooperage.toast.temp", "Cel", "Toast temperature", "Температура обжига"),
  q("cooperage.toast.min", "min", "Toast time", "Время обжига"),
  q("cooperage.stave.moist", "%", "Stave moisture", "Влажность клёпки", { range: { min: 0, max: 100 } }),
  q("cooperage.capacity", "L", "Barrel volume", "Объём бочки"),
  logical("cooperage.leak", "Barrel leak", "Течь бочки"),
  enu("cooperage.toast", ["light", "medium", "medium_plus", "heavy", "other"], "Toast level", "Степень обжига"),
]);

write("layer-b-cork_plant.json", [
  id("cork_plant.id", "Cork plant id", "ID пробкового завода"),
  q("cork_plant.boil.temp", "Cel", "Boil temperature", "Температура варки"),
  q("cork_plant.moisture", "%", "Cork moisture", "Влажность пробки", { range: { min: 0, max: 100 } }),
  q("cork_plant.tca", "ug/L", "TCA level", "Уровень TCA"),
  q("cork_plant.density", "g/cm3", "Cork density", "Плотность пробки"),
  q("cork_plant.throughput", "/h", "Closures per hour", "Укупорочных средств в час"),
  logical("cork_plant.reject", "Visual reject", "Визуальный брак"),
  enu("cork_plant.product", ["natural", "colmated", "agglomerated", "technical", "other"], "Product", "Продукт"),
]);

write("layer-b-soy_sauce.json", [
  id("soy_sauce.ferment.id", "Soy sauce fermenter id", "ID ферментёра соевого соуса"),
  id("soy_sauce.batch.id", "Brew batch id", "ID партии затора"),
  q("soy_sauce.moromi.temp", "Cel", "Moromi temperature", "Температура мороми"),
  q("soy_sauce.salt", "%", "Salt content", "Содержание соли", { range: { min: 0, max: 100 } }),
  q("soy_sauce.tn", "%", "Total nitrogen", "Общий азот", { range: { min: 0, max: 100 } }),
  q("soy_sauce.age.d", "d", "Age days", "Дней выдержки"),
  logical("soy_sauce.ready", "Press ready", "Готово к прессованию"),
  enu("soy_sauce.style", ["koikuchi", "usukuchi", "tamari", "shoyu", "other"], "Style", "Стиль"),
]);

write("layer-b-tofu_line.json", [
  id("tofu_line.id", "Tofu line id", "ID линии тофу"),
  id("tofu_line.sku.id", "Tofu SKU id", "ID SKU тофу"),
  q("tofu_line.soymilk.brix", "-", "Soymilk Brix", "Brix соевого молока"),
  q("tofu_line.coagulant", "g/L", "Coagulant dose", "Доза коагулянта"),
  q("tofu_line.press.kpa", "kPa", "Press pressure", "Давление пресса"),
  q("tofu_line.yield", "%", "Yield", "Выход", { range: { min: 0, max: 100 } }),
  logical("tofu_line.texture.ok", "Texture OK", "Текстура OK"),
  enu("tofu_line.type", ["silken", "firm", "fried", "other"], "Type", "Тип"),
]);

write("layer-b-raisebore.json", [
  id("raisebore.machine.id", "Raisebore machine id", "ID машины восстающего бурения"),
  id("raisebore.hole.id", "Raise hole id", "ID восстающей скважины"),
  q("raisebore.depth", "m", "Hole depth", "Глубина скважины"),
  q("raisebore.torque", "N.m", "Drill torque", "Крутящий момент"),
  q("raisebore.thrust", "kN", "Thrust", "Осевое усилие"),
  q("raisebore.rpm", "rpm", "Rotation speed", "Обороты"),
  logical("raisebore.stuck", "Stuck pipe", "Прихват инструмента"),
  enu("raisebore.phase", ["pilot", "ream", "complete", "idle", "fault"], "Phase", "Фаза"),
]);

write("layer-b-shuttle_car.json", [
  id("shuttle_car.id", "Shuttle car id", "ID самоходного вагона"),
  q("shuttle_car.load", "t", "Payload", "Груз"),
  q("shuttle_car.speed", "m/s", "Travel speed", "Скорость"),
  q("shuttle_car.cable.out", "m", "Cable out", "Вытравлено кабеля"),
  q("shuttle_car.battery.soc", "%", "Battery SOC", "SOC батареи", { range: { min: 0, max: 100 } }),
  q("shuttle_car.cycles", "-", "Trips today", "Рейсов за сутки", { encodings: ["i32"] }),
  logical("shuttle_car.cable.damage", "Cable damage", "Повреждение кабеля"),
  enu("shuttle_car.state", ["load", "haul", "dump", "charge", "idle", "fault"], "State", "Состояние"),
]);

write("layer-b-coil_slit.json", [
  id("coil_slit.line.id", "Slitting line id", "ID линии продольной резки"),
  id("coil_slit.coil.id", "Parent coil id", "ID исходного рулона"),
  q("coil_slit.speed", "m/min", "Line speed", "Скорость линии"),
  q("coil_slit.width", "mm", "Strip width", "Ширина полосы"),
  q("coil_slit.burr", "um", "Burr height", "Высота заусенца"),
  q("coil_slit.tension", "N", "Strip tension", "Натяжение"),
  logical("coil_slit.camber", "Camber alarm", "Серповидность"),
  enu("coil_slit.state", ["thread", "run", "recoil", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-billet_caster.json", [
  id("billet_caster.id", "Billet caster id", "ID МНЛЗ заготовки"),
  id("billet_caster.heat.id", "Cast heat id", "ID разливаемой плавки"),
  q("billet_caster.speed", "m/min", "Casting speed", "Скорость разливки"),
  q("billet_caster.superheat", "K", "Superheat", "Перегрев"),
  q("billet_caster.section", "mm", "Section size", "Сечение"),
  q("billet_caster.cut.length", "m", "Cut length", "Длина реза"),
  logical("billet_caster.breakout", "Breakout", "Прорыв"),
  enu("billet_caster.state", ["prep", "start", "steady", "slow", "stop", "fault"], "Caster state", "Состояние МНЛЗ"),
]);

write("layer-b-can_stock.json", [
  id("can_stock.line.id", "Can stock line id", "ID линии жести для банок"),
  id("can_stock.coil.id", "Can stock coil id", "ID рулона can-stock"),
  q("can_stock.thickness", "mm", "Gauge", "Толщина"),
  q("can_stock.ear", "%", "Earing", "Ушки", { range: { min: 0, max: 100 } }),
  q("can_stock.uts", "MPa", "UTS", "Предел прочности"),
  q("can_stock.oil", "g/m2", "Surface oil", "Масло на поверхности"),
  logical("can_stock.pinhole", "Pinhole", "Пористость"),
  enu("can_stock.alloy", ["3104", "5182", "3003", "other"], "Alloy", "Сплав"),
]);

console.log("Layer B16 seeds written");
