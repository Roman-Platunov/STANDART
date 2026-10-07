#!/usr/bin/env node
/**
 * Layer B29 — pulp/paper, film/packaging, textiles, rubber/tires.
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
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B29", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-pulp_digester.json", [
  id("pulp_digester.id", "Pulp digester id", "ID варочного котла"),
  q("pulp_digester.temp", "Cel", "Cooking temperature", "Температура варки"),
  q("pulp_digester.pressure", "kPa", "Vessel pressure", "Давление котла"),
  q("pulp_digester.kappa", "-", "Kappa number", "Число Каппа"),
  q("pulp_digester.yield", "%", "Pulp yield", "Выход целлюлозы", { range: { min: 0, max: 100 } }),
  q("pulp_digester.charge", "t", "Chip charge", "Загрузка щепы"),
  logical("pulp_digester.blow", "Blow valve open", "Клапан сдувки открыт"),
  enu("pulp_digester.process", ["kraft", "sulfite", "nssc", "other"], "Process", "Процесс"),
]);

write("layer-b-paper_machine.json", [
  id("paper_machine.id", "Paper machine id", "ID бумагоделательной машины"),
  q("paper_machine.speed", "m/min", "Machine speed", "Скорость машины"),
  q("paper_machine.basis", "g/m2", "Basis weight", "Масса 1 м²"),
  q("paper_machine.moisture", "%", "Reel moisture", "Влажность на накате", { range: { min: 0, max: 100 } }),
  q("paper_machine.width", "mm", "Trimmed width", "Ширина обрезки"),
  q("paper_machine.production", "t/h", "Production rate", "Производительность"),
  logical("paper_machine.break", "Web break", "Обрыв полотна"),
  enu("paper_machine.grade", ["fine", "board", "news", "specialty", "other"], "Grade", "Сорт"),
]);

write("layer-b-paper_press.json", [
  id("paper_press.id", "Paper press section id", "ID прессовой части"),
  q("paper_press.nip", "kN/m", "Nip load", "Линейное давление"),
  q("paper_press.moisture.in", "%", "Inlet moisture", "Влажность на входе", { range: { min: 0, max: 100 } }),
  q("paper_press.moisture.out", "%", "Outlet moisture", "Влажность на выходе", { range: { min: 0, max: 100 } }),
  q("paper_press.felt.vac", "kPa", "Felt vacuum", "Вакуум сукна"),
  q("paper_press.speed", "m/min", "Press speed", "Скорость пресса"),
  logical("paper_press.felt.change", "Felt change due", "Замена сукна"),
  enu("paper_press.type", ["roll", "shoe", "extended", "other"], "Type", "Тип"),
]);

write("layer-b-paper_dryer.json", [
  id("paper_dryer.id", "Paper dryer section id", "ID сушильной части"),
  q("paper_dryer.steam", "kPa", "Steam pressure", "Давление пара"),
  q("paper_dryer.temp", "Cel", "Cylinder temperature", "Температура цилиндра"),
  q("paper_dryer.moisture", "%", "Sheet moisture", "Влажность полотна", { range: { min: 0, max: 100 } }),
  q("paper_dryer.hood.hum", "%", "Hood humidity", "Влажность колпака", { range: { min: 0, max: 100 } }),
  q("paper_dryer.steam.flow", "t/h", "Steam consumption", "Расход пара"),
  logical("paper_dryer.condensate", "Condensate high", "Высокий конденсат"),
  enu("paper_dryer.state", ["dry", "idle", "maintain", "fault"], "Dryer state", "Состояние сушки"),
]);

write("layer-b-bleach_tower.json", [
  id("bleach_tower.id", "Bleach tower id", "ID башни отбелки"),
  q("bleach_tower.temp", "Cel", "Tower temperature", "Температура башни"),
  q("bleach_tower.brightness", "%", "ISO brightness", "Белизна ISO", { range: { min: 0, max: 100 } }),
  q("bleach_tower.chem", "kg/t", "Chemical charge", "Расход химиката"),
  q("bleach_tower.resid", "ppm", "Residual chemical", "Остаточный химикат"),
  q("bleach_tower.cons", "%", "Consistency", "Концентрация", { range: { min: 0, max: 100 } }),
  logical("bleach_tower.channeling", "Channeling risk", "Риск каналообразования"),
  enu("bleach_tower.stage", ["d0", "eop", "d1", "p", "other"], "Stage", "Ступень"),
]);

write("layer-b-recovery_boil.json", [
  id("recovery_boil.id", "Recovery boiler id", "ID содорегенерационного котла"),
  q("recovery_boil.steam", "t/h", "Steam generation", "Выработка пара"),
  q("recovery_boil.pressure", "kPa", "Steam pressure", "Давление пара"),
  q("recovery_boil.black.solids", "%", "Black liquor solids", "Сухой остаток ЧЩ", { range: { min: 0, max: 100 } }),
  q("recovery_boil.smelt", "Cel", "Smelt temperature", "Температура плава"),
  q("recovery_boil.nox", "mg/Nm3", "NOx", "NOx"),
  logical("recovery_boil.blackout", "Bed blackout risk", "Риск погасания слоя"),
  enu("recovery_boil.state", ["fire", "idle", "startup", "fault"], "Boiler state", "Состояние котла"),
]);

write("layer-b-lime_kiln_pp.json", [
  id("lime_kiln_pp.id", "Pulp lime kiln id", "ID известково-обжигательной печи ЦБП"),
  q("lime_kiln_pp.temp", "Cel", "Burning zone temperature", "Температура зоны обжига"),
  q("lime_kiln_pp.speed", "rpm", "Kiln speed", "Обороты печи"),
  q("lime_kiln_pp.avail", "%", "CaO availability", "Активность CaO", { range: { min: 0, max: 100 } }),
  q("lime_kiln_pp.fuel", "Nm3/h", "Fuel gas flow", "Расход топлива"),
  q("lime_kiln_pp.production", "t/d", "Lime production", "Выработка извести"),
  logical("lime_kiln_pp.ring", "Ring formation", "Образование кольца"),
  enu("lime_kiln_pp.state", ["run", "heat", "idle", "fault"], "Kiln state", "Состояние печи"),
]);

write("layer-b-chip_yard.json", [
  id("chip_yard.id", "Chip yard id", "ID щепового двора"),
  q("chip_yard.inventory", "t", "Chip inventory", "Запас щепы"),
  q("chip_yard.moisture", "%", "Chip moisture", "Влажность щепы", { range: { min: 0, max: 100 } }),
  q("chip_yard.infeed", "t/h", "Infeed rate", "Подача"),
  q("chip_yard.outfeed", "t/h", "Outfeed to digesters", "Выдача на варку"),
  q("chip_yard.fines", "%", "Fines fraction", "Доля мелочи", { range: { min: 0, max: 100 } }),
  logical("chip_yard.frozen", "Frozen pile", "Мёрзлая куча"),
  enu("chip_yard.state", ["receive", "store", "reclaim", "idle"], "Yard state", "Состояние двора"),
]);

write("layer-b-stock_prep.json", [
  id("stock_prep.line.id", "Stock preparation line id", "ID линии размола"),
  q("stock_prep.freeness", "mL", "CSF freeness", "Степень помола CSF"),
  q("stock_prep.cons", "%", "Consistency", "Концентрация", { range: { min: 0, max: 100 } }),
  q("stock_prep.power", "kWh/t", "Specific refining energy", "Удельная энергия размола"),
  q("stock_prep.ash", "%", "Ash content", "Зольность", { range: { min: 0, max: 100 } }),
  q("stock_prep.flow", "L/min", "Stock flow", "Расход массы"),
  logical("stock_prep.screen.ok", "Screen OK", "Сортировка OK"),
  enu("stock_prep.state", ["refine", "blend", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-size_press.json", [
  id("size_press.id", "Size press id", "ID клеильного пресса"),
  q("size_press.pickup", "g/m2", "Starch pickup", "Нанос крахмала"),
  q("size_press.viscosity", "mPa.s", "Size viscosity", "Вязкость клея"),
  q("size_press.temp", "Cel", "Size temperature", "Температура клея"),
  q("size_press.speed", "m/min", "Press speed", "Скорость"),
  q("size_press.moisture", "%", "Post-size moisture", "Влажность после клея", { range: { min: 0, max: 100 } }),
  logical("size_press.film.ok", "Film split OK", "Расщепление плёнки OK"),
  enu("size_press.type", ["pond", "metered", "spray", "other"], "Type", "Тип"),
]);

write("layer-b-calender_pp.json", [
  id("calender_pp.id", "Paper calender id", "ID суперкаландра бумаги"),
  q("calender_pp.nip", "kN/m", "Nip load", "Линейное давление"),
  q("calender_pp.gloss", "-", "Gloss units", "Блеск"),
  q("calender_pp.caliper", "um", "Caliper", "Толщина"),
  q("calender_pp.temp", "Cel", "Roll temperature", "Температура вала"),
  q("calender_pp.speed", "m/min", "Calender speed", "Скорость"),
  logical("calender_pp.barring", "Barring vibration", "Вибрация barring"),
  enu("calender_pp.type", ["soft", "hard", "multi", "other"], "Type", "Тип"),
]);

write("layer-b-winder_paper.json", [
  id("winder_paper.id", "Paper winder id", "ID продольно-резательного станка"),
  q("winder_paper.speed", "m/min", "Winding speed", "Скорость намотки"),
  q("winder_paper.tension", "N/m", "Web tension", "Натяжение полотна"),
  q("winder_paper.diameter", "mm", "Reel diameter", "Диаметр рулона"),
  q("winder_paper.length", "m", "Wound length", "Намотанная длина"),
  q("winder_paper.trim", "mm", "Trim width", "Ширина обрезки"),
  logical("winder_paper.break", "Web break", "Обрыв"),
  enu("winder_paper.state", ["wind", "splice", "idle", "fault"], "Winder state", "Состояние намотки"),
]);

write("layer-b-coat_paper.json", [
  id("coat_paper.id", "Paper coater id", "ID меловальной машины"),
  q("coat_paper.coat", "g/m2", "Coat weight", "Масса покрытия"),
  q("coat_paper.solids", "%", "Coating solids", "Сухой остаток покрытия", { range: { min: 0, max: 100 } }),
  q("coat_paper.blade", "N/m", "Blade load", "Нагрузка ножа"),
  q("coat_paper.gloss", "-", "Coated gloss", "Блеск покрытия"),
  q("coat_paper.speed", "m/min", "Coater speed", "Скорость"),
  logical("coat_paper.streak", "Streak / skip", "Полоса / пропуск"),
  enu("coat_paper.type", ["blade", "curtain", "film", "other"], "Type", "Тип"),
]);

write("layer-b-tissue_mach.json", [
  id("tissue_mach.id", "Tissue machine id", "ID машины санитарно-гигиенической бумаги"),
  q("tissue_mach.speed", "m/min", "Yankee speed", "Скорость янки"),
  q("tissue_mach.basis", "g/m2", "Basis weight", "Масса 1 м²"),
  q("tissue_mach.crepe", "%", "Crepe ratio", "Креп", { range: { min: 0, max: 100 } }),
  q("tissue_mach.yankee.t", "Cel", "Yankee temperature", "Температура янки"),
  q("tissue_mach.production", "t/d", "Production", "Выработка"),
  logical("tissue_mach.doctor", "Doctor blade change", "Замена шабера"),
  enu("tissue_mach.grade", ["bath", "facial", "towel", "other"], "Grade", "Сорт"),
]);

write("layer-b-box_plant.json", [
  id("box_plant.line.id", "Corrugated box plant line id", "ID линии гофропроизводства"),
  q("box_plant.speed", "m/min", "Corrugator speed", "Скорость гофроагрегата"),
  q("box_plant.waste", "%", "Trim / waste", "Обрезь / отходы", { range: { min: 0, max: 100 } }),
  q("box_plant.glue", "g/m2", "Starch application", "Нанос крахмала"),
  q("box_plant.orders", "-", "Orders in queue", "Заказов в очереди", { encodings: ["i32"] }),
  q("box_plant.uptime", "%", "Line uptime", "Готовность линии", { range: { min: 0, max: 100 } }),
  logical("box_plant.jam", "Converter jam", "Затор конвертера"),
  enu("box_plant.state", ["run", "setup", "idle", "fault"], "Plant state", "Состояние завода"),
]);

write("layer-b-print_flexo.json", [
  id("print_flexo.press.id", "Flexo press id", "ID флексомашины"),
  q("print_flexo.speed", "m/min", "Press speed", "Скорость"),
  q("print_flexo.density", "-", "Ink density", "Плотность краски"),
  q("print_flexo.register", "um", "Register error", "Ошибка приводки"),
  q("print_flexo.viscosity", "s", "Ink viscosity cup", "Вязкость краски (чашка)"),
  q("print_flexo.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("print_flexo.ghosting", "Ghosting", "Двоение"),
  enu("print_flexo.state", ["print", "washup", "setup", "fault"], "Press state", "Состояние машины"),
]);

write("layer-b-print_offset.json", [
  id("print_offset.press.id", "Offset press id", "ID офсетной машины"),
  q("print_offset.speed", "/h", "Sheets per hour", "Листов в час"),
  q("print_offset.density", "-", "Solid density", "Плотность плашки"),
  q("print_offset.water", "%", "Dampening", "Увлажнение", { range: { min: 0, max: 100 } }),
  q("print_offset.register", "um", "Register error", "Ошибка приводки"),
  q("print_offset.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("print_offset.scumming", "Scumming", "Тенение"),
  enu("print_offset.state", ["print", "makeready", "idle", "fault"], "Press state", "Состояние машины"),
]);

write("layer-b-print_digit.json", [
  id("print_digit.press.id", "Digital press id", "ID цифровой печатной машины"),
  q("print_digit.speed", "/h", "Impressions per hour", "Оттисков в час"),
  q("print_digit.coverage", "%", "Average coverage", "Среднее покрытие", { range: { min: 0, max: 100 } }),
  q("print_digit.toner", "%", "Toner remaining", "Остаток тонера", { range: { min: 0, max: 100 } }),
  q("print_digit.jobs", "-", "Jobs queued", "Заданий в очереди", { encodings: ["i32"] }),
  q("print_digit.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("print_digit.fuser", "Fuser fault", "Отказ печки"),
  enu("print_digit.type", ["toner", "inkjet", "liquid", "other"], "Type", "Тип"),
]);

write("layer-b-ink_kitchen.json", [
  id("ink_kitchen.id", "Ink kitchen id", "ID красочной кухни"),
  q("ink_kitchen.batches", "-", "Batches today", "Партий за сутки", { encodings: ["i32"] }),
  q("ink_kitchen.viscosity", "mPa.s", "Target viscosity", "Целевая вязкость"),
  q("ink_kitchen.deltae", "-", "ΔE match", "ΔE соответствия"),
  q("ink_kitchen.waste", "kg", "Ink waste", "Отходы краски"),
  q("ink_kitchen.temp", "Cel", "Mix temperature", "Температура смешения"),
  logical("ink_kitchen.spec.ok", "Spec OK", "Спецификация OK"),
  enu("ink_kitchen.state", ["mix", "dispense", "clean", "idle"], "Kitchen state", "Состояние кухни"),
]);

write("layer-b-lamin_pack.json", [
  id("lamin_pack.id", "Packaging laminator id", "ID ламинатора упаковки"),
  q("lamin_pack.speed", "m/min", "Line speed", "Скорость линии"),
  q("lamin_pack.adhesive", "g/m2", "Adhesive coat weight", "Нанос клея"),
  q("lamin_pack.bond", "N/15mm", "Bond strength", "Прочность склейки"),
  q("lamin_pack.temp", "Cel", "Nip temperature", "Температура вала"),
  q("lamin_pack.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("lamin_pack.tunnel", "Tunnel curing", "Туннельное отверждение"),
  enu("lamin_pack.type", ["solvent", "solventless", "extrusion", "other"], "Type", "Тип"),
]);

write("layer-b-extrude_film.json", [
  id("extrude_film.id", "Film extrusion line id", "ID линии экструзии плёнки"),
  q("extrude_film.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("extrude_film.output", "kg/h", "Output", "Производительность"),
  q("extrude_film.gauge", "um", "Film gauge", "Толщина плёнки"),
  q("extrude_film.screw", "rpm", "Screw speed", "Обороты шнека"),
  q("extrude_film.pressure", "kPa", "Die pressure", "Давление головки"),
  logical("extrude_film.gel", "Gels high", "Высокий гель"),
  enu("extrude_film.state", ["run", "purge", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-blown_film.json", [
  id("blown_film.id", "Blown film line id", "ID линии рукавной плёнки"),
  q("blown_film.bur", "-", "Blow-up ratio", "Кратность раздува"),
  q("blown_film.frost", "mm", "Frost line height", "Высота линии кристаллизации"),
  q("blown_film.gauge", "um", "Film gauge", "Толщина"),
  q("blown_film.output", "kg/h", "Output", "Производительность"),
  q("blown_film.layflat", "mm", "Layflat width", "Ширина рукава"),
  logical("blown_film.bubble", "Bubble unstable", "Нестабильный пузырь"),
  enu("blown_film.state", ["run", "startup", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-cast_film.json", [
  id("cast_film.id", "Cast film line id", "ID линии плоскощелевой плёнки"),
  q("cast_film.chill", "Cel", "Chill roll temperature", "Температура охлаждающего вала"),
  q("cast_film.gauge", "um", "Film gauge", "Толщина"),
  q("cast_film.output", "kg/h", "Output", "Производительность"),
  q("cast_film.speed", "m/min", "Line speed", "Скорость"),
  q("cast_film.haze", "%", "Haze", "Мутность", { range: { min: 0, max: 100 } }),
  logical("cast_film.edge.bead", "Edge bead trim", "Обрезка утолщений"),
  enu("cast_film.state", ["cast", "idle", "maintain", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-slitter_rw.json", [
  id("slitter_rw.id", "Slitter-rewinder id", "ID бобинорезательной машины"),
  q("slitter_rw.speed", "m/min", "Slitting speed", "Скорость резки"),
  q("slitter_rw.tension", "N/m", "Web tension", "Натяжение"),
  q("slitter_rw.width", "mm", "Slit width", "Ширина рулона"),
  q("slitter_rw.diameter", "mm", "Finished diameter", "Диаметр готового"),
  q("slitter_rw.rolls", "-", "Rolls per hour", "Рулонов в час", { encodings: ["i32"] }),
  logical("slitter_rw.knife", "Knife change due", "Замена ножей"),
  enu("slitter_rw.state", ["slit", "setup", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-bag_maker.json", [
  id("bag_maker.line.id", "Bag making line id", "ID линии изготовления пакетов"),
  q("bag_maker.speed", "/min", "Bags per minute", "Пакетов в минуту"),
  q("bag_maker.seal.t", "Cel", "Seal temperature", "Температура сварки"),
  q("bag_maker.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("bag_maker.width", "mm", "Bag width", "Ширина пакета"),
  q("bag_maker.length", "mm", "Bag length", "Длина пакета"),
  logical("bag_maker.seal.ok", "Seal integrity OK", "Сварка OK"),
  enu("bag_maker.type", ["t_shirt", "flat", "gusset", "other"], "Type", "Тип"),
]);

write("layer-b-bottle_blow.json", [
  id("bottle_blow.machine.id", "Blow molding machine id", "ID машины выдува бутылок"),
  q("bottle_blow.speed", "/h", "Bottles per hour", "Бутылок в час"),
  q("bottle_blow.preform.t", "Cel", "Preform temperature", "Температура преформы"),
  q("bottle_blow.pressure", "kPa", "Blow pressure", "Давление выдува"),
  q("bottle_blow.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("bottle_blow.weight", "g", "Bottle weight", "Масса бутылки"),
  logical("bottle_blow.ovality", "Ovality out of spec", "Овальность вне нормы"),
  enu("bottle_blow.type", ["isbm", "ebm", "injection", "other"], "Type", "Тип"),
]);

write("layer-b-thermoform.json", [
  id("thermoform.line.id", "Thermoforming line id", "ID линии термоформования"),
  q("thermoform.speed", "/min", "Cycles per minute", "Циклов в минуту"),
  q("thermoform.sheet.t", "Cel", "Sheet temperature", "Температура листа"),
  q("thermoform.vacuum", "kPa", "Forming vacuum", "Вакуум формования"),
  q("thermoform.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("thermoform.trim", "%", "Trim scrap", "Обрезь", { range: { min: 0, max: 100 } }),
  logical("thermoform.plug", "Plug assist active", "Пуансон активен"),
  enu("thermoform.state", ["form", "trim", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-recycle_plas.json", [
  id("recycle_plas.line.id", "Plastic recycling line id", "ID линии переработки пластика"),
  q("recycle_plas.feed", "t/h", "Feed rate", "Подача"),
  q("recycle_plas.yield", "%", "Flake / pellet yield", "Выход хлопьев/гранул", { range: { min: 0, max: 100 } }),
  q("recycle_plas.moisture", "%", "Product moisture", "Влажность продукта", { range: { min: 0, max: 100 } }),
  q("recycle_plas.contam", "%", "Contamination", "Загрязнение", { range: { min: 0, max: 100 } }),
  q("recycle_plas.energy", "kWh/t", "Specific energy", "Удельная энергия"),
  logical("recycle_plas.metal", "Metal detector trip", "Срабатывание металлодетектора"),
  enu("recycle_plas.stream", ["pet", "hdpe", "pp", "mixed", "other"], "Stream", "Поток"),
]);

write("layer-b-compounder.json", [
  id("compounder.id", "Compounding line id", "ID линии компаундирования"),
  q("compounder.temp", "Cel", "Melt temperature", "Температура расплава"),
  q("compounder.output", "kg/h", "Output", "Производительность"),
  q("compounder.torque", "%", "Screw torque", "Момент шнека", { range: { min: 0, max: 100 } }),
  q("compounder.filler", "%", "Filler loading", "Доля наполнителя", { range: { min: 0, max: 100 } }),
  q("compounder.pressure", "kPa", "Die pressure", "Давление головки"),
  logical("compounder.vent", "Vacuum vent OK", "Вакуумный отсос OK"),
  enu("compounder.state", ["compound", "purge", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-twin_screw.json", [
  id("twin_screw.id", "Twin-screw extruder id", "ID двухшнекового экструдера"),
  q("twin_screw.screw", "rpm", "Screw speed", "Обороты шнеков"),
  q("twin_screw.torque", "%", "Torque", "Момент", { range: { min: 0, max: 100 } }),
  q("twin_screw.temp", "Cel", "Zone temperature", "Температура зоны"),
  q("twin_screw.feed", "kg/h", "Feed rate", "Подача"),
  q("twin_screw.sme", "kWh/t", "Specific mechanical energy", "Удельная мех. энергия"),
  logical("twin_screw.starve", "Starved feed", "Голодная подача"),
  enu("twin_screw.state", ["run", "purge", "idle", "fault"], "Extruder state", "Состояние экструдера"),
]);

write("layer-b-pellet_plas.json", [
  id("pellet_plas.id", "Plastic pelletizer id", "ID гранулятора пластика"),
  q("pellet_plas.output", "kg/h", "Pellet output", "Выход гранул"),
  q("pellet_plas.cutter", "rpm", "Cutter speed", "Обороты ножа"),
  q("pellet_plas.water", "Cel", "Water temperature", "Температура воды"),
  q("pellet_plas.fines", "%", "Fines fraction", "Доля мелочи", { range: { min: 0, max: 100 } }),
  q("pellet_plas.bulk", "kg/m3", "Bulk density", "Насыпная плотность"),
  logical("pellet_plas.knife", "Knife change due", "Замена ножей"),
  enu("pellet_plas.type", ["strand", "underwater", "hot_face", "other"], "Type", "Тип"),
]);

write("layer-b-foam_extrude.json", [
  id("foam_extrude.id", "Foam extrusion line id", "ID линии экструзии пенопласта"),
  q("foam_extrude.density", "kg/m3", "Foam density", "Плотность пены"),
  q("foam_extrude.output", "kg/h", "Output", "Производительность"),
  q("foam_extrude.blowing", "%", "Blowing agent", "Вспениватель", { range: { min: 0, max: 100 } }),
  q("foam_extrude.temp", "Cel", "Die temperature", "Температура головки"),
  q("foam_extrude.thickness", "mm", "Board thickness", "Толщина плиты"),
  logical("foam_extrude.collapse", "Cell collapse", "Схлопывание ячеек"),
  enu("foam_extrude.type", ["xps", "eps", "pe_foam", "other"], "Type", "Тип"),
]);

write("layer-b-tire_build.json", [
  id("tire_build.machine.id", "Tire building machine id", "ID сборочного станка шин"),
  q("tire_build.cycle.s", "s", "Cycle time", "Время цикла"),
  q("tire_build.green", "-", "Green tires per hour", "Сырых шин в час", { encodings: ["i32"] }),
  q("tire_build.uniform", "-", "Uniformity index", "Индекс равномерности"),
  q("tire_build.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("tire_build.bead", "mm", "Bead diameter", "Диаметр борта"),
  logical("tire_build.splice", "Splice fault", "Ошибка стыка"),
  enu("tire_build.type", ["pcr", "tbr", "otr", "other"], "Type", "Тип"),
]);

write("layer-b-tire_cure.json", [
  id("tire_cure.press.id", "Tire curing press id", "ID вулканизационного пресса"),
  q("tire_cure.temp", "Cel", "Mold temperature", "Температура пресс-формы"),
  q("tire_cure.pressure", "kPa", "Cure pressure", "Давление вулканизации"),
  q("tire_cure.time.min", "min", "Cure time", "Время вулканизации"),
  q("tire_cure.bladder", "-", "Bladder cycles", "Циклов диафрагмы", { encodings: ["i32"] }),
  q("tire_cure.energy", "kWh", "Energy per cure", "Энергия на цикл"),
  logical("tire_cure.done", "Cure complete", "Вулканизация завершена"),
  enu("tire_cure.state", ["load", "cure", "unload", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-rubber_mix.json", [
  id("rubber_mix.mixer.id", "Rubber internal mixer id", "ID резиносмесителя"),
  id("rubber_mix.batch.id", "Batch id", "ID партии"),
  q("rubber_mix.temp", "Cel", "Batch temperature", "Температура смеси"),
  q("rubber_mix.energy", "kWh", "Mix energy", "Энергия смешения"),
  q("rubber_mix.ram", "kPa", "Ram pressure", "Давление плунжера"),
  q("rubber_mix.time.s", "s", "Mix time", "Время смешения"),
  logical("rubber_mix.dump", "Dump ready", "Готово к выгрузке"),
  enu("rubber_mix.state", ["mix", "dump", "idle", "fault"], "Mixer state", "Состояние смесителя"),
]);

write("layer-b-calendar_rub.json", [
  id("calendar_rub.id", "Rubber calender id", "ID каландра резины"),
  q("calendar_rub.gauge", "mm", "Calendered gauge", "Толщина"),
  q("calendar_rub.speed", "m/min", "Line speed", "Скорость"),
  q("calendar_rub.temp", "Cel", "Roll temperature", "Температура вала"),
  q("calendar_rub.nip", "kN/m", "Nip load", "Линейное давление"),
  q("calendar_rub.width", "mm", "Web width", "Ширина полотна"),
  logical("calendar_rub.bank", "Bank size OK", "Валки OK"),
  enu("calendar_rub.state", ["calender", "idle", "maintain", "fault"], "Calender state", "Состояние каландра"),
]);

write("layer-b-extrude_rub.json", [
  id("extrude_rub.id", "Rubber extruder id", "ID экструдера резины"),
  q("extrude_rub.temp", "Cel", "Head temperature", "Температура головки"),
  q("extrude_rub.screw", "rpm", "Screw speed", "Обороты шнека"),
  q("extrude_rub.output", "kg/h", "Output", "Производительность"),
  q("extrude_rub.pressure", "kPa", "Head pressure", "Давление головки"),
  q("extrude_rub.shrink", "%", "Die swell / shrink", "Усадка / разбухание", { range: { min: 0, max: 100 } }),
  logical("extrude_rub.scorch", "Scorch risk", "Риск подвулканизации"),
  enu("extrude_rub.state", ["extrude", "idle", "clean", "fault"], "Extruder state", "Состояние экструдера"),
]);

write("layer-b-belt_press_r.json", [
  id("belt_press_r.id", "Conveyor belt press id", "ID пресса транспортёрной ленты"),
  q("belt_press_r.temp", "Cel", "Press temperature", "Температура пресса"),
  q("belt_press_r.pressure", "kPa", "Press pressure", "Давление пресса"),
  q("belt_press_r.time.min", "min", "Cure time", "Время вулканизации"),
  q("belt_press_r.thickness", "mm", "Belt thickness", "Толщина ленты"),
  q("belt_press_r.width", "mm", "Belt width", "Ширина ленты"),
  logical("belt_press_r.done", "Press cycle done", "Цикл завершён"),
  enu("belt_press_r.state", ["press", "cool", "idle", "fault"], "Press state", "Состояние пресса"),
]);

write("layer-b-hose_line.json", [
  id("hose_line.id", "Hose manufacturing line id", "ID линии рукавов"),
  q("hose_line.speed", "m/min", "Line speed", "Скорость линии"),
  q("hose_line.od", "mm", "Outer diameter", "Наружный диаметр"),
  q("hose_line.braid", "-", "Braid tension", "Натяжение оплётки"),
  q("hose_line.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("hose_line.cure.t", "Cel", "Cure temperature", "Температура вулканизации"),
  logical("hose_line.leak", "Leak test fail", "Тест на герметичность не пройден"),
  enu("hose_line.type", ["hydraulic", "industrial", "auto", "other"], "Type", "Тип"),
]);

write("layer-b-glove_dip.json", [
  id("glove_dip.line.id", "Glove dipping line id", "ID линии окунания перчаток"),
  q("glove_dip.speed", "/h", "Gloves per hour", "Перчаток в час"),
  q("glove_dip.latex", "%", "Latex solids", "Сухой остаток латекса", { range: { min: 0, max: 100 } }),
  q("glove_dip.oven", "Cel", "Curing oven temperature", "Температура печи"),
  q("glove_dip.thickness", "um", "Film thickness", "Толщина плёнки"),
  q("glove_dip.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("glove_dip.pinhole", "Pinhole detected", "Обнаружен прокол"),
  enu("glove_dip.type", ["nitrile", "latex", "vinyl", "other"], "Type", "Тип"),
]);

write("layer-b-textile_spin.json", [
  id("textile_spin.frame.id", "Spinning frame id", "ID прядильной машины"),
  q("textile_spin.count", "-", "Yarn count (Ne)", "Номер пряжи (Ne)"),
  q("textile_spin.speed", "rpm", "Spindle speed", "Обороты веретена"),
  q("textile_spin.break", "/h", "Ends down per hour", "Обрывов в час"),
  q("textile_spin.twist", "/m", "Twist per meter", "Крутка на метр"),
  q("textile_spin.cv", "%", "Unevenness CV%", "Неровнота CV%", { range: { min: 0, max: 100 } }),
  logical("textile_spin.doff", "Doff due", "Съём"),
  enu("textile_spin.type", ["ring", "oe", "airjet", "other"], "Type", "Тип"),
]);

write("layer-b-textile_weave.json", [
  id("textile_weave.loom.id", "Weaving loom id", "ID ткацкого станка"),
  q("textile_weave.speed", "/min", "Picks per minute", "Уточин в минуту"),
  q("textile_weave.efficiency", "%", "Loom efficiency", "КПД станка", { range: { min: 0, max: 100 } }),
  q("textile_weave.break.warp", "/h", "Warp breaks per hour", "Обрывов основы в час"),
  q("textile_weave.break.weft", "/h", "Weft breaks per hour", "Обрывов утка в час"),
  q("textile_weave.width", "mm", "Reed width", "Ширина по берду"),
  logical("textile_weave.stop", "Machine stop", "Останов"),
  enu("textile_weave.type", ["airjet", "rapier", "projectile", "other"], "Type", "Тип"),
]);

write("layer-b-textile_knit.json", [
  id("textile_knit.machine.id", "Knitting machine id", "ID вязальной машины"),
  q("textile_knit.speed", "rpm", "Cylinder speed", "Обороты цилиндра"),
  q("textile_knit.courses", "/cm", "Courses per cm", "Рядов на см"),
  q("textile_knit.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("textile_knit.defect", "/h", "Defects per hour", "Дефектов в час"),
  q("textile_knit.yarn", "-", "Feeders active", "Активных нитеводителей", { encodings: ["i32"] }),
  logical("textile_knit.needle", "Needle break", "Поломка иглы"),
  enu("textile_knit.type", ["circular", "flat", "warp", "other"], "Type", "Тип"),
]);

write("layer-b-dye_jet.json", [
  id("dye_jet.id", "Jet dyeing machine id", "ID машины струйного крашения"),
  id("dye_jet.batch.id", "Batch id", "ID партии"),
  q("dye_jet.temp", "Cel", "Bath temperature", "Температура ванны"),
  q("dye_jet.lr", "-", "Liquor ratio", "Модуль ванны"),
  q("dye_jet.deltae", "-", "ΔE to standard", "ΔE к эталону"),
  q("dye_jet.time.min", "min", "Process time", "Время процесса"),
  logical("dye_jet.level", "Level dyeing OK", "Равномерность OK"),
  enu("dye_jet.state", ["load", "dye", "rinse", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-stenter.json", [
  id("stenter.id", "Stenter / tenter frame id", "ID ширильной машины"),
  q("stenter.temp", "Cel", "Chamber temperature", "Температура камеры"),
  q("stenter.speed", "m/min", "Fabric speed", "Скорость ткани"),
  q("stenter.width", "mm", "Exit width", "Ширина на выходе"),
  q("stenter.overfeed", "%", "Overfeed", "Переподача", { range: { min: -20, max: 50 } }),
  q("stenter.moisture", "%", "Exit moisture", "Влажность на выходе", { range: { min: 0, max: 100 } }),
  logical("stenter.bow", "Bow / skew alarm", "Дуга / перекос"),
  enu("stenter.process", ["dry", "heatset", "finish", "other"], "Process", "Процесс"),
]);

write("layer-b-carding.json", [
  id("carding.id", "Carding machine id", "ID чесальной машины"),
  q("carding.speed", "m/min", "Delivery speed", "Скорость выпуска"),
  q("carding.sliver", "g/m", "Sliver weight", "Линейная плотность холстика"),
  q("carding.neps", "/g", "Neps per gram", "Узелков на грамм"),
  q("carding.waste", "%", "Waste", "Отходы", { range: { min: 0, max: 100 } }),
  q("carding.cv", "%", "Sliver CV%", "Неровнота холстика", { range: { min: 0, max: 100 } }),
  logical("carding.flat", "Flat grinding due", "Шлифовка шляпок"),
  enu("carding.state", ["card", "idle", "maintain", "fault"], "Card state", "Состояние чесальной"),
]);

write("layer-b-ring_spin.json", [
  id("ring_spin.frame.id", "Ring spinning frame id", "ID кольцепрядильной машины"),
  q("ring_spin.spindle", "rpm", "Spindle speed", "Обороты веретена"),
  q("ring_spin.count", "-", "Yarn count", "Номер пряжи"),
  q("ring_spin.ends", "/h", "Ends down rate", "Обрывы в час"),
  q("ring_spin.efficiency", "%", "Frame efficiency", "КПД машины", { range: { min: 0, max: 100 } }),
  q("ring_spin.power", "kW", "Frame power", "Мощность"),
  logical("ring_spin.doff", "Auto-doff running", "Автосъём"),
  enu("ring_spin.state", ["spin", "doff", "idle", "fault"], "Frame state", "Состояние машины"),
]);

write("layer-b-open_end.json", [
  id("open_end.rotor.id", "Open-end spinning machine id", "ID пневмомеханической прядильной"),
  q("open_end.rotor.rpm", "rpm", "Rotor speed", "Обороты ротора"),
  q("open_end.count", "-", "Yarn count", "Номер пряжи"),
  q("open_end.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("open_end.breaks", "/h", "Ends down per hour", "Обрывов в час"),
  q("open_end.trash", "%", "Trash extraction", "Выделение сора", { range: { min: 0, max: 100 } }),
  logical("open_end.rotor.clean", "Rotor clean due", "Чистка ротора"),
  enu("open_end.state", ["spin", "piecer", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-warping.json", [
  id("warping.id", "Warping machine id", "ID сновальной машины"),
  q("warping.speed", "m/min", "Warping speed", "Скорость снования"),
  q("warping.ends", "-", "Ends in beam", "Нитей в навое", { encodings: ["i32"] }),
  q("warping.tension", "cN", "End tension", "Натяжение нити"),
  q("warping.breaks", "/h", "End breaks per hour", "Обрывов в час"),
  q("warping.length", "m", "Beam length", "Длина снования"),
  logical("warping.static", "Static charge high", "Высокий заряд"),
  enu("warping.state", ["warp", "creel", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-sizing_beam.json", [
  id("sizing_beam.id", "Sizing machine id", "ID шлихтовальной машины"),
  q("sizing_beam.pickup", "%", "Size pickup", "Нанос шлихты", { range: { min: 0, max: 100 } }),
  q("sizing_beam.temp", "Cel", "Size box temperature", "Температура корыта"),
  q("sizing_beam.moisture", "%", "Beam moisture", "Влажность снова", { range: { min: 0, max: 100 } }),
  q("sizing_beam.speed", "m/min", "Sizing speed", "Скорость шлихтования"),
  q("sizing_beam.viscosity", "s", "Size viscosity", "Вязкость шлихты"),
  logical("sizing_beam.stretch", "Stretch high", "Высокая вытяжка"),
  enu("sizing_beam.state", ["size", "dry", "idle", "fault"], "Machine state", "Состояние машины"),
]);

write("layer-b-loom_jacq.json", [
  id("loom_jacq.id", "Jacquard loom id", "ID жаккардового станка"),
  q("loom_jacq.speed", "/min", "Picks per minute", "Уточин в минуту"),
  q("loom_jacq.hooks", "-", "Active hooks", "Активных крючков", { encodings: ["i32"] }),
  q("loom_jacq.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("loom_jacq.breaks", "/h", "Breaks per hour", "Обрывов в час"),
  q("loom_jacq.pattern", "-", "Pattern repeats", "Раппортов", { encodings: ["i32"] }),
  logical("loom_jacq.harness", "Harness fault", "Отказ ремизки"),
  enu("loom_jacq.state", ["weave", "design", "idle", "fault"], "Loom state", "Состояние станка"),
]);

write("layer-b-knit_circ.json", [
  id("knit_circ.id", "Circular knitting machine id", "ID кругловязальной машины"),
  q("knit_circ.speed", "rpm", "Cylinder rpm", "Обороты цилиндра"),
  q("knit_circ.diameter", "mm", "Cylinder diameter", "Диаметр цилиндра"),
  q("knit_circ.feeders", "-", "Active feeders", "Активных нитеводителей", { encodings: ["i32"] }),
  q("knit_circ.efficiency", "%", "Efficiency", "КПД", { range: { min: 0, max: 100 } }),
  q("knit_circ.grams", "g/m2", "Fabric weight", "Масса полотна"),
  logical("knit_circ.needle", "Needle alarm", "Тревога иглы"),
  enu("knit_circ.gauge", ["e18", "e24", "e28", "other"], "Gauge", "Класс"),
]);

write("layer-b-print_screen.json", [
  id("print_screen.id", "Screen printing machine id", "ID машины трафаретной печати"),
  q("print_screen.speed", "m/min", "Print speed", "Скорость печати"),
  q("print_screen.colors", "-", "Colors online", "Красок онлайн", { encodings: ["i32"] }),
  q("print_screen.paste", "%", "Paste viscosity index", "Индекс вязкости пасты", { range: { min: 0, max: 100 } }),
  q("print_screen.reg", "mm", "Register error", "Ошибка приводки"),
  q("print_screen.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  logical("print_screen.squeegee", "Squeegee change", "Замена ракеля"),
  enu("print_screen.type", ["rotary", "flat", "digital_hybrid", "other"], "Type", "Тип"),
]);

write("layer-b-garment_cut.json", [
  id("garment_cut.table.id", "Garment cutting table id", "ID раскройного стола"),
  q("garment_cut.plies", "-", "Ply count", "Число настилов", { encodings: ["i32"] }),
  q("garment_cut.util", "%", "Marker utilization", "Использование лекала", { range: { min: 0, max: 100 } }),
  q("garment_cut.speed", "m/min", "Cutter speed", "Скорость резки"),
  q("garment_cut.time.min", "min", "Cut time", "Время раскроя"),
  q("garment_cut.waste", "%", "Fabric waste", "Отходы ткани", { range: { min: 0, max: 100 } }),
  logical("garment_cut.vacuum", "Vacuum hold OK", "Вакуумный прижим OK"),
  enu("garment_cut.state", ["spread", "cut", "idle", "fault"], "Table state", "Состояние стола"),
]);

write("layer-b-garment_sew.json", [
  id("garment_sew.line.id", "Garment sewing line id", "ID швейной линии"),
  q("garment_sew.output", "/h", "Units per hour", "Изделий в час"),
  q("garment_sew.efficiency", "%", "Line efficiency", "КПД линии", { range: { min: 0, max: 100 } }),
  q("garment_sew.rework", "%", "Rework rate", "Переделка", { range: { min: 0, max: 100 } }),
  q("garment_sew.wip", "-", "WIP units", "НЗП", { encodings: ["i32"] }),
  q("garment_sew.operators", "-", "Operators present", "Операторов", { encodings: ["i32"] }),
  logical("garment_sew.bottleneck", "Bottleneck station", "Узкое место"),
  enu("garment_sew.state", ["run", "changeover", "idle", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-laundry_ind.json", [
  id("laundry_ind.id", "Industrial laundry id", "ID промышленной прачечной"),
  q("laundry_ind.load", "kg", "Batch load", "Загрузка партии"),
  q("laundry_ind.water", "L/kg", "Water per kg", "Воды на кг"),
  q("laundry_ind.temp", "Cel", "Wash temperature", "Температура стирки"),
  q("laundry_ind.cycles", "-", "Cycles today", "Циклов за сутки", { encodings: ["i32"] }),
  q("laundry_ind.chem", "mL/kg", "Chemical dose", "Доза химиката"),
  logical("laundry_ind.hygiene", "Hygiene OK", "Гигиена OK"),
  enu("laundry_ind.state", ["wash", "extract", "dry", "fault"], "Plant state", "Состояние прачечной"),
]);

write("layer-b-tannery.json", [
  id("tannery.drum.id", "Tannery drum id", "ID барабана кожевенного завода"),
  id("tannery.batch.id", "Batch id", "ID партии"),
  q("tannery.temp", "Cel", "Float temperature", "Температура раствора"),
  q("tannery.float.ph", "-", "Float pH", "pH раствора"),
  q("tannery.time.h", "h", "Process time", "Время процесса"),
  q("tannery.shrink", "%", "Area shrink", "Усадка площади", { range: { min: 0, max: 100 } }),
  logical("tannery.chrome", "Chrome exhaust OK", "Отработка хрома OK"),
  enu("tannery.stage", ["soak", "tan", "retan", "dye", "other"], "Stage", "Стадия"),
]);

write("layer-b-leather_fin.json", [
  id("leather_fin.line.id", "Leather finishing line id", "ID линии отделки кожи"),
  q("leather_fin.coat", "g/m2", "Finish coat weight", "Масса покрытия"),
  q("leather_fin.speed", "m/min", "Line speed", "Скорость"),
  q("leather_fin.gloss", "-", "Gloss", "Блеск"),
  q("leather_fin.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("leather_fin.temp", "Cel", "Dryer temperature", "Температура сушки"),
  logical("leather_fin.adhesion", "Adhesion OK", "Адгезия OK"),
  enu("leather_fin.state", ["spray", "press", "dry", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-shoe_line.json", [
  id("shoe_line.id", "Footwear production line id", "ID линии обуви"),
  q("shoe_line.output", "/h", "Pairs per hour", "Пар в час"),
  q("shoe_line.reject", "%", "Reject rate", "Брак", { range: { min: 0, max: 100 } }),
  q("shoe_line.cement", "Cel", "Cementing temperature", "Температура склейки"),
  q("shoe_line.press.s", "s", "Press time", "Время прессования"),
  q("shoe_line.wip", "-", "WIP pairs", "НЗП пар", { encodings: ["i32"] }),
  logical("shoe_line.bond", "Bond strength OK", "Прочность склейки OK"),
  enu("shoe_line.state", ["cut", "stitch", "assemble", "fault"], "Line state", "Состояние линии"),
]);

write("layer-b-spunbond.json", [
  id("spunbond.id", "Spunbond line id", "ID линии спанбонд"),
  q("spunbond.basis", "g/m2", "Basis weight", "Масса 1 м²"),
  q("spunbond.speed", "m/min", "Line speed", "Скорость"),
  q("spunbond.output", "kg/h", "Output", "Производительность"),
  q("spunbond.denier", "-", "Filament denier", "Титр филамента"),
  q("spunbond.bonding", "Cel", "Calender bonding temperature", "Температура каландровой скрепки"),
  logical("spunbond.web", "Web break", "Обрыв полотна"),
  enu("spunbond.state", ["spin", "bond", "wind", "fault"], "Line state", "Состояние линии"),
]);

console.log("Layer B29 seeds written");
