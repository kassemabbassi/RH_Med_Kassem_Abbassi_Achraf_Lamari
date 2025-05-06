import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart = ({ data, label }) => {
  const [state, setState] = useState({
    series: [{ name: "Absence(s)", data }],
    options: {
      chart: {
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.5,
        },
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: { enabled: true },
      stroke: { curve: "smooth" },
      grid: {
        borderColor: "#e7e7e7",
        row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
      },
      markers: { size: 1 },
      xaxis: { categories: label, title: { text: "Dates" } },
      yaxis: { title: { text: "Absences" }, min: 0 },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      series: [{ name: "Absence(s)", data }],
      options: {
        ...prevState.options,
        xaxis: { ...prevState.options.xaxis, categories: label },
      },
    }));
  }, [data, label]); 

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default LineChart;
