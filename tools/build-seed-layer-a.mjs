#!/usr/bin/env node
/**
 * Build registry/seeds/layer-a-core.json — universal IoT / physics / building / network core.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "registry", "seeds", "layer-a-core.json");

/** @type {object[]} */
const types = [];

function q(pathStr, unit, titleEn, titleRu, opts = {}) {
  types.push({
    path: pathStr,
    kind: "quantity",
    unit,
    titleEn,
    titleRu,
    encodings: opts.encodings || ["f32", "f64"],
    sensitivity: opts.sensitivity || "public",
    range: opts.range,
    descriptionEn: opts.descriptionEn,
    descriptionRu: opts.descriptionRu,
    aliasesRu: opts.aliasesRu,
    short: opts.short,
    status: opts.status || "stable",
  });
}

function id(pathStr, titleEn, titleRu, opts = {}) {
  types.push({
    path: pathStr,
    kind: "identity",
    unit: "-",
    titleEn,
    titleRu,
    encodings: opts.encodings || ["utf8"],
    sensitivity: opts.sensitivity || "internal",
    descriptionEn: opts.descriptionEn,
    descriptionRu: opts.descriptionRu,
  });
}

function enu(pathStr, values, titleEn, titleRu, opts = {}) {
  types.push({
    path: pathStr,
    kind: opts.kind || "enum",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["enum", "utf8"],
    enumValues: values,
    sensitivity: opts.sensitivity || "public",
  });
}

function spatial(pathStr, titleEn, titleRu, opts = {}) {
  types.push({
    path: pathStr,
    kind: "spatial",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["record"],
    sensitivity: opts.sensitivity || "personal",
    descriptionEn: opts.descriptionEn,
    descriptionRu: opts.descriptionRu,
  });
}

function logical(pathStr, titleEn, titleRu, opts = {}) {
  types.push({
    path: pathStr,
    kind: "logical",
    unit: opts.unit || "-",
    titleEn,
    titleRu,
    encodings: opts.encodings || ["bool", "u8"],
    sensitivity: opts.sensitivity || "public",
  });
}

function media(pathStr, titleEn, titleRu) {
  types.push({
    path: pathStr,
    kind: "media",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["utf8"],
    sensitivity: "internal",
  });
}

function cmd(pathStr, values, titleEn, titleRu) {
  types.push({
    path: pathStr,
    kind: "command",
    unit: "-",
    titleEn,
    titleRu,
    encodings: ["enum", "utf8"],
    enumValues: values,
    sensitivity: "public",
  });
}

