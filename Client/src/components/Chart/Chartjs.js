import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { getallbooking } from "../../apis/booking";

const Chartjs = () => {
  const [bookings, setBookings] = useState([]);
  const [chartInstance, setChartInstance] = useState(null); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getallbooking(); // Gọi hàm API

        if (data.success) {
          setBookings(data.bookings);
        } else {
          console.error("Failed to fetch bookings:", data.mes);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const bookingData = bookings.reduce((acc, booking) => {
      const date = booking.date.split("T")[0]; 
      const totalPrice = booking.totalPrice;

      if (acc[date]) {
        acc[date] += totalPrice;
      } else {
        acc[date] = totalPrice;
      }

      return acc;
    }, {});

    const dates = Object.keys(bookingData);
    const totalPrices = Object.values(bookingData);

    if (chartInstance) {
      chartInstance.destroy(); 
    }

    if (dates.length && totalPrices.length) {
      const ctx = document.getElementById('bookingChart').getContext('2d');
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Total Price by Date',
              data: totalPrices,
              backgroundColor: 'rgb(186,176,246)',
              borderColor: 'rgb(186, 176, 246)',
              borderWidth: 2,
              barThickness: 20, 
              maxBarThickness: 30, 
              borderRadius: 10, 
            }
          ]
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false 
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false 
              }
            }
          },
          plugins: {
            legend: {
              display: true 
            }
          }
        }
      });

      setChartInstance(newChartInstance);
    }
  }, [bookings]);

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 mt-4 h-full'>
      <h1 className='text-[20px] mb-3'>Reward Stats</h1>
      <div className='flex items-center'>
        <canvas id="bookingChart"></canvas>
      </div>
    </div>
  );
};

export default Chartjs;
