import { faker } from '@faker-js/faker';

/**
 * Generates a random display name using faker
 * Format: {color}{firstName}{animalType}
 *
 * @returns A unique display name string
 *
 * @example
 * generateDisplayName() // "BlueJohnDog"
 */
export const generateDisplayName = (): string => {
  const character = faker.person.firstName();
  const animal = faker.animal.type();
  const color = faker.color.human();
  return `${color}${character}${animal}`;
};