// —— Environment / climate ——
q("physical.environment.dew_point", "Cel", "Dew point", "Точка росы", { range: { min: -80, max: 60 } });
q("physical.environment.absolute_humidity", "g/m3", "Absolute humidity", "Абсолютная влажность", { range: { min: 0, max: 100 } });
q("physical.environment.wet_bulb", "Cel", "Wet-bulb temperature", "Температура по мокрому термометру");
q("physical.environment.heat_index", "Cel", "Heat index", "Индекс жары");
q("physical.environment.wind_chill", "Cel", "Wind chill", "Ветро-холодовой индекс");
q("physical.environment.uv_index", "-", "UV index", "УФ-индекс", { range: { min: 0, max: 20 }, encodings: ["f32", "u8"] });
q("physical.environment.solar_radiation", "W/m2", "Solar radiation", "Солнечная радиация", { range: { min: 0, max: 1500 } });
q("physical.environment.rainfall", "mm", "Rainfall", "Осадки", { range: { min: 0, max: 1000 } });
q("physical.environment.rainfall_rate", "mm/h", "Rainfall rate", "Интенсивность осадков");
q("physical.environment.snowfall", "mm", "Snowfall water equivalent", "Снегопад (водный эквивалент)");
q("physical.environment.cloud_cover", "%", "Cloud cover", "Облачность", { range: { min: 0, max: 100 } });
q("physical.environment.visibility", "m", "Visibility", "Видимость", { range: { min: 0, max: 100000 } });
q("physical.environment.pm1", "ug/m3", "PM1", "PM1", { range: { min: 0, max: 1000 } });
q("physical.environment.pm10", "ug/m3", "PM10", "PM10", { range: { min: 0, max: 2000 } });
q("physical.environment.o3", "ppm", "Ozone concentration", "Концентрация озона");
q("physical.environment.no2", "ppm", "NO2 concentration", "Концентрация NO2");
q("physical.environment.so2", "ppm", "SO2 concentration", "Концентрация SO2");
q("physical.environment.co", "ppm", "CO concentration", "Концентрация CO");
q("physical.environment.nh3", "ppm", "Ammonia concentration", "Концентрация аммиака");
q("physical.environment.h2s", "ppm", "H2S concentration", "Концентрация H2S");
q("physical.environment.ch4", "ppm", "Methane concentration", "Концентрация метана");
q("physical.environment.formaldehyde", "ppm", "Formaldehyde", "Формальдегид");
q("physical.environment.radon", "Bq/m3", "Radon", "Радон");
q("physical.environment.aqi", "-", "Air quality index", "Индекс качества воздуха", { encodings: ["u8", "f32"] });
q("physical.environment.soil_moisture", "%", "Soil moisture", "Влажность почвы", { range: { min: 0, max: 100 } });
q("physical.environment.soil_temperature", "Cel", "Soil temperature", "Температура почвы");
q("physical.environment.leaf_wetness", "%", "Leaf wetness", "Влажность листа", { range: { min: 0, max: 100 } });
q("physical.environment.water_temperature", "Cel", "Water temperature", "Температура воды");
q("physical.environment.water_level", "m", "Water level", "Уровень воды");
q("physical.environment.turbidity", "NTU", "Turbidity", "Мутность воды");
q("physical.environment.ph", "-", "pH", "pH", { range: { min: 0, max: 14 } });
q("physical.environment.dissolved_oxygen", "mg/L", "Dissolved oxygen", "Растворённый кислород");
q("physical.environment.conductivity", "uS/cm", "Electrical conductivity", "Электропроводность");
q("physical.environment.salinity", "ppt", "Salinity", "Солёность");
q("physical.environment.wind_speed", "m/s", "Wind speed", "Скорость ветра", { range: { min: 0, max: 150 } });
q("physical.environment.wind_direction", "deg", "Wind direction", "Направление ветра", { range: { min: 0, max: 360 } });
q("physical.environment.wind_gust", "m/s", "Wind gust", "Порыв ветра");

// —— Electrical ——
q("physical.electrical.resistance", "Ohm", "Resistance", "Сопротивление");
q("physical.electrical.capacitance", "F", "Capacitance", "Ёмкость");
q("physical.electrical.inductance", "H", "Inductance", "Индуктивность");
q("physical.electrical.apparent_power", "VA", "Apparent power", "Полная мощность");
q("physical.electrical.reactive_power", "var", "Reactive power", "Реактивная мощность");
q("physical.electrical.power_factor", "-", "Power factor", "Коэффициент мощности", { range: { min: -1, max: 1 } });
q("physical.electrical.thd", "%", "Total harmonic distortion", "КНИ", { range: { min: 0, max: 100 } });
q("physical.electrical.phase_angle", "deg", "Phase angle", "Фазовый угол");
q("physical.electrical.battery_voltage", "V", "Battery voltage", "Напряжение батареи");
q("physical.electrical.battery_current", "A", "Battery current", "Ток батареи");
q("physical.electrical.battery_soh", "%", "Battery state of health", "Здоровье батареи", { range: { min: 0, max: 100 } });
q("physical.electrical.battery_cycles", "-", "Battery cycle count", "Циклы батареи", { encodings: ["i32", "f32"] });
q("physical.electrical.battery_temperature", "Cel", "Battery temperature", "Температура батареи");
q("physical.electrical.charge_energy", "Wh", "Charged energy", "Заряженная энергия");
q("physical.electrical.discharge_energy", "Wh", "Discharged energy", "Разряженная энергия");
q("physical.electrical.grid_frequency", "Hz", "Grid frequency", "Частота сети", { range: { min: 40, max: 70 } });
q("physical.electrical.line_voltage_l1", "V", "Line voltage L1", "Напряжение L1");
q("physical.electrical.line_voltage_l2", "V", "Line voltage L2", "Напряжение L2");
q("physical.electrical.line_voltage_l3", "V", "Line voltage L3", "Напряжение L3");
q("physical.electrical.line_current_l1", "A", "Line current L1", "Ток L1");
q("physical.electrical.line_current_l2", "A", "Line current L2", "Ток L2");
q("physical.electrical.line_current_l3", "A", "Line current L3", "Ток L3");
q("physical.electrical.pv_power", "W", "Photovoltaic power", "Мощность ФЭП");
q("physical.electrical.pv_energy", "Wh", "Photovoltaic energy", "Энергия ФЭП");
q("physical.electrical.inverter_efficiency", "%", "Inverter efficiency", "КПД инвертора", { range: { min: 0, max: 100 } });

