'''Script to convert CSV line-list data into json compliant with the MongoDB schema.'''

import argparse
import csv
import logging
import json
import pandas as pd
import sys
from constants import CSV_ID_FIELD, JSON_FIELDS
from converters import convert_demographics, convert_events, convert_imported_case
from pandas import DataFrame


def main():
    logging.basicConfig(filename='convert_data.log',
                        filemode='w', level=logging.DEBUG)

    parser = argparse.ArgumentParser(
        description='Convert CSV line-list data into json compliant with the MongoDB schema.')
    parser.add_argument('--infile', type=argparse.FileType('r'))
    parser.add_argument('--outfile', nargs='?', type=argparse.FileType('w', encoding='UTF-8'),
                        default=sys.stdout)
    parser.add_argument('--sample_rate', default=1.0, type=float)

    args = parser.parse_args()
    logging.info("Args: %s", args)

    print('Reading data from', args.infile.name)
    original_cases = read_csv(args.infile)

    if args.sample_rate < 1.0:
        original_rows = original_cases.shape[0]
        original_cases = original_cases.sample(frac=args.sample_rate)
        print(
            f'Downsampling to {args.sample_rate*100}% of cases from {original_rows} to {original_cases.shape[0]} rows')

    print('Converting data to new schema')
    converted_cases = convert(original_cases)

    print('Writing results to', args.outfile.name)
    write_json(converted_cases, args.outfile)

    print('Great success! 🎉')


def read_csv(infile: str) -> DataFrame:
    return pd.read_csv(infile, header=0, low_memory=False, encoding='utf-8')


def convert(cases: DataFrame) -> DataFrame:
    logging.info('Converting %d cases', len(cases))

    # [[demographics]]
    cases['demographics'] = cases.apply(
        lambda x: convert_demographics(x[CSV_ID_FIELD], x['age'], x['sex']), axis=1)

    # [[events]]
    cases['events'] = cases.apply(
        lambda x: convert_events(x[CSV_ID_FIELD], {
            'onsetSymptoms': x['date_onset_symptoms'],
            'admissionHospital': x['date_admission_hospital'],
            'confirmed': x['date_confirmation'],
            'deathOrDischarge': x['date_death_or_discharge']
        }, x['outcome']), axis=1)

    # Archive the original fields.
    cases['importedCase'] = cases.apply(
        lambda x: convert_imported_case(x[CSV_ID_FIELD],
                                        x[cases.columns.difference(JSON_FIELDS)]), axis=1)

    # Filter down to only the new fields.
    return cases.filter(JSON_FIELDS)


def write_json(cases: DataFrame, outfile: str) -> None:
    json.dump([row.dropna().to_dict()
               for index, row in cases.iterrows()], outfile, indent=2)


if __name__ == '__main__':
    main()
