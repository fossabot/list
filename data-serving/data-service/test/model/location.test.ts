import { LocationDocument, locationSchema } from '../../src/model/location';

import { Error } from 'mongoose';
import fullModel from './data/location.full.json';
import minimalModel from './data/location.minimal.json';
import mongoose from 'mongoose';

const Location = mongoose.model<LocationDocument>('Location', locationSchema);

describe('validate', () => {
    it('empty location is invalid', async () => {
        return new Location({}).validate((e) => {
            expect(e.name).toBe(Error.ValidationError.name);
        });
    });

    it('a location with only country is valid', async () => {
        return new Location({ country: 'United States' }).validate();
    });

    it('a location with only administrativeAreaLevel1 is valid', async () => {
        return new Location({
            administrativeAreaLevel1: 'New York',
        }).validate();
    });

    it('a location with only administrativeAreaLevel2 is valid', async () => {
        return new Location({
            administrativeAreaLevel2: 'Kings County',
        }).validate();
    });

    it('a location with only locality is valid', async () => {
        return new Location({ locality: 'Brooklyn' }).validate();
    });

    it('a latitude without a longitude is invalid', async () => {
        return new Location({
            ...minimalModel,
            geometry: {
                latitude: 40.6,
            },
        }).validate((e) => {
            expect(e.name).toBe(Error.ValidationError.name);
        });
    });

    it('a longitude without a latitude is invalid', async () => {
        return new Location({
            ...minimalModel,
            geometry: {
                longitude: -73.9,
            },
        }).validate((e) => {
            expect(e.name).toBe(Error.ValidationError.name);
        });
    });

    it('a fully specified location is valid', async () => {
        return new Location(fullModel).validate();
    });

    it('validators work for embedded locations', async () => {
        const FakeModel = mongoose.model(
            'FakeDocument',
            new mongoose.Schema({
                location: locationSchema,
            }),
        );
        return new FakeModel({ location: {} }).validate((e) => {
            expect(e.name).toBe(Error.ValidationError.name);
        });
    });
});