// —— Mechanical / fluid ——
q("physical.mechanical.strain", "-", "Strain", "Деформация");
q("physical.mechanical.stress", "Pa", "Stress", "Напряжение (механика)");
q("physical.mechanical.displacement", "m", "Displacement", "Перемещение");
q("physical.mechanical.vibration_rms", "m/s2", "Vibration RMS", "Вибрация RMS");
q("physical.mechanical.vibration_peak", "m/s2", "Vibration peak", "Вибрация пик");
q("physical.mechanical.rpm", "/min", "Rotational speed", "Обороты", { encodings: ["f32", "i32"] });
q("physical.mechanical.mass", "kg", "Mass", "Масса");
q("physical.mechanical.weight", "N", "Weight", "Вес");
q("physical.mechanical.density", "kg/m3", "Density", "Плотность");
q("physical.mechanical.viscosity", "Pa.s", "Viscosity", "Вязкость");
q("physical.mechanical.volume", "L", "Volume", "Объём");
q("physical.mechanical.volume_flow", "m3/h", "Volume flow", "Объёмный расход");
q("physical.mechanical.mass_flow", "kg/s", "Mass flow", "Массовый расход");
q("physical.mechanical.differential_pressure", "Pa", "Differential pressure", "Перепад давления");
q("physical.mechanical.vacuum", "Pa", "Vacuum pressure", "Вакуум");
q("physical.mechanical.level_percent", "%", "Tank level", "Уровень в ёмкости", { range: { min: 0, max: 100 } });
q("physical.mechanical.valve_position", "%", "Valve position", "Положение клапана", { range: { min: 0, max: 100 } });

// —— Motion / IMU ——
q("physical.motion.angular_velocity", "deg/s", "Angular velocity", "Угловая скорость");
q("physical.motion.angular_acceleration", "deg/s2", "Angular acceleration", "Угловое ускорение");
q("physical.motion.orientation_roll", "deg", "Roll", "Крен", { range: { min: -180, max: 180 } });
q("physical.motion.orientation_pitch", "deg", "Pitch", "Тангаж", { range: { min: -90, max: 90 } });
q("physical.motion.orientation_yaw", "deg", "Yaw", "Рыскание", { range: { min: -180, max: 180 } });
q("physical.motion.quaternion_w", "-", "Quaternion W", "Кватернион W");
q("physical.motion.quaternion_x", "-", "Quaternion X", "Кватернион X");
q("physical.motion.quaternion_y", "-", "Quaternion Y", "Кватернион Y");
q("physical.motion.quaternion_z", "-", "Quaternion Z", "Кватернион Z");
q("physical.motion.steps", "-", "Step count", "Шаги", { encodings: ["i32", "u8"] });
q("physical.motion.cadence", "/min", "Cadence", "Каденс");
q("physical.motion.distance", "m", "Distance traveled", "Пройденная дистанция");
q("physical.motion.altitude_baro", "m", "Barometric altitude", "Барометрическая высота");
spatial("physical.motion.vector3", "3D vector", "3D-вектор", {
  descriptionEn: "Record {x,y,z}",
  descriptionRu: "Запись {x,y,z}",
  sensitivity: "public",
});

