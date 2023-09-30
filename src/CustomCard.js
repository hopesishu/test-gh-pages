import React from 'react';
import { 
    Box,
    Card,
    CardContent,
    Typography,
    Paper,
    Stack,
} from '@mui/material';

const CustomCard = ( itemObject ) => {

    // console.log(itemObject);

    return (
        <Card variant="outlined" style={{ maxWidth: 400 }}>
            <Box sx={{ display: "flex", flexDirection: "row", maxWidth: 400 }}>
                <Stack direction="column" padding={1} maxWidth={150} minWidth={150} spacing={1}>
                    <Paper style={{ padding: 1, justifyContent: "center", display: "flex" }} >
                        <img 
                            src={itemObject.data.ImageUrl}
                            alt={itemObject.data.Name}
                            height={60}
                            width={60}
                        />
                    </Paper>
                    <Typography variant="h6" textAlign="center">
                        {itemObject.data.DisplayedName}
                    </Typography>
                </Stack>
                <CardContent style={{ padding: 8 }}>
                    <Typography variant="body1">
                        Level: {itemObject.data.Level}<br/>
                        Max Price: {itemObject.data.MaxPrice}<br/>
                        Per Boat Crate: {itemObject.data.PerBoatCrate}<br/>
                        Source: {itemObject.data.Source}<br/>
                        Time: {itemObject.data.Time}<br/>
                        Xp: {itemObject.data.Xp}<br/>
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    );
}

export default CustomCard;