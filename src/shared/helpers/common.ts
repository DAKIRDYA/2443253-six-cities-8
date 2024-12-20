import chalk from 'chalk';
import { FlatOffer, Location, Offer, User } from '../types/index.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../../rest/types/validation-error-field.type.js';
import { ApplicationError } from '../../rest/index.js';

//Случайное число в диапазоне [min, max]
export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

//Случайный набор значений из массива
export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(1, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

//Случайное значение из массива
export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

//Печать свойства
export function printProperty (key: string, value: FlatOffer) {
  console.log(`${chalk.green(key)}: ${chalk.red(value)}`);
}

//Печать предложения
export function printOffer (numberOffer:number,offer: Offer):void {
  console.log(chalk.bgYellow(`Предложение ${numberOffer}:`));
  for (const [key, value] of Object.entries(offer)) {
    if (typeof value === 'object') {
      printObject(value as User | Location);
    } else {
      printProperty(key,value as FlatOffer);
    }
  }
}
//Печать вложенных объектов
export function printObject (object: User | Location): void {
  for (const [key, value] of Object.entries(object)) {
    printProperty(key,value);
  }
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

//создает объект со свойством - ошибка
export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
