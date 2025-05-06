import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({ data, lab, name, title }) => {
  const [state, setState] = useState({
    series: [{ name, data }], 
    options: {
      chart: { type: 'bar' },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '50%',
        }
      },
      dataLabels: { enabled: true },
      stroke: { width: 2 },
      grid: { row: { colors: ['#fff', '#f2f2f2'] } },
      xaxis: { categories: lab },
      yaxis: { title: { text: title, floating: true } },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    }
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      series: [{ name: prevState.series[0].name, data }], // ✅ Corrected: Ensures `name` stays the same
      options: { ...prevState.options, xaxis: { categories: lab } }
    }));
  }, [data, lab]);

  return (
    <div>
      <div id="chart">
        {typeof window !== 'undefined' && (
          <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        )}
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default BarChart;
