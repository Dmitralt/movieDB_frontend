import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';


export function sanitizeHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}


export function sanitizeArray(arr: string[]): string[] {
    return arr.map(item => sanitizeHtml(item));
}


export function SanitizeHtml() {
    return function (target: any, propertyKey: string) {
        const originalSet = Object.getOwnPropertyDescriptor(target, propertyKey)?.set;

        Object.defineProperty(target, propertyKey, {
            set: function (value: string) {
                if (typeof value === 'string') {
                    value = sanitizeHtml(value);
                }
                if (originalSet) {
                    originalSet.call(this, value);
                } else {
                    this[`_${propertyKey}`] = value;
                }
            },
            get: function () {
                return this[`_${propertyKey}`];
            }
        });
    };
}

export function SanitizeArray() {
    return function (target: any, propertyKey: string) {
        const originalSet = Object.getOwnPropertyDescriptor(target, propertyKey)?.set;

        Object.defineProperty(target, propertyKey, {
            set: function (value: string[]) {
                if (Array.isArray(value)) {
                    value = sanitizeArray(value);
                }
                if (originalSet) {
                    originalSet.call(this, value);
                } else {
                    this[`_${propertyKey}`] = value;
                }
            },
            get: function () {
                return this[`_${propertyKey}`];
            }
        });
    };
}

@ValidatorConstraint({ name: 'isValidYear', async: false })
export class IsValidYearConstraint implements ValidatorConstraintInterface {
    validate(year: number, args: ValidationArguments) {
        const currentYear = new Date().getFullYear();
        return year >= 1888 && year <= currentYear;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Рік повинен бути між 1888 та поточним роком';
    }
}

@ValidatorConstraint({ name: 'isValidRating', async: false })
export class IsValidRatingConstraint implements ValidatorConstraintInterface {
    validate(rating: number, args: ValidationArguments) {
        return rating >= 0 && rating <= 10;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Рейтинг повинен бути від 0 до 10';
    }
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isValidStringArray(arr: any[]): boolean {
    return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}

export function isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= 1888 && year <= currentYear;
}

export function isValidRating(rating: number): boolean {
    return rating >= 0 && rating <= 10;
} 