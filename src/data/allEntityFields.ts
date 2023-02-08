import { typeContacts } from './entityField.contacts';
import { typeLeads } from './entityField.leads';

type NodeDefinition = {
    acceptedKeys: string[];
    actionCreator: (payload: Json) => Action;
    selector: (state: Json) => Json;
    equality: EqualFn;
};

export type EqualFn = (a: Json, b: Json) => boolean;

export const contacts: NodeDefinition = {
    acceptedKeys: ['people', 'persons', 'contacts'],
    actionCreator: (payload: Json) => ({
        type: 'ADD_PERSON',
        payload,
    }),
    selector: (state: Json) => state.ppl?.persons,
    equality: (a: Json, b: Json) => {
        return a.firstName === b.firstName && a.lastName === b.lastName;
    },
};

export const leads: NodeDefinition = {
    acceptedKeys: ['leads'],
    actionCreator: (payload: Json) => ({
        type: 'ADD_LEAD',
        payload,
    }),
    selector: (state: Json) => state.leads?.leads,
    equality: (a: Json, b: Json) => {
        return (
            a.leadName === b.leadName || a.leadCompanyName === b.leadCompanyName
        );
    },
};

export const all: Record<string, NodeDefinition> = {
    contacts,
    leads,
};

export const keyMap: Record<string, string> = Object.keys(all).reduce(
    (acc, key) => {
        const entity = (all as any)[key];

        entity.acceptedKeys.forEach((acceptedKey: string) => {
            acc[acceptedKey] = key;
        });

        return acc;
    },
    {} as Json
);

export const entityFields: Record<string, string> = {
    contacts: typeContacts,
    leads: typeLeads,
};
