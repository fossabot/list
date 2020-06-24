import ChipInput from 'material-ui-chip-input';
import FormikAutocomplete from './FormikAutocomplete';
import React from 'react';
import Scroll from 'react-scroll';
import { makeStyles } from '@material-ui/core';
import { useFormikContext } from 'formik';

const useStyles = makeStyles(() => ({
    fieldRow: {
        marginBottom: '2em',
        width: '100%',
    },
}));

interface SelectFieldProps {
    name: string;
    label: string;
    values: (string | undefined)[];
}

export default function Transmission(): JSX.Element {
    const { setFieldValue, setTouched } = useFormikContext();
    const classes = useStyles();
    return (
        <Scroll.Element name="transmission">
            <fieldset>
                <legend>Transmission</legend>
                <div className={classes.fieldRow}>
                    <FormikAutocomplete
                        name="transmissionRoutes"
                        label="Route of transmission"
                        multiple={true}
                        optionsLocation="https://raw.githubusercontent.com/open-covid-data/healthmap-gdo-temp/master/suggest/route_of_transmission.txt"
                    />
                </div>
                <div className={classes.fieldRow}>
                    <FormikAutocomplete
                        name="transmissionPlaces"
                        label="Places of transmission"
                        multiple={true}
                        optionsLocation="https://raw.githubusercontent.com/open-covid-data/healthmap-gdo-temp/master/suggest/place_of_transmission.txt"
                    />
                </div>
                <ChipInput
                    fullWidth
                    alwaysShowPlaceholder
                    placeholder="Contacted case IDs"
                    onBlur={(): void =>
                        setTouched({ transmissionLinkedCaseIds: true })
                    }
                    onChange={(values): void => {
                        setFieldValue(
                            'transmissionLinkedCaseIds',
                            values ?? undefined,
                        );
                    }}
                ></ChipInput>
            </fieldset>
        </Scroll.Element>
    );
}