// —— Geo / GNSS ——
q("physical.geo.latitude", "deg", "Latitude", "Широта", { sensitivity: "personal", range: { min: -90, max: 90 } });
q("physical.geo.longitude", "deg", "Longitude", "Долгота", { sensitivity: "personal", range: { min: -180, max: 180 } });
q("physical.geo.speed", "m/s", "Ground speed GNSS", "Путевая скорость GNSS", { sensitivity: "personal" });
q("physical.geo.course", "deg", "Course over ground", "Путевой угол", { range: { min: 0, max: 360 } });
q("physical.geo.hdop", "-", "HDOP", "HDOP");
q("physical.geo.vdop", "-", "VDOP", "VDOP");
q("physical.geo.pdop", "-", "PDOP", "PDOP");
q("physical.geo.satellites", "-", "Satellite count", "Число спутников", { encodings: ["u8", "i16"] });
q("physical.geo.fix", "m", "GNSS fix accuracy", "Точность фиксации GNSS", { sensitivity: "personal" });
enu("physical.geo.fix_quality", ["none", "gps", "dgps", "rtk_float", "rtk_fixed"], "GNSS fix quality", "Качество GNSS-фикса");
spatial("physical.geo.geopoint3d", "3D geopoint", "Геоточка 3D", {
  descriptionEn: "Record {lat,lon,alt} WGS84",
  descriptionRu: "Запись {lat,lon,alt} WGS84",
});

// —— Optical ——
q("physical.optical.luminance", "cd/m2", "Luminance", "Яркость (фотометрия)");
q("physical.optical.luminous_flux", "lm", "Luminous flux", "Световой поток");
q("physical.optical.color_temperature", "K", "Color temperature", "Цветовая температура", { range: { min: 1000, max: 20000 } });
q("physical.optical.color_x", "-", "CIE chromaticity x", "CIE x");
q("physical.optical.color_y", "-", "CIE chromaticity y", "CIE y");
q("physical.optical.infrared", "-", "IR intensity", "ИК-интенсивность");
q("physical.optical.ultraviolet", "-", "UV intensity", "УФ-интенсивность");
q("physical.optical.proximity", "-", "Proximity", "Приближение");
q("physical.optical.gesture", "-", "Gesture code", "Код жеста", { encodings: ["u8", "utf8"] });

// —— Acoustic ——
q("physical.acoustic.sound_pressure", "Pa", "Sound pressure", "Звуковое давление");
q("physical.acoustic.spl", "dB", "Sound pressure level", "Уровень звука SPL", { range: { min: 0, max: 200 } });
q("physical.acoustic.noise_leq", "dB", "Equivalent noise level", "Эквивалентный уровень шума");
q("physical.acoustic.frequency", "Hz", "Acoustic frequency", "Акустическая частота");

// —— Thermal ——
q("physical.thermal.heat_flux", "W/m2", "Heat flux", "Тепловой поток");
q("physical.thermal.thermal_resistance", "K/W", "Thermal resistance", "Тепловое сопротивление");
q("physical.thermal.surface_temperature", "Cel", "Surface temperature", "Температура поверхности");
q("physical.thermal.core_temperature", "Cel", "Core temperature", "Температура ядра");

// —— Magnetic / radiation ——
q("physical.magnetic.field_strength", "T", "Magnetic field", "Магнитное поле");
q("physical.magnetic.heading", "deg", "Magnetic heading", "Магнитный курс", { range: { min: 0, max: 360 } });
q("physical.radiation.dose_rate", "uSv/h", "Dose rate", "Мощность дозы");
q("physical.radiation.dose", "uSv", "Absorbed dose equivalent", "Эквивалентная доза");
q("physical.radiation.counts", "-", "Radiation counts", "Счётчики излучения", { encodings: ["i32", "f32"] });

// —— Consumer health (non-clinical) ——
q("physical.health.respiratory_rate", "/min", "Respiratory rate", "Частота дыхания", { sensitivity: "personal", range: { min: 0, max: 80 } });
q("physical.health.blood_pressure_systolic", "mm[Hg]", "Systolic blood pressure", "Систолическое давление", { sensitivity: "personal" });
q("physical.health.blood_pressure_diastolic", "mm[Hg]", "Diastolic blood pressure", "Диастолическое давление", { sensitivity: "personal" });
q("physical.health.glucose", "mg/dL", "Blood glucose (consumer)", "Глюкоза (потребительский)", { sensitivity: "personal" });
q("physical.health.weight", "kg", "Body weight", "Масса тела", { sensitivity: "personal" });
q("physical.health.height", "m", "Body height", "Рост", { sensitivity: "personal" });
q("physical.health.bmi", "kg/m2", "BMI", "ИМТ", { sensitivity: "personal" });
q("physical.health.calories", "kcal", "Calories", "Калории", { sensitivity: "personal" });
q("physical.health.sleep_duration", "s", "Sleep duration", "Длительность сна", { sensitivity: "personal" });
q("physical.health.stress_index", "-", "Stress index", "Индекс стресса", { sensitivity: "personal" });
q("physical.health.vo2max", "mL/min/kg", "VO2 max (estimate)", "VO2 max (оценка)", { sensitivity: "personal" });
q("physical.health.hrv_rmssd", "ms", "HRV RMSSD", "ВСР RMSSD", { sensitivity: "personal" });

