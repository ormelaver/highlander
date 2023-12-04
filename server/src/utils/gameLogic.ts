import turf from '@turf/turf';

/**
 * Determines if the user's position is within a specified radius of the goal position.
 * @param userPosition The user's current position as [longitude, latitude].
 * @param goalPosition The goal position as [longitude, latitude].
 * @returns True if the user is within the goal radius, false otherwise.
 */
export function isWithinGoalRadius(
  userPosition: [number, number],
  goalPosition: [number, number],
  goalRadius: number = 10
): boolean {
  // Create points for Turf.js
  const from = turf.point(userPosition);
  const to = turf.point(goalPosition);

  // Calculate the distance in meters
  const distance = turf.distance(from, to, { units: 'meters' });

  // Check if the distance is within the specified radius (default 10 meters)
  return distance <= goalRadius;
}
