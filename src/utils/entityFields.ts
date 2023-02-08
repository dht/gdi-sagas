import { entityFields, EqualFn, keyMap } from '../data/allEntityFields';

export type IEntityFields = {
    required: string[];
    optional: string[];
    fieldTypes: Json;
};

export const parseEntityFields = (typeString: string): IEntityFields => {
    const output: IEntityFields = {
        required: [],
        optional: [],
        fieldTypes: {},
    };

    const regexType = /export type I[a-z]+ = {([^}]+)};?/gim;

    const match = regexType.exec(typeString);

    if (!match) {
        return output;
    }

    const lines = match[1].split(';').map((line) => line.trim());

    lines.forEach((line) => {
        const parts = line.split(':');

        if (parts.length === 2) {
            const isOptional = parts[0].includes('?');
            const fieldName = parts[0].replace('?', '').trim();
            const fieldType = parts[1].trim();

            if (isOptional) {
                output.optional.push(fieldName);
            } else {
                output.required.push(fieldName);
            }

            output.fieldTypes[fieldName] = fieldType;
        }
    });

    return output;
};

type ErrorByIndex = Record<number, string[]>;

type ValidateResponse = {
    isOk: boolean;
    errorsByIndex: ErrorByIndex;
};

export const validateData = (
    items: Json[],
    fieldString: string
): ValidateResponse => {
    const fields = parseEntityFields(fieldString);

    const output: ValidateResponse = {
        isOk: true,
        errorsByIndex: {},
    };

    const addError = (index: number, errorMessage: string) => {
        output.errorsByIndex[index] = output.errorsByIndex[index] || [];
        output.errorsByIndex[index].push(errorMessage);
    };

    items.forEach((item, index) => {
        fields.required.forEach((field: any) => {
            if (typeof item[field] === 'undefined') {
                addError(index, `Missing required field: ${field}`);
            }
        });

        [...fields.optional, ...fields.required].forEach((field: any) => {
            if (item[field]) {
                const fieldType = fields.fieldTypes[field];

                switch (fieldType) {
                    case 'string':
                        if (typeof item[field] !== 'string') {
                            addError(index, `Field ${field} is not a string`);
                        }
                        break;
                    case 'number':
                        if (typeof item[field] !== 'number') {
                            addError(index, `Field ${field} is not a number`);
                        }
                        break;
                    case 'string[]':
                        if (!Array.isArray(item[field])) {
                            addError(index, `Field ${field} is not an array`);
                        } else {
                            const isStringArray = item[field].every(
                                (item: any) => typeof item === 'string'
                            );

                            if (!isStringArray) {
                                addError(
                                    index,
                                    `Field ${field} is not an array of strings`
                                );
                            }
                        }
                        break;
                    case 'boolean':
                        if (typeof item[field] !== 'boolean') {
                            addError(index, `Field ${field} is not a boolean`);
                        }
                        break;
                }
            }
        });

        Object.keys(item).forEach((field: any) => {
            if (
                !fields.required.includes(field) &&
                !fields.optional.includes(field)
            ) {
                addError(index, `Unknown field: ${field}`);
            }
        });
    });

    if (Object.keys(output.errorsByIndex).length > 0) {
        output.isOk = false;
    }

    return output;
};

type ValidateResponseForFile = {
    isOk: boolean;
    errorsByEntity: Record<string, ErrorByIndex>;
};

export const validateFileContent = (content: Json) => {
    const output: ValidateResponseForFile = {
        isOk: true,
        errorsByEntity: {},
    };

    Object.keys(content).forEach((key) => {
        const entityFieldKey = keyMap[key];
        const entityField = entityFields[entityFieldKey];

        const response = validateData(content[key], entityField);

        if (!response.isOk) {
            output.errorsByEntity[key] = response.errorsByIndex;
            output.isOk = false;
        }
    });

    return output;
};

export const fixFileContent = (content: Json) => {
    const output: Json = {};

    Object.keys(content).forEach((key) => {
        const destKey = keyMap[key];

        output[destKey] = content[key];
    });

    return output;
};

export const existsInCurrentItems = (
    item: Json,
    items: Json[],
    equalFn: EqualFn
) => {
    return items.some((currentItem) => equalFn(item, currentItem));
};