// —— Building HVAC / home ——
q("building.hvac.supply_air_temperature", "Cel", "Supply air temperature", "Температура притока");
q("building.hvac.return_air_temperature", "Cel", "Return air temperature", "Температура обратки воздуха");
q("building.hvac.supply_water_temperature", "Cel", "Supply water temperature", "Температура подачи воды");
q("building.hvac.return_water_temperature", "Cel", "Return water temperature", "Температура обратки воды");
q("building.hvac.setpoint_heating", "Cel", "Heating setpoint", "Уставка отопления");
q("building.hvac.setpoint_cooling", "Cel", "Cooling setpoint", "Уставка охлаждения");
q("building.hvac.setpoint_humidity", "%", "Humidity setpoint", "Уставка влажности", { range: { min: 0, max: 100 } });
q("building.hvac.fan_speed", "%", "Fan speed", "Скорость вентилятора", { range: { min: 0, max: 100 } });
q("building.hvac.airflow", "m3/h", "Airflow", "Расход воздуха");
q("building.hvac.filter_pressure_drop", "Pa", "Filter pressure drop", "Перепад на фильтре");
q("building.hvac.occupancy_count", "-", "Occupancy count", "Число людей", { encodings: ["u8", "i16"] });
logical("building.hvac.occupancy", "Occupied", "Присутствие", { encodings: ["bool"] });
enu("building.hvac.mode", ["off", "heat", "cool", "auto", "fan", "dry"], "HVAC mode", "Режим HVAC");
q("building.lighting.brightness", "%", "Light brightness", "Яркость света", { range: { min: 0, max: 100 } });
q("building.lighting.color_hue", "deg", "Light hue", "Оттенок света", { range: { min: 0, max: 360 } });
q("building.lighting.color_saturation", "%", "Light saturation", "Насыщенность", { range: { min: 0, max: 100 } });
logical("building.lighting.on", "Light on", "Свет включён");
q("building.meter.water_volume", "L", "Water volume", "Объём воды");
q("building.meter.gas_volume", "m3", "Gas volume", "Объём газа");
q("building.meter.heat_energy", "Wh", "Heat energy", "Тепловая энергия");
logical("building.security.door_open", "Door open", "Дверь открыта");
logical("building.security.window_open", "Window open", "Окно открыто");
logical("building.security.motion", "Motion detected", "Движение обнаружено");
logical("building.security.smoke", "Smoke detected", "Дым обнаружен");
logical("building.security.leak", "Water leak", "Протечка воды");
logical("building.security.glass_break", "Glass break", "Разбитие стекла");
q("building.security.battery", "%", "Sensor battery", "Батарея датчика", { range: { min: 0, max: 100 } });
enu("building.security.alarm_state", ["disarmed", "armed_home", "armed_away", "triggered"], "Alarm state", "Состояние охраны");

// —— Network / RF ——
q("network.snr", "dB", "Signal-to-noise ratio", "Отношение сигнал/шум");
q("network.packet_loss", "%", "Packet loss", "Потери пакетов", { range: { min: 0, max: 100 } });
q("network.latency", "ms", "Latency", "Задержка");
q("network.jitter", "ms", "Jitter", "Джиттер");
q("network.bandwidth", "bit/s", "Bandwidth", "Пропускная способность");
q("network.bytes_sent", "By", "Bytes sent", "Байт отправлено", { encodings: ["i32", "f64"] });
q("network.bytes_recv", "By", "Bytes received", "Байт получено", { encodings: ["i32", "f64"] });
q("network.tx_power", "dBm", "TX power", "Мощность передатчика");
q("network.channel", "-", "RF channel", "Радиоканал", { encodings: ["u8", "i16"] });
q("network.lqi", "-", "Link quality indicator", "LQI", { encodings: ["u8", "f32"] });
enu("network.link_state", ["down", "up", "degraded"], "Link state", "Состояние канала");
id("network.ssid", "Wi-Fi SSID", "SSID Wi-Fi", { sensitivity: "internal" });
id("network.ip_address", "IP address", "IP-адрес", { sensitivity: "internal" });
id("network.ble_address", "BLE address", "Адрес BLE", { sensitivity: "internal" });

