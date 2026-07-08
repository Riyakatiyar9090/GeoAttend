/**
 * Haversine Formula Implementation
 *
 * Calculates the great-circle distance between two points
 * on a sphere (Earth) given their latitude and longitude.
 *
 * Formula reference: https://www.movable-type.co.uk/scripts/latlong.html
 *
 * Earth is modelled as a sphere with radius 6,371,000 metres.
 * Real-world accuracy: ±0.5% (sufficient for classroom-level verification).
 */

const EARTH_RADIUS_METRES = 6_371_000;

/**
 * Convert degrees to radians.
 * @param {number} degrees
 */
const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Calculate the straight-line (great-circle) distance
 * between two GPS coordinates in metres.
 *
 * @param {number} lat1  - Point A latitude  (decimal degrees)
 * @param {number} lng1  - Point A longitude (decimal degrees)
 * @param {number} lat2  - Point B latitude  (decimal degrees)
 * @param {number} lng2  - Point B longitude (decimal degrees)
 * @returns {number} Distance in metres (rounded to 2 decimal places)
 */
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceMetres = EARTH_RADIUS_METRES * c;

  return Math.round(distanceMetres * 100) / 100; // 2 decimal places
};

/**
 * Check whether a point falls within a circular geofence.
 *
 * @param {object} opts
 * @param {number} opts.classroomLat   - Geofence centre latitude
 * @param {number} opts.classroomLng   - Geofence centre longitude
 * @param {number} opts.radius         - Allowed radius in metres
 * @param {number} opts.studentLat     - Student's current latitude
 * @param {number} opts.studentLng     - Student's current longitude
 *
 * @returns {{
 *   withinRadius:  boolean,
 *   distance:      number,
 *   radius:        number,
 *   overshoot:     number,   // metres outside radius (0 if inside)
 *   accuracy:      string,   // human-readable proximity label
 * }}
 */
const isWithinRadius = ({
  classroomLat,
  classroomLng,
  radius,
  studentLat,
  studentLng,
}) => {
  const distance = haversineDistance(
    classroomLat,
    classroomLng,
    studentLat,
    studentLng,
  );

  const withinRadius = distance <= radius;
  const overshoot = withinRadius
    ? 0
    : Math.round((distance - radius) * 100) / 100;

  // Human-readable label for how close the student is
  let accuracy;
  if (distance <= radius * 0.33)
    accuracy = "Excellent"; // within 1/3 of radius
  else if (distance <= radius * 0.66)
    accuracy = "Good"; // within 2/3 of radius
  else if (distance <= radius)
    accuracy = "Borderline"; // close to the edge
  else if (overshoot <= 10)
    accuracy = "Just outside"; // within 10m outside
  else if (overshoot <= 50) accuracy = "Outside";
  else accuracy = "Far outside";

  return { withinRadius, distance, radius, overshoot, accuracy };
};

/**
 * Calculate the compass bearing from point A to point B.
 * Useful for guiding students toward the classroom.
 *
 * @param {number} lat1  - From latitude
 * @param {number} lng1  - From longitude
 * @param {number} lat2  - To latitude
 * @param {number} lng2  - To longitude
 * @returns {number} Bearing in degrees (0–360, clockwise from North)
 */
const calculateBearing = (lat1, lng1, lat2, lng2) => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lng2 - lng1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const deg = ((θ * 180) / Math.PI + 360) % 360;

  return Math.round(deg);
};

/**
 * Convert a bearing (degrees) to a compass direction label.
 * @param {number} bearing - 0–360
 * @returns {string} e.g. 'NE', 'SW'
 */
const bearingToCompass = (bearing) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};

/**
 * Build a complete location analysis result.
 * Single entry point used by the location service.
 *
 * @param {object} classroom - { lat, lng, radius }
 * @param {object} student   - { lat, lng }
 */
const analyseLocation = (classroom, student) => {
  const radiusResult = isWithinRadius({
    classroomLat: classroom.lat,
    classroomLng: classroom.lng,
    radius: classroom.radius,
    studentLat: student.lat,
    studentLng: student.lng,
  });

  const bearing = calculateBearing(
    student.lat,
    student.lng,
    classroom.lat,
    classroom.lng,
  );
  const compassDirection = bearingToCompass(bearing);

  return {
    ...radiusResult,
    bearing,
    compassDirection,
    classroomCoordinates: { lat: classroom.lat, lng: classroom.lng },
    studentCoordinates: { lat: student.lat, lng: student.lng },
  };
};

module.exports = {
  haversineDistance,
  isWithinRadius,
  calculateBearing,
  bearingToCompass,
  analyseLocation,
  EARTH_RADIUS_METRES,
};
