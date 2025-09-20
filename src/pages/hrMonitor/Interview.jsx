import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import { DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { color, height } from '@mui/system';

const Interview = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };

    const [startDate] = useState("2025-11-01");
    const [events, setEvents] = useState([]);
    const [calendar, setCalendar] = useState(null);

    useEffect(() => {
        const events = [
            {
                id: 1,
                text: "Event 1",
                start: "2025-11-12",
                end: "2025-11-12",
                participants: 2,
                height:400
            },
            {
                id: 2,
                text: "Event 2",
                start: "2025-11-01",
                end: "2025-11-01",
                backColor: "#6aa84f",
                participants: 1,
            },
            {
                id: 3,
                text: "Event 3",
                start: "2025-11-09",
                end: "2025-11-09",
                backColor: "#f1c232",
                participants: 3,
            },
            {
                id: 4,
                text: "Event 4",
                start: "2025-11-10",
                end: "2025-11-10",
                backColor: "#cc4125",
                participants: 4,
            },
        ];
        setEvents(events);
    }, []);



    return (
        <>
            <Button
                onClick={toggleDrawer(true)}
                sx={{ float: "right", backgroundColor: "#4B0082", color: "#fff", fontSize: 12, fontWeight: "bold", mx: 14 }}
            >
                Interview Schedule
            </Button>
            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)} sx={{}}>
                <Box
                    sx={{ width: 500, p: 2, my: 10 }}
                    role="presentation"
                >
                    <Typography variant="h6" gutterBottom sx={{ mx: 10 }}>
                        Interview Schedule Form
                    </Typography>
                    <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            label="Candidate Name"
                            variant="outlined"
                            sx={{ width: 350 }}
                            margin="normal"
                        />
                        <TextField
                            label="Interview Date"
                            variant="outlined"
                            sx={{ width: 350 }}
                            margin="normal"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Interview Time"
                            variant="outlined"
                            sx={{ width: 350 }}
                            margin="normal"
                            type="time"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Interviewer Name"
                            variant="outlined"
                            sx={{ width: 350 }}
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, width: 200 }}
                            type="submit"
                        >
                            Schedule Interview
                        </Button>
                    </form>
                </Box>
            </Drawer>
            <Box sx={{ display: 'flex', justifyContent: "center", m: 5, px: 5, flexWrap: 'wrap' }}>
                <Card sx={{ width: '300px', height: 300, mx: 2, my: 2 }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Word of the Day
                        </Typography>
                        <Typography variant="h5" component="div">
                            fghjkl
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                        <Typography variant="body2">
                            well meaning and kindly.
                            <br />
                            {'"a benevolent smile"'}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>

                {/* <Card sx={{ width: '600px', height: '400px', mx: 2, my: 2, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Interview Schedule
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                            Click on an event to view details or reschedule.
                        </Typography>
                        <DayPilotCalendar

                            events={events}
                            startDate={"2024-09-25"}
                            viewType={"Day"}
                            // onEventClick={handleEventClick}
                            // eventStyle={eventStyle}
                            headerDateFormat={"dddd, MMMM D"}
                        />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                        <Button size="small" onClick={toggleDrawer(true)}>Schedule New Interview</Button>
                        <Button size="small" variant="outlined" color="primary">Refresh</Button>
                    </CardActions>
                </Card> */}

                <Card sx={{ width: '700px', height: '800px', my: 2, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Interview Schedule
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                            Click on an event to view details or reschedule.
                        </Typography>
                        <DayPilotMonth
                            startDate={startDate}
                            events={events}
                            controlRef={setCalendar}

                        />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                        <Button size="small" variant="outlined" color="primary" onClick={() => {/* Refresh logic */ }}>
                            Refresh
                        </Button>
                    </CardActions>
                </Card>


                <Card sx={{ width: '400px', height: 340, mx: 2, my: 2 }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Word of the Day
                        </Typography>
                        <Typography variant="h5" component="div">
                            fghjkl
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                        <Typography variant="body2">
                            well meaning and kindly.
                            <br />
                            {'"a benevolent smile"'}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    );
};

export default Interview;





// import React, { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Drawer from '@mui/material/Drawer';
// import TextField from '@mui/material/TextField';
// import { DayPilotMonth } from "@daypilot/daypilot-lite-react";

// const Interview = () => {
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const toggleDrawer = (open) => () => {
//         setIsDrawerOpen(open);
//     };

//     const [startDate] = useState("2025-11-01");
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         setEvents([
//             { id: 1, text: "Event 1", start: "2025-11-08", end: "2025-11-09" },
//             { id: 2, text: "Event 2", start: "2025-11-08", end: "2025-11-09" },
//             { id: 3, text: "Event 3", start: "2025-11-08", end: "2025-11-08" },
//             { id: 4, text: "Event 4", start: "2025-11-15", end: "2025-11-16" },
//             { id: 5, text: "Event 5", start: "2025-11-15", end: "2025-11-16" },
//         ]);
//     }, []);

//     return (
//         <>
//             <Box sx={{m:10}}>
//                 <Button
//                     onClick={toggleDrawer(true)}
//                     sx={{ float: "right", backgroundColor: "#4B0082", color: "#fff", fontSize: 12, fontWeight: "bold" }}
//                 >
//                     Interview Schedule
//                 </Button>
//                 <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
//                     <Box sx={{ width: 350, p: 2 }} role="presentation">
//                         <Typography variant="h6" gutterBottom>
//                             Interview Schedule Form
//                         </Typography>
//                         <form>
//                             <TextField label="Candidate Name" variant="outlined" fullWidth margin="normal" />
//                             <TextField
//                                 label="Interview Date"
//                                 variant="outlined"
//                                 fullWidth
//                                 margin="normal"
//                                 type="date"
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                             <TextField
//                                 label="Interview Time"
//                                 variant="outlined"
//                                 fullWidth
//                                 margin="normal"
//                                 type="time"
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                             <TextField label="Interviewer Name" variant="outlined" fullWidth margin="normal" />
//                             <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth type="submit">
//                                 Schedule Interview
//                             </Button>
//                         </form>
//                     </Box>
//                 </Drawer>

//                 <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'flex-start', // Align to the left
//                     flexWrap: 'wrap',
//                     gap: 2 // Reduce gap between cards
//                 }}>
//                     {/* First Card */}
//                     <Card sx={{ height: 300, width: 300 }}>
//                         <CardContent>
//                             <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
//                                 Word of the Day
//                             </Typography>
//                             <Typography variant="h5" component="div">fghjkl</Typography>
//                             <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
//                             <Typography variant="body2">
//                                 well meaning and kindly.
//                                 <br />
//                                 {'"a benevolent smile"'}
//                             </Typography>
//                         </CardContent>
//                         <CardActions>
//                             <Button size="small">Learn More</Button>
//                         </CardActions>
//                     </Card>

//                     {/* Interview Schedule Card */}
//                     <Card sx={{ height: 800, width: 800 }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
//                                 Interview Schedule
//                             </Typography>
//                             <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
//                                 Click on an event to view details or reschedule.
//                             </Typography>
//                             <DayPilotMonth
//                                 startDate={startDate}
//                                 events={events}
//                                 eventStyle={(args) => ({
//                                     backgroundColor: args.data.id % 2 === 0 ? "#4CAF50" : "#2196F3",
//                                     color: "#fff",
//                                     borderRadius: "5px",
//                                     padding: "5px",
//                                     transition: "background-color 0.3s ease",
//                                     '&:hover': {
//                                         backgroundColor: args.data.id % 2 === 0 ? "#45A049" : "#1976D2",
//                                         opacity: 0.9,
//                                     },
//                                 })}
//                                 tooltipText={(args) => `${args.data.text}<br/>${args.data.start.toLocaleString()} - ${args.data.end.toLocaleString()}`}
//                             />
//                         </CardContent>
//                         <CardActions sx={{ justifyContent: 'space-between' }}>
//                             <Button size="small" variant="outlined" color="primary" onClick={() => { /* Refresh logic */ }}>
//                                 Refresh
//                             </Button>
//                         </CardActions>
//                     </Card>

//                     {/* Another Card */}
//                     <Card sx={{ height: 340, width: 300 }}>
//                         <CardContent>
//                             <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
//                                 Word of the Day
//                             </Typography>
//                             <Typography variant="h5" component="div">fghjkl</Typography>
//                             <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
//                             <Typography variant="body2">
//                                 well meaning and kindly.
//                                 <br />
//                                 {'"a benevolent smile"'}
//                             </Typography>
//                         </CardContent>
//                         <CardActions>
//                             <Button size="small">Learn More</Button>
//                         </CardActions>
//                     </Card>
//                 </Box>
//             </Box>
//         </>
//     );
// };

// export default Interview;


