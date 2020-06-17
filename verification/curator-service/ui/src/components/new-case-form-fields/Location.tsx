import { Typography, withStyles } from '@material-ui/core';

import React from 'react';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core/styles';

const styles = () =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        column: {
            marginRight: '1em',
        },
    });

interface Location {
    type: string;
    country: string;
    adminArea1?: string;
    adminArea2?: string;
    latitude: number;
    longitude: number;
}

// Cf. https://material-ui.com/guides/typescript/#augmenting-your-props-using-withstyles
interface Props extends WithStyles<typeof styles> {
    location?: Location;
}

class Profile extends React.Component<Props, {}> {
    render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.column}>
                    <p>
                        <Typography variant="caption">Location Type</Typography>
                    </p>
                    <p>{this.props.location?.type}</p>
                </div>
                <div className={classes.column}>
                    <p>
                        <Typography variant="caption">Country</Typography>
                    </p>
                    <p>{this.props.location?.country}</p>
                </div>
                <div className={classes.column}>
                    <p>
                        <Typography variant="caption">Admin area 1</Typography>
                    </p>
                    <p>
                        {this.props.location?.adminArea1
                            ? this.props.location.adminArea1
                            : 'N/A'}
                    </p>
                </div>
                <div className={classes.column}>
                    <p>
                        <Typography variant="caption">Admin area 2</Typography>
                    </p>
                    <p>
                        {this.props.location?.adminArea2
                            ? this.props.location.adminArea2
                            : 'N/A'}
                    </p>
                </div>
                <div className={classes.column}>
                    <p>
                        <Typography variant="caption">Latitude</Typography>
                    </p>
                    <p>
                        {this.props.location?.latitude
                            ? this.props.location.latitude.toFixed(4)
                            : '-'}
                    </p>
                </div>
                <div className={classes.column}>
                    <p>
                        <Typography variant="caption">Longitude</Typography>
                    </p>
                    <p>
                        {this.props.location?.longitude
                            ? this.props.location.longitude.toFixed(4)
                            : '-'}
                    </p>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Profile);