import { parseEntityFields, validateData } from './entityFields';

const typeString = `export type IPerson = {
    id: string;
    firstName: string;
    lastName?: string;
    ratio?: number;
    tags: string[];
    isLocal?: boolean;
};
`;

describe('entityFields', () => {
    it('parseEntityFields', () => {
        expect(parseEntityFields(typeString)).toEqual({
            required: ['id', 'firstName', 'tags'],
            optional: ['lastName', 'ratio', 'isLocal'],
            fieldTypes: {
                id: 'string',
                firstName: 'string',
                lastName: 'string',
                ratio: 'number',
                tags: 'string[]',
                isLocal: 'boolean',
            },
        });
    });

    it('validateData: missing required fields', () => {
        expect(validateData([{}], typeString)).toEqual({
            isOk: false,
            errorsByIndex: {
                0: [
                    'Missing required field: id',
                    'Missing required field: firstName',
                    'Missing required field: tags',
                ],
            },
        });
    });

    it('validateData: ok', () => {
        expect(
            validateData(
                [
                    {
                        id: '1',
                        firstName: 'John',
                        tags: ['a', 'b'],
                    },
                ],
                typeString
            )
        ).toEqual({
            isOk: true,
            errorsByIndex: {},
        });
    });

    it('validateData: invalid type', () => {
        expect(
            validateData(
                [
                    {
                        id: 1,
                        firstName: 'John',
                        tags: ['a', 'b'],
                    },
                ],
                typeString
            )
        ).toEqual({
            isOk: false,
            errorsByIndex: {
                0: ['Field id is not a string'],
            },
        });
    });

    it('validateData: field not allowed', () => {
        expect(
            validateData(
                [
                    {
                        id: '1',
                        firstName: 'John',
                        tags: ['a', 'b'],
                        newField: true,
                    },
                ],
                typeString
            )
        ).toEqual({
            isOk: false,
            errorsByIndex: {
                0: ['Unknown field: newField'],
            },
        });
    });
});
