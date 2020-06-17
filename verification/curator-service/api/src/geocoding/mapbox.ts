import { GeocodeResult, Resolution } from './geocoder';
import Geocoding, {
    GeocodeFeature,
    GeocodeMode,
    GeocodeResponse,
    GeocodeService,
} from '@mapbox/mapbox-sdk/services/geocoding';

import { MapiResponse } from '@mapbox/mapbox-sdk/lib/classes/mapi-response';

// getFeatureTypeFromContext will return the feature 'text' field if it is of the provided type.
// The types in the context fields are a prefix of the ID. E.g 'region.foo' will be a feature of type 'region'.
function getFeatureTypeFromContext(
    context: GeocodeFeature[],
    type: string,
): string {
    for (const f of context) {
        if (f.id.startsWith(type)) {
            return f.text;
        }
    }
    return '';
}

// Gets the finest resolution contained in the features.
function getResolution(features: GeocodeFeature[]): Resolution {
    // IDs contain the type of features in "place.someid" format.
    const types = new Set(
        features.map((f: GeocodeFeature): string =>
            f.id.substring(0, f.id.indexOf('.')),
        ),
    );
    // Go through each type from finest to largest and return the first match.
    if (types.has('poi')) {
        return Resolution.Point;
    } else if (types.has('place')) {
        return Resolution.Admin3;
    } else if (types.has('district')) {
        return Resolution.Admin2;
    } else if (types.has('region')) {
        return Resolution.Admin1;
    }
    return Resolution.Country;
}

export default class MapboxGeocoder {
    private geocodeService: GeocodeService;
    constructor(accessToken: string, private readonly endpoint: GeocodeMode) {
        this.geocodeService = Geocoding({
            accessToken: accessToken,
        });
    }

    async geocode(query: string): Promise<GeocodeResult[]> {
        try {
            // TODO: Add LRU cache.
            const resp: MapiResponse = await this.geocodeService
                .forwardGeocode({
                    mode: this.endpoint,
                    query: query,
                    language: ['en'],
                    limit: 5,
                })
                .send();
            const features = (resp.body as GeocodeResponse).features;
            return features.map((feature) => {
                return {
                    geometry: {
                        longitude: feature.center[0],
                        latitude: feature.center[1],
                    },
                    country: getFeatureTypeFromContext(
                        [feature, ...feature.context],
                        'country',
                    ),
                    administrativeAreaLevel1: getFeatureTypeFromContext(
                        [feature, ...feature.context],
                        'region',
                    ),
                    administrativeAreaLevel2: getFeatureTypeFromContext(
                        [feature, ...feature.context],
                        'district',
                    ),
                    administrativeAreaLevel3: getFeatureTypeFromContext(
                        [feature, ...feature.context],
                        'place',
                    ),
                    place: getFeatureTypeFromContext(
                        [feature, ...feature.context],
                        'poi',
                    ),
                    name: feature.text,
                    geoResolution: getResolution([feature, ...feature.context]),
                };
            });
        } catch (e) {
            throw e;
        }
    }
}