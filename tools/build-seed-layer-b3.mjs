#!/usr/bin/env node
/**
 * Layer B3 — additional categories across remaining major domains.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.join(__dirname, "..", "registry", "seeds");

const q = (pathStr, unit, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "quantity", unit, titleEn, titleRu,
  encodings: opts.encodings || ["f32", "f64"],
  sensitivity: opts.sensitivity || "public",
  range: opts.range, status: opts.status || "stable",
  descriptionEn: opts.descriptionEn, descriptionRu: opts.descriptionRu,
});
const id = (pathStr, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "identity", unit: "-", titleEn, titleRu,
  encodings: ["utf8"], sensitivity: opts.sensitivity || "internal",
});
const enu = (pathStr, values, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "enum", unit: "-", titleEn, titleRu,
  encodings: ["enum", "utf8"], enumValues: values,
  sensitivity: opts.sensitivity || "public",
});
const logical = (pathStr, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "logical", unit: "-", titleEn, titleRu,
  encodings: ["bool", "u8"], sensitivity: opts.sensitivity || "public",
});
const cmd = (pathStr, values, titleEn, titleRu) => ({
  path: pathStr, kind: "command", unit: "-", titleEn, titleRu,
  encodings: ["enum", "utf8"], enumValues: values, sensitivity: "public",
});
const media = (pathStr, titleEn, titleRu) => ({
  path: pathStr, kind: "media", unit: "-", titleEn, titleRu,
  encodings: ["utf8"], sensitivity: "internal",
});
const spatial = (pathStr, titleEn, titleRu, opts = {}) => ({
  path: pathStr, kind: "spatial", unit: "-", titleEn, titleRu,
  encodings: ["record"], sensitivity: opts.sensitivity || "public",
});

function write(name, types) {
  fs.writeFileSync(path.join(seedsDir, name), JSON.stringify({ layer: "B3", name, types }, null, 2));
  console.log(`${name}: ${types.length}`);
}

fs.mkdirSync(seedsDir, { recursive: true });

write("layer-b-space.json", [
  q("space.satellite.altitude", "km", "Orbital altitude", "Орбитальная высота"),
  q("space.satellite.inclination", "deg", "Orbital inclination", "Наклонение орбиты"),
  q("space.satellite.period", "s", "Orbital period", "Период обращения"),
  q("space.satellite.eclipse_fraction", "%", "Eclipse fraction", "Доля затенения", { range: { min: 0, max: 100 } }),
  q("space.satellite.solar_array_power", "W", "Solar array power", "Мощность СБ"),
  q("space.satellite.battery_soc", "%", "Satellite battery SoC", "Заряд АБ КА", { range: { min: 0, max: 100 } }),
  q("space.satellite.bus_voltage", "V", "Satellite bus voltage", "Напряжение шины КА"),
  q("space.attitude.quaternion_error", "-", "Attitude quaternion error", "Ошибка ориентации"),
  q("space.attitude.rate_x", "deg/s", "Body rate X", "Угловая скорость X"),
  q("space.attitude.rate_y", "deg/s", "Body rate Y", "Угловая скорость Y"),
  q("space.attitude.rate_z", "deg/s", "Body rate Z", "Угловая скорость Z"),
  q("space.payload.temperature", "Cel", "Payload temperature", "Температура ПН"),
  q("space.link.snr", "dB", "Space link SNR", "SNR космической линии"),
  q("space.link.ber", "-", "Bit error rate", "BER"),
  q("space.link.datarate", "bit/s", "Space data rate", "Скорость космической линии"),
  enu("space.mode", ["safe", "nominal", "maneuver", "commissioning", "decommission"], "Spacecraft mode", "Режим КА"),
  id("space.norad.id", "NORAD catalog id", "NORAD ID"),
  id("space.spacecraft.id", "Spacecraft id", "ID КА"),
]);

write("layer-b-drone.json", [
  q("drone.battery.soc", "%", "Drone battery SoC", "Заряд батареи дрона", { range: { min: 0, max: 100 } }),
  q("drone.battery.voltage", "V", "Drone battery voltage", "Напряжение батареи дрона"),
  q("drone.altitude.agl", "m", "Altitude AGL", "Высота AGL"),
  q("drone.altitude.amsl", "m", "Altitude AMSL", "Высота AMSL"),
  q("drone.speed.horizontal", "m/s", "Horizontal speed drone", "Горизонтальная скорость дрона"),
  q("drone.speed.vertical", "m/s", "Vertical speed drone", "Вертикальная скорость дрона"),
  q("drone.gimbal.pitch", "deg", "Gimbal pitch", "Тангаж подвеса"),
  q("drone.gimbal.yaw", "deg", "Gimbal yaw", "Рыскание подвеса"),
  q("drone.gimbal.roll", "deg", "Gimbal roll", "Крен подвеса"),
  q("drone.motor.rpm_1", "/min", "Motor 1 RPM", "Обороты мотора 1"),
  q("drone.motor.rpm_2", "/min", "Motor 2 RPM", "Обороты мотора 2"),
  q("drone.motor.rpm_3", "/min", "Motor 3 RPM", "Обороты мотора 3"),
  q("drone.motor.rpm_4", "/min", "Motor 4 RPM", "Обороты мотора 4"),
  q("drone.link.rssi", "dBm", "Drone RC RSSI", "RSSI пульта дрона"),
  logical("drone.geofence.inside", "Inside geofence", "Внутри геозоны"),
  enu("drone.flight_mode", ["manual", "stabilize", "loiter", "rtl", "auto", "land", "failsafe"], "Drone flight mode", "Режим полёта дрона"),
  id("drone.uav.id", "UAV id", "ID БВС"),
  cmd("drone.mission", ["arm", "takeoff", "land", "rtl", "hold"], "Drone mission command", "Команда миссии дрона"),
  media("drone.camera.snapshot_ref", "Drone snapshot", "Снимок с дрона"),
]);

write("layer-b-smartcity.json", [
  q("smartcity.traffic.vehicle_count", "-", "Vehicle count", "Число ТС", { encodings: ["i32"] }),
  q("smartcity.traffic.average_speed", "km/h", "Average traffic speed", "Средняя скорость потока"),
  q("smartcity.traffic.occupancy", "%", "Lane occupancy", "Занятость полосы", { range: { min: 0, max: 100 } }),
  q("smartcity.traffic.queue_length", "m", "Traffic queue length", "Длина затора"),
  enu("smartcity.traffic.light_state", ["red", "yellow", "green", "flashing", "off"], "Traffic light state", "Сигнал светофора"),
  q("smartcity.parking.occupied", "-", "Occupied parking spots", "Занятые места", { encodings: ["i32"] }),
  q("smartcity.parking.available", "-", "Available parking spots", "Свободные места", { encodings: ["i32"] }),
  q("smartcity.parking.occupancy", "%", "Parking occupancy", "Занятость парковки", { range: { min: 0, max: 100 } }),
  q("smartcity.waste.bin_fill", "%", "Waste bin fill level", "Заполненность контейнера", { range: { min: 0, max: 100 } }),
  q("smartcity.waste.bin_weight", "kg", "Waste bin weight", "Масса отходов в контейнере"),
  logical("smartcity.waste.bin_fire", "Bin fire alarm", "Пожар в контейнере"),
  q("smartcity.lighting.power", "W", "Street light power", "Мощность фонаря"),
  q("smartcity.lighting.dimming", "%", "Street light dimming", "Диммирование фонаря", { range: { min: 0, max: 100 } }),
  logical("smartcity.lighting.fault", "Street light fault", "Неисправность фонаря"),
  q("smartcity.air.aqi", "-", "City AQI", "AQI города", { encodings: ["u8", "f32"] }),
  q("smartcity.noise.spl", "dB", "City noise SPL", "Шум города"),
  q("smartcity.crowd.count", "-", "Crowd count", "Число людей", { encodings: ["i32"], sensitivity: "personal" }),
  id("smartcity.zone.id", "City zone id", "ID зоны города"),
  id("smartcity.asset.id", "City asset id", "ID городского актива"),
  cmd("smartcity.lighting", ["on", "off", "dim"], "Street lighting command", "Команда освещения"),
]);

write("layer-b-water.json", [
  q("water.treatment.flow_in", "m3/h", "Inlet flow", "Расход на входе"),
  q("water.treatment.flow_out", "m3/h", "Outlet flow", "Расход на выходе"),
  q("water.treatment.turbidity", "NTU", "Treatment turbidity", "Мутность очистки"),
  q("water.treatment.chlorine", "mg/L", "Residual chlorine", "Остаточный хлор"),
  q("water.treatment.ph", "-", "Treatment pH", "pH очистки", { range: { min: 0, max: 14 } }),
  q("water.treatment.uv_dose", "mJ/cm2", "UV dose", "Доза УФ"),
  q("water.network.pressure", "kPa", "Water network pressure", "Давление в сети"),
  q("water.network.flow", "m3/h", "Water network flow", "Расход в сети"),
  q("water.network.leak_index", "-", "Leak index", "Индекс утечек"),
  q("water.reservoir.level", "%", "Reservoir level", "Уровень водохранилища", { range: { min: 0, max: 100 } }),
  q("water.reservoir.volume", "m3", "Reservoir volume", "Объём водохранилища"),
  q("water.wastewater.bod", "mg/L", "BOD", "БПК"),
  q("water.wastewater.cod", "mg/L", "COD", "ХПК"),
  q("water.wastewater.tss", "mg/L", "TSS", "Взвешенные вещества"),
  q("water.wastewater.ammonium", "mg/L", "Ammonium", "Аммоний"),
  q("water.meter.volume", "m3", "Water meter volume", "Показания водосчётчика"),
  logical("water.alarm.overflow", "Overflow alarm", "Переполнение"),
  logical("water.alarm.low_pressure", "Low pressure alarm", "Низкое давление"),
  id("water.plant.id", "Water plant id", "ID станции водоподготовки"),
  id("water.dma.id", "DMA id", "ID DMA"),
]);

write("layer-b-datacenter.json", [
  q("datacenter.rack.power", "W", "Rack power", "Мощность стойки"),
  q("datacenter.rack.temperature", "Cel", "Rack temperature", "Температура стойки"),
  q("datacenter.rack.humidity", "%", "Rack humidity", "Влажность стойки", { range: { min: 0, max: 100 } }),
  q("datacenter.pdu.voltage", "V", "PDU voltage", "Напряжение PDU"),
  q("datacenter.pdu.current", "A", "PDU current", "Ток PDU"),
  q("datacenter.pdu.energy", "Wh", "PDU energy", "Энергия PDU"),
  q("datacenter.ups.load", "%", "UPS load", "Нагрузка ИБП", { range: { min: 0, max: 100 } }),
  q("datacenter.ups.runtime", "min", "UPS runtime", "Автономия ИБП"),
  q("datacenter.ups.battery_soc", "%", "UPS battery SoC", "Заряд ИБП", { range: { min: 0, max: 100 } }),
  q("datacenter.cooling.supply_temp", "Cel", "Cooling supply temp", "Температура подачи охлаждения"),
  q("datacenter.cooling.return_temp", "Cel", "Cooling return temp", "Температура обратки охлаждения"),
  q("datacenter.cooling.pue", "-", "PUE", "PUE"),
  q("datacenter.floor.pressure", "Pa", "Raised floor pressure", "Давление под фальшполом"),
  logical("datacenter.leak.detected", "Coolant leak detected", "Утечка хладагента"),
  enu("datacenter.ups.state", ["online", "battery", "bypass", "fault", "off"], "UPS state", "Состояние ИБП"),
  id("datacenter.rack.id", "Rack id", "ID стойки"),
  id("datacenter.hall.id", "Hall id", "ID зала"),
  id("datacenter.site.id", "DC site id", "ID ЦОД"),
]);

write("layer-b-construction.json", [
  q("construction.crane.load", "kg", "Crane load", "Нагрузка крана"),
  q("construction.crane.radius", "m", "Crane radius", "Вылет стрелы"),
  q("construction.crane.angle", "deg", "Crane boom angle", "Угол стрелы"),
  q("construction.crane.wind", "m/s", "Crane wind speed", "Ветер на кране"),
  logical("construction.crane.overload", "Crane overload", "Перегруз крана"),
  q("construction.concrete.temperature", "Cel", "Concrete temperature", "Температура бетона"),
  q("construction.concrete.maturity", "-", "Concrete maturity", "Зрелость бетона"),
  q("construction.vibration.rms", "m/s2", "Site vibration RMS", "Вибрация на площадке"),
  q("construction.dust.pm10", "ug/m3", "Construction PM10", "Пыль PM10 (стройка)"),
  q("construction.noise.spl", "dB", "Construction noise", "Шум стройки"),
  q("construction.worker.count", "-", "Workers on site", "Рабочих на площадке", { encodings: ["i16"] }),
  logical("construction.helmet.worn", "Helmet worn", "Каска надета", { sensitivity: "personal" }),
  logical("construction.harness.worn", "Harness worn", "Страховка надета", { sensitivity: "personal" }),
  id("construction.site.id", "Construction site id", "ID стройплощадки"),
  id("construction.equipment.id", "Equipment id", "ID техники"),
  enu("construction.equipment.state", ["idle", "working", "maintenance", "offline"], "Equipment state", "Состояние техники"),
]);

write("layer-b-mining.json", [
  q("mining.conveyor.tonnage", "t/h", "Conveyor tonnage", "Производительность конвейера"),
  q("mining.haul.truck_load", "t", "Haul truck load", "Нагрузка самосвала"),
  q("mining.haul.cycle_time", "s", "Haul cycle time", "Время цикла перевозки"),
  q("mining.drill.penetration_rate", "m/h", "Drill penetration rate", "Скорость бурения"),
  q("mining.blast.vibration", "m/s", "Blast vibration", "Вибрация взрыва"),
  q("mining.air.dust", "ug/m3", "Mine dust", "Пыль в шахте"),
  q("mining.air.methane", "ppm", "Mine methane", "Метан в шахте"),
  q("mining.air.co", "ppm", "Mine CO", "CO в шахте"),
  q("mining.ground.displacement", "mm", "Ground displacement", "Смещение грунта"),
  q("mining.ore.grade", "%", "Ore grade", "Содержание руды", { range: { min: 0, max: 100 } }),
  logical("mining.safety.gas_alarm", "Mine gas alarm", "Газовая тревога шахты"),
  id("mining.face.id", "Mine face id", "ID забоя"),
  id("mining.truck.id", "Haul truck id", "ID самосвала"),
  enu("mining.shift.state", ["idle", "drilling", "blasting", "loading", "hauling", "maintenance"], "Mine shift activity", "Активность смены"),
]);

write("layer-b-laboratory.json", [
  q("laboratory.sample.temperature", "Cel", "Sample temperature", "Температура образца"),
  q("laboratory.sample.volume", "L", "Sample volume", "Объём образца"),
  q("laboratory.sample.mass", "kg", "Sample mass", "Масса образца"),
  q("laboratory.ph", "-", "Lab pH", "pH (лаборатория)", { range: { min: 0, max: 14 } }),
  q("laboratory.conductivity", "uS/cm", "Lab conductivity", "Проводимость (лаб)"),
  q("laboratory.absorbance", "-", "Absorbance", "Оптическая плотность"),
  q("laboratory.transmittance", "%", "Transmittance", "Пропускание", { range: { min: 0, max: 100 } }),
  q("laboratory.wavelength", "nm", "Wavelength", "Длина волны"),
  q("laboratory.concentration", "mg/L", "Analyte concentration", "Концентрация аналита"),
  q("laboratory.centrifuge.rpm", "/min", "Centrifuge RPM", "Обороты центрифуги"),
  q("laboratory.incubator.temperature", "Cel", "Incubator temperature", "Температура инкубатора"),
  q("laboratory.incubator.co2", "%", "Incubator CO2", "CO2 инкубатора", { range: { min: 0, max: 20 } }),
  q("laboratory.freezer.temperature", "Cel", "Lab freezer temperature", "Температура лаб. морозилки"),
  logical("laboratory.door.open", "Lab equipment door open", "Дверь оборудования открыта"),
  id("laboratory.sample.id", "Sample id", "ID образца"),
  id("laboratory.batch.id", "Lab batch id", "ID лабораторной партии"),
  id("laboratory.instrument.id", "Instrument id", "ID прибора"),
  enu("laboratory.run.state", ["queued", "running", "complete", "failed", "cancelled"], "Lab run state", "Состояние прогона"),
]);

write("layer-b-hospitality.json", [
  id("hospitality.hotel.id", "Hotel id", "ID отеля"),
  id("hospitality.room.id", "Room id", "ID номера"),
  id("hospitality.guest.id", "Guest id", "ID гостя", { sensitivity: "restricted" }),
  enu("hospitality.room.status", ["vacant", "occupied", "dirty", "clean", "ooo", "reserved"], "Room status", "Статус номера"),
  q("hospitality.room.temperature", "Cel", "Hotel room temperature", "Температура номера"),
  q("hospitality.room.humidity", "%", "Hotel room humidity", "Влажность номера", { range: { min: 0, max: 100 } }),
  logical("hospitality.room.dnd", "Do not disturb", "Не беспокоить"),
  logical("hospitality.room.mur", "Make up room", "Убрать номер"),
  q("hospitality.kitchen.temperature", "Cel", "Kitchen temperature", "Температура кухни"),
  q("hospitality.fridge.temperature", "Cel", "Hospitality fridge temp", "Температура холодильника (HoReCa)"),
  q("hospitality.occupancy.rate", "%", "Occupancy rate", "Загрузка отеля", { range: { min: 0, max: 100 } }),
  q("hospitality.restaurant.table_occupied", "-", "Tables occupied", "Занятые столы", { encodings: ["i16"] }),
  q("hospitality.queue.wait_minutes", "min", "Wait time minutes", "Ожидание (мин)"),
  cmd("hospitality.door", ["lock", "unlock"], "Hotel door command", "Команда двери номера"),
]);

write("layer-b-sports.json", [
  q("sports.athlete.heart_rate", "/min", "Athlete heart rate", "Пульс спортсмена", { sensitivity: "personal" }),
  q("sports.athlete.speed", "m/s", "Athlete speed", "Скорость спортсмена", { sensitivity: "personal" }),
  q("sports.athlete.distance", "m", "Athlete distance", "Дистанция спортсмена", { sensitivity: "personal" }),
  q("sports.athlete.power", "W", "Athlete power", "Мощность спортсмена", { sensitivity: "personal" }),
  q("sports.athlete.cadence", "/min", "Athlete cadence", "Каденс спортсмена", { sensitivity: "personal" }),
  q("sports.ball.speed", "m/s", "Ball speed", "Скорость мяча"),
  q("sports.court.temperature", "Cel", "Court temperature", "Температура площадки"),
  q("sports.pool.temperature", "Cel", "Pool temperature", "Температура бассейна"),
  q("sports.pool.chlorine", "mg/L", "Pool chlorine", "Хлор в бассейне"),
  q("sports.gym.occupancy", "-", "Gym occupancy", "Посещаемость зала", { encodings: ["i16"] }),
  q("sports.score.home", "-", "Home score", "Счёт хозяев", { encodings: ["i16"] }),
  q("sports.score.away", "-", "Away score", "Счёт гостей", { encodings: ["i16"] }),
  id("sports.athlete.id", "Athlete id", "ID спортсмена", { sensitivity: "personal" }),
  id("sports.event.id", "Sports event id", "ID соревнования"),
  enu("sports.session.state", ["warmup", "active", "rest", "cooldown", "finished"], "Training session state", "Состояние тренировки"),
]);

write("layer-b-education.json", [
  id("education.campus.id", "Campus id", "ID кампуса"),
  id("education.room.id", "Classroom id", "ID аудитории"),
  id("education.course.id", "Course id", "ID курса"),
  id("education.student.id", "Student id", "ID студента", { sensitivity: "restricted" }),
  q("education.room.occupancy", "-", "Classroom occupancy", "Заполненность аудитории", { encodings: ["i16"] }),
  q("education.room.co2", "ppm", "Classroom CO2", "CO2 аудитории"),
  q("education.attendance.count", "-", "Attendance count", "Число присутствующих", { encodings: ["i16"] }),
  q("education.exam.score", "-", "Exam score", "Балл экзамена", { encodings: ["f32"], sensitivity: "personal", range: { min: 0, max: 100 } }),
  logical("education.projector.on", "Projector on", "Проектор включён"),
  logical("education.access.granted", "Room access granted", "Доступ в аудиторию"),
  enu("education.class.state", ["scheduled", "live", "break", "ended", "cancelled"], "Class state", "Состояние занятия"),
]);

write("layer-b-micromobility.json", [
  q("micromobility.scooter.speed", "km/h", "Scooter speed", "Скорость самоката"),
  q("micromobility.scooter.battery", "%", "Scooter battery", "Заряд самоката", { range: { min: 0, max: 100 } }),
  q("micromobility.bike.cadence", "/min", "Bike cadence", "Каденс велосипеда"),
  q("micromobility.bike.power", "W", "Bike power", "Мощность велосипеда"),
  q("micromobility.bike.battery", "%", "E-bike battery", "Заряд электровелосипеда", { range: { min: 0, max: 100 } }),
  logical("micromobility.lock.locked", "Micromobility locked", "Самокат/велосипед закрыт"),
  enu("micromobility.vehicle.state", ["available", "reserved", "in_use", "maintenance", "low_battery"], "Micromobility state", "Состояние СИМ"),
  id("micromobility.vehicle.id", "Micromobility vehicle id", "ID СИМ"),
  id("micromobility.trip.id", "Trip id", "ID поездки"),
  q("micromobility.trip.distance", "km", "Trip distance micromobility", "Дистанция поездки СИМ"),
  cmd("micromobility.lock", ["lock", "unlock", "alarm"], "Micromobility lock command", "Команда замка СИМ"),
]);

write("layer-b-elevator.json", [
  q("elevator.cabin.floor", "-", "Cabin floor", "Этаж кабины", { encodings: ["i16", "f32"] }),
  q("elevator.cabin.load", "kg", "Cabin load", "Нагрузка кабины"),
  q("elevator.cabin.speed", "m/s", "Cabin speed", "Скорость кабины"),
  q("elevator.motor.current", "A", "Elevator motor current", "Ток двигателя лифта"),
  q("elevator.motor.temperature", "Cel", "Elevator motor temperature", "Температура двигателя лифта"),
  logical("elevator.door.open", "Elevator door open", "Двери лифта открыты"),
  logical("elevator.alarm.active", "Elevator alarm", "Тревога лифта"),
  enu("elevator.state", ["idle", "moving_up", "moving_down", "door_open", "fault", "inspection"], "Elevator state", "Состояние лифта"),
  id("elevator.unit.id", "Elevator id", "ID лифта"),
  id("elevator.building.id", "Elevator building id", "ID здания лифта"),
  cmd("elevator.call", ["up", "down", "open", "close", "stop"], "Elevator call command", "Вызов лифта"),
]);

write("layer-b-broadcast.json", [
  q("broadcast.audio.level", "dB", "Program audio level", "Уровень программного звука"),
  q("broadcast.audio.lufs", "LUFS", "Loudness LUFS", "Громкость LUFS"),
  q("broadcast.video.bitrate", "bit/s", "Video bitrate", "Битрейт видео"),
  q("broadcast.video.framerate", "/s", "Frame rate", "Частота кадров"),
  q("broadcast.video.dropped_frames", "-", "Dropped frames", "Потерянные кадры", { encodings: ["i32"] }),
  q("broadcast.rf.power", "W", "Transmitter RF power", "Мощность передатчика"),
  q("broadcast.rf.vsWR", "-", "VSWR", "КСВ"),
  q("broadcast.rf.frequency", "Hz", "Carrier frequency", "Несущая частота"),
  enu("broadcast.stream.state", ["offline", "preview", "live", "ad_break", "fault"], "Stream state", "Состояние эфира"),
  id("broadcast.channel.id", "Channel id", "ID канала"),
  id("broadcast.program.id", "Program id", "ID программы"),
  media("broadcast.stream.url", "Stream URL", "URL потока"),
]);

write("layer-b-esg.json", [
  q("esg.emissions.co2e", "kg", "CO2e emissions", "Выбросы CO2e"),
  q("esg.emissions.nox", "kg", "NOx emissions", "Выбросы NOx"),
  q("esg.emissions.sox", "kg", "SOx emissions", "Выбросы SOx"),
  q("esg.energy.renewable_share", "%", "Renewable energy share", "Доля ВИЭ", { range: { min: 0, max: 100 } }),
  q("esg.water.consumed", "m3", "Water consumed", "Потребление воды"),
  q("esg.water.recycled", "m3", "Water recycled", "Оборотная вода"),
  q("esg.waste.generated", "kg", "Waste generated", "Образовано отходов"),
  q("esg.waste.recycled", "kg", "Waste recycled", "Переработано отходов"),
  q("esg.waste.hazardous", "kg", "Hazardous waste", "Опасные отходы"),
  q("esg.carbon.intensity", "kg/kWh", "Carbon intensity", "Углеродоёмкость"),
  id("esg.facility.id", "ESG facility id", "ID объекта ESG"),
  id("esg.report.period", "Report period", "Период отчёта"),
]);

write("layer-b-access.json", [
  id("access.user.id", "Access user id", "ID пользователя СКУД", { sensitivity: "restricted" }),
  id("access.badge.id", "Badge id", "ID пропуска", { sensitivity: "restricted" }),
  id("access.door.id", "Access door id", "ID двери СКУД"),
  id("access.zone.id", "Access zone id", "ID зоны СКУД"),
  enu("access.event.type", ["granted", "denied", "tailgate", "forced", "held_open", "exit"], "Access event type", "Тип события СКУД"),
  logical("access.door.forced", "Door forced open", "Дверь взломана"),
  logical("access.door.held", "Door held open", "Дверь удерживается"),
  q("access.biometric.score", "-", "Biometric match score", "Скор биометрии", { sensitivity: "restricted", range: { min: 0, max: 100 } }),
  enu("access.biometric.modality", ["fingerprint", "face", "iris", "palm", "voice", "other"], "Biometric modality", "Модальность биометрии"),
  cmd("access.door", ["lock", "unlock", "momentary"], "Access door command", "Команда двери СКУД"),
  q("access.occupancy.count", "-", "Zone occupancy", "Людей в зоне", { encodings: ["i16"] }),
]);

write("layer-b-pharmacy.json", [
  id("pharmacy.drug.id", "Drug id", "ID препарата"),
  id("pharmacy.lot.id", "Lot id", "ID серии"),
  id("pharmacy.prescription.id", "Prescription id", "ID рецепта", { sensitivity: "restricted" }),
  q("pharmacy.storage.temperature", "Cel", "Pharmacy storage temperature", "Температура хранения"),
  q("pharmacy.storage.humidity", "%", "Pharmacy storage humidity", "Влажность хранения", { range: { min: 0, max: 100 } }),
  logical("pharmacy.coldchain.ok", "Pharmacy cold chain OK", "Холодовая цепь в норме"),
  q("pharmacy.inventory.count", "-", "Pharmacy stock count", "Остаток аптеки", { encodings: ["i32"] }),
  q("pharmacy.dispense.quantity", "-", "Dispense quantity", "Отпущено", { encodings: ["f32", "i32"] }),
  enu("pharmacy.item.status", ["available", "reserved", "expired", "recalled", "quarantine"], "Pharmacy item status", "Статус препарата"),
]);

write("layer-b-forestry.json", [
  q("forestry.tree.dbh", "cm", "Tree DBH", "Диаметр ствола"),
  q("forestry.tree.height", "m", "Tree height", "Высота дерева"),
  q("forestry.canopy.cover", "%", "Canopy cover", "Сомкнутость крон", { range: { min: 0, max: 100 } }),
  q("forestry.soil.moisture", "%", "Forest soil moisture", "Влажность лесной почвы", { range: { min: 0, max: 100 } }),
  q("forestry.fire.risk_index", "-", "Fire risk index", "Индекс пожароопасности"),
  q("forestry.fire.temperature", "Cel", "Hotspot temperature", "Температура очага"),
  logical("forestry.fire.detected", "Forest fire detected", "Обнаружен лесной пожар"),
  q("forestry.harvest.volume", "m3", "Harvest volume", "Объём заготовки"),
  id("forestry.plot.id", "Forest plot id", "ID лесного участка"),
  id("forestry.tree.id", "Tree id", "ID дерева"),
]);

write("layer-b-nuclear.json", [
  q("nuclear.reactor.power", "%", "Reactor power", "Мощность реактора", { range: { min: 0, max: 110 } }),
  q("nuclear.reactor.period", "s", "Reactor period", "Период реактора"),
  q("nuclear.coolant.temperature", "Cel", "Coolant temperature nuclear", "Температура теплоносителя"),
  q("nuclear.coolant.pressure", "Pa", "Coolant pressure nuclear", "Давление теплоносителя"),
  q("nuclear.coolant.flow", "m3/h", "Coolant flow nuclear", "Расход теплоносителя"),
  q("nuclear.radiation.dose_rate", "uSv/h", "Nuclear dose rate", "Мощность дозы (АЭС)"),
  q("nuclear.containment.pressure", "Pa", "Containment pressure", "Давление гермооболочки"),
  logical("nuclear.scram.active", "SCRAM active", "АЗ активна"),
  enu("nuclear.mode", ["shutdown", "startup", "power", "refueling", "trip"], "Reactor mode", "Режим реактора"),
  id("nuclear.unit.id", "Nuclear unit id", "ID энергоблока"),
]);

write("layer-b-hydrogen.json", [
  q("hydrogen.tank.pressure", "Pa", "H2 tank pressure", "Давление бака H2"),
  q("hydrogen.tank.temperature", "Cel", "H2 tank temperature", "Температура бака H2"),
  q("hydrogen.tank.soc", "%", "H2 tank fill", "Заполнение бака H2", { range: { min: 0, max: 100 } }),
  q("hydrogen.fuelcell.power", "W", "Fuel cell power", "Мощность ТЭ"),
  q("hydrogen.fuelcell.voltage", "V", "Fuel cell voltage", "Напряжение ТЭ"),
  q("hydrogen.fuelcell.current", "A", "Fuel cell current", "Ток ТЭ"),
  q("hydrogen.fuelcell.efficiency", "%", "Fuel cell efficiency", "КПД ТЭ", { range: { min: 0, max: 100 } }),
  q("hydrogen.electrolyzer.power", "W", "Electrolyzer power", "Мощность электролизёра"),
  q("hydrogen.electrolyzer.h2_rate", "kg/h", "H2 production rate", "Производство H2"),
  logical("hydrogen.leak.detected", "Hydrogen leak detected", "Утечка водорода"),
  id("hydrogen.station.id", "H2 station id", "ID водородной станции"),
]);

write("layer-b-printing.json", [
  q("printing.job.progress", "%", "Print job progress", "Прогресс печати", { range: { min: 0, max: 100 } }),
  q("printing.job.pages", "-", "Pages printed", "Напечатано страниц", { encodings: ["i32"] }),
  q("printing.toner.level", "%", "Toner level", "Уровень тонера", { range: { min: 0, max: 100 } }),
  q("printing.ink.level", "%", "Ink level", "Уровень чернил", { range: { min: 0, max: 100 } }),
  q("printing.paper.remaining", "-", "Paper remaining", "Остаток бумаги", { encodings: ["i32"] }),
  q("printing.3d.nozzle_temp", "Cel", "3D nozzle temperature", "Температура сопла 3D"),
  q("printing.3d.bed_temp", "Cel", "3D bed temperature", "Температура стола 3D"),
  q("printing.3d.layer", "-", "Current layer", "Текущий слой", { encodings: ["i32"] }),
  enu("printing.job.state", ["idle", "printing", "paused", "done", "error", "jam"], "Print job state", "Состояние задания печати"),
  id("printing.device.id", "Printer id", "ID принтера"),
  id("printing.job.id", "Print job id", "ID задания печати"),
]);

write("layer-b-insurance.json", [
  id("insurance.policy.id", "Policy id", "ID полиса", { sensitivity: "restricted" }),
  id("insurance.claim.id", "Claim id", "ID убытка", { sensitivity: "restricted" }),
  id("insurance.customer.id", "Insurance customer id", "ID клиента страхования", { sensitivity: "restricted" }),
  q("insurance.risk.score", "-", "Insurance risk score", "Страховой риск-скор", { sensitivity: "restricted", range: { min: 0, max: 100 } }),
  q("insurance.premium.amount", "-", "Premium amount", "Сумма премии", { encodings: ["f64"], sensitivity: "restricted" }),
  q("insurance.claim.amount", "-", "Claim amount", "Сумма убытка", { encodings: ["f64"], sensitivity: "restricted" }),
  enu("insurance.claim.status", ["opened", "investigating", "approved", "rejected", "paid", "closed"], "Claim status", "Статус убытка"),
  enu("insurance.policy.status", ["quote", "active", "lapsed", "cancelled", "expired"], "Policy status", "Статус полиса"),
  media("insurance.evidence.ref", "Claim evidence ref", "Доказательство по убытку"),
]);

write("layer-b-realestate.json", [
  id("realestate.property.id", "Property id", "ID объекта недвижимости"),
  id("realestate.unit.id", "Unit id", "ID помещения"),
  id("realestate.lease.id", "Lease id", "ID договора аренды", { sensitivity: "restricted" }),
  q("realestate.area", "m2", "Floor area", "Площадь"),
  q("realestate.rent.amount", "-", "Rent amount", "Арендная плата", { encodings: ["f64"], sensitivity: "restricted" }),
  q("realestate.occupancy", "%", "Property occupancy", "Заполненность объекта", { range: { min: 0, max: 100 } }),
  q("realestate.energy.intensity", "kWh/m2", "Energy use intensity", "Удельное энергопотребление"),
  enu("realestate.unit.status", ["vacant", "leased", "maintenance", "sale"], "Unit status", "Статус помещения"),
  logical("realestate.amenity.gym", "Gym amenity", "Есть спортзал"),
  logical("realestate.amenity.parking", "Parking amenity", "Есть парковка"),
]);

console.log("Layer B3 seeds written");
