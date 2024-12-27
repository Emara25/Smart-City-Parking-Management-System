import { use, useState, useEffect } from 'react';
import { Grid, Container, Paper } from '@mui/material';
import ParkingLotList from './ParkingLotList';
import SpotList from './SpotList';
import SpotDetails from './SpotDetails';
import NewParkingLotForm from './NewParkingLotForm';

const mockReservations = [
    {
      id: 1,
      date: '2024-12-01', // Format: YYYY-MM-DD
      startTime: '8', // 8 AM
      duration: 2, // 2 hours
    },
    {
      id: 2,
      date: '2024-12-01',
      startTime: '2024-12-01T14:00:00', // 2 PM
      duration: 3, // 3 hours
    },
    {
      id: 3,
      date: '2024-12-02',
      startTime: '2024-12-02T10:00:00', // 10 AM
      duration: 1, // 1 hour
    },
    {
      id: 4,
      date: '2024-12-03',
      startTime: '2024-12-03T15:00:00', // 3 PM
      duration: 4, // 4 hours
    },
    {
      id: 5,
      date: '2024-12-03',
      startTime: '2024-12-03T09:00:00', // 9 AM
      duration: 1.5, // 1.5 hours
    },
  ];
const mockParkingLots = [
  {
    name: "Downtown Parking2",
    longitude: -70,
    latitude: 52,
    capacity: 30,
    original_price: 15,
    dynamic_weight: 1,
    disabled_discount: 0.5,
    ev_fees: 0.1,
    spots: Array(30).fill().map((_, i) => ({
      id: i,
      type: i < 10 ? 'disabled' : i < 20 ? 'ev' : 'regular',
      status: i < 10 ? 'available' : i < 20 ? 'reserved' : 'occupied',
      reservations: mockReservations
    }))
  },
  {
    name: "Sporting Parking2",
    longitude: -70,
    latitude: 50.7128,
    capacity: 100,
    original_price: 15,
    dynamic_weight: 1,
    disabled_discount: 0.5,
    ev_fees: 0.3,
    spots: Array(2000).fill().map((_, i) => ({
      id: i,
      type: i < 5 ? 'disabled' : i < 15 ? 'ev' : 'regular',
      status: i < 10 ? 'available' : i < 20 ? 'reserved' : 'occupied',
      reservations: []
    }))
  },
  {
    name: "Sidi Gaber Parking2",
    longitude: -74.006,
    latitude: 40.7128,
    capacity: 10,
    original_price: 15,
    dynamic_weight: 1,
    disabled_discount: 0.5,
    ev_fees: 0.1,
    spots: Array(10).fill().map((_, i) => ({
      id: i,
      type: i < 7 ? 'regular' : i < 8 ? 'disabled' : 'ev',
      status: i < 5 ? 'available' : i < 7 ? 'reserved' : 'occupied',
      reservations: []
    }))
  },
  
];


function ManagerHome() {

  useEffect(() => {
    // Fetch parking lots from the server
    const url = 'localhost:8080/manager/parkinglots';
    fetch(url, {
        method: 'GET', // Explicitly specify the request method
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setParkingLots(data))
        .catch((error) => console.error('Error fetching parking lots:', error));      
  });

  const [parkingLots, setParkingLots] = useState(mockParkingLots);
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isSpotDetailsOpen, setIsSpotDetailsOpen] = useState(false);

  const handleLotSelect = (lot) => {
    setSelectedLot(lot);
  };

  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
    setIsSpotDetailsOpen(true);
  };

  const handleNewLotSubmit = (newLot) => {
    setParkingLots([...parkingLots, newLot]);
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              maxHeight: 400, // Adjust the height limit as needed
              overflowY: 'auto', // Enable vertical scrolling
            }}
          >
            <ParkingLotList
              parkingLots={parkingLots}
              onLotSelect={handleLotSelect}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
            <NewParkingLotForm onSubmit={handleNewLotSubmit} />
        </Grid>
        {selectedLot && (
          <Grid item xs={12}>
            <Paper 
              sx={{
                p: 2,
                maxHeight: 770, 
                overflowY: 'auto',
              }}
            >
              <h2>{selectedLot.name} - Parking Spots</h2>
              <SpotList
                spots={selectedLot.spots}
                onSpotSelect={handleSpotSelect}
              />
            </Paper>
          </Grid>
        )}
      </Grid>

      <SpotDetails
        lot={selectedLot}
        spot={selectedSpot}
        open={isSpotDetailsOpen}
        onClose={() => setIsSpotDetailsOpen(false)}
        onReserve={()=>setIsSpotDetailsOpen(false)}
        isDriver={false}
      />

    </Container>
  );
}

export default ManagerHome;