// —— Identity / meta ——
id("identity.manufacturer", "Manufacturer", "Производитель");
id("identity.model", "Model", "Модель");
id("identity.firmware_version", "Firmware version", "Версия прошивки");
id("identity.hardware_version", "Hardware version", "Версия железа");
id("identity.sku", "SKU", "Артикул");
id("identity.imei", "IMEI", "IMEI", { sensitivity: "restricted" });
id("identity.iccid", "ICCID", "ICCID", { sensitivity: "restricted" });
id("identity.asset_tag", "Asset tag", "Инвентарный номер");
id("identity.owner", "Owner id", "Владелец");
id("identity.site", "Site id", "Площадка / объект");

// —— Temporal ——
q("temporal.timezone_offset", "min", "Timezone offset", "Смещение часового пояса", { encodings: ["i16", "i32"] });
q("temporal.sample_interval", "s", "Sample interval", "Интервал выборки");
q("temporal.uptime_ms", "ms", "Uptime milliseconds", "Аптайм мс", { encodings: ["i32", "f64"] });
q("temporal.deadline", "s", "Deadline unix time", "Дедлайн (unix)", { encodings: ["i32", "f64"] });

// —— Logical / quality ——
logical("logical.enabled", "Enabled", "Включено");
logical("logical.online", "Online", "Онлайн");
logical("logical.error", "Error flag", "Флаг ошибки");
logical("logical.warning", "Warning flag", "Флаг предупреждения");
q("logical.quality", "%", "Data quality", "Качество данных", { range: { min: 0, max: 100 } });
enu("logical.severity", ["good", "uncertain", "bad", "stale"], "Data reliability", "Достоверность данных");
enu("logical.priority", ["low", "normal", "high", "critical"], "Priority", "Приоритет");
q("logical.sequence", "-", "Sequence number", "Номер последовательности", { encodings: ["i32", "u8"] });

// —— Actuation ——
cmd("actuation.open_close", ["open", "close", "stop"], "Open/close command", "Команда открыть/закрыть");
cmd("actuation.dim", ["up", "down", "stop"], "Dim command", "Команда диммера");
q("actuation.position", "%", "Actuator position", "Положение привода", { range: { min: 0, max: 100 } });
q("actuation.speed", "%", "Actuator speed", "Скорость привода", { range: { min: 0, max: 100 } });
q("actuation.torque_limit", "N.m", "Torque limit", "Ограничение момента");
enu("actuation.state", ["idle", "moving", "holding", "fault"], "Actuator state", "Состояние привода");

// —— Media ——
media("media.video_ref", "Video reference", "Ссылка на видео");
media("media.document_ref", "Document reference", "Ссылка на документ");
media("media.firmware_uri", "Firmware URI", "URI прошивки");
q("media.file_size", "By", "File size", "Размер файла", { encodings: ["i32", "f64"] });
id("media.content_type", "MIME type", "MIME-тип");

// —— Computing / edge ——
q("compute.cpu_load", "%", "CPU load", "Загрузка CPU", { range: { min: 0, max: 100 } });
q("compute.memory_used", "%", "Memory used", "Использование памяти", { range: { min: 0, max: 100 } });
q("compute.disk_used", "%", "Disk used", "Использование диска", { range: { min: 0, max: 100 } });
q("compute.temperature", "Cel", "SoC temperature", "Температура SoC");
q("compute.process_count", "-", "Process count", "Число процессов", { encodings: ["i32"] });

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ layer: "A", name: "core", types }, null, 2));
console.log(`Wrote ${types.length} types → ${out}`);
